/* Viewport-sized gallery; full pictures, paged story text, no scrolling. */
(() => {
'use strict';
const images=[{"src":"assets/street-mercedes.webp","alt":"Kampányfotó egy Mercedes autónál","caption":"Kampányhangulat"},{"src":"assets/campus-maroon.webp","alt":"Illusztrált portré az egyetem előtt, bordó ingben","caption":"Az egyetemen"},{"src":"assets/campus-purple.webp","alt":"Illusztrált portré Gábor Dénes szobránál","caption":"Ötletek és megoldások"},{"src":"assets/campus-pattern.webp","alt":"Illusztrált portré mintás felsőben az egyetem mellett","caption":"Gondolkodjunk együtt"},{"src":"assets/campus-brown.webp","alt":"Illusztrált portré barna kabátban, egyetemi háttérrel","caption":"Fókuszban a cél"}];
const templates=['story-campaign','story-university','story-digital','story-dialogue','story-priorities'];
const $=id=>document.getElementById(id);
const image=$('modal-image'),caption=$('modal-caption'),reader=$('story-reader');
const copy=$('story-copy'),progress=$('story-progress'),navIndex=$('nav-index');
const pageInfo=$('story-page-info'),prevPage=$('story-prev'),nextPage=$('story-next');
if(!image||!caption||!reader||!copy)return;
let active=0,storyPage=0,pages=[],originalBlocks=[],resizeFrame=0;
const getIndex=hash=>{const m=/^#kep-([1-5])$/.exec(hash);return m?Number(m[1])-1:0;};
function mobile(){return matchMedia('(max-width:900px)').matches}
function showTextPage(index){
  storyPage=Math.max(0,Math.min(index,pages.length-1));
  pages.forEach((p,i)=>p.hidden=i!==storyPage);
  if(pageInfo)pageInfo.textContent=(storyPage+1)+' / '+Math.max(pages.length,1);
  if(prevPage)prevPage.disabled=storyPage===0;
  if(nextPage)nextPage.disabled=storyPage===pages.length-1;
}
function paginate(){
  const space=copy.clientHeight;
  if(space<=0||!originalBlocks.length)return;
  copy.replaceChildren();
  pages=[];
  // Keep the original markup but divide it across visible-height pages.
  // Long lists are split into single-item groups to avoid hidden content.
  const units=[];
  for(const block of originalBlocks){
    if(block.tagName==='UL'&&block.children.length>1){
      [...block.children].forEach(li=>{const ul=block.cloneNode(false);ul.append(li.cloneNode(true));units.push(ul)});
    }else units.push(block.cloneNode(true));
  }
  let current=document.createElement('div');current.className='story-page';
  copy.append(current);pages.push(current);
  for(const unit of units){
    current.append(unit);
    if(current.scrollHeight>space+1&&current.children.length>1){
      unit.remove();
      current=document.createElement('div');current.className='story-page';
      copy.append(current);pages.push(current);current.append(unit);
    }
    // A very small screen might not fit one large paragraph.
    // Break that paragraph into smaller chunks instead of clipping it.
    if(current.scrollHeight>space+1&&current.children.length===1&&unit.tagName==='P'&&unit.textContent.trim().includes(' ')){
      unit.remove();
      const words=unit.textContent.trim().split(/\s+/);
      let start=0;
      while(start<words.length){
        let low=1,high=words.length-start,best=1;
        while(low<=high){
          const mid=Math.floor((low+high)/2);
          const p=unit.cloneNode(false);p.textContent=words.slice(start,start+mid).join(' ');
          current.replaceChildren(p);
          if(current.scrollHeight<=space+1){best=mid;low=mid+1}else high=mid-1;
        }
        current.firstChild.textContent=words.slice(start,start+best).join(' ');
        start+=best;
        if(start<words.length){
          current=document.createElement('div');current.className='story-page';
          copy.append(current);pages.push(current);
        }
      }
    }
  }
  showTextPage(Math.min(storyPage,pages.length-1));
}
function populate(){
 const template=$(templates[active]);originalBlocks=template?[...template.content.children].map(n=>n.cloneNode(true)):[];
 storyPage=0;
 paginate();
}
function render(index){
 active=(index+images.length)%images.length;
 const item=images[active];
 image.src=item.src;image.alt=item.alt;caption.textContent=item.caption;
 if(progress)progress.textContent=String(active+1).padStart(2,'0')+' / '+String(images.length).padStart(2,'0');
 if(navIndex)navIndex.textContent=(active+1)+' / '+images.length;
 populate();
}
function go(index){
 const next=(index+images.length)%images.length,hash='#kep-'+(next+1);
 if(location.hash!==hash)history.pushState({image:next},'',hash);
 render(next);
}
$('modal-prev')?.addEventListener('click',()=>go(active-1));
$('modal-next')?.addEventListener('click',()=>go(active+1));
prevPage?.addEventListener('click',()=>showTextPage(storyPage-1));
nextPage?.addEventListener('click',()=>showTextPage(storyPage+1));
document.addEventListener('keydown',event=>{
 if(event.altKey||event.ctrlKey||event.metaKey||event.target.closest?.('input,textarea,select,[contenteditable]'))return;
 if(event.key==='ArrowLeft'){event.preventDefault();go(active-1)}
 if(event.key==='ArrowRight'){event.preventDefault();go(active+1)}
 if(event.key==='PageDown'){event.preventDefault();showTextPage(storyPage+1)}
 if(event.key==='PageUp'){event.preventDefault();showTextPage(storyPage-1)}
});
window.addEventListener('popstate',()=>render(getIndex(location.hash)));
window.addEventListener('hashchange',()=>render(getIndex(location.hash)));
window.addEventListener('resize',()=>{
 cancelAnimationFrame(resizeFrame);
 resizeFrame=requestAnimationFrame(()=>paginate());
});
let touchStart=null;
image.addEventListener('touchstart',event=>{
 if(event.touches.length===1)touchStart={x:event.touches[0].clientX,y:event.touches[0].clientY};
},{passive:true});
image.addEventListener('touchend',event=>{
 if(!touchStart||!event.changedTouches.length)return;
 const dx=event.changedTouches[0].clientX-touchStart.x,dy=event.changedTouches[0].clientY-touchStart.y;
 touchStart=null;
 if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.5)go(active+(dx<0?1:-1));
},{passive:true});
render(getIndex(location.hash));
})();