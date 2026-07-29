(() => {
  const page = document.querySelector(".member-store-page");
  const title = document.querySelector("[data-member-store-hero-split]");
  const hero = document.querySelector(".member-store-hero");
  const heroVisual = document.querySelector(".member-store-hero-visual");
  const walletPoints = document.querySelector(".member-store-wallet strong");
  const productGroups = Array.from(document.querySelectorAll("[data-ai-store-group]"));
  const productCards = Array.from(document.querySelectorAll("[data-ai-store-product]"));
  const particlesContainer = document.querySelector("[data-member-store-particles]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
