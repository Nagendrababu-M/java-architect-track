/* ============================================================
   Java Architect Track — Glossary
   Used by assets/glossary.js to resolve data-term attributes.
   Add new entries here; they auto-activate on any page that
   tags a term with <span data-term="key">.
   ============================================================ */

const GLOSSARY = {

  /* ── Performance / Metrics ─────────────────────────────── */
  "p50": {
    label: "p50 (median)",
    description: "50th percentile — the median latency value",
    url: "https://en.wikipedia.org/wiki/Percentile",
    type: "wikipedia"
  },
  "p95": {
    label: "p95 latency",
    description: "95th percentile latency — only 5% of requests are slower",
    url: "https://en.wikipedia.org/wiki/Percentile",
    type: "wikipedia"
  },
  "p99": {
    label: "p99 latency",
    description: "99th percentile latency — only 1% of requests are slower",
    url: "https://en.wikipedia.org/wiki/Percentile",
    type: "wikipedia"
  },
  "tail-latency": {
    label: "Tail latency",
    description: "The slowest percentiles of response times that affect user experience disproportionately",
    url: "https://research.google/pubs/the-tail-at-scale/",
    type: "paper"
  },

  /* ── Data Structures / Algorithms ──────────────────────── */
  "lifo": {
    label: "LIFO",
    description: "Last-In-First-Out — the stack ordering principle",
    url: "https://en.wikipedia.org/wiki/Stack_(abstract_data_type)",
    type: "wikipedia"
  },
  "fifo": {
    label: "FIFO",
    description: "First-In-First-Out — the queue ordering principle",
    url: "https://en.wikipedia.org/wiki/FIFO_(computing_and_electronics)",
    type: "wikipedia"
  },

  /* ── Distributed Systems ────────────────────────────────── */
  "cap-theorem": {
    label: "CAP Theorem",
    description: "Consistency, Availability, Partition tolerance — pick two",
    url: "https://en.wikipedia.org/wiki/CAP_theorem",
    type: "wikipedia"
  },
  "pacelc": {
    label: "PACELC Theorem",
    description: "Extension of CAP — even without partitions, choose between latency and consistency",
    url: "https://en.wikipedia.org/wiki/PACELC_theorem",
    type: "wikipedia"
  },
  "consistent-hashing": {
    label: "Consistent Hashing",
    description: "Hashing technique that minimizes key remapping when nodes are added or removed",
    url: "https://www.toptal.com/big-data/consistent-hashing",
    type: "article"
  },
  "idempotent": {
    label: "Idempotency",
    description: "An operation that produces the same result no matter how many times it runs",
    url: "https://en.wikipedia.org/wiki/Idempotence",
    type: "wikipedia"
  },

  /* ── JVM / Concurrency ──────────────────────────────────── */
  "jit": {
    label: "JIT Compilation",
    description: "Just-In-Time compilation — bytecode compiled to native code at runtime",
    url: "https://en.wikipedia.org/wiki/Just-in-time_compilation",
    type: "wikipedia"
  },
  "cas": {
    label: "Compare-and-Swap (CAS)",
    description: "Atomic CPU instruction used for lock-free synchronization",
    url: "https://en.wikipedia.org/wiki/Compare-and-swap",
    type: "wikipedia"
  },
  "happens-before": {
    label: "happens-before",
    description: "Memory model ordering guarantee between operations across threads",
    url: "https://docs.oracle.com/javase/specs/jls/se17/html/jls-17.html#jls-17.4.5",
    type: "docs"
  },
  "littles-law": {
    label: "Little's Law",
    description: "L = λ × W. Concurrency = arrival rate × wait time. Foundation of capacity planning.",
    url: "https://en.wikipedia.org/wiki/Little%27s_law",
    type: "wikipedia"
  },

  /* ── SRE / Production ───────────────────────────────────── */
  "sla": {
    label: "SLA — Service Level Agreement",
    description: "Customer-facing contract on service performance, often legally binding",
    url: "https://sre.google/sre-book/service-level-objectives/",
    type: "book"
  },
  "slo": {
    label: "SLO — Service Level Objective",
    description: "Internal performance target your team commits to (e.g. 99.9% uptime)",
    url: "https://sre.google/sre-book/service-level-objectives/",
    type: "book"
  },
  "sli": {
    label: "SLI — Service Level Indicator",
    description: "The actual measurement (e.g. success rate, latency) that feeds your SLO",
    url: "https://sre.google/sre-book/service-level-objectives/",
    type: "book"
  },

  /* ── Data / Storage ─────────────────────────────────────── */
  "mvcc": {
    label: "MVCC",
    description: "Multi-Version Concurrency Control — how databases handle concurrent reads/writes without blocking",
    url: "https://en.wikipedia.org/wiki/Multiversion_concurrency_control",
    type: "wikipedia"
  },
  "acid": {
    label: "ACID",
    description: "Atomicity, Consistency, Isolation, Durability — the four properties of reliable transactions",
    url: "https://en.wikipedia.org/wiki/ACID",
    type: "wikipedia"
  },
  "base": {
    label: "BASE",
    description: "Basically Available, Soft-state, Eventually consistent — the NoSQL counterpart to ACID",
    url: "https://en.wikipedia.org/wiki/Eventual_consistency",
    type: "wikipedia"
  },

  /* ── Kafka / Streaming ──────────────────────────────────── */
  "exactly-once": {
    label: "Exactly-once semantics",
    description: "Guarantee that each message is processed exactly once — harder than it sounds",
    url: "https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/",
    type: "article"
  },

  /* ── Patterns ───────────────────────────────────────────── */
  "saga": {
    label: "Saga Pattern",
    description: "Long-running distributed transaction modeled as a sequence of local transactions with compensations",
    url: "https://microservices.io/patterns/data/saga.html",
    type: "article"
  },
  "circuit-breaker": {
    label: "Circuit Breaker Pattern",
    description: "Resilience pattern that stops calls to a failing service to prevent cascading failure",
    url: "https://martinfowler.com/bliki/CircuitBreaker.html",
    type: "article"
  }

};
