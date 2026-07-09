# Успешно Бъдеще — Architecture

> How the site is built, what each file does, and how the pieces connect.

---

## Overview

The Successful Future (Успешно Бъдеще) platform is a high-performance marketing website, interactive guidance utility, and AI assistant interface. While it avoids the complexity of heavy single-page application (SPA) frameworks or build steps to keep local development instantaneous, it features an advanced client-side architecture incorporating **3D WebGL visuals**, **dynamic theme-switching systems**, **3D CSS animations**, and **Edge AI Workers**.

### 🌟 Key Advanced Features & Technologies

1. **3D WebGL Graphics & Particle Systems (Three.js)**:
   - **Interactive Scroll-Driven Continent-Dot Globe** (`scripts/globe.js`): Interactive globe on the Home page that rotates and scales dynamically with scroll. Integrates a bilingual Saint-Exupéry motto that fades synchronously with the globe framing.
   - **Procedural 3D Logo Planet** (`scripts/compass-planet.js`): Replaces the flat 2D owl logo on the Compass page with a rotating 3D spherical dome featuring custom procedural bump relief maps, physically-based rendering (PBR), and metallic ice-blue key lighting.
   - **3D Space Orbit Trajectory Background** (`scripts/orbital-bg.js`): Site-wide floating orbit animation that serves as a background canvas for overlaying content.

2. **Rich UI Aesthetics & Dynamic Theme Contrasting**:
   - **Dynamic Floating Header Contrast** (`scripts/nav.js`): Floats overlays directly onto dark blue sections. Real-time scroll detection switches the header class between transparent dark (`site-header--dark`) and light glass mode (`site-header--light`) for perfect readability. Automatically swaps logo assets (`assets/logo-white.png` vs `assets/logo.png`) based on the active theme.
   - **3D CSS Flip Cards** (`index.html`): Offers detailed packages with 3D rotation transforms (`transform-style: preserve-3d` and `backface-visibility`) that flip on hover/tap to reveal features.
   - **Frosted Glassmorphism UI**: Uses `backdrop-filter: blur(16px)` and translucent surfaces to display forms and cards over the 3D space orbit canvas.

3. **Immersive Edge AI Integration**:
   - **Compass Chat Assistant** (`compass/index.html`): Full-featured chat UI with message bubbles, typing indicators, and suggestion chips.
   - **Cloudflare Worker Proxy** (`worker/compass.js`): Proxy routing to the Gemini 2.5 Flash API with built-in context history management (last 3 turns), strict role-based prompts, and HTTP 429 rate-limit fallback.

---

## File Layout

Every user-facing page follows **clean directory-based routing** (lives as `/slug/index.html` to resolve extensionless). 

