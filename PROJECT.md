# PROJECT.md — Architect Track

> **Read this file first.** It is the single source of truth for any AI assistant or human contributor joining this project. Everything needed to understand the project's purpose, structure, conventions, and workflow is here — no prior chat history required.

---

## Section 1: What This Project Is

Architect Track is a structured, self-paced learning site delivered as static HTML — a 22-week, 154-day curriculum designed to transition a Senior Java Developer into a Staff/Architect-level role, covering advanced Java internals, DSA patterns, system design, AWS/DevOps, AI integration, and interview preparation.

The primary user is a Senior Quantitative Developer with approximately five years of Java experience. He works primarily on a Samsung Android device via Termux, building automated trading systems for Indian derivatives markets — specifically Nifty 50 options strategies executed through the Zerodha Kite Connect API. His default study pace is one hour per day, with occasional two-to-three hour holiday sessions when time allows. He prefers SVG diagrams over ASCII art, multi-stage lessons over dense single-block text, explicit trade-off discussions in every lesson, and connections to trading or financial systems context where they arise naturally.

This project is not a tutorial site, a course platform, or a SaaS product. It is a personal curriculum site hosted as static HTML on Netlify, optionally shared with a small study group. There is no backend, no user accounts, and no live AI features at runtime. Every lesson page is a self-contained HTML file that works when opened directly in a browser.

---

## Section 2: Curriculum Structure at a Glance

| Phase | Weeks | Days | Theme |
|---|---|---|---|
| 1 | 1–3 | 1–21 | Advanced Java |
| 2 | 4–7 | 22–49 | DSA & Problem Solving |
| 3 | 8–14 | 50–98 | System Design (LLD + HLD) |
| 4 | 15–18 | 99–126 | AWS & DevOps |
| 5 | 19–20 | 127–140 | AI Integration |
| 6 | 21–22 | 141–154 | Interview Polish |

**Design rationale:** Phase 3 is the largest block at seven weeks because system design is the highest-leverage architect skill — it's what separates senior engineers from staff and principal engineers in interviews and in practice. Phase 2 (DSA) is intentionally patterns-over-volume: the goal is to recognize and apply a core set of problem-solving patterns, not to grind hundreds of LeetCode problems. Phase 5 (AI Integration) is short by design — the objective is to produce an architect who can design RAG pipelines and reason about LLM trade-offs, not to become an ML engineer.

---

## Section 3: Folder Structure

```
architect-track/
├── PROJECT.md                  ← THIS FILE (read first)
├── index.html                  ← Landing page with day/topic navigation
├── assets/
│   ├── styles.css              ← Shared design tokens
│   ├── app.js                  ← Navigation + progress logic
│   ├── audio-player.js         ← (optional) Audio narration player
│   ├── audio-player.css        ← (optional) Audio player styles
│   ├── glossary.js             ← (optional) Term-link feature
│   ├── glossary.css            ← (optional) Term-link styles
│   ├── abbreviations.js        ← (optional) Abbreviation popups
│   └── abbreviations.css       ← (optional) Abbreviation popup styles
├── data/
│   ├── curriculum.js           ← Lesson metadata + answer keys
│   ├── glossary.js             ← (optional) Term definitions for links
│   └── abbreviations.js        ← (optional) Acronym definitions
├── docs/
│   ├── README.md               ← Index for docs folder
│   ├── progress.md             ← LIVE state tracker (single source of truth)
│   ├── phase-1-master-plan.md  ← Days 1–21 detailed plan
│   ├── phase-2-master-plan.md  ← Days 22–49
│   ├── phase-3-master-plan.md  ← Days 50–98
│   ├── phase-4-master-plan.md  ← Days 99–126
│   ├── phase-5-master-plan.md  ← Days 127–140
│   └── phase-6-master-plan.md  ← Days 141–154
├── week-01/
│   ├── day-1.html
│   ├── day-2.html
│   ├── day-3.html
│   └── ... (up to day-7.html)
├── week-02/ ... week-22/       ← Same pattern
├── narration/                  ← (optional) Audio narration source text
│   └── week-XX/day-Y/section-N.txt
├── audio/                      ← (optional) Generated MP3 narration files
│   └── week-XX/day-Y/section-N.mp3
└── scripts/                    ← (optional) Audio generation tools
    ├── generate-audio.py
    └── README-audio.md
```

