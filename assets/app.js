/* ============================================================
   Java Architect Track — App Logic
   Handles: progress tracking, landing page rendering,
            interactive challenge validation + confetti.
   ============================================================ */

/* ── localStorage progress ──────────────────────────────── */
const STORAGE_KEY = 'architect-track-progress';

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function markDayDone(weekNum, dayNum) {
  const progress = loadProgress();
  progress[`${weekNum}-${dayNum}`] = 'done';
  saveProgress(progress);
}

function getDayStatus(weekNum, dayNum, baseStatus) {
  const progress = loadProgress();
  const key = `${weekNum}-${dayNum}`;
  if (progress[key] === 'done') return 'done';
  return baseStatus;
}

/* ── Landing page ────────────────────────────────────────── */
function initLandingPage() {
  if (!document.getElementById('by-day-panel')) return;
  renderProgress();
  renderByDay();
  renderByTopic();
  switchTab('day');
}

function renderProgress() {
  const progress = loadProgress();
  const doneCount = Object.values(progress).filter(v => v === 'done').length;
  const total = CURRICULUM.total;
  const pct = (doneCount / total) * 100;

  const countEl = document.getElementById('progress-count');
  const barEl   = document.getElementById('progress-bar-fill');
  if (countEl) countEl.textContent = `${doneCount} of ${total} days complete`;
  if (barEl)   barEl.style.width = `${pct.toFixed(1)}%`;
}

function renderByDay() {
  const container = document.getElementById('by-day-panel');
  if (!container) return;
  const progress = loadProgress();
  let html = '';

  CURRICULUM.weeks.forEach(week => {
    const doneInWeek    = week.days.filter(d => getDayStatus(week.week, d.day, d.status) === 'done').length;
    const currentInWeek = week.days.some(d => getDayStatus(week.week, d.day, d.status) === 'current');
    const phase         = CURRICULUM.phases.find(p => p.id === week.phase);
    const phaseLabel    = phase ? phase.name : '';

    html += `
    <div class="week-section">
      <div class="week-header" onclick="toggleWeek(this)" data-week="${week.week}">
        <span class="week-number">WK ${String(week.week).padStart(2,'0')}</span>
        <span class="week-title">${week.title}</span>
        <span class="week-meta">${phaseLabel} · ${doneInWeek}/${week.days.length}</span>
        <span class="week-chevron">▾</span>
      </div>
      <div class="week-days" id="week-days-${week.week}">
        ${week.days.map(d => renderDayCard(week.week, d, progress)).join('')}
      </div>
    </div>`;
  });

  container.innerHTML = html;

  // Auto-open week 1
  const hdr = container.querySelector('[data-week="1"]');
  if (hdr) openWeek(hdr);
}

function renderDayCard(weekNum, day, progress) {
  const status   = getDayStatus(weekNum, day.day, day.status);
  const isLocked = status === 'locked';
  const isDone   = status === 'done';
  const isCurrent= status === 'current';
  const isComingSoon = !day.file && !isLocked;

  const statusIcon = isDone ? '✅' : isCurrent ? '🔵' : isLocked ? '🔒' : '🔵';
  const durLabel   = day.duration >= 90 ? `${day.duration} min ⚡` : `${day.duration} min`;
  const classes    = ['day-card', status, isComingSoon ? 'coming-soon' : ''].filter(Boolean).join(' ');
  const tooltip    = isLocked ? 'data-tooltip="Complete previous days first"' : '';
  const href       = (!isLocked && day.file) ? day.file : '#';
  const tag        = (!isLocked && day.file) ? 'a' : 'div';

  return `
  <${tag} class="${classes}" ${tag==='a' ? `href="${href}"` : ''} ${tooltip}>
    <div class="day-number">DAY ${day.day}</div>
    <div class="day-title">${day.heavy ? '⚡ ' : ''}${day.title}</div>
    <div class="day-footer">
      <span class="day-duration">${isComingSoon && !day.file ? 'Coming soon' : durLabel}</span>
      <span class="day-status">${statusIcon}</span>
    </div>
  </${tag}>`;
}

function toggleWeek(header) {
  const isOpen = header.classList.contains('open');
  if (isOpen) {
    closeWeek(header);
  } else {
    openWeek(header);
  }
}
function openWeek(header) {
  const week = header.dataset.week;
  header.classList.add('open');
  document.getElementById(`week-days-${week}`).classList.add('open');
}
function closeWeek(header) {
  const week = header.dataset.week;
  header.classList.remove('open');
  document.getElementById(`week-days-${week}`).classList.remove('open');
}

