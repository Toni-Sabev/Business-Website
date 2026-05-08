const KEY = 'sf-lang';

function setLang(lang) {
  localStorage.setItem(KEY, lang);
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-en],[data-bg]').forEach(el => {
    const txt = el.dataset[lang];
    if (txt != null) el.innerHTML = txt;
  });
  document.querySelectorAll('[data-toggle="lang"]').forEach(b => {
    b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
  });
}

const initial = localStorage.getItem(KEY) ||
  (navigator.language?.startsWith('bg') ? 'bg' : 'en');

window.addEventListener('DOMContentLoaded', () => {
  setLang(initial);
  document.querySelectorAll('[data-toggle="lang"]').forEach(b => {
    b.addEventListener('click', () => setLang(b.dataset.lang));
  });
});
