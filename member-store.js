(() => {
  const page = document.querySelector(".member-store-page");
  const title = document.querySelector("[data-member-store-hero-split]");
  const hero = document.querySelector(".member-store-hero");
  const heroVisual = document.querySelector(".member-store-hero-visual");
  const walletPoints = document.querySelector(".member-store-wallet strong");
  const productGroups = Array.from(document.querySelectorAll("[data-ai-store-group]"));
  const productCards = Array.from(document.querySelectorAll("[data-ai-store-product]"));
  const particlesContainer = document.querySelector("[data-member-store-particles]");
  const heroPAG = document.querySelector("[data-member-store-pag]");
  const heroPAGCanvas = heroPAG?.querySelector("[data-member-store-pag-canvas]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LIBPAG_VERSION = "4.5.85";
  const LIBPAG_BASE_URL = `https://cdn.jsdelivr.net/npm/libpag@${LIBPAG_VERSION}/lib/`;
  let heroPAGView = null;
  let heroPAGFile = null;
  let heroPAGInitPromise = null;
  let heroIsVisible = true;

  const shouldPlayHeroPAG = () => !reduceMotion && !document.hidden && heroIsVisible;

  const initHeroPAG = () => {
    if (!heroPAG || !heroPAGCanvas || reduceMotion) return Promise.resolve();
    if (heroPAGInitPromise) return heroPAGInitPromise;

    heroPAG.dataset.pagState = "loading";
    heroPAGInitPromise = Promise.all([
      import(`${LIBPAG_BASE_URL}libpag.esm.js`).then(({ PAGInit }) => PAGInit({
        locateFile: (file) => `${LIBPAG_BASE_URL}${file}`
      })),
      fetch(new URL(heroPAG.dataset.pagSrc, document.baseURI))
    ])
      .then(async ([PAG, response]) => {
        if (!response.ok) throw new Error(`PAG 文件加载失败（HTTP ${response.status}）`);

        heroPAGFile = await PAG.PAGFile.load(await response.arrayBuffer());
        heroPAGCanvas.width = heroPAGFile.width();
        heroPAGCanvas.height = heroPAGFile.height();
        heroPAGView = await PAG.PAGView.init(heroPAGFile, heroPAGCanvas);
        if (!heroPAGView) throw new Error("PAGView 初始化失败");

        heroPAGView.setRepeatCount(0);
        heroPAGView.setMaxFrameRate(30);
        heroPAG.dataset.pagState = "ready";
        if (shouldPlayHeroPAG()) await heroPAGView.play();
      })
      .catch((error) => {
        heroPAGView?.destroy();
        heroPAGView = null;
        heroPAGFile?.destroy();
        heroPAGFile = null;
        heroPAG.dataset.pagState = "fallback";
        console.warn("商城 PAG 首图加载失败，已回退到静态背景。", error);
      });

    return heroPAGInitPromise;
  };

  const syncHeroPAGPlayback = () => {
    if (!heroPAG || reduceMotion) return;

    if (!shouldPlayHeroPAG()) {
      void heroPAGView?.pause().catch((error) => {
        console.warn("商城 PAG 首图暂停失败。", error);
      });
      return;
    }

    if (!heroPAGView) {
      void initHeroPAG();
      return;
    }

    void heroPAGView.play().catch((error) => {
      console.warn("商城 PAG 首图恢复失败。", error);
    });
  };

  if (heroPAG) {
    if (reduceMotion) {
      heroPAG.dataset.pagState = "reduced-motion";
    } else if ("IntersectionObserver" in window) {
      const heroPAGObserver = new IntersectionObserver(([entry]) => {
        heroIsVisible = entry.isIntersecting;
        syncHeroPAGPlayback();
      }, { threshold: 0.01 });
      heroPAGObserver.observe(heroPAG);
    } else {
      syncHeroPAGPlayback();
    }

    document.addEventListener("visibilitychange", syncHeroPAGPlayback);
    window.addEventListener("pagehide", (event) => {
      if (event.persisted) {
        void heroPAGView?.pause();
        return;
      }
      heroPAGView?.destroy();
      heroPAGView = null;
      heroPAGFile?.destroy();
      heroPAGFile = null;
    }, { once: true });
    window.addEventListener("pageshow", (event) => {
      if (event.persisted) syncHeroPAGPlayback();
    });
  }

  if (page && !reduceMotion) {
    page.classList.add("is-motion-ready", "has-reveal-motion");

    requestAnimationFrame(() => {
      requestAnimationFrame(() => page.classList.add("is-entered"));
    });
  } else if (page) {
    page.classList.add("is-entered");
  }

  if (title && !reduceMotion && !title.classList.contains("is-split-ready")) {
    let characterIndex = 0;

    const splitTextNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();

        Array.from(node.textContent).forEach((character) => {
          const span = document.createElement("span");
          span.className = character === " " ? "member-store-hero-title-space" : "member-store-hero-title-char";
          span.style.setProperty("--member-store-char-index", characterIndex++);
          span.setAttribute("aria-hidden", "true");
          span.textContent = character === " " ? "\u00a0" : character;
          fragment.appendChild(span);
        });

        node.replaceWith(fragment);
        return;
      }

      Array.from(node.childNodes).forEach(splitTextNode);
    };

    Array.from(title.childNodes).forEach(splitTextNode);
    title.classList.add("is-split-ready");
  }

  productGroups.forEach((group) => {
    const cards = Array.from(group.querySelectorAll("[data-ai-store-product]"));
    cards.forEach((card, index) => card.style.setProperty("--member-store-card-index", index));
    group.classList.add("is-in-view");
  });

  if (walletPoints && !reduceMotion) {
    const targetValue = Number.parseInt(walletPoints.textContent.replace(/\D/g, ""), 10);

    if (Number.isFinite(targetValue)) {
      const duration = 920;
      const delay = 480;
      let startTime;

      const updatePoints = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        if (elapsed < delay) {
          walletPoints.textContent = "0";
          requestAnimationFrame(updatePoints);
          return;
        }

        const progress = Math.min((elapsed - delay) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 4);
        walletPoints.textContent = Math.round(targetValue * easedProgress).toLocaleString("zh-CN");

        if (progress < 1) requestAnimationFrame(updatePoints);
      };

      requestAnimationFrame(updatePoints);
    }
  }

  if (hero && heroVisual && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();
      const normalizedX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const normalizedY = (event.clientY - bounds.top) / bounds.height - 0.5;
      heroVisual.style.setProperty("--member-store-hero-shift-x", `${normalizedX * 10}px`);
      heroVisual.style.setProperty("--member-store-hero-shift-y", `${normalizedY * 7}px`);
    });

    hero.addEventListener("pointerleave", () => {
      heroVisual.style.setProperty("--member-store-hero-shift-x", "0px");
      heroVisual.style.setProperty("--member-store-hero-shift-y", "0px");
    });
  }

  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    productCards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const bounds = card.getBoundingClientRect();
        const pointerX = (event.clientX - bounds.left) / bounds.width;
        const pointerY = (event.clientY - bounds.top) / bounds.height;
        card.style.setProperty("--member-store-pointer-x", `${pointerX * 100}%`);
        card.style.setProperty("--member-store-pointer-y", `${pointerY * 100}%`);
        card.style.setProperty("--member-store-card-rotate-x", `${(0.5 - pointerY) * 1.8}deg`);
        card.style.setProperty("--member-store-card-rotate-y", `${(pointerX - 0.5) * 2.2}deg`);
      });

      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--member-store-card-rotate-x", "0deg");
        card.style.setProperty("--member-store-card-rotate-y", "0deg");
      });
    });
  }

  if (particlesContainer && !reduceMotion && particlesContainer.dataset.particlesReady !== "true") {
    particlesContainer.dataset.particlesReady = "true";

    import("./reactbits-particles.js?v=20260728-banner-particles-v4")
      .then(({ createReactBitsParticles }) => {
        createReactBitsParticles(particlesContainer, {
          particleCount: 300,
          particleSpread: 11,
          speed: 0.12,
          particleColors: ["#ffffff", "#f1c968", "#d8aa52"],
          moveParticlesOnHover: false,
          alphaParticles: true,
          particleBaseSize: 78,
          sizeRandomness: 0.55,
          minParticleSize: 1.4,
          maxParticleSize: 4.8,
          cameraDistance: 20,
          disableRotation: false,
          horizontalScale: 0.92,
          pixelRatio: 1
        });
      })
      .catch(() => {
        particlesContainer.dataset.particlesReady = "error";
      });
  }
})();
