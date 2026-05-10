const KEY = 'sf-lang';

function setLang(lang) {
  localStorage.setItem(KEY, lang);
  document.documentElement.lang = lang;

  // innerHTML — elements with data-en or data-bg
  document.querySelectorAll('[data-en],[data-bg]').forEach(el => {
    const txt = el.dataset[lang];
    if (txt != null) el.innerHTML = txt;
  });

  // HTML attributes — convention: data-[attrname]-en / data-[attrname]-bg
  // e.g. data-placeholder-en="…" sets the placeholder attribute when EN is active.
  // To add a new translatable attribute anywhere on the site, just add the data pair.
  document.querySelectorAll('*').forEach(el => {
    for (const attr of el.getAttributeNames()) {
      if (!attr.startsWith('data-') || !attr.endsWith(`-${lang}`)) continue;
      const target = attr.slice(5, -(lang.length + 1)); // strip "data-" prefix and "-lang" suffix
      if (!target) continue; // skip bare data-en / data-bg (handled above)
      el.setAttribute(target, el.getAttribute(attr));
    }
  });

  document.querySelectorAll('[data-toggle="lang"]').forEach(b => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  });
}

const initial = localStorage.getItem(KEY) || 'bg';

window.addEventListener('DOMContentLoaded', () => {
  setLang(initial);
  document.querySelectorAll('[data-toggle="lang"]').forEach(b => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });
});
