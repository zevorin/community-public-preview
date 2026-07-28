(() => {
  const title = document.querySelector("[data-member-store-hero-split]");
  const particlesContainer = document.querySelector("[data-member-store-particles]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  if (particlesContainer && !reduceMotion && particlesContainer.dataset.particlesReady !== "true") {
    particlesContainer.dataset.particlesReady = "true";

    import("./reactbits-particles.js?v=20260728-banner-particles-v4")
      .then(({ createReactBitsParticles }) => {
        const particles = createReactBitsParticles(particlesContainer, {
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

        window.addEventListener("pagehide", () => particles.destroy(), { once: true });
      })
      .catch(() => {
        particlesContainer.dataset.particlesReady = "error";
      });
  }
})();
