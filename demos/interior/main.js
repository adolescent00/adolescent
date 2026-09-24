/* ATELIER NORD — concept site by Adolescent Studio. Vanilla JS, no dependencies.
   Components: nav, footer, plan (SVG floor plan), gallery (hover/cursor), materials (horizontal track),
   project-detail (case-study renderer), plus scroll reveals and the statement drift. */
(function () {
  'use strict';
  const d = document;
  const $ = (s, c) => (c || d).querySelector(s);
  const $$ = (s, c) => Array.from((c || d).querySelectorAll(s));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  if (!reduced) d.documentElement.classList.add('motion');

  /* =====================================================================
     COMPONENT: nav
     ===================================================================== */
  const NAV_LINKS = [['WORK', 'index.html#work'], ['STUDIO', 'index.html#studio'], ['PROCESS', 'index.html#process'], ['CONTACT', 'index.html#contact']];
  function renderNav(host) {
    const page = host.dataset.page || 'home';
    const href = (h) => (page === 'home' ? h.replace('index.html', '') : h);
    host.className = 'nav';
    host.innerHTML =
      '<div class="nav-bar">' +
        '<a class="nav-brand" href="' + (page === 'home' ? '#top' : 'index.html') + '">ATELIER NORD</a>' +
        '<nav class="nav-links" aria-label="Primary">' + NAV_LINKS.map(([t, h]) => '<a href="' + href(h) + '">' + t + '</a>').join('') + '</nav>' +
        '<button class="nav-menu tech" type="button" aria-expanded="false" aria-controls="menu-panel"><span class="nav-menu-label">MENU</span> / <span class="nav-menu-count">03</span></button>' +
      '</div>' +
      '<div class="menu-panel" id="menu-panel" hidden>' +
        '<nav aria-label="Menu"><ol class="menu-list">' + NAV_LINKS.map(([t, h], i) => '<li><a href="' + href(h) + '"><span class="tech">0' + (i + 1) + '</span><span class="display">' + t + '</span></a></li>').join('') + '</ol></nav>' +
        '<p class="tech menu-meta"><span>INTERIORS / ARCHITECTURE / OBJECTS</span><a href="../../">← BACK TO ADOLESCENT STUDIOS</a></p>' +
      '</div>';
    const btn = $('.nav-menu', host), panel = $('#menu-panel', host);
    const setOpen = (o) => { btn.setAttribute('aria-expanded', String(o)); panel.hidden = !o; host.classList.toggle('is-open', o); $('.nav-menu-label', btn).textContent = o ? 'CLOSE' : 'MENU'; d.body.classList.toggle('menu-open', o); };
    btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));
    $$('a', panel).forEach((a) => a.addEventListener('click', () => setOpen(false)));
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !panel.hidden) { setOpen(false); btn.focus(); } });
    // Section counter (MENU / 03) reflects the section in view on the home page
    if (page === 'home' && 'IntersectionObserver' in window) {
      const secs = $$('main > section');
      const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) $('.nav-menu-count', btn).textContent = String(secs.indexOf(en.target) + 1).padStart(2, '0'); }), { rootMargin: '-45% 0px -50% 0px' });
      secs.forEach((s) => io.observe(s));
    }
    let last = 0;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      host.classList.toggle('is-scrolled', y > 40);
      host.classList.toggle('is-hidden', y > last && y > 400 && panel.hidden);
      last = y;
    }, { passive: true });
  }

  /* =====================================================================
     COMPONENT: footer
     ===================================================================== */
  function renderFooter(host) {
    const home = d.body.classList.contains('page-project') ? 'index.html' : '';
    host.className = 'footer';
    host.innerHTML =
      '<div class="footer-grid">' +
        '<div class="footer-brand"><span class="display">ATELIER NORD</span><span class="tech">INTERIORS / ARCHITECTURE / OBJECTS</span></div>' +
        '<nav class="footer-nav" aria-label="Footer">' + NAV_LINKS.map(([t, h]) => '<a href="' + (home ? h : h.replace('index.html', '')) + '">' + t + '</a>').join('') + '</nav>' +
        '<div class="footer-contact"><a href="mailto:hello@atelier-nord.example">hello@atelier-nord.example</a>' +
          '<a class="footer-social" href="#top" aria-label="Instagram (placeholder link)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a></div>' +
      '</div>' +
      '<div class="footer-tech tech">' +
        '<span>CONCEPT WEBSITE BY <a href="../../">ADOLESCENT STUDIOS</a></span>' +
        '<span>ATELIER NORD IS A FICTIONAL CONCEPT CREATED FOR DEMONSTRATION PURPOSES.</span>' +
        '<span>© ' + new Date().getFullYear() + '</span>' +
      '</div>';
  }

  /* =====================================================================
     COMPONENT: plan — fictional SVG floor plan, drawn on scroll
     ===================================================================== */
  const ROOMS = [
    { id: 'LIVING', x: 60, y: 60, w: 380, h: 300, dim: '7.6 × 6.0' },
    { id: 'DINING', x: 440, y: 60, w: 240, h: 180, dim: '4.8 × 3.6' },
    { id: 'KITCHEN', x: 680, y: 60, w: 260, h: 180, dim: '5.2 × 3.6' },
    { id: 'COURTYARD', x: 440, y: 240, w: 240, h: 240, dim: '4.8 × 4.8', court: true },
    { id: 'STUDY', x: 680, y: 240, w: 260, h: 140, dim: '5.2 × 2.8' },
    { id: 'BEDROOM', x: 680, y: 380, w: 260, h: 200, dim: '5.2 × 4.0' },
    { id: 'ENTRY', x: 60, y: 360, w: 380, h: 120, dim: '7.6 × 2.4', minor: true },
    { id: 'TERRACE', x: 60, y: 480, w: 620, h: 100, dim: '12.4 × 2.0', minor: true }
  ];
  function renderPlan(host) {
    const hi = (host.dataset.highlight || '').split(',').map((s) => s.trim());
    const showRoute = host.dataset.route !== 'false';
    let g = '';
    // grid
    g += '<g class="pl-grid">';
    for (let x = 60; x <= 940; x += 40) g += '<path d="M' + x + ' 40V600"/>';
    for (let y = 60; y <= 580; y += 40) g += '<path d="M40 ' + y + 'H960"/>';
    g += '</g>';
    // rooms
    g += '<g class="pl-rooms">';
    ROOMS.forEach((r, i) => {
      const cls = 'pl-room' + (hi.includes(r.id) ? ' is-hi' : '') + (r.court ? ' is-court' : '') + (r.minor ? ' is-minor' : '');
      g += '<g class="' + cls + '" style="--i:' + i + '">';
      g += '<rect class="pl-fill" x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '"/>';
      g += '<rect class="pl-wall draw" x="' + r.x + '" y="' + r.y + '" width="' + r.w + '" height="' + r.h + '" pathLength="1"/>';
      if (r.court) { g += '<path class="pl-hatch" d="' + hatch(r) + '"/>'; g += '<circle class="pl-tree" cx="' + (r.x + r.w / 2) + '" cy="' + (r.y + r.h / 2) + '" r="46"/><circle class="pl-tree" cx="' + (r.x + r.w / 2) + '" cy="' + (r.y + r.h / 2) + '" r="8"/>'; }
      g += '<text class="pl-label" x="' + (r.x + 14) + '" y="' + (r.y + 28) + '">' + r.id + '</text>';
      g += '<text class="pl-dim" x="' + (r.x + 14) + '" y="' + (r.y + 46) + '">' + r.dim + ' M</text>';
      g += '</g>';
    });
    g += '</g>';
    // openings (doors / windows)
    g += '<g class="pl-open">' +
      '<path class="draw" d="M200 360 a40 40 0 0 1 40 -40" pathLength="1"/><path d="M200 360h40" class="pl-door"/>' +
      '<path class="draw" d="M540 240 a30 30 0 0 1 30 30" pathLength="1"/>' +
      '<path class="draw" d="M680 300 a30 30 0 0 1 -30 30" pathLength="1"/>' +
      '<path class="pl-win draw" d="M100 60h140M280 60h120M720 60h180M940 420v120M60 140v160" pathLength="1"/>' +
      '</g>';
    // light arrows (north light)
    g += '<g class="pl-light">' + [160, 340, 800].map((x) => '<path d="M' + x + ' 8v34M' + (x - 5) + ' 36l5 6 5-6"/>').join('') + '</g>';
    // circulation route
    if (showRoute) g += '<path class="pl-route draw" d="M250 600 V420 H300 V200 H560 V300 H760 V470" pathLength="1"/><circle class="pl-dot" r="5"><animateMotion dur="14s" repeatCount="indefinite" path="M250 600 V420 H300 V200 H560 V300 H760 V470"/></circle>';
    // dimension lines
    g += '<g class="pl-dims">' +
      '<path d="M60 620H940M60 612v16M940 612v16"/><text x="500" y="642" text-anchor="middle">17 600</text>' +
      '<path d="M980 60V580M972 60h16M972 580h16"/><text x="1000" y="325" transform="rotate(90 1000 325)" text-anchor="middle">10 400</text>' +
      '</g>';
    // north arrow + title block
    g += '<g class="pl-north" transform="translate(30 30)"><circle r="14"/><path d="M0 -10V10M-5 -4l5-6 5 6"/><text x="22" y="4">N</text></g>';
    g += '<g class="pl-title"><text x="60" y="675">AN-' + (hi[0] ? hi[0].slice(0, 2) : 'GF') + ' / 01</text><text x="940" y="675" text-anchor="end">GROUND FLOOR · 1:100 · REV C</text></g>';
    host.innerHTML = '<svg class="plan-svg" viewBox="0 0 1020 690" role="img" aria-label="Fictional ground floor plan with living, dining, kitchen, courtyard, study and bedroom.">' + g + '</svg>';
    if (!reduced && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { host.classList.add('is-drawn'); io.disconnect(); } }), { threshold: 0.25 });
      io.observe(host);
    } else host.classList.add('is-drawn');
  }
  function hatch(r) {
    let p = '';
    for (let k = 20; k < r.w + r.h; k += 20) {
      const x1 = r.x + Math.min(k, r.w), y1 = r.y + Math.max(0, k - r.w), x2 = r.x + Math.max(0, k - r.h), y2 = r.y + Math.min(k, r.h);
      p += 'M' + x1 + ' ' + y1 + 'L' + x2 + ' ' + y2;
    }
    return p;
  }

  /* =====================================================================
     COMPONENT: gallery — custom cursor label + subtle image drift
     ===================================================================== */
  function initGallery(host) {
    const cursor = $('#cursor');
    if (!finePointer || reduced || !cursor) { host.classList.add('is-touch'); return; }
    const label = $('span', cursor);
    let cx = 0, cy = 0, tx = 0, ty = 0, raf = null;
    const loop = () => { cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18; cursor.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)'; raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.2 ? requestAnimationFrame(loop) : null; };
    d.addEventListener('pointermove', (e) => { tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(loop); }, { passive: true });
    $$('.project-link', host).forEach((a) => {
      const img = $('img', a);
      a.addEventListener('pointerenter', () => { label.textContent = 'VIEW PROJECT ↗'; cursor.classList.add('is-active'); });
      a.addEventListener('pointerleave', () => { cursor.classList.remove('is-active'); if (img) img.style.transform = ''; });
      a.addEventListener('pointermove', (e) => {
        if (!img) return;
        const r = a.getBoundingClientRect();
        const dx = ((e.clientX - r.left) / r.width - 0.5) * 12, dy = ((e.clientY - r.top) / r.height - 0.5) * 12;
        img.style.transform = 'scale(1.04) translate(' + -dx + 'px,' + -dy + 'px)';
      }, { passive: true });
    });
    // Generic hover targets outside the gallery
    $$('[data-cursor]').forEach((el) => {
      el.addEventListener('pointerenter', () => { label.textContent = el.dataset.cursor; cursor.classList.add('is-active'); });
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
    });
  }

  /* =====================================================================
     COMPONENT: materials — horizontal track with drag + progress
     ===================================================================== */
  function initMaterials(track) {
    const bar = $('.mat-progress i', track.parentElement);
    const update = () => { if (bar) { const max = track.scrollWidth - track.clientWidth; bar.style.transform = 'scaleX(' + (max > 0 ? track.scrollLeft / max : 0) + ')'; } };
    track.addEventListener('scroll', update, { passive: true }); update();
    // Vertical wheel → horizontal scroll while the track is the pointer target (desktop only, keeps user in control near the ends)
    if (finePointer) track.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const max = track.scrollWidth - track.clientWidth;
      const atStart = track.scrollLeft <= 0 && e.deltaY < 0, atEnd = track.scrollLeft >= max - 1 && e.deltaY > 0;
      if (atStart || atEnd) return;
      e.preventDefault(); track.scrollLeft += e.deltaY;
    }, { passive: false });
    // Pointer drag
    let down = false, sx = 0, sl = 0, moved = false;
    track.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = track.scrollLeft; track.classList.add('is-dragging'); });
    window.addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 3) moved = true; track.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', () => { down = false; track.classList.remove('is-dragging'); });
    track.addEventListener('click', (e) => { if (moved) e.preventDefault(); }, true);
    track.addEventListener('keydown', (e) => { if (e.key === 'ArrowRight') { track.scrollBy({ left: 320, behavior: 'smooth' }); e.preventDefault(); } if (e.key === 'ArrowLeft') { track.scrollBy({ left: -320, behavior: 'smooth' }); e.preventDefault(); } });
  }

  /* =====================================================================
     Scroll reveals + statement drift
     ===================================================================== */
  function initReveals() {
    const els = $$('.reveal, .reveal-img, .w, .ann, .stage, .entry, .draw-on, .mat');
    if (reduced || !('IntersectionObserver' in window)) { els.forEach((el) => el.classList.add('in')); return; }
    const groups = new Map();
    els.forEach((el) => { const p = el.parentElement; if (!groups.has(p)) groups.set(p, []); groups.get(p).push(el); });
    groups.forEach((list) => list.forEach((el, i) => { if (list.length > 1) el.style.setProperty('--d', Math.min(i, 8) * 80 + 'ms'); }));
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { threshold: 0.05, rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
    // Statement: lines drift horizontally with scroll progress (GPU transform only)
    const st = $('.statement');
    if (st) {
      const lines = $$('.w[data-shift]', st);
      let active = false;
      const tick = () => {
        const r = st.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, 1 - (r.top + r.height) / (window.innerHeight + r.height)));
        lines.forEach((l) => { l.style.transform = 'translate3d(' + ((p - 0.5) * 80 * Number(l.dataset.shift)) + 'px,0,0)'; });
      };
      const io2 = new IntersectionObserver((es) => { active = es[0].isIntersecting; if (active) tick(); });
      io2.observe(st);
      window.addEventListener('scroll', () => { if (active) requestAnimationFrame(tick); }, { passive: true });
    }
    // Hero image: very gentle parallax (desktop only)
    const hm = $('.hero-media img');
    if (hm && finePointer) window.addEventListener('scroll', () => { const y = window.scrollY; if (y < window.innerHeight) hm.style.transform = 'translate3d(0,' + y * 0.12 + 'px,0)'; }, { passive: true });
  }

  /* =====================================================================
     COMPONENT: project-detail — architectural case study from data
     ===================================================================== */
  function renderProject(host) {
    const list = window.AN_PROJECTS || [];
    const slug = new URLSearchParams(location.search).get('p');
    const idx = Math.max(0, list.findIndex((p) => p.slug === slug));
    const p = list[idx]; if (!p) return;
    const next = list[(idx + 1) % list.length];
    const prev = list[(idx - 1 + list.length) % list.length];
    d.title = p.title + ' — Atelier Nord';
    const img = (im, extra) => '<img src="' + im.src + '"' + (im.srcset ? ' srcset="' + im.srcset + '"' : '') + ' sizes="' + (extra || '100vw') + '" width="' + im.w + '" height="' + im.h + '" alt="' + esc(im.alt) + '" loading="lazy">';
    const swatch = (name) => {
      const k = name.toLowerCase();
      if (k.includes('travertine') || k.includes('stone') || k.includes('kota')) return 'style="background-image:url(img/mat-stone.webp)"';
      if (k.includes('oak') || k.includes('teak') || k.includes('timber')) return 'style="background-image:url(img/mat-timber.webp)"';
      if (k.includes('plaster') || k.includes('lime') || k.includes('concrete') || k.includes('cement')) return 'style="background-image:url(img/mat-plaster.webp)"';
      if (k.includes('metal') || k.includes('steel') || k.includes('brass')) return 'data-swatch="metal"';
      if (k.includes('oxide') || k.includes('terracotta') || k.includes('laterite')) return 'data-swatch="rust"';
      if (k.includes('felt') || k.includes('rattan')) return 'data-swatch="moss"';
      return 'data-swatch="textile"';
    };
    host.innerHTML =
      '<article class="cs">' +
        '<header class="cs-head">' +
          '<p class="tech cs-crumb"><a href="index.html#work">SELECTED WORK</a> / ' + p.num + '</p>' +
          '<h1 class="display cs-title"><span class="w"><span>' + esc(p.title).toUpperCase() + '</span></span></h1>' +
          '<p class="tech cs-meta"><span>' + p.category + '</span><span>' + p.location + '</span><span>' + p.year + '</span></p>' +
          '<span class="display cs-num" aria-hidden="true">' + p.num + '</span>' +
        '</header>' +
        '<figure class="cs-hero reveal-img' + (p.hero.portrait ? ' is-portrait' : '') + (p.hero.square ? ' is-square' : '') + '">' + img(p.hero) + '<figcaption class="tech">FIG. 01 — ' + p.location + ' / ' + p.country + '</figcaption></figure>' +
        '<section class="cs-statement" aria-label="Project statement">' +
          '<p class="tech">§ 01 — INTENT</p>' +
          '<p class="display cs-lead reveal">' + esc(p.statement) + '</p>' +
          '<div class="cs-body reveal">' + p.body.map((t) => '<p>' + esc(t) + '</p>').join('') + '</div>' +
        '</section>' +
        '<section class="cs-plan" aria-labelledby="cs-plan-t">' +
          '<div class="cs-plan-head"><p class="tech">§ 02 — DRAWING</p><h2 id="cs-plan-t" class="display">PLAN <em>STUDY</em></h2><p class="cs-plan-note">Highlighted rooms show where the project concentrated its effort. A fictional plan, adapted for each concept.</p></div>' +
          '<div class="plan-stage" data-component="plan" data-highlight="' + p.highlight + '" data-route="' + p.route + '"></div>' +
        '</section>' +
        '<section class="cs-mat" aria-labelledby="cs-mat-t">' +
          '<div class="cs-mat-head"><p class="tech">§ 03 — MATERIAL</p><h2 id="cs-mat-t" class="display">MATERIAL <em>STUDY</em></h2></div>' +
          '<ol class="mat-board">' + p.materials.map((m, i) => '<li class="chip reveal" style="--i:' + i + '"><span class="chip-swatch" ' + swatch(m[0]) + '></span><span class="chip-name">' + esc(m[0]) + '</span><span class="tech chip-use">S-0' + (i + 1) + ' / ' + esc(m[1]).toUpperCase() + '</span></li>').join('') + '</ol>' +
        '</section>' +
        '<section class="cs-images" aria-label="Project images">' +
          p.images.map((im, i) => '<figure class="cs-fig cs-fig-' + (i + 1) + ' reveal-img">' + img(im, i === 0 ? '(max-width: 900px) 100vw, 45vw' : '(max-width: 900px) 100vw, 55vw') + '<figcaption class="tech">' + esc(im.cap) + '</figcaption></figure>').join('') +
        '</section>' +
        '<section class="cs-facts" aria-labelledby="cs-facts-t">' +
          '<h2 id="cs-facts-t" class="tech">§ 04 — TECHNICAL INFORMATION</h2>' +
          '<dl class="facts">' + p.facts.map((f) => '<div><dt class="tech">' + f[0] + '</dt><dd>' + esc(f[1]) + '</dd></div>').join('') + '</dl>' +
        '</section>' +
        '<nav class="cs-nav" aria-label="Project navigation">' +
          '<a class="cs-prev" href="project.html?p=' + prev.slug + '"><span class="tech">← PREVIOUS / ' + prev.num + '</span><span class="display">' + esc(prev.title) + '</span></a>' +
          '<a class="cs-next" href="project.html?p=' + next.slug + '" data-cursor="NEXT ↗"><span class="tech">NEXT PROJECT / ' + next.num + '</span><span class="display">' + esc(next.title) + '</span></a>' +
        '</nav>' +
      '</article>';
    $$('[data-component="plan"]', host).forEach(renderPlan);
  }

  /* ===================================================================== boot */
  $$('[data-component="nav"]').forEach(renderNav);
  $$('[data-component="footer"]').forEach(renderFooter);
  $$('[data-component="project-detail"]').forEach(renderProject);
  $$('main [data-component="plan"]:not(.plan-svg)').forEach((h) => { if (!h.querySelector('svg')) renderPlan(h); });
  $$('[data-component="gallery"]').forEach(initGallery);
  $$('[data-component="materials"]').forEach(initMaterials);
  if (d.body.classList.contains('page-project')) initGallery(d.body);
  initReveals();
  window.scrollTo && history.scrollRestoration && (history.scrollRestoration = 'auto');
})();
