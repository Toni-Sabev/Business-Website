# Успешно Бъдеще — Architecture

> How the site is built, what each file does, and how the pieces connect.

---

## Overview

Plain HTML5 / CSS3 / vanilla JS — no framework, no build step, no dependencies.
Live pages: **Home** (`index.html`), **About**, **Contact**, **Resources**, **Compass**, plus **Privacy** / **Terms** and a set of long-form **articles**. Static assets served from the same repo.
Form submissions handled by Formspree (external SaaS) — no backend required.

URLs are **clean / extensionless** via directory-based routing — every page is a `index.html` inside a named folder, so it resolves as `/about/` rather than `/about.html`. See **URL Routing** below.

---

## File Layout

Each user-facing page lives in its own folder as `index.html` so the served URL is clean
(`/about/`, `/contact/`, …). `index.html` at the repo root is the home page (`/`).

```
successful-future/
├── index.html              # Home page (/) — offer, hero, packages, who-we-are, Compass, CTA
├── about/index.html        # About (/about/) — What We Do, Services, Founders, CTA
├── contact/index.html      # Contact (/contact/) — enquiry form + sidebar details
├── resources/index.html    # Resources (/resources/) — article index
├── compass/index.html      # Compass (/compass/) — AI assistant page
├── privacy/index.html      # Privacy (/privacy/)
├── terms/index.html        # Terms (/terms/)
│
├── articles/               # Long-form guides, each its own clean URL (/articles/<slug>/)
│   ├── employment-international-athlete/index.html
│   ├── stem-international-athlete/index.html
│   ├── ncaa-international-athlete-guide/index.html
│   └── sevis-i20-f1-lifecycle/index.html
│
├── pricing.html            # Unused / unlinked — left flat (not deployed as a live page)
├── team.html               # Unused / unlinked — left flat
│
├── CNAME                   # Custom domain: uspeshno-budeshte.org
├── .nojekyll               # Disable Jekyll processing (plain static site)
├── robots.txt              # Allow all + sitemap pointer
├── sitemap.xml             # Clean-URL sitemap (all live pages)
├── README.md               # Project readme
│
├── assets/
│   ├── logo.png            # Runner/graduate figure logo (mix-blend-mode: multiply on cream bg)
│   └── founders/
│       ├── simeon.jpg      # Simeon Sabev — portrait
│       ├── simeon-2.webp   # Simeon Sabev — butterfly stroke action
│       ├── kaloyan.jpg     # Kaloyan Levterov — podium/suit photo
│       ├── kaloyan-2.jpg   # Kaloyan Levterov — Tokyo 2020 Olympic dive
│       ├── toni.jpg        # Tonislav Sabev — portrait
│       └── toni-2.jpg      # Tonislav Sabev — swimming celebration
│
├── scripts/
│   ├── i18n.js             # EN/BG language toggle (localStorage, innerHTML)
│   └── nav.js              # Sticky header shadow + mobile menu toggle + active link
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

| Token | Value | Usage |
|---|---|---|
| `--color-navy` | `#182845` | Primary brand, headings, nav active |
| `--color-red` | `#D62612` | Bulgarian flag red, accents |
| `--color-green` | `#00966E` | Bulgarian flag green, credentials, labels |
| `--color-cream` | `#F5F3EE` | Page background |
| `--color-cream-soft` | slightly lighter cream | Card backgrounds |
| `--color-ink` | near-black | Body text |
| `--color-muted` | mid-grey | Secondary text |
| `--color-rule` | light grey | Borders, dividers |

### Typography

| Token | Font | Usage |
|---|---|---|
| `--font-display` | Source Serif 4 | Headings, wordmark |
| `--font-body` | Manrope | All body text, UI |

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

- `pricing.html` and `team.html` exist from early prototyping — not linked, not deployed; left flat (no clean URL)
- `files/` holds dev-only snippets/templates, not live pages — its internal links may be stale and are not maintained
- `styles/pages/about.css` is empty — all About page layout lives in an inline `<style>` block in `about/index.html`
- Logo uses `mix-blend-mode: multiply` — only looks correct on the cream background; would need adjustment on dark sections
- Google Maps embed requires internet connection to load — shows blank grey box when offline
- Formspree free tier: first submission to a new form requires email verification from Formspree before delivery begins
- Old `*.html` URLs return 404 after the clean-URL migration (no redirect stubs)
