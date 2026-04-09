---
title: "How I Cut Redshift P90 Cold Query Latency by 99.6% with LLVM"
date: "2025-03-15"
tags: ["LLVM", "C++", "Database Internals", "AWS Redshift"]
description: "A deep dive into building an LLVM-based SQL query compilation engine that dropped P90 latency from 35s to 150ms and recovered $3.3M+ in revenue."
---

# How I Cut Redshift P90 Cold Query Latency by 99.6% with LLVM

The problem was deceptively simple on the surface: cold query startup latency in Amazon Redshift was hitting **35 seconds** at P90. For interactive analytics, that's a death sentence.

## The Root Cause

Redshift's query executor interprets a high-level operator tree at runtime. Each operator dispatches through a virtual function table — flexible, but the branch mispredictions and instruction cache thrash add up brutally at scale.

The real killer? **Cold starts.** The first query after a cluster spin-up had to warm the JIT cache from scratch, serializing all the overhead into a single user-visible delay.

## Enter LLVM IR

The idea: instead of interpreting the operator tree, **compile it to native machine code** using LLVM IR at query planning time.

```cpp
// Simplified: emit a tight scan loop for a column predicate
llvm::Value* emitColumnScan(
    llvm::IRBuilder<>& builder,
    ColumnDescriptor col,
    Predicate pred
) {
    auto* loop = builder.CreateBr(loopBlock);
    // vectorized comparison emitted directly into the loop body
    return builder.CreateICmpSLT(colVal, pred.value);
}
```

The compiled plan gets cached. Subsequent identical queries skip compilation entirely and run the cached native binary.

## Compilation-as-a-Service

The second insight: **compilation is embarrassingly parallelizable**. I architected a CaaS layer on **AWS Fargate** that accepts query plan segments and returns compiled `.o` blobs, processing **50k+ segments/second across 34 regions**.

This decoupled compilation latency from query execution latency entirely.

## Results

| Metric | Before | After |
|--------|--------|-------|
| P90 cold query latency | 35s | 150ms |
| Latency reduction | — | **99.6%** |
| Compilation failures | baseline | **−83%** |
| Revenue recovered | — | **$3.3M+** |

## Lessons

1. **Profile before optimizing.** The virtual dispatch overhead was invisible until we ran `perf record` on a cold cluster.
2. **Cache invalidation is the hard part.** Plan caches must be invalidated on schema changes, statistics updates, and cluster reshapes. We used a versioned cache key scheme.
3. **PImpl idiom saves compilation time.** Refactoring bloated precompiled headers to use PImpl cut PCH sizes dramatically, reducing fleet-wide compilation failures by 83%.

The combination of LLVM-native code generation + distributed compilation + aggressive caching is what takes you from 35 seconds to 150 milliseconds.
