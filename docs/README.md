# Curriculum Master Plans

This folder is the **source of truth** for the 22-week Java Architect curriculum.

## Files in this folder

| File | Purpose |
|---|---|
| `progress.md` | **Live tracker.** Current position, completion log, schedule deviations. Updated after every session. |
| `phase-1-master-plan.md` | Advanced Java (Days 1-21) |
| `phase-2-master-plan.md` | DSA & Problem Solving (Days 22-49) |
| `phase-3-master-plan.md` | System Design — LLD + HLD (Days 50-98) |
| `phase-4-master-plan.md` | AWS & DevOps (Days 99-126) |
| `phase-5-master-plan.md` | AI Integration (Days 127-140) |
| `phase-6-master-plan.md` | Interview Polish (Days 141-154) |

## How the System Works

1. **Master plans are static.** They define what each day *should* cover. Don't modify these unless you're restructuring the curriculum itself.

2. **progress.md is dynamic.** It reflects reality — what you've actually completed, what's pending, what got skipped or expanded.

3. **Day generation is dynamic.** When you ask Claude for "next day," it reads `progress.md` to know where you are, reads the relevant phase plan to know what's next, and generates a fresh lesson HTML.

## Key Conventions

- **`[HEAVY]` flag** = a day that benefits from 2-3 hour sessions if your schedule allows
- **Day numbers are session-numbers, not calendar dates** — Day 4 = your 4th study session, whenever that happens
- **External resources** are curated, not exhaustive — listed only when they add real depth beyond the lesson

## Numbers at a Glance

- **154 days** total (22 weeks × 7 days)
- **6 phases**
- **~25 `[HEAVY]` days** that may need extra time
- **3 books** that are non-negotiable: DDIA (Phase 3), Java Concurrency in Practice (Phase 1), Staff Engineer (Phase 6)

## Modifying the Curriculum

This is a living plan. Feel free to:

- **Skip days** that cover material you already know deeply (e.g., if you're already an AWS expert, compress Week 15)
- **Expand days** into multiple sessions when interesting (especially `[HEAVY]` ones)
- **Reorder phases** if priorities change (e.g., if you have an interview lined up, jump to Phase 6)
- **Add days** for topics specific to your domain (e.g., insert "Low-Latency Trading Systems" day in Phase 1 Week 2)

All changes go in `progress.md` notes, not the master plans themselves.
