'use strict';
// Locally bundled Lucide icons, without a runtime CDN.
function icon(name, size=18) {
  const image=document.createElement('img');
  image.src=`assets/icons/${name}.svg`;
  image.alt='';
  image.width=size;
  image.height=size;
  image.className='ui-icon';
  image.setAttribute('aria-hidden','true');
  return image;
}
const iconTargets=[
  ['.nav-cta span','arrow-up-right',16],['.hero .button span','arrow-up-right',17],
  ['.hero .text-link span','arrow-right',17],
  ['.route-icon','navigation',22],['.route-arrow','arrow-right',19],
  ['.destination b','arrow-up-right',19],['.approach .text-link span','arrow-up-right',17],
  ['.contact-button > span','arrow-up-right',22],['.back-top span','arrow-up-right',15]
];
iconTargets.forEach(([selector,name,size])=>document.querySelectorAll(selector).forEach(el=>el.replaceChildren(icon(name,size))));
const journeyIcons={coffee:'coffee',store:'shopping-bag',service:'info'};
function updateJourneyIcon(name){document.getElementById('journey-icon').replaceChildren(icon(name,24));}
updateJourneyIcon('coffee');
const journeys={coffee:{kind:'CAFÉ',icon:'☕',title:'From the entrance to your next coffee.',description:'A searchable directory and a clear route can help visitors spend less time looking for a place to pause.'},store:{kind:'RETAIL',icon:'↗',title:'From a discovery to a destination.',description:'Connect an interesting store with a practical next step: where it is, what visitors can discover, and how to reach it.'},service:{kind:'GUEST SERVICES',icon:'i',title:'The right help, easier to find.',description:'Make essential services easier to discover, with venue-verified information and routes designed around your visitors.'}};
document.querySelectorAll('[data-destination]').forEach(button=>button.addEventListener('click',()=>{const item=journeys[button.dataset.destination];document.querySelectorAll('[data-destination]').forEach(other=>{const selected=other===button;other.classList.toggle('active',selected);other.setAttribute('aria-pressed',String(selected));});document.getElementById('journey-kind').textContent=item.kind;updateJourneyIcon(journeyIcons[button.dataset.destination]);document.getElementById('journey-title').textContent=item.title;document.getElementById('journey-description').textContent=item.description;}));
const routeCoordinates={coffee:{path:'M145 210V110H180V65',x:180,y:55},store:{path:'M145 210V110H290V65',x:290,y:55},service:{path:'M145 210V110H330V175H415',x:425,y:175}};
document.querySelectorAll('[data-destination]').forEach(button=>button.addEventListener('click',()=>{const route=routeCoordinates[button.dataset.destination];document.getElementById('demo-route').setAttribute('d',route.path);document.getElementById('demo-pin').setAttribute('cx',route.x);document.getElementById('demo-pin').setAttribute('cy',route.y);}));
// Motion respects the device preference and can be paused independently.
const motionToggle = document.querySelector('.motion-toggle');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
function setMotionPaused(paused) {
  document.body.classList.toggle('motion-paused', paused);
  if (motionToggle) {
    motionToggle.setAttribute('aria-pressed', String(paused));
    motionToggle.textContent = paused ? 'Resume motion' : 'Pause motion';
  }
}
setMotionPaused(false);
if(motionToggle) motionToggle.addEventListener('click', () => setMotionPaused(!document.body.classList.contains('motion-paused')));
// Motion is explicitly enabled for this edition; the visitor can pause it.
const progressLine = document.querySelector('.scroll-progress');
function updateScrollProgress() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if(progressLine) progressLine.style.width = `${total > 0 ? Math.min(100, window.scrollY / total * 100) : 0}%`;
  document.querySelector('header').classList.toggle('scrolled', window.scrollY > 30);
}
window.addEventListener('scroll', updateScrollProgress, {passive: true});
window.addEventListener('resize', updateScrollProgress);
updateScrollProgress();
