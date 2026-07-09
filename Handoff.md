# Session Handoff & Master Handout — Успешно Бъдеще Website

_Last updated: July 9, 2026. Master documentation reflecting completed website prototype redesign, architecture, live functionality, and Git repository status._

---

## ✅ Session Update — July 9, 2026: Font cleanup + legal pages — site marked good standing

**Fonts**: Bulgarian (default) side moved off "Graduate" (a single-weight font that was forcing synthetic/fake bold everywhere) through a live-tested sequence — Golos Text, PT Serif, Spectral, Commissioner, Bitter — landing on **Lora** for both `--font-display` and `--font-body`. English side (Playfair Display + Inter) was reviewed and kept as-is. A dev-only audit page, `dev/fonts.html`, was built with real Google Fonts data (Cyrillic-cut verification, Bulgarian `locl` GSUB inspection via fontTools, variable-font/size comparison) backing the decision — not linked, not deployed.

**Bugs fixed**:
- Contact page email address (`info@uspeshno-budeshte.com`) was wrapping mid-word onto two lines in both the contact-details card and every page's footer — added `white-space: nowrap`.
- Site footer had two stacked divider lines instead of one (`.footer-bottom` and its child `.footer-legal` each had their own `border-top`) — removed the redundant one.
- Home page hero: the Saint-Exupéry quote's bottom line overlapped the 3D globe's topmost landmass dots on desktop. Fixed by nudging the globe's rest-state vertical offset (`scene.position.y` in `scripts/globe.js`, the `wide` branch) from `0` to `-0.16` — verified with real screenshots at 1440×900, a short 1440×760 laptop height, and mobile (unaffected, separate code branch).
- Two article pages (NCAA guide, SEVIS lifecycle) had dead `href="#"` placeholder links for Privacy/Terms in their footer — pointed at the real `/privacy/` and `/terms/` routes.

**Legal pages** (`/privacy/`, `/terms/`): both were, until today, an accidental byte-for-byte copy of the homepage — no real policy text existed anywhere on the site. Replaced with real bilingual (`data-lang-content` pattern, matching the article-page convention) content based on `legal-pages-task.md`, after getting explicit answers from the site owner on the three open questions in that doc:
- **Controller**: not yet a registered ЕООД — controller is the named individual Tonislav Sabev, correspondence address ulitsa "Professor Georgi Zlatarski", Sofia, Bulgaria.
- **Minors**: enquiry form is restricted (by copy, not technical enforcement) to parents/guardians or students 18+; clause 8 and a form-level notice both reflect this.
- **Compass/Gemini**: confirmed running on the **free Gemini tier** — clause 4 originally disclosed the training implication, but see the backlog item below, this was later simplified at the owner's request.
- Contact form got a required, unticked privacy-consent checkbox (blocks submission, verified via real form-fill test) and an age-restriction notice.
- Compass page got a one-line "Compass can make mistakes" disclaimer under the chat input.
- Footer "Pages" column now includes Privacy/Terms links on every page that has a footer (10 of 11 live pages — `compass/index.html` has no footer at all, pre-existing, not addressed here).
- At the owner's follow-up request, the "Legal" / "Правна информация" badge was removed from both pages' headers, and privacy clause 4/5 was genericized to drop specific vendor names (Formspree, Google, Cloudflare) and the Gemini free-tier detail — the removed text is preserved in full in the backlog section below.

