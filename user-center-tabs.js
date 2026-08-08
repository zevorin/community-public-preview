(() => {
  const coverVideo = document.querySelector('[data-user-cover-video]');
  if (!coverVideo) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let coverIsVisible = true;

  const syncCoverPlayback = () => {
    const shouldPlay = !reduceMotion && !document.hidden && coverIsVisible;
    if (!shouldPlay) {
      coverVideo.pause();
      return;
    }

    void coverVideo.play().catch((error) => {
      console.warn('用户中心背景视频自动播放失败，已保留封面图。', error);
    });
  };

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      coverIsVisible = entry.isIntersecting;
      syncCoverPlayback();
    }, { threshold: 0.05 });
    observer.observe(coverVideo);
  } else {
    syncCoverPlayback();
  }

  document.addEventListener('visibilitychange', syncCoverPlayback);
  window.addEventListener('pagehide', () => coverVideo.pause());
  window.addEventListener('pageshow', syncCoverPlayback);
})();

(() => {
  const page = document.querySelector('.user-center-page');
  const nav = page?.querySelector('.profile-anchor-nav');

  if (!page || !nav) return;

  const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const panels = new Map(
    links
      .map((link) => {
        const id = link.getAttribute('href')?.slice(1);
        return id ? [id, document.getElementById(id)] : null;
      })
      .filter((entry) => entry?.[1])
  );
  const defaultPanelId = 'creation-records';

  const activatePanel = (requestedId, options = {}) => {
    const { updateUrl = false, preserveScroll = false } = options;
    const panelId = panels.has(requestedId) ? requestedId : defaultPanelId;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    page.classList.add('profile-tabs-ready');

    links.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${panelId}`;
      link.classList.toggle('is-active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    });

    panels.forEach((panel, id) => {
      panel.classList.toggle('is-active-panel', id === panelId);
    });

    if (updateUrl) {
      history.replaceState(history.state, '', `#${panelId}`);
    }

    if (preserveScroll) {
      requestAnimationFrame(() => window.scrollTo(scrollX, scrollY));
    }
  };

  const initialPanelId = window.location.hash.slice(1);
  activatePanel(initialPanelId);

  nav.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || !nav.contains(link)) return;

    const panelId = link.getAttribute('href')?.slice(1);
    if (!panelId || !panels.has(panelId)) return;

    event.preventDefault();
    activatePanel(panelId, { updateUrl: true, preserveScroll: true });
    link.focus({ preventScroll: true });
  });

  window.addEventListener('popstate', () => {
    activatePanel(window.location.hash.slice(1));
  });
})();

(() => {
  const favoriteModals = Array.from(document.querySelectorAll('.profile-favorite-detail-modal'));
  if (!favoriteModals.length) return;

  const updateGalleryCounter = (dialog, currentIndex, total) => {
    const counter = dialog.querySelector('.case-detail-media-badge');
    if (!counter || total < 1) return;
    counter.textContent = `${currentIndex + 1}/${total}`;
    counter.setAttribute('aria-label', `第 ${currentIndex + 1} 张，共 ${total} 张`);
  };

  favoriteModals.forEach((modal) => {
    const thumbs = Array.from(modal.querySelectorAll('.case-thumb'));

    thumbs.forEach((thumb) => {
      thumb.setAttribute('aria-pressed', String(thumb.classList.contains('is-active')));

      thumb.addEventListener('click', async () => {
        const target = modal.querySelector('.case-gallery-main');
        const viewport = target?.closest('.case-detail-viewport');
        const nextSrc = thumb.dataset.src;
        if (!target || !viewport || !nextSrc || viewport.dataset.galleryAnimating === 'true') return;

        const currentThumb = thumbs.find((item) => item.classList.contains('is-active'));
        if (currentThumb === thumb) return;

        const currentIndex = Math.max(0, thumbs.indexOf(currentThumb));
        const nextIndex = thumbs.indexOf(thumb);
        thumbs.forEach((item) => {
          const isActive = item === thumb;
          item.classList.toggle('is-active', isActive);
          item.setAttribute('aria-pressed', String(isActive));
        });
        updateGalleryCounter(modal, nextIndex, thumbs.length);

        const incoming = target.cloneNode();
        incoming.src = nextSrc;
        incoming.classList.add('case-gallery-main-next');

        try {
          await incoming.decode();
        } catch {
          // The browser can still render the image after a decode miss.
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          target.src = nextSrc;
          return;
        }

        const direction = nextIndex >= currentIndex ? 1 : -1;
        const timing = {
          duration: 460,
          easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
          fill: 'both'
        };

        viewport.dataset.galleryAnimating = 'true';
        viewport.append(incoming);
        const outgoingAnimation = target.animate([
          { transform: 'translate3d(0, 0, 0)' },
          { transform: `translate3d(${-100 * direction}%, 0, 0)` }
        ], timing);
        const incomingAnimation = incoming.animate([
          { transform: `translate3d(${100 * direction}%, 0, 0)` },
          { transform: 'translate3d(0, 0, 0)' }
        ], timing);

        await Promise.allSettled([outgoingAnimation.finished, incomingAnimation.finished]);
        target.src = nextSrc;
        outgoingAnimation.cancel();
        await new Promise((resolve) => {
          window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
        });
        incoming.remove();
        incomingAnimation.cancel();
        delete viewport.dataset.galleryAnimating;
      });
    });
  });

  let closeTimer = 0;
  const finishClose = (modal) => {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    modal.classList.add('is-closed');
    modal.classList.remove('is-closing');
    window.location.replace('#favorites');
    window.requestAnimationFrame(() => {
      window.scrollTo(scrollX, scrollY);
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
  };

  const closeFavoriteModal = (modal) => {
    if (!modal || modal.classList.contains('is-closing')) return;
    modal.querySelector('video')?.pause();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishClose(modal);
      return;
    }

    modal.classList.add('is-closing');
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => finishClose(modal), 240);
  };

  document.querySelectorAll('a[href^="#profile-favorite-detail-"]').forEach((trigger) => {
    trigger.addEventListener('click', () => document.querySelector(trigger.hash)?.classList.remove('is-closed'));
  });

  favoriteModals.forEach((modal) => {
    modal.querySelectorAll('.case-detail-close, .modal-backdrop').forEach((control) => {
      control.addEventListener('click', (event) => {
        if (!modal.matches(':target') && !modal.classList.contains('is-closing')) return;
        event.preventDefault();
        closeFavoriteModal(modal);
      });
    });
  });

  window.addEventListener('hashchange', () => {
    if (!window.location.hash.startsWith('#profile-favorite-detail-')) return;
    document.querySelector(window.location.hash)?.classList.remove('is-closed');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const activeModal = document.querySelector('.profile-favorite-detail-modal:target');
    if (!activeModal) return;
    event.preventDefault();
    closeFavoriteModal(activeModal);
  });
})();
