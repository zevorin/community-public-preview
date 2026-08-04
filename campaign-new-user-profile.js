(() => {
  const dialog = document.querySelector("#new-user-profile-modal");
  const openButton = document.querySelector("[data-profile-modal-open]");
  const form = dialog?.querySelector("[data-new-user-profile-form]");

  if (!dialog || !openButton || !form) return;

  const closeButtons = dialog.querySelectorAll("[data-profile-modal-close]");
  const nicknameInput = dialog.querySelector("[data-profile-nickname]");
  const bioInput = dialog.querySelector("[data-profile-bio]");
  const avatarInput = dialog.querySelector("[data-profile-avatar-input]");
  const avatarPreview = dialog.querySelector("[data-profile-avatar-preview]");
  const feedback = dialog.querySelector("[data-profile-feedback]");
  const storageKey = "community-new-user-profile-v1";
  let opener = null;
  let avatarObjectUrl = "";

  const setFeedback = (message) => {
    if (feedback) feedback.textContent = message;
  };

  const loadSavedProfile = () => {
    try {
      const savedProfile = JSON.parse(localStorage.getItem(storageKey) || "null");
      if (savedProfile && typeof savedProfile === "object") {
        if (typeof savedProfile.nickname === "string" && nicknameInput) nicknameInput.value = savedProfile.nickname;
        if (typeof savedProfile.bio === "string" && bioInput) bioInput.value = savedProfile.bio;
      }
    } catch {
      // Storage can be unavailable in private or restricted browsing contexts.
    }
  };

  const openDialog = () => {
    opener = document.activeElement instanceof HTMLElement && document.activeElement !== document.body
      ? document.activeElement
      : openButton;
    loadSavedProfile();
    setFeedback("资料仅在本地预览中保存");
    document.body.classList.add("has-new-user-profile-modal");

    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");

    requestAnimationFrame(() => nicknameInput?.focus());
  };

  const closeDialog = (returnValue = "cancel") => {
    if (typeof dialog.close === "function") dialog.close(returnValue);
    else {
      dialog.removeAttribute("open");
      document.body.classList.remove("has-new-user-profile-modal");
      opener?.focus?.();
    }
  };

  openButton.addEventListener("click", openDialog);
  closeButtons.forEach((button) => button.addEventListener("click", () => closeDialog("cancel")));

  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    const isOutside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (isOutside) closeDialog("backdrop");
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("has-new-user-profile-modal");
    opener?.focus?.();
  });

  avatarInput?.addEventListener("change", () => {
    const file = avatarInput.files?.[0];
    if (!file || !avatarPreview) return;

    if (file.size > 5 * 1024 * 1024) {
      avatarInput.value = "";
      setFeedback("头像文件不能超过 5MB");
      return;
    }

    if (avatarObjectUrl) URL.revokeObjectURL(avatarObjectUrl);
    avatarObjectUrl = URL.createObjectURL(file);
    avatarPreview.src = avatarObjectUrl;
    setFeedback("头像已更新，保存后应用资料");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify({
        nickname: nicknameInput?.value.trim() || "",
        bio: bioInput?.value.trim() || ""
      }));
      closeDialog("saved");
    } catch {
      setFeedback("资料暂时无法保存，请稍后重试");
    }
  });

  window.addEventListener("beforeunload", () => {
    if (avatarObjectUrl) URL.revokeObjectURL(avatarObjectUrl);
  });
})();
