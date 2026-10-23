/* Progressive enhancements: every navigation link works without JavaScript. */
(() => {
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const applyTheme = theme => {
    root.dataset.theme = theme;
    toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#111210' : '#f3f1e9';
  };
  try { const stored = localStorage.getItem('vinay-theme'); if (stored === 'dark' || stored === 'light') applyTheme(stored); } catch (_) { /* Storage is optional. */ }
  toggle.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('vinay-theme', next); } catch (_) { /* Theme still works without persistence. */ }
  });
  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!motion.matches) {
          entry.target.classList.add('entering');
          entry.target.addEventListener('animationend', () => entry.target.classList.remove('entering'), { once: true });
        }
        reveal.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach(el => reveal.observe(el));
    const navLinks = [...document.querySelectorAll('.nav-links a')];
    const sections = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.hash === '#' + entry.target.id;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -55% 0px' });
    navLinks.forEach(link => { const target = document.querySelector(link.hash); if (target) sections.observe(target); });
  }
  let scheduled = false;
  const progress = document.querySelector('.reading-progress');
  const update = () => {
    const total = root.scrollHeight - window.innerHeight;
    progress.style.width = Math.max(0, Math.min(100, total > 0 ? window.scrollY / total * 100 : 0)) + '%';
    scheduled = false;
  };
  window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
