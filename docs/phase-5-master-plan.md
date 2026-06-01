# Phase 5 — AI Integration (Weeks 19–20, Days 121–133)

> **Goal:** Add modern AI capability to your architect toolkit. Not "become an ML engineer" — instead, become the architect who can confidently design GenAI features into Java systems.
>
> **Why this phase:** AI integration is the new differentiator. Most Java architects don't yet know how RAG/vector search/LLM orchestration actually work. Closing this gap = career multiplier.

---

## Week 19 — LLM Fundamentals & Spring AI / LangChain4j (Days 121–127)

### Day 121 — LLM Fundamentals for Engineers
- **Core concepts:** What is an LLM (next-token prediction), tokens vs words, context window, temperature, top-p, system vs user vs assistant messages
- **Architect lens:** LLMs are stateless probabilistic functions; all "memory" is engineered
- **Resources:**
  - "Intro to Large Language Models" — Andrej Karpathy (1hr YouTube, essential)
  - OpenAI's "What are LLMs" docs

### Day 122 — Prompt Engineering Patterns
- **Core concepts:** Zero-shot vs few-shot, chain-of-thought, system prompts, role assignment, output format constraints (JSON mode), prompt injection awareness
- **Architect lens:** Prompts are code — version them, test them
- **Resources:**
  - "Prompt Engineering Guide" — promptingguide.ai
  - Anthropic's prompt engineering docs

### Day 123 — Spring AI: Architecture & Setup
- **Core concepts:** Spring AI abstractions (`ChatClient`, `Prompt`, `ChatResponse`), provider-agnostic design, OpenAI / Anthropic / Ollama integration
- **Architect lens:** Spring AI = the same Spring Boot ergonomics for LLMs (DI, auto-config, observability)
- **Resources:**
  - Spring AI reference docs (docs.spring.io/spring-ai)
  - "Spring AI in Action" — Spring blog series

### Day 124 — LangChain4j: An Alternative
- **Core concepts:** LangChain4j architecture, `AiServices` (declarative API), `ChatLanguageModel`, `EmbeddingModel`, memory, tools
- **Architect lens:** LangChain4j is more feature-rich than Spring AI; Spring AI is simpler and more idiomatic
- **Comparison:** When to pick which
- **Resources:**
  - LangChain4j docs (docs.langchain4j.dev)
  - LangChain4j GitHub examples

### Day 125 — Embeddings & Vector Representations
- **Core concepts:** What an embedding is (high-dimensional vector capturing meaning), embedding models (OpenAI ada, sentence-transformers, BGE), cosine similarity, dimensionality vs accuracy trade-off
- **Architect lens:** Embeddings = the bridge between unstructured text and structured search
- **Resources:**
  - "Embeddings" — OpenAI docs
  - "Sentence Transformers" — sbert.net
  - Hugging Face MTEB leaderboard (compare embedding models)

### Day 126 — Vector Databases
- **Core concepts:** Why traditional DBs fail at vector search, ANN (Approximate Nearest Neighbor) algorithms (HNSW, IVF), Pinecone vs Weaviate vs Qdrant vs Milvus vs pgvector
- **Architect lens:** Vector DB selection follows same framework as Day 74 (database selection) — workload-driven
- **Interview signal:** "Why not just use Elasticsearch for vector search?" (you can, but...)
- **Resources:**
  - "Vector Database Comparison" — multiple blog posts
  - "HNSW Algorithm Explained" — pinecone.io learning center

### Day 127 — Week 19 Synthesis: Build a Simple Q&A Bot
- **Format:** Hands-on mini-project
- **Deliverable:** Spring Boot app that takes a question, queries an LLM, returns answer
- **Architect lens:** Notice what's missing (no context, no memory, no tools) — sets up Week 20

---

## Week 20 — RAG, Tools, Production AI Architecture (Days 128–133)

### Day 128 — RAG Architecture & Pipeline
- **Core concepts:**
  - **Why RAG:** LLM limitations (knowledge cutoff, hallucinations, no proprietary data), RAG as solution
  - **Indexing pipeline:** Document loading → chunking strategies (fixed-size, semantic, sliding window) → embedding → vector store
  - **Query pipeline:** User query → embedding → vector search → context assembly → LLM call
  - Chunk size trade-offs (precision vs context), metadata filtering
  - Chunking strategy is the #1 factor in RAG quality — most failures trace back here
- **Architect lens:** RAG = the dominant pattern for "LLM + your data"
- **Challenge:** Design chunking strategy for 3 different document types (code, legal docs, chat transcripts)
- **Resources:**
  - "Retrieval Augmented Generation" — original paper (Lewis et al. 2020)
  - "RAG Best Practices" — multiple LangChain blog posts
  - "Advanced RAG techniques" — LlamaIndex docs

