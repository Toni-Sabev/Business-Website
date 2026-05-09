# Успешно Бъдеще — Vision & Direction

> Stable document. Defines what the project is, where it is going, and deployment priorities.

---

## Identity

**Успешно Бъдеще (Successful Future)** is a Bulgarian education advisory that helps student-athletes get from Bulgaria to US universities. The three co-founders — Simeon Sabev, Kaloyan Levterov, and Tonislav Sabev — made the journey themselves and now guide students and families through the full process: university selection, applications, financial planning, relocation, and career preparation.

**Core message**: We didn't just study in the USA — we lived it. We are the mentors we wished we had.

**Target audience**: Bulgarian students (grades 8–12) with athletic backgrounds, and their parents. Families seeking a trusted advisor who has personal experience with the US university system, not a generic application service.

---

## Current State (May 2026)

Two-page static website, bilingual (BG/EN toggle), deployed on GitHub Pages.

| Page | Status |
|---|---|
| About | Live — What We Do, 5 service areas, 3 founder cards with dual photos |
| Contact | Live — Enquiry form (Formspree), email, hours, Sofia map |

---

## Near-Term

### Custom Domain
Point `uspeshno-budeshte.com` (or `.bg`) to GitHub Pages. Add `CNAME` file to repo. GitHub handles SSL automatically.

### Copy Refinement
All body copy is currently in English and Bulgarian. Review and refine the Bulgarian translations with native speaker input — especially the founder bios and service descriptions.

### Mobile Header
The header on small phones (~390px) is tight: logo + brand name + lang toggle + CTA button + hamburger in one row. Consider hiding the "Book a call" button on mobile (the contact page is one tap away via the hamburger) and reducing the logo to ~52px on small screens.

### Contact Form Success — Bilingual
The success confirmation message after form submission is English-only. Should switch with the lang toggle like everything else.

---

## Medium-Term

### Testimonials Section
Add a section to `about.html` with 2–3 testimonials from past students/families. Adds social proof and breaks up the page between Founders and CTA.

### Resources Page
Previously removed for faster deployment. Bring back as a curated guide: timeline for US applications, financial aid explained, FAQ. Bilingual.

### SEO
- `<meta>` descriptions currently in English only — add Bulgarian equivalents
- Add `hreflang` tags for BG/EN
- Submit sitemap to Google Search Console once on a real domain

### Analytics
Add privacy-friendly analytics (Plausible or Fathom) to understand which sections get attention and where drop-off happens on the contact form.

---

## Long-Term

### CRM / Lead Management
Once form volume grows beyond what email can handle, connect Formspree to a simple CRM (Notion database, Airtable, or HubSpot free tier) via Zapier. Each submission auto-creates a lead record.

### Booking Integration
Replace the enquiry form with a direct calendar booking (Calendly embed) for the initial 45-minute consultation. Reduces friction — one less back-and-forth email.

### Blog / Content
SEO-driven content in Bulgarian: "How to apply to a US university from Bulgaria", "Swimming scholarships explained", etc. Builds organic search traffic from the exact audience.

---

## Design Principles

1. **Speed over completeness.** Ship a clean two-page site before adding features. Every page that isn't ready is a page that delays launch.
2. **Bulgarian first.** Default language is Bulgarian. EN is a toggle for international visitors or parents with English preference.
3. **The founders are the product.** The personal stories — Olympic, NCAA, national records — are the differentiator. Design serves those stories.
4. **No backend complexity.** Static HTML + Formspree handles everything needed at this stage. Avoid servers, databases, and frameworks until traffic justifies it.
