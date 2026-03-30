# Quickstart: Hero Redesign + Dedicated Contact Page

**Feature**: 013-hero-contact-page | **Date**: 2026-03-30

## What This Feature Does

1. Simplifies the homepage hero to a trust-forward message + ZIP code input + single CTA
2. Creates a dedicated `/contact` page as the single location for the lead form
3. Restyles the mobile bottom bar to flat, edge-to-edge cells
4. Routes all site CTAs to `/contact` instead of `#estimate-form`
5. Adds Google Sheets webhook logging for completed leads

## Files Changed

### New Files
- `site/src/pages/contact.astro` — Dedicated contact page with MultiStepForm
- `site/src/styles/contact.css.ts` — Contact page styles (optional, may use existing utilities)

### Modified Files (Site)
- `site/src/pages/index.astro` — Hero section rewrite (ZIP input, trust copy)
- `site/src/components/forms/MultiStepForm.tsx` — Accept `initialZip` prop, read URL params
- `site/src/components/layout/MobileBottomBar.astro` — Flat styling, link to `/contact`
- `site/src/components/content/CTABlock.astro` — Default `estimateUrl` → `/contact`
- `site/src/layouts/BaseLayout.astro` — Remove embedded form section
- `site/src/layouts/LandingLayout.astro` — Remove embedded form section
- `site/src/components/layout/Header.astro` — Update CTA href to `/contact`

### Modified Files (CMS)
- `cms/src/hooks/afterLeadCreate.ts` — Add Google Sheets webhook POST

### Environment Variables
- `GOOGLE_SHEETS_WEBHOOK_URL` (CMS) — URL of the Google Apps Script web app

## Dev Workflow

```bash
# Start dev servers
pnpm dev

# Visit homepage to verify hero
open http://localhost:4321

# Visit contact page
open http://localhost:4321/contact

# Test ZIP pre-fill
open http://localhost:4321/contact?zip=84645

# Run tests
pnpm test
pnpm test:e2e
pnpm test:a11y
```

## Key Decisions

- Hero ZIP form uses native HTML `<form method="GET">` — no JavaScript required
- MultiStepForm reads ZIP from `URLSearchParams` client-side (static site can't read at build time)
- Google Sheets webhook is fire-and-forget in the CMS afterLeadCreate hook
- Webhook URL is configurable and optional — skipped if env var is not set