```
successful-future/
├── index.html              # Home page (/) — Dot Globe, Saint-Exupéry quote, 3D flip packages, offer cards
├── about/index.html        # About (/about/) — Who We Do, Services, Founders (dual photo stack)
├── contact/index.html      # Contact (/contact/) — Glassmorphism form, Sofia map, orbital bg canvas
├── resources/index.html    # Resources (/resources/) — Article index with category chips
├── compass/index.html      # Compass (/compass/) — Chat UI, 3D spherical logo planet canvas
├── privacy/index.html      # Privacy (/privacy/)
├── terms/index.html        # Terms (/terms/)
│
├── articles/               # Long-form guides, each with its own clean URL (/articles/<slug>/)
│   ├── employment-international-athlete/index.html
│   ├── stem-international-athlete/index.html
│   ├── ncaa-international-athlete-guide/index.html
│   └── sevis-i20-f1-lifecycle/index.html
│
├── pricing.html            # Unused legacy file
├── team.html               # Unused legacy file
│
├── CNAME                   # Custom domain (uspeshno-budeshte.org)
├── .nojekyll               # Disables Jekyll processing on GitHub Pages
├── robots.txt              # Search engine crawler directives
├── sitemap.xml             # Sitemap with clean URLs
├── README.md               # Readme instructions
│
├── assets/
│   ├── logo.png            # Runner/graduate logo asset for light backgrounds
│   ├── logo-white.png      # White logo asset for dark background canvases
│   ├── compass-logo.png    # Owl logo fallback asset
│   └── founders/
│       ├── simeon.jpg / simeon-2.webp   # Simeon Sabev (portrait / butterfly action)
│       ├── kaloyan.jpg / kaloyan-2.jpg   # Kaloyan Levterov (podium / Tokyo Olympic dive)
│       └── toni.jpg / toni-2.jpg         # Tonislav Sabev (portrait / swim celebration)
│
├── scripts/
│   ├── globe.js            # 3D interactive continent-dot globe (Three.js WebGL)
│   ├── compass-planet.js   # 3D spherical dome logo planet rendering (Three.js WebGL)
│   ├── orbital-bg.js       # Site-wide 3D background orbital trajectory animation
│   ├── i18n.js             # Bilingual translation layer (localStorage, data-en/bg attributes)
│   └── nav.js              # Scrolling header contrast controller, logo asset swapper, mobile menu
│
├── styles/
│   ├── tokens.css          # Design tokens (CSS custom properties)
│   ├── base.css            # Reset, typography, container, section spacing
│   ├── components.css      # Header, footer, cards, buttons, forms — all shared components
│   └── pages/
│       ├── about.css       # About-page overrides (mostly empty — inline <style> used)
│       ├── contact.css     # Contact layout, form styles, map placeholder
│       ├── article.css     # Long-form article layout
│       ├── home.css, pricing.css, resources.css
│
├── worker/
│   └── compass.js          # Cloudflare Worker powering the Compass AI assistant
│
├── files/                  # Dev-only snippets/templates — NOT deployed pages
├── dev/
│   └── fonts.html          # Dev-only Cyrillic font-candidate audit/preview — not linked, not deployed
│
└── wiki/                   # This directory
    ├── architecture.md
    ├── vision.md
    └── devlog.md
```

> **Asset & link paths are root-relative.** All pages reference shared assets as
> `/styles/…`, `/scripts/…`, `/assets/…` and link to other pages as `/about/`, `/contact/`, `/`.
> This is depth-independent — a page works the same whether it sits at `/about/` or
> `/articles/<slug>/` — and assumes the site is served from the domain root (it is:
> `uspeshno-budeshte.org`).

---

## Design System (`tokens.css`)

All values live as CSS custom properties on `:root`.

### Colours

Royal-blue / eggplant palette on a cream canvas (token *names* are legacy — `--color-red` is eggplant, `--color-green` is royal blue, not the literal Bulgarian-flag colors the names suggest).

| Token | Value | Usage |
|---|---|---|
| `--color-navy` | `#0A2247` | Primary deep navy — dark sections, footer, globe background |
| `--color-navy-mid` | `#103A6E` | Medium navy, gradients |
| `--color-navy-deep` | `#061327` | Darkest navy — footer base |
| `--color-red` | `#A0006D` | Eggplant — primary CTA accent |
| `--color-red-soft` | `#C21E8A` | Lighter eggplant — hover state |
| `--color-green` | `#4A8BDF` | Royal blue — the lead brand color (eyebrows, links, chips, badges) |
| `--color-green-soft` | `#2E6BC4` | Royal blue deep |
| `--color-cream` | `#F5F3EE` | Page background |
| `--color-cream-soft` | `#FFFFFF` | Card background (pure white) |
| `--color-taupe` | `#E3E9F2` | Blue-tinted chip backgrounds |
| `--color-ink` | `#0E2138` | Body text & headings |
| `--color-muted` | `#5B7290` | Secondary text |
| `--color-rule` | `rgba(20,50,90,0.10)` | Hairline dividers |

### Typography

Bulgarian (default language) and English use **different font pairs**, switched via `html[lang="en"]` overriding the `:root` defaults.

| Token | BG (default) | EN (`html[lang="en"]`) | Usage |
|---|---|---|---|
| `--font-display` | Lora | Playfair Display | Headings, wordmark |
| `--font-body` | Lora | Inter | All body text, UI |
| `--font-serif` | Instrument Serif (both languages) | | Home hero quote, Compass intro accent text |

Both BG fonts are loaded from the shared per-page Google Fonts `<link>` in `<head>` (alongside Instrument Serif); the EN pair is loaded via `@import` at the top of `tokens.css`. This was arrived at through live A/B testing of several Cyrillic-native candidates (Golos Text, PT Serif, Spectral, Commissioner, Bitter, Lora) directly on the site — see `dev/fonts.html` for the fuller candidate audit (Cyrillic-cut verification, Bulgarian `locl` GSUB check, variable-font/size comparison) that fed that decision.

