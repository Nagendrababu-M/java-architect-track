/* ============================================================
   Java Architect Track — App Logic
   Handles: progress tracking, landing page rendering,
            interactive challenge validation + confetti.
   ============================================================ */

/* ── Topic color hash — same result as browse section ────── */
function topicPhase(topic) {
  let h = 0;
  for (let i = 0; i < topic.length; i++) h = (h * 31 + topic.charCodeAt(i)) >>> 0;
  return (h % 6) + 1;
}

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

/* ── Resume card ─────────────────────────────────────────── */
function renderResumeCard() {
  const el = document.getElementById('resume-card');
  if (!el) return;
  const progress = loadProgress();

  // Find first 'current' day — check progress overrides first, then curriculum
  let currentDay = null;
  for (const d of CURRICULUM.allDays) {
    const key = `${d.weekNum}-${d.day}`;
    const status = progress[key] || d.status;
    if (status === 'current' && d.file) { currentDay = d; break; }
  }

  if (!currentDay) { el.style.display = 'none'; return; }

  const durText = currentDay.duration ? `${currentDay.duration} min` : '';
  const audioText = currentDay.audio?.available ? ' · 🎧 audio' : '';

  el.innerHTML = `
  <a class="resume-card" href="${currentDay.file}">
    <div class="resume-left">
      <div class="resume-eyebrow">▶ Continue learning — Day ${currentDay.day}</div>
      <div class="resume-title">${currentDay.title}</div>
      <div class="resume-meta">
        <span>${currentDay.topic}</span>
        <span class="resume-meta-dot"></span>
        <span>Week ${currentDay.weekNum}</span>
        ${durText ? `<span class="resume-meta-dot"></span><span>${durText}${audioText}</span>` : ''}
      </div>
    </div>
    <div class="resume-btn">Resume →</div>
  </a>`;
}

/* ── Landing page ────────────────────────────────────────── */
function initLandingPage() {
  if (!document.getElementById('by-day-panel')) return;
  renderProgress();
  renderResumeCard();
  renderByDay();
  renderByTopic();
  switchTab('day');
  initSearchShortcut();
  scrollToActiveWeek();
}

