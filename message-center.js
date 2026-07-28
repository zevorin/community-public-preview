(() => {
  const filters = [...document.querySelectorAll("[data-filter]")];
  const messages = [...document.querySelectorAll(".notification-card")];
  const unreadCount = document.querySelector("[data-unread-count]");
  const emptyState = document.querySelector("[data-message-empty]");

  if (!filters.length || !messages.length) return;

  const updateUnreadCount = () => {
    if (!unreadCount) return;
    unreadCount.textContent = String(
      messages.filter((message) => message.classList.contains("is-unread")).length,
    );
  };

  const applyFilter = (filter) => {
    let visibleCount = 0;
    const visibleMessages = [];

    filters.forEach((button) => {
      const selected = button.dataset.filter === filter;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    messages.forEach((message) => {
      const matches =
        filter === "all" ||
        (filter === "unread" && message.classList.contains("is-unread")) ||
        message.dataset.category === filter;
      message.classList.remove("is-entering");
      message.hidden = !matches;
      if (matches) {
        message.style.setProperty("--message-order", String(visibleCount));
        visibleMessages.push(message);
        visibleCount += 1;
      }
    });

    if (emptyState) emptyState.hidden = visibleCount !== 0;

    requestAnimationFrame(() => {
      visibleMessages.forEach((message) => message.classList.add("is-entering"));
    });
  };

  filters.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter || "all"));
  });

  messages.forEach((message) => {
    message.addEventListener("animationend", (event) => {
      if (event.animationName === "message-card-enter") {
        message.classList.remove("is-entering");
      }
    });

    message.addEventListener("click", () => {
      message.classList.remove("is-unread");
      updateUnreadCount();
    });
  });

  updateUnreadCount();
  applyFilter("all");
})();
