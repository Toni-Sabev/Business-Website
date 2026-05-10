# Успешно Бъдеще — Devlog

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
