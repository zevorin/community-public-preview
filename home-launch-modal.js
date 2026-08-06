(() => {
  const modal = document.querySelector("[data-home-launch-modal]");
  if (!modal) return;

  const DAY_KEY = "duoyuan-home-launch-hidden-date";
  const forceShow = new URLSearchParams(window.location.search).get("showLaunch") === "1";
  const tabs = Array.from(modal.querySelectorAll("[data-home-launch-tab]"));
  const panelImage = modal.querySelector("[data-home-launch-image]");
  const panelTitle = modal.querySelector("[data-home-launch-title]");
  const panelDescription = modal.querySelector("[data-home-launch-description]");
  const panelTag = modal.querySelector("[data-home-launch-tag]");
  const panelCta = modal.querySelector("[data-home-launch-cta]");
  const panel = modal.querySelector("#home-launch-panel");
  let previousFocus = null;
  let panelAnimationTimer = 0;
  let panelAnimationFrame = 0;

  tabs.forEach((tab) => {
    if (!tab.dataset.image) return;
    const image = new Image();
    image.decoding = "async";
    image.src = tab.dataset.image;
  });

  const today = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getStorage = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  };

  const setStorage = (key, value) => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      // The popup still works when storage is unavailable.
    }
  };

  const shouldStayHidden = () => !forceShow && getStorage(DAY_KEY) === today();

  const animatePanelSwitch = () => {
    if (!panel) return;
    window.clearTimeout(panelAnimationTimer);
    window.cancelAnimationFrame(panelAnimationFrame);
    panel.classList.remove("is-switching");
    panelAnimationFrame = window.requestAnimationFrame(() => {
      panel.classList.add("is-switching");
      panelAnimationTimer = window.setTimeout(() => {
        panel.classList.remove("is-switching");
      }, 360);
    });
  };

  const selectTab = (tab) => {
    if (!tab || !panelImage || !panelTitle || !panelDescription || !panelTag || !panelCta) return;

    const previousTab = tabs.find((item) => item.classList.contains("is-active"));
    const shouldAnimate = Boolean(previousTab && previousTab !== tab && !modal.hidden);

    tabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
      item.tabIndex = isActive ? 0 : -1;
    });

    panelImage.src = tab.dataset.image || panelImage.src;
    panelImage.alt = tab.dataset.title || "上线功能介绍";
    panelTitle.textContent = tab.dataset.title || "多元拾光";
    panelDescription.textContent = tab.dataset.description || "";
    panelTag.textContent = tab.dataset.tag || "社区活动";
    panelCta.href = tab.dataset.href || "#";

    if (shouldAnimate) animatePanelSwitch();
  };

  const hide = (mode = "close") => {
    if (mode === "today") {
      setStorage(DAY_KEY, today());
    }

    modal.classList.add("is-closing");
    window.setTimeout(() => {
      modal.hidden = true;
      modal.classList.remove("is-visible", "is-closing");
      document.body.classList.remove("has-home-launch-modal");
      previousFocus?.focus?.();
    }, 260);
  };

  const show = () => {
    if (shouldStayHidden()) return;
    previousFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("has-home-launch-modal");
    requestAnimationFrame(() => {
      modal.classList.add("is-visible");
      modal.querySelector(".home-launch-icon-close")?.focus({ preventScroll: true });
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectTab(tab));
    tab.addEventListener("keydown", (event) => {
      if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const direction = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1;
      const nextTab = tabs[(index + direction + tabs.length) % tabs.length];
      selectTab(nextTab);
      nextTab.focus();
    });
  });

  modal.querySelectorAll("[data-home-launch-dismiss]").forEach((button) => {
    button.addEventListener("click", () => hide(button.dataset.homeLaunchDismiss));
  });

  panelCta?.addEventListener("click", () => hide("close"));

  document.addEventListener("keydown", (event) => {
    if (modal.hidden) return;
    if (event.key === "Escape") {
      event.preventDefault();
      hide("close");
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = Array.from(modal.querySelectorAll("button:not([tabindex='-1']), a[href]"))
      .filter((element) => !element.hasAttribute("disabled") && element.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  selectTab(tabs[0]);
  show();
})();
