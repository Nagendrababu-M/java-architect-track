# Phase 1 — Advanced Java (Weeks 1–3, Days 1–21 + 7a, 7b)

> **Goal:** Master the JVM as a runtime, not just a language. Understand memory, GC, modern Java language features, concurrency, and the framework internals that shape every architectural decision in production Java.

---

## Week 1 — JVM Internals, GC & Java Advanced (Days 1–7, 7a, 7b)

### Day 1 — Stack vs Heap Fundamentals ✅
- **Core concepts:** JVM memory regions, stack vs heap, primitives vs references, frame lifecycle
- **Architect lens:** Each thread = one stack; thread count × stack size = capacity ceiling
- **Interview signal:** "What's the difference between StackOverflowError and OutOfMemoryError?"
- **Challenge:** Identify where each piece of data lives in a code snippet
- **Resources:**
  - Oracle JVM Spec, Chapter 2 (search: "JVM Specification runtime data areas")
  - "Understanding the JVM" — Jon Rose, JavaOne (YouTube)

### Day 2 — Static, Instance & Metaspace ✅
- **Core concepts:** Static vs instance fields, class loading, Metaspace, where references vs objects live
- **Architect lens:** Static collections = silent memory leaks. Metaspace tuning matters for microservices with many classes.
- **Interview signal:** "Why did PermGen get replaced by Metaspace?"
- **Challenge:** 7-line code analysis covering all 3 memory regions
- **Resources:**
  - JEP 122: Remove the Permanent Generation (search "JEP 122")
  - "Metaspace in OpenJDK 8" — Jon Masamitsu blog

### Day 3 — GC Fundamentals ✅
- **Core concepts:** Reachability, GC roots, mark-and-sweep, copying, generational hypothesis, STW pauses, Minor/Major/Full GC
- **Architect lens:** GC is the #1 source of p99 latency tail in JVM services
- **Interview signal:** "Walk me through what happens during a Minor GC"
- **Challenge:** Diagnose a production latency spike scenario
- **Resources:**
  - "Garbage Collection Algorithms" — Aleksey Shipilëv (YouTube, Devoxx talk)
  - *Java Performance* by Scott Oaks — Chapters 5-6

### Day 4 — GC Algorithms Deep Dive + Tuning + Profiling
- **Core concepts:**
  - Algorithm comparison: Serial, Parallel, CMS (deprecated), G1, ZGC, Shenandoah
  - When to pick which: throughput vs latency trade-off
  - Key JVM flags: `-Xms`, `-Xmx`, `-XX:+UseG1GC`, `-XX:MaxGCPauseMillis`, `-XX:+UseZGC`
  - Reading GC logs: `-Xlog:gc*`
  - JFR (Java Flight Recorder) and async-profiler basics
  - Flame graphs interpretation
- **Architect lens:**
  - For options/HFT workloads: ZGC for sub-1ms pauses during market hours
  - Sizing Young Gen to control Minor GC frequency under high-throughput loads
- **Interview signal:** "Service is doing Full GC every 2 minutes — diagnose."
- **Challenge:** Read a GC log, identify the problem, propose tuning flags
- **Resources:**
  - "Shenandoah & ZGC: Quest for Render-Quality Java GC" — Roman Kennke (YouTube)
  - "Understanding Java Garbage Collection" — Gil Tene, InfoQ talk (must-watch)
  - JEP 333: ZGC (search "JEP 333")
  - async-profiler GitHub: github.com/async-profiler/async-profiler
  - Brendan Gregg's flame graphs: brendangregg.com/flamegraphs.html

### Day 5 — Java Memory Model (JMM) & happens-before
- **Core concepts:**
  - The JMM: why CPU reordering and caching make concurrent code hard
  - happens-before relationship
  - `volatile` — what it actually guarantees (visibility + ordering, NOT atomicity)
  - `final` field semantics and safe publication
  - Double-checked locking and why it was broken pre-Java 5
- **Architect lens:** Understanding JMM = understanding why "it works on my machine" lies
- **Interview signal:** "Is this code thread-safe?" with subtle volatile/synchronized traps
- **Challenge:** Spot 3 race conditions in a Singleton implementation
- **Resources:**
  - "Java Memory Model Pragmatics" — Aleksey Shipilëv (canonical doc, search the title)
  - "Close Encounters of the Java Memory Model Kind" — Shipilëv (YouTube)
  - *Java Concurrency in Practice* — Brian Goetz, Chapter 16

