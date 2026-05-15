# Успешно Бъдеще — Devlog

---

## Current State (2026-05-15)

**Version**: 1.8 — Compass prompt overhaul, home page "What we offer" section, compass chip redesign
**Deployed**: GitHub Pages — `https://toni-sabev.github.io/Business-Website/`
**Form**: Formspree `xrejonok` → `info@uspeshno-budeshte.com`
**AI Worker**: Cloudflare Workers — `https://ub-chat-proxy.rapid-poetry-d971.workers.dev`
**AI Model**: Gemini 2.5 Flash via Google AI Studio API
**Repo**: `https://github.com/Toni-Sabev/Business-Website`

### What's complete
- All v1.7 items remain live
- Compass 429 error handling — friendly bilingual message shown to user on rate limit
- Compass system prompt expanded: visa types (F-1, J-1, O-1, H-1B, B-2) with guardrail, updated website architecture (Home page added, About corrected, packages moved), custom packages noted, specific topic guidance for university connections and child safety questions
- Compass suggestion chips redesigned — now styled as green chips matching the intro topic chips; 6 curated questions replacing the generic defaults
- Home page: new "What we offer" section above the hero — 4-card grid (Profile Building, University Outreach, Visa & Documentation, Budget & Logistics) with bilingual bullet points
- Home page: removed redundant hero paragraph ("We help you identify the right US universities…")
- Deleted unused legacy file `about 2.html`

