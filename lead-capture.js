/* =============================================================
   lead-capture.js — AI Savvy Founders
   First-visit lead gate: blurred backdrop modal → GHL contact.
   Persists via localStorage + 1-year cookie so returning
   visitors never see the form again.
   ============================================================= */
(function () {
  'use strict';

  var STORAGE_KEY    = 'aisf_reg_v1';
  var PROXY_ENDPOINT = '/api/ghl-contact';

  /* ── Already registered? ──────────────────────────────── */
  function isRegistered() {
    try { if (localStorage.getItem(STORAGE_KEY)) return true; } catch (_) {}
    return document.cookie.split(';').some(function (c) {
      return c.trim().indexOf(STORAGE_KEY + '=') === 0;
    });
  }

  /* ── Persist registration (localStorage + cookie) ────── */
  function markRegistered(firstName, lastName, email) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        firstName: firstName,
        lastName:  lastName,
        email:     email,
        ts:        Date.now()
      }));
    } catch (_) {}
    var exp = new Date();
    exp.setFullYear(exp.getFullYear() + 1);
    document.cookie =
      STORAGE_KEY + '=1' +
      '; expires=' + exp.toUTCString() +
      '; path=/' +
      '; SameSite=Lax';
  }

  /* ── Send to proxy → GHL (fire-and-forget) ───────────── */
  function sendToGHL(firstName, lastName, email) {
    if (!window.fetch) return;
    try {
      fetch(PROXY_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: firstName,
          lastName:  lastName,
          email:     email,
          source:    window.location.href
        })
      }).catch(function (err) {
        console.warn('[AI Savvy] Lead submit failed:', err.message);
      });
    } catch (_) {}
  }

  /* ── Injected styles ──────────────────────────────────── */
  var STYLES = [
    /* Backdrop — blurs everything behind it */
    '#aisf-backdrop{',
      'position:fixed;inset:0;',
      'background:rgba(39,21,18,0.52);',
      'backdrop-filter:blur(8px);',
      '-webkit-backdrop-filter:blur(8px);',
      'z-index:9000;',
      'transition:opacity 0.45s;',
    '}',
    /* Modal centering wrapper */
    '#aisf-modal{',
      'position:fixed;inset:0;',
      'display:flex;align-items:center;justify-content:center;',
      'z-index:9001;',
      'padding:20px;',
      'transition:opacity 0.45s;',
    '}',
    /* Card */
    '#aisf-card{',
      'background:#FFF7EF;',
      'border:1px solid #E8DBD1;',
      'border-radius:20px;',
      'padding:40px 36px 32px;',
      'max-width:400px;width:100%;',
      'box-shadow:0 24px 64px rgba(39,21,18,0.22);',
    '}',
    /* Eyebrow */
    '#aisf-eyebrow{',
      'font-family:\'Manrope\',sans-serif;',
      'font-weight:500;font-size:11px;',
      'letter-spacing:0.12em;text-transform:uppercase;',
      'color:#7A1F2B;margin:0 0 10px;',
    '}',
    /* Title */
    '#aisf-title{',
      'font-family:\'Newsreader\',serif;',
      'font-weight:400;font-size:28px;line-height:1.2;',
      'color:#271512;margin:0 0 10px;',
    '}',
    /* Subtitle */
    '#aisf-sub{',
      'font-family:\'Manrope\',sans-serif;',
      'font-weight:300;font-size:14px;line-height:1.6;',
      'color:#6D5851;margin:0 0 28px;',
    '}',
    /* Form */
    '#aisf-form{display:flex;flex-direction:column;gap:14px;}',
    '.aisf-field{display:flex;flex-direction:column;gap:5px;}',
    '.aisf-label{',
      'font-family:\'Manrope\',sans-serif;',
      'font-weight:500;font-size:12px;',
      'letter-spacing:0.04em;color:#271512;',
    '}',
    '.aisf-input{',
      'font-family:\'Manrope\',sans-serif;',
      'font-size:15px;font-weight:300;color:#271512;',
      'background:#FFF9F1;',
      'border:1px solid #E8DBD1;border-radius:8px;',
      'padding:11px 14px;width:100%;outline:none;',
      'transition:border-color 0.15s;',
      '-webkit-appearance:none;',
    '}',
    '.aisf-input:focus{border-color:#CA8E79;}',
    '.aisf-input::placeholder{color:#C4B4AD;}',
    /* Submit button */
    '#aisf-btn{',
      'font-family:\'Manrope\',sans-serif;',
      'font-weight:500;font-size:14px;letter-spacing:0.01em;',
      'color:#FFF9F1;background:#7A1F2B;',
      'border:none;border-radius:999px;',
      'padding:13px 28px;',
      'cursor:pointer;margin-top:4px;width:100%;',
      'transition:background 0.15s,opacity 0.15s;',
    '}',
    '#aisf-btn:hover:not(:disabled){background:#621927;}',
    '#aisf-btn:disabled{opacity:0.55;cursor:not-allowed;}',
    /* Privacy note */
    '#aisf-privacy{',
      'font-family:\'Manrope\',sans-serif;',
      'font-weight:300;font-size:11px;',
      'color:#C4B4AD;text-align:center;margin-top:14px;',
    '}',
    /* Thank-you state */
    '#aisf-thanks{display:none;text-align:center;padding:12px 0;}',
    '#aisf-check{',
      'display:inline-flex;align-items:center;justify-content:center;',
      'width:56px;height:56px;border-radius:50%;',
      'background:#F3E9DF;margin-bottom:18px;',
    '}',
    '#aisf-thanks-title{',
      'font-family:\'Newsreader\',serif;',
      'font-weight:400;font-size:26px;',
      'color:#271512;margin:0 0 8px;',
    '}',
    '#aisf-thanks-msg{',
      'font-family:\'Manrope\',sans-serif;',
      'font-weight:300;font-size:14px;color:#6D5851;',
    '}',
    /* Mobile */
    '@media(max-width:480px){',
      '#aisf-card{padding:28px 20px 24px;border-radius:16px;}',
      '#aisf-title{font-size:23px;}',
    '}'
  ].join('');

  /* ── Modal markup ─────────────────────────────────────── */
  var CHECK_SVG =
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" ' +
    'stroke="#7A1F2B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
    '<polyline points="20 6 9 17 4 12"/></svg>';

  var MARKUP =
    '<div id="aisf-backdrop"></div>' +
    '<div id="aisf-modal" role="dialog" aria-modal="true" aria-labelledby="aisf-title">' +
      '<div id="aisf-card">' +
        '<p id="aisf-eyebrow">Free Access</p>' +
        '<h2 id="aisf-title">Unlock this resource</h2>' +
        '<p id="aisf-sub">Enter your name and email to get instant access to all ' +
          'AI Savvy Founders resources — free, always.</p>' +
        '<form id="aisf-form" novalidate>' +
          '<div class="aisf-field">' +
            '<label class="aisf-label" for="aisf-name">First name</label>' +
            '<input class="aisf-input" id="aisf-name" type="text" ' +
              'placeholder="Your first name" required autocomplete="given-name" />' +
          '</div>' +
          '<div class="aisf-field">' +
            '<label class="aisf-label" for="aisf-email">Email address</label>' +
            '<input class="aisf-input" id="aisf-email" type="email" ' +
              'placeholder="you@example.com" required autocomplete="email" />' +
          '</div>' +
          '<button id="aisf-btn" type="submit">Get free access →</button>' +
        '</form>' +
        '<div id="aisf-thanks">' +
          '<div id="aisf-check">' + CHECK_SVG + '</div>' +
          '<h3 id="aisf-thanks-title">You\'re in!</h3>' +
          '<p id="aisf-thanks-msg">Unlocking the resource…</p>' +
        '</div>' +
        '<p id="aisf-privacy">No spam, ever. Unsubscribe any time.</p>' +
      '</div>' +
    '</div>';

  /* ── Init ─────────────────────────────────────────────── */
  function init() {
    // Inject styles into <head>
    var styleEl = document.createElement('style');
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);

    // Inject modal markup into <body>
    var wrap = document.createElement('div');
    wrap.innerHTML = MARKUP;
    document.body.appendChild(wrap);

    var form     = document.getElementById('aisf-form');
    var btn      = document.getElementById('aisf-btn');
    var thanks   = document.getElementById('aisf-thanks');
    var privacy  = document.getElementById('aisf-privacy');
    var backdrop = document.getElementById('aisf-backdrop');
    var modal    = document.getElementById('aisf-modal');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name  = document.getElementById('aisf-name').value.trim();
      var email = document.getElementById('aisf-email').value.trim();

      // Basic validation
      if (!name || !email || email.indexOf('@') < 1) return;

      btn.disabled    = true;
      btn.textContent = 'Saving…';

      // Split name into first / last
      var parts     = name.split(/\s+/);
      var firstName = parts[0];
      var lastName  = parts.slice(1).join(' ');

      // 1. Send to GHL (async, non-blocking)
      sendToGHL(firstName, lastName, email);

      // 2. Persist registration immediately (doesn't depend on GHL succeeding)
      markRegistered(firstName, lastName, email);

      // 3. Show thank-you state
      form.style.display    = 'none';
      privacy.style.display = 'none';
      thanks.style.display  = 'block';

      // 4. Fade out modal after 1.8 s, then remove it
      setTimeout(function () {
        backdrop.style.opacity = '0';
        modal.style.opacity    = '0';
        setTimeout(function () {
          if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
          if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
        }, 450);
      }, 1800);
    });
  }

  /* ── Boot ─────────────────────────────────────────────── */
  if (!isRegistered()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }

}());
