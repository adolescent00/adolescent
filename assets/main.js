/* Adolescent Studio — site behaviour
   No dependencies. Progressive enhancement only: the page is fully usable without JS. */
(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ease = 'cubic-bezier(.22,1,.36,1)';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Sticky nav, compact logo, progress bar, active link ---------- */
  const nav = $('#nav');
  const mini = $('.mini-logo');
  const heroLogo = $('.hero-logo');
  const progress = $('.scroll-progress');
  const links = $$('.nav-links a');
  const sections = links.map(a => $(a.getAttribute('href')));
  let scheduled = false;

  function updateScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 24);
    const compactVisible = heroLogo.getBoundingClientRect().bottom < 100;
    mini.classList.toggle('logo-visible', compactVisible);
    mini.tabIndex = compactVisible ? 0 : -1;
    mini.setAttribute('aria-hidden', String(!compactVisible));
    const maximum = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${maximum > 0 ? Math.min(1, Math.max(0, y / maximum)) : 0})`;
    let current = -1;
    sections.forEach((section, i) => { if (section && section.getBoundingClientRect().top <= 160) current = i; });
    if ($('#contact').getBoundingClientRect().top <= 160) current = -1;
    links.forEach((link, i) => {
      if (i === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }
  const queueScroll = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } };
  window.addEventListener('scroll', queueScroll, { passive: true });
  window.addEventListener('resize', queueScroll, { passive: true });
  updateScroll();

  /* ---------- Mobile menu ---------- */
  const toggle = $('.menu-toggle');
  const menu = $('#mobile-menu');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    nav.classList.toggle('menu-open', open);
  }
  toggle.addEventListener('click', () => setMenu(menu.hidden));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); } });
  document.addEventListener('click', e => { if (!menu.hidden && !nav.contains(e.target)) setMenu(false); });
  window.matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* ---------- Scroll reveal (subtle, one-shot, respects reduced motion) ---------- */
  const targets = [];
  function reveal(el, delay = 0) {
    if (!el) return;
    el.classList.add('reveal');
    el.style.setProperty('--reveal-delay', `${delay}ms`);
    targets.push(el);
  }
  const stagger = () => (window.innerWidth > 760 ? 80 : 0);
  reveal($('.motto-label'));
  reveal($('.motto h2'), 70);
  reveal($('.motto-copy'), 130);
  $$('.section').forEach(section => {
    reveal($('.section-label', section));
    reveal($('.section-heading', section), 70);
  });
  $$('.services, .pricing-grid').forEach(grid => {
    [...grid.children].forEach((card, i) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'card-reveal';
      grid.insertBefore(wrapper, card);
      wrapper.appendChild(card);
      reveal(wrapper, i * stagger());
    });
  });
  $$('.handled > li, .steps > li, .trust-grid > li').forEach((li, i) => reveal(li, (i % 4) * stagger()));
  $$('.handled-title, .audience-grid > div, .audience-list, .faq-intro, .faq-list, .contact-intro, .contact-form, .footer-top, .footer-bottom, #pricing .compare-section, #pricing .one-time-section, #pricing .pricing-terms')
    .forEach((el, i) => reveal(el, 0));
  let observer;
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    document.body.classList.add('motion-ready');
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -24px 0px', threshold: 0.01 });
    targets.forEach(el => observer.observe(el));
  } else {
    targets.forEach(el => el.classList.add('is-visible'));
  }

  /* One restrained hero entrance. */
  const heroAnimations = [];
  if (!reducedMotion.matches && window.scrollY < 100 && !location.hash) {
    ['.hero-kicker', '.hero-logo', '.hero h1', '.hero-sub', '.hero-actions', '.hero-bottom'].forEach((sel, i) => {
      const el = $(sel);
      if (!el) return;
      const frames = sel === '.hero-logo'
        ? [{ opacity: 0, transform: 'translateY(18px) scale(.985)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }]
        : [{ opacity: 0, transform: 'translateY(15px)' }, { opacity: 1, transform: 'translateY(0)' }];
      heroAnimations.push(el.animate(frames, { duration: 900, delay: i * 80, easing: ease, fill: 'backwards' }));
    });
  }
  const showEverything = () => { targets.forEach(el => el.classList.add('is-visible')); };
  reducedMotion.addEventListener('change', e => {
    if (!e.matches) return;
    heroAnimations.forEach(a => a.cancel());
    observer?.disconnect();
    document.body.classList.remove('motion-ready');
    showEverything();
  });
  window.addEventListener('beforeprint', showEverything);

  /* ---------- Pricing CTAs pre-select the plan in the contact form ---------- */
  const planSelect = $('#plan');
  $$('[data-plan]').forEach(a => a.addEventListener('click', () => {
    const wanted = a.dataset.plan;
    const option = [...planSelect.options].find(o => o.text === wanted);
    if (option) planSelect.value = option.text;
    // Move focus to the first field once the browser has scrolled.
    setTimeout(() => $('#name').focus({ preventScroll: true }), 650);
  }));

  /* ---------- Contact form: validation + Formspree submission ---------- */
  const form = $('#contact-form');
  const status = $('#form-status');
  const submitBtn = $('#submit-btn');
  const messages = {
    name: 'Please tell us your name.',
    business_name: 'Please add your business name.',
    email: 'Please enter a valid email address, e.g. you@yourbusiness.com.',
    phone: 'Please enter a phone or WhatsApp number we can reach you on.',
    business_type: 'Please choose the option closest to your business.',
    current_website: 'Please enter a full web address starting with https:// (or leave this blank).',
    plan: 'Please choose what you need — “Not sure yet” is fine.',
    message: 'Please tell us a little about your business.'
  };

  function fieldWrap(input) { return input.closest('.field'); }
  function setError(input, text) {
    const wrap = fieldWrap(input);
    const err = $('.field-error', wrap);
    wrap.classList.toggle('invalid', Boolean(text));
    err.textContent = text || '';
    if (text) {
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', err.id);
    } else {
      input.removeAttribute('aria-invalid');
      input.removeAttribute('aria-describedby');
    }
  }
  function validate(input) {
    const v = input.value.trim();
    let text = '';
    if (input.required && !v) text = messages[input.name];
    else if (v && input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) text = messages.email;
    else if (v && input.type === 'tel' && v.replace(/\D/g, '').length < 8) text = messages.phone;
    else if (v && input.type === 'url' && !/^https?:\/\/[^\s]+\.[^\s]+$/i.test(v)) text = messages.current_website;
    setError(input, text);
    return !text;
  }
  const fields = $$('input:not([type=hidden]):not(.honeypot), select, textarea', form);
  fields.forEach(f => {
    f.addEventListener('blur', () => { if (f.value || f.required) validate(f); });
    f.addEventListener('input', () => { if (fieldWrap(f).classList.contains('invalid')) validate(f); });
  });

  function showStatus(kind, title, body) {
    status.className = `form-status ${kind}`;
    status.innerHTML = '';
    const strong = document.createElement('strong');
    strong.textContent = title;
    status.append(strong, document.createTextNode(body));
    status.hidden = false;
    if (!reducedMotion.matches) status.animate([{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 400, easing: ease });
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    status.hidden = true;
    const results = fields.map(validate);
    const firstInvalid = fields[results.indexOf(false)];
    if (firstInvalid) {
      firstInvalid.focus();
      showStatus('err', 'Almost there.', ' Please check the highlighted fields above.');
      return;
    }
    const endpoint = form.getAttribute('action');
    if (/YOUR_FORM_ID/.test(endpoint)) {
      showStatus('err', 'Form not connected yet.', ' Add your Formspree form ID to the form’s action attribute in index.html (see README) and this form will deliver enquiries to your inbox.');
      return;
    }
    submitBtn.disabled = true;
    const label = submitBtn.firstChild.textContent;
    submitBtn.firstChild.textContent = 'Sending… ';
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (response.ok) {
        form.reset();
        fields.forEach(f => setError(f, ''));
        showStatus('ok', 'Thank you — we’ve received your details.', ' We’ll reply within one working day to arrange a short call or WhatsApp chat.');
        status.focus?.();
      } else {
        let detail = '';
        try { const data = await response.json(); detail = data?.errors?.map(e => e.message).join(', ') || ''; } catch (_) {}
        showStatus('err', 'Something went wrong.', ` ${detail || 'Your message could not be sent.'} Please try again in a moment, or contact us directly.`);
      }
    } catch (_) {
      showStatus('err', 'No connection.', ' We couldn’t reach the form service. Please check your connection and try again.');
    } finally {
      submitBtn.disabled = false;
      submitBtn.firstChild.textContent = label;
    }
  });


  /* ---------- Demo showcase carousel ----------
     Native horizontal scroll + scroll-snap for touch/trackpad; JS adds the infinite
     loop (cloned sets), centre-based scaling, drag, arrows, dots and keyboard. */
  const carousel = $('[data-carousel]');
  if (carousel) {
    const track = $('.demo-track', carousel);
    const originals = [...track.children];
    const count = originals.length;
    const COPIES = 5;                    // 5 sets: start in the middle set, re-centre when drifting
    const MID = Math.floor(COPIES / 2);
    const frag = document.createDocumentFragment();
    for (let c = 0; c < COPIES; c++) {
      originals.forEach(li => {
        if (c === MID) { frag.appendChild(li); return; }
        const clone = li.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        $$('a, button', clone).forEach(el => el.tabIndex = -1);
        frag.appendChild(clone);
      });
    }
    track.replaceChildren(frag);
    const items = [...track.children];
    const dots = $$('.demo-dots button', carousel);
    if (!reducedMotion.matches) carousel.classList.add('motion-ok');

    const itemStep = () => items[1].offsetLeft - items[0].offsetLeft;
    const setWidth = () => itemStep() * count;
    const centreOf = i => items[i].offsetLeft + items[i].offsetWidth / 2 - track.clientWidth / 2;
    let activeIndex = MID * count;
    items[activeIndex].classList.add('is-active');
    items[activeIndex].firstElementChild.setAttribute('aria-current', 'true');

    function scrollToIndex(i, smooth = true) {
      track.scrollTo({ left: centreOf(i), behavior: smooth && !reducedMotion.matches ? 'smooth' : 'auto' });
    }
    function paint() {
      const falloff = parseFloat(getComputedStyle(carousel).getPropertyValue('--falloff')) || 0.14;
      const mid = track.scrollLeft + track.clientWidth / 2;
      const step = itemStep() || 1;
      let best = 0, bestD = Infinity;
      items.forEach((li, i) => {
        const c = li.offsetLeft + li.offsetWidth / 2;
        const d = Math.abs(c - mid) / step;
        if (d < bestD) { bestD = d; best = i; }
        const card = li.firstElementChild;
        const s = Math.max(1 - falloff * 1.4, 1 - Math.min(d, 1.4) * falloff);
        card.style.setProperty('--s', s.toFixed(3));
        card.style.setProperty('--o', Math.max(0.55, 1 - Math.min(d, 1.4) * 0.32).toFixed(3));
      });
      if (best !== activeIndex) {
        items[activeIndex]?.classList.remove('is-active');
        items[activeIndex]?.firstElementChild.removeAttribute('aria-current');
        items[best].classList.add('is-active');
        items[best].firstElementChild.setAttribute('aria-current', 'true');
        activeIndex = best;
        const logical = best % count;
        dots.forEach((b, i) => b.setAttribute('aria-selected', String(i === logical)));
      }
    }
    // Re-centre silently when the user has drifted into the outer sets (no visible jump:
    // same logical item, identical pixels, just a different DOM copy).
    let idle;
    function recentre() {
      const w = setWidth();
      const min = w * 1, max = w * (COPIES - 1);
      const pos = track.scrollLeft;
      if (pos < min || pos > max) {
        const prev = track.style.scrollBehavior;
        track.style.scrollBehavior = 'auto';
        track.scrollLeft = pos < min ? pos + w : pos - w;
        track.style.scrollBehavior = prev;
        paint();
      }
    }
    let ticking = false;
    track.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(() => { paint(); ticking = false; }); }
      clearTimeout(idle);
      idle = setTimeout(recentre, 120);
    }, { passive: true });

    // Arrows & dots
    $('.demo-prev', carousel).addEventListener('click', () => scrollToIndex(activeIndex - 1));
    $('.demo-next', carousel).addEventListener('click', () => scrollToIndex(activeIndex + 1));
    dots.forEach(b => b.addEventListener('click', () => {
      const target = +b.dataset.index;
      const cur = activeIndex % count;
      let delta = target - cur;
      if (delta > count / 2) delta -= count;
      if (delta < -count / 2) delta += count;
      scrollToIndex(activeIndex + delta);
    }));
    // Keyboard on the track
    track.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); scrollToIndex(activeIndex + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); scrollToIndex(activeIndex - 1); }
    });
    // Mouse drag (touch uses native scrolling)
    let drag = null;
    track.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { x: e.clientX, left: track.scrollLeft, moved: false, id: e.pointerId };
    });
    track.addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 4) { drag.moved = true; track.classList.add('is-dragging'); track.setPointerCapture(drag.id); }
      if (drag.moved) track.scrollLeft = drag.left - dx;
    });
    let justDragged = false;
    const endDrag = () => {
      if (!drag) return;
      const moved = drag.moved;
      drag = null;
      track.classList.remove('is-dragging');
      if (moved) { justDragged = true; setTimeout(() => { justDragged = false; }, 80); recentre(); scrollToIndex(activeIndex); }
    };
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('lostpointercapture', endDrag);
    // Click behaviour: a side card first travels to the centre; only the centred
    // card's "View Demo" actually opens the demo. Drags never trigger clicks.
    track.addEventListener('click', e => {
      if (justDragged) { e.preventDefault(); e.stopPropagation(); return; }
      const item = e.target.closest('.demo-item');
      if (!item) return;
      const index = items.indexOf(item);
      if (index !== activeIndex) {
        e.preventDefault();
        scrollToIndex(index);
        return;
      }
      // Active card: let the "View Demo" link work; clicks elsewhere on it do nothing.
    }, true);
    // Keyboard: tabbing onto a side card's button brings that card to the centre first.
    track.addEventListener('focusin', e => {
      const item = e.target.closest('.demo-item');
      if (!item) return;
      const index = items.indexOf(item);
      if (index !== activeIndex) scrollToIndex(index);
    });
    // Enter/Space on a focused side card (cards themselves are focusable for keyboard users).
    track.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const card = e.target.closest('.demo-card');
      if (!card || e.target !== card) return;
      e.preventDefault();
      const index = items.indexOf(card.parentElement);
      if (index !== activeIndex) scrollToIndex(index);
      else $('.demo-btn', card)?.click();
    });
    items.forEach(li => { li.firstElementChild.tabIndex = li.hasAttribute('aria-hidden') ? -1 : 0; li.firstElementChild.setAttribute('role', 'group'); });
    // Vertical wheel over the carousel keeps scrolling the page; horizontal wheel/trackpad scrolls the track natively.

    // Initial position, and keep the active item centred on resize.
    const init = () => { scrollToIndex(MID * count, false); paint(); };
    init();
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => scrollToIndex(activeIndex, false), 120); });
    if (document.fonts?.ready) document.fonts.ready.then(() => scrollToIndex(activeIndex, false));
  }

  /* Footer year */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
