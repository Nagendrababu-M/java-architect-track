# Phase 4 — AWS & DevOps (Weeks 15–18, Days 96–120)

> **Goal:** Move from theoretical architect to *operating* architect. Know where systems actually run, how to deploy them, and how to observe them. By Day 120 you should be able to design a complete production-ready AWS architecture.
>
> **Bias:** AWS-heavy because it's the market leader. Concepts translate to GCP/Azure.

---

## Week 15 — Core AWS Services (Days 96–102)

### Day 96 — AWS Foundations: Regions, AZs, VPC Basics
- **Core concepts:** Region vs AZ vs Edge Location, VPC, subnets (public/private), route tables, IGW, NAT Gateway
- **Architect lens:** Multi-AZ ≠ multi-region; understand the difference for DR planning
- **Interview signal:** "Design a highly available web app on AWS"
- **Resources:**
  - AWS Well-Architected Framework (free PDF — essential reading)
  - "AWS Networking Fundamentals" — AWS re:Invent (YouTube)

### Day 97 — IAM Deep Dive
- **Core concepts:** Users, groups, roles, policies (identity-based vs resource-based), least privilege, AssumeRole, instance profiles, SCPs in Organizations
- **Architect lens:** IAM mistakes = security incidents. Most cloud breaches are IAM misconfigurations.
- **Interview signal:** "How would you give a Lambda access to one S3 bucket securely?"
- **Resources:**
  - AWS IAM documentation
  - "IAM Best Practices" — AWS re:Invent talks

### Day 98 — EC2 Deep Dive
- **Core concepts:** Instance families (compute/memory/storage/network optimized), EBS volume types (gp3, io2, st1), placement groups, Spot vs On-Demand vs Reserved, AMIs
- **Architect lens:** Right-sizing instances = ~30% cost savings on most workloads
- **Resources:**
  - EC2 instance types comparison (AWS docs)

### Day 99 — S3 Deep Dive
- **Core concepts:** Storage classes (Standard, IA, Glacier tiers), versioning, lifecycle policies, S3 Transfer Acceleration, multipart upload, server-side encryption (SSE-S3, SSE-KMS, SSE-C), pre-signed URLs, S3 Select
- **Architect lens:** S3 is the foundation of most data architectures; understand consistency model (now strongly consistent)
- **Interview signal:** "Design a photo-sharing app's storage layer"
- **Resources:**
  - "Deep Dive on Amazon S3" — re:Invent (annual talk)

### Day 100 — DynamoDB in Practice
- **Reinforces Day 72 from Phase 3** with hands-on focus
- **Core concepts:** Provisioned vs on-demand capacity, auto-scaling, streams, global tables, transactions
- **Architect lens:** DynamoDB cost model is unforgiving for bad access patterns
- **Resources:**
  - "Amazon DynamoDB Deep Dive" — Rick Houlihan (THE talk)