**Root files** — The entry point (`index.html`) and project meta (`PROJECT.md`). Read PROJECT.md before touching anything else.

**assets/** — Shared CSS and JS consumed by the index page and optional feature modules. Individual lesson HTML files do NOT depend on these — they are self-contained.

**data/** — Lesson metadata, answer keys, and optional glossary/abbreviation definitions loaded by the index page's JavaScript.

**docs/** — The curriculum master plans (static blueprints) and the live progress tracker. These are the two most important files for an AI assistant to read at the start of any session.

**week-XX/** — The actual lesson HTML files, one per day, zero-padded week number (e.g., `week-01/day-1.html`). Each file is standalone and must work when opened directly in a browser.

**narration/** — Optional. Only present if the audio narration feature has been enabled. Contains raw text files used as input to the TTS generation pipeline.

**audio/** — Optional. Only present if audio has been generated. Contains MP3 files organized by week, day, and stage.

**scripts/** — Optional. Python tooling for the audio generation pipeline. See `scripts/README-audio.md` for setup instructions.

---

## Section 4: The Two Source-of-Truth Files

Understanding the interplay between these two files is the mental model for this entire project.

### docs/progress.md — The LIVE State Tracker

- Tracks current phase, current week, current day, and the last completed topic
- Updated after every completed session (challenge answered and reviewed)
- AI assistants must read this file first to know where the user currently is
- See the existing `docs/progress.md` for the canonical format — do not invent a new structure

### docs/phase-X-master-plan.md — The STATIC Blueprint

- Defines what each day should cover: core concepts, architect lens, interview signals, challenge type, resources, and any `[HEAVY]` flags
- Never modified casually — restructuring the curriculum requires a deliberate decision, not an in-session edit
- AI assistants read the relevant phase plan to know what the next day's topic should be

### The Interplay

When the user says "next day," the workflow is:

1. Read `docs/progress.md` → identify the current day number
2. Read the corresponding phase master plan → find that day's spec
3. Generate the lesson HTML at the correct path → matching that day's spec
4. Append a new row to `docs/progress.md` marking the new day as 🔵 Current
5. Wait for the user to complete the challenge before marking it ✅ Done

---

## Section 5: Anatomy of a Lesson HTML File

Every lesson follows the same structural pattern. Use `week-01/day-1.html` as the canonical reference template when in doubt.

### Required Structure (in order)

1. `<!DOCTYPE html>` with `lang="en"` and a `<meta name="viewport">` tag
2. `<title>` following the pattern: `"Week N · Day M — [Topic]"`
3. Google Fonts import: **Fraunces**, **Inter Tight**, **JetBrains Mono**
4. Inline `<style>` block containing all CSS — lessons are fully self-contained and must not depend on external stylesheets. A lesson opened directly as a file must render correctly.
5. `<body>` containing:
   - A grain overlay `<div>` (fixed-position SVG noise texture)
   - A container `<div>` wrapping all content
   - `<header>` containing:
     - Meta line: phase, week, day identifiers in monospace caps
     - `<h1>` with the lesson title and an `<em>` subtitle
     - Scope indicator line: e.g., `SCOPE · 60 min · 5 stages`
   - Optional recap block (green left border) when continuing from a previous day's deferred challenge
   - Four to five `<div class="stage" data-section="N">` blocks
   - `<footer>` displaying the day's position: e.g., `DAY 3 OF 154`

### Stage Structure

Each `<div class="stage" data-section="N">` contains:

- `<span class="stage-tag">STAGE N <span class="time">X MIN</span></span>`
- `<h2>` with the stage title
- Body content built from these reusable components:
  - `<p>` — prose explanation
  - `<pre><code>` — code blocks with manual syntax highlighting using spans: `.kw` (keywords), `.str` (strings), `.cmt` (comments), `.typ` (types), `.num-lit` (numeric literals)
  - `<div class="diagram-svg">` — wrapper for inline SVG diagrams
  - `<div class="key-rule">` — boxed key insight (purple left border)
  - `<div class="analogy">` — analogy callout (blue left border)
  - `<div class="check">` — quick mental-check prompt (green left border)
  - `<div class="architect-callout">` — explicit trade-off or scale discussion
  - `<table class="compare">` — comparison table for two or more options
- The **last stage** always contains `<div class="challenge">` with the day's micro-challenge

### Time Accounting

The sum of all stage durations must equal the lesson's declared scope. Standard lessons are 60 minutes across four to five stages. Heavy days declare their scope in the header (e.g., `SCOPE · 120 min · 6 stages`) and distribute time accordingly.

---

## Section 6: Design System Reference

All lesson pages use the same design tokens. Never introduce new color values or font families — use the variables below.

### Colors (CSS custom properties)

```
--bg: #0f1115            Main background
--bg-elev: #161922       Elevated surfaces (cards, callouts)
--bg-code: #1c2030       Code block background
--ink: #e8e6e1           Primary text
--ink-dim: #9aa0ad       Secondary text
--ink-faint: #5e6473     Tertiary text, captions
--accent: #ff7a3d        Primary accent (orange)
--accent-soft: #ffb38a   Lighter accent
--line: #252a37          Borders, dividers
--green: #6ed3a8         Success, completion, checks
--yellow: #e8c87a        Warning, highlights
--red: #e87a7a           Errors, critical callouts
--blue: #7ab8e8          Info, analogies
--purple: #b18ae0        Key insights, metaspace
```

### Typography

| Family | Weights | Usage |
|---|---|---|
| **Fraunces** (serif) | 400, 600, 800 | Headings: h1, h2, h3 |
| **Inter Tight** (sans-serif) | 400, 500, 600 | Body text, prose |
| **JetBrains Mono** (monospace) | 400, 500, 700 | Code, metadata labels, stage tags |

### Visual Signatures

- **Grain overlay:** Fixed-position SVG noise texture at approximately 4% opacity, layered behind all content. Gives the dark background a tactile quality.
- **Background gradient:** Subtle radial gradient on the `<body>`, fixed attachment, slightly warmer at center.
- **Cards and callouts:** 1px border using `--line`, 8–10px border radius.
- **Uppercase labels:** Letter-spacing 0.08–0.15em on all monospace caps (stage tags, meta lines, scope indicators).
- **Transitions:** 200–300ms ease on all interactive elements (hover states, focus rings).
- **Code blocks:** 3px left border in `--accent` (orange), background in `--bg-code`.
- **Mobile breakpoint:** 600px. Below this, layout shifts to single-column, font sizes scale down, padding reduces.

---

## Section 7: How to Generate a New Lesson

Follow these steps exactly when generating the next day's lesson HTML.

### Step 1 — Read State

- Open `docs/progress.md`
- Identify the current day number (e.g., Day 13)
- Note any pending deferred challenges or deviations logged in the progress file

### Step 2 — Read the Plan

- Open the relevant phase master plan (e.g., `docs/phase-1-master-plan.md` for Days 1–21)
- Find the entry for the day you are generating
- Extract: core concepts, architect lens, interview signal, challenge type, any resources listed, and whether the day is flagged `[HEAVY]`

### Step 3 — Generate the Lesson HTML

- File path: `week-XX/day-Y.html` — zero-pad the week number (e.g., `week-02/day-8.html`)
- Apply the structure from Section 5
- Apply the design system from Section 6
- Build 4–5 stages that sum to the declared scope (60 min standard, more for HEAVY days)
- Stage 1 introduces the topic; the final stage contains the challenge
- Include at minimum: 1 inline SVG diagram, 2 code examples, 1 analogy or key-rule callout
- Include an `<div class="architect-callout">` block with explicit trade-off content — do not bury architect-lens commentary inside prose
- Trading/options domain connections are welcome when natural; do not force them

### Step 4 — Update Tracking

- Append a new row to the completion log table in `docs/progress.md`, marking the new day as 🔵 Current
- Update the Current Position block at the top of `docs/progress.md`

### Step 5 — Wait for the User

- Do NOT mark the day as complete
- The user must reply with their challenge answer
- Review their answer (see Section 8), then update `docs/progress.md` to mark the day ✅ Done

---

## Section 8: How to Update Progress After Completion

When the user submits their challenge answer:

1. Review the answer using the Socratic method (Section 10): give targeted feedback, hints if wrong, confirmation if right.
2. Once the user's answer is confirmed correct (either on first attempt or after iteration), update `docs/progress.md`:
   - Change the completed day's status from 🔵 Current to ✅ Done
   - Add a new row for the next day, marked 🔵 Current
   - Update the Current Position block at the top
   - Log any deviations: skipped sub-topics, deferred challenges, sessions that ran short or long

Do not auto-advance or mark complete without explicit user confirmation. The progress file is the audit trail.

---

## Section 9: Working With Heavy Days

Some days in the master plans are flagged `[HEAVY · 2hr]` or `[HEAVY · 3hr]`. These represent topics that genuinely benefit from extended time — not padding, but depth.

### When the User Has Extra Time

- Scale content to fill the available time
- Add depth, not breadth: more code examples, harder challenge variants, deeper trade-off analysis
- For HEAVY days: always include a scale-down note in the lesson (e.g., "If you only have 1 hour: complete Stages 1–3 and defer the Stage 4 exercise to your next session")

### When the User Is on a Tight Day

- Defer the challenge to the next session — note this in `docs/progress.md`
- Cut filler: reduce the number of analogies, shorten foreshadowing paragraphs
- Never cut the architect-lens content — it is the differentiator and the reason for this curriculum

---

## Section 10: Pedagogical Conventions

These rules apply to every AI generating lessons or reviewing challenge answers.

### Socratic Method

The teaching flow is: concept introduction → micro-challenge → user attempts → AI gives one targeted hint (not the answer) → user iterates → AI confirms or hints again. Never give the answer on the first wrong attempt. One hint, then wait. This is not optional — it is the core of how learning happens in this curriculum.

### Trade-offs Are the Spine

Every architectural choice in a lesson gets the trade-off treatment. "It works" is never the end state — "why this over the alternative, and what do you give up?" is the architect-level question. Every lesson must make at least one explicit trade-off visible.

### Architect Lens

Every concept includes a "how does this look at scale" angle. Use `<div class="architect-callout">` to surface it explicitly — do not embed it as a throwaway sentence inside a paragraph. Connect concepts to production failure modes wherever possible: "what breaks in production when you get this wrong" is always more memorable than abstract theory.

### Voice and Tone

Warm, knowledgeable, mentor-like — not textbook-formal. The tone should feel like a more senior colleague explaining something they have seen go wrong in production, not a documentation author. Push back honestly when the user wants to skip difficult work. Be calibrated and direct — friendly, but never soft-pedaling mistakes or gaps.

---

## Section 11: User Context (Read Before Generating Lessons)

Keep this profile in mind when making decisions about content, analogies, and difficulty calibration.

- **Background:** Senior Java Developer, approximately five years of experience in production Java systems
- **Environment:** Termux on Samsung Android — mobile-first workflow, no large monitor, likely editing in a terminal-based editor
- **Goal:** Transition from Senior Developer to Staff/Architect — the gap is system design breadth, trade-off reasoning, and cross-functional communication, not raw coding ability
- **Pacing:** One hour per day as the default; two-to-three hour sessions are available on holidays and can be pre-signaled
- **Style preferences:**
  - SVG diagrams over ASCII art — always
  - Multi-stage structured lessons over dense single-block walls of text
  - Explicit trade-off discussions in every lesson, not buried in prose
  - Connections to trading, derivatives markets, or Zerodha/Kite when they arise naturally — never forced
  - Real-world analogies are welcomed; abstract theory alone is not enough

---

## Section 12: Optional Features and Their Status

These features are built into the design but may or may not be active in the current deployment. Check the relevant files for current status.

### Audio Narration

Pre-generated MP3s, one per stage, loaded by `assets/audio-player.js`. Generated via a two-step pipeline: Claude produces narration text in chat, and `scripts/generate-audio.py` converts it to MP3 via Google Cloud TTS. See `scripts/README-audio.md` for setup. Status per lesson: check the `audio.available` field in `data/curriculum.js`.

### Glossary Links

Terms in lesson text can be wrapped in `<span data-term="...">` to activate hover tooltips and click-through links. Term definitions and external URLs live in `data/glossary.js`. The feature is activated by `assets/glossary.js` and styled by `assets/glossary.css`.

### Abbreviation Popups

Acronyms and abbreviations can be wrapped in `<abbr data-abbr="...">` to show expansion popup cards on hover or tap. Definitions live in `data/abbreviations.js`. Activated by `assets/abbreviations.js`, styled by `assets/abbreviations.css`.

### Progress Tracking via localStorage

The user's lesson completion state is persisted in the browser. Storage key: `"architect-track-progress"`. This resets only if the user manually clears browser data. The index page reads this state to show which lessons are complete.

### AI Tutor (Deferred)

A per-lesson Q&A feature scoped to the current page's content was designed but not implemented. The intent was to allow the user to ask questions about a lesson's material without leaving the page. See prior chat history for the design rationale and spec. This is a deliberate deferral, not a gap.

---

## Section 13: How to Add a New Day to the Master Plan

When the curriculum needs adjustment — inserting a day, reordering topics, or expanding a phase:

1. Edit the relevant `docs/phase-X-master-plan.md` file with the new or modified day entry
2. If day numbers shift as a result, update `docs/progress.md` to reflect the new numbering
3. Update `data/curriculum.js` with new lesson metadata entries matching the change
4. Do NOT renumber existing completed lessons — preserving the continuity of completed work matters
5. If a lesson HTML file already exists for a slot that shifts, make a deliberate call: regenerate the file, move it to the correct path, or leave it as a historical artifact and note the discrepancy in `docs/progress.md`

---

## Section 14: Deployment

- **Platform:** Netlify (free tier)
- **URL pattern:** `https://[slug].netlify.app`
- **Deployment method:** Drag-and-drop the project root folder onto Netlify Drop, or connect the Git repository for continuous deployment on push
- **Static only:** No backend, no Netlify Functions, no environment variables required
- **Standalone requirement:** Every lesson HTML file must work when opened directly in a browser — no absolute paths to a server, no runtime dependencies on a running backend. Test by opening a file via `file://` before deploying.

---

## Section 15: For AI Assistants — First-Session Checklist

When you join this project in a fresh chat session, follow this read-order for the fastest context recovery:

1. **Read `PROJECT.md`** (this file) — understand the project structure, conventions, and your responsibilities
2. **Read `docs/progress.md`** — find where the user currently is in the curriculum
3. **Read the relevant phase master plan** — understand what the next day's topic should be
4. **Scan one existing lesson HTML** (e.g., `week-01/day-1.html`) — internalize the design pattern before generating anything new
5. **Then begin assisting**

### For Specific Tasks

| Task | Additional files to read |
|---|---|
| Generating a new lesson | Phase master plan + the most recent existing lesson HTML |
| Reviewing a challenge answer | The lesson HTML file where the challenge appears |
| Restructuring the curriculum | Relevant phase master plan + `docs/progress.md` |
| Adding an optional feature | This PROJECT.md (integration patterns) + relevant `assets/` files |
| Debugging a rendering issue | The affected lesson HTML + `week-01/day-1.html` as reference |

---

## Section 16: Glossary of Project Terms

- **Lesson** — A single day's HTML file at `week-XX/day-Y.html`
- **Stage** — A time-bounded subsection within a lesson, typically 4–5 per day, each with a `<div class="stage">` wrapper
- **Challenge** — The required exercise at the end of each lesson, contained in `<div class="challenge">`; the user must attempt it before the day is marked complete
- **Master plan** — A `docs/phase-X-master-plan.md` file defining what every day in that phase should cover
- **Heavy day** — A day flagged `[HEAVY · 2hr]` or `[HEAVY · 3hr]` in the master plan, indicating a session that genuinely benefits from extended time
- **Architect lens** — Explicit commentary in a lesson on trade-offs, scale implications, and production failure modes; always surfaced in a visible callout, never buried in prose
- **Trade-off** — A design decision presented with explicit costs and benefits on both sides; the unit of architect-level reasoning
- **Interview signal** — A concept or question pattern identified in the master plan as appearing in real staff/architect-level interviews
- **Socratic method** — The teaching approach used in this curriculum: concept → challenge → attempt → targeted hint → iterate → confirm; never give the direct answer on the first wrong attempt
- **Phase exit criteria** — The skills and knowledge expected after completing all days in a phase; defined in the closing section of each phase master plan

---

## Section 17: Open Questions / Future Decisions

The following are deliberate deferrals — not gaps to fix now, but decisions left open intentionally.

- Whether to add a public progress dashboard visible to the user's study group
- Whether to publish the narration audio as a podcast feed for offline listening
- Whether to translate selected lessons into Hindi to serve a broader Indian developer audience
- Whether to add a per-lesson commenting or discussion feature for the study group

Do not attempt to resolve these without a explicit conversation with the user. They are parked here to prevent ad-hoc decisions during lesson generation sessions.

---

*Last updated: 2026-06-24*
