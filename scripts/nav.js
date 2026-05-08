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

  // Mark active nav link
  const links = document.querySelectorAll('.site-nav a, .mobile-nav a');
  const path = location.pathname.replace(/\/$/, '') || '/index.html';
  links.forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/index.html';
    if (path.endsWith(href) || (href === 'index.html' && (path === '' || path === '/'))) {
      a.classList.add('active');
    }
  });
});
