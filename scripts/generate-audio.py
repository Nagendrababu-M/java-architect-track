#!/usr/bin/env python3
"""
Java Architect Track — Audio Generator
Converts narration .txt files to MP3 via Google Cloud Text-to-Speech.

Usage:
  python scripts/generate-audio.py --all
  python scripts/generate-audio.py --week 1 --day 1
  python scripts/generate-audio.py --week 1 --day 1 --section 3
  python scripts/generate-audio.py --all --force
  python scripts/generate-audio.py --all --voice en-US-Wavenet-J --speed 0.95

Requirements:
  pip install google-cloud-texttospeech
  export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json
"""

import argparse
import os
import sys
import glob
from pathlib import Path

# ── Try to import Google Cloud TTS ──────────────────────────
try:
    from google.cloud import texttospeech
except ImportError:
    print("ERROR: google-cloud-texttospeech not installed.")
    print("  pip install google-cloud-texttospeech")
    sys.exit(1)

# ── Paths relative to repo root ──────────────────────────────
REPO_ROOT    = Path(__file__).resolve().parent.parent
NARRATION_DIR = REPO_ROOT / "narration"
AUDIO_DIR     = REPO_ROOT / "audio"

# ── Defaults ─────────────────────────────────────────────────
DEFAULT_VOICE    = "en-US-Wavenet-D"
DEFAULT_SPEED    = 1.0
DEFAULT_PITCH    = 0.0
DEFAULT_ENCODING = texttospeech.AudioEncoding.MP3

# Google Cloud TTS free tier: 1M WaveNet chars/month
# Average section ≈ 800 chars → ~5 sections per day, ~40 days free per month
FREE_TIER_LIMIT = 1_000_000


def build_client():
    creds = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if not creds:
        print("WARNING: GOOGLE_APPLICATION_CREDENTIALS not set.")
        print("  export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json")
    return texttospeech.TextToSpeechClient()


def synthesize(client, text: str, out_path: Path, voice_name: str,
               speed: float, pitch: float) -> int:
    """Synthesize text → MP3. Returns character count."""
    lang_code = "-".join(voice_name.split("-")[:2])  # e.g. en-US
    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(
        language_code=lang_code,
        name=voice_name,
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=DEFAULT_ENCODING,
        speaking_rate=speed,
        pitch=pitch,
    )

    response = client.synthesize_speech(
        input=synthesis_input,
        voice=voice,
        audio_config=audio_config,
    )

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_bytes(response.audio_content)
    return len(text)


def narration_files(week: int = None, day: int = None, section: int = None):
    """Yield (week, day, section, txt_path) tuples."""
    if week and day and section:
        p = NARRATION_DIR / f"week-{week:02d}" / f"day-{day}" / f"section-{section}.txt"
        if p.exists():
            yield week, day, section, p
        else:
            print(f"Not found: {p}")
    elif week and day:
        pattern = NARRATION_DIR / f"week-{week:02d}" / f"day-{day}" / "section-*.txt"
        for p in sorted(glob.glob(str(pattern))):
            p = Path(p)
            sec = int(p.stem.split("-")[1])
            yield week, day, sec, p
    else:
        # All narration files
        for txt in sorted(NARRATION_DIR.rglob("section-*.txt")):
            parts = txt.parts
            # Expect .../week-XX/day-Y/section-N.txt
            try:
                wk_str  = [p for p in parts if p.startswith("week-")][-1]
                dy_str  = [p for p in parts if p.startswith("day-")][-1]
                wk = int(wk_str.split("-")[1])
                dy = int(dy_str.split("-")[1])
                sec = int(txt.stem.split("-")[1])
                yield wk, dy, sec, txt
            except (IndexError, ValueError):
                print(f"SKIP unrecognised path: {txt}")


def audio_path(week: int, day: int, section: int) -> Path:
    return AUDIO_DIR / f"week-{week:02d}" / f"day-{day}" / f"section-{section}.mp3"


def main():
    parser = argparse.ArgumentParser(description="Generate MP3 audio from narration text files.")
    parser.add_argument("--all",     action="store_true", help="Process all narration files")
    parser.add_argument("--week",    type=int,  help="Week number")
    parser.add_argument("--day",     type=int,  help="Day number")
    parser.add_argument("--section", type=int,  help="Section number")
    parser.add_argument("--force",   action="store_true", help="Overwrite existing MP3s")
    parser.add_argument("--voice",   default=DEFAULT_VOICE, help=f"TTS voice name (default: {DEFAULT_VOICE})")
    parser.add_argument("--speed",   type=float, default=DEFAULT_SPEED, help="Speaking rate 0.25-4.0 (default: 1.0)")
    parser.add_argument("--pitch",   type=float, default=DEFAULT_PITCH, help="Pitch semitones -20..20 (default: 0)")
    parser.add_argument("--dry-run", action="store_true", help="List files that would be processed, without calling API")
    args = parser.parse_args()

    if not args.all and not (args.week and args.day):
        parser.error("Specify --all or --week + --day (optionally --section)")

    files = list(narration_files(
        week    = args.week if not args.all else None,
        day     = args.day  if not args.all else None,
        section = args.section,
    ))

    if not files:
        print("No narration files found.")
        sys.exit(0)

    total_chars = 0
    generated   = 0
    skipped     = 0

    client = None if args.dry_run else build_client()

    print(f"\n{'DRY RUN — ' if args.dry_run else ''}Processing {len(files)} file(s)  voice={args.voice}  speed={args.speed}x\n")

    for wk, dy, sec, txt_path in files:
        out = audio_path(wk, dy, sec)
        text = txt_path.read_text(encoding="utf-8").strip()
        char_count = len(text)

        if out.exists() and not args.force:
            print(f"  SKIP  week-{wk:02d}/day-{dy}/section-{sec}.mp3  (exists; use --force to overwrite)")
            skipped += 1
            continue

        if args.dry_run:
            print(f"  WOULD  week-{wk:02d}/day-{dy}/section-{sec}.mp3  ({char_count:,} chars)")
            total_chars += char_count
            continue

        print(f"  GEN   week-{wk:02d}/day-{dy}/section-{sec}.mp3  ({char_count:,} chars)…", end=" ", flush=True)
        try:
            synthesize(client, text, out, args.voice, args.speed, args.pitch)
            total_chars += char_count
            generated += 1
            size_kb = out.stat().st_size // 1024
            print(f"✓  {size_kb} KB")
        except Exception as e:
            print(f"✗  ERROR: {e}")

    print(f"\n{'─'*52}")
    if args.dry_run:
        print(f"  Would generate: {len(files)} files  ({total_chars:,} chars)")
    else:
        print(f"  Generated: {generated}   Skipped: {skipped}   Total chars: {total_chars:,}")
    pct = total_chars / FREE_TIER_LIMIT * 100
    print(f"  Free tier usage (WaveNet 1M/month): {total_chars:,} / {FREE_TIER_LIMIT:,}  ({pct:.1f}%)")
    print()


if __name__ == "__main__":
    main()
