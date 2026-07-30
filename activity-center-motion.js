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

  const items = [];
  const prepare = (element, type, delay) => {
    if (!element) return;
    element.classList.add('activity-enter-item', `activity-enter-${type}`);
    element.style.setProperty('--activity-enter-delay', `${delay}ms`);
    items.push(element);
  };

  prepare(banner, 'banner', 40);
  currentCards.forEach((card, index) => {
    prepare(card, 'card', 150 + Math.min(index, 4) * 80);
  });
  prepare(historyHeading, 'heading', 0);
  historyCards.forEach((card, index) => {
    prepare(card, 'card', 90 + Math.min(index, 4) * 80);
  });

  if (!items.length) return;

  const reveal = (element) => {
    element.classList.add('is-activity-entered');
  };
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  page.classList.add('activity-motion-ready');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    items.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -28px',
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      items.forEach((item) => observer.observe(item));
    });
  });
})();