### Spacing

`--space-1` through `--space-8` — geometric scale. `--space-4` = 32px is the standard card padding.

### Container

`--container: 1200px` with `--gutter: clamp(24px, 4vw, 64px)` side padding.

---

## i18n System (`scripts/i18n.js`)

Every visible text element has `data-en` and `data-bg` attributes. On language toggle, `setLang()` iterates all matching elements and sets `innerHTML` (not `textContent` — allows HTML tags inside translations).

**Default language**: Bulgarian (`'bg'`). Stored in `localStorage` under key `sf-lang`.

**Toggle buttons**: `<button data-toggle="lang" data-lang="en/bg">` — `aria-pressed` reflects active state.

**HTML in translations**: supported. Example:
```html
<p data-en="We guide athletes.<br>We build futures."
   data-bg="Насочваме спортисти.<br>Изграждаме бъдеще.">
```

**Adding new translatable text**: add both `data-en` and `data-bg` attributes. Default (visible) text should be Bulgarian.

---

## Pages

### `about/index.html` — About (`/about/`)

Four sections:

| Section | Content |
|---|---|
| What We Do | Intro text (max-width 720px) + 5-column services grid |
| Services | University Selection, Budgeting, Admissions, Career, Holistic Support |
| Founders | Three horizontal cards — portrait photo (top) + action photo (bottom), credentials, bio, achievements, LinkedIn |
| CTA | Navy block — "Get in touch" button linking to `/contact/` |

**Inline `<style>` block** handles page-specific layout (services grid breakpoints, founder card two-photo stack, holistic block, credential badges).

**Services grid breakpoints**:
```
< 640px  → 1 column
≥ 640px  → 2 columns
≥ 900px  → 3 columns
≥ 1100px → 5 columns, gap: 16px
```

### `contact/index.html` — Contact (`/contact/`)

Two areas side-by-side (`.contact-layout`):

**Left — Form** (`.contact-form`):
- Fields: role (radio), full name, grade (select), email, phone (optional), preferred contact (radio), message (textarea, 500 char limit)
- Honeypot field (`_gotcha`) for spam prevention
- All labels and options bilingual (EN/BG)
- Submits via `fetch` to Formspree — shows inline success/error state

**Right — Details sidebar** (`.contact-details`):
- Email: `info@uspeshno-budeshte.com`
- Hours: Mon–Fri, 9:00–18:00 EET
- Google Maps embed: Sofia, Bulgaria pin

---

## Founder Card Layout

Each founder card (`.founder-card`) is a horizontal flex row at ≥ 640px.

**Photo panel** (`.founder-card__photo`):
- `width: 240px`, `align-self: stretch` at desktop
- `display: flex; flex-direction: column` — two images stacked
- Each image: `flex: 1; object-fit: cover`
- Separated by `border-top: 2px solid rgba(255,255,255,0.4)`
- Gradient overlay (navy, bottom) via `::after` pseudo-element in `components.css`

**Photo object-positions**:

| Photo | File | `object-position` |
|---|---|---|
| Simeon portrait | `simeon.jpg` | `center top` |
| Simeon action | `simeon-2.webp` | `center 30%` |
| Kaloyan portrait | `kaloyan.jpg` | `center top` |
| Kaloyan action | `kaloyan-2.jpg` | `center 40%` |
| Toni portrait | `toni.jpg` | `35% top` |
| Toni action | `toni-2.jpg` | `center 35%` |

---

## Form Integration (Formspree)

**Endpoint**: `https://formspree.io/f/maqvlwzr`
**Account**: `info@uspeshno-budeshte.com`

Submissions are emailed to `info@uspeshno-budeshte.com` by Formspree. Also visible in the Formspree dashboard at formspree.io.

**Flow**:
1. Client-side validation (role, name, grade, email required)
2. `fetch` POST with `FormData` + `Accept: application/json`
3. On `res.ok` → form replaced with success confirmation
4. On failure → inline error + button re-enables
5. Honeypot field (`_gotcha`) present for bot filtering

**Free tier limit**: 50 submissions/month. Upgrade if volume increases.

---

## Header & Navigation

