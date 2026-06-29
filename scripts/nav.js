window.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  // Sticky shadow on scroll
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 80);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu toggle
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Mark active nav link - clean-URL aware (e.g. "/", "/about/")
  const norm = (p) => {
    p = p.replace(/\/index\.html$/, '/'); // tolerate any leftover index.html
    p = p.replace(/\/+$/, '');            // drop trailing slash(es)
    return p === '' ? '/' : p;
  };
  const current = norm(location.pathname);
  const links = document.querySelectorAll('.site-nav a, .mobile-nav a');
  links.forEach(a => {
    const href = a.getAttribute('href') || '';
    if (/^(https?:|mailto:|tel:|#)/.test(href)) return; // skip external/anchor
    if (norm(href) === current) a.classList.add('active');
  });
});
