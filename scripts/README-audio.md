# Audio Narration — Setup & Workflow

Adds spoken narration (MP3) to each lesson section using Google Cloud Text-to-Speech.

---

## Folder Structure

```
architect-track/
├── narration/
│   └── week-01/
│       ├── day-1/
│       │   ├── section-1.txt   ← narration script for Stage 1
│       │   ├── section-2.txt
│       │   └── ...
│       ├── day-2/
│       └── day-3/
├── audio/                      ← generated MP3s (git-ignored)
│   └── week-01/
│       └── day-1/
│           ├── section-1.mp3
│           └── ...
└── scripts/
    └── generate-audio.py
```

---

## 4-Step Workflow

### Step 1 — Write narration scripts

Create a `.txt` file for each section. Keep it conversational, as if explaining to a colleague. A good section is 400–900 words (~2–5 min of audio).

**Example** — `narration/week-01/day-1/section-1.txt`:
```
Welcome to Day 1 of the Java Architect Track. Today we're diving into the JVM stack and heap...
```

### Step 2 — Set up Google Cloud credentials

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Enable the **Cloud Text-to-Speech API**
3. Create a **Service Account** → download JSON key
4. Export the path:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
   ```

### Step 3 — Install dependency & generate MP3s

```bash
pip install google-cloud-texttospeech

# Dry run (no API calls) — see what would be generated
python scripts/generate-audio.py --all --dry-run

# Generate everything
python scripts/generate-audio.py --all

# Generate only a specific day
python scripts/generate-audio.py --week 1 --day 1

# Generate a single section
python scripts/generate-audio.py --week 1 --day 1 --section 3

# Regenerate even if MP3 already exists
python scripts/generate-audio.py --week 1 --day 2 --force
```

### Step 4 — Update curriculum.js

When audio is ready for a day, flip `available: true` in `data/curriculum.js`:

```js
audio: { available: true, voice: "en-US-Wavenet-D", sectionCount: 5, estimatedMinutes: 18 }
```

The 🎧 badge will appear on the landing page card automatically.

---

## Voice Options

| Voice | Style | Notes |
|-------|-------|-------|
| `en-US-Wavenet-D` | Male, calm | Default — good for technical content |
| `en-US-Wavenet-J` | Male, authoritative | Slightly deeper |
| `en-US-Wavenet-F` | Female, clear | Great pacing |
| `en-US-Neural2-D` | Male, natural | Highest quality (Neural2 tier) |
| `en-US-Neural2-F` | Female, natural | Highest quality (Neural2 tier) |

See full list: [Google Cloud TTS voices](https://cloud.google.com/text-to-speech/docs/voices)

Specify a voice:
```bash
python scripts/generate-audio.py --all --voice en-US-Wavenet-J
```

Adjust speed (0.25–4.0):
```bash
python scripts/generate-audio.py --all --speed 0.95
```

---

## Free Tier Limits (as of 2024)

| Type | Free per month |
|------|---------------|
| Standard voices | 4M characters |
| WaveNet voices | 1M characters |
| Neural2 voices | 1M characters |

A typical 5-section lesson ≈ 4,000 chars = **0.4% of WaveNet free tier**.  
You can generate ~250 lessons per month for free.

---

## Iteration Tips

- Write a section, generate, listen in browser with the player, tweak wording, `--force` regenerate
- Use `--dry-run` to estimate character counts before committing to API calls
- The player auto-skips sections where no MP3 exists — you can ship partial audio
- MP3s are git-ignored (add `audio/` to `.gitignore`) — serve them from Netlify Large Media or a CDN

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `google.auth.exceptions.DefaultCredentialsError` | Set `GOOGLE_APPLICATION_CREDENTIALS` |
| `403 PERMISSION_DENIED` | Enable Text-to-Speech API in GCP console |
| Audio button stays disabled | MP3 not found at expected URL — check folder names match `week-NN/day-N/section-N.mp3` |
| `InaccessibleObjectException` in browser console | Unrelated to audio — Java Reflection error in lesson content |

---

## .gitignore Entry

Add to your `.gitignore`:
```
audio/
```

MP3 files can be large; keep them out of git and deploy via Netlify drag-and-drop or a storage bucket.