### Day 6 — Profiling in Anger: JFR, async-profiler, flame graphs
- **Core concepts:**
  - Hands-on JFR: starting a recording, analyzing in JDK Mission Control
  - async-profiler: CPU profiling without safepoint bias
  - Reading flame graphs: width = time, stack = call depth
  - Identifying allocation hot paths
- **Architect lens:** Profiling is the diagnostic layer above metrics; learn to suspect before measuring
- **Interview signal:** "How would you find why this service is slow?"
- **Challenge:** Given a flame graph image, identify the bottleneck
- **Resources:**
  - "Profiling and tuning the JVM" — Marcus Hirt, JFR creator (YouTube)
  - async-profiler README walkthrough

### Day 7 — Week 1 Synthesis: Production Diagnosis
- **Format:** Integrated scenario challenge — no new concepts
- **Scenario:** A trading service is missing fills during market open. CPU normal, memory normal on average, but p99 spikes. Walk through diagnosis using everything from Days 1-6.
- **Deliverable:** Written diagnosis + tuning recommendation
- **Architect lens:** Synthesis is what separates Senior from Staff
- **Interview signal:** This IS the interview question pattern for Staff loops

### Day 7a — Java Advanced: Records, Sealed Classes, Pattern Matching & Modern APIs (Java 14–21)
- **Core concepts:**
  - **Records** (Java 16): immutable data carriers, compact constructors, custom accessors — replaces Lombok `@Value` in modern codebases
  - **Sealed classes + interfaces** (Java 17): `permits` keyword, exhaustive `switch`, modelling algebraic types and domain hierarchies cleanly
  - **Pattern matching `instanceof`** (Java 16): binding variables, type narrowing without explicit cast
  - **Pattern matching `switch`** (Java 21): arrow labels, `yield`, guarded patterns (`case String s when s.length() > 5`), exhaustiveness checking at compile time
  - **Deconstruction patterns**: record patterns (`case Point(int x, int y)`) and nested deconstruction
  - **Text blocks** (Java 15): multiline strings, indentation stripping, `\` line continuation, `\s` trailing-space preservation
  - **Structured Concurrency** (Java 21): `StructuredTaskScope.ShutdownOnFailure` / `ShutdownOnSuccess` — fork child tasks, auto-cancel on first failure; pairs with Virtual Threads
  - **Sequenced Collections** (Java 21): `SequencedCollection`, `SequencedSet`, `SequencedMap` — `reversed()`, `getFirst()`, `getLast()` added to collection hierarchy
  - **String templates** (Java 21 preview): interpolation processors, `STR.`, `FMT.`
  - **Migration patterns**: replacing inheritance hierarchies with sealed+record trees; replacing null checks with pattern switch
- **Architect lens:** Spring 3.x uses Records heavily for DTOs; sealed classes model API response variants cleanly; pattern matching eliminates visitor boilerplate; Structured Concurrency unlocks safer fan-out with virtual threads
- **Interview signal:** "Refactor this DTO to a Record" / "Model a Payment with subtypes using sealed classes and process with pattern switch"
- **Challenge:** Rewrite a traditional Payment class hierarchy using sealed classes + records + pattern matching switch; add a StructuredTaskScope fan-out that cancels on first failure
- **Resources:**
  - JEP 395 (Records), JEP 409 (Sealed Classes), JEP 441 (Pattern Matching switch), JEP 453 (Structured Concurrency), JEP 431 (Sequenced Collections)
  - "Java 21 New Features" — JDK 21 release notes and JEP index

### Day 7b — Streams & Functional Interfaces: Advanced Patterns & Internals
- **Core concepts:**
  - **Functional interface mechanics**: `@FunctionalInterface`, SAM types, 4 kinds of method references (static, instance-unbound, instance-bound, constructor), capture semantics (effectively-final rule), heap pollution with varargs
  - **Lambda desugaring via `invokedynamic`**: how the JVM avoids generating anonymous classes at compile time; LambdaMetafactory and the cost model
  - **Stream pipeline internals**: `Spliterator`-based lazy evaluation, encounter order, stateless vs stateful ops, short-circuit evaluation (`findFirst`, `anyMatch`), `ORDERED`/`SIZED`/`SUBSIZED`/`DISTINCT` characteristics
  - **Advanced collectors**:
    - `Collectors.teeing` (Java 12) — two downstream collectors merged by a merge function
    - Downstream collectors: `groupingBy` + `counting`, `mapping`, `filtering`, `collectingAndThen`
    - Custom `Collector<T,A,R>`: implementing supplier, accumulator, combiner, finisher, characteristics
  - **`flatMap` vs `mapMulti`** (Java 16): when `mapMulti` avoids boxing and intermediate stream allocation
  - **Parallel streams**: `ForkJoinPool.commonPool`, how spliterators split, when parallel hurts (stateful ops like `sorted`, ordered pipelines, small N, IO-bound)
  - **Gatherers API** (Java 22 preview): `window`, `fold`, `scan`, custom `Gatherer<T,A,R>` — stateful one-to-many transformations that were impossible with existing stream ops
  - **`Optional` deep-dive**: `flatMap`, `or()`, `ifPresentOrElse`, `stream()` bridge to Stream API; anti-patterns (Optional as field, Optional parameter, `isPresent()`+`get()` chains)
  - **Custom `Spliterator`**: implementing `tryAdvance`, `trySplit`, characteristic flags for parallel-capable infinite sources
  - **Real-world patterns**:
    - Pagination with `Stream.iterate` + `takeWhile` (Java 9)
    - Lazy DB cursor wrapping via Spliterator
    - Multi-level `groupingBy` for report generation
    - Collector fusion for single-pass aggregation
    - Reactive bridge: `Flux.fromStream` pitfalls, push-to-pull via `Stream.generate`
- **Architect lens:** Streams + lambdas are the backbone of modern Java data pipelines; misusing parallel streams is a common production anti-pattern; custom collectors replace entire utility libraries
- **Interview signal:** "Implement a custom collector" / "Why is this parallel stream slower than sequential?" / "What's wrong with this Optional chain?"
- **Challenge:** Write a custom `Collector` that builds a `Map<Category, TopN>` (top-N items per category) in a single pass; then rewrite a nested-loop report using `groupingBy` + `teeing`
- **Resources:**
  - "Streams in Java" — Stuart Marks (JavaOne, must-watch for internals)
  - JEP 461 (Stream Gatherers)
  - "Optional in Java" — Stuart Marks (YouTube — covers anti-patterns exhaustively)
  - *Modern Java in Action* — Urma, Fusco, Mycroft — Chapters 4-7

---

## Week 2 — Concurrency Mastery (Days 8–14)

### Day 8 — Threads, Thread Pools, ExecutorService
- **Core concepts:** Platform threads, OS thread mapping, `Thread.start()`, `ExecutorService` types (FixedThreadPool, CachedThreadPool, ScheduledExecutor), thread pool sizing formula (Little's Law)
- **Architect lens:** Wrong pool size = either thread starvation or context-switch tax
- **Interview signal:** "How would you size a thread pool for a CPU-bound vs IO-bound workload?"
- **Challenge:** Pick the right ExecutorService for 3 different workloads
- **Resources:**
  - *Java Concurrency in Practice*, Chapter 8
  - "Applying Back Pressure when Overloaded" — Fred Hebert (architecture pattern)

### Day 9 — Synchronization Primitives: synchronized, Lock, ReentrantLock
- **Core concepts:** `synchronized` blocks/methods, monitor pattern, `Lock` interface, `ReentrantLock`, `ReadWriteLock`, fair vs unfair locks, lock contention
- **Architect lens:** Lock contention silently kills throughput; finer-grained locks scale better
- **Interview signal:** "When would you prefer ReentrantLock over synchronized?"
- **Challenge:** Refactor a coarse-grained synchronized class to use ReadWriteLock
- **Resources:**
  - "Lock-Free Programming" — Herb Sutter (concept), search for Java equivalents

### Day 10 — Atomics, CAS, Lock-Free Patterns
- **Core concepts:** `AtomicInteger`/`AtomicReference`/`AtomicLong`, Compare-and-Swap (CAS), ABA problem, `LongAdder` vs `AtomicLong`, lock-free stack/queue intuition
- **Architect lens:** CAS-based structures avoid lock contention but trade off readability and have failure modes (ABA)
- **Interview signal:** "Implement a thread-safe counter without using synchronized"
- **Challenge:** Spot the ABA bug in a lock-free stack implementation
- **Resources:**
  - "Lock-free programming in Java" — Martin Thompson (search "Mechanical Sympathy LMAX Disruptor")
  - LMAX Disruptor pattern (canonical example for HFT)

### Day 11 — CompletableFuture & Async Composition
- **Core concepts:** `CompletableFuture` API, `thenApply`/`thenCompose`/`thenCombine`, exception handling with `exceptionally`/`handle`, `allOf`/`anyOf`, custom executors
- **Architect lens:** Composable async = the modern reactive backbone before Reactor
- **Interview signal:** "Chain 3 async API calls where the second depends on the first"
- **Challenge:** Refactor a callback hell example into clean CompletableFuture chain
- **Resources:**
  - "CompletableFuture in Action" — Tomasz Nurkiewicz (YouTube)

### Day 12 — Virtual Threads (Project Loom)
- **Core concepts:** Why platform threads don't scale (1MB stack each, OS scheduler limits), virtual threads as M:N scheduling on carrier threads, `Thread.ofVirtual()`, pinning issues, when virtual threads don't help (CPU-bound, synchronized blocks)
- **Architect lens:** Virtual threads change microservice design — synchronous code can now scale like async
- **Interview signal:** "When would virtual threads NOT help you?"
- **Challenge:** Convert a Spring Boot endpoint to virtual threads and reason about throughput change
- **Resources:**
  - JEP 444: Virtual Threads (search "JEP 444")
  - "Virtual Threads" — Ron Pressler (project lead, YouTube Devoxx talk — essential viewing)

### Day 13 — Concurrent Collections & Producer-Consumer Patterns
- **Core concepts:** `ConcurrentHashMap` (internals: striping, treeification), `CopyOnWriteArrayList`, `BlockingQueue` variants, producer-consumer pattern, classic Disruptor mention
- **Architect lens:** Picking the right concurrent collection = order-of-magnitude perf difference
- **Interview signal:** "Why does ConcurrentHashMap not use a single lock?"
- **Challenge:** Implement a bounded producer-consumer with `ArrayBlockingQueue`
- **Resources:**
  - JDK source code of `ConcurrentHashMap` (read the comments)

### Day 14 — Week 2 Synthesis: Design a Rate Limiter
- **Format:** LLD-style design exercise applying concurrency knowledge
- **Scenario:** Design a thread-safe distributed rate limiter (single-node first, then hint at distributed). Cover token bucket, leaky bucket, sliding window.
- **Architect lens:** A rate limiter is a microcosm of concurrency design — every primitive shows up
- **Interview signal:** Frequent FAANG LLD question
- **Deliverable:** Java implementation + trade-off discussion
- **Resources:**
  - Stripe Engineering blog: "Scaling your API with rate limiters"

---

## Week 3 — Spring Boot Internals & Reactive Programming (Days 15–21)

### Day 15 — Spring Boot Auto-Configuration: How the Magic Works
- **Core concepts:** `@SpringBootApplication` breakdown, `@EnableAutoConfiguration`, `spring.factories` → `AutoConfiguration.imports`, conditional beans (`@ConditionalOnClass`, `@ConditionalOnMissingBean`), the `META-INF` machinery
- **Architect lens:** Understanding auto-config = ability to debug "why isn't my bean injected"
- **Interview signal:** "What happens at startup when Spring Boot bootstraps?"
- **Challenge:** Write a custom auto-configuration with conditional beans
- **Resources:**
  - "Spring Boot Internals" — Stéphane Nicoll (YouTube)
  - Spring Boot reference docs, Auto-configuration section

### Day 16 — Bean Lifecycle, Proxies, AOP
- **Core concepts:** Bean lifecycle phases, `BeanPostProcessor`, JDK dynamic proxies vs CGLIB, `@Transactional` magic, AOP pointcuts/advice/aspects, self-invocation problem
- **Architect lens:** Knowing proxies = understanding why `@Transactional` sometimes silently fails
- **Interview signal:** "Why doesn't @Transactional work when calling a method from within the same class?"
- **Challenge:** Diagnose 3 broken `@Transactional` examples
- **Resources:**
  - "Inside Spring's Transaction Management" — Juergen Hoeller (YouTube)

### Day 17 — @Transactional Deep-Dive
- **Core concepts:** Propagation levels (REQUIRED, REQUIRES_NEW, NESTED), isolation levels in Spring, rollback rules, read-only transactions, transaction synchronization
- **Architect lens:** Wrong propagation = either missing commits or unwanted rollbacks in nested calls
- **Interview signal:** "What's the difference between REQUIRED and REQUIRES_NEW?"
- **Resources:**
  - Spring Transaction Management reference docs

### Day 18 — Reactive Programming Foundations
- **Core concepts:** Why reactive? The blocking problem. Publisher/Subscriber/Subscription/Processor (Reactive Streams spec). Cold vs hot streams. Backpressure as a first-class concept.
- **Architect lens:** Reactive is justified when you have IO-heavy fan-out, not always
- **Interview signal:** "When is reactive NOT the right choice?"
- **Challenge:** Identify whether 3 use cases benefit from reactive
- **Resources:**
  - "Reactive Programming with Java" — Venkat Subramaniam (YouTube)
  - reactive-streams.org spec

### Day 19 — Project Reactor: Mono, Flux, Operators
- **Core concepts:**
  - `Mono` (0..1 element) vs `Flux` (0..N)
  - Core operators: `map`, `flatMap`, `filter`, `zip`, `merge`, `concat`, `switchIfEmpty`
  - Schedulers: `boundedElastic`, `parallel`, `single`
  - Error handling: `onErrorResume`, `retry`, `timeout`
  - Backpressure strategies
- **Architect lens:** Picking the wrong scheduler = thread starvation
- **Interview signal:** "Difference between map and flatMap in Reactor?"
- **Challenge:** Build a reactive pipeline with parallel fan-out and error handling
- **Resources:**
  - Project Reactor reference docs (essential reading)
  - "Flight of the Flux" — Simon Baslé (Reactor team lead, YouTube)

### Day 20 — Spring WebFlux & Reactive Data Access
- **Core concepts:** WebFlux vs WebMVC, `RouterFunction` vs annotated controllers, R2DBC for reactive SQL, reactive Redis (Lettuce), `WebClient`
- **Architect lens:** Mixing blocking JDBC inside WebFlux = silent disaster
- **Interview signal:** "What happens if I call a blocking API inside a WebFlux endpoint?"
- **Challenge:** Identify blocking calls in a WebFlux handler
- **Resources:**
  - Spring WebFlux docs
  - "WebFlux Performance Tuning" — Rossen Stoyanchev (Spring lead)

### Day 21 — Phase 1 Synthesis: Build a Production-Grade Service Skeleton
- **Format:** Integrated mini-project
- **Scenario:** Sketch the bones of a Spring Boot service handling 10K RPS — pick threading model (Loom or reactive), GC algorithm, profiling strategy, justify every choice
- **Deliverable:** 2-page architecture decision record (ADR)
- **Architect lens:** This is the artifact you produce in real architect roles
- **Interview signal:** Staff-level system design prep starts here
- **Resources:**
  - ADR template: github.com/joelparkerhenderson/architecture-decision-record

---

## Phase 1 Exit Criteria

By the end of Week 3 you should be able to:

- Read a GC log and propose tuning flags without Googling
- Explain the JMM happens-before relationship to a Senior dev
- Choose between virtual threads, reactive, and blocking with justification
- Diagnose a `@Transactional` failure from a code snippet
- Profile a JVM service and identify allocation hotspots
- Use Records, sealed classes, and pattern matching switch in production code
- Defend a threading-model decision in a design review

---

## Key Resources for Phase 1

**Must-read books:**
- *Java Concurrency in Practice* — Brian Goetz (the canonical concurrency book)
- *Java Performance* — Scott Oaks (GC, JIT, tuning)

**Must-watch speakers (search YouTube):**
- Aleksey Shipilëv — JVM internals, JMM
- Brian Goetz — concurrency, language design
- Gil Tene — GC, latency
- Ron Pressler — Project Loom
- Simon Baslé — Project Reactor

**Official sources:**
- OpenJDK JEPs: 395 (Records), 409 (Sealed), 441 (Pattern Matching), 444 (Virtual Threads), 453 (Structured Concurrency)
- Spring Boot reference documentation
- Project Reactor reference documentation
