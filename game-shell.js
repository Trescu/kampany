/* Fullscreen game-menu screen router. Controls the navigation, not page scroll. */
(() => {
  "use strict";
  const screenIds=["fooldal","miert-en","programom","megjelenesek","csapatom","galeria","kapcsolat"];
  const titles=["FŐOLDAL","MIÉRT INDULOK?","PROGRAMOM","EDDIGI MUNKÁM","CSAPATOM","GALÉRIA","KAPCSOLAT"];
  const sections=screenIds.map(id=>document.getElementById(id));
  const anchors=[...document.querySelectorAll('.gta-top-nav a[href^="#"]')];
  const side=[...document.querySelectorAll('.gta-side-menu a[href^="#"]')];
  const label=document.getElementById("game-screen-label");
  const toggle=document.getElementById("halloween-toggle");
  let active="fooldal";
  const normalize=hash=>{
    const id=(hash||"").replace(/^#/,"");
    return screenIds.includes(id)?id:"fooldal";
  };
  const render=(id,focus=false)=>{
    id=normalize(id);
    active=id;
    sections.forEach((s,i)=>{
      const selected=screenIds[i]===id;
      s?.classList.toggle("is-active",selected);
      s?.setAttribute("aria-hidden",String(!selected));
      if(s){s.inert=!selected;if(selected)s.scrollTop=0;}
    });
    anchors.forEach(a=>{
      const on=a.getAttribute("href")==="#"+id;
      a.classList.toggle("is-current",on);
      if(on)a.setAttribute("aria-current","page");
      else a.removeAttribute("aria-current");
    });
    document.querySelectorAll(".gta-side-menu a").forEach((a,i)=>{
      a.classList.toggle("gta-selected",id==="fooldal" && i===0);
    });
    if(label)label.textContent=titles[screenIds.indexOf(id)]||"FŐOLDAL";
    document.body.dataset.screen=id;
    // Explicitly avoid scrolling the outer document when switching screens.
    if(focus) {
      const s=document.getElementById(id);
      const heading=s?.querySelector("h1,h2");
      if(heading){heading.setAttribute("tabindex","-1");heading.focus({preventScroll:true});}
    }
    document.querySelector("#primary-nav")?.classList.remove("is-open");
    document.getElementById("menu-toggle")?.setAttribute("aria-expanded","false");
    document.getElementById("menu-toggle")?.classList.remove("is-active");
    document.body.classList.remove("menu-open");
  };
  const navigate=(id,{replace=false,focus=false}={})=>{
    id=normalize(id);
    const hash="#"+id;
    if(location.hash!==hash){
      try{history[replace?"replaceState":"pushState"]({screen:id},"",hash);}
      catch{location.hash=hash;}
    }
    render(id,focus);
  };
  // All internal anchors, including story dialog links and retro browser shortcuts,
  // switch screens without jumping to a vertically stacked element.
  document.addEventListener("click",event=>{
    const a=event.target.closest?.('a[href^="#"]');
    if(!a||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
    const href=a.getAttribute("href");
    const id=href==="#top"||href==="#main"?"fooldal":normalize(href);
    if(!screenIds.includes(href.slice(1))&&href!=="#main"&&href!=="#top")return;
    event.preventDefault();
    navigate(id,{focus:!a.closest(".gta-top-nav,.gta-side-menu")});
  });
  window.addEventListener("popstate",()=>render(normalize(location.hash),false));
  window.addEventListener("hashchange",()=>render(normalize(location.hash),false));

  document.getElementById("game-back")?.addEventListener("click",()=>navigate("fooldal",{focus:true}));
  document.getElementById("love-home")?.addEventListener("click",()=>navigate("fooldal",{focus:true}));
  document.getElementById("love-prev")?.addEventListener("click",()=>navigate("megjelenesek",{focus:true}));
  document.getElementById("love-next")?.addEventListener("click",()=>navigate("galeria",{focus:true}));

  document.addEventListener("keydown",event=>{
    if(event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey)return;
    if(document.querySelector("dialog[open]"))return;
    if(event.target.closest?.("input,textarea,select,[contenteditable=true]"))return;
    if(event.key==="Escape"){
      if(document.querySelector("#primary-nav.is-open"))return;
      if(active!=="fooldal"){event.preventDefault();navigate("fooldal",{focus:true});}
      return;
    }
    const focusedNav=event.target.closest?.(".gta-top-nav,.gta-side-menu");
    if(focusedNav && (event.key==="ArrowRight"||event.key==="ArrowLeft"||event.key==="ArrowDown"||event.key==="ArrowUp")){
      const items=[...focusedNav.querySelectorAll('a[href^="#"]')];
      const i=items.indexOf(document.activeElement);
      if(i<0)return;
      event.preventDefault();
      const step=(event.key==="ArrowRight"||event.key==="ArrowDown")?1:-1;
      items[(i+step+items.length)%items.length]?.focus();
    }
  });
  // Manual Halloween on/off; original seasonal game is a later feature.
  const updateToggle=()=>{
    const enabled=document.documentElement.dataset.theme==="halloween";
    toggle?.setAttribute("aria-pressed",String(enabled));
    toggle?.setAttribute("aria-label",enabled?"Halloween mód kikapcsolása":"Halloween mód bekapcsolása");
    toggle?.classList.toggle("is-on",enabled);
  };
  toggle?.addEventListener("click",()=>{
    const next=document.documentElement.dataset.theme==="halloween"?"classic":"halloween";
    window.CAMPAIGN_SET_THEME?.(next);updateToggle();
  });
  document.addEventListener("campaign:themechange",updateToggle);
  updateToggle();
  render(normalize(location.hash),false);
})();