(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const duration = (time) => reducedMotion.matches ? 0 : time;
  const ease = 'cubic-bezier(.22, 1, .36, 1)';
  const header = $('.site-header');
  const menuToggle = $('.menu-toggle');
  const mainNav = $('#main-nav');

  // Keep scroll work limited to the header progress indicator. Images stay still.
  let scrollFrame = 0;
  let headerScrolled = false;
  const updateScroll = () => {
    scrollFrame = 0;
    const y = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = y > 12;
    if (scrolled !== headerScrolled) {
      header.classList.toggle('scrolled', scrolled);
      headerScrolled = scrolled;
    }
    header.style.setProperty('--scroll-progress', maxScroll > 0 ? y / maxScroll : 0);
  };
  const requestScrollFrame = () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll);
  };
  addEventListener('scroll', requestScrollFrame, { passive: true });
  addEventListener('resize', requestScrollFrame, { passive: true });
  updateScroll();

  const closeMenu = (restoreFocus = false) => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Otevřít menu');
    document.body.classList.remove('menu-open');
    if (restoreFocus) menuToggle.focus();
  };
  menuToggle.addEventListener('click', () => {
    const open = !mainNav.classList.contains('open');
    mainNav.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Zavřít menu' : 'Otevřít menu');
    document.body.classList.toggle('menu-open', open);
  });
  $$('.main-nav a, .brand').forEach((link) => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('click', (event) => {
    if (mainNav.classList.contains('open') && !header.contains(event.target)) closeMenu();
  });
  matchMedia('(min-width: 901px)').addEventListener('change', (event) => {
    if (event.matches) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (!mainNav.classList.contains('open')) return;
    if (event.key === 'Escape') closeMenu(true);
    if (event.key === 'Tab') {
      const elements = [...$$('a', mainNav), menuToggle].filter((el) => el.getClientRects().length);
      const first = elements[0];
      const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });
    $$('.reveal').forEach((element) => revealObserver.observe(element));
    document.documentElement.classList.add('motion-ready');

    const navLinks = $$('.nav-link[href^="#"]');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px' });
    navLinks.forEach((link) => {
      const section = $(link.getAttribute('href'));
      if (section) sectionObserver.observe(section);
    });
  }

  // Animated native details keep their semantics, keyboard support and no-JS fallback.
  const accordionStates = new WeakMap();
  const toggleAccordion = (details, forceOpen) => {
    const current = accordionStates.get(details);
    const open = forceOpen ?? !(current ? current.open : details.open);
    const startHeight = details.getBoundingClientRect().height;
    current?.animation?.cancel();
    const summary = $('summary', details);
    details.open = true;
    details.style.height = '';
    const endHeight = open ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height;
    if (reducedMotion.matches) {
      details.open = open;
      accordionStates.delete(details);
      return;
    }
    const animation = details.animate(
      [{ height: startHeight + 'px' }, { height: endHeight + 'px' }],
      { duration: 420, easing: ease }
    );
    accordionStates.set(details, { animation, open });
    animation.onfinish = () => {
      details.open = open;
      accordionStates.delete(details);
      requestScrollFrame();
    };
  };
  $$('.accordion').forEach((details) => {
    $('summary', details).addEventListener('click', (event) => {
      event.preventDefault();
      toggleAccordion(details);
    });
  });
  $('[data-show-services]')?.addEventListener('click', () => {
    toggleAccordion($('#dalsi-sluzby'), true);
  });

  const closingDialogs = new WeakSet();
  const closeDialog = (dialog, immediately = false) => {
    if (!dialog.open || closingDialogs.has(dialog)) return;
    if (immediately || reducedMotion.matches) {
      dialog.close();
      return;
    }
    closingDialogs.add(dialog);
    dialog.animate(
      [{ opacity: 1, transform: 'translateY(0) scale(1)' }, { opacity: 0, transform: 'translateY(12px) scale(.985)' }],
      { duration: 180, easing: 'ease-in' }
    ).finished.catch(() => {}).then(() => {
      dialog.close();
      closingDialogs.delete(dialog);
    });
  };
  $$('dialog').forEach((dialog) => {
    $('[data-close-dialog]', dialog).addEventListener('click', () => closeDialog(dialog));
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeDialog(dialog);
    });
    let backdropPointerDown = false;
    dialog.addEventListener('pointerdown', (event) => {
      const rect = dialog.getBoundingClientRect();
      backdropPointerDown = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    });
    dialog.addEventListener('click', (event) => {
      const rect = dialog.getBoundingClientRect();
      const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
      if (backdropPointerDown && outside) closeDialog(dialog);
      backdropPointerDown = false;
    });
  });

  const track = $('#projects-track');
  const projects = track ? $$('.project', track) : [];
  const scrollButtons = $$('[data-gallery-scroll]');
  const updateGalleryControls = () => {
    if (!track || scrollButtons.length < 2) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    scrollButtons[0].disabled = track.scrollLeft <= 2;
    scrollButtons[1].disabled = track.scrollLeft >= maxScroll - 2;
  };
  scrollButtons.forEach((button) => button.addEventListener('click', () => {
    const visible = projects.find((project) => !project.hidden);
    const gap = parseFloat(getComputedStyle(track).columnGap) || 20;
    const distance = visible ? visible.getBoundingClientRect().width + gap : track.clientWidth;
    track.scrollBy({ left: distance * Number(button.dataset.galleryScroll), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }));
  track?.addEventListener('scroll', updateGalleryControls, { passive: true });
  if (track && 'ResizeObserver' in window) new ResizeObserver(updateGalleryControls).observe(track);
  updateGalleryControls();

  let filterRevision = 0;
  let filterAnimation;
  $$('.filter').forEach((button) => button.addEventListener('click', async () => {
    const revision = ++filterRevision;
    const category = button.dataset.filter;
    $$('.filter').forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle('active', active);
      filter.setAttribute('aria-pressed', String(active));
    });
    filterAnimation?.cancel();
    filterAnimation = track.animate([{ opacity: 1 }, { opacity: .15 }], { duration: duration(130), fill: 'forwards' });
    await filterAnimation.finished.catch(() => {});
    if (revision !== filterRevision) return;
    filterAnimation.cancel();
    projects.forEach((project) => {
      project.hidden = category !== 'all' && project.dataset.category !== category;
      if (!project.hidden) project.classList.add('visible');
    });
    track.scrollTo({ left: 0, behavior: 'instant' });
    track.animate([{ opacity: .15, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: duration(450), easing: ease });
    const count = projects.filter((project) => !project.hidden).length;
    $('#gallery-status').textContent = 'Počet zobrazených prostorů: ' + count;
    requestAnimationFrame(updateGalleryControls);
  }));

  const lightbox = $('#lightbox');
  let galleryIndex = 0;
  let galleryItems = [];
  const showGalleryImage = () => {
    const item = galleryItems[galleryIndex];
    const image = $('#lightbox-image');
    image.src = item.href;
    image.alt = $('img', item).alt;
    $('#lightbox-title').textContent = item.dataset.title;
    $('#lightbox-caption').textContent = item.dataset.caption;
    $('#lightbox-count').textContent = String(galleryIndex + 1).padStart(2, '0') + ' / ' + String(galleryItems.length).padStart(2, '0');
    $$('.lightbox-prev, .lightbox-next').forEach((button) => { button.hidden = galleryItems.length < 2; });
    image.animate([{ opacity: .1, transform: 'scale(1.015)' }, { opacity: 1, transform: 'scale(1)' }], { duration: duration(400), easing: ease });
    const nextImage = new Image();
    nextImage.src = galleryItems[(galleryIndex + 1) % galleryItems.length].href;
  };
  const advanceGallery = (direction) => {
    galleryIndex = (galleryIndex + direction + galleryItems.length) % galleryItems.length;
    showGalleryImage();
  };
  $$('[data-gallery]').forEach((link) => link.addEventListener('click', (event) => {
    if (!lightbox || typeof lightbox.showModal !== 'function') return;
    event.preventDefault();
    galleryItems = $$('[data-gallery]').filter((item) => !item.closest('.project').hidden);
    galleryIndex = galleryItems.indexOf(link);
    showGalleryImage();
    lightbox.showModal();
  }));
  $('.lightbox-prev')?.addEventListener('click', () => advanceGallery(-1));
  $('.lightbox-next')?.addEventListener('click', () => advanceGallery(1));
  lightbox?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      advanceGallery(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  let swipeStart = null;
  lightbox?.addEventListener('touchstart', (event) => {
    if (event.touches.length === 1) swipeStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  lightbox?.addEventListener('touchend', (event) => {
    if (!swipeStart || !event.changedTouches.length) return;
    const dx = event.changedTouches[0].clientX - swipeStart.x;
    const dy = event.changedTouches[0].clientY - swipeStart.y;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) advanceGallery(dx < 0 ? 1 : -1);
    swipeStart = null;
  }, { passive: true });

  // A static site prepares a real email; it never pretends a message was sent.
  $('#inquiry-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const type = data.get('type') || 'Nábytek na míru';
    const body = [
      'Dobrý den, mám zájem o: ' + type + '.', '',
      String(data.get('message')).trim(), '',
      'Jméno: ' + String(data.get('name')).trim(),
      'E-mail: ' + String(data.get('email')).trim(),
      'Telefon: ' + (String(data.get('phone')).trim() || 'neuveden'),
      '', 'Děkuji a těším se na domluvu.'
    ].join('\n');
    const email = window.almaraSite?.email || 'info@almara-3.cz';
    const url = 'mailto:' + email + '?subject=' + encodeURIComponent('Poptávka — ' + type) + '&body=' + encodeURIComponent(body);
    const fallback = $('.email-fallback', form);
    fallback.href = url;
    fallback.hidden = false;
    $('.form-status', form).textContent = 'Poptávka je připravená. Dokončete její odeslání ve své e-mailové aplikaci. Pokud se neotevřela, napište nám na ' + email + '. Vyplněné údaje zde zůstávají.';
    window.location.href = url;
  });
  const requestedService = new URLSearchParams(location.search).get('typ');
  const serviceSelect = $('#type');
  if (requestedService && serviceSelect && [...serviceSelect.options].some(option => option.value === requestedService)) serviceSelect.value = requestedService;
  $('#year').textContent = new Date().getFullYear();
})();
