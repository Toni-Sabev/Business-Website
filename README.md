# Успешно Бъдеще — Business Website

Static marketing website for **Успешно Бъдеще (Successful Future)**, a Bulgarian education advisory that helps student-athletes get from Bulgaria to US universities.

Deep implementation history and session-by-session notes live in `Handoff.md` and `wiki/` (`architecture.md`, `vision.md`, `devlog.md`) — this file is the quick front door, not a full changelog.

---

## What the project is

Успешно Бъдеще guides Bulgarian students through every stage of the US university process — from school selection and financial planning to housing and in-school consulting. The site serves as the public face of the business, presenting the three co-founders and their services to prospective students and parents. Bulgarian is the default language; every page has a live EN/BG toggle.

---

## Live site

**https://uspeshno-budeshte.org** — hosted on GitHub Pages (repo `Toni-Sabev/Business-Website`, branch `main`), custom domain via a `CNAME` file, DNS/CDN on Cloudflare (Web Analytics also via Cloudflare).

---

## Pages

Clean directory-based URLs (`/about/`, not `/about.html`) — the site was migrated to this scheme after the original prototype.

| Route | Purpose |
|---|---|
| `/` | Home — 3D globe hero, Saint-Exupéry motto, offer cards, track record |
| `/about/` | The three co-founders, company tenets, comparison matrix |
| `/resources/` | Article hub with category filters |
| `/articles/<slug>/` | Individual articles (4 live: `ncaa-international-athlete-guide`, `stem-international-athlete`, `employment-international-athlete`, `sevis-i20-f1-lifecycle`) |
| `/contact/` | Contact form (role, grade, contact method, privacy-consent checkbox) + booking enquiry |
| `/privacy/`, `/terms/` | Real bilingual legal text (added 2026-07-09 — previously placeholder copies of the homepage) |
| `/compass/` | AI chat assistant page — **built and functional, but currently unlinked from all navigation** (see "Compass" below) |

Primary nav is **Home · About · Resources · Contact**. `pricing.html` and `team.html` exist in the repo but are **not linked or deployed** — leftover from the original prototype, safe to ignore or delete. `dev/fonts.html` is a dev-only font audit page, also not linked/deployed.

---

## Compass (disabled, not deleted)

Compass was an AI chat assistant (Gemini API via a Cloudflare Worker, `worker/compass.js`) built out with its own 3D logo/page treatment. The site owner decided (2026-07-09) it wasn't earning its keep relative to the maintenance surface (live Worker, API dependency, extra legal disclosures) and had every link to it commented out — not deleted. `compass/index.html` and its scripts/styles still work if visited directly; the Cloudflare Worker itself is separate infrastructure and keeps running until someone pauses/deletes it in the Cloudflare dashboard.

To revive it: search the repo for `Compass disabled 2026-07-09` and uncomment each marked block (see `Handoff.md` for the full restore checklist, including a CORS mismatch in `worker/compass.js` that would need fixing first — its `ALLOWED_ORIGIN` still points at the old `github.io` URL, not `uspeshno-budeshte.org`).

---

## Design system (`styles/`)

- `tokens.css` — CSS custom properties. Current brand palette: **Royal Blue `#4A8BDF`** (lead brand color), **Eggplant `#A0006D`** (CTAs/accents), **Deep Tech Navy `#0A2247` / `#061327`** (dark sections), Crisp White / Cream `#F5F3EE` (page backgrounds). Fonts: Bulgarian side (default) uses **Lora** for both display and body text; English side uses Playfair Display (display) + Inter (body).
- `base.css` — reset, body defaults, container, section padding.
- `components.css` — reusable UI components (see below). Has a known ~54 unused/superseded selectors from earlier design iterations — not yet cleaned up.
- `styles/pages/` — page-specific overrides. `about.css`/`home.css`/`pricing.css` exist but aren't linked from any live page (dead weight, tracked in the backlog rather than deleted yet).

### UI components
- **Header** — floating/transparent, merges into the page background; dynamically switches between dark and light theme as you scroll (`nav.js`), with matching logo swap (`logo.png` / `logo-white.png`)
- **Mobile nav drawer** — hamburger toggle, slides in on mobile
- **3D globe hero** (`scripts/globe.js`) — interactive continent-dot globe on the home page
- **Orbital background** (`scripts/orbital-bg.js`) — site-wide Three.js background animation, visible behind translucent/glassmorphism sections (e.g. the contact form cards)
- **Buttons** — `btn--primary`, `btn--ghost`, `btn--ghost-white`, sizes `sm / md / lg`
- **Founder cards** — horizontal layout at ≥640px (photo left, content right), full-bleed photos; credential badges, bio, achievement list, LinkedIn link
- **Article/resource cards** — thumbnail + meta + title grid, pill-button category filter bar
- **Contact form** — role radio, grade select, email, phone (optional), preferred contact method, message textarea with character counter, required privacy-consent checkbox, honeypot spam field, client-side validation
- **Footer** — brand column, pages column (incl. Privacy/Terms links), contact column

### Scripts (`scripts/`)
- `i18n.js` — EN/BG toggle; persists choice in `localStorage`; targets `data-en`/`data-bg` (and `data-placeholder-en`/`data-placeholder-bg` for inputs); auto-detects browser language as fallback
- `nav.js` — floating header controller: scroll-based theme switching, logo swap, mobile menu, active-link detection
- `globe.js` — 3D continent-dot globe (home page hero)
- `orbital-bg.js` — site-wide 3D background animation
- `compass-planet.js` — 3D logo planet for the (currently unlinked) Compass page

### Assets (`assets/`)
- `logo.png` / `logo-white.png` — brand mark, light/dark variants for the auto-switching header
- `assets/founders/` — founder photos (Simeon, Kaloyan, Toni)
- Article hero images, package/offer illustrations

---

## Founders

| Name | Role | Highlights |
|---|---|---|
| Simeon Sabev | Co-Founder | Mathematics & Economics, CFA L1, Financial Data Analyst @ MSCI |
| Kaloyan Levterov | Co-Founder | Olympian (Tokyo 2020), National Record Holder, Financial Data Analyst @ MSCI |
| Tonislav (Toni) Sabev | Co-Founder | National Record Holder (50m breaststroke), NCAA Qualifier, Data Analyst @ Bloomberg |

---

## Tech stack

Plain HTML5 / CSS3 / vanilla JS for the site itself — no framework, no build step, no npm dependencies. `python3 -m http.server 8000` serves it locally with working clean URLs (see `Handoff.md` for the full local-preview instructions). The one non-static piece is `worker/compass.js`, a Cloudflare Worker proxying the Gemini API for the (currently unlinked) Compass page.

---

## Where to look next

- **`Handoff.md`** — session-by-session log of what changed and why, current git/deployment status, and the active backlog (known dead code, deferred legal-copy items, etc.)
- **`wiki/architecture.md`** — technical architecture in more depth
- **`wiki/vision.md`** — product direction, current-state tracking, near-term priorities
- **`wiki/devlog.md`** — historical development log
