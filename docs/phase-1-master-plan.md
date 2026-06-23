# Phase 1 — Advanced Java (Weeks 1–3, Days 1–23)

> **Goal:** Master the JVM as a runtime, not just a language. Understand memory, GC, modern Java language features, concurrency, and the framework internals that shape every architectural decision in production Java.

---

## Week 1 — JVM Internals, GC & Java Advanced (Days 1–9)

### Day 1 — Stack vs Heap Fundamentals ✅
- **Core concepts:** JVM memory regions, stack vs heap, primitives vs references, frame lifecycle
- **Architect lens:** Each thread = one stack; thread count × stack size = capacity ceiling
- **Interview signal:** "What's the difference between StackOverflowError and OutOfMemoryError?"
- **Challenge:** Identify where each piece of data lives in a code snippet
- **Resources:**
  - Oracle JVM Spec, Chapter 2 (search: "JVM Specification runtime data areas")
  - "Understanding the JVM" — Jon Rose, JavaOne (YouTube)

### Day 2 — Static, Instance, Metaspace & Reflection ✅
- **Core concepts:** Static vs instance fields, class loading, Metaspace; Java Reflection API — `Class.forName()`, `getDeclaredFields()`, `getDeclaredMethods()`, `setAccessible()`; how `getDeclaredFields()` distinguishes static from instance fields; `MethodHandle` and `VarHandle` as JIT-friendly alternatives; JPMS module system restrictions (Java 9+)
- **Architect lens:** Static collections = silent memory leaks; dynamic class loading exhausts Metaspace; reflection is the engine behind Spring DI, Jackson, JPA, JUnit, Mockito; prefer constructor injection to avoid reflection entirely
- **Interview signal:** "Why did PermGen get replaced by Metaspace?" / "Why is reflection slow and what’s the alternative?" / "Why does your app crash with InaccessibleObjectException on Java 17?"
- **Challenge:** 7-row memory classification + Quick Check: diagnose a module-system reflection failure on Java 17
- **Resources:**
  - JEP 122: Remove the Permanent Generation (search "JEP 122")
  - JEP 396: Strongly Encapsulate JDK Internals by Default (Java 16+)
  - `java.lang.invoke` package Javadoc — MethodHandles, MethodHandle, VarHandle
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

### Day 7 — Modern Java by Version: Java 8 & Java 11 (Deep Dive) `[HEAVY · 2.75hr]`
- **Organization:** Every feature under its release-version heading, in depth with code. Day 7 = Java 8 & 11; Day 8 = Java 17 & 21.
- **Core concepts:**
  - **Java 8 (2014, LTS):** lambdas & functional interfaces (SAM types, the core four + primitive specializations) **and how they actually work** — `invokedynamic` / `LambdaMetafactory`, capture/effectively-final, non-capturing lambdas as cached singletons; the 4 method-reference kinds; **Stream API + internals** — lazy fused one-pass pipeline, `Spliterator`, stateless vs stateful ops; **Collectors** — the 5-function contract (supplier/accumulator/combiner/finisher/characteristics), `groupingBy`/`partitioningBy`/`joining`; **parallel streams** — the `ForkJoinPool.commonPool` trap; `Optional` + anti-patterns; default & static interface methods; `java.time`; `CompletableFuture` basics
  - **Java 11 (2018, LTS — bundling 9 & 10):** `var` (incl. lambda params), standardized `HttpClient`, JPMS (brief), collection factories (`List.of`/`Map.of`), String/`Files` conveniences; the functional gap-fillers — `takeWhile`/`dropWhile`, bounded `Stream.iterate`, `Optional.or`/`ifPresentOrElse`/`stream`, `filtering`/`flatMapping` collectors, `Predicate.not`
- **Architect lens:** Java 8 changed how you express data transformations; `Optional` is a return type only; `var` serves readability; parallel streams share the JVM-wide common pool (never in a request handler); know which LTS gave you each tool.
- **Interview signal:**
  - "What does `invokedynamic` do for lambdas? When does a lambda allocate?"
  - "Why are streams lazy / one-pass / not reusable?"
  - "When should `Optional` NOT be used?"
  - "Why was my parallel stream slower than sequential?"
