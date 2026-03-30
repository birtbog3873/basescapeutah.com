# Quickstart: Add Retaining Walls Service

**Branch**: `004-retaining-walls-service` | **Date**: 2026-03-25

## Prerequisites

- Node.js 18+
- pnpm (workspace manager)
- Git on branch `004-retaining-walls-service`

## Setup

```bash
# Install dependencies
pnpm install

# Start dev server (site only — CMS not required for fallback-mode development)
cd site && pnpm dev
```

## Implementation Order

### Step 1: Create the service page

Create `site/src/pages/services/retaining-walls.astro` by copying the pattern from `walkout-basements.astro`:

1. Copy `walkout-basements.astro` as a starting template
2. Replace slug: `'walkout-basements'` → `'retaining-walls'`
3. Replace all fallback content with retaining-wall-specific content
4. Set `primaryValuePillar: 'transformation'`, `supportingPillars: ['safety']`

**Verify**: Navigate to `http://localhost:4321/services/retaining-walls` — page should render with all sections.

### Step 2: Update navigation

Add "Retaining Walls" to fallback nav arrays in:
- `site/src/components/layout/Header.astro` — Services dropdown children
- `site/src/components/layout/Footer.astro` — Services column links

**Verify**: Check header dropdown and footer on any page — "Retaining Walls" link appears and navigates correctly.

### Step 3: Verify pre-existing changes

Confirm these files contain `retaining-walls`:
- `site/src/components/forms/MultiStepForm.tsx` — SERVICE_OPTIONS
- `site/src/lib/validation.ts` — serviceType enum
- `cms/src/collections/Leads.ts` — serviceType options
- `cms/payload-types.ts` — union type
- `cms/src/email/team-notification.ts` — SERVICE_LABELS
- `cms/src/email/lead-confirmation.ts` — SERVICE_LABELS

### Step 4: Test

```bash
# Build the site (verifies SSG works with fallback data)
cd site && pnpm build

# Verify the retaining-walls page was generated
ls dist/services/retaining-walls/
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `site/src/pages/services/retaining-walls.astro` | Service page (NEW) |
| `site/src/layouts/ServiceLayout.astro` | Shared service layout (unchanged) |
| `site/src/components/layout/Header.astro` | Header nav (modify fallback) |
| `site/src/components/layout/Footer.astro` | Footer nav (modify fallback) |
| `site/src/pages/services/walkout-basements.astro` | Reference implementation |
| `cms/src/collections/Services.ts` | CMS schema reference |
| `site/src/lib/schema.ts` | JSON-LD schema generators |
