/* ====================================================
   main.js — Premium interactions
   Custom Cursor · Preloader · Parallax · Card Glow
   Magnetic Buttons · Scroll Reveal · Theme · Nav · Cookie
   ==================================================== */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. THEME ─────────────────────────────────────
  const root = document.documentElement;
  const themeBtn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('fsd-theme') || 'dark';
  root.setAttribute('data-theme', saved);
  updateThemeBtn(saved);

  themeBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('fsd-theme', next);
    updateThemeBtn(next);
  });

  function updateThemeBtn(t) {
    if (themeBtn) themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
  }

  // ── 2. PRELOADER ─────────────────────────────────
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('hidden'), 600);
    });
    // Fallback
    setTimeout(() => preloader?.classList.add('hidden'), 2800);
  }

  // ── 3. CUSTOM CURSOR ─────────────────────────────
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  let cx = 0, cy = 0, rx = 0, ry = 0;

  if (cursor && cursorRing && window.matchMedia('(pointer:fine)').matches) {
    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
    });

    // Ring follows with lerp
    function lerpRing() {
      rx += (cx - rx) * 0.14;
      ry += (cy - ry) * 0.14;
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(lerpRing);
    }
    lerpRing();

    document.addEventListener('mousedown', () => {
      cursor.classList.add('click');
      cursorRing.classList.add('click');
    });
    document.addEventListener('mouseup', () => {
      cursor.classList.remove('click');
      cursorRing.classList.remove('click');
    });

    // Scale ring on links/buttons
    document.querySelectorAll('a,button,.gallery-item').forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.style.transform = 'translate(-50%,-50%) scale(1.7)');
      el.addEventListener('mouseleave', () => cursorRing.style.transform = 'translate(-50%,-50%) scale(1)');
    });
  }

  // ── 4. NAVBAR scroll ─────────────────────────────
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── 5. HAMBURGER / MOBILE NAV ────────────────────
  const burger    = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  burger?.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileNav?.classList.toggle('open');
  });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger?.classList.remove('open');
    mobileNav?.classList.remove('open');
  }));
  document.addEventListener('click', e => {
    if (!mobileNav?.contains(e.target) && !burger?.contains(e.target)) {
      burger?.classList.remove('open');
      mobileNav?.classList.remove('open');
    }
  });

  // ── 6. ACTIVE NAV LINK ───────────────────────────
  const pg = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const h = a.getAttribute('href') || '';
    if (h === pg || (pg === '' && h === 'index.html') || (pg === '/' && h === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ── 7. PARALLAX HERO ─────────────────────────────
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `translateY(${y * 0.35}px)`;
    }, { passive: true });
  }

  // ── 8. CARD MOUSE-GLOW ───────────────────────────
  document.querySelectorAll('.gc').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  // ── 9. MAGNETIC BUTTONS ──────────────────────────
  document.querySelectorAll('.btn-primary, .btn-gold').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width / 2) * 0.2;
      const dy = (e.clientY - r.top - r.height / 2) * 0.2;
      btn.style.transform = `translateY(-3px) translate(${dx}px,${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ── 10. SCROLL REVEAL ────────────────────────────
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => revealObs.observe(el));

  // ── 11. COUNTER ANIMATION ────────────────────────
  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();
      const easeOut = t => 1 - Math.pow(1 - t, 3);
      const tick = now => {
        const progress = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(easeOut(progress) * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cntObs.unobserve(el);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(el => cntObs.observe(el));

  // ── 12. COOKIE CONSENT ───────────────────────────
  const banner  = document.getElementById('cookieBanner');
  const accept  = document.getElementById('cookieAccept');
  const decline = document.getElementById('cookieDecline');

  if (banner && !localStorage.getItem('fsd-cookie')) {
    setTimeout(() => banner.classList.add('show'), 1600);
  }
  accept?.addEventListener('click',  () => { localStorage.setItem('fsd-cookie','accepted'); banner.classList.remove('show'); });
  decline?.addEventListener('click', () => { localStorage.setItem('fsd-cookie','declined'); banner.classList.remove('show'); });

  // ── 13. CONTACT FORM ─────────────────────────────
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', e => {
  e.preventDefault();
  const name = encodeURIComponent(document.getElementById('contactName').value);
  const phone = encodeURIComponent(document.getElementById('contactPhone').value);
  const email = encodeURIComponent(document.getElementById('contactEmail').value);
  const event = encodeURIComponent(document.getElementById('contactEvent').value);
  const date = encodeURIComponent(document.getElementById('contactDate').value);
  const message = encodeURIComponent(document.getElementById('contactMessage').value);
  let text = `Hello FreeStyle Balloon Decoration,%0A%0A`;
  text += `Name: ${name}%0A`;
  text += `Phone: ${phone}%0A`;
  if (email) text += `Email: ${email}%0A`;
  if (event) text += `Event: ${event}%0A`;
  if (date) text += `Date: ${date}%0A`;
  if (message) text += `Message: ${message}%0A`;
  const waUrl = `https://wa.me/919471679158?text=${text}`;
  const btn = form.querySelector('[type="submit"]');
  const orig = btn.innerHTML;
  btn.innerHTML = '✅ Opening WhatsApp…';
  btn.disabled = true;
  window.open(waUrl, '_blank');
  setTimeout(() => { btn.innerHTML = orig; btn.disabled = false; form.reset(); }, 3000);
});

  // ── 14. STAGGER CHILDREN ─────────────────────────
  // Stagger grid children for cinematic reveal
  document.querySelectorAll('.svc-grid, .rv-grid, .price-grid').forEach(grid => {
    [...grid.children].forEach((child, i) => {
      child.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  // ── 15. INTERACTIVE CANVAS BACKGROUND ─────────────
  function initInteractiveBg() {
    const canvas = document.createElement('canvas');
    canvas.id = 'ambientCanvas';
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.zIndex = '0';
    canvas.style.pointerEvents = 'none';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 45;
    const mouse = { x: null, y: null, active: false };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
      mouse.active = false;
    });

    function getThemeColor(varName, defaultColor) {
      const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
      return val || defaultColor;
    }

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 20;
        this.radius = Math.random() * 8 + 3;
        this.vx = Math.random() * 0.4 - 0.2;
        this.vy = -(Math.random() * 0.5 + 0.2); // floating up
        this.baseAlpha = Math.random() * 0.25 + 0.1;
        this.alpha = this.baseAlpha;
        const colorTypes = ['purple', 'gold', 'pink'];
        this.colorType = colorTypes[Math.floor(Math.random() * colorTypes.length)];
      }

      update() {
        if (mouse.active && mouse.x !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const force = (180 - dist) / 180 * 0.08;
            this.vx += (dx / dist) * force;
            this.vy += (dy / dist) * force;
          }
        }

        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > 1.2) {
          this.vx = (this.vx / speed) * 1.2;
          this.vy = (this.vy / speed) * 1.2;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.x += Math.sin(this.y * 0.008) * 0.15;

        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset();
        }
      }

      draw() {
        let hex = '#c492ff';
        if (this.colorType === 'gold') hex = getThemeColor('--gold', '#ecc055');
        else if (this.colorType === 'pink') hex = getThemeColor('--pink', '#f472b6');
        else hex = getThemeColor('--purple-light', '#c492ff');

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        grad.addColorStop(0, hex);
        grad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = grad;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        if (mouse.active && mouse.x !== null) {
          const dx = mouse.x - p1.x;
          const dy = mouse.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const alpha = (150 - dist) / 150 * 0.18;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = getThemeColor('--gold', '#ecc055');
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.55;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (110 - dist) / 110 * 0.09;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = getThemeColor('--purple-light', '#c492ff');
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.45;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }

  initInteractiveBg();

});
