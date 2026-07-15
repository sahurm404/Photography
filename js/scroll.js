// js/scroll.js — Refined Luxury Edition

document.addEventListener('DOMContentLoaded', () => {
  createPageCurtain();
  initHeroWords();
  initScrollReveals();
  initLineDividers();
  initParallax();
  initScrollProgress();
  initNavHighlight();
});

/* ============================================
   PAGE CURTAIN — elegant load transition
   ============================================ */
function createPageCurtain() {
  const curtain = document.createElement('div');
  curtain.classList.add('page-curtain');
  document.body.prepend(curtain);

  // Remove from DOM after animation completes
  curtain.addEventListener('animationend', () => curtain.remove());
}

/* ============================================
   HERO WORDS — word-by-word stagger
   ============================================ */
function initHeroWords() {
  const heroH1 = document.querySelector('.hero h1');
  const heroP = document.querySelector('.hero p');

  if (heroH1) splitIntoWords(heroH1, 0.7);
  if (heroP) splitIntoWords(heroP, 1.2);

  // Also animate the hero CTA button
  const heroCTA = document.querySelector('.hero .btn');
  if (heroCTA) {
    heroCTA.style.opacity = '0';
    heroCTA.style.transform = 'translateY(20px)';
    heroCTA.style.transition = 'opacity 0.8s ease 1.6s, transform 0.8s cubic-bezier(0.25,1,0.5,1) 1.6s';
    requestAnimationFrame(() => {
      heroCTA.style.opacity = '1';
      heroCTA.style.transform = 'translateY(0)';
    });
  }
}

function splitIntoWords(el, baseDelay) {
  const text = el.textContent.trim();
  const words = text.split(/\s+/);
  el.innerHTML = '';
  el.style.opacity = '1';

  words.forEach((word, i) => {
    const wrapper = document.createElement('span');
    wrapper.style.cssText = 'overflow: hidden; display: inline-block; vertical-align: top; margin-right: 0.3em;';

    const inner = document.createElement('span');
    inner.classList.add('hero-word');
    inner.textContent = word;
    inner.style.animationDelay = `${baseDelay + i * 0.08}s`;

    wrapper.appendChild(inner);
    el.appendChild(wrapper);
  });
}

/* ============================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================ */
function initScrollReveals() {
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  reveals.forEach(el => observer.observe(el));
}

/* ============================================
   LINE DIVIDERS — reveal on scroll
   ============================================ */
function initLineDividers() {
  const dividers = document.querySelectorAll('.line-divider');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  dividers.forEach(el => observer.observe(el));
}

/* ============================================
   PARALLAX — smooth hero depth
   ============================================ */
function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const scrollPos = window.scrollY;
      const heroHeight = heroBg.closest('.hero')?.offsetHeight || 800;

      if (scrollPos < heroHeight) {
        heroBg.style.transform = `translateY(${scrollPos * 0.3}px)`;
        // Fade hero content as user scrolls down
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
          const fadeRatio = 1 - (scrollPos / (heroHeight * 0.6));
          heroContent.style.opacity = Math.max(0, fadeRatio);
        }
      }
      ticking = false;
    });
  }, { passive: true });
}

/* ============================================
   SCROLL PROGRESS — thin accent bar at top
   ============================================ */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    width: 0%;
    background: var(--color-accent);
    z-index: 9999;
    pointer-events: none;
    transition: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      bar.style.width = `${(scrollTop / docHeight) * 100}%`;
    }
  }, { passive: true });
}

/* ============================================
   NAV HIGHLIGHT — shrink on scroll
   ============================================ */
function initNavHighlight() {
  const header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}
