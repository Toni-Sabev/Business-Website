# Успешно Бъдеще — Business Website

Static marketing website for **Успешно Бъдеще (Successful Future)**, a Bulgarian education advisory that helps student-athletes get from Bulgaria to US universities.

---

## What the project is

Успешно Бъдеще guides Bulgarian students through every stage of the US university process — from school selection and financial planning to housing and in-school consulting. The site serves as the public face of the business, presenting the three co-founders and their services to prospective students and parents.

---

## Pages

| File | Purpose |
|---|---|
| `about.html` | Main landing page — What We Do, service areas, and the three founder profiles |
| `blog/index.html` | Resources — article listing with category filters (Finance, Visa, Essays, etc.) |
| `contact.html` | Contact form + booking enquiry |
| `index.html` | Home / splash (placeholder sections) |
| `pricing.html` | Pricing tiers (placeholder) |
| `team.html` | Advisors page (placeholder) |

Navigation is simplified to three primary links: **About · Resources · Contact**.

---

## Components built so far

### Design system (`styles/`)
- `tokens.css` — CSS custom properties: navy `#182845`, Bulgarian red `#D62612`, Bulgarian green `#00966E`, spacing scale, radii, shadows, typography tokens
- `base.css` — reset, body defaults, container, section padding
- `components.css` — all reusable UI components (see below)
- `styles/pages/` — page-specific overrides (home, contact, pricing, about)

### UI components
- **Header** — sticky with blur backdrop, scrolled-shadow via JS, Bulgarian flag accent, EN/BG language toggle
- **Mobile nav drawer** — hamburger toggle, slides in on mobile
- **Logo + brand name** — image mark with text label that switches language on toggle
- **Buttons** — `btn--primary` (red), `btn--ghost` (navy outline), `btn--ghost-white`, sizes `sm / md / lg`
- **Founder cards** — horizontal layout at ≥640 px (photo left, content right); sequential vertical stack; includes role, name, credential badges, bio, achievement list, LinkedIn link
- **Credential badges** — small green pill tags for qualifications
- **Service items** — icon + heading + description cards in a responsive grid
- **Holistic block** — navy callout banner with icon
- **Blog cards** — thumbnail + meta + title grid with featured hero card
- **Filter bar** — pill buttons for article category filtering
- **Contact form** — role radio, grade select, email, phone (optional), preferred contact method, message textarea with character counter, honeypot spam field, client-side validation
- **Contact details sidebar** — office, email, hours, map placeholder
- **CTA section** — full-width navy band with concentric circle ornament
- **Footer** — brand column, pages column, contact column; Bulgarian flag bar accent
- **Flag decoration** — white / green / red bars used as dividers and accents throughout

### Scripts (`scripts/`)
- `i18n.js` — EN/BG language toggle; persists choice in `localStorage`; uses `innerHTML` so translated strings can include HTML formatting; auto-detects browser language (`navigator.language`) as fallback
- `nav.js` — sticky header shadow on scroll, mobile menu open/close, active nav link detection

### Assets (`assets/`)
- `logo.png` — brand mark (navy runner/graduate figure with Bulgarian flag swoosh)
- `assets/founders/simeon.jpg` — Simeon Sabev
- `assets/founders/kaloyan.jpg` — Kaloyan Levterov (Olympic photo)
- `assets/founders/toni.jpg` — Tonislav Sabev

---

## Founders

| Name | Role | Highlights |
|---|---|---|
| Simeon Sabev | Co-Founder | Mathematics & Economics, CFA L1, Financial Data Analyst @ MSCI |
| Kaloyan Levterov | Co-Founder | Olympian (Tokyo 2020), National Record Holder, Financial Data Analyst @ MSCI |
| Tonislav (Toni) Sabev | Co-Founder | National Record Holder (50m breaststroke), NCAA Qualifier, Data Analyst @ Bloomberg |

---

## Tech stack

Plain HTML5 / CSS3 / vanilla JS — no framework, no build step, no dependencies. Open any `.html` file directly in a browser.
