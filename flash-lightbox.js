(() => {
  const lightbox = document.querySelector("[data-flash-lightbox]");
  const dialog = lightbox?.querySelector("[data-lightbox-dialog]");
  const viewerImage = lightbox?.querySelector("[data-lightbox-image]");
  const counter = lightbox?.querySelector("[data-lightbox-counter]");
  const previousButton = lightbox?.querySelector("[data-lightbox-prev]");
  const nextButton = lightbox?.querySelector("[data-lightbox-next]");
  const closeButton = lightbox?.querySelector(".flash-lightbox-close");
  if (!lightbox || !dialog || !viewerImage || !counter || !previousButton || !nextButton || !closeButton) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let gallery = [];
  let currentIndex = 0;
  let activeTrigger = null;
  let closeTimer = 0;

  const getDirectImage = (figure) => [...figure.children].find((child) => child.tagName === "IMG") || null;

  const getGallery = (figure) => [...figure.closest(".flash-media-grid").querySelectorAll("figure")]
    .map((item) => ({ figure: item, image: getDirectImage(item) }))
    .filter((item) => item.image);

  const preloadAdjacentImages = () => {
    if (gallery.length < 2) return;
    [currentIndex - 1, currentIndex + 1].forEach((index) => {
      const item = gallery[(index + gallery.length) % gallery.length];
      const preload = new Image();
      preload.src = item.image.currentSrc || item.image.src;
    });
  };

  const renderSlide = (index) => {
    if (!gallery.length) return;
    currentIndex = (index + gallery.length) % gallery.length;
    const item = gallery[currentIndex];
    const source = item.image.currentSrc || item.image.src;
    const alt = item.image.alt?.trim() || `第 ${currentIndex + 1} 张图片`;

    viewerImage.src = source;
    viewerImage.alt = alt;
    counter.textContent = `${currentIndex + 1} / ${gallery.length}`;
    const hasMultipleImages = gallery.length > 1;
    lightbox.classList.toggle("is-single-image", !hasMultipleImages);
    [previousButton, nextButton].forEach((button) => {
      button.hidden = !hasMultipleImages;
      button.disabled = !hasMultipleImages;
      button.setAttribute("aria-hidden", String(!hasMultipleImages));
    });

    if (!reduceMotion.matches) {
      viewerImage.classList.remove("is-entering");
      void viewerImage.offsetWidth;
      viewerImage.classList.add("is-entering");
    }
    preloadAdjacentImages();
  };

  const finishClose = () => {
    lightbox.hidden = true;
    lightbox.classList.remove("is-closing", "is-single-image");
    viewerImage.removeAttribute("src");
    gallery = [];
    activeTrigger?.focus({ preventScroll: true });
    activeTrigger = null;
  };

  const closeLightbox = () => {
    if (lightbox.hidden || lightbox.classList.contains("is-closing")) return;
    window.clearTimeout(closeTimer);
    lightbox.classList.remove("is-open");
    lightbox.classList.add("is-closing");
    document.body.classList.remove("is-flash-lightbox-open");
    if (reduceMotion.matches) {
      finishClose();
      return;
    }
    closeTimer = window.setTimeout(finishClose, 220);
  };

  const openLightbox = (figure) => {
    const image = getDirectImage(figure);
    if (!image) return;
    gallery = getGallery(figure);
    currentIndex = Math.max(0, gallery.findIndex((item) => item.figure === figure));
    activeTrigger = figure;
    window.clearTimeout(closeTimer);
    lightbox.classList.remove("is-closing");
    lightbox.hidden = false;
    document.body.classList.add("is-flash-lightbox-open");
    renderSlide(currentIndex);
    requestAnimationFrame(() => {
      lightbox.classList.add("is-open");
      closeButton.focus({ preventScroll: true });
    });
  };

  document.querySelectorAll(".flash-timeline-shell .flash-media-grid figure").forEach((figure) => {
    const image = getDirectImage(figure);
    if (!image) return;
    figure.dataset.flashLightboxTrigger = "";
    figure.tabIndex = 0;
    figure.setAttribute("role", "button");
    figure.setAttribute("aria-label", `查看大图：${image.alt?.trim() || "帖子图片"}`);
  });

  document.addEventListener("click", (event) => {
    const figure = event.target.closest(".flash-timeline-shell .flash-media-grid figure[data-flash-lightbox-trigger]");
    if (!figure) return;
    event.preventDefault();
    openLightbox(figure);
  });

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) {
      const figure = event.target.closest?.(".flash-timeline-shell .flash-media-grid figure[data-flash-lightbox-trigger]");
      if (figure && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        openLightbox(figure);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
      return;
    }
    if (event.key === "ArrowLeft" && gallery.length > 1) {
      event.preventDefault();
      renderSlide(currentIndex - 1);
      return;
    }
    if (event.key === "ArrowRight" && gallery.length > 1) {
      event.preventDefault();
      renderSlide(currentIndex + 1);
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = [previousButton, nextButton, closeButton].filter((button) => !button.hidden);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target.closest("[data-lightbox-close]")) {
      closeLightbox();
      return;
    }
    if (event.target.closest("[data-lightbox-prev]")) {
      renderSlide(currentIndex - 1);
      return;
    }
    if (event.target.closest("[data-lightbox-next]")) renderSlide(currentIndex + 1);
  });
})();
