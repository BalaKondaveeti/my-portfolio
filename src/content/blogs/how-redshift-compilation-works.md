---
title: "Easy: How Redshift Compiles Your SQL into Machine Code"
date: "2026-03-16"
tags: ["Database Internals", "LLVM", "C++", "Redshift", "Query Compilation"]
description: "A plain-English walkthrough of how Amazon Redshift turns a SQL query into a native executable, what happens at each stage, and which other databases do something similar."
---

# How Redshift Compiles Your SQL into Machine Code

Most people think of a database as something that _interprets_ your query — reads the SQL, figures out a plan, and starts scanning rows. That's how things worked for a long time. Redshift does something fundamentally different: it **compiles your query into native machine code** and runs that instead.

Here's what that means in plain English, and why it matters.

---

## The Old Way: Interpretation

Imagine a query like:

```sql
SELECT SUM(price * quantity)
FROM orders
WHERE region = 'us-west-2';
```

A classic interpreter would:

1. Parse this into an operator tree (Scan → Filter → Project → Aggregate)
2. At runtime, walk the tree node by node
3. For each row, call a `filter()` function, then a `multiply()` function, then an `aggregate()` function — via **virtual function calls**

Every one of those calls is an indirect jump through a pointer. The CPU has no idea where it's going until it gets there. Branch predictor misses. Instruction cache misses. For a billion-row table, this overhead adds up to seconds.

---

## The Redshift Way: Code Generation

Redshift takes a different path. Instead of _executing_ the operator tree, it **generates C++ source code** that represents your specific query, compiles it into a native binary, and runs that binary directly.

Here's roughly what that generated C++ looks like (simplified):

```cpp
// Generated for: SELECT SUM(price * quantity) FROM orders WHERE region = 'us-west-2'

void execute(ColumnBlock* price_col, ColumnBlock* qty_col,
             ColumnBlock* region_col, AggState* agg) {
    for (int i = 0; i < BLOCK_SIZE; i++) {
        if (region_col->data[i] == HASH_US_WEST_2) {
            agg->sum += price_col->data[i] * qty_col->data[i];
        }
    }
}
```

No virtual function calls. No tree traversal. Just a tight loop the CPU can pipeline, vectorize, and predict perfectly.

---

## The Compilation Pipeline

Here's what actually happens end-to-end when you hit execute on a query:

### 1. Parse & Plan

SQL is parsed into an AST, then the query optimizer produces a logical plan (same as any database).

### 2. Code Generation (C++ Emit)

The plan is walked and translated into C++ source. Each operator in the plan becomes inline code in the generated function. Predicates, projections, and aggregations are fused together — no function boundary between them.

### 3. LLVM IR Compilation

The generated C++ is handed to **Clang** (the LLVM C++ compiler), which:

- Parses C++ → LLVM IR (an intermediate representation, like assembly but portable)
- Runs LLVM optimization passes (inlining, loop unrolling, vectorization)
- Emits native machine code (`.o` object file) for the target CPU

```
C++ source
    ↓  Clang frontend
LLVM IR
    ↓  LLVM optimizer (O2 passes)
    ↓  LLVM backend
x86-64 machine code (.o)
```

### 4. Linking & Loading

The `.o` file is linked into a shared library (`.so`) and dynamically loaded into the query executor. The function pointer is grabbed and called directly.

### 5. Cache

The compiled binary is stored — keyed on a hash of the query plan, schema version, and cluster configuration. Identical queries skip all of the above and run the cached binary instantly.

---

## Why This Makes Cold Starts So Painful

The compilation step (steps 2–4 above) takes **real time** — Clang is doing actual compiler work. On a complex query, that can be 30+ seconds on a cold cluster.

The fix isn't to skip compilation. It's to move compilation **off the critical path**:

- **Async pre-compilation:** Start compiling as soon as the plan is ready, before data scanning begins. Scan and compile in parallel.
- **Remote compilation service:** Farm out the Clang work to a dedicated fleet (Compilation-as-a-Service on Fargate) instead of blocking the query node. The query node gets the `.so` back when it's needed.
- **Aggressive caching:** The cache hit rate for common query shapes is high. Most production queries never pay the compile cost after the first run.

With those three in place, P90 cold latency dropped from **35 seconds to 150ms**.

---

## What About Precompiled Headers?

Redshift's generated C++ `#include`s a lot of shared headers — type definitions, runtime helpers, SIMD utilities. Building those headers from scratch on every compilation is wasteful.

**Precompiled headers (PCH)** let the compiler build those headers once, save the result to a binary blob, and reuse it. But if the PCH blob is too large (from accumulating every utility ever added to the codebase), loading it becomes its own bottleneck — and any change to any included file invalidates the whole thing.

The fix: **PImpl idiom** (Pointer to Implementation). Move implementation details behind opaque pointers so headers only declare interfaces, not implementations. This keeps headers small, PCH blobs lean, and compile-time failures rare.

---

## Which Other Databases Do This?

Redshift isn't alone. Query compilation is now standard in high-performance analytical databases:

| Database                        | Approach                                                                                        |
| ------------------------------- | ----------------------------------------------------------------------------------------------- |
| **PostgreSQL (with JIT)**       | LLVM IR directly (no C++ codegen step) — compiles expression evaluation and tuple deforming     |
| **DuckDB**                      | LLVM-based JIT, tight integration with vectorized execution                                     |
| **HyPer / Umbra**               | Full query-to-machine-code compilation, pioneered the "operator fusion" technique Redshift uses |
| **Spark (Whole-Stage Codegen)** | Generates Java bytecode (JVM JIT then handles the rest) — same idea, different target           |
| **ClickHouse**                  | LLVM-based runtime codegen for filter/aggregate expressions                                     |
| **Snowflake**                   | Vectorized execution with LLVM codegen for expressions (details less public)                    |
| **VoltDB**                      | Compiles stored procedures ahead of time for OLTP                                               |

The general pattern splits into two camps:

**Full compilation (Redshift, HyPer, Umbra):** Entire query pipelines compiled into one function. Maximum performance, higher compilation cost. Best for repeat workloads.

**Expression-level JIT (PostgreSQL, ClickHouse):** Only the hot inner expressions are compiled. Lower compile cost, some interpretation overhead remains. Better for one-shot queries.

---

## The Trade-off in Plain English

Compilation takes time upfront. Interpretation is instant but slow per row. The crossover point depends on how many rows you're scanning:

- **< 100k rows:** Interpretation wins. Compile cost outweighs benefit.
- **> 1M rows:** Compilation wins decisively. The tight native loop pays for itself many times over.

Redshift is built for the second case — petabyte-scale analytics where queries touch hundreds of millions of rows. At that scale, compilation isn't an optimization. It's a necessity.

---

## Summary

1. SQL → logical plan (standard)
2. Logical plan → generated C++ source (Redshift-specific)
3. C++ → LLVM IR → x86 native binary via Clang
4. Binary cached, linked, and called directly
5. Compilation moved off the critical path via parallelism + caching + remote compilation fleet

The result: your SQL effectively _becomes_ a hand-optimized C program tuned for your exact query, schema, and data distribution. That's why the numbers look like magic.
