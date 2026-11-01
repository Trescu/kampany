/* GTA settings-inspired motivations menu; the numbers illustrate priorities, not statistics. */
(() => {
  "use strict";
  const menu=document.querySelector("#miert-en .why-choice-list");
  const detail=document.getElementById("why-description-text");
  if(!menu||!detail)return;
  const options=[...menu.querySelectorAll("[data-why-option]")];
  const descriptions=[
    "A hallgatók érdekeinek képviselete a döntéshozatalban, valódi hallgatói visszajelzések alapján.",
    "Egyszerűbb, korszerűbb digitális ügyintézés és az eHÖK fejlesztése – hogy kevesebb idő menjen el felesleges körökre.",
    "Rendszeres, közérthető tájékoztatás a hallgatókat érintő ügyekről, döntésekről és fejlesztésekről.",
    "Közösségi programok, közös kezdeményezések és több lehetőség a hallgatók kapcsolódására."
  ];
  let selected=0;
  const select=(next,focus=false)=>{
    selected=(next+options.length)%options.length;
    options.forEach((button,i)=>{
      const on=i===selected;
      button.classList.toggle("is-selected",on);
      button.setAttribute("aria-pressed",String(on));
    });
    detail.textContent=descriptions[selected];
    if(focus)options[selected].focus({preventScroll:true});
  };
  options.forEach((button,index)=>button.addEventListener("click",()=>select(index)));
  menu.addEventListener("keydown",event=>{
    if(!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Home","End"].includes(event.key))return;
    event.preventDefault();
    const target=event.key==="Home"?0:event.key==="End"?options.length-1:selected+(event.key==="ArrowUp"||event.key==="ArrowLeft"?-1:1);
    select(target,true);
  });
  select(0);
})();