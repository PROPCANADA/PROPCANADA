/**
 * PROP BILLS SHOP — Shared JavaScript Utilities
 * Loaded by every sub-page (product-info, reviews, delivery-info).
 * index.html has its own larger script; it imports only what it needs.
 */

'use strict';

/* ────── GLOBAL STATE ────── */
window.PBS = window.PBS || {};
PBS.lang = localStorage.getItem('pbs_lang') || 'en';

/* ────── HELPERS ────── */

/** Shorthand: document.getElementById */
const G = id => document.getElementById(id);

/**
 * Set a text node by element id (safe — no innerHTML injection).
 * @param {string} id
 * @param {string} val
 */
function setText(id, val) {
  const el = G(id);
  if (el) el.textContent = val;
}

/**
 * Set innerHTML by element id.
 * Only use for trusted, server-controlled strings.
 * @param {string} id
 * @param {string} val
 */
function setHTML(id, val) {
  const el = G(id);
  if (el) el.innerHTML = val;
}

/* ────── LANGUAGE SWITCHER ────── */

/**
 * Switch the UI language and persist the preference.
 * Call this from each page's own setLang() after it updates its own strings.
 *
 * Usage in each page:
 *   function setLang(l) {
 *     PBS.switchLang(l);         // ← handles toggle buttons + storage
 *     const v = T[l];
 *     setText('some-id', v.someKey);
 *     // … rest of page-specific strings …
 *   }
 */
PBS.switchLang = function(l) {
  PBS.lang = l;
  localStorage.setItem('pbs_lang', l);

  // Toggle active class on language buttons (works for any .lang-sw on the page)
  const en = G('lang-en');
  const fr = G('lang-fr');
  if (en) en.classList.toggle('active', l === 'en');
  if (fr) fr.classList.toggle('active', l === 'fr');
};

/* ────── RATE LIMITER (order form) ────── */

/**
 * Returns true if the user is allowed to submit (max 2 per hour).
 * Records the submission timestamp in localStorage.
 */
PBS.checkRateLimit = function() {
  const key  = 'pbs_submissions';
  const now  = Date.now();
  const hour = 3_600_000;
  let log = [];
  try { log = JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) {}
  log = log.filter(t => now - t < hour);
  if (log.length >= 2) return false;
  log.push(now);
  try { localStorage.setItem(key, JSON.stringify(log)); } catch (e) {}
  return true;
};

/* ────── DISCORD WEBHOOK ────── */

/**
 * Send an embed to the Discord webhook.
 * @param {string}   webhookUrl
 * @param {string}   content     - plain text above the embed
 * @param {object[]} fields      - Discord embed field objects
 * @returns {Promise<void>}
 */
PBS.sendDiscordEmbed = async function(webhookUrl, content, fields) {
  const payload = {
    content,
    embeds: [{
      title: 'New Order Received',
      color: 0x4f46e5,
      fields,
      timestamp: new Date().toISOString(),
    }],
  };
  try {
    const res = await fetch(webhookUrl, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    if (res.status !== 204 && !res.ok) {
      const txt = await res.text().catch(() => '');
      console.warn('Discord webhook error:', res.status, txt);
    }
  } catch (err) {
    console.warn('Discord fetch failed:', err.message);
  }
};

/* ────── MISC UTILITIES ────── */

/**
 * Truncate a string for Discord embed fields (max 1024 chars).
 * Returns '---' for empty/null values.
 */
PBS.cap = function(s, max = 1000) {
  if (!s || s === '') return '---';
  return s.length > max ? s.slice(0, max - 3) + '...' : s;
};

/**
 * Format a Date for display, respecting current language.
 * @param {Date} d
 * @returns {string}
 */
PBS.formatDate = function(d) {
  return d.toLocaleDateString(PBS.lang === 'fr' ? 'fr-CA' : 'en-CA', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};
/* ────── ANTI-COPY SECURITY ────── */
document.addEventListener('DOMContentLoaded', () => {
    // Activer le mode sécurité si configuré dans config.js
    if (window.PBS_CONFIG && window.PBS_CONFIG.ENABLE_ANTI_COPY) {
        document.body.classList.add('secure-mode');

        // Bloquer les raccourcis clavier de copie (Ctrl+C, Ctrl+X)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X')) {
                // Vérifier si la sélection courante est dans une zone autorisée
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    const node = selection.getRangeAt(0).commonAncestorContainer;
                    const parent = node.nodeType === 3 ? node.parentNode : node;
                    if (!parent.closest('.allow-copy') && !parent.closest('input') && !parent.closest('textarea')) {
                        e.preventDefault();
                    }
                } else {
                    e.preventDefault();
                }
            }
        });
        
        // Bloquer le drag and drop des images via JS (renforcement du CSS)
        document.addEventListener('dragstart', (e) => {
            if (e.target.tagName === 'IMG' && !e.target.closest('.allow-copy')) {
                e.preventDefault();
            }
        });
    }
});