- **Challenge:** Diagnose a production incident — a service using `parallelStream()` inside a Spring Boot controller handler randomly returns 504s under load. Identify the root cause (common ForkJoinPool starvation), explain the failure mode, and propose two fixes (dedicated `ForkJoinPool`; remove parallelization).
- **Resources:**
  - *Modern Java in Action* — Urma, Fusco, Mycroft
  - "Streams in Java" / "Optional in Java" — Stuart Marks (YouTube)
  - JEP 286 (var), JEP 321 (HttpClient)

### Day 8 — Modern Java by Version: Java 17 & Java 21 (Deep Dive) `[HEAVY · 2.75hr]`
- **Core concepts:**
  - **Java 17 (2021, LTS — bundling 12–16):** switch expressions, text blocks, **records in full depth** (compact constructors, custom accessors, shallow immutability + defensive copies, deserialization-through-canonical-constructor safety, NOT for JPA entities), pattern matching for `instanceof` (flow scoping), **sealed classes**, the **algebraic-data-types** big idea (records + sealed + pattern matching), helpful NullPointerExceptions, `Stream.toList()` / `mapMulti` / `teeing`
  - **Java 21 (2023, LTS):** pattern matching for `switch` + **record patterns** (type patterns, guards with `when`, dominance, `case null`, how exhaustiveness is proven); **virtual threads** (M:N mount/unmount, carrier threads, **pinning** + `-Djdk.tracePinnedThreads`); **structured concurrency** (`StructuredTaskScope`, ShutdownOnFailure/Success); **scoped values** (ThreadLocal replacement); **sequenced collections**; **generational ZGC**
  - **Java 22+ (preview):** Gatherers (custom intermediate stream ops) — mention only
- **Big idea:** Records + sealed classes + pattern matching = algebraic data types; the compiler enforces exhaustive case handling, replacing visitor patterns and `instanceof` chains.
- **Architect lens:** Sealed interfaces over abstract classes for closed type sets; records for values not entities; exhaustive switch turns "forgot a case" into a compile error; virtual threads make blocking code scale (beware pinning under `synchronized`).
- **Interview signal:**
  - "Design a payment result type using records and sealed classes; process it with pattern switch."
  - "Explain exhaustiveness checking and why it matters for refactoring."
  - "Walk me through what happens when a virtual thread blocks; what is pinning?"
  - "Why can't you use ThreadLocal effectively with virtual threads?"
- **Challenge:** Model a trading order state hierarchy with sealed interfaces + records — `Submitted`, `Validated`, `Filled(BigDecimal fillPrice)`, `Rejected(String reason)`, `Cancelled`. Write a pattern-switch status method with no `default`, then add a new state and observe the compile errors that exhaustiveness produces.
- **Resources:**
  - JEP 395 (records), JEP 409 (sealed), JEP 441 (pattern switch), JEP 440 (record patterns), JEP 444 (virtual threads), JEP 453 (structured concurrency)
  - "Virtual Threads" — Ron Pressler, Devoxx; "Pattern Matching for Java" — Brian Goetz (Inside Java)

### Day 9 — Week 1 Synthesis: Production Diagnosis
- **Format:** Integrated multi-symptom diagnosis combining **Days 1–8** — no new concepts. Closes Week 1.
- **Scenario:** A Java 17 order-matching service degrades over the trading day: a 2–3s freeze at market open, p99/heap creeping up to a nightly OOM, an occasionally-wrong position counter, and many `WAITING`/`BLOCKED` threads at peak with moderate CPU. Four interleaved root causes (GC/allocation, a leak, a data race, contention).
- **Deliverable:** Separate the symptoms into distinct problems and classify each (Day 1–8 ownership); give a diagnostic plan (GC logs, heap dump + MAT, allocation/thread profiling, code review); prescribe fixes (Young-gen/ZGC tuning, bound the cache, `AtomicLong`, isolate parallelism / `ReentrantLock`) — and call out the "just add a bigger heap" trap (delays the OOM while worsening the open-GC pause).
- **Architect lens:** Synthesis is what separates Senior from Staff — classify the symptom, hypothesize, reach for the owning day's tool, confirm with evidence. Never guess; never "just add heap."
- **Interview signal:** This IS the production-incident question pattern for Staff loops.