function renderHeartbeat(doneCount, total) {
  const svg = document.getElementById('heartbeat-svg');
  if (!svg) return;

  const W = 360, H = 50, CY = 25;
  const rnd = () => Math.random();

  function makeTilePts(offsetX) {
    const LEAD = 6;
    const pts = [[offsetX, CY], [offsetX + LEAD, CY]];
    let x = offsetX + LEAD;
    const xEnd = offsetX + W - LEAD;
    while (x < xEnd) {
      const flat = 4 + rnd() * 18;
      x += flat;
      if (x >= xEnd) break;
      pts.push([x, CY]);
      const spikes = 1 + Math.floor(rnd() * 3);
      for (let s = 0; s < spikes; s++) {
        const dx = 2 + rnd() * 8;
        const amp = 8 + rnd() * 17;
        const dir = rnd() > 0.5 ? -1 : 1;
        x += dx;
        if (x >= xEnd) break;
        pts.push([x, CY + dir * amp]);
        if (rnd() > 0.65) {
          x += 1.5 + rnd() * 3;
          if (x >= xEnd) break;
          pts.push([x, CY - dir * (3 + rnd() * 8)]);
        }
      }
      x += 2 + rnd() * 4;
      pts.push([Math.min(x, xEnd), CY]);
    }
    pts.push([xEnd, CY], [offsetX + W, CY]);
    return pts;
  }

  const tile1 = makeTilePts(0);
  const tile2 = tile1.map(([x, y]) => [x + W, y]);
  const allPts = [...tile1, ...tile2.slice(1)];
  const d = allPts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

  const style = getComputedStyle(document.documentElement);
  const phaseColors = [1,2,3,4,5,6].map(i => style.getPropertyValue(`--phase-${i}`).trim());

  const progress = loadProgress();
  const phaseDays = {};
  CURRICULUM.weeks.forEach(w => {
    const ph = w.phase || 1;
    if (!phaseDays[ph]) phaseDays[ph] = { done: 0, total: 0 };
    w.days.forEach(day => {
      phaseDays[ph].total++;
      const key = `${w.week}-${day.day}`;
      const isDone = progress[key] === 'done' || (progress[key] === undefined && day.status === 'done');
      if (isDone) phaseDays[ph].done++;
    });
  });

  const sectionW = W / 6;
  const phaseNames = ['Advanced Java','DSA','System Design','AWS & DevOps','AI Integration','Interview Polish'];

  // gradient stops
  const gradStops = phaseColors.map((c, i) => `<stop offset="${(i/5)*100}%" stop-color="${c}"/>`).join('');
  const fadedStops = phaseColors.map((c, i) => `<stop offset="${(i/5)*100}%" stop-color="${c}" stop-opacity="0.15"/>`).join('');

  // section dividers: faded rects per phase (doubled for scroll)
  let sectionRects = '';
  for (let rep = 0; rep < 2; rep++) {
    for (let i = 0; i < 6; i++) {
      const pd = phaseDays[i+1] || { done: 0, total: 0 };
      const fillPct = pd.total > 0 ? pd.done / pd.total : 0;
      const x0 = rep * W + i * sectionW;
      // faded full section
      sectionRects += `<rect x="${x0.toFixed(1)}" y="0" width="${sectionW.toFixed(1)}" height="${H}" fill="${phaseColors[i]}" fill-opacity="0.12"/>`;
      // vibrant completed portion
      if (fillPct > 0) {
        sectionRects += `<rect x="${x0.toFixed(1)}" y="0" width="${(fillPct*sectionW).toFixed(1)}" height="${H}" fill="${phaseColors[i]}" fill-opacity="0.45"/>`;
      }
    }
  }

  const defs = `
    <linearGradient id="hb-grad" x1="0" y1="0" x2="${W}" y2="0" gradientUnits="userSpaceOnUse">
      ${gradStops}
    </linearGradient>
    <clipPath id="hb-viewclip"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath>
    <mask id="hb-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="${W*2}" height="${H}">
      <path class="hb-scroll-mask" d="${d}" stroke="white" stroke-width="6"
        stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </mask>`;

  // background: faded full width + vibrant completed sections per phase
  let bgRects = `<rect x="0" y="0" width="${W}" height="${H}" fill="url(#hb-grad)" fill-opacity="0.25"/>`;
  for (let i = 0; i < 6; i++) {
    const pd = phaseDays[i+1] || { done: 0, total: 0 };
    const fillPct = pd.total > 0 ? pd.done / pd.total : 0;
    if (fillPct > 0) {
      const x0 = i * sectionW;
      const fw = fillPct * sectionW;
      bgRects += `<rect x="${x0.toFixed(1)}" y="0" width="${fw.toFixed(1)}" height="${H}" fill="${phaseColors[i]}"/>`;
    }
  }

  // ECG mask reveals the background — no extra clipping on the mask
  let layers = `<g clip-path="url(#hb-viewclip)">
    <g mask="url(#hb-mask)">${bgRects}</g>
  </g>`;

  // hover zones
  for (let i = 0; i < 6; i++) {
    const pd = phaseDays[i+1] || { done: 0, total: 0 };
    const x0 = i * sectionW;
    layers += `<rect class="hb-hover-zone" data-phase="${i}" data-done="${pd.done}" data-total="${pd.total}" data-name="${phaseNames[i]}"
      x="${x0.toFixed(1)}" y="0" width="${sectionW.toFixed(1)}" height="${H}" fill="transparent" style="cursor:pointer"/>`;
  }

  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = `<defs>${defs}</defs>${layers}`;

  // tooltip — fixed center of graph
  const wrap = svg.closest('.heartbeat-wrap');
  let tip = document.getElementById('hb-tooltip');
  if (tip) tip.remove();
  tip = document.createElement('div');
  tip.id = 'hb-tooltip';
  (wrap || document.body).appendChild(tip);

  svg.querySelectorAll('.hb-hover-zone').forEach(zone => {
    zone.addEventListener('mouseenter', () => {
      const idx = +zone.dataset.phase;
      const done = +zone.dataset.done;
      const total = +zone.dataset.total;
      const name = zone.dataset.name;
      const pct = total > 0 ? Math.round(done / total * 100) : 0;
      const phaseColor = phaseColors[idx] || 'var(--accent)';
      tip.style.setProperty('--tip-color', phaseColor);
      tip.style.setProperty('--tip-fill-pct', pct + '%');
      const isDark = document.documentElement.dataset.theme === 'dark'
        || (!document.documentElement.dataset.theme && window.matchMedia('(prefers-color-scheme:dark)').matches);
      tip.innerHTML = `<div class="tip-inner">
        <div class="tip-body">
          <div class="tip-header"><strong>Phase ${idx+1}</strong><span class="tip-name">${name}</span></div>
          <div class="tip-bar-track"><div class="tip-bar-fill"></div></div>
          <div class="tip-stats">
            <span class="tip-days">${done} of ${total} days</span>
            <span class="tip-pct">${pct}%</span>
          </div>
        </div>
      </div>`;
      tip.classList.add('visible');
    });
    zone.addEventListener('mouseleave', () => tip.classList.remove('visible'));
  });
}

