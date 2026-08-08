(() => {
  const robotPAG = document.querySelector("[data-points-robot-pag]");
  const canvas = robotPAG?.querySelector("[data-points-robot-pag-canvas]");
  const shopVideo = document.querySelector("[data-points-shop-video]");
  if (!robotPAG || !canvas) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const LIBPAG_VERSION = "4.5.85";
  const LIBPAG_BASE_URL = `https://cdn.jsdelivr.net/npm/libpag@${LIBPAG_VERSION}/lib/`;
  let pagView = null;
  let pagFile = null;
  let initPromise = null;
  let robotIsVisible = true;
  let shopVideoIsVisible = true;

  const shouldPlay = () => !reduceMotion && !document.hidden && robotIsVisible;

  const initPAG = () => {
    if (reduceMotion) return Promise.resolve();
    if (initPromise) return initPromise;

    robotPAG.dataset.pagState = "loading";
    initPromise = Promise.all([
      import(`${LIBPAG_BASE_URL}libpag.esm.js`).then(({ PAGInit }) => PAGInit({
        locateFile: (file) => `${LIBPAG_BASE_URL}${file}`
      })),
      fetch(new URL(robotPAG.dataset.pagSrc, document.baseURI))
    ])
      .then(async ([PAG, response]) => {
        if (!response.ok) throw new Error(`PAG 文件加载失败（HTTP ${response.status}）`);

        pagFile = await PAG.PAGFile.load(await response.arrayBuffer());
        canvas.width = pagFile.width();
        canvas.height = pagFile.height();
        pagView = await PAG.PAGView.init(pagFile, canvas);
        if (!pagView) throw new Error("PAGView 初始化失败");

        pagView.setRepeatCount(0);
        pagView.setMaxFrameRate(30);
        robotPAG.dataset.pagState = "ready";
        if (shouldPlay()) await pagView.play();
      })
      .catch((error) => {
        pagView?.destroy();
        pagView = null;
        pagFile?.destroy();
        pagFile = null;
        robotPAG.dataset.pagState = "fallback";
        console.warn("积分中心 PAG 机器人加载失败，已回退到静态插图。", error);
      });

    return initPromise;
  };

  const syncPlayback = () => {
    if (reduceMotion) return;

    if (!shouldPlay()) {
      void pagView?.pause().catch((error) => {
        console.warn("积分中心 PAG 机器人暂停失败。", error);
      });
      return;
    }

    if (!pagView) {
      void initPAG();
      return;
    }

    void pagView.play().catch((error) => {
      console.warn("积分中心 PAG 机器人恢复失败。", error);
    });
  };

  if (reduceMotion) {
    robotPAG.dataset.pagState = "reduced-motion";
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(([entry]) => {
      robotIsVisible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.01 });
    observer.observe(robotPAG);
  } else {
    syncPlayback();
  }

  document.addEventListener("visibilitychange", syncPlayback);
  window.addEventListener("pagehide", (event) => {
    if (event.persisted) {
      void pagView?.pause();
      return;
    }
    pagView?.destroy();
    pagView = null;
    pagFile?.destroy();
    pagFile = null;
  }, { once: true });
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) syncPlayback();
  });

  const syncShopVideoPlayback = () => {
    if (!shopVideo) return;
    const shouldPlay = !reduceMotion && !document.hidden && shopVideoIsVisible;
    if (!shouldPlay) {
      shopVideo.pause();
      return;
    }

    void shopVideo.play().catch((error) => {
      console.warn("积分商城视频自动播放失败，已保留封面图。", error);
    });
  };

  if (shopVideo) {
    if (!reduceMotion && "IntersectionObserver" in window) {
      const shopVideoObserver = new IntersectionObserver(([entry]) => {
        shopVideoIsVisible = entry.isIntersecting;
        syncShopVideoPlayback();
      }, { threshold: 0.05 });
      shopVideoObserver.observe(shopVideo);
    } else {
      syncShopVideoPlayback();
    }

    document.addEventListener("visibilitychange", syncShopVideoPlayback);
    window.addEventListener("pagehide", () => shopVideo.pause());
    window.addEventListener("pageshow", syncShopVideoPlayback);
  }
})();
