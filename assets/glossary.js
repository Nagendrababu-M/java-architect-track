/* ============================================================
   Java Architect Track — Glossary Link System
   Companion to glossary.css and data/glossary.js
   ============================================================
   Usage in HTML:
     <span data-term="p99">p99</span>
     → becomes a styled anchor with tooltip on hover
   ============================================================ */

/* ── Load glossary data ─────────────────────────────────── */

// glossary.js is a plain script (not ES module) so we read
// the GLOSSARY global that data/glossary.js exposes.
// Both are loaded via <script> tags before this file.

const TYPE_LABELS = {
  wikipedia : 'Wikipedia',
  docs      : 'Official Docs',
  article   : 'Article',
  video     : 'Video',
  paper     : 'Paper',
  book      : 'Book',
};

/* ── Tooltip singleton ──────────────────────────────────── */

let tooltip = null;
let hideTimer = null;

function getTooltip() {
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.className = 'glossary-tooltip';
    document.body.appendChild(tooltip);
  }
  return tooltip;
}

function showTooltip(anchor, entry) {
  clearTimeout(hideTimer);
  const t = getTooltip();

  const typeLabel = TYPE_LABELS[entry.type] || entry.type;
  t.innerHTML = `
    <span class="glossary-tooltip-type type-${entry.type}">${typeLabel}</span>
    <span class="glossary-tooltip-desc">${entry.description}</span>
    <span class="glossary-tooltip-cta">Click to read more ↗</span>
  `;

  // Position: below the anchor, clamped to viewport
  const rect = anchor.getBoundingClientRect();
  const scrollY = window.scrollY || 0;

  t.style.left = '0px';
  t.style.top  = '0px';
  t.classList.remove('visible');

  // Place temporarily to measure width
  t.style.visibility = 'hidden';
  t.classList.add('visible');
  const tw = t.offsetWidth;
  t.classList.remove('visible');
  t.style.visibility = '';

  let left = rect.left;
  let top  = rect.bottom + 8;

  // Clamp horizontally
  const vw = window.innerWidth;
  if (left + tw > vw - 12) left = vw - tw - 12;
  if (left < 12) left = 12;

  // Clamp vertically — flip above if too low
  const vh = window.innerHeight;
  if (top + 100 > vh && rect.top > 120) {
    top = rect.top - 8 - t.offsetHeight || rect.top - 80;
  }

  t.style.left = left + 'px';
  t.style.top  = top  + 'px';
  t.classList.add('visible');
}

function hideTooltip() {
  hideTimer = setTimeout(() => {
    if (tooltip) tooltip.classList.remove('visible');
  }, 120);
}

/* ── Wire up a single [data-term] element ─────────────── */

function wireTermElement(el) {
  const key = el.dataset.term;
  if (!key) return;

  if (typeof GLOSSARY === 'undefined' || !GLOSSARY[key]) {
    console.warn(`[Glossary] Unknown term key: "${key}"`);
    return;
  }

  const entry = GLOSSARY[key];

  // Build anchor
  const a = document.createElement('a');
  a.className  = 'learn-more-link';
  a.href       = entry.url;
  a.target     = '_blank';
  a.rel        = 'noopener noreferrer';
  a.setAttribute('aria-label', `${entry.label} — ${entry.description} (opens in new tab)`);

  // Move el's children into the anchor
  while (el.firstChild) a.appendChild(el.firstChild);
  el.appendChild(a);

  // Tooltip events
  a.addEventListener('mouseenter', () => showTooltip(a, entry));
  a.addEventListener('mouseleave', hideTooltip);
  a.addEventListener('focus',      () => showTooltip(a, entry));
  a.addEventListener('blur',       hideTooltip);

  // Mobile tap: toggle tooltip
  a.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (tooltip && tooltip.classList.contains('visible')) {
      hideTooltip();
    } else {
      showTooltip(a, entry);
      // Auto-hide after 3s on mobile, then navigate
      setTimeout(() => {
        hideTooltip();
        window.open(entry.url, '_blank', 'noopener');
      }, 3000);
    }
  }, { passive: false });
}

/* ── Init ───────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const seen = new Set(); // track first-occurrence per term per page

  document.querySelectorAll('[data-term]').forEach(el => {
    const key = el.dataset.term;
    if (seen.has(key)) {
      // Subsequent occurrences — leave as plain text but remove attribute
      // to keep the HTML clean and avoid confusion
      el.removeAttribute('data-term');
      return;
    }
    seen.add(key);
    wireTermElement(el);
  });
});

// Hide tooltip on scroll
document.addEventListener('scroll', hideTooltip, { passive: true });
