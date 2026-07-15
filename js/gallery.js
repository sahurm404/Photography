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

  const lightboxImg = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  
  const galleryImages = document.querySelectorAll('.gallery-item img');
  let currentIndex = 0;

  // Open Lightbox
  galleryImages.forEach((img, index) => {
    img.parentElement.addEventListener('click', (e) => {
      e.preventDefault();
      currentIndex = index;
      openLightbox(img.src);
    });
  });

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    // skip hidden images (filtered out)
    while(galleryImages[currentIndex].closest('.gallery-item').style.display === 'none') {
        currentIndex = (currentIndex + 1) % galleryImages.length;
    }
    lightboxImg.src = galleryImages[currentIndex].src;
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    // skip hidden images (filtered out)
    while(galleryImages[currentIndex].closest('.gallery-item').style.display === 'none') {
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    }
    lightboxImg.src = galleryImages[currentIndex].src;
  }

  // Event Listeners
  if(closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if(nextBtn) nextBtn.addEventListener('click', showNext);
  if(prevBtn) prevBtn.addEventListener('click', showPrev);

  // Close on outside click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}
