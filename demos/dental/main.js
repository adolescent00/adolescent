/* ARCADIA DENTAL — concept site by Adolescent Studio. Vanilla JS, no dependencies. */
(function () {
  'use strict';
  const d = document;
  const $ = (s, c) => (c || d).querySelector(s);
  const $$ = (s, c) => Array.from((c || d).querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Nav: scrolled state ---------- */
  const nav = $('#nav');
  if (nav) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        nav.classList.toggle('is-scrolled', window.scrollY > 24);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  const toggle = $('.menu-toggle');
  const menu = $('#mobile-menu');
  if (toggle && menu) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.hidden = !open;
      nav.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    $$('a', menu).forEach((a) => a.addEventListener('click', () => setOpen(false)));
    d.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setOpen(false); });
  }

  /* ---------- Section highlighting in nav ---------- */
  const links = $$('.nav-links a[href^="#"]');
  if (links.length && 'IntersectionObserver' in window) {
    const map = new Map();
    links.forEach((a) => { const t = $(a.getAttribute('href')); if (t) map.set(t, a); });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          links.forEach((a) => a.removeAttribute('aria-current'));
          map.get(en.target).setAttribute('aria-current', 'location');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    map.forEach((_, t) => io.observe(t));
  }

  /* ---------- Entrance reveals ---------- */
  const revealEls = $$('.reveal, .reveal-img');
  if (!reduced && 'IntersectionObserver' in window) {
    d.documentElement.classList.add('motion');
    // Stagger siblings that share a parent (lists / grids)
    const groups = new Map();
    revealEls.forEach((el) => {
      const p = el.parentElement;
      if (!groups.has(p)) groups.set(p, []);
      groups.get(p).push(el);
    });
    groups.forEach((els) => els.forEach((el, i) => { if (els.length > 1) el.style.setProperty('--d', Math.min(i, 6) * 90 + 'ms'); }));
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); ro.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach((el) => ro.observe(el));
    // Anything already in view on load (hero) reveals immediately
    requestAnimationFrame(() => revealEls.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) { el.classList.add('in'); ro.unobserve(el); }
    }));
  }

  /* ---------- FAQ: animated height ---------- */
  $$('.faq-item').forEach((det) => {
    const summary = $('summary', det);
    const body = $('.faq-body', det);
    if (!summary || !body) return;
    if (reduced) return; // native behaviour
    let anim = null;
    const finish = (open) => { det.open = open; det.style.height = ''; det.style.overflow = ''; anim = null; };
    summary.addEventListener('click', (e) => {
      e.preventDefault();
      if (anim) anim.cancel();
      det.style.overflow = 'hidden';
      const start = det.offsetHeight;
      if (det.open) {
        const end = summary.offsetHeight;
        anim = det.animate({ height: [start + 'px', end + 'px'] }, { duration: 320, easing: 'cubic-bezier(.65,0,.35,1)' });
        anim.onfinish = () => finish(false);
        anim.oncancel = () => finish(false);
      } else {
        det.open = true;
        // Close any sibling in the same group (mirrors name="faq" exclusivity)
        $$('.faq-item[open]').forEach((o) => { if (o !== det) { o.open = false; o.style.height = ''; } });
        const end = summary.offsetHeight + body.offsetHeight;
        anim = det.animate({ height: [start + 'px', end + 'px'] }, { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
        anim.onfinish = () => finish(true);
        anim.oncancel = () => finish(true);
      }
    });
  });

  /* ---------- Treatment links prefill the booking form ---------- */
  const typeSel = $('#f-type');
  if (typeSel) {
    $$('[data-treatment]').forEach((a) => {
      a.addEventListener('click', () => {
        const v = a.getAttribute('data-treatment');
        const opt = Array.from(typeSel.options).find((o) => o.text.trim() === v);
        if (opt) { typeSel.value = opt.value || opt.text; typeSel.closest('.field').classList.remove('invalid'); }
      });
    });
  }

  /* ---------- Demo booking form (never submits) ---------- */
  const form = $('#book-form');
  if (form) {
    const status = $('#form-status');
    const rules = {
      'f-name': (v) => v.trim().length >= 2 || 'Please enter your name.',
      'f-email': (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.',
      'f-phone': (v) => v.replace(/[^\d]/g, '').length >= 7 || 'Please enter a phone number.',
      'f-type': (v) => v !== '' || 'Please choose an appointment type.'
    };
    const validate = (id) => {
      const el = d.getElementById(id);
      const field = el.closest('.field');
      const err = $('.f-error', field);
      const res = rules[id](el.value);
      const ok = res === true;
      field.classList.toggle('invalid', !ok);
      el.setAttribute('aria-invalid', String(!ok));
      if (err) { err.textContent = ok ? '' : res; if (!ok) el.setAttribute('aria-describedby', err.id); }
      return ok;
    };
    Object.keys(rules).forEach((id) => {
      const el = d.getElementById(id);
      el.addEventListener('blur', () => { if (el.value) validate(id); });
      el.addEventListener('input', () => { if (el.closest('.field').classList.contains('invalid')) validate(id); });
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const results = Object.keys(rules).map(validate);
      const firstBad = Object.keys(rules)[results.indexOf(false)];
      if (firstBad) { d.getElementById(firstBad).focus(); return; }
      const name = $('#f-name').value.trim().split(/\s+/)[0];
      const type = $('#f-type').value;
      const btn = $('button[type="submit"]', form);
      btn.disabled = true; btn.textContent = 'Sending…';
      setTimeout(() => {
        form.classList.add('is-sent');
        status.hidden = false;
        status.classList.remove('err');
        status.innerHTML = '<strong>Thank you, ' + esc(name) + '.</strong>' +
          'This is a demo, so nothing has been sent — but on a live site the Arcadia team would now have your request for <em>' + esc(type) + '</em> and would be in touch shortly to arrange a time. ' +
          '<a href="#" class="f-reset">Reset the form</a>';
        $('.f-reset', status).addEventListener('click', (ev) => {
          ev.preventDefault();
          form.reset(); form.classList.remove('is-sent'); status.hidden = true;
          btn.disabled = false; btn.textContent = 'Book a Consultation';
          $$('.field', form).forEach((f) => f.classList.remove('invalid'));
          $('#f-name').focus();
        });
        status.focus && status.setAttribute('tabindex', '-1'); status.focus();
      }, reduced ? 0 : 500);
    });
  }
  function esc(s) { return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  /* ---------- Footer year ---------- */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
