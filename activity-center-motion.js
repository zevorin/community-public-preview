(() => {
  const page = document.querySelector('.activity-center-page');
  if (!page) return;

  const banner = page.querySelector('.activity-banner');
  const sections = Array.from(page.querySelectorAll('.activity-section'));
  const currentCards = sections[0]
    ? Array.from(sections[0].querySelectorAll('.activity-equal-card'))
    : [];
  const historySection = page.querySelector('.activity-history-section');
  const historyHeading = historySection?.querySelector('.activity-section-head');
  const historyCards = historySection
    ? Array.from(historySection.querySelectorAll('.activity-equal-card'))
    : [];

  const initialItems = [];
  const deferredItems = [];
  const prepare = (element, type, delay) => {
    if (!element) return;
    element.classList.add('activity-enter-item', `activity-enter-${type}`);
    element.style.setProperty('--activity-enter-delay', `${delay}ms`);
    return element;
  };

  const preparedBanner = prepare(banner, 'banner', 20);
  if (preparedBanner) initialItems.push(preparedBanner);

  currentCards.forEach((card, index) => {
    const preparedCard = prepare(card, 'card', 150 + Math.min(index, 4) * 65);
    if (preparedCard) initialItems.push(preparedCard);
  });

  const preparedHistoryHeading = prepare(historyHeading, 'heading', 0);
  if (preparedHistoryHeading) deferredItems.push(preparedHistoryHeading);

  historyCards.forEach((card, index) => {
    const preparedCard = prepare(card, 'card', 80 + Math.min(index, 4) * 70);
    if (preparedCard) deferredItems.push(preparedCard);
  });

  if (!initialItems.length && !deferredItems.length) return;

  const reveal = (element) => {
    const settle = (event) => {
      if (event.target !== element) return;
      element.removeEventListener('animationend', settle);
      element.classList.add('is-activity-settled');
    };
    element.addEventListener('animationend', settle);
    element.classList.add('is-activity-entered');
  };
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  page.classList.add('activity-motion-ready');

  if (prefersReducedMotion) {
    [...initialItems, ...deferredItems].forEach(reveal);
    return;
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      initialItems.forEach(reveal);
    });
  });

  if (!deferredItems.length) return;

  if (!('IntersectionObserver' in window)) {
    deferredItems.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px',
  });

  deferredItems.forEach((item) => observer.observe(item));
})();
