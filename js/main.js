  /* ── Mobile Nav ───────────────────────────── */
  function openMenu() {
    document.getElementById('main-nav').classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    document.getElementById('main-nav').classList.remove('open');
    document.body.style.overflow = '';
  }
  document.querySelectorAll('#main-nav a').forEach(a => a.addEventListener('click', closeMenu));

  /* ── Hero Video Sound ─────────────────────── */
  const heroVideo = document.querySelector('.hero-video');
  const heroSoundToggle = document.querySelector('.hero-sound-toggle');
  if (heroVideo && heroSoundToggle) {
    heroSoundToggle.addEventListener('click', () => {
      heroVideo.muted = !heroVideo.muted;
      if (heroVideo.paused) heroVideo.play().catch(() => {});

      const soundIsOn = !heroVideo.muted;
      heroSoundToggle.setAttribute('aria-pressed', String(soundIsOn));
      heroSoundToggle.setAttribute('aria-label', soundIsOn ? 'Turn hero video sound off' : 'Turn hero video sound on');
      heroSoundToggle.querySelector('i').className = soundIsOn
        ? 'fa-solid fa-volume-high'
        : 'fa-solid fa-volume-xmark';
      heroSoundToggle.querySelector('span').textContent = soundIsOn ? 'Sound Off' : 'Sound On';
    });
  }

  /* ── DJXperience Video Sound ──────────────── */
  const djVideo = document.querySelector('#djxperience video');
  const djSoundToggle = document.querySelector('.dj-sound-toggle');
  if (djVideo && djSoundToggle) {
    djSoundToggle.addEventListener('click', () => {
      djVideo.muted = !djVideo.muted;
      if (djVideo.paused) djVideo.play().catch(() => {});

      const soundIsOn = !djVideo.muted;
      djSoundToggle.setAttribute('aria-pressed', String(soundIsOn));
      djSoundToggle.setAttribute('aria-label', soundIsOn ? 'Turn DJXperience video sound off' : 'Turn DJXperience video sound on');
      djSoundToggle.querySelector('i').className = soundIsOn
        ? 'fa-solid fa-volume-high'
        : 'fa-solid fa-volume-xmark';
      djSoundToggle.querySelector('span').textContent = soundIsOn ? 'Sound Off' : 'Sound On';
    });
  }

  /* ── Video Modal ──────────────────────────── */
  function playVideo() {
    const m = document.getElementById('video-modal');
    const v = document.getElementById('featured-modal-video');
    m.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    v.play();
  }
  function closeVideo() {
    document.getElementById('video-modal').style.display = 'none';
    const v = document.getElementById('featured-modal-video');
    v.pause();
    v.currentTime = 0;
    document.body.style.overflow = '';
  }
  document.getElementById('video-modal').addEventListener('click', function(e) {
    if (e.target === this) closeVideo();
  });

  /* ── Photo & Video Gallery Lightbox ─────── */
  const galleryModal = document.getElementById('gallery-modal');
  const galleryModalContent = galleryModal.querySelector('.gallery-modal-content');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const galleryFilters = document.querySelectorAll('.gallery-filter');
  let activeGalleryFilter = 'all';
  let activeGalleryIndex = 0;

  function closeGalleryItem() {
    const openVideo = galleryModalContent.querySelector('video');
    if (openVideo) openVideo.pause();
    galleryModal.classList.remove('is-open');
    galleryModal.setAttribute('aria-hidden', 'true');
    galleryModalContent.replaceChildren();
    document.body.style.overflow = '';
  }

  function filteredGalleryItems() {
    return galleryItems.filter(item => activeGalleryFilter === 'all' || item.dataset.type === activeGalleryFilter);
  }

  function updateGallery() {
    const matches = filteredGalleryItems();
    galleryItems.forEach(item => {
      const matchesFilter = matches.includes(item);
      item.classList.toggle('is-filtered-out', !matchesFilter);
    });
  }

  function openGalleryItem(item) {
      const visibleItems = filteredGalleryItems();
      activeGalleryIndex = Math.max(0, visibleItems.indexOf(item));
      const isVideo = item.dataset.type === 'video';
      const media = document.createElement(isVideo ? 'video' : 'img');
      media.src = item.dataset.src;
      if (isVideo) {
        media.controls = true;
        media.playsInline = true;
        media.preload = 'auto';
      } else {
        media.alt = item.querySelector('img')?.alt || 'Expanded gallery image';
      }
      galleryModalContent.replaceChildren(media);
      galleryModal.classList.add('is-open');
      galleryModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (isVideo) {
        media.load();
        media.play().catch(() => {
          media.controls = true;
        });
      }
  }

  function stepGallery(direction) {
    const items = filteredGalleryItems();
    activeGalleryIndex = (activeGalleryIndex + direction + items.length) % items.length;
    openGalleryItem(items[activeGalleryIndex]);
  }

  galleryItems.forEach(item => {
    item.addEventListener('click', () => openGalleryItem(item));
  });

  galleryFilters.forEach(filter => filter.addEventListener('click', () => {
    activeGalleryFilter = filter.dataset.filter;
    galleryFilters.forEach(button => button.classList.toggle('is-active', button === filter));
    updateGallery();
  }));
  updateGallery();

  galleryModal.querySelector('.gallery-modal-close').addEventListener('click', closeGalleryItem);
  galleryModal.querySelector('.gallery-modal-prev').addEventListener('click', () => stepGallery(-1));
  galleryModal.querySelector('.gallery-modal-next').addEventListener('click', () => stepGallery(1));
  galleryModal.addEventListener('click', e => {
    if (e.target === galleryModal || e.target === galleryModalContent) closeGalleryItem();
  });
  document.addEventListener('keydown', e => {
    if (!galleryModal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeGalleryItem();
    if (e.key === 'ArrowLeft') stepGallery(-1);
    if (e.key === 'ArrowRight') stepGallery(1);
  });

  /* ── Testimonial Carousel ─────────────────── */
  let currentSlide = 0;
  const MOBILE_BREAK = 768;

  function isMobile() { return window.innerWidth <= MOBILE_BREAK; }

  function initCarousel() {
    const cards = document.querySelectorAll('.testi-card');
    const arrows = document.querySelectorAll('.carousel-arrow');
    if (isMobile()) {
      cards.forEach((c, i) => c.classList.toggle('hidden', i !== currentSlide));
      arrows.forEach(a => a.style.display = 'flex');
    } else {
      cards.forEach(c => c.classList.remove('hidden'));
      arrows.forEach(a => a.style.display = 'none');
      currentSlide = 0;
    }
  }

  function slideCarousel(dir) {
    if (!isMobile()) return;
    const cards = document.querySelectorAll('.testi-card');
    currentSlide = (currentSlide + dir + cards.length) % cards.length;
    initCarousel();
  }

  window.addEventListener('resize', initCarousel);
  initCarousel();

  /* ── Sticky Header ────────────────────────── */
  const header = document.getElementById('header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Full-page Gold Notes ─────────────────── */
  const goldNotes = document.querySelector('.gold-music-notes');
  function sizeGoldNotes() {
    if (goldNotes) {
      const hero = document.getElementById('hero');
      const notesStart = hero.offsetTop + hero.offsetHeight;
      const notesHeight = document.documentElement.scrollHeight - notesStart;
      goldNotes.style.top = `${notesStart}px`;
      goldNotes.style.height = `${notesHeight}px`;
    }
  }
  window.addEventListener('load', sizeGoldNotes);
  window.addEventListener('resize', sizeGoldNotes);
  sizeGoldNotes();
  if (goldNotes && 'ResizeObserver' in window) {
    new ResizeObserver(sizeGoldNotes).observe(document.body);
  }

  /* ── Performer Scroll Reveals ─────────────── */
  const scrollPops = document.querySelectorAll('.scroll-pop');
  if ('IntersectionObserver' in window) {
    const popObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    scrollPops.forEach(pop => popObserver.observe(pop));
  } else {
    scrollPops.forEach(pop => pop.classList.add('is-visible'));
  }