function renderProgressChevrons(doneCount, total) {
  const svg = document.getElementById('chevrons-svg');
  if (!svg) return;

  const progress = loadProgress();
  const phaseDays = {};
  CURRICULUM.weeks.forEach(w => {
    const ph = w.phase || 1;
    if (!phaseDays[ph]) phaseDays[ph] = { done: 0, total: 0 };
    w.days.forEach(d => {
      phaseDays[ph].total++;
      const key = `${w.week}-${d.day}`;
      const isDone = progress[key] === 'done' || (progress[key] === undefined && d.status === 'done');
      if (isDone) phaseDays[ph].done++;
    });
  });

  const style = getComputedStyle(document.documentElement);
  const phaseColors = [1,2,3,4,5,6].map(i => style.getPropertyValue(`--phase-${i}`).trim());

  // geometry
  const W = 30, GAP = 8, H = 38, CY = 20, SW = 5;

  let defs = '';
  let paths = '';

  for (let i = 0; i < 6; i++) {
    const ph = i + 1;
    const x0 = i * (W + GAP);
    const tip = x0 + W;
    const top = CY - H / 2;
    const bot = CY + H / 2;
    const color = phaseColors[i] || '#1A73E8';
    const pd = phaseDays[ph] || { done: 0, total: 1 };
    const fillPct = pd.total > 0 ? pd.done / pd.total : 0;
    const fillW = fillPct * W;
    const clipId = `chev-clip-${i}`;
    const glowId = `chev-glow-${i}`;

    defs += `
      <clipPath id="${clipId}">
        <rect x="${x0}" y="0" width="${fillW}" height="40"/>
      </clipPath>
      <filter id="${glowId}" x="-40%" y="-60%" width="180%" height="220%">
        <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="${color}" flood-opacity="0.9"/>
        <feDropShadow dx="0" dy="2" stdDeviation="6" flood-color="${color}" flood-opacity="0.5"/>
      </filter>`;

    const pts = `${x0},${top} ${tip},${CY} ${x0},${bot}`;

    // total path length of the two arms
    const armLen = Math.hypot(W, H / 2);
    const pathLen = armLen * 2;
    const filledLen = fillPct * pathLen;

    // dim base
    paths += `<polyline points="${pts}" stroke="${color}" stroke-width="${SW}"
      stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.18"/>`;

    // filled portion using dasharray — traces top arm → tip → bottom arm
    if (fillPct > 0) {
      paths += `<polyline points="${pts}" stroke="${color}" stroke-width="${SW + 1.5}"
        stroke-linecap="round" stroke-linejoin="round" fill="none"
        stroke-dasharray="${filledLen} ${pathLen}"
        stroke-dashoffset="0"
        opacity="1"/>`;
    }
  }

  svg.innerHTML = `<defs>${defs}</defs>${paths}`;

  // update viewBox to fit
  const totalW = 6 * W + 5 * GAP;
  svg.setAttribute('viewBox', `0 0 ${totalW} 40`);
}

function renderPhaseChips() {
  const container = document.querySelector('.progress-phases');
  if (!container) return;
  const progress = loadProgress();
  const phaseNames = ['Advanced Java','DSA','System Design','AWS & DevOps','AI Integration','Interview Polish'];
  const phaseDays = {};
  CURRICULUM.weeks.forEach(w => {
    const ph = w.phase || 1;
    if (!phaseDays[ph]) phaseDays[ph] = { done: 0, total: 0 };
    w.days.forEach(day => {
      phaseDays[ph].total++;
      const key = `${w.week}-${day.day}`;
      if (progress[key] === 'done' || (progress[key] === undefined && day.status === 'done')) phaseDays[ph].done++;
    });
  });
  container.innerHTML = [1,2,3,4,5,6].map(ph => {
    const pd = phaseDays[ph] || { done: 0, total: 0 };
    const pct = pd.total > 0 ? Math.round(pd.done / pd.total * 100) : 0;
    const state = pd.done === 0 ? 'locked' : pct === 100 ? 'done' : 'active';
    return `<span class="phase-chip phase-chip--${state}" onclick="scrollToPhase(${ph})" data-phase="${ph}">
      <div class="chip-header"><b>Phase ${ph}</b><span>${phaseNames[ph-1]}</span></div>
      <div class="chip-bar-track"><div class="chip-bar-fill" style="width:${pct}%"></div></div>
      <div class="chip-stats"><span class="chip-days">${pd.done} of ${pd.total}</span><span class="chip-pct">${pct}%</span></div>
    </span>`;
  }).join('');
}

function renderProgress() {
  const progress = loadProgress();
  const doneCount = Object.values(progress).filter(v => v === 'done').length;
  const total = CURRICULUM.total;
  const pct = (doneCount / total) * 100;

  const countEl = document.getElementById('progress-count');
  const barEl   = document.getElementById('progress-bar-fill');
  if (countEl) countEl.innerHTML = `${doneCount} <span class="progress-of">of ${total} days</span>`;
  if (barEl)   barEl.style.width = `${pct.toFixed(1)}%`;
  const pctEl = document.getElementById('progress-pct');
  if (pctEl) pctEl.textContent = `${Math.round(pct)}%`;

  renderPhaseChips();
  renderProgressChevrons(doneCount, total);
  renderHeartbeat(doneCount, total);
  const tooltip = document.getElementById('arrow-tooltip');
  if (tooltip) tooltip.textContent = `${doneCount} of ${total} days · ${Math.round(pct)}%`;
}

