# Phase 3 — System Design: LLD + HLD (Weeks 8–14, Days 49–95)

> **Goal:** This is the phase that defines architect-level competence. By Day 95 you should be able to walk into any system design interview, drive the conversation, and defend every decision with trade-offs.
>
> **Most important phase of the curriculum.** Protect time here; trim elsewhere if needed.

---

## Week 8 — LLD Foundations: SOLID + Core Patterns (Days 49–54)

### Day 49 — Object-Oriented Design Principles Revisited
- **Core concepts:** Encapsulation, inheritance vs composition (favor composition), Tell Don't Ask, Law of Demeter
- **Architect lens:** Bad OO design = future refactoring tax
- **Interview signal:** Code review questions probe these
- **Resources:**
  - *Clean Code* — Robert C. Martin (Chapters 1-3 minimum)
  - "Composition vs Inheritance" — multiple talks

### Day 50 — SOLID Principles (SRP, OCP, LSP, ISP, DIP)
- **Core concepts:**
  - **SRP** — Single Responsibility: "reason to change" framing, not just one method
  - **OCP** — Open/Closed: strategy pattern as the enabler
  - **LSP** — Liskov Substitution: subclass contracts, Rectangle/Square trap
  - **ISP** — Interface Segregation: fat interfaces break clients
  - **DIP** — Dependency Inversion vs Dependency Injection (they're related but distinct)
- **Architect lens:** SRP violations = god classes; OCP violations = if/else trees on type; DIP makes systems testable and modular
- **Challenge:** Refactor a god class; spot LSP violations in a hierarchy
- **Resources:**
  - *Clean Architecture* — Robert C. Martin
  - "SOLID Principles" series — Mark Seemann (YouTube)

### Day 51 — Creational Patterns: Singleton, Factory, Builder
- **Core concepts:** Singleton (and why it's controversial), Factory Method, Abstract Factory, Builder (Java's fluent style)
- **Interview signal:** "Implement a thread-safe Singleton" (covers JMM from Phase 1)
- **Challenge:** Pick the right creational pattern for 3 scenarios
- **Resources:**
  - *Head First Design Patterns* — Freeman & Robson

### Day 52 — Structural Patterns: Adapter, Decorator, Facade, Proxy
- **Core concepts:** When each applies, real-world examples (Java IO uses Decorator, Spring AOP uses Proxy)
- **Architect lens:** These appear constantly in framework internals
- **Resources:**
  - *Design Patterns* — Gang of Four (reference, not light reading)

### Day 53 — Behavioral Patterns: Strategy, Observer, Command, State
- **Core concepts:** Strategy (the most-used pattern), Observer (foundation of reactive), Command (undo/queueing), State machine
- **Architect lens:** Strategy enables OCP; Observer is everywhere in event-driven systems
- **Resources:**
  - "Refactoring Guru" website (illustrated patterns)
  - refactoring.guru

### Day 54 — Week 8 Synthesis: Refactor a Real Codebase
- **Format:** Take messy code, refactor using 2-3 GoF patterns
- **Deliverable:** Before/after with pattern justification

---

## Week 9 — LLD Practice: Real Designs (Days 55–61)

### Day 55 — Design a Parking Lot
- **The classic interview question**
- Cover: vehicle types, slot types, ticket lifecycle, fee calculation strategies, concurrency for assignment
- **Patterns used:** Strategy (fee), Factory (vehicle), State (ticket lifecycle)
- **Architect lens:** Class hierarchy choices, extensibility for new vehicle types
- **Resources:**
  - Search "Low Level Design Parking Lot" — multiple Indian creators have walkthroughs

### Day 56 — Design a Rate Limiter (LLD)
- Token bucket, leaky bucket, sliding window log, sliding window counter
- Thread-safe implementation
- **Connects to:** Day 14 (concurrency-side) and HLD week (distributed rate limiting)
- **Resources:**
  - Stripe Engineering blog on rate limiters

### Day 57 — Design an LRU Cache
- HashMap + Doubly Linked List combo
- O(1) get/put
- Thread-safety extension
- **Interview signal:** Top-5 LLD question
- **Challenge:** Implement from scratch in 30 min
- **Resources:**
  - LeetCode "LRU Cache" problem walkthrough

### Day 58 — Design a Logger / Notification System
- Logger: levels, sinks, async logging, format strategies
- Notification: channels (SMS/Email/Push), priority routing, retry/dead-letter
- **Patterns:** Observer, Strategy, Chain of Responsibility
- **Resources:**
  - Log4j2 architecture as reference

### Day 59 — Design a Splitwise / Expense Tracker
- User-group-expense modeling
- Debt simplification algorithm
- Concurrency for transaction settlement
- **Architect lens:** Graph theory shows up (debt graph)

### Day 60 — Design an Elevator System
- State machine for elevator
- Scheduling algorithm (multiple elevators, optimization)
- Concurrency: button presses arriving from multiple floors
- **Patterns:** State, Strategy (scheduling), Observer

### Day 61 — Week 9 Synthesis: Mock LLD Interview
- 45-min mock: design Tic-Tac-Toe or Chess (pick one)
- Cover: class diagram, key interactions, extensibility, testing strategy
- **Self-assessment:** Did you ask clarifying questions? Did you discuss trade-offs?

---

## Week 10 — HLD Theory: CAP, Consistency, Load Balancing (Days 62–68 + Day 67a)

### Day 62 — CAP Theorem (and Why It's Overhyped)
- **Core concepts:** Consistency, Availability, Partition Tolerance — what each actually means, the false dichotomy, why "CP vs AP" is too simple
- **Architect lens:** Real systems make per-operation CAP choices, not system-wide
- **Interview signal:** "Is your database CP or AP?" — the architect-level answer is "depends on the operation"
- **Resources:**
  - "Please stop calling databases CP or AP" — Martin Kleppmann blog
  - *Designing Data-Intensive Applications (DDIA)* — Kleppmann, Chapter 9

### Day 63 — PACELC Theorem & Consistency Models
- **Core concepts:** PACELC extension to CAP (latency trade-off even without partitions), consistency models (linearizability, sequential, causal, eventual)
- **Architect lens:** Choosing the right consistency level per operation
- **Resources:**
  - "Consistency Models" by Peter Bailis (paper and talk)
  - jepsen.io — Kyle Kingsbury's consistency analyses

### Day 64 — Load Balancing Strategies
- **Core concepts:** L4 vs L7, round-robin, weighted, least-connections, IP hash, consistent hashing, sticky sessions
- **Architect lens:** Wrong LB strategy = uneven hot spots
- **Interview signal:** "How do you load balance stateful sessions?"
- **Resources:**
  - "Load Balancing" — High Scalability blog
  - Envoy proxy docs

### Day 65 — Consistent Hashing Deep Dive
- **Core concepts:** Hash ring, virtual nodes, why DHTs use it, Amazon Dynamo paper
- **Applications:** Cassandra, Redis Cluster, CDN routing
- **Architect lens:** This is THE foundational data partitioning technique
- **Resources:**
  - "Consistent Hashing" — Tom White's classic article
  - Amazon Dynamo paper (search "Dynamo: Amazon's highly available key-value store")

### Day 66 — Caching Strategies
- **Core concepts:** Cache-aside, write-through, write-behind, refresh-ahead, eviction policies (LRU, LFU, ARC)
- **Architect lens:** Cache strategy = read/write traffic shape
- **Resources:**
  - "Caching Patterns" — AWS whitepaper

### Day 67 — CDNs & Edge Caching
- **Core concepts:** CDN architecture, edge POPs, cache invalidation strategies, push vs pull, signed URLs
- **Architect lens:** CDN = first weapon against geographic latency
- **Resources:**
  - Cloudflare Learning Center articles

### Day 67a — Redis Deep Dive: Sorted Sets, Cluster, Sentinel & Lua
- **Core concepts:**
  - **Data structures in depth:** Sorted sets for leaderboards and rate-limiting (ZADD, ZRANGEBYSCORE); HyperLogLog for cardinality estimation; Streams for lightweight event queues
  - **Redis Cluster:** hash slot sharding (16384 slots), CLUSTER MEET, resharding, node failure handling
  - **Redis Sentinel:** leader election, automatic failover, quorum configuration
  - **Lua scripting:** atomic multi-key operations without MULTI/EXEC, `EVAL`, `EVALSHA`, use cases (check-and-set, distributed counter)
  - **Eviction policies:** allkeys-lru, volatile-lru, allkeys-lfu — when to use which
- **Architect lens:** Redis is often the right answer for leaderboards, distributed rate-limiting, pub/sub, session storage, and distributed locks — but wrong answers exist (don't use it as a primary DB)
- **Interview signal:** "Design a real-time leaderboard for 10M users" — Sorted Sets are the answer
- **Resources:**
  - Redis documentation — data types deep dive
  - "Redis in Action" — Josiah Carlson

### Day 68 — Week 10 Synthesis: Cache + LB Decision Matrix
- **Deliverable:** For 5 different read/write workloads, choose caching strategy + LB strategy + justify

---

## Week 11 — Storage: SQL, NoSQL, Sharding (Days 69–75 + Day 75a)

### Day 69 — Relational Database Internals
- **Core concepts:** B-tree indexes, transaction log, MVCC, isolation levels, deadlocks
- **Architect lens:** Choosing isolation level = correctness vs throughput trade-off
- **Interview signal:** "Difference between Read Committed and Repeatable Read"
- **Resources:**
  - *Database Internals* — Alex Petrov (key reference)
  - "Use the Index, Luke!" — use-the-index-luke.com

### Day 70 — SQL Sharding & Replication
- **Core concepts:** Read replicas, primary/replica lag, sharding strategies (range, hash, geo), resharding pain
- **Architect lens:** Sharding decisions are nearly impossible to reverse — pick carefully
- **Interview signal:** "Design Twitter's tweet storage"
- **Resources:**
  - Vitess docs (YouTube's MySQL sharding system)
  - Citus Data blog

### Day 71 — NoSQL Landscape
- **Core concepts:** Key-value (DynamoDB, Redis), document (MongoDB), wide-column (Cassandra), graph (Neo4j) — when to pick what
- **Architect lens:** "Use NoSQL" is not an answer; "use Cassandra because of write-heavy time-series + tunable consistency" is
- **Resources:**
  - DDIA — Kleppmann, Chapter 2-3
  - "NoSQL Distilled" — Pramod Sadalage

### Day 72 — DynamoDB Design Patterns
- **Core concepts:** Single-table design, partition key + sort key, GSI/LSI, hot partition problem, query vs scan
- **Architect lens:** DynamoDB modeling is its own discipline — relational thinking fails
- **Interview signal:** AWS-heavy companies probe this deeply
- **Resources:**
  - Alex DeBrie's *The DynamoDB Book* (canonical resource)
  - Rick Houlihan AWS re:Invent talks (YouTube — essential)

### Day 73 — Time-Series Databases
- **Core concepts:** Why TSDBs exist, InfluxDB, TimescaleDB, ClickHouse, compression strategies
- **Architect lens:** Options/HFT engines generate time-series data; this is directly relevant
- **Resources:**
  - "Time-Series Database Lectures" — CMU 15-721 (YouTube)

### Day 74 — Database Selection Framework
- **Core concepts:** Decision tree for picking a DB given workload characteristics (read/write ratio, consistency needs, scale, query patterns)
- **Architect lens:** This decision shows up in every system design interview
- **Deliverable:** Decision matrix for 6 different use cases

### Day 75 — Week 11 Synthesis: Schema Design Exercise
- Design the data model for a flash-sale e-commerce system (high read, spiky writes, inventory consistency)
- Justify SQL vs NoSQL choice, sharding strategy, caching layer

### Day 75a — Distributed Locking + Distributed ID Generation
- **Core concepts:**
  - **Distributed locking:** Redlock algorithm (quorum of Redis nodes), fencing tokens to handle lock expiry safely, ZooKeeper ephemeral nodes as alternative, failure modes (network partition, clock skew)
  - **Distributed ID generation:** Snowflake ID format (41-bit timestamp + 10-bit machineId + 12-bit sequence), Twitter Snowflake vs UUIDv7 vs ULID vs DB sequences, monotonicity guarantees, clock skew hazards (NTP adjustments)
  - Why auto-increment DB IDs don't work across shards
- **Architect lens:** Every high-scale system needs distributed IDs; distributed locking is the #1 correctness pitfall in distributed systems
- **Interview signal:** "Design a globally unique order ID system" — classic Staff/Architect question
- **Resources:**
  - "How we designed Snowflake" — Twitter Engineering blog
  - "Is Redlock safe?" — Martin Kleppmann vs antirez debate (essential reading)

---

## Week 12 — Messaging, Event Streaming, Kafka (Days 76–81 + Day 79a)

### Day 76 — Messaging Patterns: Queue vs Pub/Sub
- **Core concepts:** Point-to-point (SQS), publish/subscribe (SNS, Kafka), competing consumers, fan-out
- **Architect lens:** Wrong pattern = either bottleneck or message storm
- **Resources:**
  - *Enterprise Integration Patterns* — Hohpe & Woolf (the bible)
  - enterpriseintegrationpatterns.com

### Day 77 — Kafka: Internals & Consumer Groups
- **Core concepts:**
  - **Broker architecture:** Topics, partitions, offsets, retention, log compaction
  - **Partition as unit of parallelism:** partition count = throughput ceiling; pick early, suffer if wrong
  - **Consumer groups:** partition assignment, rebalancing protocols, sticky vs cooperative rebalance
  - Rebalances are downtime — understand what triggers them
- **Architect lens:** Kafka is not a queue; it's a distributed log. Model your topics accordingly.
- **Resources:**
  - "Kafka: The Definitive Guide" — Neha Narkhede (free PDF from Confluent)
  - Confluent YouTube — Kafka 101 series
  - "Apache Kafka Consumer Internals" — Jason Gustafson talks

### Day 78 — Exactly-Once Semantics & Idempotency
- **Core concepts:** At-most-once, at-least-once, exactly-once-via-idempotent-producer + transactional consumer
- **Architect lens:** "Exactly-once" is contextual; understand the limits
- **Interview signal:** "How do you handle duplicate messages?"
- **Resources:**
  - "Exactly-Once Semantics in Apache Kafka" — Confluent blog

### Day 79 — Event Sourcing & CQRS
- **Core concepts:** Event sourcing as system-of-record, CQRS, event store, snapshots
- **Architect lens:** Powerful for audit-heavy domains (banking, trading), heavy lift to implement
- **Resources:**
  - "Event Sourcing" — Martin Fowler article
  - "EventStorming" — Alberto Brandolini

### Day 79a — Transactional Outbox Pattern + CQRS Deep Dive
- **Core concepts:**
  - **The dual-write problem:** why writing to DB + publishing an event in the same request is unsafe (no distributed transaction, message can be lost or duplicated)
  - **Transactional Outbox:** write event to an `outbox` table in the same DB transaction as the business entity; a separate poller/CDC reads and publishes
  - **CDC with Debezium:** captures DB transaction log (binlog/WAL), streams changes to Kafka — zero polling overhead
  - **CQRS write vs read model:** event handler updates read-side projection; eventual consistency lag implications for UX
  - Idempotency on the consumer side when using at-least-once delivery
- **Architect lens:** Transactional Outbox is the most reliable pattern for event-driven microservices. "Just write to Kafka and DB in a try-catch" is the #1 production bug in distributed Java systems.
- **Interview signal:** "Make this payment service publish events reliably without 2PC" — the answer is always Outbox
- **Resources:**
  - "Pattern: Transactional Outbox" — microservices.io/patterns/data/transactional-outbox.html
  - Debezium documentation

### Day 80 — Stream Processing: Kafka Streams, Flink (intro)
- **Core concepts:** Stateful stream processing, windowing, watermarks, exactly-once stream processing
- **Architect lens:** Stream processing is the new batch
- **Resources:**
  - "Streaming Systems" — Tyler Akidau (the canonical book)

### Day 81 — Week 12 Synthesis: Design an Event-Driven Order System
- E-commerce order flow as events: order_placed → payment_processed → inventory_reserved → shipped
- Cover: topic design, idempotency, failure handling, outbox pattern application

---

## Week 13 — Microservices, Saga, API Design, Resilience (Days 82–88 + Days 83a, 84a, 86a)

### Day 82 — Monolith vs Microservices: The Real Trade-offs
- **Core concepts:** When to split, Conway's law, distributed-systems tax (network, observability, deployment complexity)
- **Architect lens:** Most "microservices migrations" fail because the trade-off wasn't honestly priced
- **Resources:**
  - "Monolith First" — Martin Fowler
  - "Don't start with microservices" — Steven Lemon

### Day 83 — Service Decomposition: DDD, Bounded Contexts
- **Core concepts:** Domain-Driven Design basics, bounded context, ubiquitous language, context mapping
- **Architect lens:** Wrong service boundaries = chatty interfaces
- **Resources:**
  - *Domain-Driven Design* — Eric Evans (the blue book)
  - *Domain-Driven Design Distilled* — Vaughn Vernon (shorter intro)

### Day 83a — Database per Service + Strangler Fig + Anti-Corruption Layer
- **Core concepts:**
  - **DB per service:** Why shared databases are the #1 microservices anti-pattern (tight coupling, schema change risk, independent scaling blocked)
  - **Migration path:** Strangler Fig — route traffic incrementally via proxy layer; use feature flags to shift traffic; run old and new in parallel until parity
  - **Anti-Corruption Layer (ACL):** translation layer between bounded contexts to prevent model leakage; implement as an adapter/facade
  - How to handle cross-service queries when you can't JOIN across databases (materialized views, API composition, CQRS read models)
- **Architect lens:** "We'll share the database for now and split it later" is a trap. The migration cost grows exponentially with time.
- **Interview signal:** "Migrate a shared Oracle DB to microservices without downtime" — describe Strangler Fig
- **Resources:**
  - "Strangler Fig Application" — Martin Fowler
  - Sam Newman's *Building Microservices* — data chapter

### Day 84 — Distributed Transactions: Saga Pattern
- **Core concepts:** Why 2PC doesn't scale, Saga as choreography vs orchestration, compensating transactions, idempotency requirements
- **Architect lens:** Saga is THE pattern for cross-service consistency
- **Interview signal:** "How do you handle a multi-service transaction?"
- **Challenge:** Design a Saga for travel booking (flight + hotel + car)
- **Resources:**
  - "Saga Pattern" — Chris Richardson microservices.io
  - microservices.io patterns catalog

### Day 84a — REST API Design + gRPC + WebSockets
- **Core concepts:**
  - **REST:** Richardson Maturity Model, resource naming, idempotency by HTTP verb, versioning strategies (URI vs header vs content negotiation), HATEOAS (when it's worth it)
  - **gRPC:** Protocol Buffers schema-first contract, streaming types (unary, server/client/bidirectional), when gRPC beats REST (service-to-service, strong typing, streaming), protobuf backward compatibility rules
  - **WebSockets:** HTTP upgrade handshake, full-duplex messaging, heartbeats, backpressure challenges, when to prefer SSE vs WebSocket vs long-polling
  - Decision rubric: REST (external/public API), gRPC (internal service-to-service), WebSocket (real-time bidirectional)
- **Architect lens:** Mixing REST and gRPC is common; choosing wrong protocol for a use case creates performance and operational debt
- **Interview signal:** "Design a real-time collaborative editing API" — WebSocket + CRDT; "Design a payments microservice contract" — gRPC with protobuf
- **Resources:**
  - "gRPC vs REST" — Google Cloud blog
  - "Designing APIs for Humans" — Phil Sturgeon

### Day 85 — API Gateway, BFF, Service Mesh
- **Core concepts:** API gateway responsibilities (auth, rate limit, routing), Backend-for-Frontend pattern, service mesh (Istio, Linkerd) — sidecar pattern
- **Architect lens:** Gateway = single chokepoint and single point of failure
- **Resources:**
  - Kong, Spring Cloud Gateway docs
  - Istio architecture docs

### Day 86 — Service Discovery & Health Checks
- **Core concepts:** Client-side vs server-side discovery, Eureka, Consul, K8s service discovery, health check patterns
- **Architect lens:** Stale service registry = cascading failures

### Day 86a — OAuth2 / JWT / Spring Security — Auth Architecture
- **Core concepts:**
  - **OAuth2 flows:** Authorization Code + PKCE (for user-facing apps), Client Credentials (service-to-service), Device Flow (CLI/IoT), Implicit (deprecated — know why)
  - **JWT anatomy:** Header.Payload.Signature, RS256 vs HS256, `exp`/`iat`/`jti` claims, refresh token rotation, token revocation challenge
  - **Spring Security filter chain:** `SecurityFilterChain`, `OncePerRequestFilter`, `AuthenticationManager`, `UserDetailsService`
  - **RBAC vs ABAC:** Role-based = simpler; Attribute-based = finer-grained; hybrid approach for SaaS
  - Local JWT validation vs token introspection endpoint — latency vs revocation freshness trade-off
- **Architect lens:** Auth is a system — not a library call. Most security incidents are design failures, not implementation bugs.
- **Interview signal:** "Design auth for a multi-tenant SaaS with 500 enterprise customers" — expect OAuth2, RBAC, per-tenant isolation discussion
- **Resources:**
  - "OAuth 2.0 Security Best Current Practice" — IETF RFC 9700
  - Spring Security reference documentation

### Day 87 — Resilience Patterns: Circuit Breaker, Bulkhead, Timeout, Retry
- **Core concepts:** Circuit breaker states (closed/open/half-open), bulkhead isolation, timeout budgets, exponential backoff with jitter, retry storms
- **Architect lens:** Resilience is a budget — every retry is a request you owe someone else
- **Interview signal:** "Your downstream service is timing out — what do you do?"
- **Resources:**
  - "Release It!" — Michael Nygard (essential book)
  - Resilience4j docs

### Day 88 — Week 13 Synthesis: Design a Microservices Migration
- Take a hypothetical monolithic e-commerce app
- Plan the decomposition, identify bounded contexts, choose communication patterns, plan DB migration using Strangler Fig
- **Deliverable:** ADR document

---

## Week 14 — Full HLD Mock Designs (Days 89–95)

### Day 89 — Design TinyURL
- Cover: URL encoding strategies, base62, hash collision, custom URLs, analytics, caching, scale to 100M URLs/day
- **Architect lens:** Looks simple, reveals depth in capacity estimation and DB choice
- **Resources:**
  - "Designing TinyURL" — multiple walkthroughs on YouTube

### Day 90 — Design Twitter / X
- Cover: timeline generation (fan-out on write vs read), tweet storage, follow graph, search, trending
- **Architect lens:** Hybrid fan-out for celebrities is the key insight
- **Resources:**
  - Twitter engineering blog posts (historical)
  - "How Twitter handles 4 billion tweets a day" — High Scalability

### Day 91 — Design Uber / Ride-Hailing
- Cover: geo-spatial indexing (geohash, S2, quadtree), driver matching, surge pricing, payment, real-time location updates
- **Architect lens:** Geo-spatial is where most candidates get tripped up
- **Resources:**
  - Uber engineering blog (great public content)
  - H3 hexagonal geospatial indexing

### Day 92 — Design WhatsApp / Messaging
- Cover: 1-to-1 messaging, group chats, message ordering, online presence, end-to-end encryption intuition, offline delivery
- **Architect lens:** Long-lived TCP connections at scale = unique infrastructure challenge
- **Resources:**
  - "WhatsApp Architecture" — multiple HighScalability posts

### Day 93 — Design YouTube / Video Streaming
- Cover: video upload + transcoding pipeline, CDN strategy, adaptive bitrate streaming, recommendations, watch history
- **Architect lens:** Video is bandwidth + storage at scale — different physics

### Day 94 — Design a Distributed Cache (like Redis)
- Cover: consistent hashing for sharding, replication, eviction, persistence (AOF vs RDB), cluster mode
- **Architect lens:** Builds on Day 65 (consistent hashing) and Day 66 (caching)

### Day 95 — Phase 3 Synthesis: Full Mock System Design Interview
- **Format:** 45-min mock — interviewer picks topic
- **Goal:** Drive the conversation, ask clarifying questions, do capacity math, propose architecture, defend trade-offs
- **Self-assessment:** Did you scope? Did you do napkin math? Did you address bottlenecks?

---

## Phase 3 Exit Criteria

By Day 95 you should be able to:

- Walk into a 45-min system design interview confident
- Estimate capacity (QPS, storage, bandwidth) from first principles
- Pick the right database for any given workload with justification
- Design a messaging architecture with Kafka choosing partitions, consumer groups, semantics
- Explain the Transactional Outbox pattern and when to use it
- Decompose a monolith into bounded-context microservices using Strangler Fig
- Discuss resilience patterns (circuit breaker, bulkhead, saga) by name and trade-off
- Design OAuth2 auth architecture for a multi-tenant SaaS

---

## The Three Essential Books for Phase 3

1. **Designing Data-Intensive Applications (DDIA)** — Martin Kleppmann
   *The single most important book for system design interviews.*
2. **System Design Interview** — Alex Xu (Volume 1 + 2)
   *Pattern-based prep, very interview-aligned.*
3. **Release It!** — Michael Nygard
   *Resilience patterns and production lessons.*

---

## Recommended YouTube Channels

- **Gaurav Sen** — Indian creator, system design walkthroughs
- **System Design Interview** — Alex Xu's channel
- **ByteByteGo** — visual explanations of distributed systems
- **Hussein Nasser** — backend engineering deep dives
- **InfoQ** — conference talks (search by topic)
- **Confluent** — Kafka deep dives
