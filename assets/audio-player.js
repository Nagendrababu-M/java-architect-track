/* ============================================================
   Java Architect Track — Audio Player
   Companion to audio-player.css
   ============================================================
   Deliverables handled here:
   • Per-stage play buttons (HEAD-checks MP3 existence)
   • "Play Full Lesson" button with auto-advance
   • Floating mini audio bar (progress, speed, scrub, time)
   • Resume capability (localStorage, resume banner)
   • Keyboard shortcuts (Space, ←/→, N, P, Esc)
   ============================================================ */

(function () {
  'use strict';

  /* ── Constants ─────────────────────────────────────────── */
  const SPEEDS       = [0.75, 1, 1.25, 1.5, 1.75, 2];
  const SAVE_INTERVAL_MS = 5000;
  const ADVANCE_DELAY_MS = 800;
  const STORAGE_KEY_SPEED = 'audio-speed';
  const storageKey = (wk, dy) => `audio-state-w${wk}d${dy}`;

  /* ── Detect lesson from URL ─────────────────────────────── */
  const m = window.location.pathname.match(/week-(\d+)\/day-(\d+)(?:\.html)?/i);
  if (!m) return; // not a lesson page

  const weekNum = parseInt(m[1], 10);
  const dayNum  = parseInt(m[2], 10);
  const STATE_KEY = storageKey(weekNum, dayNum);

  /* ── Resolve audio URL for a section ───────────────────── */
  function audioUrl(sectionIndex) {
    return `../audio/week-${String(weekNum).padStart(2,'0')}/day-${dayNum}/section-${sectionIndex}.mp3`;
  }

  /* ── HEAD-check whether an MP3 exists ──────────────────── */
  async function mp3Exists(url) {
    try {
      const r = await fetch(url, { method: 'HEAD' });
      return r.ok;
    } catch (_) {
      return false;
    }
  }

  /* ── Collect stage elements ─────────────────────────────── */
  const stages = Array.from(document.querySelectorAll('.stage[data-section]'));
  if (!stages.length) return; // no audio-enabled stages

  /* ── State ──────────────────────────────────────────────── */
  let audio       = new Audio();
  let currentIdx  = -1;   // which stage is active (-1 = none)
  let isPlaying   = false;
  let fullMode    = false; // true = playing all stages in sequence
  let speedIdx    = SPEEDS.indexOf(parseFloat(localStorage.getItem(STORAGE_KEY_SPEED) || '1'));
  if (speedIdx < 0) speedIdx = 1;
  let saveTimer   = null;
  let sectionAvailable = []; // bool per stage (set during init)

  /* ── Restore / persist playback state ───────────────────── */
  function loadState() {
    try { return JSON.parse(localStorage.getItem(STATE_KEY)) || {}; } catch (_) { return {}; }
  }
  function saveState() {
    if (currentIdx < 0) return;
    const s = loadState();
    s.sectionIndex = currentIdx;
    s.position     = audio.currentTime;
    s.speed        = SPEEDS[speedIdx];
    s.fullMode     = fullMode;
    localStorage.setItem(STATE_KEY, JSON.stringify(s));
  }
  function clearState() {
    localStorage.removeItem(STATE_KEY);
  }

  /* ── Toast ──────────────────────────────────────────────── */
  function showToast(msg, duration = 2800) {
    const t = document.createElement('div');
    t.className = 'audio-toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => {
      t.classList.add('toast-exit');
      t.addEventListener('animationend', () => t.remove());
    }, duration);
  }

  /* ── Mini bar elements (created once) ───────────────────── */
  const bar = document.createElement('div');
  bar.className = 'audio-mini-bar';
  bar.innerHTML = `
    <div class="ambar-top">
      <span class="ambar-now-playing" id="ambar-label">—</span>
      <button class="ambar-close" id="ambar-close" title="Close player">✕</button>
    </div>
    <div class="ambar-progress-wrap" id="ambar-progress-wrap">
      <div class="ambar-progress-fill" id="ambar-progress-fill" style="width:0%"></div>
      <div class="ambar-progress-thumb" id="ambar-progress-thumb" style="left:0%"></div>
    </div>
    <div class="ambar-controls">
      <span class="ambar-time" id="ambar-time">0:00 / 0:00</span>
      <div class="ambar-center">
        <button class="ambar-btn" id="ambar-prev" title="Previous section (P)">⏮</button>
        <button class="ambar-btn" id="ambar-back" title="Back 10s (←)">⏪</button>
        <button class="ambar-play-pause" id="ambar-playpause" title="Play/Pause (Space)">▶</button>
        <button class="ambar-btn" id="ambar-fwd" title="Forward 10s (→)">⏩</button>
        <button class="ambar-btn" id="ambar-next" title="Next section (N)">⏭</button>
      </div>
      <button class="ambar-speed" id="ambar-speed">${SPEEDS[speedIdx]}×</button>
    </div>
  `;
  document.body.appendChild(bar);

  const elLabel    = bar.querySelector('#ambar-label');
  const elFill     = bar.querySelector('#ambar-progress-fill');
  const elThumb    = bar.querySelector('#ambar-progress-thumb');
  const elTime     = bar.querySelector('#ambar-time');
  const elPP       = bar.querySelector('#ambar-playpause');
  const elSpeed    = bar.querySelector('#ambar-speed');
  const elProgWrap = bar.querySelector('#ambar-progress-wrap');
  const elClose    = bar.querySelector('#ambar-close');
  const elPrev     = bar.querySelector('#ambar-prev');
  const elBack     = bar.querySelector('#ambar-back');
  const elFwd      = bar.querySelector('#ambar-fwd');
  const elNext     = bar.querySelector('#ambar-next');

  function showBar() { bar.classList.add('visible'); }
  function hideBar() { bar.classList.remove('visible'); }

  /* ── Section play buttons ─────────────────────────────────
     Injected next to each stage heading                       */
  const sectionBtns = stages.map((stage, idx) => {
    const btn = document.createElement('button');
    btn.className = 'section-play-btn';
    btn.title     = 'Loading…';
    btn.disabled  = true;
    btn.setAttribute('aria-label', `Play section ${idx + 1}`);
    btn.innerHTML = '▶';

    // Find a heading to place the button next to
    const heading = stage.querySelector('h2, h3, h4, .stage-heading, .stage-tag');
    if (heading) {
      heading.appendChild(btn);
    } else {
      stage.prepend(btn);
    }

    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      if (currentIdx === idx && isPlaying) {
        pauseAudio();
      } else {
        playSectionIdx(idx, 0, false);
      }
    });

    return btn;
  });

  /* ── "Play Full Lesson" button ───────────────────────────── */
  const mount = document.getElementById('play-full-lesson-mount');
  let pflBtn = null;
  if (mount) {
    pflBtn = document.createElement('button');
    pflBtn.className = 'play-full-lesson-btn';
    pflBtn.innerHTML = `
      <span class="pfl-label">▶&ensp;Play Full Lesson</span>
      <span class="pfl-sub" id="pfl-sub">Checking audio…</span>
    `;
    pflBtn.disabled = true;
    mount.appendChild(pflBtn);

    pflBtn.addEventListener('click', () => {
      if (isPlaying && fullMode) {
        pauseAudio();
      } else if (isPlaying && !fullMode) {
        // Switch to full mode from current position
        fullMode = true;
        updatePflBtn();
      } else {
        // Start full lesson from first available
        const first = sectionAvailable.findIndex(Boolean);
        if (first >= 0) playFullFrom(first);
      }
    });
  }

  /* ── Audio event wiring ──────────────────────────────────── */
  audio.addEventListener('timeupdate', onTimeUpdate);
  audio.addEventListener('ended',      onEnded);
  audio.addEventListener('error',      onError);
  audio.addEventListener('play',       () => { isPlaying = true;  syncUI(); });
  audio.addEventListener('pause',      () => { isPlaying = false; syncUI(); });

  function onTimeUpdate() {
    const cur = audio.currentTime;
    const dur = audio.duration || 0;
    const pct = dur ? (cur / dur) * 100 : 0;
    elFill.style.width  = pct + '%';
    elThumb.style.left  = pct + '%';
    elTime.textContent  = `${fmt(cur)} / ${fmt(dur)}`;
  }

  function onEnded() {
    isPlaying = false;
    syncUI();
    if (fullMode) {
      // Auto-advance after delay
      setTimeout(() => advanceToNext(), ADVANCE_DELAY_MS);
    } else {
      clearSaveTimer();
    }
  }

  function onError() {
    isPlaying = false;
    syncUI();
    if (fullMode) {
      showToast(`⚠ Section ${currentIdx + 1} unavailable — skipping`);
      setTimeout(() => advanceToNext(), 600);
    } else {
      showToast('⚠ Could not load audio for this section.');
    }
  }

  function advanceToNext() {
    // Find next available section after currentIdx
    for (let i = currentIdx + 1; i < stages.length; i++) {
      if (sectionAvailable[i]) {
        playSectionIdx(i, 0, true);
        // Smooth scroll to stage
        stages[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    // No more sections
    fullMode = false;
    clearSaveTimer();
    clearState();
    showToast('✅ Lesson complete!');
    updatePflBtn();
  }

  /* ── Core playback ──────────────────────────────────────── */
  function playSectionIdx(idx, startTime, isFull) {
    if (idx < 0 || idx >= stages.length) return;
    fullMode    = isFull;
    currentIdx  = idx;

    audio.src           = audioUrl(stages[idx].dataset.section);
    audio.playbackRate  = SPEEDS[speedIdx];
    audio.currentTime   = startTime || 0;

    audio.play().catch(err => {
      console.warn('[AudioPlayer] play() rejected:', err);
    });

    // Label
    const label = stages[idx].querySelector('h2, h3, h4')?.textContent?.trim()
                  || `Section ${idx + 1}`;
    elLabel.textContent = `§${idx + 1} — ${label}`;

    showBar();
    startSaveTimer();
    syncUI();
  }

  function playFullFrom(idx) {
    fullMode = true;
    playSectionIdx(idx, 0, true);
    stages[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function pauseAudio() {
    audio.pause();
  }

  function resumeAudio() {
    audio.play().catch(() => {});
  }

  /* ── UI sync ─────────────────────────────────────────────── */
  function syncUI() {
    // Section buttons
    sectionBtns.forEach((btn, i) => {
      btn.classList.toggle('is-playing', isPlaying && currentIdx === i);
      btn.innerHTML = (isPlaying && currentIdx === i) ? '⏸' : '▶';
    });

    // Mini bar play/pause
    elPP.innerHTML = isPlaying ? '⏸' : '▶';
    elPP.title     = isPlaying ? 'Pause (Space)' : 'Play (Space)';

    // PFL button
    updatePflBtn();
  }

  function updatePflBtn() {
    if (!pflBtn) return;
    const anyAvail = sectionAvailable.some(Boolean);
    pflBtn.disabled = !anyAvail;

    if (isPlaying && fullMode) {
      pflBtn.classList.add('is-playing');
      pflBtn.querySelector('.pfl-label').innerHTML = '⏸&ensp;Pause Lesson';
    } else {
      pflBtn.classList.remove('is-playing');
      pflBtn.querySelector('.pfl-label').innerHTML = '▶&ensp;Play Full Lesson';
    }

    const count = sectionAvailable.filter(Boolean).length;
    const sub = pflBtn.querySelector('#pfl-sub');
    if (sub) {
      sub.textContent = anyAvail
        ? `${count} of ${stages.length} sections available`
        : 'No audio available for this lesson';
    }
  }

  /* ── Scrub bar interaction ───────────────────────────────── */
  let isScrubbing = false;

  function scrubTo(e) {
    const rect = elProgWrap.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audio.duration) {
      audio.currentTime = pct * audio.duration;
    }
  }

  elProgWrap.addEventListener('mousedown', e => { isScrubbing = true; scrubTo(e); });
  document.addEventListener('mousemove',  e => { if (isScrubbing) scrubTo(e); });
  document.addEventListener('mouseup',    ()  => { isScrubbing = false; });

  // Touch support
  elProgWrap.addEventListener('touchstart', e => {
    isScrubbing = true; scrubTo(e.touches[0]);
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    if (isScrubbing) scrubTo(e.touches[0]);
  }, { passive: true });
  document.addEventListener('touchend', () => { isScrubbing = false; });

  /* ── Controls ────────────────────────────────────────────── */
  elPP.addEventListener('click', () => {
    if (currentIdx < 0) {
      const first = sectionAvailable.findIndex(Boolean);
      if (first >= 0) playSectionIdx(first, 0, false);
    } else {
      isPlaying ? pauseAudio() : resumeAudio();
    }
  });

  elBack.addEventListener('click', () => { audio.currentTime = Math.max(0, audio.currentTime - 10); });
  elFwd.addEventListener('click',  () => { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10); });

  elPrev.addEventListener('click', () => {
    if (currentIdx > 0) {
      for (let i = currentIdx - 1; i >= 0; i--) {
        if (sectionAvailable[i]) { playSectionIdx(i, 0, fullMode); return; }
      }
    }
  });

  elNext.addEventListener('click', () => {
    for (let i = currentIdx + 1; i < stages.length; i++) {
      if (sectionAvailable[i]) { playSectionIdx(i, 0, fullMode); return; }
    }
  });

  elSpeed.addEventListener('click', () => {
    speedIdx = (speedIdx + 1) % SPEEDS.length;
    const s = SPEEDS[speedIdx];
    audio.playbackRate = s;
    elSpeed.textContent = s + '×';
    localStorage.setItem(STORAGE_KEY_SPEED, String(s));
    showToast(`Speed: ${s}×`, 1500);
  });

  elClose.addEventListener('click', () => {
    pauseAudio();
    hideBar();
    clearSaveTimer();
  });

  /* ── Keyboard shortcuts ──────────────────────────────────── */
  document.addEventListener('keydown', e => {
    // Don't fire when typing in an input/textarea
    if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;

    switch (e.key) {
      case ' ':
        e.preventDefault();
        if (currentIdx < 0) {
          const first = sectionAvailable.findIndex(Boolean);
          if (first >= 0) playSectionIdx(first, 0, false);
        } else {
          isPlaying ? pauseAudio() : resumeAudio();
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        audio.currentTime = Math.max(0, audio.currentTime - 10);
        break;
      case 'ArrowRight':
        e.preventDefault();
        audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
        break;
      case 'n': case 'N':
        elNext.click();
        break;
      case 'p': case 'P':
        elPrev.click();
        break;
      case 'Escape':
        elClose.click();
        break;
    }
  });

  /* ── Save timer ──────────────────────────────────────────── */
  function startSaveTimer() {
    clearSaveTimer();
    saveTimer = setInterval(saveState, SAVE_INTERVAL_MS);
  }
  function clearSaveTimer() {
    if (saveTimer) { clearInterval(saveTimer); saveTimer = null; }
  }

  /* ── Resume banner ───────────────────────────────────────── */
  function maybeShowResumeBanner(savedState) {
    if (!savedState || savedState.sectionIndex == null || savedState.position == null) return;
    const idx = savedState.sectionIndex;
    if (idx < 0 || idx >= stages.length) return;
    if (!sectionAvailable[idx]) return;
    if (savedState.position < 2) return; // essentially at start, skip banner

    const label = stages[idx].querySelector('h2, h3, h4')?.textContent?.trim()
                  || `Section ${idx + 1}`;
    const timeStr = fmt(savedState.position);

    const banner = document.createElement('div');
    banner.className = 'resume-banner';
    banner.innerHTML = `
      <span class="resume-banner-text">
        Resume <strong>§${idx + 1} — ${label}</strong> at <strong>${timeStr}</strong>?
      </span>
      <div class="resume-banner-btns">
        <button class="resume-btn-primary" id="rb-resume">Resume</button>
        <button class="resume-btn-secondary" id="rb-restart">Start Over</button>
      </div>
      <button class="resume-banner-dismiss" id="rb-dismiss" title="Dismiss">✕</button>
    `;

    // Insert after lesson header or at top of main content
    const header = document.querySelector('.lesson-header, header, main, .container');
    if (header && header.parentNode) {
      header.parentNode.insertBefore(banner, header.nextSibling);
    } else {
      document.body.prepend(banner);
    }

    banner.querySelector('#rb-resume').addEventListener('click', () => {
      const fm = savedState.fullMode || false;
      playSectionIdx(idx, savedState.position, fm);
      banner.remove();
    });

    banner.querySelector('#rb-restart').addEventListener('click', () => {
      clearState();
      banner.remove();
      const first = sectionAvailable.findIndex(Boolean);
      if (first >= 0) playFullFrom(first);
    });

    banner.querySelector('#rb-dismiss').addEventListener('click', () => {
      banner.remove();
    });
  }

  /* ── Helper: format seconds → M:SS ──────────────────────── */
  function fmt(s) {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  /* ── Initialise: HEAD-check all sections ─────────────────── */
  async function init() {
    const checks = stages.map((stage, idx) => {
      const url = audioUrl(stage.dataset.section);
      return mp3Exists(url).then(ok => {
        sectionAvailable[idx] = ok;
        const btn = sectionBtns[idx];
        if (ok) {
          btn.disabled = false;
          btn.title    = 'Play this section';
        } else {
          btn.disabled = true;
          btn.title    = 'Audio not available for this section';
        }
      });
    });

    await Promise.all(checks);

    updatePflBtn();

    // Restore saved speed
    audio.playbackRate = SPEEDS[speedIdx];

    // Resume banner
    const saved = loadState();
    maybeShowResumeBanner(saved);
  }

  init();

})();