function renderByDay() {
  const container = document.getElementById('by-day-panel');
  if (!container) return;
  const progress = loadProgress();
  let html = '';

  CURRICULUM.weeks.forEach((week) => {
    const doneInWeek    = week.days.filter(d => getDayStatus(week.week, d.day, d.status) === 'done').length;
    const currentInWeek = week.days.some(d => getDayStatus(week.week, d.day, d.status) === 'current');
    const phase         = CURRICULUM.phases.find(p => p.id === week.phase);
    const phaseLabel    = phase ? phase.name : '';
    const colorSlot     = week.phase || 1;

    const progPct = week.days.length ? Math.round((doneInWeek / week.days.length) * 100) : 0;

    html += `
    <div class="week-section" data-phase="${colorSlot}">
      <div class="week-header${currentInWeek ? ' has-current' : ''}" onclick="toggleWeek(this)" data-week="${week.week}">
        <span class="week-number">WK ${String(week.week).padStart(2,'0')}</span>
        <span class="week-title">${week.title}</span>
        <div class="week-right">
          <span class="week-phase-pill">${phaseLabel}</span>
          <span class="week-meta">${doneInWeek}/${week.days.length}</span>
          <div class="week-prog-track" title="${progPct}% complete">
            <div class="week-prog-fill" style="width:${progPct}%"></div>
          </div>
          <span class="week-chevron">▾</span>
        </div>
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

  // Wire up scroll-driven expand/collapse after DOM is ready
  requestAnimationFrame(() => initScrollAutoExpand());
  initSettingsPanel();
}

function renderDayCard(weekNum, day, progress) {
  const status   = getDayStatus(weekNum, day.day, day.status);
  const isLocked = status === 'locked';
  const isDone   = status === 'done';
  const isCurrent= status === 'current';
  const isComingSoon = !day.file && !isLocked;

  const statusIcon = isDone
    ? '<span class="material-symbols-rounded day-status-icon done-icon">check_circle</span>'
    : isCurrent
    ? '<span class="material-symbols-rounded day-status-icon current-icon">play_circle</span>'
    : isLocked
    ? '<span class="material-symbols-rounded day-status-icon locked-icon">lock</span>'
    : '<span class="material-symbols-rounded day-status-icon pending-icon">radio_button_unchecked</span>';
  const durLabel   = (isDone || isCurrent) && day.duration ? `${day.duration} min` : '';
  const audioBadge = (day.audio && day.audio.available) ? '<span class="day-audio-badge" title="Audio narration available">🎧</span>' : '';
  const classes    = ['day-card', status, isComingSoon ? 'coming-soon' : ''].filter(Boolean).join(' ');
  const tooltip    = isLocked ? 'data-tooltip="Complete previous days first"' : '';
  const href       = (!isLocked && day.file) ? day.file : '#';
  const tag        = (!isLocked && day.file) ? 'a' : 'div';

  const tp = topicPhase(day.topic || '');
  return `
  <${tag} class="${classes}" ${tag==='a' ? `href="${href}"` : ''} ${tooltip}>
    <div class="day-number">DAY ${day.day}${audioBadge}</div>
    <div class="day-topic-badge" data-tp="${tp}">${day.topic || ''}</div>
    <div class="day-title">${day.title}</div>
    <div class="day-footer">
      ${durLabel ? `<span class="day-duration">${durLabel}</span>` : ''}
      ${statusIcon}
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
function _pauseEcg() {
  const svg = document.getElementById('heartbeat-svg');
  if (svg) svg.style.animationPlayState = 'paused';
  document.querySelectorAll('.hb-scroll, .hb-scroll-mask').forEach(el => el.style.animationPlayState = 'paused');
}
function _resumeEcg() {
  const svg = document.getElementById('heartbeat-svg');
  if (svg) svg.style.animationPlayState = '';
  document.querySelectorAll('.hb-scroll, .hb-scroll-mask').forEach(el => el.style.animationPlayState = '');
}

function openWeek(header) {
  if (header.dataset.animating) return;
  if (header.classList.contains('open')) return;
  header.dataset.animating = '1';
  header.classList.add('open');
  const body = header.dataset.week
    ? document.getElementById(`week-days-${header.dataset.week}`)
    : header.nextElementSibling;
  if (!body) { delete header.dataset.animating; return; }

  // measure without triggering a visible frame
  body.style.transition = 'none';
  body.style.maxHeight = 'none';
  body.style.padding = '18px';
  body.style.opacity = '1';
  body.classList.add('open');
  const h = body.scrollHeight;
  body.style.maxHeight = '';
  body.style.padding = '';
  body.style.opacity = '';
  body.style.transition = '';

  const anim = body.animate(
    [
      { maxHeight: '0px', paddingTop: '0px', paddingBottom: '0px', opacity: 0 },
      { maxHeight: h + 'px', paddingTop: '18px', paddingBottom: '18px', opacity: 1 }
    ],
    { duration: 380, easing: 'ease-out', fill: 'forwards' }
  );
  anim.onfinish = () => {
    anim.cancel();
    body.style.maxHeight = 'none';
    body.style.paddingTop = '18px';
    body.style.paddingBottom = '18px';
    body.style.opacity = '1';
    delete header.dataset.animating;
  };
}
function closeWeek(header) {
  if (header.dataset.animating) return;
  if (!header.classList.contains('open')) return;
  header.dataset.animating = '1';
  header.classList.remove('open');
  const body = header.dataset.week
    ? document.getElementById(`week-days-${header.dataset.week}`)
    : header.nextElementSibling;
  if (!body) { delete header.dataset.animating; return; }

  const currentH = body.scrollHeight;
  const anim = body.animate(
    [
      { maxHeight: currentH + 'px', paddingTop: '18px', paddingBottom: '18px', opacity: 1 },
      { maxHeight: '0px', paddingTop: '0px', paddingBottom: '0px', opacity: 0 }
    ],
    { duration: 350, easing: 'ease-in', fill: 'forwards' }
  );
  anim.onfinish = () => {
    anim.cancel();
    body.classList.remove('open');
    body.style.maxHeight = '';
    body.style.paddingTop = '';
    body.style.paddingBottom = '';
    body.style.opacity = '';
    delete header.dataset.animating;
  };
}

function renderByTopic() {
  const container = document.getElementById('by-topic-panel');
  if (!container) return;
  const progress = loadProgress();

  const topicMap = {};
  CURRICULUM.allDays.forEach(d => {
    if (!topicMap[d.topic]) topicMap[d.topic] = [];
    topicMap[d.topic].push(d);
  });

  let html = '';
  Object.entries(topicMap).forEach(([topic, days]) => {
    const phase = topicPhase(topic);
    const doneCount = days.filter(d => getDayStatus(d.weekNum, d.day, d.status) === 'done').length;

    html += `
    <div class="week-section" data-phase="${phase}">
      <div class="week-header" onclick="toggleWeek(this)">
        <span class="week-number">TOPIC</span>
        <span class="week-title">${topic}</span>
        <div class="week-right">
          <span class="week-meta">${doneCount}/${days.length} done</span>
          <span class="week-phase-pill">${days.length} lessons</span>
          <span class="week-chevron">▾</span>
        </div>
      </div>
      <div class="week-days">
        ${days.map(d => renderDayCard(d.weekNum, d, progress)).join('')}
      </div>
    </div>`;
  });

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

/* ── Reflection section ──────────────────────────────────── */

function toggleReflection(header) {
  const body = header.nextElementSibling;
  const open = header.classList.toggle('open');
  body.classList.toggle('open', open);
}

function saveConfidence(dayKey, level) {
  localStorage.setItem(`reflect-conf-${dayKey}`, level);
  // Update button states
  document.querySelectorAll(`.conf-btn[data-day="${dayKey}"]`).forEach(btn => {
    btn.classList.remove('selected-1', 'selected-2', 'selected-3');
    if (btn.dataset.level === String(level)) btn.classList.add(`selected-${level}`);
  });
  const saved = document.getElementById(`conf-saved-${dayKey}`);
  if (saved) {
    const labels = { 1: 'Saved — revisit this tomorrow.', 2: 'Saved — one more pass will lock it in.', 3: 'Saved — great work! 🎉' };
    saved.textContent = labels[level];
    saved.classList.add('visible');
  }
}

function initReflection(dayKey) {
  const stored = localStorage.getItem(`reflect-conf-${dayKey}`);
  if (stored) saveConfidence(dayKey, parseInt(stored));
}

/* ── Lesson navigation (bottom nav + floating bar) ──────── */

function initLessonNav() {
  // Only run on lesson pages (week-XX/day-Y.html)
  const match = window.location.pathname.match(/week-(\d+)\/day-(.+)\.html/i);
  if (!match) return;

  const weekNum = parseInt(match[1]);
  const rawDay  = match[2]; // e.g. "1", "12a"
  const dayId   = isNaN(Number(rawDay)) ? rawDay : parseInt(rawDay);

  // Find current index in allDays
  const allDays = CURRICULUM.allDays;
  const idx = allDays.findIndex(d => d.weekNum === weekNum && String(d.day) === String(dayId));
  if (idx === -1) return;

  const prev = idx > 0 ? allDays[idx - 1] : null;
  const next = idx < allDays.length - 1 ? allDays[idx + 1] : null;

  const prevHref = prev && prev.file ? `../${prev.file}` : null;
  const nextHref = next && next.file ? `../${next.file}` : null;

  // ── Inject bottom nav ──
  const footer = document.querySelector('footer');
  if (footer) {
    const nav = document.createElement('div');
    nav.className = 'lesson-nav';
    nav.innerHTML = `
      ${prev
        ? `<a class="lesson-nav-btn${prevHref ? '' : ' disabled'}" href="${prevHref || '#'}">
             <span class="nav-direction"><span class="material-symbols-rounded">arrow_back</span>Previous</span>
             <span class="nav-title">Day ${prev.day} · ${prev.title}</span>
           </a>`
        : `<div class="lesson-nav-btn disabled">
             <span class="nav-direction"><span class="material-symbols-rounded">arrow_back</span>Previous</span>
             <span class="nav-title">Start of curriculum</span>
           </div>`}
      <a class="lesson-nav-btn center" href="../index.html">
        <span class="material-symbols-rounded nav-curriculum-icon">map</span>
        <span class="nav-direction">Curriculum</span>
      </a>
      ${next
        ? `<a class="lesson-nav-btn${nextHref ? '' : ' disabled'}" href="${nextHref || '#'}" style="align-items:flex-end;text-align:right">
             <span class="nav-direction">Next<span class="material-symbols-rounded">arrow_forward</span></span>
             <span class="nav-title">Day ${next.day} · ${next.title}</span>
           </a>`
        : `<div class="lesson-nav-btn disabled" style="align-items:flex-end">
             <span class="nav-direction">Next<span class="material-symbols-rounded">arrow_forward</span></span>
             <span class="nav-title">End of curriculum</span>
           </div>`}`;
    footer.parentNode.insertBefore(nav, footer);
  }

  // ── Inject floating bar ──
  const floatNav = document.createElement('div');
  floatNav.className = 'float-nav';
  floatNav.id = 'float-nav';
  floatNav.innerHTML = `
    <button class="float-scroll-top" onclick="window.scrollTo({top:0,behavior:'smooth'})"><span class="material-symbols-rounded">vertical_align_top</span>Top</button>
    <div class="float-divider"></div>
    ${prev
      ? `<a class="float-btn${prevHref ? '' : ' disabled'}" href="${prevHref || '#'}"><span class="material-symbols-rounded">arrow_back</span>Day ${prev.day}</a>`
      : `<span class="float-btn disabled"><span class="material-symbols-rounded">arrow_back</span>Start</span>`}
    <a class="float-btn accent" href="../index.html"><span class="material-symbols-rounded">map</span>Curriculum</a>
    ${next
      ? `<a class="float-btn${nextHref ? '' : ' disabled'}" href="${nextHref || '#'}">Day ${next.day}<span class="material-symbols-rounded">arrow_forward</span></a>`
      : `<span class="float-btn disabled">End<span class="material-symbols-rounded">arrow_forward</span></span>`}`;
  document.body.appendChild(floatNav);

  // Show immediately on scroll down, collapse after scroll stops for 1s
  let scrollTimer = null;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 280) floatNav.classList.add('visible');
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      floatNav.classList.remove('visible');
    }, 1000);
  }, { passive: true });
}