### Known open items
- Mobile header tight on phones < 400px
- Form success message English-only (doesn't switch with lang toggle)
- `pricing.html`, `team.html` — unused legacy files
- Worker CORS currently set to `'*'` — lock to `https://toni-sabev.github.io` before final deploy
- Resources page — needs at least one new article

---

## Current State (2026-05-12)

**Version**: 1.7 — home page fully revised, all copy updated, flags hero photo  
**Deployed**: GitHub Pages — `https://toni-sabev.github.io/Business-Website/`  
**Form**: Formspree `xrejonok` → `info@uspeshno-budeshte.com`  
**AI Worker**: Cloudflare Workers — `https://ub-chat-proxy.rapid-poetry-d971.workers.dev`  
**AI Model**: Gemini 2.5 Flash via Google AI Studio API  
**Repo**: `https://github.com/Toni-Sabev/Business-Website`

### Pages live
- `index.html` — home page: flags hero photo, trust strip, packages (flip cards), who-we-are stats, Compass feature, resources teaser, CTA flip block
- `about.html` — founders section (3 cards) + navy CTA flip block
- `contact.html` — form + sidebar, Formspree wired
- `resources.html` — article list with chips
- `compass.html` — Compass AI assistant (full-page chat)
- `articles/employment-international-athlete.html`
- `articles/stem-international-athlete.html`
- `articles/ncaa-international-athlete-guide.html`

### What's complete
- Full EN/BG toggle across every page and article
- Compass AI assistant — Gemini 2.5 Flash, session conversation history (last 3 turns), lead-generation system prompt
- Compass logo in chat preview avatar
- Cloudflare Worker proxy — CORS locked to GitHub Pages origin
- Cloudflare Web Analytics token wired on all pages
- Home page hero: BG/US flags photo with left-edge fade on desktop, landscape crop on mobile
- Packages: 3D flip cards on home page; about.html has founders + CTA flip only
- Footer: "EU → United States" / "ЕС → Съединените щати" across all pages
- All home page copy updated (hero, packages, who-we-are, compass section)
- CTA flip block on home page and about page

### Known open items
- Mobile header tight on phones < 400px
- Form success message English-only (doesn't switch with lang toggle)
- `pricing.html`, `team.html` — unused legacy files
- Worker CORS currently set to `'*'` for local testing — lock to `https://toni-sabev.github.io` before final deploy
- **Compass AI** — needs end-to-end testing; system prompt context and topic boundaries should be tightened
- **Resources page** — needs at least one new article brainstormed and written

---

## Current State (2026-05-10)

**Version**: 1.2 — three-page site (About, Resources, Contact) + employment article, bilingual, form live  
**Deployed**: GitHub Pages — `https://toni-sabev.github.io/Business-Website/`  
**Form**: Formspree `maqvlwzr` → `info@uspeshno-budeshte.com` — tested and confirmed working  
**Repo**: `https://github.com/Toni-Sabev/Business-Website`

### Pages live
- `about.html` — landing page, packages section, founder cards
- `contact.html` — form + sidebar, Formspree wired
- `resources.html` — article list with chips
- `articles/employment-international-athlete.html` — first full article

### What's complete
- Full EN/BG toggle across every text element on all pages and articles
- 3 interactive flip package cards (Hope / Direction / The Success) replacing old 5-service grid
- 3 founder cards with dual photos, updated bios, accomplishment bullets
- Resources page with article cards and grey category chips
- Employment article with hero image, comparison table, service CTA
- Formspree enquiry form with inline success/error state
- Consistent footer across all pages
- Google Maps embed (Sofia pin)
- GitHub Pages deployment
- Flag header component replaced with seamless CSS gradient (no hairline gaps)

### Known open items
- Mobile header is tight on phones < 400px wide — CTA button and brand name text compete for space
- Form success message is English-only (doesn't switch with lang toggle)
- `pricing.html`, `team.html`, `index.html` exist but are unused legacy files
- Second article (NCAA eligibility guide) — content drafted, marked "coming soon"

---

## Session Log

### 2026-05-15 — Compass overhaul + home page "What we offer" section

**Compass (`compass.html` + `worker/compass.js`)**
- 429 rate-limit error now returns a friendly bilingual message instead of a generic error ("It seems I've run out of energy for a moment…")
- Worker returns HTTP 429 with `{ error: 'rate_limited' }` so the frontend can distinguish it from other failures
- System prompt: added visa types section (F-1, J-1, O-1, H-1B, B-2) with explicit guardrail — explain only, never recommend
- System prompt: website architecture corrected — Home page added as main entry point, About page corrected to founders-only, packages moved to Home page
- System prompt: custom packages added to the PACKAGES section
- System prompt: specific topic guidance added for "university connections" (profile-driven outreach, company's core speciality) and "child safety" (empathetic parent-focused response)
- Suggestion chips redesigned — styled as green chips matching the intro topic area chips; white bordered buttons removed
- 6 curated suggestion questions added (reordered: Safety → University Outreach → NCAA → Europe to USA → Work in US → Visa types)
- Removed generic topic chips (US Admissions, Stipends, SSN, etc.) from intro area

**Home page (`index.html`)**
- New "What we offer" section added above the hero — 4-card grid with bilingual bullet points
  - Profile Building: academic/athletic profile + internal profile report as deliverable
  - University Outreach: personalised contact, reaches scholarship administrators (head coaches)
  - Visa & Documentation: F-1/SEVIS + health docs, university registration and enrolment
  - Budget & Logistics: flights/phones/banks, housing guidance, full budget report for parents
- Removed redundant hero paragraph ("We help you identify the right US universities…")

**Cleanup**
- Deleted unused legacy file `about 2.html`

---

### 2026-05-12 — Home page + nav fix + packages reorganisation
- Built `index.html` as full production home page (hero, trust strip, packages, who-we-are, Compass feature, resources teaser, CTA band)
- Fixed nav continuity bug: all pages had logo pointing to `about.html` with no Home link — updated all 7 pages to point logo to `index.html` and added Home as first nav link
- Moved flip-card packages from `about.html` to `index.html` — `about.html` now contains only founders + navy CTA block
- Replaced old static `.packages` grid on home page with the 3D flip-card design (Hope / Direction / The Success)

### 2026-05-11 — Compass AI assistant + content polish session

**Compass (AI chatbot)**
- New full-page `compass.html` — chat UI with message bubbles, typing dots, suggestion chips, auto-growing textarea
- Cloudflare Worker (`worker/compass.js`) proxies requests to Gemini 2.5 Flash
- Session conversation history: last 3 turns (6 messages) sent with each request
- System prompt: lead-generation focused — gives overview, withholds specifics, drives to consultation; warm/human tone; varies CTA phrasing
- Assistant named Compass / Компас (male); owl logo with 3D rotateY spin on load + hover
- Spin locks during animation — can only re-trigger after previous spin completes
- EN/BG bilingual: name, intro text, chips, disclaimer, suggestion chips
- Disclaimer pill moved below input bar
- Intro text narrowed to `max-width: 420px`

**Bugs fixed**
- Gemini API returning `…`: caused by `thinkingConfig` placed outside `generationConfig` — removed; `maxOutputTokens` raised to 800
- CORS blocking local testing: `ALLOWED_ORIGIN` set back to `'*'` temporarily (to be locked before deploy)
- `contact.html` missing Compass link in desktop nav — added
- All pages had `data-en="Athina — Assistant"` — corrected to `data-en="Compass"` across all 7 files
- API key invalid on first deploy: user re-saved secret in Cloudflare dashboard

**Articles**
- STEM article: bilingual content, hero image, 3D service flip block at bottom
- NCAA article added
- All article nav links updated to include Compass

**Other**
- Cloudflare Web Analytics beacon added to all pages
- Formspree endpoint updated to `xrejonok`
- About page CTA flip block added (front: "Ready to start?", back: free call details + bullets)

---

### 2026-05-10 — Content polish + new features session

**What was built / changed:**

*About page*
- Replaced 5-service section with 3 interactive CSS 3D flip package cards: Hope (bronze), Direction (silver), The Success (gold, coming soon)
- Cards flip on hover (desktop) and tap (mobile) to reveal services list
- Context chips (age range, process duration) appear below card on flip
- Medal logo images with `mix-blend-mode: multiply` for clean rendering
- Founder photo column widened from 240px → 280px
- Simeon: new University of Delaware portrait photo as first image; bio updated (school name, MSLL tutor bullet added, Balkan Games, financial fundamentals)
- Kaloyan: bio updated — класира (was квалифицира), стратегическо решение (was стратегически корекции), Texas A&M sentence rewritten
- Tonislav: full bio rewrite in both languages
- Hero heading EN updated: "the full plan" (was "the full picture")
- Lede shortened to first sentence only (removed sales line)

*Resources page*
- New page added with article card list
- Subtitle updated with professional description
- Grey category chips (using `--color-taupe`) replacing bullet list
- "Student / Parent Resources" chip label shortened to "Resources"

*Employment article*
- Graduation hero image added
- CPT/OPT bullet lists removed; service CTA buttons added outside `.prose`
- Navy CTA block removed

*Contact page*
- Timezone (EET / ЕИВ) removed from working hours

*Components*
- Flag in header rewritten as single CSS gradient element — eliminates flex sub-pixel hairline gaps
- Outer border removed from flag

---

### 2026-05-09 — Full build session

**What was built:**
- Reduced nav from 5 tabs → 3 → 2 (About + Contact only)
- Removed stats sidebar and parallel founder columns from About
- Added real founder photos (Simeon, Kaloyan, Toni) with dual-photo stacked layout
- Added second action photos (Olympic/competition) for all three founders
- Full bilingual coverage: every text element on both pages responds to EN/BG toggle
- Default language set to Bulgarian throughout
- 5-service grid: removed 820px cap, made full-width with responsive breakpoints
- Service cards widened by reducing 5-col gap from 24px→16px
- Formspree integration wired and tested — form submissions land in email
- Contact page: removed placeholder header section, removed Office block, added live Sofia map
- Footer synced to identical markup on both pages
- GitHub Pages deployed
- Wiki created
