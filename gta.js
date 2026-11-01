/* Navigation highlighting and manually controlled Halloween skin. */
(() => {
  "use strict";
  const toggle = document.getElementById("halloween-toggle");
  const refreshToggle = () => {
    const enabled = document.documentElement.dataset.theme === "halloween";
    if (!toggle) return;
    toggle.setAttribute("aria-pressed", String(enabled));
    toggle.setAttribute("aria-label", enabled ? "Halloween mód kikapcsolása" : "Halloween mód bekapcsolása");
    toggle.classList.toggle("is-on", enabled);
  };
  toggle?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "halloween" ? "classic" : "halloween";
    window.CAMPAIGN_SET_THEME?.(next);
    refreshToggle();
  });
  document.addEventListener("campaign:themechange", refreshToggle);
  refreshToggle();

  const links = [...document.querySelectorAll(".gta-top-nav a[href^='#']")];
  const sections = links.map(link => ({link,section:document.querySelector(link.getAttribute("href"))})).filter(x=>x.section);
  let ticking=false;
  const markCurrent=()=>{
    ticking=false;
    const threshold = Math.max(120, window.innerHeight*.25);
    let current = sections[0];
    for (const item of sections) if (item.section.getBoundingClientRect().top <= threshold) current=item;
    links.forEach(link => {
      const on = link===current?.link;
      link.classList.toggle("is-current",on);
      if(on) link.setAttribute("aria-current","location"); else link.removeAttribute("aria-current");
    });
  };
  const schedule=()=>{if(!ticking){ticking=true;requestAnimationFrame(markCurrent);}};
  window.addEventListener("scroll",schedule,{passive:true});
  window.addEventListener("resize",schedule);
  markCurrent();
  // Game-menu keyboard behavior only when the on-screen menu has focus.
  const menu=document.querySelector(".gta-side-menu");
  menu?.addEventListener("keydown",e=>{
    if(!["ArrowDown","ArrowUp"].includes(e.key))return;
    const list=[...menu.querySelectorAll("a")];
    const i=list.indexOf(document.activeElement);
    if(i===-1)return;
    e.preventDefault();
    list[(i+(e.key==="ArrowDown"?1:-1)+list.length)%list.length].focus();
  });
})();