### Day 101 — RDS, Aurora, Read Replicas
- **Core concepts:** RDS vs Aurora architecture (Aurora's separated storage layer), read replicas, multi-AZ for HA, Aurora Serverless v2, Aurora Global Database
- **Architect lens:** Aurora is AWS's hidden gem — 5x MySQL perf, but pricey
- **Resources:**
  - "Aurora Internals" — re:Invent

### Day 102 — Week 15 Synthesis: Design a Multi-Tier Web Architecture
- Cover: VPC layout, ALB, ASG with EC2, RDS Multi-AZ, S3 for static assets, IAM roles, CloudFront in front
- **Deliverable:** Architecture diagram + reasoning

---

## Week 16 — Serverless, Containers, Deployment (Days 103–107 + Day 107a)

### Day 103 — Lambda & Serverless Patterns
- **Core concepts:**
  - **Lambda fundamentals:** Event-driven execution, cold starts, memory = CPU, execution time limits (15 min), provisioned concurrency
  - **Event source mapping patterns:** Lambda + S3 / DynamoDB Streams / Kinesis / SQS / API Gateway / EventBridge
  - When Lambda shines (spiky/intermittent workloads) vs when it fails (steady high-throughput, cold start sensitive)
- **Architect lens:** Event-driven serverless = the modern AWS-native pattern
- **Interview signal:** "When would you NOT use Lambda?"
- **Challenge:** Design 3 event-driven workflows using Lambda
- **Resources:**
  - "Lambda Deep Dive" — re:Invent

### Day 104 — Docker Fundamentals
- **Core concepts:** Image vs container, Dockerfile best practices, layers, multi-stage builds, image size optimization
- **Architect lens:** Docker images = your deployment artifact; treat them like code
- **Interview signal:** "Why is your Docker image 2GB and how would you reduce it?"
- **Resources:**
  - Docker official docs
  - "Best practices for writing Dockerfiles" — Docker docs

### Day 105 — ECR, ECS, Fargate
- **Core concepts:** ECR (image registry), ECS task definitions, ECS service, EC2 launch type vs Fargate, ALB integration
- **Architect lens:** Fargate = no server management; pay for what you use; trade off for cost predictability
- **Resources:**
  - "ECS vs EKS vs Fargate" — AWS comparison docs

### Day 106 — Kubernetes: Core Concepts, Operations & Scaling
- **Core concepts:**
  - **Core:** Pods, deployments, services (ClusterIP/NodePort/LoadBalancer), namespaces, configmaps, secrets, ingress
  - **Operations:** HPA (horizontal pod autoscaling), VPA, rolling update strategies, liveness/readiness probes, PodDisruptionBudget
  - Wrong probes = either restart storms or zombie pods serving 500s
- **Architect lens:** K8s is the industry standard; understanding it = portability across clouds
- **Interview signal:** "Walk me through how a rolling update works"
- **Resources:**
  - Kubernetes official docs (tutorial section)
  - "Kubernetes Up & Running" — Brendan Burns
  - "Production-Grade Kubernetes" — various talks

### Day 107 — EKS & Managed Kubernetes
- **Core concepts:** EKS architecture, AWS integration (ALB ingress controller, EBS CSI), node groups vs Fargate, Karpenter for autoscaling
- **Architect lens:** Managed K8s = trade-off between control and ops burden
- **Resources:**
  - EKS Workshop (free hands-on labs)

### Day 107a — 12-Factor App + Testing Strategy: Contract Tests & Chaos Engineering
- **Core concepts:**
  - **12-Factor App:** Config in environment (not code), stateless processes, backing services as attached resources, logs as streams — applied to Spring Boot microservices specifically
  - **Consumer-driven contract tests with Pact:** Provider publishes contract; consumer verifies against it; prevents breaking API changes across 200 services
  - **TestContainers:** Spin up real DB/Kafka/Redis in JUnit tests; no mocking infrastructure
  - **Chaos Engineering:** Netflix Chaos Monkey principles, steady-state hypothesis, blast radius control, Game Days
  - The Chaos Maturity Model: ad hoc → structured → automated
- **Architect lens:** At 40 teams / 200 services, you cannot review every deploy. Automated contract tests + chaos testing are the only scalable quality gates.
- **Interview signal:** "How do you prevent regressions when many teams deploy independently?" — contract tests + feature flags + canary
- **Resources:**
  - "12factor.net" — the original spec
  - Pact documentation (pact.io)
  - "Chaos Engineering" — Casey Rosenthal & Nora Jones

---

## Week 17 — CI/CD, Infrastructure as Code (Days 108–113)

### Day 108 — CI/CD Pipeline Architecture
- **Core concepts:** Build → test → package → deploy stages, blue/green deployment, canary, feature flags
- **Architect lens:** Deployment strategy = blast radius control
- **Resources:**
  - "Accelerate" — Forsgren/Humble/Kim (research-backed DevOps book)

### Day 109 — GitHub Actions / Jenkins / GitLab CI Patterns
- **Core concepts:** Pipeline-as-code, runners, caching strategies, matrix builds, secrets management
- **Architect lens:** Your pipeline IS production infrastructure
- **Resources:**
  - GitHub Actions docs (best examples)
  - "Continuous Delivery" — Jez Humble (foundational book)

### Day 110 — Terraform & IaC Patterns
- **Core concepts:**
  - **Fundamentals:** Providers, resources, state file, modules, variables, outputs, `terraform plan`/`apply`, remote state with S3+DynamoDB locking
  - **Patterns:** DRY infrastructure with modules, workspace vs separate state files, terragrunt for multi-env
  - State file management = the #1 Terraform footgun
  - Wrong abstraction in modules = future copy-paste hell
- **Interview signal:** "What happens if two engineers run terraform apply simultaneously?"
- **Resources:**
  - "Terraform Up & Running" — Yevgeniy Brikman (canonical book)
  - HashiCorp Learn (free tutorials)

### Day 111 — Container-Based CD: ArgoCD, Flux (GitOps)
- **Core concepts:** GitOps philosophy (Git as source of truth), declarative deployments, ArgoCD architecture, drift detection
- **Architect lens:** GitOps = audit trail + reproducibility
- **Resources:**
  - ArgoCD docs
  - "GitOps Principles" — OpenGitOps.dev

### Day 112 — Secrets Management
- **Core concepts:** AWS Secrets Manager vs Parameter Store, HashiCorp Vault, secret rotation, External Secrets Operator in K8s
- **Architect lens:** Hardcoded secrets = inevitable breach

### Day 113 — Week 17 Synthesis: Design a Full CI/CD Pipeline
- **Deliverable:** Diagram + Terraform skeleton for a complete dev→staging→prod pipeline with security gates

---

## Week 18 — Observability, Reliability, Cost (Days 114–120)

### Day 114 — Observability: Metrics, Logs, Traces
- **Core concepts:** The three pillars, OpenTelemetry, structured logging, distributed tracing (Jaeger, X-Ray), Prometheus + Grafana
- **Architect lens:** You can't fix what you can't see. Observability is design-time, not after-the-fact.
- **Interview signal:** "How would you debug a slow request across 7 microservices?"
- **Resources:**
  - "Observability Engineering" — Charity Majors (the book)
  - OpenTelemetry docs

### Day 115 — CloudWatch & AWS Native Observability
- **Core concepts:** CloudWatch metrics/logs/insights/alarms, X-Ray for tracing, CloudWatch Container Insights
- **Architect lens:** Native AWS observability = lowest friction, highest lock-in

### Day 116 — SLI, SLO, SLA, Error Budgets
- **Core concepts:** Service Level Indicators (what you measure), Objectives (what you promise internally), Agreements (legal commitment), error budget as deployment tool
- **Architect lens:** SLOs are the conversation tool between engineering and product
- **Resources:**
  - Google SRE Book — Chapter 4 (free online)
  - sre.google

### Day 117 — Disaster Recovery & Backup Strategies
- **Core concepts:** RTO vs RPO, backup strategies (full/incremental/differential), DR patterns (backup-restore, pilot light, warm standby, multi-site), cross-region replication
- **Architect lens:** DR plan you haven't tested doesn't exist
- **Resources:**
  - AWS DR whitepaper

### Day 118 — AWS Cost Optimization
- **Core concepts:** Reserved Instances vs Savings Plans vs Spot, right-sizing, S3 storage class optimization, idle resource detection, Cost Explorer + Trusted Advisor
- **Architect lens:** Cost is a non-functional requirement at scale; the architect owns it
- **Interview signal:** "Our AWS bill doubled — diagnose"
- **Resources:**
  - "AWS Cost Optimization" — re:Invent annual
  - "The FinOps Foundation" — finops.org

### Day 119 — Security Best Practices
- **Core concepts:** Shared responsibility model, encryption at rest/in transit, KMS, WAF, GuardDuty, Security Hub, network ACLs vs SGs
- **Architect lens:** Security is layered; no single control is sufficient
- **Resources:**
  - AWS Security Best Practices whitepaper

### Day 120 — Phase 4 Synthesis: Design a Production AWS Architecture
- **Format:** Capstone exercise
- **Scenario:** Design end-to-end AWS architecture for a SaaS application — VPC, compute, data, observability, CI/CD, security, cost guardrails
- **Deliverable:** Architecture diagram + ADR document + Terraform skeleton
- **Architect lens:** This is your portfolio piece — keep it

---

## Phase 4 Exit Criteria

By Day 120 you should be able to:

- Design a multi-tier AWS architecture from scratch with HA, security, observability
- Choose between EC2, ECS, EKS, Fargate, Lambda for any given workload with justification
- Write Terraform for a real environment (not just `hello-world`)
- Build a CI/CD pipeline with security gates and proper environments
- Design observability into a system from day one
- Implement contract testing and chaos engineering for a multi-service system
- Estimate AWS costs from architecture diagrams

---

## Key Resources for Phase 4

**AWS Free Tier:** Use it. Hands-on > reading.

**Must-watch annually:** AWS re:Invent talks on YouTube

**Books:**
- *Terraform: Up & Running* — Yevgeniy Brikman
- *Kubernetes Up & Running* — Burns/Beda/Hightower
- *Site Reliability Engineering* — Google (free online: sre.google/books)
- *The Phoenix Project* — Gene Kim (DevOps culture)
- *Accelerate* — Forsgren/Humble/Kim (DevOps research)

**Free training:**
- AWS Skill Builder — free official courses
- EKS Workshop — free hands-on labs
- HashiCorp Learn — Terraform tutorials

**Certifications (if relevant to your goals):**
- AWS Solutions Architect Associate (foundational)
- AWS Solutions Architect Professional (architect-level)
- Certified Kubernetes Administrator (CKA)