function renderByTopic() {
  const container = document.getElementById('by-topic-panel');
  if (!container) return;
  const progress = loadProgress();

  // Group days by topic
  const topicMap = {};
  CURRICULUM.allDays.forEach(d => {
    if (!topicMap[d.topic]) topicMap[d.topic] = [];
    topicMap[d.topic].push(d);
  });

  let html = '<div class="topics-grid">';
  Object.entries(topicMap).forEach(([topic, days]) => {
    const totalMins = days.reduce((s, d) => s + d.duration, 0);
    const hrs = (totalMins / 60).toFixed(1);
    const accessible = days.filter(d => d.file);

    html += `
    <div class="topic-card">
      <div class="topic-name">${topic}</div>
      <div class="topic-stats">
        <span><span>${days.length}</span> lessons</span>
        <span><span>${hrs}</span> hrs total</span>
      </div>
      <div class="topic-days">
        ${accessible.slice(0, 5).map(d => {
          const status = getDayStatus(d.weekNum, d.day, d.status);
          const locked = status === 'locked';
          return `<a class="topic-day-link ${locked ? 'locked' : ''}" href="${locked ? '#' : d.file}">
            <span>${d.title}</span>
            <span class="topic-day-num">Day ${d.day}</span>
          </a>`;
        }).join('')}
        ${days.length > 5 ? `<div class="topic-day-link locked" style="justify-content:center;color:var(--ink-faint)">+ ${days.length - 5} more (locked)</div>` : ''}
      </div>
    </div>`;
  });
  html += '</div>';
  container.innerHTML = html;
}

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.toggle('active', panel.id === `by-${tab}-panel`);
  });
}

/* ── Challenge validation (lesson pages) ────────────────── */

function validateChallenge(dayKey) {
  const parts    = dayKey.split('-');
  const weekNum  = parseInt(parts[0]);
  const dayNum   = parseInt(parts[1]);
  const dayData  = CURRICULUM.dayMap[dayKey];
  if (!dayData || !dayData.challenge) return;

  const challenge = dayData.challenge;
  const formEl    = document.getElementById(`challenge-${dayKey}`);
  if (!formEl) return;

  let correct = 0;
  const total = challenge.questions.length;

  challenge.questions.forEach(q => {
    const selectEl  = formEl.querySelector(`[name="${q.id}"]`);
    const iconEl    = formEl.querySelector(`#r-${dayKey}-${q.id}`);
    const hintEl    = formEl.querySelector(`#h-${dayKey}-${q.id}`);
    const explainEl = formEl.querySelector(`#e-${dayKey}-${q.id}`);
    if (!selectEl) return;

    const val = selectEl.value.trim().toUpperCase();
    if (!val) {
      selectEl.classList.add('wrong');
      if (iconEl) iconEl.textContent = '⚠️';
      if (hintEl) { hintEl.textContent = 'Please select an answer.'; hintEl.classList.add('visible'); }
      return;
    }

    const isCorrect = val === q.answer.toUpperCase();
    selectEl.classList.toggle('correct', isCorrect);
    selectEl.classList.toggle('wrong', !isCorrect);
    if (iconEl) iconEl.textContent = isCorrect ? '✅' : '❌';

    if (isCorrect) {
      correct++;
      if (hintEl) { hintEl.classList.remove('visible'); }
      if (explainEl) { explainEl.classList.add('visible'); }
    } else {
      if (hintEl) { hintEl.textContent = q.hint || 'Check the decision tree.'; hintEl.classList.add('visible'); }
      if (explainEl) { explainEl.classList.remove('visible'); }
    }
  });

  // Score display
  const scoreEl = formEl.querySelector(`#score-${dayKey}`);
  if (scoreEl) {
    scoreEl.classList.add('visible');
    if (correct === total) {
      scoreEl.innerHTML = `<span class="score-perfect">🎉 ${correct}/${total} — Perfect score!</span>`;
      triggerConfetti();
      unlockNextDay(weekNum, dayNum);
      const banner = formEl.querySelector('.unlock-banner');
      if (banner) banner.classList.add('visible');
    } else if (correct >= total * 0.6) {
      scoreEl.innerHTML = `<span class="score-partial">${correct}/${total} correct — almost there!</span>`;
    } else {
      scoreEl.innerHTML = `<span class="score-poor">${correct}/${total} correct — review the lesson and try again.</span>`;
    }
  }

  // Show "Show Answers" button after first attempt
  const showBtn = formEl.querySelector(`#show-btn-${dayKey}`);
  if (showBtn) showBtn.style.display = 'inline-flex';

  if (correct === total) markDayDone(weekNum, dayNum);
}

