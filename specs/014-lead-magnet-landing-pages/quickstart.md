# Quickstart: Lead Magnet Dedicated Landing Pages

**Feature**: 014-lead-magnet-landing-pages

## Prerequisites

- Node.js 18+
- pnpm installed
- Project cloned and on `014-lead-magnet-landing-pages` branch

## Setup

```bash
# Install dependencies
pnpm install

# Start dev servers (CMS + site concurrently)
pnpm dev
```

- Site: http://localhost:4321
- CMS Admin: http://localhost:3000/admin

## Testing the Feature

### 1. Add Lead Magnet Content in CMS

1. Open http://localhost:3000/admin
2. Navigate to Lead Magnets collection
3. Create or edit a lead magnet:
   - Fill in title, slug, description, file (upload a PDF)
   - Upload a **cover image** (new field) -- use a PNG/JPEG of the guide's front cover
   - Enter **benefits** content (new field) -- use bullet list format
   - Set status to "published"
4. Save

### 2. Verify Landing Page

1. Rebuild site: stop dev server, run `pnpm dev` (or wait for HMR)
2. Visit http://localhost:4321/guides/[your-slug]
3. Verify:
   - Cover image displays
   - Benefits text renders with formatting
   - Email form is functional
   - Submit form and confirm download link appears

### 3. Verify Service Page Link

1. Visit http://localhost:4321/services/walkout-basements
2. Scroll to "Not ready to schedule yet?" section
3. Click "Download Free Guide"
4. Verify navigation to /guides/walkout-basements-guide
5. Confirm no inline form appears on the service page

## Running Tests

```bash
# Unit tests
pnpm test

# E2E tests (requires dev server running on :4321)
pnpm test:e2e

# Accessibility tests
pnpm test:a11y
```

## Key Files

| What | Where |
|------|-------|
| CMS collection | cms/src/collections/LeadMagnets.ts |
| Landing page route | site/src/pages/guides/[slug].astro |
| Guide layout | site/src/layouts/GuideLayout.astro |
| Guide styles | site/src/styles/guide.css.ts |
| CTA component | site/src/components/content/LeadMagnetCTA.astro |
| Form component | site/src/components/forms/LeadMagnetForm.tsx |
| Data fetching | site/src/lib/payload.ts |
| Service layout | site/src/layouts/ServiceLayout.astro |
