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
