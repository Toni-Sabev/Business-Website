# Успешно Бъдеще — Devlog

---

## Current State (2026-05-09)

**Version**: 1.0 — two-page site, bilingual, form live  
**Deployed**: GitHub Pages — `https://toni-sabev.github.io/Business-Website/`  
**Form**: Formspree `maqvlwzr` → `info@uspeshno-budeshte.com` — tested and confirmed working  
**Repo**: `https://github.com/Toni-Sabev/Business-Website`

### Pages live
- `about.html` — landing page, all sections complete
- `contact.html` — form + sidebar, Formspree wired

### What's complete
- Full EN/BG toggle across every text element on both pages
- 5-service grid (1→2→3→5 col responsive)
- 3 founder cards with dual photos (portrait + action)
- Formspree enquiry form with inline success/error state
- Consistent footer across pages
- Google Maps embed (Sofia pin)
- GitHub Pages deployment

### Known open items
- Mobile header is tight on phones < 400px wide — CTA button and brand name text compete for space
- Bulgarian translations not yet reviewed by a native speaker
- Form success message is English-only (doesn't switch with lang toggle)
- `pricing.html`, `team.html`, `index.html` exist but are unused legacy files

---

## Session Log

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
