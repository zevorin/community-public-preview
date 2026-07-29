(() => {
  const modal = document.querySelector("#compose-flash");
  const form = modal?.querySelector("[data-flash-compose-form]");
  if (!modal || !form) return;

  const contentInput = form.querySelector("[data-flash-compose-input]");
  const contentCounter = form.querySelector("[data-flash-compose-counter]");
  const submitButton = form.querySelector("[data-flash-compose-submit]");
  const status = form.querySelector("[data-flash-compose-status]");
  const mediaInput = form.querySelector("[data-flash-media-input]");
  const mediaTrigger = form.querySelector("[data-flash-media-trigger]");
  const mediaList = form.querySelector("[data-flash-media-list]");
  const mediaCount = form.querySelector("[data-flash-media-count]");
  const topicGroup = form.querySelector("[data-flash-topic-group]");
  const topicInput = form.querySelector("[data-flash-topic-input]");
  const topicList = form.querySelector("[data-flash-topic-list]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mediaUrls = new WeakMap();
  let counterTimer = 0;
  let mediaTotal = 0;
  let draggedMedia = null;

  const setStatus = (message, tone = "") => {
    status.textContent = message;
    status.classList.toggle("is-error", tone === "error");
    status.classList.toggle("is-success", tone === "success");
  };

  const syncContentState = ({ bump = false } = {}) => {
    const length = contentInput.value.length;
    contentCounter.textContent = `${length}/600`;
    submitButton.disabled = length === 0;

    if (!bump || reduceMotion.matches) return;
    window.clearTimeout(counterTimer);
    contentCounter.classList.remove("is-counter-bumping");
    void contentCounter.offsetWidth;
    contentCounter.classList.add("is-counter-bumping");
    counterTimer = window.setTimeout(() => contentCounter.classList.remove("is-counter-bumping"), 380);
  };

  const syncMediaCount = () => {
    mediaCount.textContent = `${mediaTotal} / 6`;
    mediaTrigger.hidden = mediaTotal >= 6;
  };

  const removeMediaItem = (item) => {
    const url = mediaUrls.get(item);
    if (url) URL.revokeObjectURL(url);
    item.remove();
    mediaUrls.delete(item);
    mediaTotal = Math.max(0, mediaTotal - 1);
    syncMediaCount();
    setStatus("媒体已移除");
  };

  const createMediaItem = (file) => {
    const item = document.createElement("div");
    item.className = "flash-media-item";
    item.draggable = true;

    const url = URL.createObjectURL(file);
    mediaUrls.set(item, url);

    if (file.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.src = url;
      video.muted = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.setAttribute("aria-label", file.name);
      item.appendChild(video);
    } else {
      const image = document.createElement("img");
      image.src = url;
      image.alt = file.name;
      item.appendChild(image);
    }

    const kind = document.createElement("span");
    kind.className = "flash-media-kind";
    kind.textContent = file.type.startsWith("video/") ? "视频" : "图片";

    const remove = document.createElement("button");
    remove.className = "flash-media-remove";
    remove.type = "button";
    remove.setAttribute("aria-label", `移除 ${file.name}`);
    const closeIcon = document.createElement("img");
    closeIcon.src = "resources/icons/remixicon/svg/System/close-line.svg";
    closeIcon.alt = "";
    remove.appendChild(closeIcon);
    remove.addEventListener("click", () => removeMediaItem(item));

    item.append(kind, remove);
    item.addEventListener("dragstart", () => {
      draggedMedia = item;
      item.classList.add("is-dragging");
    });
    item.addEventListener("dragend", () => {
      item.classList.remove("is-dragging");
      draggedMedia = null;
    });
    item.addEventListener("dragover", (event) => event.preventDefault());
    item.addEventListener("drop", (event) => {
      event.preventDefault();
      if (!draggedMedia || draggedMedia === item) return;
      const itemBox = item.getBoundingClientRect();
      const insertAfter = event.clientX > itemBox.left + itemBox.width / 2;
      mediaList.insertBefore(draggedMedia, insertAfter ? item.nextSibling : item);
      setStatus("媒体顺序已更新");
    });

    return item;
  };

  const getTopicTags = () => [...topicGroup.querySelectorAll("[data-flash-topic-tag]")];

  const removeTopicTag = (tag) => {
    if (!tag || tag.classList.contains("is-removing")) return;
    const value = tag.dataset.topicValue || "";
    tag.classList.add("is-removing");
    const finishRemoval = () => {
      tag.remove();
      if (value) setStatus(`已删除“${value}”话题`);
    };
    if (reduceMotion.matches) {
      finishRemoval();
      return;
    }
    tag.addEventListener("animationend", finishRemoval, { once: true });
    window.setTimeout(() => {
      if (tag.isConnected) finishRemoval();
    }, 280);
  };

  const createTopicTag = (value) => {
    const tag = document.createElement("span");
    tag.className = "flash-topic-tag";
    tag.dataset.flashTopicTag = "";
    tag.dataset.topicValue = value;

    const label = document.createElement("span");
    label.textContent = value;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.dataset.flashTopicRemove = "";
    remove.setAttribute("aria-label", `删除话题 ${value}`);
    const closeIcon = document.createElement("img");
    closeIcon.src = "resources/icons/remixicon/svg/System/close-line.svg";
    closeIcon.alt = "";
    remove.appendChild(closeIcon);

    tag.append(label, remove);
    return tag;
  };

  const addTopicFromInput = () => {
    const value = topicInput.value.trim().replace(/^#+/, "").trim();
    if (!value) return;

    const tags = getTopicTags();
    if (tags.some((tag) => tag.dataset.topicValue?.toLocaleLowerCase() === value.toLocaleLowerCase())) {
      setStatus(`“${value}”话题已存在`, "error");
      return;
    }
    if (tags.length >= 5) {
      setStatus("最多可添加 5 个话题", "error");
      return;
    }

    topicList.appendChild(createTopicTag(value));
    topicInput.value = "";
    setStatus(`已添加“${value}”话题`);
  };

  contentInput.addEventListener("input", () => {
    syncContentState({ bump: true });
    setStatus(contentInput.value.trim() ? "内容会在社区内公开展示" : "先写下一点内容，再发布闪念");
  });

  topicGroup.addEventListener("click", (event) => {
    const remove = event.target.closest("[data-flash-topic-remove]");
    if (!remove) {
      topicInput.focus();
      return;
    }
    removeTopicTag(remove.closest("[data-flash-topic-tag]"));
    topicInput.focus();
  });

  topicInput.addEventListener("keydown", (event) => {
    if (event.isComposing) return;
    if (event.key === "Enter") {
      event.preventDefault();
      addTopicFromInput();
      return;
    }
    if (event.key === "Backspace" && !topicInput.value) {
      const tags = getTopicTags();
      removeTopicTag(tags.at(-1));
    }
  });

  form.querySelector("[data-flash-category]")?.addEventListener("change", (event) => {
    const selected = event.target.options[event.target.selectedIndex]?.textContent || "当前";
    setStatus(`内容将发布到“${selected}”分类`);
  });

  mediaTrigger.addEventListener("click", () => mediaInput.click());
  mediaInput.addEventListener("change", () => {
    const available = Math.max(0, 6 - mediaTotal);
    const files = [...mediaInput.files].slice(0, available);
    files.forEach((file) => {
      mediaList.appendChild(createMediaItem(file));
      mediaTotal += 1;
    });
    syncMediaCount();
    if (files.length) setStatus(`已添加 ${files.length} 个媒体文件`);
    if (mediaInput.files.length > available) setStatus("最多可添加 6 个媒体文件", "error");
    mediaInput.value = "";
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contentInput.value.trim()) {
      setStatus("请先写下闪念内容", "error");
      contentInput.focus();
      return;
    }

    submitButton.classList.add("is-publishing");
    submitButton.disabled = true;
    setStatus("正在发布闪念…");

    window.setTimeout(() => {
      submitButton.classList.remove("is-publishing");
      submitButton.disabled = false;
      setStatus("闪念已发布", "success");
    }, reduceMotion.matches ? 0 : 560);
  });

  const focusModalWhenOpened = () => {
    if (window.location.hash !== "#compose-flash") return;
    modal.querySelector(".flash-compose-dialog")?.focus({ preventScroll: true });
  };

  window.addEventListener("hashchange", focusModalWhenOpened);
  syncContentState();
  syncMediaCount();
  focusModalWhenOpened();
})();
