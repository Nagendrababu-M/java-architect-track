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
          duration: 60, topic: "JVM Memory", status: "done",
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
          duration: 60, topic: "JVM Memory", status: "done",
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
          duration: 60, topic: "Garbage Collection", status: "done",
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
        { day: 4, title: "GC Algorithms, Tuning & Profiling", duration: 180, topic: "Garbage Collection", status: "locked", file: null, heavy: true },
        { day: 5, title: "Java Memory Model & Happens-Before",  duration: 90,  topic: "Concurrency",        status: "locked", file: null, heavy: true },
        { day: 6, title: "JFR & async-profiler",               duration: 60,  topic: "JVM Memory",         status: "locked", file: null },
        { day: 7, title: "Week 1 Production Diagnosis Synthesis", duration: 60, topic: "JVM Memory",       status: "locked", file: null },
      ]
    },

    {
      week: 2, phase: 1, title: "Concurrency",
      days: [
        { day: 8,  title: "Thread Pools & ExecutorService",     duration: 60, topic: "Concurrency", status: "locked", file: null },
        { day: 9,  title: "synchronized, ReentrantLock & Conditions", duration: 60, topic: "Concurrency", status: "locked", file: null },
        { day: 10, title: "Atomics, CAS & Lock-Free Structures", duration: 90, topic: "Concurrency", status: "locked", file: null, heavy: true },
        { day: 11, title: "CompletableFuture & Async Pipelines", duration: 60, topic: "Concurrency", status: "locked", file: null },
        { day: 12, title: "Virtual Threads (Project Loom)",      duration: 90, topic: "Concurrency", status: "locked", file: null, heavy: true },
        { day: 13, title: "ConcurrentCollections & Patterns",    duration: 60, topic: "Concurrency", status: "locked", file: null },
        { day: 14, title: "Rate Limiter Synthesis",              duration: 60, topic: "Concurrency", status: "locked", file: null },
      ]
    },

    {
      week: 3, phase: 1, title: "Spring Boot & Reactive",
      days: [
        { day: 15, title: "Spring Boot Internals",               duration: 60, topic: "Spring",   status: "locked", file: null },
        { day: 16, title: "Bean Lifecycle, AOP & Proxies",        duration: 60, topic: "Spring",   status: "locked", file: null },
        { day: 17, title: "@Transactional Deep-Dive",             duration: 60, topic: "Spring",   status: "locked", file: null },
        { day: 18, title: "Reactive Foundations",                 duration: 90, topic: "Reactive", status: "locked", file: null, heavy: true },
        { day: 19, title: "Project Reactor Operators",            duration: 90, topic: "Reactive", status: "locked", file: null, heavy: true },
        { day: 20, title: "WebFlux End-to-End",                   duration: 60, topic: "Reactive", status: "locked", file: null },
        { day: 21, title: "Reactive vs Virtual Threads — ADR Capstone", duration: 60, topic: "Reactive", status: "locked", file: null },
      ]
    },

    /* ── PHASE 2: DSA (Weeks 4-7) ────────────────────────── */

    {
      week: 4, phase: 2, title: "Arrays & Strings",
      days: [
        { day: 22, title: "Two Pointers Pattern",                duration: 60, topic: "DSA — Arrays/Strings", status: "locked", file: null },
        { day: 23, title: "Sliding Window — Fixed Size",         duration: 60, topic: "DSA — Arrays/Strings", status: "locked", file: null },
        { day: 24, title: "Sliding Window — Variable Size",      duration: 90, topic: "DSA — Arrays/Strings", status: "locked", file: null, heavy: true },
        { day: 25, title: "Prefix Sums & Range Queries",         duration: 60, topic: "DSA — Arrays/Strings", status: "locked", file: null },
        { day: 26, title: "String Manipulation Patterns",        duration: 60, topic: "DSA — Arrays/Strings", status: "locked", file: null },
        { day: 27, title: "Array Rotations & In-Place Tricks",   duration: 60, topic: "DSA — Arrays/Strings", status: "locked", file: null },
        { day: 28, title: "Arrays/Strings Synthesis Drill",      duration: 60, topic: "DSA — Arrays/Strings", status: "locked", file: null },
      ]
    },

    {
      week: 5, phase: 2, title: "Trees & Graphs",
      days: [
        { day: 29, title: "Binary Tree Traversals",              duration: 60, topic: "DSA — Trees/Graphs", status: "locked", file: null },
        { day: 30, title: "Binary Search Trees",                 duration: 60, topic: "DSA — Trees/Graphs", status: "locked", file: null },
        { day: 31, title: "DFS Patterns",                        duration: 90, topic: "DSA — Trees/Graphs", status: "locked", file: null, heavy: true },
        { day: 32, title: "Graph BFS",                           duration: 60, topic: "DSA — Trees/Graphs", status: "locked", file: null },
        { day: 33, title: "DFS & Cycle Detection",               duration: 60, topic: "DSA — Trees/Graphs", status: "locked", file: null },
        { day: 34, title: "Topological Sort & Union-Find",       duration: 90, topic: "DSA — Trees/Graphs", status: "locked", file: null, heavy: true },
        { day: 35, title: "Trees/Graphs Synthesis",              duration: 60, topic: "DSA — Trees/Graphs", status: "locked", file: null },
      ]
    },

    {
      week: 6, phase: 2, title: "Dynamic Programming",
      days: [
        { day: 36, title: "DP Foundations & Memoization",        duration: 60, topic: "DSA — DP", status: "locked", file: null },
        { day: 37, title: "1D Dynamic Programming",              duration: 60, topic: "DSA — DP", status: "locked", file: null },
        { day: 38, title: "Grid DP (2D)",                        duration: 60, topic: "DSA — DP", status: "locked", file: null },
        { day: 39, title: "Knapsack Variants",                   duration: 90, topic: "DSA — DP", status: "locked", file: null, heavy: true },
        { day: 40, title: "String DP (Edit Distance, LCS)",      duration: 60, topic: "DSA — DP", status: "locked", file: null },
        { day: 41, title: "Interval DP & Stocks",                duration: 60, topic: "DSA — DP", status: "locked", file: null },
        { day: 42, title: "DP Pattern Identification Synthesis", duration: 60, topic: "DSA — DP", status: "locked", file: null },
      ]
    },

    {
      week: 7, phase: 2, title: "Advanced DSA",
      days: [
        { day: 43, title: "Heaps & Priority Queues",             duration: 60, topic: "DSA — Advanced", status: "locked", file: null },
        { day: 44, title: "Two Heaps Pattern",                   duration: 60, topic: "DSA — Advanced", status: "locked", file: null },
        { day: 45, title: "Tries",                               duration: 90, topic: "DSA — Advanced", status: "locked", file: null, heavy: true },
        { day: 46, title: "Backtracking",                        duration: 60, topic: "DSA — Advanced", status: "locked", file: null },
        { day: 47, title: "Binary Search Mastery",               duration: 60, topic: "DSA — Advanced", status: "locked", file: null },
        { day: 48, title: "Greedy Patterns",                     duration: 60, topic: "DSA — Advanced", status: "locked", file: null },
        { day: 49, title: "Mock Coding Interview",               duration: 90, topic: "DSA — Advanced", status: "locked", file: null },
      ]
    },

    /* ── PHASE 3: SYSTEM DESIGN (Weeks 8-14) ─────────────── */

    {
      week: 8, phase: 3, title: "LLD Foundations",
      days: [
        { day: 50, title: "OO Principles Review",               duration: 60, topic: "System Design (LLD)", status: "locked", file: null },
        { day: 51, title: "SOLID Part 1 (SRP, OCP, LSP)",       duration: 90, topic: "System Design (LLD)", status: "locked", file: null, heavy: true },
        { day: 52, title: "SOLID Part 2 (ISP, DIP)",            duration: 60, topic: "System Design (LLD)", status: "locked", file: null },
        { day: 53, title: "Creational Patterns",                 duration: 60, topic: "System Design (LLD)", status: "locked", file: null },
        { day: 54, title: "Structural Patterns",                 duration: 60, topic: "System Design (LLD)", status: "locked", file: null },
        { day: 55, title: "Behavioral Patterns",                 duration: 90, topic: "System Design (LLD)", status: "locked", file: null, heavy: true },
        { day: 56, title: "Refactoring Synthesis",               duration: 60, topic: "System Design (LLD)", status: "locked", file: null },
      ]
    },

    {
      week: 9, phase: 3, title: "LLD Practice",
      days: [
        { day: 57, title: "LLD: Parking Lot",                   duration: 90, topic: "System Design (LLD)", status: "locked", file: null, heavy: true },
        { day: 58, title: "LLD: Rate Limiter",                  duration: 60, topic: "System Design (LLD)", status: "locked", file: null },
        { day: 59, title: "LLD: LRU Cache",                     duration: 90, topic: "System Design (LLD)", status: "locked", file: null, heavy: true },
        { day: 60, title: "LLD: Logger & Notification System",  duration: 60, topic: "System Design (LLD)", status: "locked", file: null },
        { day: 61, title: "LLD: Splitwise",                     duration: 60, topic: "System Design (LLD)", status: "locked", file: null },
        { day: 62, title: "LLD: Elevator",                      duration: 60, topic: "System Design (LLD)", status: "locked", file: null },
        { day: 63, title: "Mock LLD Interview",                  duration: 90, topic: "System Design (LLD)", status: "locked", file: null },
      ]
    },

    {
      week: 10, phase: 3, title: "HLD Theory",
      days: [
        { day: 64, title: "CAP Theorem",                         duration: 90, topic: "System Design (HLD)", status: "locked", file: null, heavy: true },
        { day: 65, title: "PACELC & Consistency Models",         duration: 60, topic: "System Design (HLD)", status: "locked", file: null },
        { day: 66, title: "Load Balancing",                      duration: 90, topic: "System Design (HLD)", status: "locked", file: null, heavy: true },
        { day: 67, title: "Consistent Hashing",                  duration: 90, topic: "System Design (HLD)", status: "locked", file: null, heavy: true },
        { day: 68, title: "Caching Strategies",                  duration: 60, topic: "System Design (HLD)", status: "locked", file: null },
        { day: 69, title: "CDNs & Edge Caching",                 duration: 60, topic: "System Design (HLD)", status: "locked", file: null },
        { day: 70, title: "Decision Matrix Synthesis",           duration: 60, topic: "System Design (HLD)", status: "locked", file: null },
      ]
    },

    {
      week: 11, phase: 3, title: "Storage",
      days: [
        { day: 71, title: "SQL Internals & Indexes",             duration: 60, topic: "System Design (HLD)", status: "locked", file: null },
        { day: 72, title: "Sharding & Replication",              duration: 90, topic: "System Design (HLD)", status: "locked", file: null, heavy: true },
        { day: 73, title: "NoSQL Landscape",                     duration: 90, topic: "System Design (HLD)", status: "locked", file: null, heavy: true },
        { day: 74, title: "DynamoDB Deep-Dive",                  duration: 90, topic: "System Design (HLD)", status: "locked", file: null, heavy: true },
        { day: 75, title: "Time-Series Databases",               duration: 60, topic: "System Design (HLD)", status: "locked", file: null },
        { day: 76, title: "DB Selection Framework",              duration: 60, topic: "System Design (HLD)", status: "locked", file: null },
        { day: 77, title: "Schema Design Patterns",              duration: 60, topic: "System Design (HLD)", status: "locked", file: null },
      ]
    },

    {
      week: 12, phase: 3, title: "Messaging",
      days: [
        { day: 78, title: "Queue vs Pub/Sub",                    duration: 60, topic: "Microservices", status: "locked", file: null },
        { day: 79, title: "Kafka Internals",                     duration: 90, topic: "Microservices", status: "locked", file: null, heavy: true },
        { day: 80, title: "Kafka Consumer Groups",               duration: 90, topic: "Microservices", status: "locked", file: null, heavy: true },
        { day: 81, title: "Exactly-Once Semantics",              duration: 60, topic: "Microservices", status: "locked", file: null },
        { day: 82, title: "Event Sourcing & CQRS",               duration: 60, topic: "Microservices", status: "locked", file: null },
        { day: 83, title: "Stream Processing",                   duration: 60, topic: "Microservices", status: "locked", file: null },
        { day: 84, title: "Event-Driven Order System",           duration: 60, topic: "Microservices", status: "locked", file: null },
      ]
    },

    {
      week: 13, phase: 3, title: "Microservices",
      days: [
        { day: 85, title: "Monolith vs Microservices Trade-offs",duration: 60, topic: "Microservices", status: "locked", file: null },
        { day: 86, title: "DDD & Bounded Contexts",              duration: 60, topic: "Microservices", status: "locked", file: null },
        { day: 87, title: "Saga Pattern",                        duration: 90, topic: "Microservices", status: "locked", file: null, heavy: true },
        { day: 88, title: "API Gateway, BFF & Service Mesh",     duration: 60, topic: "Microservices", status: "locked", file: null },
        { day: 89, title: "Service Discovery",                   duration: 60, topic: "Microservices", status: "locked", file: null },
        { day: 90, title: "Resilience Patterns",                 duration: 90, topic: "Microservices", status: "locked", file: null, heavy: true },
        { day: 91, title: "Microservices Migration ADR",         duration: 60, topic: "Microservices", status: "locked", file: null },
      ]
    },

    {
      week: 14, phase: 3, title: "HLD Mock Designs",
      days: [
        { day: 92, title: "HLD Mock: TinyURL",                  duration: 90,  topic: "System Design (HLD)", status: "locked", file: null, heavy: true },
        { day: 93, title: "HLD Mock: Twitter/X",                duration: 90,  topic: "System Design (HLD)", status: "locked", file: null, heavy: true },
        { day: 94, title: "HLD Mock: Uber",                     duration: 90,  topic: "System Design (HLD)", status: "locked", file: null, heavy: true },
        { day: 95, title: "HLD Mock: WhatsApp",                 duration: 90,  topic: "System Design (HLD)", status: "locked", file: null, heavy: true },
        { day: 96, title: "HLD Mock: YouTube",                  duration: 60,  topic: "System Design (HLD)", status: "locked", file: null },
        { day: 97, title: "HLD Mock: Distributed Cache",        duration: 60,  topic: "System Design (HLD)", status: "locked", file: null },
        { day: 98, title: "Full Mock Interview",                 duration: 120, topic: "System Design (HLD)", status: "locked", file: null },
      ]
    },

    /* ── PHASE 4: AWS & DEVOPS (Weeks 15-18) ─────────────── */

    {
      week: 15, phase: 4, title: "Core AWS",
      days: [
        { day: 99,  title: "Regions, AZs & VPC",                duration: 60, topic: "AWS",    status: "locked", file: null },
        { day: 100, title: "IAM: Roles, Policies & Best Practices", duration: 90, topic: "AWS", status: "locked", file: null, heavy: true },
        { day: 101, title: "EC2: Instances, AMIs & Pricing",    duration: 60, topic: "AWS",    status: "locked", file: null },
        { day: 102, title: "S3: Storage Classes & Patterns",    duration: 90, topic: "AWS",    status: "locked", file: null, heavy: true },
        { day: 103, title: "DynamoDB on AWS",                   duration: 60, topic: "AWS",    status: "locked", file: null },
        { day: 104, title: "RDS & Aurora",                      duration: 60, topic: "AWS",    status: "locked", file: null },
        { day: 105, title: "Multi-Tier Architecture Synthesis", duration: 60, topic: "AWS",    status: "locked", file: null },
      ]
    },

    {
      week: 16, phase: 4, title: "Containers & Serverless",
      days: [
        { day: 106, title: "Lambda Functions",                  duration: 60, topic: "DevOps", status: "locked", file: null },
        { day: 107, title: "Lambda Patterns & Cold Starts",     duration: 90, topic: "DevOps", status: "locked", file: null, heavy: true },
        { day: 108, title: "Docker Fundamentals",               duration: 60, topic: "DevOps", status: "locked", file: null },
        { day: 109, title: "ECR, ECS & Fargate",                duration: 60, topic: "DevOps", status: "locked", file: null },
        { day: 110, title: "Kubernetes Core Concepts",          duration: 90, topic: "DevOps", status: "locked", file: null, heavy: true },
        { day: 111, title: "K8s Operations & Scaling",          duration: 90, topic: "DevOps", status: "locked", file: null, heavy: true },
        { day: 112, title: "EKS on AWS",                        duration: 60, topic: "DevOps", status: "locked", file: null },
      ]
    },

    {
      week: 17, phase: 4, title: "CI/CD & IaC",
      days: [
        { day: 113, title: "CI/CD Pipeline Architecture",       duration: 60, topic: "DevOps", status: "locked", file: null },
        { day: 114, title: "GitHub Actions & Jenkins",          duration: 60, topic: "DevOps", status: "locked", file: null },
        { day: 115, title: "Terraform Fundamentals",            duration: 90, topic: "DevOps", status: "locked", file: null, heavy: true },
        { day: 116, title: "Terraform Patterns & Modules",      duration: 60, topic: "DevOps", status: "locked", file: null },
        { day: 117, title: "GitOps & ArgoCD",                   duration: 90, topic: "DevOps", status: "locked", file: null, heavy: true },
        { day: 118, title: "Secrets Management",                duration: 60, topic: "DevOps", status: "locked", file: null },
        { day: 119, title: "Full Pipeline Synthesis",           duration: 60, topic: "DevOps", status: "locked", file: null },
      ]
    },

    {
      week: 18, phase: 4, title: "Observability & Reliability",
      days: [
        { day: 120, title: "Metrics, Logs & Traces",            duration: 90, topic: "DevOps", status: "locked", file: null, heavy: true },
        { day: 121, title: "CloudWatch & AWS Observability",    duration: 60, topic: "DevOps", status: "locked", file: null },
        { day: 122, title: "SLI, SLO & SLA",                   duration: 60, topic: "DevOps", status: "locked", file: null },
        { day: 123, title: "DR & Backup Strategies",            duration: 60, topic: "DevOps", status: "locked", file: null },
        { day: 124, title: "Cost Optimization",                 duration: 90, topic: "DevOps", status: "locked", file: null, heavy: true },
        { day: 125, title: "Security & Compliance",             duration: 60, topic: "DevOps", status: "locked", file: null },
        { day: 126, title: "Production Architecture Capstone",  duration: 60, topic: "DevOps", status: "locked", file: null },
      ]
    },

    /* ── PHASE 5: AI INTEGRATION (Weeks 19-20) ───────────── */

    {
      week: 19, phase: 5, title: "LLM Fundamentals & Java Frameworks",
      days: [
        { day: 127, title: "LLM Basics & Architecture",         duration: 60, topic: "AI Integration", status: "locked", file: null },
        { day: 128, title: "Prompt Engineering",                duration: 60, topic: "AI Integration", status: "locked", file: null },
        { day: 129, title: "Spring AI",                         duration: 60, topic: "AI Integration", status: "locked", file: null },
        { day: 130, title: "LangChain4j",                       duration: 90, topic: "AI Integration", status: "locked", file: null, heavy: true },
        { day: 131, title: "Embeddings & Semantic Search",      duration: 90, topic: "AI Integration", status: "locked", file: null, heavy: true },
        { day: 132, title: "Vector Databases",                  duration: 90, topic: "AI Integration", status: "locked", file: null, heavy: true },
        { day: 133, title: "Q&A Bot Mini-Project",              duration: 60, topic: "AI Integration", status: "locked", file: null },
      ]
    },

    {
      week: 20, phase: 5, title: "Production AI",
      days: [
        { day: 134, title: "RAG Architecture",                  duration: 60, topic: "AI Integration", status: "locked", file: null },
        { day: 135, title: "RAG Pipeline Implementation",       duration: 90, topic: "AI Integration", status: "locked", file: null, heavy: true },
        { day: 136, title: "Advanced RAG (Hybrid, Re-ranking)", duration: 90, topic: "AI Integration", status: "locked", file: null, heavy: true },
        { day: 137, title: "LLM Tool Calling & Agents",         duration: 90, topic: "AI Integration", status: "locked", file: null, heavy: true },
        { day: 138, title: "Production Concerns (Cost, Latency, Reliability)", duration: 60, topic: "AI Integration", status: "locked", file: null },
        { day: 139, title: "LLM Observability & Evaluation",    duration: 60, topic: "AI Integration", status: "locked", file: null },
        { day: 140, title: "Enterprise RAG System Design Capstone", duration: 90, topic: "AI Integration", status: "locked", file: null },
      ]
    },

    /* ── PHASE 6: INTERVIEW POLISH (Weeks 21-22) ─────────── */

    {
      week: 21, phase: 6, title: "Behavioral & Narrative",
      days: [
        { day: 141, title: "Architect-Level Behavioral Framing", duration: 60, topic: "Interview Prep", status: "locked", file: null },
        { day: 142, title: "STAR Deep-Dive",                     duration: 90, topic: "Interview Prep", status: "locked", file: null, heavy: true },
        { day: 143, title: "12-Story Bank Construction",         duration: 90, topic: "Interview Prep", status: "locked", file: null, heavy: true },
        { day: 144, title: "Conflict, Leadership & Influence",   duration: 60, topic: "Interview Prep", status: "locked", file: null },
        { day: 145, title: "Failure & Ambiguity Practice",       duration: 60, topic: "Interview Prep", status: "locked", file: null },
        { day: 146, title: "Salary Negotiation",                 duration: 90, topic: "Interview Prep", status: "locked", file: null, heavy: true },
        { day: 147, title: "Resume & LinkedIn Refresh",          duration: 60, topic: "Interview Prep", status: "locked", file: null },
      ]
    },

    {
      week: 22, phase: 6, title: "Full Mock Loops",
      days: [
        { day: 148, title: "Mock Interview: Coding",             duration: 90,  topic: "Interview Prep", status: "locked", file: null },
        { day: 149, title: "Mock Interview: LLD",                duration: 90,  topic: "Interview Prep", status: "locked", file: null },
        { day: 150, title: "Mock Interview: HLD",                duration: 90,  topic: "Interview Prep", status: "locked", file: null },
        { day: 151, title: "Mock Interview: Behavioral",         duration: 90,  topic: "Interview Prep", status: "locked", file: null },
        { day: 152, title: "Full Loop Day 1 (Coding + LLD)",     duration: 120, topic: "Interview Prep", status: "locked", file: null },
        { day: 153, title: "Full Loop Day 2 (HLD + Behavioral)", duration: 120, topic: "Interview Prep", status: "locked", file: null },
        { day: 154, title: "Retrospective & Curriculum Completion", duration: 60, topic: "Interview Prep", status: "locked", file: null },
      ]
    },
  ]
};

/* Flat lookup helpers used by app.js */
CURRICULUM.allDays = CURRICULUM.weeks.flatMap(w => w.days.map(d => ({ ...d, weekNum: w.week, weekTitle: w.title, phaseId: w.phase })));
CURRICULUM.dayMap  = Object.fromEntries(CURRICULUM.allDays.map(d => [`${d.weekNum}-${d.day}`, d]));
CURRICULUM.total   = CURRICULUM.allDays.length; // 154
