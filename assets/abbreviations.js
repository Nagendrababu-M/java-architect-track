/* ============================================================
   Java Architect Track — Abbreviation Popup System
   Companion to abbreviations.css and data/abbreviations.js
   ============================================================
   Usage in HTML:
     <abbr data-abbr="STW">STW</abbr>
     → dotted underline + hover popup with expansion + definition
   ============================================================ */

/* ABBREVIATIONS global is loaded via <script src="../data/abbreviations.js">
   before this file runs.                                       */

(function () {
  'use strict';

  /* ── Popup singleton ──────────────────────────────────── */

  let popup       = null;
  let activeAbbr  = null;
  let hideTimer   = null;
  const isMobile  = () => window.matchMedia('(max-width: 640px)').matches;

  function getPopup() {
    if (!popup) {
      popup = document.createElement('div');
      popup.className = 'abbr-popup';
      popup.setAttribute('role', 'tooltip');
      popup.id = 'abbr-popup-singleton';
      document.body.appendChild(popup);

      // Keep popup open when hovering over it (desktop)
      popup.addEventListener('mouseenter', () => clearTimeout(hideTimer));
      popup.addEventListener('mouseleave', scheduleHide);
    }
    return popup;
  }

  function buildPopupHTML(key, entry) {
    const linkHTML = entry.learnMore
      ? `<a class="abbr-popup-link" href="${entry.learnMore}" target="_blank" rel="noopener noreferrer">
           Learn more →
         </a>`
      : '';

    return `
      <div class="abbr-popup-header">
        <span class="abbr-popup-key">${key}</span>
        <span class="abbr-popup-sep">·</span>
        <span class="abbr-popup-expansion">${entry.expansion}</span>
      </div>
      <div class="abbr-popup-body">${entry.definition}</div>
      ${linkHTML}
    `;
  }

  function positionPopup(el) {
    const p    = getPopup();
    const rect = el.getBoundingClientRect();
    const vw   = window.innerWidth;
    const vh   = window.innerHeight;

    if (isMobile()) {
      p.classList.add('mobile-center');
      p.style.left  = '20px';
      p.style.top   = (rect.bottom + 10) + 'px';
      p.style.width = 'auto';
      return;
    }

    p.classList.remove('mobile-center');

    // Measure popup size (briefly visible but off-screen)
    p.style.visibility = 'hidden';
    p.style.left = '-9999px';
    p.style.top  = '-9999px';
    p.classList.add('visible');
    const pw = p.offsetWidth;
    const ph = p.offsetHeight;
    p.classList.remove('visible');
    p.style.visibility = '';

    // Try above first
    let top  = rect.top - ph - 12;
    let left = rect.left;
    let below = false;

    if (top < 8) {
      // Flip below
      top   = rect.bottom + 12;
      below = true;
    }

    // Clamp horizontally
    if (left + pw > vw - 12) left = vw - pw - 12;
    if (left < 12) left = 12;

    // Arrow position: clamp relative to popup
    const arrowLeft = Math.max(8, Math.min(rect.left + rect.width / 2 - left - 6, pw - 20));
    p.style.setProperty('--arrow-left', arrowLeft + 'px');

    p.style.left = left + 'px';
    p.style.top  = top  + 'px';
    p.classList.toggle('below', below);

    // Override the arrow left via inline style on ::after using a CSS var
    p.style.cssText += `; --arrow-left: ${arrowLeft}px`;
  }

  function showPopup(el, key, entry) {
    clearTimeout(hideTimer);

    const p = getPopup();
    p.innerHTML = buildPopupHTML(key, entry);

    // Accessibility
    const popupId = 'abbr-popup-singleton';
    el.setAttribute('aria-describedby', popupId);
    activeAbbr = el;

    positionPopup(el);
    p.classList.add('visible');
  }

  function scheduleHide() {
    hideTimer = setTimeout(() => {
      if (popup) popup.classList.remove('visible');
      if (activeAbbr) {
        activeAbbr.removeAttribute('aria-describedby');
        activeAbbr = null;
      }
    }, 120);
  }

  function hideImmediately() {
    clearTimeout(hideTimer);
    if (popup) popup.classList.remove('visible');
    if (activeAbbr) {
      activeAbbr.removeAttribute('aria-describedby');
      activeAbbr = null;
    }
  }

  /* ── Wire a single <abbr data-abbr="KEY"> ────────────── */

  function wireAbbr(el) {
    const key = el.dataset.abbr;
    if (!key) return;

    if (typeof ABBREVIATIONS === 'undefined' || !ABBREVIATIONS[key]) {
      console.warn(`[Abbreviations] Unknown key: "${key}"`);
      return;
    }

    const entry = ABBREVIATIONS[key];

    // Make keyboard-focusable
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');

    // Desktop: hover
    el.addEventListener('mouseenter', () => showPopup(el, key, entry));
    el.addEventListener('mouseleave', scheduleHide);

    // Keyboard: Enter / Space open; Escape closes
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (popup && popup.classList.contains('visible') && activeAbbr === el) {
          hideImmediately();
        } else {
          showPopup(el, key, entry);
        }
      }
      if (e.key === 'Escape') hideImmediately();
    });

    el.addEventListener('focus', () => showPopup(el, key, entry));
    el.addEventListener('blur',  scheduleHide);

    // Mobile: tap toggles
    el.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (popup && popup.classList.contains('visible') && activeAbbr === el) {
        hideImmediately();
      } else {
        showPopup(el, key, entry);
      }
    }, { passive: false });
  }

  /* ── Global: Escape key + tap-outside on mobile ──────── */

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideImmediately();
  });

  document.addEventListener('touchstart', (e) => {
    if (!popup || !popup.classList.contains('visible')) return;
    if (!popup.contains(e.target) && e.target !== activeAbbr) {
      hideImmediately();
    }
  }, { passive: true });

  document.addEventListener('scroll', scheduleHide, { passive: true });

  /* ── Auto-scan text nodes and wrap first occurrence ─── */

  function autoWrapAbbreviations(seen) {
    if (typeof ABBREVIATIONS === 'undefined') return;

    const keys = Object.keys(ABBREVIATIONS).sort((a, b) => b.length - a.length);
    // Build a regex that matches any unwrapped abbreviation as a whole word
    const pattern = new RegExp(`\\b(${keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`);

    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          const tag = parent.tagName;
          // Skip script, style, pre, code, abbr, and already-tagged elements
          if (['SCRIPT','STYLE','PRE','CODE','ABBR','TEXTAREA','INPUT'].includes(tag)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const nodesToProcess = [];
    while (walker.nextNode()) nodesToProcess.push(walker.currentNode);

    nodesToProcess.forEach(node => {
      const text = node.nodeValue;
      if (!pattern.test(text)) return;

      const frag = document.createDocumentFragment();
      let last = 0;
      let match;
      const re = new RegExp(`\\b(${keys.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`, 'g');

      while ((match = re.exec(text)) !== null) {
        const key = match[1];
        if (seen.has(key)) continue;
        seen.add(key);

        if (match.index > last) frag.appendChild(document.createTextNode(text.slice(last, match.index)));

        const abbr = document.createElement('abbr');
        abbr.dataset.abbr = key;
        abbr.textContent = key;
        wireAbbr(abbr);
        frag.appendChild(abbr);
        last = match.index + key.length;
      }

      if (frag.childNodes.length === 0) return;
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  /* ── Init ───────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', () => {
    const seen = new Set();

    // Wire existing manual <abbr data-abbr> tags first
    document.querySelectorAll('abbr[data-abbr]').forEach(el => {
      const key = el.dataset.abbr;
      if (seen.has(key)) {
        el.removeAttribute('data-abbr');
        return;
      }
      seen.add(key);
      wireAbbr(el);
    });

    // Auto-wrap first plain-text occurrence of any remaining abbreviations
    autoWrapAbbreviations(seen);
  });

})();
