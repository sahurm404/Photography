// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initMobileMenu();
  initHeaderScroll();
  initDataFetch();
});

// Data Fetching
async function initDataFetch() {
  const galleryGrid = document.getElementById('gallery-grid');
  const journalGrid = document.getElementById('journal-grid');
  
  if (!galleryGrid && !journalGrid) return;

  try {
    const response = await fetch('data.json');
    const data = await response.json();
    
    if (galleryGrid) renderGallery(galleryGrid, data.gallery || []);
    if (journalGrid) renderJournal(journalGrid, data.journal || []);
    
    // Re-initialize animations and cursor events for new elements
    if (typeof initScrollReveals === 'function') initScrollReveals();
    rebindCursorEvents();
  } catch (err) {
    console.error('Failed to load data:', err);
  }
}

function renderGallery(container, items) {
  let html = '';
  items.forEach((item, index) => {
    // Add staggered delay classes for visual effect
    const delayClass = index % 3 === 1 ? 'reveal-delay-1' : (index % 3 === 2 ? 'reveal-delay-2' : '');
    html += `
      <a href="#" class="image-card gallery-item reveal ${delayClass}" data-category="${item.category.toLowerCase()}">
        <img src="${item.image}" alt="${item.title}" loading="lazy">
        <div class="image-overlay">
          <span class="image-category">${item.category}</span>
          <h3 class="image-title">${item.title}</h3>
        </div>
      </a>
    `;
  });
  container.innerHTML = html;
}

function renderJournal(container, items) {
  let html = '';
  items.forEach((item, index) => {
    const isLeft = index % 2 === 0;
    const revealClass = isLeft ? 'reveal-left' : 'reveal-right';
    html += `
      <article class="${revealClass}">
        <a href="${item.link}" class="image-card" style="aspect-ratio: 16/9; display: block;">
          <img src="${item.image}" alt="${item.title}" loading="lazy">
        </a>
        <div style="padding: var(--space-sm) 0;">
          <span class="text-accent" style="font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em;">${item.category} • ${item.date}</span>
          <h3 style="margin: 0.5rem 0;">${item.title}</h3>
          <p>${item.excerpt}</p>
          <a href="${item.link}" class="btn" style="padding: 0.5rem 1rem;">Read Post</a>
        </div>
      </article>
    `;
  });
  container.innerHTML = html;
}

function rebindCursorEvents() {
  const cursor = document.querySelector('.cursor');
  if (!cursor) return;
  
  const newElements = document.querySelectorAll('#gallery-grid a, #journal-grid a, #journal-grid button, #gallery-grid .image-card, #journal-grid .image-card');
  newElements.forEach(el => {
    // avoid binding twice if possible, but safe enough for now
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}


// Custom Cursor
function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.classList.add('cursor');
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  const hoverElements = document.querySelectorAll('a, button, .image-card');
  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}

// Mobile Menu
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const body = document.body;

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      body.classList.toggle('menu-open');
    });
  }
}

// Header Scroll Effect
function initHeaderScroll() {
  const header = document.querySelector('.header');
  
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}
