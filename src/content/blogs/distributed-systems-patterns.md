---
title: "5 Distributed Systems Patterns I Use Daily at AWS Scale"
date: "2025-01-20"
tags: ["Distributed Systems", "AWS", "Architecture", "Fault Tolerance"]
description: "Practical patterns for building fault-tolerant, high-throughput distributed systems — from circuit breakers to shard-aware routing."
---

# 5 Distributed Systems Patterns I Use Daily at AWS Scale

Working on AWS Redshift and Amazon Robotics has forced me to internalize certain distributed systems patterns. Not as academic exercises — but as survival tools when your system is serving millions of queries across 34 regions.

## 1. Shard-Aware Client Routing

Naively round-robining requests to a sharded backend is a latency trap. If your client doesn't know which shard owns a key, you pay a fanout cost on every miss.

**Solution:** Embed a consistent hash ring in the client. The client computes the shard locally and routes directly, eliminating the coordinator hop for 95%+ of requests.

## 2. Circuit Breakers Over Infinite Retries

When a dependency goes slow (not down), naive retry loops amplify load and cause cascading failure. A circuit breaker opens after a threshold of failures and fast-fails subsequent calls.

```python
class CircuitBreaker:
    def __init__(self, threshold=5, timeout=30):
        self.failures = 0
        self.state = "CLOSED"
        self.timeout = timeout

    def call(self, fn, *args):
        if self.state == "OPEN":
            raise Exception("Circuit open")
        try:
            result = fn(*args)
            self.failures = 0
            return result
        except Exception:
            self.failures += 1
            if self.failures >= self.threshold:
                self.state = "OPEN"
            raise
```

## 3. Backpressure via Token Buckets

At 50k+ segments/sec, you need to shed load gracefully. A token bucket lets you set a precise throughput ceiling and reject excess traffic before it queues up and causes head-of-line blocking.

## 4. Two-Phase Commit Avoidance

2PC is a distributed deadlock waiting to happen. Wherever possible, design for **sagas** instead: a sequence of local transactions with compensating rollbacks. For Robotics simulation state, this eliminated the race conditions that 2PC would have introduced.

## 5. Deterministic Simulation Testing

Before shipping changes to fleet, we run deterministic simulations that replay production traffic patterns with injected faults. This caught 3 critical race conditions before they ever reached production.

---

The common thread: **design for failure at the outset**. Every component you write will fail. The question is whether your system degrades gracefully or catastrophically.
