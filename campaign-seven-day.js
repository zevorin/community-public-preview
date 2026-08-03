(() => {
  const tabs = Array.from(document.querySelectorAll("[data-day-tab]"));
  const panels = Array.from(document.querySelectorAll("[data-day-panel]"));

  if (!tabs.length || !panels.length) return;

  const activateDay = (day, focusTab = false) => {
    tabs.forEach((tab) => {
      const selected = tab.dataset.dayTab === day;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focusTab) tab.focus();
    });

    panels.forEach((panel) => {
      panel.hidden = panel.dataset.dayPanel !== day;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateDay(tab.dataset.dayTab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();

      let nextIndex = index;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;

      activateDay(tabs[nextIndex].dataset.dayTab, true);
    });
  });
})();