/* ── Search ───────────────────────────────────────────────── */

function handleSearch(raw) {
  const query = raw.trim();
  const clearBtn = document.getElementById('search-clear');
  const searchPanel = document.getElementById('search-panel');
  const tabNav = document.getElementById('tab-nav');

  if (clearBtn) clearBtn.style.display = query ? 'block' : 'none';

  if (!query) {
    if (searchPanel) { searchPanel.innerHTML = ''; searchPanel.classList.remove('active'); }
    document.querySelectorAll('.tab-btn').forEach(b => b.style.display = '');
    document.querySelectorAll('.tab-panel').forEach(p => p.style.display = '');
    return;
  }

  // Hide tab buttons (not the nav itself — search lives there), show search panel
  document.querySelectorAll('.tab-btn').forEach(b => b.style.display = 'none');
  document.querySelectorAll('.tab-panel').forEach(p => p.style.display = 'none');
  if (searchPanel) searchPanel.classList.add('active');

  const q = query.toLowerCase();
  const matches = CURRICULUM.allDays.filter(d =>
    d.title.toLowerCase().includes(q) ||
    d.topic.toLowerCase().includes(q) ||
    String(d.day).toLowerCase().includes(q) ||
    (d.weekTitle && d.weekTitle.toLowerCase().includes(q))
  );

  if (!searchPanel) return;

  if (matches.length === 0) {
    searchPanel.innerHTML = `
      <div class="search-meta">No results for "<strong>${escHtml(query)}</strong>"</div>
      <div class="search-empty">Try a topic name, day title, or day number.</div>`;
    return;
  }

  const highlight = (text) => {
    const re = new RegExp(`(${escRegex(query)})`, 'gi');
    return escHtml(text).replace(re, '<mark>$1</mark>');
  };

  const cards = matches.map(d => {
    const status = getDayStatus(d.weekNum, d.day, d.status);
    const isLocked = status === 'locked';
    const isDone   = status === 'done';
    const statusIcon = isDone ? '✅' : isLocked ? '🔒' : '🔵';
    const href = (!isLocked && d.file) ? d.file : '#';
    const tag  = (!isLocked && d.file) ? 'a' : 'div';

    return `
    <${tag} class="search-result-card${isLocked ? ' locked' : ''}" ${tag === 'a' ? `href="${href}"` : ''}>
      <div class="src-day">DAY ${d.day} ${statusIcon}</div>
      <div class="src-title">${highlight(d.title)}</div>
      <div class="src-meta">
        <span class="src-topic">${highlight(d.topic)}</span>
        <span class="src-week">Wk ${d.weekNum} · ${escHtml(d.weekTitle)}</span>
      </div>
    </${tag}>`;
  }).join('');

  searchPanel.innerHTML = `
    <div class="search-meta">${matches.length} result${matches.length !== 1 ? 's' : ''} for "<strong>${escHtml(query)}</strong>"</div>
    <div class="search-results-grid">${cards}</div>`;
}

