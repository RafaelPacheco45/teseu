'use strict';
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const canAnimate = () => !document.body.classList.contains('motion-paused');
  const menuButton = document.querySelector('.menu-toggle');
  const siteNavigation = document.getElementById('site-navigation');
  function closeMenu(returnFocus = false) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    siteNavigation.classList.remove('is-open');
    if (returnFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    siteNavigation.classList.toggle('is-open', open);
  });
  siteNavigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true); });
  document.addEventListener('click', event => { if (!siteNavigation.contains(event.target) && !menuButton.contains(event.target)) closeMenu(); });
  window.matchMedia('(max-width: 800px)').addEventListener('change', () => closeMenu());
  const switcher = document.querySelector('.solution-switcher');
  const tabs = [...switcher.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  function selectPanel(id, focusTab = false) {
    if (!panels.some(panel => panel.id === id)) return;
    tabs.forEach((tab, index) => {
      const active = panels[index].id === id;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[index].hidden = !active;
      panels[index].classList.remove('panel-enter');
      if (active) {
        if (canAnimate()) panels[index].classList.add('panel-enter');
        if (focusTab) tab.focus();
      }
    });
    updateScrollProgress();
  }
  panels.forEach((panel, index) => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabs[index].id);
    panel.tabIndex = 0;
  });
  switcher.hidden = false;
  selectPanel(panels.some(p => '#' + p.id === location.hash) ? location.hash.slice(1) : panels[0].id);
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectPanel(panels[index].id));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); selectPanel(panels[next].id, true); }
    });
  });
  document.querySelectorAll('.solution-link').forEach(link => link.addEventListener('click', () => selectPanel(link.hash.slice(1))));
  window.addEventListener('hashchange', () => selectPanel(location.hash.slice(1)));
  if (panels.some(panel => '#' + panel.id === location.hash)) requestAnimationFrame(() => document.querySelector(location.hash).scrollIntoView());

  if ('IntersectionObserver' in window && !reduced.matches) {
    const elements = document.querySelectorAll('.statement,.section-head,.access-steps li,.explorer,.concept-grid article,.portfolio-note,.solution-hub,.camera-vision>div,.featured-project,.approach>div,.steps li,.faq-grid details,.contact');
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); }
    }), {threshold:.06,rootMargin:'0px 0px -15px 0px'});
    document.body.classList.add('motion-ready');
    elements.forEach(el => { el.classList.add('reveal'); reveal.observe(el); });
    document.querySelectorAll('.access-steps li,.concept-grid article').forEach((el,i) => el.style.setProperty('--reveal-delay', `${(i % 3) * 80}ms`));
  }
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.concept-grid article,.access-steps li').forEach(card => {
      card.addEventListener('pointermove', event => {
        if (!canAnimate()) return;
        const box = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', `${event.clientX - box.left}px`);
        card.style.setProperty('--spot-y', `${event.clientY - box.top}px`);
      });
    });
  }
  document.querySelectorAll('[data-destination]').forEach(button => button.addEventListener('click', () => {
    if (!canAnimate()) return;
    const route = document.getElementById('demo-route');
    const length = route.getTotalLength();
    route.getAnimations().forEach(animation => animation.cancel());
    route.animate([{strokeDasharray:`${length}`,strokeDashoffset:length},{strokeDasharray:`${length}`,strokeDashoffset:0}], {duration:650,easing:'ease-out'});
    document.getElementById('journey-title').animate([{opacity:.25,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:300});
  }));
  document.querySelector('.motion-toggle').addEventListener('click', () => {
    if (!canAnimate()) document.querySelectorAll('#demo-route,#journey-title').forEach(el => el.getAnimations().forEach(a => a.finish()));
  });
  document.addEventListener('toggle', updateScrollProgress, true);
  if ('ResizeObserver' in window) new ResizeObserver(updateScrollProgress).observe(document.querySelector('main'));
})();
