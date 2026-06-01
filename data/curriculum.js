/* ============================================================
   Java Architect Track — Curriculum Data
   Single source of truth for all 22 weeks: metadata + answer keys.
   Loaded by index.html (landing page) and each lesson page.
   ============================================================ */

const CURRICULUM = {
  phases: [
    { id: 1, name: "Advanced Java",       weeks: [1,2,3],       color: "#ff7a3d" },
    { id: 2, name: "DSA",                 weeks: [4,5,6,7],     color: "#7ab8e8" },
    { id: 3, name: "System Design",       weeks: [8,9,10,11,12,13,14], color: "#b18ae0" },
    { id: 4, name: "AWS & DevOps",        weeks: [15,16,17,18], color: "#6ed3a8" },
    { id: 5, name: "AI Integration",      weeks: [19,20],       color: "#e8c87a" },
    { id: 6, name: "Interview Polish",    weeks: [21,22],       color: "#e87a7a" },
  ],

  weeks: [

    /* ── PHASE 1: ADVANCED JAVA (Weeks 1-3) ──────────────── */

    {
      week: 1, phase: 1, title: "JVM Internals & GC",
      days: [
        {
          day: 1, title: "Stack vs Heap Fundamentals",
          topic: "JVM Memory", status: "done", duration: 60,
          file: "week-01/day-1.html",
          challenge: {
            type: "select",
            questions: [
              { id: "q1", label: "The value <code>5</code> (local primitive)", answer: "STACK",
                hint: "Is it a local variable inside a method, or a field?",
                explanation: "Local primitive <code>int a = 5</code> — the value lives directly in the method's stack frame." },
              { id: "q2", label: "The variable <code>s</code> (the reference)", answer: "STACK",
                hint: "Where do local variables inside a method live?",
                explanation: "The reference variable <code>s</code> is a local variable. References are 8 bytes on the stack. The object it points to is a separate question." },
              { id: "q3", label: "The <code>String</code> object containing \"hi\"", answer: "HEAP",
                hint: "<code>new</code> always goes somewhere specific...",
                explanation: "Every object created with <code>new</code> goes to the heap — no exceptions. The <em>variable</em> <code>s</code> is on the stack; the <em>object</em> is on the heap." },
            ],
            options: ["STACK", "HEAP"],
          }
        },
        {
          day: 2, title: "Static, Instance & Metaspace",
          topic: "JVM Memory", status: "done", duration: 60,
          file: "week-01/day-2.html",
          challenge: {
            type: "select",
            questions: [
              { id: "A",  label: "<strong>A</strong> — <code>counter = 0</code> (static field)", answer: "METASPACE",
                hint: "Does it belong to an instance or to the class itself?",
                explanation: "Static fields belong to the <em>class</em>, not any object. The class lives in Metaspace." },
              { id: "B",  label: "<strong>B</strong> — <code>region</code> (instance field, String type)", answer: "HEAP",
                hint: "This is the twist: what kind of thing is it — local or field?",
                explanation: "Instance fields are embedded inside their owning object. The <code>OrderProcessor</code> object lives on the heap, so <code>region</code> lives there too — even though it's a String type." },
              { id: "C",  label: "<strong>C</strong> — <code>quantity</code> (method parameter)", answer: "STACK",
                hint: "Parameters are treated just like local variables.",
                explanation: "Method parameters live in the current stack frame, same as local variables." },
              { id: "D",  label: "<strong>D</strong> — <code>total</code> (local primitive)", answer: "STACK",
                hint: "Local primitive inside a method body.",
                explanation: "Local primitive variables live in the stack frame of the method that declares them." },
              { id: "E1", label: "<strong>E1</strong> — <code>order</code> (the reference variable)", answer: "STACK",
                hint: "What is a variable declared inside a method?",
                explanation: "The reference <code>order</code> is a local variable — 8 bytes in the current stack frame." },
              { id: "E2", label: "<strong>E2</strong> — the <code>Order</code> object itself", answer: "HEAP",
                hint: "The result of <code>new Order(...)</code> lives where all objects live.",
                explanation: "<code>new Order(total)</code> allocates an object. All objects go to the heap." },
              { id: "F",  label: "<strong>F</strong> — the Order object after <code>return</code>", answer: "HEAP",
                hint: "Does the object disappear when the method returns?",
                explanation: "The <em>reference</em> on the stack is gone, but the heap object survives as long as the caller holds a reference. It will eventually be GC'd when no more references exist." },
            ],
            options: ["STACK", "HEAP", "METASPACE"],
          }
        },
        {
          day: 3, title: "Garbage Collection Fundamentals",
          topic: "Garbage Collection", status: "done", duration: 60,
          file: "week-01/day-3.html",
          challenge: {
            type: "open-ended",
            questions: [
              {
                id: "gc1",
                prompt: "Which type of GC event is most likely causing the 350ms spike? Justify using the symptoms.",
                minChars: 50,
                modelAnswer: "Most likely a Major GC. Minor GCs are too fast (single-digit ms) to cause 350ms spikes. Full GCs would be even longer and rarer. 350ms aligns with old-gen collection clearing promoted objects — long enough to be painful, short enough to not be a Full GC."
              },
              {
                id: "gc2",
                prompt: "What does the 45-second interval tell you about the app's allocation behaviour?",
                minChars: 50,
                modelAnswer: "The 45-second interval suggests the old generation fills up at a steady rate — consistent with promotion of long-lived objects (likely a growing cache or session store). Allocation rate itself isn't the issue; promotion rate is. Something is surviving enough Minor GCs to get tenured, then accumulating until the old gen triggers a collection."
              },
              {
                id: "gc3",
                prompt: "If p50 is unchanged, why does this matter? Argue to a PM who says 'p50 is fine, ship it.'",
                minChars: 50,
                modelAnswer: "p50 measures median, hiding tail latency entirely. For a 5,000 req/sec service, a 350ms spike every 45s affects roughly 225 requests per spike — those users see the system as broken even if 99% see it as fine. SLA contracts, retry storms, and downstream cascades all live in the tail. One bad GC pause can cascade into a thundering herd when 225 clients retry simultaneously."
              },
            ]
          }
        },
        { day: 4, title: "GC Algorithms Deep Dive + Tuning + Profiling",   topic: "Garbage Collection", status: "locked", file: null },
        { day: 5, title: "Java Memory Model (JMM) & happens-before",      topic: "Concurrency",        status: "locked", file: null },
        { day: 6, title: "Profiling in Anger: JFR, async-profiler, flame graphs", topic: "JVM Memory", status: "locked", file: null },
        { day: 7, title: "Week 1 Synthesis: Production Diagnosis",        topic: "JVM Memory",         status: "locked", file: null },
        {
          day: "7a", title: "Java Advanced: Records, Sealed Classes, Pattern Matching & Modern APIs (Java 14–21)",
          topic: "Java Language", status: "locked", file: null,
          note: "Records (compact constructors, custom accessors, records-as-value-types); Sealed classes + interfaces for exhaustive algebraic types; Pattern matching instanceof with binding vars; Switch expressions (arrow labels, yield) + guarded patterns (Java 21 when clauses); Deconstruction patterns — record patterns, array patterns; Text blocks (indentation stripping, \\ line continuation); Structured Concurrency: StructuredTaskScope.ShutdownOnFailure / ShutdownOnSuccess — fork/join with automatic cancellation; Sequenced Collections: SequencedCollection, SequencedSet, SequencedMap with reversed views; String templates (preview — interpolation with processors); Value objects & Valhalla preview concepts; Migration paths: how to replace inheritance hierarchies with sealed+record trees, null-checks with pattern switch"
        },
        {
          day: "7b", title: "Streams & Functional Interfaces: Advanced Patterns & Internals",
          topic: "Java Language", status: "locked", file: null,
          note: "Functional interface mechanics: @FunctionalInterface, SAM types, method references (4 kinds) vs lambdas, capture semantics (effectively-final, heap pollution with varargs); Lambda desugaring via invokedynamic — how the JVM avoids generating anonymous classes; Stream internals: spliterator-based lazy pipeline, encounter order, stateful vs stateless ops, short-circuit evaluation; Advanced collectors: Collectors.teeing, downstream collectors, custom Collector<T,A,R> implementation, groupingBy with counting/mapping/filtering; flatMap vs mapMulti (Java 16) — when mapMulti wins on performance; Parallel streams: ForkJoinPool.commonPool, spliterator SIZED/ORDERED/SUBSIZED characteristics, when parallel hurts (stateful, ordered, small N); Gatherers API (Java 22 preview): window, fold, scan, custom Gatherer<T,A,R> — stream operations that were impossible before; Optional deep-dive: chaining flatMap, or(), ifPresentOrElse, stream() bridge, anti-patterns (Optional as field, isPresent/get); Custom spliterators: implementing trySplit for parallel-capable infinite sources; Reactive bridge: Flux.fromStream pitfalls, Stream.generate for push-to-pull conversion; Real patterns: pagination with Stream.iterate + takeWhile, lazy DB cursor wrapping, multi-level groupBy for report generation, collector fusion"
        },
      ]
    },

    {
      week: 2, phase: 1, title: "Concurrency",
      days: [
        { day: 8,    title: "Threads, Thread Pools, ExecutorService",                                  topic: "Concurrency",    status: "locked", file: null },
        { day: 9,    title: "Synchronization Primitives: synchronized, Lock, ReentrantLock",         topic: "Concurrency",    status: "locked", file: null },
        { day: 10,   title: "Atomics, CAS, Lock-Free Patterns",                                      topic: "Concurrency",    status: "locked", file: null },
        { day: 11,   title: "CompletableFuture & Async Composition",                                 topic: "Concurrency",    status: "locked", file: null },
        { day: 12,   title: "Virtual Threads (Project Loom)",                                        topic: "Concurrency",    status: "locked", file: null },
        { day: 13,   title: "Concurrent Collections & Producer-Consumer Patterns",                   topic: "Concurrency",    status: "locked", file: null },
        { day: 14,   title: "Week 2 Synthesis: Design a Rate Limiter",                               topic: "Concurrency",    status: "locked", file: null },
      ]
    },

    {
      week: 3, phase: 1, title: "Spring Boot & Reactive",
      days: [
        { day: 15, title: "Spring Boot Auto-Configuration: How the Magic Works", topic: "Spring",   status: "locked", file: null },
        { day: 16, title: "Bean Lifecycle, Proxies, AOP",             topic: "Spring",   status: "locked", file: null },
        { day: 17, title: "@Transactional Deep-Dive",                 topic: "Spring",   status: "locked", file: null },
        { day: 18, title: "Reactive Programming Foundations",         topic: "Reactive", status: "locked", file: null },
        { day: 19, title: "Project Reactor: Mono, Flux, Operators",   topic: "Reactive", status: "locked", file: null },
        { day: 20, title: "Spring WebFlux & Reactive Data Access",    topic: "Reactive", status: "locked", file: null },
        { day: 21, title: "Phase 1 Synthesis: Build a Production-Grade Service Skeleton", topic: "Reactive", status: "locked", file: null },
      ]
    },

    /* ── PHASE 2: DSA (Weeks 4-7) ────────────────────────── */

    {
      week: 4, phase: 2, title: "Arrays & Strings",
      days: [
        { day: 22, title: "Two Pointers Foundations",                    topic: "DSA — Arrays/Strings", status: "locked", file: null },
        { day: 23, title: "Sliding Window (Fixed & Variable Size)",   topic: "DSA — Arrays/Strings", status: "locked", file: null },
        { day: 24, title: "Prefix Sums & Difference Arrays",          topic: "DSA — Arrays/Strings", status: "locked", file: null },
        { day: 25, title: "String Manipulation Patterns",             topic: "DSA — Arrays/Strings", status: "locked", file: null },
        { day: 26, title: "Array Manipulation: Rotations, Sorts, Merges", topic: "DSA — Arrays/Strings", status: "locked", file: null },
        { day: 27, title: "Week 4 Synthesis: Mixed Pattern Drill",    topic: "DSA — Arrays/Strings", status: "locked", file: null },
      ]
    },

    {
      week: 5, phase: 2, title: "Trees & Graphs",
      days: [
        { day: 28, title: "Binary Tree Traversals",                   topic: "DSA — Trees/Graphs", status: "locked", file: null },
        { day: 29, title: "Binary Search Trees",                      topic: "DSA — Trees/Graphs", status: "locked", file: null },
        { day: 30, title: "Binary Tree DFS Patterns",                  topic: "DSA — Trees/Graphs", status: "locked", file: null },
        { day: 31, title: "Graph Representations & BFS",              topic: "DSA — Trees/Graphs", status: "locked", file: null },
        { day: 32, title: "Graph DFS, Cycle Detection, Connected Components", topic: "DSA — Trees/Graphs", status: "locked", file: null },
        { day: 33, title: "Topological Sort & Union-Find",            topic: "DSA — Trees/Graphs", status: "locked", file: null },
        { day: 34, title: "Week 5 Synthesis: Graph Problem Drill",    topic: "DSA — Trees/Graphs", status: "locked", file: null },
      ]
    },

    {
      week: 6, phase: 2, title: "Dynamic Programming",
      days: [
        { day: 35, title: "DP Foundations: Memoization vs Tabulation",  topic: "DSA — DP", status: "locked", file: null },
        { day: 36, title: "1D DP Patterns",                           topic: "DSA — DP", status: "locked", file: null },
        { day: 37, title: "2D DP: Grid Problems",                     topic: "DSA — DP", status: "locked", file: null },
        { day: 38, title: "Knapsack Family",                          topic: "DSA — DP", status: "locked", file: null },
        { day: 39, title: "String DP",                                topic: "DSA — DP", status: "locked", file: null },
        { day: 40, title: "Interval DP & Stocks Family",              topic: "DSA — DP", status: "locked", file: null },
        { day: 41, title: "Week 6 Synthesis: DP Pattern Identification", topic: "DSA — DP", status: "locked", file: null },
      ]
    },

    {
      week: 7, phase: 2, title: "Advanced DSA",
      days: [
        { day: 42, title: "Heaps & Priority Queues",                  topic: "DSA — Advanced", status: "locked", file: null },
        { day: 43, title: "Two Heaps Pattern",                        topic: "DSA — Advanced", status: "locked", file: null },
        { day: 44, title: "Tries",                                    topic: "DSA — Advanced", status: "locked", file: null },
        { day: 45, title: "Backtracking",                             topic: "DSA — Advanced", status: "locked", file: null },
        { day: 46, title: "Binary Search Mastery",                    topic: "DSA — Advanced", status: "locked", file: null },
        { day: 47, title: "Greedy Patterns",                          topic: "DSA — Advanced", status: "locked", file: null },
        { day: 48, title: "Phase 2 Synthesis: Mock Coding Interview",  topic: "DSA — Advanced", status: "locked", file: null },
      ]
    },

    /* ── PHASE 3: SYSTEM DESIGN (Weeks 8-14) ─────────────── */

    {
      week: 8, phase: 3, title: "LLD Foundations",
      days: [
        { day: 49, title: "Object-Oriented Design Principles Revisited", topic: "System Design (LLD)", status: "locked", file: null },
        { day: 50, title: "SOLID Principles (SRP, OCP, LSP, ISP, DIP)", topic: "System Design (LLD)", status: "locked", file: null },
        { day: 51, title: "Creational Patterns: Singleton, Factory, Builder", topic: "System Design (LLD)", status: "locked", file: null },
        { day: 52, title: "Structural Patterns: Adapter, Decorator, Facade, Proxy", topic: "System Design (LLD)", status: "locked", file: null },
        { day: 53, title: "Behavioral Patterns: Strategy, Observer, Command, State", topic: "System Design (LLD)", status: "locked", file: null },
        { day: 54, title: "Week 8 Synthesis: Refactor a Real Codebase", topic: "System Design (LLD)", status: "locked", file: null },
      ]
    },

    {
      week: 9, phase: 3, title: "LLD Practice",
      days: [
        { day: 55, title: "Design a Parking Lot",                     topic: "System Design (LLD)", status: "locked", file: null },
        { day: 56, title: "Design a Rate Limiter (LLD)",             topic: "System Design (LLD)", status: "locked", file: null },
        { day: 57, title: "Design an LRU Cache",                     topic: "System Design (LLD)", status: "locked", file: null },
        { day: 58, title: "Design a Logger / Notification System",   topic: "System Design (LLD)", status: "locked", file: null },
        { day: 59, title: "Design a Splitwise / Expense Tracker",    topic: "System Design (LLD)", status: "locked", file: null },
        { day: 60, title: "Design an Elevator System",               topic: "System Design (LLD)", status: "locked", file: null },
        { day: 61, title: "Week 9 Synthesis: Mock LLD Interview",    topic: "System Design (LLD)", status: "locked", file: null },
      ]
    },

    {
      week: 10, phase: 3, title: "HLD Theory",
      days: [
        { day: 62, title: "CAP Theorem (and Why It's Overhyped)",      topic: "System Design (HLD)", status: "locked", file: null },
        { day: 63, title: "PACELC Theorem & Consistency Models",      topic: "System Design (HLD)", status: "locked", file: null },
        { day: 64, title: "Load Balancing Strategies",                topic: "System Design (HLD)", status: "locked", file: null },
        { day: 65, title: "Consistent Hashing Deep Dive",             topic: "System Design (HLD)", status: "locked", file: null },
        { day: 66, title: "Caching Strategies",                      topic: "System Design (HLD)", status: "locked", file: null },
        { day: 67, title: "CDNs & Edge Caching",                     topic: "System Design (HLD)", status: "locked", file: null },
        { day: "67a", title: "Redis Deep Dive: Sorted Sets, Cluster, Sentinel & Lua", topic: "System Design (HLD)", status: "locked", file: null,
          note: "Sorted sets for leaderboards/rate-limiting; Redis Cluster sharding & slot mapping; Sentinel vs Cluster HA; Lua scripting for atomic operations; eviction policies; Redis vs Memcached vs in-process cache" },
        { day: 68, title: "Week 10 Synthesis: Cache + LB Decision Matrix", topic: "System Design (HLD)", status: "locked", file: null },
      ]
    },

    {
      week: 11, phase: 3, title: "Storage",
      days: [
        { day: 69, title: "Relational Database Internals",              topic: "System Design (HLD)", status: "locked", file: null },
        { day: 70, title: "SQL Sharding & Replication",               topic: "System Design (HLD)", status: "locked", file: null },
        { day: 71, title: "NoSQL Landscape",                          topic: "System Design (HLD)", status: "locked", file: null },
        { day: 72, title: "DynamoDB Design Patterns",                 topic: "System Design (HLD)", status: "locked", file: null },
        { day: 73, title: "Time-Series Databases",                    topic: "System Design (HLD)", status: "locked", file: null },
        { day: 74, title: "Database Selection Framework",             topic: "System Design (HLD)", status: "locked", file: null },
        { day: 75, title: "Week 11 Synthesis: Schema Design Exercise", topic: "System Design (HLD)", status: "locked", file: null },
        { day: "75a", title: "Distributed Locking + Distributed ID Generation", topic: "System Design (HLD)", status: "locked", file: null,
          note: "Redlock algorithm; fencing tokens; ZooKeeper vs Redis locking trade-offs; Snowflake IDs (timestamp+machineId+seq); Twitter Snowflake vs UUIDv7 vs DB sequences; clock skew hazards" },
      ]
    },

    {
      week: 12, phase: 3, title: "Messaging",
      days: [
        { day: 76, title: "Messaging Patterns: Queue vs Pub/Sub",      topic: "Microservices", status: "locked", file: null },
        { day: 77, title: "Kafka: Internals & Consumer Groups",       topic: "Microservices", status: "locked", file: null },
        { day: 78, title: "Exactly-Once Semantics & Idempotency",     topic: "Microservices", status: "locked", file: null },
        { day: 79, title: "Event Sourcing & CQRS",                    topic: "Microservices", status: "locked", file: null },
        { day: "79a", title: "Transactional Outbox Pattern + CQRS Deep Dive", topic: "Microservices", status: "locked", file: null,
          note: "Dual-write problem; Outbox table + CDC (Debezium) vs polling publisher; at-least-once delivery guarantees; CQRS write vs read model sync lag; eventual consistency UX implications" },
        { day: 80, title: "Stream Processing: Kafka Streams, Flink (intro)", topic: "Microservices", status: "locked", file: null },
        { day: 81, title: "Week 12 Synthesis: Design an Event-Driven Order System", topic: "Microservices", status: "locked", file: null },
      ]
    },

    {
      week: 13, phase: 3, title: "Microservices",
      days: [
        { day: 82, title: "Monolith vs Microservices: The Real Trade-offs", topic: "Microservices", status: "locked", file: null },
        { day: 83, title: "Service Decomposition: DDD, Bounded Contexts", topic: "Microservices", status: "locked", file: null },
        { day: "83a", title: "Database per Service + Strangler Fig + Anti-Corruption Layer", topic: "Microservices", status: "locked", file: null,
          note: "DB-per-service rationale & shared schema anti-pattern; Strangler Fig migration playbook (proxy layer, feature flags, traffic shifting); ACL as translation layer between bounded contexts" },
        { day: 84, title: "Distributed Transactions: Saga Pattern",   topic: "Microservices", status: "locked", file: null },
        { day: "84a", title: "REST API Design + gRPC + WebSockets",   topic: "Microservices", status: "locked", file: null,
          note: "REST constraints & maturity model; gRPC proto contracts vs REST trade-offs; WebSocket upgrade, heartbeat, backpressure; when to choose each — architect decision rubric" },
        { day: 85, title: "API Gateway, BFF & Service Mesh",          topic: "Microservices", status: "locked", file: null },
        { day: 86, title: "Service Discovery & Health Checks",         topic: "Microservices", status: "locked", file: null },
        { day: "86a", title: "OAuth2 / JWT / Spring Security — Auth Architecture", topic: "Microservices", status: "locked", file: null,
          note: "OAuth2 flows (Authorization Code + PKCE, Client Credentials, Device); JWT structure, signing (RS256 vs HS256), expiry & rotation; Spring Security filter chain; RBAC vs ABAC; token introspection vs local validation trade-offs" },
        { day: 87, title: "Resilience Patterns: Circuit Breaker, Bulkhead, Timeout, Retry", topic: "Microservices", status: "locked", file: null },
        { day: 88, title: "Week 13 Synthesis: Design a Microservices Migration", topic: "Microservices", status: "locked", file: null },
      ]
    },

    {
      week: 14, phase: 3, title: "HLD Mock Designs",
      days: [
        { day: 89, title: "Design TinyURL",                            topic: "System Design (HLD)", status: "locked", file: null },
        { day: 90, title: "Design Twitter / X",                       topic: "System Design (HLD)", status: "locked", file: null },
        { day: 91, title: "Design Uber / Ride-Hailing",               topic: "System Design (HLD)", status: "locked", file: null },
        { day: 92, title: "Design WhatsApp / Messaging",              topic: "System Design (HLD)", status: "locked", file: null },
        { day: 93, title: "Design YouTube / Video Streaming",         topic: "System Design (HLD)", status: "locked", file: null },
        { day: 94, title: "Design a Distributed Cache (like Redis)",  topic: "System Design (HLD)", status: "locked", file: null },
        { day: 95, title: "Phase 3 Synthesis: Full Mock System Design Interview", topic: "System Design (HLD)", status: "locked", file: null },
      ]
    },

    /* ── PHASE 4: AWS & DEVOPS (Weeks 15-18) ─────────────── */

    {
      week: 15, phase: 4, title: "Core AWS",
      days: [
        { day: 96,  title: "AWS Foundations: Regions, AZs, VPC Basics", topic: "AWS", status: "locked", file: null },
        { day: 97,  title: "IAM Deep Dive",                           topic: "AWS", status: "locked", file: null },
        { day: 98,  title: "EC2 Deep Dive",                           topic: "AWS", status: "locked", file: null },
        { day: 99,  title: "S3 Deep Dive",                            topic: "AWS", status: "locked", file: null },
        { day: 100, title: "DynamoDB in Practice",                    topic: "AWS", status: "locked", file: null },
        { day: 101, title: "RDS, Aurora, Read Replicas",              topic: "AWS", status: "locked", file: null },
        { day: 102, title: "Week 15 Synthesis: Design a Multi-Tier Web Architecture", topic: "AWS", status: "locked", file: null },
      ]
    },

    {
      week: 16, phase: 4, title: "Containers & Serverless",
      days: [
        { day: 103, title: "Lambda & Serverless Patterns",            topic: "DevOps", status: "locked", file: null },
        { day: 104, title: "Docker Fundamentals",                     topic: "DevOps", status: "locked", file: null },
        { day: 105, title: "ECR, ECS & Fargate",                     topic: "DevOps", status: "locked", file: null },
        { day: 106, title: "Kubernetes: Core Concepts, Operations & Scaling", topic: "DevOps", status: "locked", file: null },
        { day: 107, title: "EKS on AWS",                             topic: "DevOps", status: "locked", file: null },
        { day: "107a", title: "12-Factor App + Testing Strategy: Contract Tests & Chaos Engineering", topic: "DevOps", status: "locked", file: null,
          note: "12-Factor principles applied to Spring Boot microservices; Pact for consumer-driven contract tests; TestContainers for integration tests; Chaos Monkey / Chaos Engineering principles; Netflix Chaos patterns" },
      ]
    },

    {
      week: 17, phase: 4, title: "CI/CD & IaC",
      days: [
        { day: 108, title: "CI/CD Pipeline Architecture",             topic: "DevOps", status: "locked", file: null },
        { day: 109, title: "GitHub Actions / Jenkins / GitLab CI Patterns", topic: "DevOps", status: "locked", file: null },
        { day: 110, title: "Terraform & IaC Patterns",               topic: "DevOps", status: "locked", file: null },
        { day: 111, title: "Container-Based CD: ArgoCD, Flux (GitOps)", topic: "DevOps", status: "locked", file: null },
        { day: 112, title: "Secrets Management",                     topic: "DevOps", status: "locked", file: null },
        { day: 113, title: "Week 17 Synthesis: Design a Full CI/CD Pipeline", topic: "DevOps", status: "locked", file: null },
      ]
    },

    {
      week: 18, phase: 4, title: "Observability & Reliability",
      days: [
        { day: 114, title: "Observability: Metrics, Logs, Traces",     topic: "DevOps", status: "locked", file: null },
        { day: 115, title: "CloudWatch & AWS Native Observability",   topic: "DevOps", status: "locked", file: null },
        { day: 116, title: "SLI, SLO, SLA, Error Budgets",           topic: "DevOps", status: "locked", file: null },
        { day: 117, title: "Disaster Recovery & Backup Strategies",   topic: "DevOps", status: "locked", file: null },
        { day: 118, title: "AWS Cost Optimization",                   topic: "DevOps", status: "locked", file: null },
        { day: 119, title: "Security Best Practices",                 topic: "DevOps", status: "locked", file: null },
        { day: 120, title: "Phase 4 Synthesis: Design a Production AWS Architecture", topic: "DevOps", status: "locked", file: null },
      ]
    },

    /* ── PHASE 5: AI INTEGRATION (Weeks 19-20) ───────────── */

    {
      week: 19, phase: 5, title: "LLM Fundamentals & Java Frameworks",
      days: [
        { day: 121, title: "LLM Fundamentals for Engineers",            topic: "AI Integration", status: "locked", file: null },
        { day: 122, title: "Prompt Engineering Patterns",             topic: "AI Integration", status: "locked", file: null },
        { day: 123, title: "Spring AI: Architecture & Setup",         topic: "AI Integration", status: "locked", file: null },
        { day: 124, title: "LangChain4j: An Alternative",             topic: "AI Integration", status: "locked", file: null },
        { day: 125, title: "Embeddings & Vector Representations",     topic: "AI Integration", status: "locked", file: null },
        { day: 126, title: "Vector Databases",                        topic: "AI Integration", status: "locked", file: null },
        { day: 127, title: "Week 19 Synthesis: Build a Simple Q&A Bot", topic: "AI Integration", status: "locked", file: null },
      ]
    },

    {
      week: 20, phase: 5, title: "Production AI",
      days: [
        { day: 128, title: "RAG Architecture & Pipeline",             topic: "AI Integration", status: "locked", file: null },
        { day: 129, title: "Advanced RAG: Re-ranking, Hybrid Search, Query Transformation", topic: "AI Integration", status: "locked", file: null },
        { day: 130, title: "LLM Function Calling / Tools",            topic: "AI Integration", status: "locked", file: null },
        { day: 131, title: "Production AI Concerns: Cost, Latency, Reliability", topic: "AI Integration", status: "locked", file: null },
        { day: 132, title: "AI Observability & Evaluation",           topic: "AI Integration", status: "locked", file: null },
        { day: 133, title: "Phase 5 Synthesis: Design an Enterprise RAG System", topic: "AI Integration", status: "locked", file: null },
      ]
    },

    /* ── PHASE 6: INTERVIEW POLISH (Weeks 21-22) ─────────── */

    {
      week: 21, phase: 6, title: "Behavioral & Narrative",
      days: [
        { day: 134, title: "The Behavioral Interview at Staff/Architect Level", topic: "Interview Prep", status: "locked", file: null },
        { day: 135, title: "STAR Method Deep Dive",                   topic: "Interview Prep", status: "locked", file: null },
        { day: 136, title: "Your Story Bank: 12 Core Stories",        topic: "Interview Prep", status: "locked", file: null },
        { day: 137, title: "Behavioral Practice: Conflict, Leadership, Influence", topic: "Interview Prep", status: "locked", file: null },
        { day: 138, title: "Behavioral Practice: Failure, Ambiguity, Trade-offs", topic: "Interview Prep", status: "locked", file: null },
        { day: 139, title: "Salary Negotiation Fundamentals",         topic: "Interview Prep", status: "locked", file: null },
        { day: 140, title: "Resume & LinkedIn for Architect Roles",   topic: "Interview Prep", status: "locked", file: null },
      ]
    },

    {
      week: 22, phase: 6, title: "Full Mock Loops",
      days: [
        { day: 141, title: "Full Mock: Coding Interview",              topic: "Interview Prep", status: "locked", file: null },
        { day: 142, title: "Full Mock: LLD Interview",                topic: "Interview Prep", status: "locked", file: null },
        { day: 143, title: "Full Mock: HLD Interview",                topic: "Interview Prep", status: "locked", file: null },
        { day: 144, title: "Full Mock: Behavioral Interview",         topic: "Interview Prep", status: "locked", file: null },
        { day: 145, title: "Full Loop Day 1: Coding + LLD",           topic: "Interview Prep", status: "locked", file: null },
        { day: 146, title: "Full Loop Day 2: HLD + Behavioral",       topic: "Interview Prep", status: "locked", file: null },
        { day: 147, title: "Phase 6 Synthesis & Curriculum Completion", topic: "Interview Prep", status: "locked", file: null },
      ]
    },
  ]
};

/* Flat lookup helpers used by app.js */
CURRICULUM.allDays = CURRICULUM.weeks.flatMap(w => w.days.map(d => ({ ...d, weekNum: w.week, weekTitle: w.title, phaseId: w.phase })));
CURRICULUM.dayMap  = Object.fromEntries(CURRICULUM.allDays.map(d => [`${d.weekNum}-${d.day}`, d]));
CURRICULUM.total   = CURRICULUM.allDays.length; // 156
