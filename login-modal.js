(() => {
  const modal = document.querySelector("[data-login-modal-root]");
  if (!modal) return;

  const dialog = modal.querySelector("[role='dialog']");
  const form = modal.querySelector("[data-login-form]");
  const phoneInput = form?.elements.phone;
  const codeInput = form?.elements["verification-code"];
  const inviteInput = modal.querySelector("[data-invite-code-field]");
  const sendCodeButton = modal.querySelector("[data-send-code]");
  const submitButton = modal.querySelector("[data-login-complete-target]");
  const message = modal.querySelector("[data-login-message]");
  const galaxyContainer = modal.querySelector("[data-login-galaxy]");
  const openTriggers = [...document.querySelectorAll("[data-open-login]")];
  let lastFocusedElement = null;
  let timer = null;
  let codeCooldownActive = false;
  let galaxyInstance = null;
  let galaxyModulePromise = null;
  let galaxyLoadToken = 0;

  const setMessage = (text, type = "") => {
    if (!message) return;
    message.textContent = text;
    message.dataset.type = type;
  };

  const phoneIsValid = () => /^1[3-9]\d{9}$/.test(phoneInput?.value.trim() || "");

  const syncSendCodeState = () => {
    if (!sendCodeButton || codeCooldownActive) return;
    const isValid = phoneIsValid();
    sendCodeButton.disabled = !isValid;
    sendCodeButton.setAttribute("aria-disabled", String(!isValid));
  };

  const setGalaxyActive = (isActive) => {
    if (!galaxyContainer || !dialog) return;
    const loadToken = ++galaxyLoadToken;

    if (!isActive) {
      galaxyInstance?.stop();
      return;
    }

    if (galaxyInstance) {
      galaxyInstance.start();
      return;
    }

    galaxyContainer.dataset.galaxyState = "loading";
    galaxyModulePromise ||= import("./reactbits-galaxy.js");
    galaxyModulePromise
      .then(({ createReactBitsGalaxy }) => {
        if (loadToken !== galaxyLoadToken || modal.hidden) return;
        galaxyInstance = createReactBitsGalaxy(galaxyContainer, {
          starSpeed: Number(galaxyContainer.dataset.starSpeed),
          density: Number(galaxyContainer.dataset.density),
          hueShift: Number(galaxyContainer.dataset.hueShift),
          glowIntensity: Number(galaxyContainer.dataset.glowIntensity),
          saturation: Number(galaxyContainer.dataset.saturation),
          repulsionStrength: Number(galaxyContainer.dataset.repulsionStrength),
          twinkleIntensity: Number(galaxyContainer.dataset.twinkleIntensity),
          rotationSpeed: Number(galaxyContainer.dataset.rotationSpeed),
          autoCenterRepulsion: Number(galaxyContainer.dataset.autoCenterRepulsion),
          interactionTarget: dialog
        });
        galaxyContainer.dataset.galaxyState = "ready";
      })
      .catch((error) => {
        galaxyModulePromise = null;
        if (loadToken !== galaxyLoadToken) return;
        galaxyContainer.dataset.galaxyState = "fallback";
        console.warn("ReactBits Galaxy 加载失败，已保留静态星空背景。", error);
      });
  };

  const closeModal = () => {
    modal.classList.remove("is-open");
    modal.hidden = true;
    setGalaxyActive(false);
    if (window.location.hash === "#login-modal") {
      window.history.replaceState(
        window.history.state,
        "",
        `${window.location.pathname}${window.location.search}`
      );
    }
    document.body.classList.remove("login-modal-open");
    lastFocusedElement?.focus?.();
  };

  const syncModalState = () => {
    const isOpen = window.location.hash === "#login-modal";
    modal.hidden = !isOpen;
    modal.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("login-modal-open", isOpen);
    setGalaxyActive(isOpen);
    if (!isOpen) return;

    lastFocusedElement = document.activeElement;
    window.setTimeout(() => phoneInput?.focus(), 80);
  };

  modal.querySelectorAll("[data-login-close]").forEach((control) => {
    control.addEventListener("click", (event) => {
      event.preventDefault();
      closeModal();
    });
  });

  modal.querySelectorAll("[data-login-agreement]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      setMessage("协议内容将在正式页面中展示");
    });
  });

  phoneInput?.addEventListener("input", () => {
    const digitsOnly = phoneInput.value.replace(/\D/g, "").slice(0, 11);
    if (phoneInput.value !== digitsOnly) phoneInput.value = digitsOnly;
    if (phoneIsValid()) {
      phoneInput.closest(".login-field")?.classList.remove("is-invalid");
      if (message?.dataset.type === "error") setMessage("");
    }
    syncSendCodeState();
  });

  sendCodeButton?.addEventListener("click", () => {
    if (!phoneIsValid()) {
      phoneInput?.focus();
      phoneInput?.closest(".login-field")?.classList.add("is-invalid");
      setMessage("请输入正确的 11 位手机号", "error");
      return;
    }

    phoneInput.closest(".login-field")?.classList.remove("is-invalid");
    setMessage("验证码已发送，请注意查收", "success");
    let remaining = 60;
    codeCooldownActive = true;
    sendCodeButton.disabled = true;
    sendCodeButton.setAttribute("aria-disabled", "true");
    sendCodeButton.textContent = `${remaining}s 后重试`;
    window.clearInterval(timer);
    timer = window.setInterval(() => {
      remaining -= 1;
      sendCodeButton.textContent = remaining > 0 ? `${remaining}s 后重试` : "获取验证码";
      if (remaining <= 0) {
        window.clearInterval(timer);
        codeCooldownActive = false;
        syncSendCodeState();
      }
    }, 1000);
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    form.querySelectorAll(".is-invalid").forEach((field) => field.classList.remove("is-invalid"));

    if (!phoneIsValid()) {
      phoneInput?.closest(".login-field")?.classList.add("is-invalid");
      phoneInput?.focus();
      setMessage("请输入正确的 11 位手机号", "error");
      return;
    }

    if (!/^\d{4,6}$/.test(codeInput?.value.trim() || "")) {
      codeInput?.closest(".login-field")?.classList.add("is-invalid");
      codeInput?.focus();
      setMessage("请输入 4–6 位验证码", "error");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "登录中…";
    setMessage("正在验证登录信息");
    window.setTimeout(() => {
      submitButton.textContent = "登录成功";
      setMessage("登录成功", "success");
      openTriggers.forEach((trigger) => {
        trigger.textContent = "已登录";
        trigger.classList.add("is-authenticated");
      });
      document.body.classList.remove("is-guest");
      document.body.classList.add("is-authenticated");
      window.setTimeout(closeModal, 650);
    }, 700);
  });

  document.addEventListener("keydown", (event) => {
    if (window.location.hash !== "#login-modal") return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== "Tab") return;
    const focusable = [...dialog.querySelectorAll(
      "a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex='-1'])"
    )].filter((element) => !element.hidden);
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

  const inviteCode = new URLSearchParams(window.location.search).get("invite");
  if (inviteCode && inviteInput) inviteInput.value = inviteCode;

  syncSendCodeState();
  window.addEventListener("hashchange", syncModalState);
  syncModalState();
})();
