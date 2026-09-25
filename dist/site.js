const toggle=document.querySelector('.menu-toggle');
const mobile=document.querySelector('.mobile-menu');
if(toggle&&mobile){
  const links=[...mobile.querySelectorAll('a')];
  const closeMenu=(restoreFocus=false)=>{
    mobile.hidden=true;
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Abrir menu');
    document.querySelector('.site-header').classList.remove('menu-open');
    document.body.classList.remove('menu-active');
    if(restoreFocus)toggle.focus();
  };
  toggle.addEventListener('click',()=>{
    const open=toggle.getAttribute('aria-expanded')!=='true';
    if(!open){closeMenu();return;}
    toggle.setAttribute('aria-expanded','true');
    toggle.setAttribute('aria-label','Fechar menu');
    mobile.hidden=false;
    document.querySelector('.site-header').classList.add('menu-open');
    document.body.classList.add('menu-active');
    links[0]?.focus();
  });
  links.forEach(link=>link.addEventListener('click',()=>closeMenu()));
  document.addEventListener('keydown',event=>{
    if(mobile.hidden)return;
    if(event.key==='Escape'){event.preventDefault();closeMenu(true);return;}
    if(event.key!=='Tab')return;
    const first=links[0],last=links[links.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();toggle.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();toggle.focus();}
    else if(event.shiftKey&&document.activeElement===toggle){event.preventDefault();last?.focus();}
    else if(!event.shiftKey&&document.activeElement===toggle){event.preventDefault();first?.focus();}
  });
  window.addEventListener('resize',()=>{if(window.innerWidth>1190&&!mobile.hidden)closeMenu()},{passive:true});
}
const filters=document.querySelectorAll('[data-filter]');const search=document.querySelector('#project-search');function updateProjects(){const value=document.querySelector('[data-filter].active')?.dataset.filter||'todos';const query=(search?.value||'').trim().toLocaleLowerCase('pt-BR');let shown=0;document.querySelectorAll('[data-category]').forEach(item=>{const match=(value==='todos'||item.dataset.category===value)&&(!query||item.dataset.search.includes(query));item.hidden=!match;if(match)shown++});const result=document.querySelector('#archive-result');if(result)result.textContent=shown===1?'1 projeto':`${shown} projetos`;const empty=document.querySelector('#archive-empty');if(empty)empty.hidden=shown!==0}filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});updateProjects()}));search?.addEventListener('input',updateProjects);
const header=document.querySelector('.site-header');if(header){const updateHeader=()=>header.classList.toggle('stuck',window.scrollY>100);window.addEventListener('scroll',updateHeader,{passive:true});updateHeader()}

// Keep gallery layouts useful if an image fails to load.
const unavailableImage='/image-unavailable.webp';
function showImageFallback(image){
  if(image.dataset.imageFallback||!image.src.includes('/images/'))return;
  image.dataset.imageFallback='true';
  image.alt='Imagem temporariamente indisponível: '+image.alt;
  image.removeAttribute('srcset');
  image.src=unavailableImage;
}
document.addEventListener('error',event=>{
  if(event.target instanceof HTMLImageElement)showImageFallback(event.target);
},true);
document.querySelectorAll('img').forEach(image=>{
  if(image.complete&&!image.naturalWidth)showImageFallback(image);
});

// Motion adds hierarchy as sections enter the viewport. Content stays visible without JS.
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
const revealSelector=[
  '.manifesto-main h2','.manifesto-description','.feature-primary-image','.feature-primary-copy',
  '.feature-secondary article','.numbers-panel','.service-columns>a','.founder-summary',
  '.process-columns>div','.case-reference-grid>div:nth-child(2)',
  '.page-intro h1','.page-intro>p:last-child','.archive-grid>div','.contest-list .archive-card',
  '.archive-content','.archive-fact-group','.highlight-item','.course-overview>div',
  '.course-editions li','.course-gallery-grid figure'
].join(',');
const revealElements=[...document.querySelectorAll(revealSelector)];
if(!reducedMotion.matches&&'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries){
      if(!entry.isIntersecting)continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  },{rootMargin:'0px 0px -40px 0px',threshold:0.06});
  for(const element of revealElements){
    // The first viewport must never wait for a scroll event to become readable.
    if(element.getBoundingClientRect().top<window.innerHeight-35){
      element.classList.add('is-visible');
      continue;
    }
    element.classList.add('scroll-reveal');
    observer.observe(element);
  }
  document.body.classList.add('motion-ready');
  reducedMotion.addEventListener('change',event=>{
    if(!event.matches)return;
    observer.disconnect();
    document.body.classList.remove('motion-ready');
    for(const element of revealElements)element.classList.add('is-visible');
  });
}

// A short image shift creates depth without changing the page's scroll speed.
const hero=document.querySelector('.hero-reference,.archive-hero,.course-cover');
const heroImage=hero?.querySelector('.hero-image img, img.cover, .course-cover-image img');
const parallaxAllowed=window.matchMedia('(min-width: 701px) and (prefers-reduced-motion: no-preference)');
if(hero&&heroImage){
  let scheduled=false;
  const updateParallax=()=>{
    scheduled=false;
    if(!parallaxAllowed.matches){heroImage.style.transform='';return;}
    const bounds=hero.getBoundingClientRect();
    if(bounds.bottom<0||bounds.top>window.innerHeight)return;
    const progress=Math.max(0,Math.min(1,-bounds.top/hero.offsetHeight));
    const distance=Math.min(45,hero.offsetHeight*.045);
    heroImage.style.transform=`translate3d(0,${(progress*distance).toFixed(1)}px,0) scale(1.08)`;
  };
  const scheduleParallax=()=>{if(scheduled)return;scheduled=true;requestAnimationFrame(updateParallax)};
  window.addEventListener('scroll',scheduleParallax,{passive:true});
  window.addEventListener('resize',scheduleParallax,{passive:true});
  parallaxAllowed.addEventListener('change',scheduleParallax);
  scheduleParallax();
}
