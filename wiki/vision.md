# Успешно Бъдеще — Vision & Direction

> Stable document. Defines what the project is, where it is going, and deployment priorities.

---

## Identity

**Успешно Бъдеще (Successful Future)** is a Bulgarian education advisory that helps student-athletes get from Bulgaria to US universities. The three co-founders — Simeon Sabev, Kaloyan Levterov, and Tonislav Sabev — made the journey themselves and now guide students and families through the full process: university selection, applications, financial planning, relocation, and career preparation.

**Core message**: We didn't just study in the USA — we lived it. We are the mentors we wished we had.

**Target audience**: Bulgarian students (grades 8–12) with athletic backgrounds, and their parents. Families seeking a trusted advisor who has personal experience with the US university system, not a generic application service.

---

## Current State (July 2026)

A highly polished, multi-page interactive platform with 3D WebGL visuals, fully bilingual (BG/EN toggle), deployed on GitHub Pages with Cloudflare optimizations. Font and legal-pages cleanup passes are complete; the site is considered in good standing for this phase. The Compass AI chat feature was disabled on 2026-07-09 (not deleted — see the note at the top of `wiki/architecture.md`).

| Page | Status |
|---|---|
| **Home** | Live — Three.js continent-dot globe, Antoine de Saint-Exupéry bilingual quote, "What we offer" grid, 3D CSS flip package cards, who-we-are stats |
| **About** | Live — Company tenets, comparison matrix, 3 founder cards with dual-photo setups and detailed bios |
| **Contact** | Live — enquiry form (Formspree client-side fetch), required privacy-policy consent checkbox, age-restriction notice (parents/guardians or 18+), office details, Sofia map embed, site-wide orbital canvas |
| **Resources** | Live — article index with category filtering chips |
| **Compass** | **Disabled** (2026-07-09) — deemed not useful enough to keep live. Page, script, styles, and Worker proxy all still exist in the repo and work if visited directly, but nothing links to `/compass/` anymore (nav, footer, home page section, and sitemap entry are all commented out). |
| **Articles** | Live — long-form articles (NCAA guide, STEM benefits, OPT/CPT employment, SEVIS lifecycle) |
| **Privacy / Terms** | Live — real bilingual GDPR-oriented policy and terms of service (previously both were an accidental copy of the homepage). See `Handoff.md` for the one open item (vendor-name disclosure was intentionally simplified). |

---

## Near-Term

### Performance & Asset Optimization
Ensure that local performance remains extremely fast despite Three.js WebGL and interactive animations. Optimize rendering, camera math, and loading behaviors where possible.

### Copy Refinement
Ensure all Bulgarian translations match professional educational and athletic advisory standards.

---

## Medium-Term

### Testimonials & Case Studies
Add structured parent and student-athlete testimonials to the Home and About pages.

### FAQ Section
Integrate a searchable FAQ section on the Resources page.

### SEO & Localization Enhancements
- Expand `<meta>` and Open Graph tags for all articles in both languages.
- Ensure proper `hreflang` tags are outputted for standard search crawlers.

---

## Long-Term

### CRM & Lead Pipeline
Once form volume grows, connect Formspree submissions to a simple CRM pipeline (Notion database, Airtable, or HubSpot) using Zapier to auto-generate lead cards.

### Direct Booking Integration
Replace or supplement the inquiry form with a direct calendar booking widget (e.g., Calendly embed) for scheduling initial 45-minute consultations.

---

## Design Principles

1. **Rich Aesthetics and Immersive Interactivity.** Focus on premium design details (frosted-glass panels, smooth micro-animations, 3D WebGL elements) to captivate families and student-athletes immediately.
2. **Bulgarian First.** Default language is Bulgarian. English is a toggle for international visitors or parents with English preferences.
3. **The Founders are the Product.** The personal stories — Olympic, NCAA, national records — are the differentiator. Design serves those stories.
4. **No Build Step/Compilation Overhead.** Keep the code base plain HTML, vanilla CSS, and standard ES6 JS files to maintain instant load times and local development speed. Avoid bundlers, frameworks, and preprocessors.
