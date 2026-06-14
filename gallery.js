// Gallery Filter + Lightbox
// Click a photo to open it. Click the photo again (or X, or outside) to close.

(function () {
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  let currentIndex = 0;
  let visibleItems = items.slice(); // filtered list

  // ── FILTER BUTTONS ──────────────────────────────────────────────
  document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.filter;
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.style.display = show ? '' : 'none';
      });
      visibleItems = items.filter(i => i.style.display !== 'none');
    });
  });

  // ── OPEN LIGHTBOX ───────────────────────────────────────────────
  function openLightbox(index) {
    currentIndex = index;
    const item = visibleItems[currentIndex];
    const img = item.querySelector('img');
    const title = item.querySelector('h3')?.textContent || '';
    const desc = item.querySelector('p')?.textContent || '';

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = title + (desc ? ' — ' + desc : '');

    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  // ── CLOSE LIGHTBOX ──────────────────────────────────────────────
  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  // ── NAVIGATE ────────────────────────────────────────────────────
  function showNext() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    openLightbox(currentIndex);
  }

  // ── ATTACH CLICK TO EACH GALLERY ITEM ───────────────────────────
  items.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      visibleItems = items.filter(i => i.style.display !== 'none');
      const idx = visibleItems.indexOf(item);
      if (idx !== -1) openLightbox(idx);
    });
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  // ── CLOSE: X button ─────────────────────────────────────────────
  closeBtn.addEventListener('click', closeLightbox);

  // ── CLOSE: click the photo itself ───────────────────────────────
  lightboxImg.addEventListener('click', closeLightbox);
  lightboxImg.style.cursor = 'zoom-out';

  // ── CLOSE: click the dark backdrop (not the image/buttons) ──────
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // ── NAV BUTTONS ─────────────────────────────────────────────────
  prevBtn.addEventListener('click', e => { e.stopPropagation(); showPrev(); });
  nextBtn.addEventListener('click', e => { e.stopPropagation(); showNext(); });

  // ── KEYBOARD ────────────────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // ── TOUCH SWIPE ─────────────────────────────────────────────────
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? showNext() : showPrev();
  });

})();