**Desktop (≥ 1024px)**: logo + brand name | nav links | flag + lang toggle + CTA button  
**Mobile (< 1024px)**: logo + brand name | lang toggle + CTA button + hamburger | drawer nav

**Sticky**: `position: sticky; top: 0` with `backdrop-filter: blur(14px)`. Shadow appears on scroll (`scrolled` class via `nav.js`).

**Mobile nav drawer** (`.mobile-nav`): hidden by default, `.open` class toggled by hamburger click.

**Active link**: `nav.js` normalises `location.pathname` (strips trailing slash; `/` = home) and compares it against each nav link's normalised `href`, adding `.active` on a match. Clean-URL aware — see **URL Routing**.

---

## URL Routing

The site uses **clean, extensionless URLs** via **directory-based routing** — no server
rewrites or build step needed (works natively on any static host, GitHub Pages included).

**Convention**: every user-facing page is `index.html` inside a folder named for its slug.
A static host serves a directory request from its `index.html`, so the URL needs no extension:

| File on disk | Served URL |
|---|---|
| `index.html` | `/` |
| `about/index.html` | `/about/` |
| `contact/index.html` | `/contact/` |
| `articles/stem-international-athlete/index.html` | `/articles/stem-international-athlete/` |

**Canonical form has a trailing slash** (`/about/`).

**Rules when adding/editing pages:**
- New page → create `<slug>/index.html`. New article → `articles/<slug>/index.html`.
- Link between pages with root-relative clean paths: `href="/about/"`, `href="/"` (home).
- Reference shared assets root-relative: `/styles/…`, `/scripts/…`, `/assets/…`.
  Never use `../` — root-relative paths are depth-independent.
- Add the new URL to `sitemap.xml`.
- Old `.html` paths are **not** redirected (no stubs) — they 404. Acceptable because the
  site had negligible indexing under the old paths; revisit if Cloudflare analytics shows
  404s on `*.html`.

---

## Deployment

**Hosting**: GitHub Pages  
**Repo**: `https://github.com/Toni-Sabev/Business-Website`  
**Branch**: `main`  
**Custom domain**: `https://uspeshno-budeshte.org` (via `CNAME` file; GitHub auto-provisions SSL)  
**Front layer**: Cloudflare (DNS, Web Analytics, and the Compass Worker in `worker/compass.js`)

Every `git push` to `main` auto-deploys. No build step required. `.nojekyll` disables Jekyll
processing so folders are served as-is.

---

## Known Constraints

- `pricing.html` and `team.html` exist from early prototyping — not linked, not deployed; left flat (no clean URL). A cleanup pass identified their dedicated CSS (`.pricing-tier`, `.featured-badge`, `.btn--ghost-white`, `.team-card*`, `.placeholder-block`, `styles/pages/pricing.css`) as removable alongside them — not yet done, tracked in `Handoff.md`.
- `files/` holds dev-only snippets/templates, not live pages — its internal links may be stale and are not maintained
- `dev/fonts.html` holds a dev-only Cyrillic font-candidate audit page (not linked, not deployed) — real Google Fonts data (Cyrillic subset presence, Bulgarian `locl` GSUB support, variable-font size) for the display/body font decision
- `styles/pages/about.css` and `styles/pages/home.css` both contain real rules but are **not `<link>`ed from any live page** — dead/unreachable CSS, not empty as previously documented here. Not yet cleaned up.
- `compass/index.html` has no `<footer>` at all (every other live page does) — pre-existing, not addressed in the font/legal-pages work.
- The base logo uses `mix-blend-mode: multiply` which fits light backgrounds; dark headers and dark canvas backgrounds rely on `logo-white.png` to maintain visual contrast.
- Google Maps embed requires internet connection to load — shows blank grey box when offline
- Formspree free tier: first submission to a new form requires email verification from Formspree before delivery begins
- Old `*.html` URLs return 404 after the clean-URL migration (no redirect stubs)
- `/privacy/` and `/terms/` now carry real bilingual content (previously both were an accidental copy of the homepage). The contact form requires a privacy-policy consent checkbox before submission, and is restricted in copy (not technically enforced) to parents/guardians or students 18+. Clause 4 of the privacy policy intentionally does not name specific vendors (Formspree, Google, Cloudflare) — see `Handoff.md` for the fuller version and why that's a temporary simplification.
