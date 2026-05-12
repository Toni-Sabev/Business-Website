# Успешно Бъдеще — Devlog

---

## Current State (2026-05-11)

**Version**: 1.4 — four-page site + articles + Compass AI assistant, bilingual, form live  
**Deployed**: GitHub Pages — `https://toni-sabev.github.io/Business-Website/`  
**Form**: Formspree `xrejonok` → `info@uspeshno-budeshte.com`  
**AI Worker**: Cloudflare Workers — `https://ub-chat-proxy.rapid-poetry-d971.workers.dev`  
**AI Model**: Gemini 2.5 Flash via Google AI Studio API  
**Repo**: `https://github.com/Toni-Sabev/Business-Website`

### Pages live
- `about.html` — landing page, packages, founder cards, CTA flip block
- `contact.html` — form + sidebar, Formspree wired
- `resources.html` — article list with chips
- `athina.html` — Compass AI assistant (full-page chat)
- `articles/employment-international-athlete.html`
- `articles/stem-international-athlete.html`
- `articles/ncaa-international-athlete-guide.html`

### What's complete
- Full EN/BG toggle across every page and article
- Compass AI assistant — Gemini 2.5 Flash, session conversation history (last 3 turns), lead-generation system prompt
- Compass logo (owl) with 3D rotateY spin on page load + hover; locked to one spin at a time
- Cloudflare Worker proxy — CORS locked to GitHub Pages origin
- Cloudflare Web Analytics token wired on all pages
- STEM article with hero image and 3D service flip block
- NCAA article
- CTA flip block on About page
- Formspree updated to new endpoint `xrejonok`
- Nav updated across all pages to include Compass link

### Known open items
- Mobile header tight on phones < 400px
- Form success message English-only (doesn't switch with lang toggle)
- `pricing.html`, `team.html`, `index.html` — unused legacy files
- Worker CORS currently set to `'*'` for local testing — lock to `https://toni-sabev.github.io` before final deploy

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

### 2026-05-11 — Compass AI assistant + content polish session

**Compass (AI chatbot)**
- New full-page `athina.html` — chat UI with message bubbles, typing dots, suggestion chips, auto-growing textarea
- Cloudflare Worker (`worker/athina.js`) proxies requests to Gemini 2.5 Flash
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
