(() => {
  const root = document.documentElement;
  const back = document.querySelector('.campaign-list-back');
  const immediateItems = [];
  const observedGroups = [];
  const preparedItems = new Set();

  const prepare = (elements, variant = 'rise', start = 0, step = 0, opacity = 0.46) => {
    const prepared = [];
    Array.from(elements || []).filter(Boolean).forEach((element, index) => {
      element.classList.add('campaign-motion-item', `campaign-motion-${variant}`);
      element.style.setProperty('--campaign-motion-delay', `${start + index * step}ms`);
      element.style.setProperty('--campaign-motion-opacity', String(opacity));
      preparedItems.add(element);
      prepared.push(element);
    });
    return prepared;
  };

  const observeGroup = (trigger, itemGroups) => {
    if (!trigger) return;
    const items = itemGroups.flatMap((group) => prepare(
      group.elements,
      group.variant,
      group.start,
      group.step,
      group.opacity,
    ));
    if (items.length) observedGroups.push({ trigger, items });
  };

  const promptHero = document.querySelector('.prompt-campaign-hero');
  const newUserHero = document.querySelector('.new-user-detail-hero');
  const sevenDayHero = document.querySelector('.seven-day-hero');
  const detailHero = document.querySelector('.campaign-detail-page .campaign-hero');

  if (promptHero) {
    immediateItems.push(
      ...prepare([back], 'soft', 40, 0, 0.28),
      ...prepare([promptHero.querySelector('.campaign-hero-copy')], 'from-left', 130, 0, 0.24),
      ...prepare([promptHero.querySelector('.campaign-hero-media')], 'from-right', 210, 0, 0.28),
    );

    document.querySelectorAll('.activity-article > .activity-section').forEach((section) => {
      const heading = section.querySelector(':scope > .section-head');
      const taskCards = section.querySelectorAll(':scope > .task-list > .task-card');
      const submissionCards = section.querySelectorAll(':scope > .submission-grid > .submission-card');
      const body = section.querySelector(':scope > .desc-body');
      const footerNote = section.querySelector(':scope > .footer-note');
      const groups = [{ elements: [heading], variant: 'from-left', start: 0, step: 0, opacity: 0.5 }];

      if (body) groups.push({ elements: [body], variant: 'rise', start: 90, step: 0, opacity: 0.54 });
      if (taskCards.length) groups.push({ elements: taskCards, variant: 'rise', start: 90, step: 70, opacity: 0.5 });
      if (submissionCards.length) groups.push({ elements: submissionCards, variant: 'rise', start: 90, step: 45, opacity: 0.48 });
      if (footerNote) groups.push({ elements: [footerNote], variant: 'soft', start: 330, step: 0, opacity: 0.58 });
      observeGroup(section, groups);
    });
  }

  if (newUserHero) {
    immediateItems.push(
      ...prepare([back], 'soft', 40, 0, 0.28),
      ...prepare([newUserHero.querySelector('.new-user-summary')], 'from-left', 130, 0, 0.24),
      ...prepare([newUserHero.querySelector('.new-user-cover')], 'from-right', 210, 0, 0.28),
    );

    const description = document.querySelector('.new-user-description');
    observeGroup(description, [
      { elements: [description?.querySelector('.new-user-section-head')], variant: 'from-left', start: 0, step: 0, opacity: 0.5 },
      { elements: [description?.querySelector('.new-user-description-body')], variant: 'rise', start: 90, step: 0, opacity: 0.54 },
    ]);

    const tasks = document.querySelector('.new-user-tasks');
    observeGroup(tasks, [
      { elements: [tasks?.querySelector('.new-user-section-head')], variant: 'from-left', start: 0, step: 0, opacity: 0.5 },
      { elements: tasks?.querySelectorAll('.new-user-task-card') || [], variant: 'rise', start: 90, step: 70, opacity: 0.5 },
    ]);
  }

  if (sevenDayHero) {
    immediateItems.push(
      ...prepare([back], 'soft', 40, 0, 0.28),
      ...prepare([sevenDayHero.querySelector('.seven-day-hero-copy')], 'from-left', 130, 0, 0.24),
      ...prepare([sevenDayHero.querySelector('.seven-day-hero-art')], 'from-right', 210, 0, 0.28),
    );

    const rewards = document.querySelector('.seven-day-reward-rhythm');
    observeGroup(rewards, [
      { elements: [rewards], variant: 'rise', start: 0, step: 0, opacity: 0.52 },
    ]);

    const route = document.querySelector('.seven-day-route');
    observeGroup(route, [
      { elements: [route?.querySelector('.seven-day-route-head')], variant: 'from-left', start: 0, step: 0, opacity: 0.5 },
      { elements: route?.querySelectorAll('.seven-day-tab') || [], variant: 'soft', start: 90, step: 35, opacity: 0.52 },
      { elements: [route?.querySelector('.seven-day-stage')], variant: 'rise', start: 340, step: 0, opacity: 0.5 },
    ]);

    const close = document.querySelector('.seven-day-close');
    observeGroup(close, [
      { elements: [close], variant: 'soft', start: 0, step: 0, opacity: 0.56 },
    ]);
  }

  if (detailHero) {
    const heroCopy = detailHero.querySelector('.campaign-hero-copy');
    immediateItems.push(
      ...prepare([back], 'soft', 40, 0, 0.28),
      ...prepare([
        heroCopy?.querySelector('.campaign-status-line'),
        heroCopy?.querySelector('h1'),
        heroCopy?.querySelector('.campaign-hero-lede'),
        heroCopy?.querySelector('.campaign-hero-actions'),
      ], 'from-left', 100, 65, 0.22),
      ...prepare([detailHero.querySelector('.campaign-hero-media')], 'from-right', 180, 0, 0.28),
      ...prepare(document.querySelectorAll('.campaign-facts > *'), 'soft', 390, 48, 0.42),
    );

    const guide = document.querySelector('.campaign-guide');
    observeGroup(guide, [
      { elements: [guide?.querySelector('.campaign-guide-head')], variant: 'from-left', start: 0, step: 0, opacity: 0.46 },
      { elements: [guide?.querySelector('.campaign-overview-copy')], variant: 'rise', start: 90, step: 0, opacity: 0.5 },
      { elements: guide?.querySelectorAll('.campaign-requirements > div') || [], variant: 'soft', start: 160, step: 48, opacity: 0.5 },
      { elements: [guide?.querySelector('.campaign-path-block > h3')], variant: 'from-left', start: 260, step: 0, opacity: 0.5 },
      { elements: guide?.querySelectorAll('.campaign-path > li') || [], variant: 'soft', start: 330, step: 60, opacity: 0.5 },
    ]);

    const tasks = document.querySelector('.campaign-tasks');
    observeGroup(tasks, [
      { elements: [tasks?.querySelector('.campaign-section-heading')], variant: 'from-left', start: 0, step: 0, opacity: 0.46 },
      { elements: tasks?.querySelectorAll('.campaign-task') || [], variant: 'rise', start: 100, step: 75, opacity: 0.48 },
    ]);

    const rules = document.querySelector('.campaign-rules');
    observeGroup(rules, [
      { elements: [rules?.querySelector('.campaign-section-heading')], variant: 'from-left', start: 0, step: 0, opacity: 0.46 },
      { elements: rules?.querySelectorAll('.campaign-rule-groups > section') || [], variant: 'rise', start: 100, step: 80, opacity: 0.5 },
    ]);

    const submissions = document.querySelector('.campaign-submissions');
    observeGroup(submissions, [
      { elements: [submissions?.querySelector('.campaign-submissions-copy')], variant: 'from-left', start: 0, step: 0, opacity: 0.48 },
      { elements: [submissions?.querySelector('.campaign-button')], variant: 'soft', start: 120, step: 0, opacity: 0.54 },
    ]);

    observedGroups.forEach((group) => {
      group.items.forEach((item) => item.classList.add('campaign-scroll-motion-item'));
    });
  }

  if (!preparedItems.size) return;

  const reveal = (items) => {
    items.forEach((item) => item.classList.add('is-campaign-motion-visible'));
  };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollItems = detailHero
    ? Array.from(document.querySelectorAll('.campaign-scroll-motion-item'))
    : [];
  const useScrollProgress = Boolean(detailHero && !reduceMotion && scrollItems.length);

  root.classList.toggle('campaign-scroll-progress-ready', useScrollProgress);

  if (useScrollProgress) {
    let scrollFrame = 0;
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const updateScrollProgress = () => {
      const viewportHeight = window.innerHeight;
      const revealStart = viewportHeight * .96;
      const revealEnd = viewportHeight * .56;

      scrollItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const progress = clamp((revealStart - rect.top) / (revealStart - revealEnd), 0, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const isFromLeft = item.classList.contains('campaign-motion-from-left');
        const isFromRight = item.classList.contains('campaign-motion-from-right');
        const isSoft = item.classList.contains('campaign-motion-soft');
        const baseX = isFromLeft ? -24 : (isFromRight ? 24 : 0);
        const baseY = isFromLeft || isFromRight ? 10 : (isSoft ? 16 : 30);

        item.style.setProperty('--campaign-scroll-opacity', String(.08 + .92 * eased));
        item.style.setProperty('--campaign-scroll-x', `${baseX * (1 - eased)}px`);
        item.style.setProperty('--campaign-scroll-y', `${baseY * (1 - eased)}px`);
        item.style.setProperty('--campaign-scroll-scale', String(.985 + .015 * eased));
      });
      scrollFrame = 0;
    };
    const scheduleScrollProgress = () => {
      if (!scrollFrame) {
        scrollFrame = window.requestAnimationFrame(updateScrollProgress);
      }
    };

    window.addEventListener('scroll', scheduleScrollProgress, { passive: true });
    window.addEventListener('resize', scheduleScrollProgress, { passive: true });
    scheduleScrollProgress();
  }

  const path = document.querySelector('.campaign-detail-page .campaign-path');
  if (path && !reduceMotion && 'IntersectionObserver' in window) {
    let pathVisible = false;
    const syncPathMotion = () => {
      path.classList.toggle('is-campaign-flow-running', pathVisible && !document.hidden);
    };
    const pathObserver = new IntersectionObserver((entries) => {
      pathVisible = entries.some((entry) => entry.isIntersecting);
      syncPathMotion();
    }, {
      threshold: 0.35,
      rootMargin: '0px 0px -12%',
    });
    pathObserver.observe(path);
    document.addEventListener('visibilitychange', syncPathMotion);
  }

  root.classList.add('campaign-motion-ready');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveal(Array.from(preparedItems));
    return;
  }

  const groupsByTrigger = new Map(observedGroups.map((group) => [group.trigger, group.items]));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      reveal(groupsByTrigger.get(entry.target) || []);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -28px',
  });

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      reveal(immediateItems);
      if (!useScrollProgress) {
        observedGroups.forEach((group) => observer.observe(group.trigger));
      }
    });
  });
})();
