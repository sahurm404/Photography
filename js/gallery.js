// js/gallery.js

document.addEventListener('DOMContentLoaded', () => {
  initGalleryFilters();
  initLightbox();
});

function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length === 0 || galleryItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active to clicked
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'block';
          // Small timeout for animation
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 400); // match transition slow
        }
      });
    });
  });
}

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  // Clear existing listeners to prevent duplicates if called multiple times
  const newLightbox = lightbox.cloneNode(true);
  lightbox.parentNode.replaceChild(newLightbox, lightbox);
  const lb = document.getElementById('lightbox');

  const lightboxImg = lb.querySelector('img');
  const closeBtn = lb.querySelector('.lightbox-close');
  const prevBtn = lb.querySelector('.lightbox-prev');
  const nextBtn = lb.querySelector('.lightbox-next');
  
  const galleryItems = document.querySelectorAll('.gallery-item');
  let currentAlbum = []; // Array of image URLs
  let currentIndex = 0;

  // Open Lightbox
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      
      const albumData = item.getAttribute('data-album');
      if (albumData) {
        currentAlbum = JSON.parse(albumData);
        currentIndex = 0;
      } else {
        // Build global gallery of single images up to this point?
        // Or just act as a single image. The user asked for mini-albums.
        // For single items, let's keep them in a global array of singles, or just isolated to 1.
        // To keep it simple and match standard behavior, if it's a single image, it's an album of 1.
        const img = item.querySelector('img');
        currentAlbum = [img.src];
        currentIndex = 0;
      }
      
      // Update UI for prev/next buttons
      if (currentAlbum.length <= 1) {
        if(prevBtn) prevBtn.style.display = 'none';
        if(nextBtn) nextBtn.style.display = 'none';
      } else {
        if(prevBtn) prevBtn.style.display = 'block';
        if(nextBtn) nextBtn.style.display = 'block';
      }

      openLightbox(currentAlbum[currentIndex]);
    });
  });

  function openLightbox(src) {
    lightboxImg.src = src;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  function closeLightbox() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNext() {
    if (currentAlbum.length <= 1) return;
    currentIndex = (currentIndex + 1) % currentAlbum.length;
    lightboxImg.src = currentAlbum[currentIndex];
  }

  function showPrev() {
    if (currentAlbum.length <= 1) return;
    currentIndex = (currentIndex - 1 + currentAlbum.length) % currentAlbum.length;
    lightboxImg.src = currentAlbum[currentIndex];
  }

  // Event Listeners
  if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if(nextBtn) nextBtn.addEventListener('click', showNext);
  if(prevBtn) prevBtn.addEventListener('click', showPrev);

  // Close on outside click
  lb.addEventListener('click', (e) => {
    if (e.target === lb) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  // Need to use named function to remove listener if called multiple times, 
  // but since we replace lightbox node, body listener might stack.
  // Instead, attach to document but check if lb is active.
  // It's safe to just attach once, but if initLightbox is called multiple times, we'll get multiple document listeners.
  // We'll add a flag to window to prevent multiple keydown listeners.
  if (!window.lightboxKeydownBound) {
    document.addEventListener('keydown', (e) => {
      const activeLb = document.getElementById('lightbox');
      if (!activeLb || !activeLb.classList.contains('active')) return;
      
      if (e.key === 'Escape') activeLb.querySelector('.lightbox-close')?.click();
      if (e.key === 'ArrowRight') activeLb.querySelector('.lightbox-next')?.click();
      if (e.key === 'ArrowLeft') activeLb.querySelector('.lightbox-prev')?.click();
    });
    window.lightboxKeydownBound = true;
  }
}

