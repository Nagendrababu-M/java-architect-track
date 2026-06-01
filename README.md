# Java Architect Track

22-week curriculum site — pure HTML/CSS/JS, no build step, deploys to Netlify Drop as-is.

## Deploy to Netlify (5 steps)

1. Go to **[app.netlify.com/drop](https://app.netlify.com/drop)**
2. Open File Explorer and navigate to this `architect-track/` folder
3. Drag the **entire `architect-track/` folder** onto the Netlify Drop page
4. Wait ~10 seconds — Netlify gives you a live URL like `https://random-name.netlify.app`
5. Bookmark that URL — progress is saved in your browser's localStorage per device

> To update the site later: re-drag the folder to the same Netlify Drop page, or connect to a GitHub repo for automatic deploys on push.

## Project Structure

```
architect-track/
├── index.html              # Landing page (hero, progress bar, week/topic navigation)
├── assets/
│   ├── styles.css          # Shared design system (all pages link here)
│   └── app.js              # Navigation, challenge validation, confetti, localStorage
├── data/
│   └── curriculum.js       # All 22 weeks of metadata + answer keys for Days 1-3
├── week-01/
│   ├── day-1.html          # Stack vs Heap — interactive 3-question challenge
│   ├── day-2.html          # Static/Instance/Metaspace — interactive 7-row challenge
│   └── day-3.html          # GC Fundamentals — open-ended scenario with model answers
└── README.md
```

## Progress Tracking

Progress is stored in `localStorage` under the key `architect-track-progress`. It's per-browser — clearing browser data resets progress. No account or backend needed.

- Complete a lesson's challenge → that day is marked ✅ done
- The next day is automatically unlocked (🔵 current)
- The landing page progress bar reads from the same storage

## Adding New Lessons

1. Add the week/day entry in `data/curriculum.js` with `file: "week-XX/day-Y.html"` and `status: "locked"`
2. Create `week-XX/day-Y.html` using any existing lesson as a template
3. Link `../assets/styles.css`, `../data/curriculum.js`, and `../assets/app.js`
4. Add a `<div class="challenge-form" id="challenge-W-D">` block and call `validateChallenge('W-D')` for select challenges, or `initOpenEndedChallenge('W-D')` + `revealModelAnswer('W-D', 'qId')` for open-ended ones

## Design System

Dark editorial theme — variables in `assets/styles.css` `:root`. Fonts loaded from Google Fonts:
- **Fraunces** (serif, headings)
- **Inter Tight** (body)
- **JetBrains Mono** (code, metadata, labels)
