/* ====================================================
   gallery.js – Filter Tabs + Lightbox
   ==================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── FILTER TABS ─────────────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = '';
          item.style.animation = 'fadeIn 0.4s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ─── LIGHTBOX ────────────────────────────────────────
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxCap  = document.getElementById('lightboxCaption');
  const lightboxCnt  = document.getElementById('lightboxCounter');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  if (!lightbox) return;

  // Collect all visible gallery items
  function getVisibleItems() {
    return [...document.querySelectorAll('.gallery-item:not([style*="display: none"])')];
  }

  let currentIndex = 0;

  function openLightbox(index) {
    const items = getVisibleItems();
    if (!items[index]) return;
    currentIndex = index;
    const img = items[index].querySelector('img');
    const cap = items[index].getAttribute('data-caption') || '';
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    if (lightboxCap) lightboxCap.textContent = cap;
    if (lightboxCnt) lightboxCnt.textContent = `${index + 1} / ${items.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  function navigate(dir) {
    const items = getVisibleItems();
    currentIndex = (currentIndex + dir + items.length) % items.length;
    openLightbox(currentIndex);
  }

  // Attach click to all gallery items
  document.querySelectorAll('.gallery-item').forEach((item, idx) => {
    item.addEventListener('click', () => {
      const visibleItems = getVisibleItems();
      const visibleIdx = visibleItems.indexOf(item);
      openLightbox(visibleIdx >= 0 ? visibleIdx : idx);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev)  lightboxPrev.addEventListener('click', () => navigate(-1));
  if (lightboxNext)  lightboxNext.addEventListener('click', () => navigate(1));

  // Close on background click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'ArrowLeft')  navigate(-1);
  });

  // Touch swipe
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
  lightbox.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) navigate(diff > 0 ? 1 : -1);
  });

});
