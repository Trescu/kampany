/* Full-viewport campaign reader: entire image remains visible;
   the matching long-form story is independently scrollable. */
(() => {
  'use strict';
  const images=[
    {src:'assets/street-mercedes.webp',alt:'Kampányfotó egy Mercedes autónál',caption:'Kampányhangulat'},
    {src:'assets/campus-maroon.webp',alt:'Illusztrált portré az egyetem előtt, bordó ingben',caption:'Az egyetemen'},
    {src:'assets/campus-purple.webp',alt:'Illusztrált portré Gábor Dénes szobránál',caption:'Ötletek és megoldások'},
    {src:'assets/campus-pattern.webp',alt:'Illusztrált portré mintás felsőben az egyetem mellett',caption:'Gondolkodjunk együtt'},
    {src:'assets/campus-brown.webp',alt:'Illusztrált portré barna kabátban, egyetemi háttérrel',caption:'Fókuszban a cél'}
  ];
  const templates=['story-campaign','story-university','story-digital','story-dialogue','story-priorities'];
  const $=id=>document.getElementById(id);
  const image=$('modal-image');
  const caption=$('modal-caption');
  const story=$('story-copy');
  const progress=$('story-progress');
  const navIndex=$('nav-index');
  if(!image||!caption||!story)return;
  let active=0;
  const getIndex=hash=>{
    const match=/^#kep-([1-5])$/.exec(hash);
    return match?Number(match[1])-1:0;
  };
  function render(index){
    active=(index+images.length)%images.length;
    const item=images[active];
    image.src=item.src;
    image.alt=item.alt;
    caption.textContent=item.caption;
    if(progress)progress.textContent=String(active+1).padStart(2,'0')+' / '+String(images.length).padStart(2,'0');
    if(navIndex)navIndex.textContent=(active+1)+' / '+images.length;
    const template=$(templates[active]);
    story.replaceChildren(template?.content.cloneNode(true)||document.createTextNode('A történet még szerkesztés alatt.'));
    story.scrollTop=0;
  }
  function go(index){
    const next=(index+images.length)%images.length;
    const hash='#kep-'+(next+1);
    if(location.hash!==hash)history.pushState({image:next},'',hash);
    render(next);
  }
  $('modal-prev')?.addEventListener('click',()=>go(active-1));
  $('modal-next')?.addEventListener('click',()=>go(active+1));
  document.addEventListener('keydown',event=>{
    if(event.altKey||event.ctrlKey||event.metaKey||event.target.closest?.('input,textarea,select,[contenteditable]'))return;
    if(event.key==='ArrowLeft'){event.preventDefault();go(active-1);}
    if(event.key==='ArrowRight'){event.preventDefault();go(active+1);}
  });
  window.addEventListener('popstate',()=>render(getIndex(location.hash)));
  window.addEventListener('hashchange',()=>render(getIndex(location.hash)));
  let touchStart=null;
  image.addEventListener('touchstart',event=>{
    if(event.touches.length===1)touchStart={x:event.touches[0].clientX,y:event.touches[0].clientY};
  },{passive:true});
  image.addEventListener('touchend',event=>{
    if(!touchStart||!event.changedTouches.length)return;
    const dx=event.changedTouches[0].clientX-touchStart.x;
    const dy=event.changedTouches[0].clientY-touchStart.y;
    touchStart=null;
    if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)go(active+(dx<0?1:-1));
  },{passive:true});
  render(getIndex(location.hash));
})();
