const root = document.documentElement;
document.getElementById('theme').addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
});

// Highlight the nav link for the section sitting just under the nav bar
const links = [...document.querySelectorAll('.nav nav a')];
const setActive = id => links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
let clickedId = null;
const updateActive = () => {
  if (clickedId) return;
  const line = document.querySelector('.nav').offsetHeight + 24;
  const sections = links.filter(a => getComputedStyle(a).display !== 'none')
    .map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  let current = null;
  sections.forEach(s => { if (s.getBoundingClientRect().top <= line) current = s.id; });
  if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2) current = sections[sections.length - 1].id;
  setActive(current);
};
addEventListener('scroll', updateActive, { passive: true });
addEventListener('resize', updateActive);
updateActive();
// A clicked link stays highlighted until the jump finishes, even if the target can't reach the top
links.forEach(a => a.addEventListener('click', () => {
  clickedId = a.getAttribute('href').slice(1);
  setActive(clickedId);
  clearTimeout(a._t);
  let last = -1;
  const settle = () => { if (scrollY === last) { setTimeout(() => { clickedId = null; }, 150); return; } last = scrollY; a._t = setTimeout(settle, 120); };
  a._t = setTimeout(settle, 120);
}));

// Fade panels in as they scroll into view
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('main .panel, .sec-head').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Count up the headline numbers once
const counters = document.querySelectorAll('[data-count]');
const countObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, end = +el.dataset.count, start = performance.now();
    const tick = now => {
      const t = Math.min((now - start) / 900, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(tick);
    };
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });
counters.forEach(c => countObserver.observe(c));

// Mobile menu
const nav = document.querySelector('.nav');
const menuBtn = document.getElementById('menu-btn');
const setMenu = open => {
  nav.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', open);
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
links.forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
document.addEventListener('click', e => { if (!nav.contains(e.target)) setMenu(false); });
