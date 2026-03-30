# Quickstart: 005-site-content-form-fixes

**Branch**: `005-site-content-form-fixes`

## Prerequisites

- Node.js 20+, pnpm
- Valid Payload CMS API key (for form fix)

## Setup

```bash
git checkout 005-site-content-form-fixes
pnpm install
```

## Key Files (by implementation phase)

### Phase 1: Form Fix + Schema Updates
- `site/.env` -- set PAYLOAD_API_KEY
- `site/src/lib/validation.ts:21` -- Zod serviceType enum
- `site/src/components/forms/MultiStepForm.tsx:5-11` -- SERVICE_OPTIONS
- `cms/src/collections/Leads.ts:68-74` -- serviceType options

### Phase 2: Services Grid + Navigation
- `site/src/pages/index.astro:53-59` -- fallback services array
- `site/src/components/layout/Header.astro:18-26` -- fallback nav
- `site/src/components/layout/Footer.astro:23-42` -- fallback nav

### Phase 3: Basement Remodeling Page
- `site/src/pages/services/basement-remodeling.astro` -- NEW file
- Reference: `site/src/pages/services/walkout-basements.astro` -- template to follow
- Layout: `site/src/layouts/ServiceLayout.astro` -- renders all service page sections

### Phase 4: Window Well Removal
- `site/src/pages/services/window-well-upgrades.astro` -- DELETE
- `site/astro.config.ts` -- add redirect
- `cms/src/seed.ts` -- update nav/FAQ seeds

### Phase 5: FAQ Content
- `site/src/pages/faq.astro:91-93` -- hero subtitle text
- `site/src/pages/faq.astro:108-119` -- empty state (will be replaced by content)
- `cms/src/collections/FAQs.ts` -- FAQ schema reference

## Development

```bash
# Start CMS (from cms/)
cd cms && pnpm dev

# Start site (from site/)
cd site && pnpm dev

# Build static site
cd site && pnpm build
```

## Verification

1. Homepage shows 6 services in order: Walkout Basements, Basement Remodeling, Pavers & Hardscapes, Retaining Walls, Artificial Turf, Egress Windows
2. Form completes all 3 steps without error
3. `/services/basement-remodeling` loads with full content
4. `/services/window-well-upgrades` redirects to homepage
5. FAQ page shows categorized Q&A (no placeholder)
6. No "Window Well" references anywhere on site
