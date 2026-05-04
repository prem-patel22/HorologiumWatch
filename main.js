/* ============================================================
   HOROLOGIUM — Main JavaScript
   Cursor · Preloader · Scroll · Animations · Counters
   ============================================================ */

(function () {
  'use strict';

  /* ── CUSTOM CURSOR ──────────────────────────────────────── */
  const dot    = document.querySelector('.cursor-dot');
  const circle = document.querySelector('.cursor-circle');

  if (dot && circle) {
    let mouseX = 0, mouseY = 0, circleX = 0, circleY = 0;

    document.addEventListener('mousemove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    });

    (function animateCursor() {
      circleX += (mouseX - circleX) * 0.12;
      circleY += (mouseY - circleY) * 0.12;
      circle.style.left = circleX + 'px';
      circle.style.top  = circleY + 'px';
      requestAnimationFrame(animateCursor);
    })();

    document.querySelectorAll('a, button, .watch-card, .brand-tile, .watch-item')
      .forEach(el => {
        el.addEventListener('mouseenter', () => { dot.style.transform = 'translate(-50%,-50%) scale(2)'; });
        el.addEventListener('mouseleave', () => { dot.style.transform = 'translate(-50%,-50%) scale(1)'; });
      });
  }

  /* ── PRELOADER ──────────────────────────────────────────── */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('hidden'), 1800);
    });
    // Fallback
    setTimeout(() => preloader && preloader.classList.add('hidden'), 3500);
  }

  /* ── NAVBAR SCROLL ──────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ── MOBILE MENU ────────────────────────────────────────── */
  const navToggle  = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if (navToggle && mobileMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── SCROLL REVEAL ──────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach(el => revealObserver.observe(el));

  /* ── COUNTER ANIMATION ──────────────────────────────────── */
  const counters = document.querySelectorAll('.stat-num');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el     = e.target;
          const target = parseInt(el.dataset.target);
          const duration = 2000;
          const step   = target / (duration / 16);
          let current  = 0;
          const timer  = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = Math.floor(current) + (target > 100 ? '+' : '');
          }, 16);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ── HERO PARTICLES ─────────────────────────────────────── */
  const particleContainer = document.getElementById('heroParticles');
  if (particleContainer) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 2 + 1;
      p.style.cssText = `
        left:${Math.random() * 100}%;
        width:${size}px; height:${size}px;
        animation-duration:${8 + Math.random() * 12}s;
        animation-delay:${Math.random() * 8}s;
        --dx:${(Math.random() - 0.5) * 120}px;
      `;
      particleContainer.appendChild(p);
    }
  }

  /* ── CLOCK HANDS (set to real time) ────────────────────── */
  function setClockTime() {
    const now     = new Date();
    const s       = now.getSeconds();
    const m       = now.getMinutes() + s / 60;
    const h       = (now.getHours() % 12) + m / 60;
    const sDeg    = s * 6;
    const mDeg    = m * 6;
    const hDeg    = h * 30;

    document.querySelectorAll('.watch-second-hand, .dial-art .d-s').forEach(el => {
      el.style.animationDelay = `-${sDeg / 6}s`;
    });
    document.querySelectorAll('.watch-minute-hand, .dial-art .d-m').forEach(el => {
      el.style.animationDelay = `-${mDeg / 6 * 10}s`;
    });
    document.querySelectorAll('.watch-hour-hand, .dial-art .d-h').forEach(el => {
      el.style.animationDelay = `-${hDeg / 30 * 3600}s`;
    });
  }
  setClockTime();

  /* ── TESTIMONIALS SLIDER ────────────────────────────────── */
  const items  = document.querySelectorAll('.testimonial-item');
  const dots   = document.querySelectorAll('.t-dot');
  const btnPrev = document.getElementById('tPrev');
  const btnNext = document.getElementById('tNext');
  let current   = 0;
  let autoplay;

  function showTestimonial(idx) {
    items.forEach((el, i) => { el.classList.toggle('active', i === idx); });
    dots.forEach((d, i) => { d.classList.toggle('active', i === idx); });
    current = idx;
  }

  if (items.length) {
    showTestimonial(0);
    autoplay = setInterval(() => showTestimonial((current + 1) % items.length), 5000);
    if (btnNext) btnNext.addEventListener('click', () => {
      clearInterval(autoplay);
      showTestimonial((current + 1) % items.length);
    });
    if (btnPrev) btnPrev.addEventListener('click', () => {
      clearInterval(autoplay);
      showTestimonial((current - 1 + items.length) % items.length);
    });
    dots.forEach((d, i) => d.addEventListener('click', () => { clearInterval(autoplay); showTestimonial(i); }));
  }

  /* ── FILTER BUTTONS (Collection Page) ──────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const watchItems = document.querySelectorAll('.watch-item');
  if (filterBtns.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        watchItems.forEach(item => {
          const brand = item.dataset.brand;
          const show  = filter === 'all' || brand === filter;
          item.style.transition  = 'opacity 0.4s, transform 0.4s';
          item.style.opacity     = show ? '1' : '0';
          item.style.transform   = show ? 'scale(1)' : 'scale(0.95)';
          item.style.pointerEvents = show ? 'auto' : 'none';
          setTimeout(() => { item.style.display = show ? '' : 'none'; }, show ? 0 : 400);
          if (show) { setTimeout(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; }, 10); }
        });
      });
    });
  }

  /* ── PARALLAX (Hero Watch) ──────────────────────────────── */
  const heroWatch = document.querySelector('.hero-watch-visual');
  if (heroWatch) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroWatch.style.transform = `translateY(calc(-50% + ${scrolled * 0.2}px))`;
    }, { passive: true });
  }

  /* ── SMOOTH PAGE TRANSITIONS ────────────────────────────── */
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#') && !href.startsWith('http') && href.endsWith('.html')) {
      link.addEventListener('click', e => {
        e.preventDefault();
        document.body.style.opacity    = '0';
        document.body.style.transition = 'opacity 0.4s ease';
        setTimeout(() => { window.location.href = href; }, 400);
      });
    }
  });
  window.addEventListener('pageshow', () => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity    = '1';
  });
  document.body.style.opacity = '1';

  /* ── NEWSLETTER FORM ────────────────────────────────────── */
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const btn   = newsletterForm.querySelector('button');
      if (input && input.value.includes('@')) {
        btn.textContent = '✓ Subscribed';
        btn.style.background = 'transparent';
        btn.style.color = 'var(--gold)';
        btn.style.border = '1px solid var(--gold)';
        input.value = '';
        setTimeout(() => { btn.textContent = 'Subscribe'; btn.style.cssText = ''; }, 3000);
      }
    });
  }

  /* ── CONTACT FORM ───────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('.form-submit .btn-primary');
      if (btn) {
        btn.textContent = '✓ Message Sent — We Will Be In Touch';
        setTimeout(() => { btn.textContent = 'Send Enquiry'; }, 4000);
      }
    });
  }

  /* ── BRAND SECTION SCROLL TARGET ───────────────────────── */
  if (window.location.hash) {
    setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
  }

})();