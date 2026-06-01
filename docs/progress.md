# Curriculum Progress Tracker

> **Single source of truth for the 22-week Java Architect curriculum.**
> Update this file after every completed session. The Claude assistant
> reads this to decide what to generate next when you say "next day".

---

## Current Position

- **Phase:** 1 of 6 — Advanced Java
- **Week:** 1 of 22
- **Day:** 4 (next session)
- **Last completed topic:** GC Fundamentals (Day 3)
- **Pending homework:** Day 3 scenario challenge (3 paragraphs on p99 latency spike)

---

## Quick Reference

When you say to the assistant:

| You say | Assistant does |
|---|---|
| `next day` | Generates Day N+1 at default 60 min using the phase plan |
| `next day, X hours` | Scales Day N+1 to X hours (combines topics or expands depth) |
| `redo day X` | Regenerates Day X with same scope (different examples) |
| `skip to day X` | Updates current position, generates Day X |
| `where am I` | Returns the Current Position block above |

---

## Completion Log

| Day | Phase | Week | Topic | Duration | Status | Notes |
|---|---|---|---|---|---|---|
| 1 | 1 | 1 | Stack vs Heap fundamentals | 60 min | ✅ Done | All 3 answers correct |
| 2 | 1 | 1 | Static, Instance, Metaspace | 60 min | ✅ Done | 7/7 challenge correct |
| 3 | 1 | 1 | GC Fundamentals (reachability, generational, STW) | 60 min | ⚠️ Done | Scenario challenge pending |
| 4 | 1 | 1 | GC Algorithms + Tuning + Profiling | 180 min | 🔵 Current | Planned as holiday-mode session |

---

## Phase Overview

| Phase | Weeks | Days | Theme | Status |
|---|---|---|---|---|
| **Phase 1** | 1–3 | 1–21 | Advanced Java | 🔵 In progress (3/21) |
| **Phase 2** | 4–7 | 22–49 | DSA & Patterns | 🔒 Locked |
| **Phase 3** | 8–14 | 50–98 | System Design (LLD + HLD) | 🔒 Locked |
| **Phase 4** | 15–18 | 99–126 | AWS & DevOps | 🔒 Locked |
| **Phase 5** | 19–20 | 127–140 | AI Integration | 🔒 Locked |
| **Phase 6** | 21–22 | 141–154 | Interview Polish | 🔒 Locked |

---

## User Context (for assistant continuity)

- **Background:** Senior Quantitative Developer, 5 years Java
- **Specialty:** Indian derivatives (Nifty 50 options), Zerodha Kite Connect API
- **Environment:** Termux on Android Samsung device (mobile-first)
- **Goal:** Transition from Senior Dev → Staff/Architect role
- **Pacing:** 1 hour/day default, occasional 2-3 hour holiday sessions
- **Style preferences:**
  - SVG diagrams over ASCII
  - Detailed multi-stage lessons over dense single-block text
  - Trade-off discussions in every lesson
  - Connect abstract concepts to trading/options context when natural

---

## Update Protocol

**After completing a day:**
1. Move the day's row from 🔵 Current to ✅ Done
2. Add the next day as 🔵 Current
3. Update Current Position block at top
4. Log any deviations (skipped sub-topics, deferred challenges, etc.)

**When schedule changes:**
- This is a dynamic plan. Days can be skipped, merged, or expanded.
- Update the planned duration in the next session row before generating.
- Original phase plans (in `phase-X-master-plan.md`) stay unchanged — only this tracker reflects reality.

---

## Notes & Deviations

- **2025-XX-XX:** Day 1 originally tried to cover stack/heap/static/instance/metaspace in one session; user feedback led to splitting across Days 1-2. Phase plan updated to reflect.
- **2025-XX-XX:** User has flexible schedule — sometimes 1 hr, sometimes 3 hr. Default to 1 hr unless explicitly told otherwise.