---

## Week 2 — Concurrency Mastery (Days 10–16)

### Day 10 — Threads, Thread Pools, ExecutorService
- **Core concepts:** Platform threads, OS thread mapping, `Thread.start()`, `ExecutorService` types (FixedThreadPool, CachedThreadPool, ScheduledExecutor), thread pool sizing formula (Little's Law)
- **Architect lens:** Wrong pool size = either thread starvation or context-switch tax
- **Interview signal:** "How would you size a thread pool for a CPU-bound vs IO-bound workload?"
- **Challenge:** Pick the right ExecutorService for 3 different workloads
- **Resources:**
  - *Java Concurrency in Practice*, Chapter 8
  - "Applying Back Pressure when Overloaded" — Fred Hebert (architecture pattern)

### Day 11 — Synchronization Primitives: synchronized, Lock, ReentrantLock
- **Core concepts:** `synchronized` blocks/methods, monitor pattern, `Lock` interface, `ReentrantLock`, `ReadWriteLock`, fair vs unfair locks, lock contention
- **Architect lens:** Lock contention silently kills throughput; finer-grained locks scale better
- **Interview signal:** "When would you prefer ReentrantLock over synchronized?"
- **Challenge:** Refactor a coarse-grained synchronized class to use ReadWriteLock
- **Resources:**
  - "Lock-Free Programming" — Herb Sutter (concept), search for Java equivalents

### Day 12 — Atomics, CAS, Lock-Free Patterns
- **Core concepts:** `AtomicInteger`/`AtomicReference`/`AtomicLong`, Compare-and-Swap (CAS), ABA problem, `LongAdder` vs `AtomicLong`, lock-free stack/queue intuition
- **Architect lens:** CAS-based structures avoid lock contention but trade off readability and have failure modes (ABA)
- **Interview signal:** "Implement a thread-safe counter without using synchronized"
- **Challenge:** Spot the ABA bug in a lock-free stack implementation
- **Resources:**
  - "Lock-free programming in Java" — Martin Thompson (search "Mechanical Sympathy LMAX Disruptor")
  - LMAX Disruptor pattern (canonical example for HFT)

### Day 13 — CompletableFuture & Async Composition
- **Core concepts:** `CompletableFuture` API, `thenApply`/`thenCompose`/`thenCombine`, exception handling with `exceptionally`/`handle`, `allOf`/`anyOf`, custom executors
- **Architect lens:** Composable async = the modern reactive backbone before Reactor
- **Interview signal:** "Chain 3 async API calls where the second depends on the first"
- **Challenge:** Refactor a callback hell example into clean CompletableFuture chain
- **Resources:**
  - "CompletableFuture in Action" — Tomasz Nurkiewicz (YouTube)

### Day 14 — Virtual Threads (Project Loom)
- **Core concepts:** Why platform threads don't scale (1MB stack each, OS scheduler limits), virtual threads as M:N scheduling on carrier threads, `Thread.ofVirtual()`, pinning issues, when virtual threads don't help (CPU-bound, synchronized blocks)
- **Architect lens:** Virtual threads change microservice design — synchronous code can now scale like async
- **Interview signal:** "When would virtual threads NOT help you?"
- **Challenge:** Convert a Spring Boot endpoint to virtual threads and reason about throughput change
- **Resources:**
  - JEP 444: Virtual Threads (search "JEP 444")
  - "Virtual Threads" — Ron Pressler (project lead, YouTube Devoxx talk — essential viewing)

### Day 15 — Concurrent Collections & Producer-Consumer Patterns
- **Core concepts:** `ConcurrentHashMap` (internals: striping, treeification), `CopyOnWriteArrayList`, `BlockingQueue` variants, producer-consumer pattern, classic Disruptor mention
- **Architect lens:** Picking the right concurrent collection = order-of-magnitude perf difference
- **Interview signal:** "Why does ConcurrentHashMap not use a single lock?"
- **Challenge:** Implement a bounded producer-consumer with `ArrayBlockingQueue`
- **Resources:**
  - JDK source code of `ConcurrentHashMap` (read the comments)

### Day 16 — Week 2 Synthesis: Design a Rate Limiter
- **Format:** LLD-style design exercise applying concurrency knowledge
- **Scenario:** Design a thread-safe distributed rate limiter (single-node first, then hint at distributed). Cover token bucket, leaky bucket, sliding window.
- **Architect lens:** A rate limiter is a microcosm of concurrency design — every primitive shows up
- **Interview signal:** Frequent FAANG LLD question
- **Deliverable:** Java implementation + trade-off discussion
- **Resources:**
  - Stripe Engineering blog: "Scaling your API with rate limiters"

---

## Week 3 — Spring Boot Internals & Reactive Programming (Days 17–23)

### Day 17 — Spring Boot Auto-Configuration: How the Magic Works
- **Core concepts:** `@SpringBootApplication` breakdown, `@EnableAutoConfiguration`, `spring.factories` → `AutoConfiguration.imports`, conditional beans (`@ConditionalOnClass`, `@ConditionalOnMissingBean`), the `META-INF` machinery
- **Architect lens:** Understanding auto-config = ability to debug "why isn't my bean injected"
- **Interview signal:** "What happens at startup when Spring Boot bootstraps?"
- **Challenge:** Write a custom auto-configuration with conditional beans
- **Resources:**
  - "Spring Boot Internals" — Stéphane Nicoll (YouTube)
  - Spring Boot reference docs, Auto-configuration section

### Day 18 — Bean Lifecycle, Proxies, AOP
- **Core concepts:** Bean lifecycle phases, `BeanPostProcessor`, JDK dynamic proxies vs CGLIB, `@Transactional` magic, AOP pointcuts/advice/aspects, self-invocation problem
- **Architect lens:** Knowing proxies = understanding why `@Transactional` sometimes silently fails
- **Interview signal:** "Why doesn't @Transactional work when calling a method from within the same class?"
- **Challenge:** Diagnose 3 broken `@Transactional` examples
- **Resources:**
  - "Inside Spring's Transaction Management" — Juergen Hoeller (YouTube)

### Day 19 — @Transactional Deep-Dive
- **Core concepts:** Propagation levels (REQUIRED, REQUIRES_NEW, NESTED), isolation levels in Spring, rollback rules, read-only transactions, transaction synchronization
- **Architect lens:** Wrong propagation = either missing commits or unwanted rollbacks in nested calls
- **Interview signal:** "What's the difference between REQUIRED and REQUIRES_NEW?"
- **Resources:**
  - Spring Transaction Management reference docs

### Day 20 — Reactive Programming Foundations
- **Core concepts:** Why reactive? The blocking problem. Publisher/Subscriber/Subscription/Processor (Reactive Streams spec). Cold vs hot streams. Backpressure as a first-class concept.
- **Architect lens:** Reactive is justified when you have IO-heavy fan-out, not always
- **Interview signal:** "When is reactive NOT the right choice?"
- **Challenge:** Identify whether 3 use cases benefit from reactive
- **Resources:**
  - "Reactive Programming with Java" — Venkat Subramaniam (YouTube)
  - reactive-streams.org spec

### Day 21 — Project Reactor: Mono, Flux, Operators
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

### Day 22 — Spring WebFlux & Reactive Data Access
- **Core concepts:** WebFlux vs WebMVC, `RouterFunction` vs annotated controllers, R2DBC for reactive SQL, reactive Redis (Lettuce), `WebClient`
- **Architect lens:** Mixing blocking JDBC inside WebFlux = silent disaster
- **Interview signal:** "What happens if I call a blocking API inside a WebFlux endpoint?"
- **Challenge:** Identify blocking calls in a WebFlux handler
- **Resources:**
  - Spring WebFlux docs
  - "WebFlux Performance Tuning" — Rossen Stoyanchev (Spring lead)

### Day 23 — Phase 1 Synthesis: Build a Production-Grade Service Skeleton
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
