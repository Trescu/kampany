/* Programom submenu: keyboard-accessible GTA IV Stats-style category switcher */
(() => {
 "use strict";
 const menu=document.querySelector("#programom .program-stats-sidebar");
 const table=document.getElementById("program-stats-table");
 if(!menu || !table)return;
 const buttons=[...menu.querySelectorAll("[data-program-stats]")];
 // No invented launch dates, impact percentages or published project status claims.
 const programData={
  ehok:[
   ["Fő projekt","eHÖK"],
   ["Állapot","Tervezés alatt"],
   ["Cél","Digitális hallgatói önkormányzati platform"],
   ["Kommunikáció","Hallgatói visszajelzések"],
   ["Ügyintézés","Digitális támogatás"],
   ["Átláthatóság","Kiemelt cél"],
   ["Közösségi kapcsolódás","Fontos"],
   ["Hallgatói élmény","Fejlesztendő"],
   ["Prioritás","Magas"],
   ["Fókusz","GDE hallgatók"]
  ],
  neptun:[
   ["Projekt","Neptun app"],
   ["Típus","Kiegészítő fejlesztés"],
   ["Platform","Android"],
   ["Állapot","MVP fejlesztés"],
   ["Belépés","Neptun-integráció"],
   ["Hitelesítés","TOTP"],
   ["Widgetek","Órarend és hitelesítő kód"],
   ["Cél","Gyorsabb hallgatói hozzáférés"],
   ["Fókusz","Mindennapi egyetemi feladatok"]
  ],
  tanulas:[
   ["Terület","Tanulást segítő eszközök"],
   ["Cél","A tanulás digitális támogatása"],
   ["Lehetséges funkció","Tananyagkezelés és keresés"],
   ["Tudásbázis","Tananyagok rendszerezése"],
   ["Elérhetőség","Egyszerű hozzáférés"],
   ["Prioritás","Később részletezendő"],
   ["Fókusz","Hallgatói tanulási folyamatok"]
  ],
  ugyintezes:[
   ["Terület","Hallgatói ügyintézés"],
   ["Cél","Átláthatóbb ügykövetés"],
   ["Ügyindítás","Digitális felületen"],
   ["Állapot","Követhető folyamatok"],
   ["Visszajelzés","Hallgatói üzenetek"],
   ["Kommunikáció","Egyszerűbb kapcsolattartás"],
   ["Fókusz","Gyakorlati hallgatói problémák"]
  ],
  digital:[
   ["Terület","Digitalizáció"],
   ["Cél","Korszerűbb egyetemi szolgáltatások"],
   ["Elérhetőség","Mobilbarát megoldások"],
   ["Folyamatok","Egyszerűbb, gyorsabb ügyintézés"],
   ["Információk","Könnyebb hozzáférés"],
   ["Átláthatóság","Kiemelt szempont"],
   ["Megközelítés","Valós hallgatói igények"]
  ],
  kozosseg:[
   ["Terület","Közösségi programok"],
   ["Cél","Aktívabb hallgatói közösség"],
   ["Programok","Találkozók és események"],
   ["Közösségi igények","Hallgatói javaslatok"],
   ["Részvétel","Közös kezdeményezések"],
   ["Kapcsolattartás","Nyitott kommunikáció"],
   ["Fókusz","Összetartóbb GDE-közösség"]
  ]
 };
 let selectedIndex=0;
 const render=(key)=>{
   const rows=programData[key];
   if(!rows)return;
   const fragment=document.createDocumentFragment();
   rows.forEach(([label,value])=>{
     const row=document.createElement("div");row.className="program-stats-row";
     const l=document.createElement("span");l.textContent=label;
     const v=document.createElement("span");v.textContent=value;
     row.append(l,v);fragment.append(row);
   });
   table.replaceChildren(fragment);
 };
 const activate=(index,focus=false)=>{
   selectedIndex=(index+buttons.length)%buttons.length;
   buttons.forEach((b,i)=>{
     const yes=i===selectedIndex;b.classList.toggle("is-selected",yes);b.setAttribute("aria-pressed",String(yes));
   });
   render(buttons[selectedIndex].dataset.programStats);
   if(focus)buttons[selectedIndex].focus({preventScroll:true});
 };
 buttons.forEach((b,i)=>b.addEventListener("click",()=>activate(i)));
 menu.addEventListener("keydown",event=>{
   const isPrev=event.key==="ArrowUp";
   const isNext=event.key==="ArrowDown";
   if(!isPrev&&!isNext&&event.key!=="Home"&&event.key!=="End")return;
   event.preventDefault();event.stopPropagation();
   const next=event.key==="Home"?0:event.key==="End"?buttons.length-1:selectedIndex+(isPrev?-1:1);
   activate(next,true);
 });
 activate(0);
})();