function clearSearch() {
  const input = document.getElementById('search-input');
  if (input) { input.value = ''; input.focus(); }
  handleSearch('');
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ── Keyboard shortcut: / to focus search ────────────────── */
function initSearchShortcut() {
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openSearch();
    }
    if (e.key === 'Escape') { closeSearch(); }
  });
}

/* ── Auto-scroll to current week on load ────────────────── */
function scrollToActiveWeek() {
  const progress = loadProgress();

  // Find week that has a current day
  let activeWeek = null;
  for (const week of CURRICULUM.weeks) {
    const hasCurrent = week.days.some(d => {
      const key = `${week.week}-${d.day}`;
      return (progress[key] || d.status) === 'current';
    });
    if (hasCurrent) { activeWeek = week; break; }
  }

  if (!activeWeek || activeWeek.week === 1) return;

  const hdr = document.querySelector(`[data-week="${activeWeek.week}"]`);
  if (!hdr) return;

  // Open current week instead of week 1
  const week1Hdr = document.querySelector('[data-week="1"]');
  if (week1Hdr && week1Hdr.classList.contains('open')) closeWeek(week1Hdr);
  openWeek(hdr);

  setTimeout(() => hdr.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
}

/* ── Theme toggle ─────────────────────────────────────────── */
function openSearch() {
  const bar   = document.getElementById('search-bar');
  const input = document.getElementById('search-input');
  bar.classList.add('open');
  setTimeout(() => input.focus(), 220);
}

function closeSearch() {
  const bar   = document.getElementById('search-bar');
  const input = document.getElementById('search-input');
  bar.classList.remove('open');
  input.value = '';
  handleSearch('');
}

function toggleSearch() {
  const bar = document.getElementById('search-bar');
  if (bar.classList.contains('open')) closeSearch();
  else openSearch();
}

document.addEventListener('click', (e) => {
  const bar = document.getElementById('search-bar');
  if (bar && bar.classList.contains('open') && !bar.contains(e.target)) {
    closeSearch();
  }
});

function scrollToPhase(phase) {
  _scrollPaused = true;
  switchTab('day');
  document.querySelectorAll('.phase-chip').forEach((chip, i) => {
    chip.classList.toggle('active', i + 1 === phase);
  });

  // Step 1: close all open sections
  document.querySelectorAll('#by-day-panel .week-section').forEach(section => {
    const header = section.querySelector('.week-header');
    if (header && header.classList.contains('open')) closeWeek(header);
  });

  const first = document.querySelector(`#by-day-panel .week-section[data-phase="${phase}"]`);
  if (first) {
    // Step 2: wait for collapse animations to finish, then measure + scroll
    setTimeout(() => {
      const top = first.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top, behavior: 'smooth' });

      // Step 3: after scroll lands, expand matching sections
      setTimeout(() => {
        document.querySelectorAll('#by-day-panel .week-section').forEach(section => {
          const header = section.querySelector('.week-header');
          if (header && parseInt(section.dataset.phase) === phase && !header.classList.contains('open')) {
            openWeek(header);
          }
        });
        setTimeout(() => { _scrollPaused = false; }, 400);
      }, 500);
    }, 450);
  } else {
    setTimeout(() => { _scrollPaused = false; }, 500);
  }
}

