/* Manual theme switcher. Classic GTA menu is the default, no calendar-driven changes. */
(() => {
  "use strict";
  const valid = ["classic", "halloween"];
  const query = new URLSearchParams(location.search).get("theme");
  let stored = "";
  try { stored = localStorage.getItem("ricsi-campaign-theme") || ""; } catch {}
  const initial = valid.includes(query) ? query : (valid.includes(stored) ? stored : "classic");
  const apply = theme => {
    if (!valid.includes(theme)) return;
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "halloween" ? "#160d1b" : "#090909");
    window.CAMPAIGN_ACTIVE_THEME = theme;
    try { localStorage.setItem("ricsi-campaign-theme", theme); } catch {}
    document.dispatchEvent(new CustomEvent("campaign:themechange", {detail: {theme}}));
  };
  window.CAMPAIGN_SET_THEME = apply;
  apply(initial);
})();