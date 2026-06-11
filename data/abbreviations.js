/* ============================================================
   Java Architect Track — Abbreviations
   Used by assets/abbreviations.js to resolve <abbr data-abbr="KEY">.
   Add new entries here; they auto-activate on any page that
   tags an abbreviation with <abbr data-abbr="KEY">.
   ============================================================ */

const ABBREVIATIONS = {

  /* ── JVM / Java ─────────────────────────────────────────── */
  "JVM": {
    expansion: "Java Virtual Machine",
    definition: "The runtime that executes Java bytecode. Provides memory management, JIT compilation, and the platform abstraction that makes 'write once, run anywhere' work.",
    learnMore: null
  },
  "JMM": {
    expansion: "Java Memory Model",
    definition: "The specification of how threads interact through memory. Defines happens-before, volatile semantics, and visibility guarantees.",
    learnMore: "https://docs.oracle.com/javase/specs/jls/se17/html/jls-17.html"
  },
  "GC": {
    expansion: "Garbage Collector",
    definition: "JVM subsystem that automatically reclaims memory occupied by unreachable objects.",
    learnMore: null
  },
  "STW": {
    expansion: "Stop-the-World",
    definition: "A pause where all application threads freeze while the GC works. The #1 source of latency spikes in JVM apps.",
    learnMore: null
  },
  "JFR": {
    expansion: "Java Flight Recorder",
    definition: "Built-in JVM profiling and event recording framework. Low-overhead, production-safe.",
    learnMore: "https://docs.oracle.com/en/java/javase/17/jfapi/"
  },
  "JIT": {
    expansion: "Just-In-Time compilation",
    definition: "Runtime compilation of bytecode to native machine code, applied to hot code paths for speed.",
    learnMore: null
  },
  "TLAB": {
    expansion: "Thread-Local Allocation Buffer",
    definition: "Per-thread region of the heap's young generation where new objects are allocated without locking.",
    learnMore: "https://shipilev.net/jvm/anatomy-quarks/4-tlab-allocation/"
  },
  "LTS": {
    expansion: "Long-Term Support",
    definition: "A Java release with multi-year vendor support (8, 11, 17, 21). Production fleets standardize on LTS versions; non-LTS releases get only six months of updates.",
    learnMore: null
  },
  "JEP": {
    expansion: "JDK Enhancement Proposal",
    definition: "The formal process by which new features are proposed and tracked in OpenJDK.",
    learnMore: "https://openjdk.org/jeps/0"
  },
  "JNI": {
    expansion: "Java Native Interface",
    definition: "API that allows Java code to call (and be called by) native code written in C/C++.",
    learnMore: null
  },
  "CAS": {
    expansion: "Compare-And-Swap",
    definition: "Atomic CPU instruction used for lock-free synchronization. The foundation of java.util.concurrent.atomic.",
    learnMore: null
  },

  /* ── Design Patterns / Architecture ─────────────────────── */
  "AOP": {
    expansion: "Aspect-Oriented Programming",
    definition: "Programming paradigm for separating cross-cutting concerns (logging, transactions) from business logic.",
    learnMore: null
  },
  "DI": {
    expansion: "Dependency Injection",
    definition: "Design pattern where dependencies are provided to a class rather than constructed internally.",
    learnMore: null
  },
  "IoC": {
    expansion: "Inversion of Control",
    definition: "Design principle where framework calls your code instead of your code calling the framework. DI is one way to achieve it.",
    learnMore: null
  },
  "ORM": {
    expansion: "Object-Relational Mapping",
    definition: "Pattern that maps database tables to objects. Hibernate and JPA are Java's main ORM implementations.",
    learnMore: null
  },
  "CQRS": {
    expansion: "Command Query Responsibility Segregation",
    definition: "Pattern separating read and write data models for scalability or clarity.",
    learnMore: "https://martinfowler.com/bliki/CQRS.html"
  },
  "DDD": {
    expansion: "Domain-Driven Design",
    definition: "Software design approach centered on modeling the business domain. Eric Evans' blue book is canonical.",
    learnMore: null
  },
  "CDC": {
    expansion: "Change Data Capture",
    definition: "Pattern for tracking and propagating database changes to other systems. Debezium is the canonical OSS tool.",
    learnMore: null
  },

  /* ── Networking / Protocols ──────────────────────────────── */
  "API": {
    expansion: "Application Programming Interface",
    definition: "A contract that defines how one software component talks to another.",
    learnMore: null
  },
  "REST": {
    expansion: "Representational State Transfer",
    definition: "Architectural style for designing networked APIs using HTTP verbs and resource URIs.",
    learnMore: null
  },
  "RPC": {
    expansion: "Remote Procedure Call",
    definition: "Pattern where a client invokes a function on a remote server as if it were local. gRPC is the modern incarnation.",
    learnMore: null
  },
  "TCP": {
    expansion: "Transmission Control Protocol",
    definition: "Reliable, connection-oriented network protocol. The 'TCP' in TCP/IP.",
    learnMore: null
  },
  "UDP": {
    expansion: "User Datagram Protocol",
    definition: "Unreliable, connectionless network protocol. Lower overhead than TCP, used for streaming/games.",
    learnMore: null
  },
  "HTTP": {
    expansion: "HyperText Transfer Protocol",
    definition: "Application-layer protocol for transferring web content. Built on TCP.",
    learnMore: null
  },
  "DNS": {
    expansion: "Domain Name System",
    definition: "Internet protocol that translates human-readable domain names into IP addresses.",
    learnMore: null
  },
  "CDN": {
    expansion: "Content Delivery Network",
    definition: "Geographically distributed network of servers that cache content close to users.",
    learnMore: null
  },

  /* ── Data / Storage ─────────────────────────────────────── */
  "SQL": {
    expansion: "Structured Query Language",
    definition: "Domain-specific language for managing relational databases.",
    learnMore: null
  },
  "JSON": {
    expansion: "JavaScript Object Notation",
    definition: "Lightweight data interchange format. Human-readable, machine-parseable.",
    learnMore: null
  },
  "YAML": {
    expansion: "YAML Ain't Markup Language",
    definition: "Human-readable data serialization format. Common in config files (Kubernetes, GitHub Actions).",
    learnMore: null
  },

  /* ── Cloud / DevOps ─────────────────────────────────────── */
  "AWS": {
    expansion: "Amazon Web Services",
    definition: "Amazon's cloud platform. Market leader in cloud infrastructure.",
    learnMore: null
  },
  "EC2": {
    expansion: "Elastic Compute Cloud",
    definition: "AWS's virtual server service. The foundational compute primitive.",
    learnMore: null
  },
  "S3": {
    expansion: "Simple Storage Service",
    definition: "AWS's object storage service. Foundation of most data architectures on AWS.",
    learnMore: null
  },
  "VPC": {
    expansion: "Virtual Private Cloud",
    definition: "Logically isolated section of a cloud network. Your private network in AWS.",
    learnMore: null
  },
  "IAM": {
    expansion: "Identity and Access Management",
    definition: "AWS's authentication and authorization system. Most cloud security incidents trace back to IAM mistakes.",
    learnMore: null
  },
  "K8s": {
    expansion: "Kubernetes",
    definition: "Container orchestration platform. The '8' stands for the 8 letters between K and s.",
    learnMore: null
  },
  "CI/CD": {
    expansion: "Continuous Integration / Continuous Deployment",
    definition: "Practices for automatically testing and deploying code changes as they're merged.",
    learnMore: null
  },
  "IaC": {
    expansion: "Infrastructure as Code",
    definition: "Practice of managing infrastructure through machine-readable definitions (Terraform, CloudFormation) rather than manual config.",
    learnMore: null
  },

  /* ── SRE / Reliability ───────────────────────────────────── */
  "SRE": {
    expansion: "Site Reliability Engineering",
    definition: "Discipline that applies software engineering principles to operations. Originated at Google.",
    learnMore: "https://sre.google/sre-book/table-of-contents/"
  },
  "SLA": {
    expansion: "Service Level Agreement",
    definition: "Customer-facing contract on service performance. Often legally binding.",
    learnMore: null
  },
  "SLO": {
    expansion: "Service Level Objective",
    definition: "Internal performance target your team commits to (e.g. 99.9% uptime).",
    learnMore: null
  },
  "SLI": {
    expansion: "Service Level Indicator",
    definition: "The actual measurement (success rate, latency) that feeds your SLO.",
    learnMore: null
  },
  "RTO": {
    expansion: "Recovery Time Objective",
    definition: "Maximum acceptable downtime after a failure. The 'how fast must we recover' number.",
    learnMore: null
  },
  "RPO": {
    expansion: "Recovery Point Objective",
    definition: "Maximum acceptable data loss measured in time. The 'how much can we lose' number.",
    learnMore: null
  },
  "DR": {
    expansion: "Disaster Recovery",
    definition: "The planning and execution of restoring service after a major failure event.",
    learnMore: null
  },

  /* ── AI / ML ─────────────────────────────────────────────── */
  "LLM": {
    expansion: "Large Language Model",
    definition: "Neural network trained on large text corpora, capable of generating and understanding natural language.",
    learnMore: null
  },
  "RAG": {
    expansion: "Retrieval-Augmented Generation",
    definition: "Pattern that retrieves relevant context from a knowledge base before asking an LLM to generate an answer.",
    learnMore: null
  },
  "ANN": {
    expansion: "Approximate Nearest Neighbor",
    definition: "Algorithms for finding similar vectors quickly without exhaustive comparison. The basis of vector search.",
    learnMore: null
  }

};