/* ── Scroll-driven auto expand/collapse ─────────────────────
   SCROLL_AUTO_EXPAND: set false to disable entirely.
   Rules:
     • Expand  — section header enters the top 30% of viewport
     • Collapse — section header leaves the top 30% zone
     • Collapse — entire section (including expanded days) leaves screen
   Debounced: sudden fast scrolls won't thrash open/close. */
const SCROLL_TRIGGER_PCT = 50; // expand/collapse when header crosses this % from top

let _scrollObserver = null;
let _scrollPaused = false;
const _scrollPending = new Map();

function _scrollDebounced(header, action, delay = 120) {
  if (_scrollPending.has(header)) clearTimeout(_scrollPending.get(header));
  _scrollPending.set(header, setTimeout(() => {
    _scrollPending.delete(header);
    action();
  }, delay));
}

function initScrollAutoExpand() {
  if (_scrollObserver) { _scrollObserver.disconnect(); _scrollObserver = null; }
  const enabled = localStorage.getItem('scrollAutoExpand') === 'true';
  if (!enabled) return;

  _scrollObserver = new IntersectionObserver((entries) => {
    if (_scrollPaused) return;
    entries.forEach(entry => {
      const header = entry.target.closest('.week-section')?.querySelector('.week-header');
      if (!header) return;
      if (entry.isIntersecting) {
        _scrollDebounced(header, () => { if (!header.classList.contains('open')) openWeek(header); });
      } else if (entry.boundingClientRect.top > 0) {
        _scrollDebounced(header, () => { if (header.classList.contains('open')) closeWeek(header); }, 180);
      }
    });
  }, {
    rootMargin: `0px 0px -${100 - SCROLL_TRIGGER_PCT}% 0px`,
    threshold: 0
  });

  document.querySelectorAll('#by-day-panel .week-section').forEach(section => {
    const header = section.querySelector('.week-header');
    if (header) _scrollObserver.observe(header);
  });
}