**Wiki**: `architecture.md`'s Design System section (colors *and* fonts) was significantly out of date — described an old navy/red/green palette and Source Serif 4 + Manrope, neither of which matches `tokens.css` and hadn't for some time. Corrected to reflect actual current values. `vision.md`'s Current State table and Near-Term list updated; the "Contact Form Success — Bilingual" near-term item was removed because it's already implemented (verified in `contact/index.html`'s `FORM_STRINGS`).

---

## ✅ Session Update — July 9, 2026 (later same day): Compass disabled — decided not useful enough to keep live

Site owner's call: Compass (the AI chat assistant) wasn't earning its keep — not useful enough to justify the ongoing maintenance surface (live Cloudflare Worker, Gemini API dependency, the privacy/legal disclosures it required). Decision was to **disable, not delete** — everything is kept in the repo in case it's revisited later, but nothing on the live site links to it anymore.

**What was done:**
- Every link to `/compass/` was wrapped in an HTML comment (not deleted) — primary nav and mobile nav on all 10 pages that had one, the footer "Pages" column on the 3 pages that listed it (`index.html`, `privacy/index.html`, `terms/index.html`), and the `sitemap.xml` entry. Each comment is tagged `Compass disabled 2026-07-09, kept for possible future use` so they're easy to find and revert.
- The home page's entire "Meet Compass" teaser section (`#compass-section` in `index.html` — eyebrow, heading, topic chips, fake chat preview, CTA button) was wrapped in a single HTML comment, following the same pattern already used for the old flags-photo hero elsewhere in that file (see the "OLD HERO" comment block for the precedent).
- **Files deliberately left untouched and fully functional**: `compass/index.html`, `scripts/compass-planet.js`, `styles/pages/compass.css`, `worker/compass.js`. If you navigate directly to `/compass/` on the live site, it still works exactly as before — it's just not linked from anywhere a visitor would naturally end up.
- `/privacy/` clause 2's "Compass assistant" data-collection bullet was commented out (both languages). Clauses 3, 4, and 8, which each had a short "...and the Compass assistant" / "...or the Compass assistant" phrase woven into an otherwise-still-needed sentence, were directly edited to remove just that phrase (not comment-out-able without breaking the sentence — the original wording is in git history if needed).
- `/terms/` clause 6 ("Compass") was commented out in full (both languages), and clauses 7–12 were renumbered to 6–11 so the live page reads as a clean, gapless list. Verified in-browser that both language versions render 1–11 with no trace of Compass.
- **Not touched**: `wiki/devlog.md` (historical log, not rewritten), the Compass-specific CORS/Worker-logging backlog items below (resolved by disablement, see updated notes there), and the actual deployed Cloudflare Worker service itself — that's infrastructure outside this repo; if the site owner wants to stop paying for/running it, it needs to be paused or deleted directly in the Cloudflare dashboard.

**To restore Compass in a future session:** search the repo for `Compass disabled 2026-07-09` — every commented-out block carries that exact string as a marker. Uncomment each, restore the two edited privacy-clause phrases (see git history around this commit), and re-renumber `/terms/` clauses 6–11 back up to 7–12 with a new clause 6 for Compass.

---

## 🚀 Preview & Run Locally
From project root (`Business Website/`):
```bash
python3 -m http.server 8000
```
Then open **http://localhost:8000/** in your browser. Clean directory-based URLs work seamlessly across all pages:
`/`, `/about/`, `/contact/`, `/resources/`, `/compass/`, `/articles/<slug>/`.

---

## 🚦 Git & Deployment State
- **Production Repository**: `Toni-Sabev/Business-Website`, branch `main`, hosted on GitHub Pages with custom domain **uspeshno-budeshte.org** (Cloudflare DNS, Cloudflare Web Analytics, Compass Cloudflare AI Worker).
- **Git Commit**: `5d01ea4` — "Bulgarian font pass, layout fixes, and real privacy/terms pages" (committed & pushed to remote `main`, 2026-07-09).
- **Status**: Font cleanup and legal-pages work complete, pushed to `main`. Site considered in good standing for this phase — see the Backlog section below for what's still open and deliberately deferred.

---

## 🛠️ Master Summary of Accomplishments & Features

### 1. 🌌 Floating Merged Header & Dynamic Theme Switching (`styles/components.css`, `scripts/nav.js`)
- **Transparent Merged Header**: Removed solid white background and borders (`background: transparent`). The navigation floats overlays directly onto the dark blue gradient background on Home and Compass pages.
- **Dynamic Real-Time Theme Switching**: Integrated real-time scroll theme detection in `nav.js`. On the Home page, as you scroll past the dark globe hero down into light content sections, the header dynamically switches from dark theme (`site-header--dark`) to light glass mode (`site-header--light`) for 100% crystal-clear readability.
- **Dual Logo Auto-Switching**: Integrated [assets/logo-white.png](file:///Users/tonislav.sabev/Library/Mobile%20Documents/com~apple~CloudDocs/Successfull%20Future%20EOOD/Business%20Website/assets/logo-white.png) for dark background canvas and [assets/logo.png](file:///Users/tonislav.sabev/Library/Mobile%20Documents/com~apple~CloudDocs/Successfull%20Future%20EOOD/Business%20Website/assets/logo.png) for light backgrounds.

### 2. 🧭 Redesigned Compass AI Page (`/compass/`) & 3D Logo Planet (`/scripts/compass-planet.js`)
- **Unified Deep Tech Navy Canvas**: Removed artificial section splits and white background cards. The entire page uses one continuous, deep tech navy space gradient background (`radial-gradient(125% 95% at 50% 0%, #103A6E 0%, #0A2247 40%, #061327 100%)`) with soft floating radial color blooms.
- **Real 3D Spherical Logo Planet**: Turned the flat 2D owl logo into a curved 3D spherical dome (`z = √(R² - x² - y²)`) using `MeshStandardMaterial`, custom procedural bump relief map, and smooth PBR lighting.
- **Softened Tint & Contrast**: Softened the logo face contrast from harsh white to silky metallic ice-blue (`#d8e6f7` to `#93bce8`) with tuned 3D key lighting (`#e6f0fa`) to integrate with space blue.
- **Compact 3D Stage Sizing**: Refined planet stage dimensions (`270px` desktop / `220px` mobile) for balanced framing.
- **Sleek Compact Typography**: Reduced chat bubble font size to `13.5px`, question chips to `11.5px`, and input text to `13.5px`. Live Cloudflare Worker proxy (`WORKER_URL`) fully connected and functioning with Bulgarian/English fallback state handling.

### 3. 📱 Site-Wide Mobile Responsiveness Audit
- **Fluid Responsive Type Scale (`styles/tokens.css`)**: Adjusted `--fs-hero` (`clamp(30px, 5.5vw, 76px)`), `--fs-h2` (`clamp(24px, 4vw, 54px)`), and `--fs-lede` (`clamp(15px, 2vw, 18px)`). Headings and lead paragraphs scale naturally on mobile screens without overflowing.
- **Snug Section & Card Padding (`styles/base.css` & `styles/components.css`)**: Reduced mobile section padding to `44px` and card padding (`.card`, `.offer-item`, `.package-card`, `.founder-card__body`) to `20px 16px`.
- **Full-Bleed Founder Photos**: Fixed founder cards (`.founder-card`) on the About page so photos extend full-bleed to top, left, and right borders with no white padding gaps.

### 4. 📖 Home Page Motto & Globe Framing (`index.html`, `scripts/globe.js`, `styles/globe.css`)
- **Bilingual Antoine de Saint-Exupéry Motto**: Inserted quote inside `#hero-intro` at the top of the globe hero stage (`top: 165px` desktop / `140px` mobile under the header):
  - *EN*: “As for the future, your task is not to foresee it, but to enable it.” — Antoine de Saint-Exupéry
  - *BG*: „Колкото до бъдещето, твоята задача не е да го предвидиш, а да го направиш възможно.“ — Антоан дьо Сент-Екзюпери
- **Synchronized Scroll Fade**: The quote vanishes together with *"From Europe to America"* as the user scrolls.
- **Desktop Globe Camera Distance**: Adjusted 3D camera distance (`BASE_Z = 7.4`) in `globe.js` to scale the desktop globe slightly smaller, creating vertical headroom for the top quote.

### 5. 📞 Contact Page Background & Glassmorphism (`contact/index.html`, `styles/pages/contact.css`)
- **Fixed Orbital Canvas Masking**: Removed opaque background sections to reveal the site-wide Three.js orbital background canvas (`#orbital-bg-canvas`).
- **Glassmorphism Form Cards**: Applied translucent frosted glass cards (`rgba(255, 255, 255, 0.85)` with `backdrop-filter: blur(16px)`).
- **Mobile Input Optimization**: Compact form inputs (`13.5px`, `9px 12px` padding) and full-width mobile submit button.

### 6. 🎨 Design System & Brand Palette (`styles/tokens.css`)
- **Royal Blue `#4A8BDF`** (Lead brand color — token `--color-green`).
- **Eggplant `#A0006D`** (Accent: CTAs & flight arcs — token `--color-red`).
- **Deep Tech Navy `#0A2247` / `#061327`** (Dark sections, service cards, footer — token `--color-navy`).
- **Crisp White `#FFFFFF` & Cream `#F5F3EE`** (Page backgrounds and card surfaces).

---

## 📂 Repository Structure & Key Files
- `index.html` — Home page with 3D Geo-Dot Globe, Saint-Exupéry motto, brand blue offer cards, track record strip.
- `about/index.html` — About Us page with full-bleed founder cards, company tenets, comparison matrix.
- `compass/index.html` — Compass AI page with continuous tech blue canvas, interactive 3D logo planet, live AI proxy chat.
- `contact/index.html` — Contact page with glassmorphism forms and direct contact info.
- `resources/index.html` & `articles/` — Resource hub and articles with dark navy gradient cards.
- `assets/logo-white.png` — White logo asset for dark canvas backgrounds.
- `scripts/globe.js` — 3D interactive continent-dot globe canvas script.
- `scripts/compass-planet.js` — 3D spherical dome logo planet rendering script.
- `scripts/orbital-bg.js` — Site-wide 3D background orbital trajectory animation script.
- `scripts/nav.js` — Floating header controller with dynamic real-time theme & logo switching.
- `scripts/i18n.js` — Dynamic runtime Bulgarian/English translation toggle.

---

## ⚠️ Engineering Rules & Maintainer Notes
- **Bilingual i18n System**: Bulgarian (`bg`) is the static HTML language. Dynamic runtime translations target `data-en` and `data-bg` attributes on elements, and `data-placeholder-en` / `data-placeholder-bg` on inputs.
- **Clean Directory URLs**: Web server routes directories directly to `index.html` (`/about/`, `/contact/`, `/compass/`).
- **Local Dev Snippets**: `files/` directory contains local development code snippets and is excluded from production server deployment.

## 🔲 Backlog — known issues for next session

Nothing below is a regression from today's work; these are pre-existing or intentionally-deferred items surfaced during the font/legal-pages cleanup, listed so they aren't lost.

**Legal / privacy — worth real attention before treating the policy as final:**
- ~~Compass Worker logging unconfirmed~~ — **moot as of 2026-07-09**, Compass is disabled and no longer linked from the live site, and the privacy policy no longer references it. Still relevant *if Compass is ever revived*: does anything on the Cloudflare side (`worker/compass.js`, or Cloudflare account settings like Logpush / dashboard request logging) persist the *content* of chat messages anywhere? The worker source has no explicit logging call, but Cloudflare account-level logging settings aren't visible from the codebase. Confirm in the Cloudflare dashboard before re-enabling.
- **Vendor names were stripped from `/privacy/` clause 4 & 5** at the owner's request on 2026-07-09. Current live text just says "third-party service providers," no names. The removed text (EN; BG mirrored it):
  > Form submissions are processed by Formspree, Inc. (United States). Compass messages are processed by Google LLC (United States) through infrastructure operated by Cloudflare, Inc., using the free tier of Google's Gemini API. Under that tier's terms, Google may use the content of your messages to improve and train its models. We do not sell your personal data, and we do not share it with universities, coaches, or any third party without your instruction.
  >
  > [Clause 5] The processors named above are established in the United States. Transfers are made under the European Commission's Standard Contractual Clauses.

  GDPR Art. 13(1)(e) requires disclosing categories of recipients — the version above is the accurate, specific disclosure the original `legal-pages-task.md` draft was written to include. This was a deliberate, temporary simplification, not an oversight. Restore something equivalently specific before real launch.
- ~~Compass CORS may be broken in production~~ — **moot as of 2026-07-09**, nothing on the live site calls the Worker anymore. Still worth knowing if Compass is revived: `worker/compass.js` sets `ALLOWED_ORIGIN = 'https://toni-sabev.github.io'`, but the site's actual production domain (per `CNAME`) is `uspeshno-budeshte.org` — those don't match, so re-enabling Compass as-is would likely hit CORS failures. Fix `ALLOWED_ORIGIN` (and confirm what's actually deployed on Cloudflare, which may differ from this local file) before relinking it anywhere.
- **The live Cloudflare Worker service itself was not touched.** Disabling Compass in this repo only removes links to it — if a Worker is still deployed and receiving the Gemini API key, it keeps existing (and potentially costing money / being reachable by direct request) until manually paused or deleted in the Cloudflare dashboard. That's outside what a git push can do.
- **Minors restriction is copy-only, not technically enforced.** The contact form says it's for parents/guardians or 18+, but nothing actually verifies age or role. Fine as a first pass per the site owner's chosen option, but worth knowing it's not a hard gate.

**Cleanup identified but not yet done** (from a dead-code audit run this session — see also the "Known Constraints" additions in `wiki/architecture.md`):
- `pricing.html` / `team.html` are orphaned (not linked, not deployed) along with their dedicated CSS: `.pricing-tier`, `.pricing-card*`, `.featured-badge`, `.btn--ghost-white`, `.team-card*`, `.placeholder-block`, `.placeholder-line`, and all of `styles/pages/pricing.css`.
- `styles/pages/about.css` and `styles/pages/home.css` are real CSS files with real rules, but not `<link>`ed from any live page — fully dead weight.
- ~54 unused selectors identified in `styles/components.css` alone (chip/card/testimonial/polaroid/process/blog-card families that were superseded by page-specific classes but never removed). Full list was produced during the audit but not saved to a file — re-run if needed.
- `assets/fonts/NeueMachina-Light.woff2`, `-Regular.woff2`, `-Ultrabold.woff2` (~74KB) are not referenced anywhere in the codebase — no `@font-face`, no CSS, no HTML link.
- `README.md` is stale — describes an old two-page prototype (`blog/index.html`, placeholder pricing/team pages) that no longer matches the real site structure.
- `scripts/globe.js` has a harmless but pointless dead condition: `idx < ap.curvePoints.length * ap.curvePoints.length` — always true for any real array, likely meant to be `idx < ap.curvePoints.length`.
- ~~`contact/index.html`'s footer "Pages" column is missing a "Компас"/"Compass" link~~ — **moot as of 2026-07-09**, Compass is disabled and no page should link to it now anyway.
- `compass/index.html` has no `<footer>` at all — pre-existing, every other live page has one. Now purely academic since the page isn't linked, but noted in case it's revived.