function showAnswers(dayKey) {
  const dayData = CURRICULUM.dayMap[dayKey];
  if (!dayData || !dayData.challenge) return;
  const formEl = document.getElementById(`challenge-${dayKey}`);
  if (!formEl) return;

  dayData.challenge.questions.forEach(q => {
    const selectEl  = formEl.querySelector(`[name="${q.id}"]`);
    const iconEl    = formEl.querySelector(`#r-${dayKey}-${q.id}`);
    const explainEl = formEl.querySelector(`#e-${dayKey}-${q.id}`);
    if (!selectEl) return;

    selectEl.value = q.answer;
    selectEl.classList.remove('wrong');
    selectEl.classList.add('correct');
    selectEl.disabled = true;
    if (iconEl) iconEl.textContent = '✅';
    if (explainEl) explainEl.classList.add('visible');
  });

  // Disable check button
  const checkBtn = formEl.querySelector('.btn-check');
  if (checkBtn) checkBtn.disabled = true;
}

/* ── Open-ended challenge (Day 3) ───────────────────────── */

function initOpenEndedChallenge(dayKey) {
  const dayData = CURRICULUM.dayMap[dayKey];
  if (!dayData || dayData.challenge.type !== 'open-ended') return;

  dayData.challenge.questions.forEach(q => {
    const textarea = document.getElementById(`ta-${dayKey}-${q.id}`);
    const countEl  = document.getElementById(`cc-${dayKey}-${q.id}`);
    const revealBtn = document.getElementById(`reveal-${dayKey}-${q.id}`);
    if (!textarea) return;

    textarea.addEventListener('input', () => {
      const len = textarea.value.trim().length;
      if (countEl) {
        countEl.textContent = `${len} / ${q.minChars} characters`;
        countEl.classList.toggle('ready', len >= q.minChars);
      }
      if (revealBtn) {
        revealBtn.disabled = len < q.minChars;
      }
    });
  });
}

function revealModelAnswer(dayKey, questionId) {
  const el = document.getElementById(`ma-${dayKey}-${questionId}`);
  if (el) el.classList.add('visible');
  const btn = document.getElementById(`reveal-${dayKey}-${questionId}`);
  if (btn) btn.disabled = true;

  // Mark day 3 as done once all answers revealed
  const dayData = CURRICULUM.dayMap[dayKey];
  if (!dayData) return;
  const allRevealed = dayData.challenge.questions.every(q =>
    document.getElementById(`ma-${dayKey}-${q.id}`)?.classList.contains('visible')
  );
  if (allRevealed) {
    const parts = dayKey.split('-');
    markDayDone(parseInt(parts[0]), parseInt(parts[1]));
  }
}

/* ── Unlock next day ─────────────────────────────────────── */

function unlockNextDay(weekNum, dayNum) {
  const progress = loadProgress();
  // Find next day
  const week = CURRICULUM.weeks.find(w => w.week === weekNum);
  if (!week) return;
  const dayIdx = week.days.findIndex(d => d.day === dayNum);
  if (dayIdx < week.days.length - 1) {
    const nextDay = week.days[dayIdx + 1];
    const nextKey = `${weekNum}-${nextDay.day}`;
    if (!progress[nextKey]) {
      progress[nextKey] = 'current';
      saveProgress(progress);
    }
  }
}

/* ── Confetti ─────────────────────────────────────────────── */

function triggerConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);

  const colors = ['#ff7a3d','#ffb38a','#6ed3a8','#7ab8e8','#b18ae0','#e8c87a'];
  const count  = 60;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left       = `${Math.random() * 100}%`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay    = `${Math.random() * 0.8}s`;
    piece.style.animationDuration = `${1.8 + Math.random() * 1.2}s`;
    piece.style.transform  = `rotate(${Math.random() * 360}deg)`;
    piece.style.width  = `${6 + Math.random() * 6}px`;
    piece.style.height = `${6 + Math.random() * 6}px`;
    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 3500);
}

/* ── Boot ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLandingPage();
  // Lesson pages call their own init (e.g. initOpenEndedChallenge) inline.
});
