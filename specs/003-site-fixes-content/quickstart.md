# Quick Start: Site Fixes & Content Updates

**Branch**: `003-site-fixes-content`

## Prerequisites

- Node.js 18+
- pnpm (workspace root)

## Setup

```bash
# From repo root
git checkout 003-site-fixes-content
pnpm install

# Start CMS (in one terminal)
cd cms
pnpm dev
# → Payload CMS admin at http://localhost:3000/admin

# Start site (in another terminal)
cd site
pnpm dev
# → Astro dev server at http://localhost:4321
```

## Key Directories

```
site/src/
├── components/content/CTABlock.astro     # CTA buttons (estimateUrl → #estimate-form)
├── components/forms/MultiStepForm.tsx    # Lead capture form (id="estimate-form")
├── components/layout/Footer.astro        # Footer with business info
├── components/layout/Header.astro        # Header with nav + Gallery link
├── components/trust/ReviewCard.astro     # Review cards
├── layouts/BaseLayout.astro              # Root layout (needs MultiStepForm)
├── layouts/ServiceLayout.astro           # Service page layout (richText bug)
├── lib/payload.ts                        # CMS API client
├── pages/index.astro                     # Homepage (reviews section)
├── pages/gallery.astro                   # Gallery page (to be hidden)
└── pages/services/*.astro                # Service pages

cms/src/
├── collections/Services.ts               # Services schema (add serviceType)
├── globals/SiteSettings.ts               # Site settings (add toggles)
├── globals/Navigation.ts                 # Navigation schema
└── seed.ts                               # Seed data (update business info)
```

## Testing

```bash
cd site

# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Accessibility tests
pnpm test:a11y

# Lighthouse performance
pnpm test:lighthouse
```

## Verification Checklist

After implementation, verify manually:

1. Click every "Get Free Estimate" button → multi-step form appears
2. Visit each service page → FAQ answers visible
3. Footer shows: License `14082066-5501 B100`, "General Liability", phone `1-888-414-0007`
4. No reviews visible on homepage or service pages
5. No Gallery link in header/footer nav
6. Gallery URL → 404
7. Footer has 4 columns on desktop, stacks on mobile
8. Pavers & Hardscapes + Artificial Turf cards appear in services section
9. Both new services have dedicated pages with FAQ
10. Phone number is clickable tel: link everywhere