/* ── Floating settings FAB + popup ───────────────────────── */
function initSettingsPanel() {
  const saved = localStorage.getItem('scrollAutoExpand') === 'true';

  const fab = document.createElement('div');
  fab.id = 'settings-fab-wrap';
  fab.innerHTML = `
    <div class="settings-popup" id="settings-popup" role="dialog" aria-label="Settings">
      <div class="settings-popup-inner">
        <div class="settings-popup-header">
          <span class="settings-popup-title">Settings</span>
        </div>
        <div class="settings-popup-body">
          <div class="float-setting-row">
            <div class="float-setting-info">
              <span class="float-setting-label">Dark mode</span>
              <span class="float-setting-desc">Toggle light / dark theme</span>
            </div>
            <button class="theme-toggle" id="theme-toggle" onclick="toggleTheme()" title="Toggle theme">
              <span class="theme-icon material-symbols-rounded">dark_mode</span>
            </button>
          </div>
          <div class="float-setting-row">
            <div class="float-setting-info">
              <span class="float-setting-label">Auto expand on scroll</span>
              <span class="float-setting-desc">Sections expand as you scroll into view</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="toggle-scroll-expand" ${saved ? 'checked' : ''} onchange="setScrollAutoExpand(this.checked)">
              <span class="toggle-track"><span class="toggle-thumb"></span></span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <button class="settings-fab" id="settings-fab" onclick="toggleSettingsPopup()" title="Settings" aria-label="Open settings">
      <span class="material-symbols-rounded">settings</span>
    </button>`;
  document.body.appendChild(fab);

  // outside click closes popup
  document.addEventListener('click', e => {
    const wrap = document.getElementById('settings-fab-wrap');
    if (wrap && !wrap.contains(e.target)) closeSettingsPopup();
  });
}

function toggleSettingsPopup() {
  const popup = document.getElementById('settings-popup');
  const fab   = document.getElementById('settings-fab');
  const open  = popup.classList.toggle('open');
  fab.classList.toggle('active', open);
}

function closeSettingsPopup() {
  document.getElementById('settings-popup')?.classList.remove('open');
  document.getElementById('settings-fab')?.classList.remove('active');
}

function setScrollAutoExpand(val) {
  localStorage.setItem('scrollAutoExpand', val);
  initScrollAutoExpand();
}

function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute('data-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isCurrentlyDark = current === 'dark' || (!current && prefersDark);
  const next = isCurrentlyDark ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  const icon = document.querySelector('.theme-icon');
  if (icon) {
    icon.style.transform = 'rotate(90deg) scale(0)';
    icon.style.opacity = '0';
    setTimeout(() => {
      icon.textContent = next === 'dark' ? 'dark_mode' : 'light_mode';
      icon.style.transform = 'rotate(0deg) scale(1)';
      icon.style.opacity = '1';
    }, 150);
  }
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.querySelector('.theme-icon');
  if (icon) icon.textContent = theme === 'dark' ? 'dark_mode' : 'light_mode';
}

/* ── Boot ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initLandingPage();
  initLessonNav();
});
