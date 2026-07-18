/**
 * INFINITY NEBULA — effects.js
 * Starfield · Particles · Scroll Reveal · Counter Animation · Cursor Glow
 * Used by preview.html
 */

/* ══════════════════════════════════════════
   1. STARFIELD
   ══════════════════════════════════════════ */
function initStarfield(containerId = 'starfield', count = 200) {
  const container = document.getElementById(containerId);
  if (!container) return;

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2.5 + 0.5;
    const dur  = (Math.random() * 4 + 2).toFixed(1);
    const lo   = (Math.random() * 0.15 + 0.05).toFixed(2);
    const hi   = (Math.random() * 0.65 + 0.25).toFixed(2);
    const del  = -(Math.random() * 6).toFixed(2);

    Object.assign(star.style, {
      position:  'absolute',
      borderRadius: '50%',
      background: 'white',
      width:  size + 'px',
      height: size + 'px',
      top:  (Math.random() * 100) + '%',
      left: (Math.random() * 100) + '%',
      animation: `twinkle ${dur}s ${del}s infinite ease-in-out`,
      '--lo': lo,
      '--hi': hi,
    });
    container.appendChild(star);
  }
}

/* ══════════════════════════════════════════
   2. FLOATING PARTICLES
   ══════════════════════════════════════════ */
function initParticles(containerId = 'particles', count = 20) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const colors = [
    'rgba(0,242,254,0.55)',
    'rgba(250,204,21,0.45)',
    'rgba(167,139,250,0.4)',
    'rgba(255,255,255,0.3)',
  ];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 4 + 1;
    const dur  = (Math.random() * 14 + 8).toFixed(0);
    const del  = -(Math.random() * 14).toFixed(1);

    Object.assign(p.style, {
      position:     'fixed',
      borderRadius: '50%',
      pointerEvents:'none',
      width:  size + 'px',
      height: size + 'px',
      background: colors[Math.floor(Math.random() * colors.length)],
      left: (Math.random() * 100) + '%',
      animation: `float-up ${dur}s ${del}s linear infinite`,
      zIndex: '0',
    });
    container.appendChild(p);
  }
}

/* ══════════════════════════════════════════
   3. SCROLL REVEAL
   ══════════════════════════════════════════ */
function initScrollReveal(selector = '.reveal', threshold = 0.12) {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger children if parent has data-stagger
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold });

  elements.forEach((el, i) => {
    if (!el.dataset.delay) el.dataset.delay = i * 60;
    observer.observe(el);
  });
}

/* ══════════════════════════════════════════
   4. COUNTER ANIMATION
   ══════════════════════════════════════════ */
function animateCounter(el, target, decimals = 0, suffix = '', duration = 1800) {
  let startTime = null;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = easeOut(progress);
    const value = target * eased;
    el.textContent = decimals
      ? value.toFixed(decimals) + suffix
      : Math.round(value) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

function initCounters(selector = '[data-count]') {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el       = entry.target;
        const target   = parseFloat(el.dataset.count);
        const decimals = parseInt(el.dataset.decimals || '0');
        const suffix   = el.dataset.suffix || '';
        animateCounter(el, target, decimals, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  els.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════
   5. CURSOR GLOW (desktop only)
   ══════════════════════════════════════════ */
function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip mobile

  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position:     'fixed',
    width:        '300px',
    height:       '300px',
    borderRadius: '50%',
    background:   'radial-gradient(circle, rgba(0,242,254,0.06) 0%, transparent 70%)',
    pointerEvents:'none',
    zIndex:       '9999',
    transform:    'translate(-50%, -50%)',
    transition:   'opacity 0.3s',
  });
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
}

/* ══════════════════════════════════════════
   6. TYPING EFFECT (for plain text elements)
   ══════════════════════════════════════════ */
function typeWriter(el, text, speed = 55, onDone = null) {
  el.textContent = '';
  let i = 0;
  const tick = () => {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(tick, speed + Math.random() * 20);
    } else if (onDone) {
      onDone();
    }
  };
  tick();
}

/* ══════════════════════════════════════════
   7. COPY TO CLIPBOARD HELPER
   ══════════════════════════════════════════ */
function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✓ Copied!';
    btn.style.color = '#4ade80';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.color = '';
    }, 1600);
  });
}

/* ══════════════════════════════════════════
   8. SMOOTH SECTION HIGHLIGHT ON SCROLL
   ══════════════════════════════════════════ */
function initNavHighlight(navSelector = '.nav-link', sectionSelector = 'section[id]') {
  const links    = document.querySelectorAll(navSelector);
  const sections = document.querySelectorAll(sectionSelector);
  if (!links.length || !sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`${navSelector}[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ══════════════════════════════════════════
   AUTO-INIT on DOMContentLoaded
   ══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initStarfield();
  initParticles();
  initScrollReveal();
  initCounters();
  initCursorGlow();
  initNavHighlight();
});
