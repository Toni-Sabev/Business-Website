window.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  // Sticky shadow & dynamic contrast theme on scroll
  if (header) {
    const isHome = document.querySelector('.globe-hero');
    const isCompass = document.querySelector('.compass-page');
    const logoImg = header.querySelector('.logo-img');
    const initialDark = isHome || isCompass;

    const updateLogo = () => {
      if (!logoImg) return;
      if (header.classList.contains('site-header--light')) {
        logoImg.src = '/assets/logo.png';
      } else {
        logoImg.src = '/assets/logo-white.png';
      }
    };

    if (!initialDark) {
      header.classList.add('site-header--light');
    } else {
      header.classList.add('site-header--dark');
    }
    updateLogo();

    const onScroll = () => {
      const scrolled = window.scrollY > 80;
      header.classList.toggle('scrolled', scrolled);

      if (isHome) {
        const heroHeight = isHome.offsetHeight || 800;
        if (window.scrollY > heroHeight - 120) {
          if (!header.classList.contains('site-header--light')) {
            header.classList.add('site-header--light');
            header.classList.remove('site-header--dark');
            updateLogo();
          }
        } else {
          if (!header.classList.contains('site-header--dark')) {
            header.classList.add('site-header--dark');
            header.classList.remove('site-header--light');
            updateLogo();
          }
        }
      }
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