### Day 129 — Advanced RAG: Re-ranking, Hybrid Search, Query Transformation
- **Core concepts:**
  - Hybrid search (BM25 + vector)
  - Re-ranking models (Cohere Rerank, BGE reranker)
  - Query transformation (HyDE, multi-query, sub-questions)
  - Parent-child chunk strategies
- **Architect lens:** Naive RAG hits a ceiling around 70% accuracy; advanced techniques push to 85%+
- **Resources:**
  - "Advanced RAG" — Pinecone blog series
  - LlamaIndex documentation on retrievers

### Day 130 — LLM Function Calling / Tools
- **Core concepts:** Tool/function calling pattern, structured outputs, agent loops, tool selection, error handling in tool chains
- **Architect lens:** Tools turn LLMs from chatbots into agents — but multiply failure modes
- **Resources:**
  - OpenAI function calling docs
  - Anthropic tool use docs
  - "Building AI Agents" — multiple talks

### Day 131 — Production AI Concerns: Cost, Latency, Reliability
- **Core concepts:**
  - Cost: token accounting, model selection (GPT-4 vs 3.5 vs Claude Haiku vs local models)
  - Latency: streaming responses, parallel calls, caching (semantic caching)
  - Reliability: retries, fallback models, timeout strategies, output validation
- **Architect lens:** Production AI = production engineering with new failure modes
- **Resources:**
  - "Building LLM Applications for Production" — Chip Huyen's blog (essential)

### Day 132 — AI Observability & Evaluation
- **Core concepts:**
  - LLM-specific metrics: hallucination rate, groundedness, relevance
  - Evaluation frameworks (RAGAS, DeepEval, LangSmith)
  - Tracing tools (Langfuse, Arize Phoenix)
- **Architect lens:** "It worked in dev" is more dangerous than ever — LLMs need rigorous eval
- **Resources:**
  - RAGAS docs (ragas.io)
  - "How to evaluate LLM applications" — multiple guides

### Day 133 — Phase 5 Synthesis: Design an Enterprise RAG System
- **Scenario:** Design a RAG system for your trading firm's internal research documents
- **Cover:**
  - Document ingestion pipeline (batch + incremental)
  - Chunking + embedding strategy
  - Vector store choice + sharding
  - Hybrid retrieval + re-ranking
  - LLM orchestration with cost tiering
  - Observability + evaluation
  - Security (PII handling, access control)
- **Deliverable:** Full architecture diagram + ADR
- **Architect lens:** This is the "differentiator" project you can showcase in architect interviews

---

## Phase 5 Exit Criteria

By Day 133 you should be able to:

- Explain RAG architecture end-to-end in a system design interview
- Pick the right LLM provider + model for cost/latency/quality trade-offs
- Design a production-ready chunking and embedding strategy
- Discuss vector DB trade-offs (Pinecone vs pgvector vs Qdrant)
- Build a basic RAG application in Spring AI or LangChain4j
- Reason about LLM evaluation and observability
- Bridge between traditional Java architecture and AI-augmented systems

---

## Key Resources for Phase 5

**Must-watch:**
- "Intro to Large Language Models" — Andrej Karpathy (1 hr, foundational)
- "State of GPT" — Andrej Karpathy (Microsoft Build talk)
- "Building LLMs from the Ground Up" — Sebastian Raschka

**Must-read blogs:**
- Chip Huyen — huyenchip.com (production AI)
- LangChain blog
- Pinecone learning center
- Anthropic / OpenAI engineering blogs

**Hands-on platforms:**
- OpenAI playground (free credits)
- Anthropic Console
- Ollama (run open LLMs locally — perfect for offline experiments)

**Frameworks to know:**
- Spring AI (Java idiomatic)
- LangChain4j (feature-rich Java)
- LangChain (Python — still the reference impl)
- LlamaIndex (RAG-focused)

**Vector DBs to know:**
- Pinecone (managed, simplest)
- Qdrant (open source, fast)
- Weaviate (feature-rich)
- pgvector (Postgres extension — start here if you already use Postgres)
- Milvus (large-scale)

---

## What This Phase Does NOT Cover

To set expectations clearly — this phase deliberately does NOT include:

- Training or fine-tuning models (ML engineer territory)
- Deep learning theory (transformers, attention mechanics)
- Model deployment infrastructure (you'll use APIs/managed services)
- Computer vision or audio models (text-focused)

If you want to go deeper after Day 133, the path forward is:
- Andrej Karpathy's "Neural Networks: Zero to Hero" YouTube series
- *Hands-On Large Language Models* — Jay Alammar
- Hugging Face NLP course (free)

But for architect-level competency, **Phase 5 as-designed is sufficient**.
