/* FORGE — concept site by Adolescent Studio. Vanilla JS, no dependencies. */
(function () {
  'use strict';
  const d = document;
  const $ = (s, c) => (c || d).querySelector(s);
  const $$ = (s, c) => Array.from((c || d).querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) d.documentElement.classList.add('motion');
  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  /* ---------- Nav ---------- */
  const nav = $('#nav');
  const menuBtn = $('.menu-btn'), menu = $('#mobile-menu');
  let lastY = 0;
  const setMenu = (open) => {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open; d.body.classList.toggle('menu-open', open);
  };
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setMenu(false)));
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); } });
    window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });
  }
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 40);
    nav.classList.toggle('is-hidden', y > lastY && y > 480 && menu.hidden);
    lastY = y;
  }, { passive: true });
  // current section marker
  const links = $$('.nav-links a');
  if ('IntersectionObserver' in window && links.length) {
    const map = new Map();
    links.forEach((a) => { const t = $(a.getAttribute('href')); if (t) map.set(t, a); });
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { links.forEach((a) => a.removeAttribute('aria-current')); map.get(en.target).setAttribute('aria-current', 'location'); } }), { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((_, t) => io.observe(t));
  }

  /* ---------- Reveals ---------- */
  const revealEls = $$('.reveal, .reveal-img, .hl, .h-display, .session-side, .blocks');
  if (!reduced && 'IntersectionObserver' in window) {
    const groups = new Map();
    revealEls.forEach((el) => { const p = el.parentElement; if (!groups.has(p)) groups.set(p, []); groups.get(p).push(el); });
    groups.forEach((list) => list.forEach((el, i) => { if (list.length > 1) el.style.setProperty('--d', Math.min(i, 8) * 90 + 'ms'); }));
    $$('.b-bar').forEach((b, i) => b.style.setProperty('--d', i * 120 + 'ms'));
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.05, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else revealEls.forEach((el) => el.classList.add('in'));

  /* ---------- Hero parallax (desktop, gentle) ---------- */
  const heroImg = $('.hero-media img');
  if (!reduced && heroImg && window.matchMedia('(min-width: 901px)').matches) {
    window.addEventListener('scroll', () => { const y = window.scrollY; if (y < window.innerHeight) heroImg.style.transform = 'translate3d(0,' + y * 0.15 + 'px,0) scale(1.05)'; }, { passive: true });
  }

  /* ---------- Scroll-progress drivers: system line, timeline, progress curve ---------- */
  function progressOf(el, startAt, endAt) {
    const r = el.getBoundingClientRect(), vh = window.innerHeight;
    return clamp01((vh * (startAt == null ? 0.85 : startAt) - r.top) / (r.height + vh * ((startAt == null ? 0.85 : startAt) - (endAt == null ? 0.25 : endAt))));
  }
  const drivers = [];
  const pillars = $$('.pillar'), sysLine = $('.sys-line');
  if (pillars.length) drivers.push(() => {
    const host = $('.pillars');
    const p = reduced ? 1 : progressOf(host, 0.9, 0.35);
    pillars.forEach((el, i) => el.classList.toggle('is-on', p >= (i + 0.5) / pillars.length));
    if (sysLine) sysLine.style.setProperty('--p', p);
  });
  const tl = $('#timeline');
  if (tl) drivers.push(() => {
    const items = $$('.tl-item', tl);
    const p = reduced ? 1 : progressOf(tl, 0.9, 0.3);
    tl.style.setProperty('--p', p);
    items.forEach((el, i) => el.classList.toggle('is-on', p >= i / items.length + 0.05));
  });
  const prog = $('#prog');
  if (prog) drivers.push(() => {
    const steps = $$('.prog-steps li', prog);
    const p = reduced ? 1 : progressOf(prog, 0.95, 0.3);
    prog.style.setProperty('--p', p);
    steps.forEach((el, i) => el.classList.toggle('is-on', p >= i / (steps.length - 1) - 0.02));
  });
  let ticking = false;
  const runDrivers = () => { drivers.forEach((f) => f()); ticking = false; };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(runDrivers); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  runDrivers();

  /* ---------- Timetable: day labels for mobile + selection preview ---------- */
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
  $$('.tt tbody tr').forEach((tr) => $$('td', tr).forEach((td, i) => td.setAttribute('data-day', days[i])));
  const note = $('#tt-note');
  const coaches = { Strength: 'M. REED', Conditioning: 'A. RAO', Mobility: 'A. RAO', Performance: 'M. CHEN' };
  $$('.tt .s').forEach((btn) => btn.addEventListener('click', () => {
    const sel = btn.classList.contains('is-sel');
    $$('.tt .s.is-sel').forEach((b) => { b.classList.remove('is-sel'); b.removeAttribute('aria-pressed'); });
    if (sel) { note.textContent = 'SELECT A SESSION TO PREVIEW IT · ALL SESSIONS 50 MIN · SMALL GROUPS · CONCEPT TIMETABLE'; return; }
    btn.classList.add('is-sel'); btn.setAttribute('aria-pressed', 'true');
    const time = btn.closest('tr').querySelector('th').textContent.trim();
    const day = btn.closest('td').getAttribute('data-day');
    const type = btn.textContent.trim();
    note.innerHTML = '<b>' + day + ' ' + time + ' · ' + type.toUpperCase() + '</b> · 50 MIN · COACH ' + coaches[type] + ' · SPACES 12 · CONCEPT ONLY — NO BOOKING';
  }));

  /* ---------- Equipment track: wheel → horizontal on desktop ---------- */
  const eq = $('.equip-track');
  if (eq && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    eq.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = eq.scrollWidth - eq.clientWidth;
      if ((eq.scrollLeft <= 0 && e.deltaY < 0) || (eq.scrollLeft >= max - 1 && e.deltaY > 0)) return;
      e.preventDefault(); eq.scrollLeft += e.deltaY;
    }, { passive: false });
    eq.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { eq.scrollBy({ left: 300, behavior: 'smooth' }); e.preventDefault(); } if (e.key === 'ArrowLeft') { eq.scrollBy({ left: -300, behavior: 'smooth' }); e.preventDefault(); } });
  }

  /* ---------- FAQ: animated height ---------- */
  if (!reduced) $$('.q').forEach((det) => {
    const summary = $('summary', det), body = $('.q-body', det);
    let anim = null;
    const finish = (open) => { det.open = open; det.style.height = ''; det.style.overflow = ''; anim = null; };
    summary.addEventListener('click', (e) => {
      e.preventDefault(); if (anim) anim.cancel();
      det.style.overflow = 'hidden';
      const start = det.offsetHeight;
      if (det.open) {
        anim = det.animate({ height: [start + 'px', summary.offsetHeight + 'px'] }, { duration: 300, easing: 'cubic-bezier(.7,0,.3,1)' });
        anim.onfinish = anim.oncancel = () => finish(false);
      } else {
        det.open = true;
        $$('.q[open]').forEach((o) => { if (o !== det) { o.open = false; o.style.height = ''; } });
        anim = det.animate({ height: [start + 'px', (summary.offsetHeight + body.offsetHeight) + 'px'] }, { duration: 400, easing: 'cubic-bezier(.22,1,.36,1)' });
        anim.onfinish = anim.oncancel = () => finish(true);
      }
    });
  });

  /* ---------- Footer year ---------- */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
