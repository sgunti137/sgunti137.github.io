const root = document.documentElement;
document.getElementById('theme').addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
});

// Highlight the nav link for the section in view
const links = [...document.querySelectorAll('.nav nav a')];
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section[id]').forEach(s => navObserver.observe(s));

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
