# Research: 005-site-content-form-fixes

**Date**: 2026-03-25 | **Branch**: `005-site-content-form-fixes`

## R-001: Form Error Root Cause

**Decision**: The "Something went wrong" error is caused by an empty `PAYLOAD_API_KEY` in `/site/.env` (line 2). The form submission calls `createLead()` which sends an `Authorization: Bearer ` header with no token, causing the CMS to reject the request.

**Rationale**: Traced the full flow: `MultiStepForm.tsx` (line 75) -> `actions.saveFormStep()` -> `createLead()` in `payload.ts` (line 94-108) -> POST to `/api/leads` with empty Bearer token -> CMS rejects -> error propagates to form. The validation schemas (form options, Zod enum, CMS Leads collection) all match correctly -- this is purely an auth issue.

**Alternatives considered**:
- Schema mismatch between form/validation/CMS: Verified all three match exactly
- Frontend rendering bug: Error only appears after submission attempt, not on render
- CMS unavailability: Possible secondary cause but primary is the empty API key

**Fix**: Set a valid Payload CMS API key in `/site/.env`. Additionally, improve error handling to distinguish auth failures from other errors for better debugging.

## R-002: Service Page Template Pattern

**Decision**: New Basement Remodeling page follows the established pattern: import `ServiceLayout`, fetch from CMS with static fallback data, render via `<ServiceLayout service={service} settings={settings} />`.

**Rationale**: All 6 existing service pages follow this identical pattern. The `ServiceLayout` component (`/site/src/layouts/ServiceLayout.astro`) handles all rendering: hero, overview, process steps, anxiety stack, differentiator, projects gallery, reviews, FAQs, trust badges, final CTA.

**Key structure for fallback data**:
- Required: title, slug, tagline, primaryValuePillar, overview (HTML), process (array, min 3 steps), seo (metaTitle, metaDescription)
- Recommended: anxietyStack (7 concern areas), differentiator, supportingPillars
- Optional: faqs, projects, reviews, ctaHeadline (auto-generated if absent)

## R-003: Homepage Services Grid

**Decision**: Update the fallback services array in `index.astro` (lines 53-59) to the new 6-service list in the specified order. Currently missing: Retaining Walls, Basement Remodeling. Currently includes but must remove: Window Well Upgrades.

**Rationale**: The homepage fetches services from CMS but falls back to a static array when CMS is unavailable. Both the CMS data and fallback must reflect the new service list.

## R-004: Navigation Updates

**Decision**: Update fallback navigation in both Header.astro (lines 18-26) and Footer.astro (lines 23-42) to add Basement Remodeling, remove Window Well Upgrades, and ensure Retaining Walls is included.

**Rationale**: Navigation has CMS-managed primary data with static fallbacks. Both paths need updating for consistency.

## R-005: Window Well Redirect Strategy

**Decision**: Use Astro's `redirects` config in `astro.config.ts` to redirect `/services/window-well-upgrades` to `/services/` (or homepage). Delete the `window-well-upgrades.astro` page file.

**Rationale**: Astro supports static redirects in config which generate proper 301 redirects on Cloudflare. This is the simplest approach and preserves any SEO equity from the old URL.

**Alternatives considered**:
- Keep page with "service discontinued" message: Creates maintenance burden
- 404 page: Loses SEO equity and creates broken bookmarks

## R-006: FAQ Content Strategy

**Decision**: Create FAQ content directly in the Astro page fallback data and as CMS seed data. Cover the existing 9 categories with at least 5 questions across categories most relevant to the updated service list.

**Rationale**: The FAQ page and component infrastructure already works -- it just has no published content. The FAQ page fetches from CMS via `fetchFAQs()` and falls back to empty state. The seed.ts already has sample FAQ data (lines 362-411) but this may not be deployed. Creating fallback content in the page ensures FAQs display regardless of CMS state.

**Note**: FAQ page hero subtitle (line 91-93) currently reads "Everything you need to know about walkout basement entries, egress windows, permits, costs, and timelines along Utah's Wasatch Front." -- needs updating to reflect full service lineup.

## R-007: Constitution Art. III Compliance -- Basement Remodeling

**Decision**: Frame Basement Remodeling within BaseScape's specialist positioning as "basement transformation" -- not generic remodeling. Content must emphasize basement-specific expertise: moisture control, structural assessment, code compliance for habitable spaces, egress requirements for bedrooms, and basement-specific challenges.

**Rationale**: Art. III requires specialist positioning in "basement walkouts, egress windows, code-compliant basement access, and ADU-enabling basement transformations." Basement Remodeling fits as an ADU-enabling basement transformation but must NOT be positioned as generic remodeling.

## R-008: CMS Schema Updates for Service Types

**Decision**: Add `basement-remodeling`, `pavers-hardscapes`, and `artificial-turf` to the service type enums in validation.ts and Leads.ts. Remove `window-well-upgrade`.

**Rationale**: The form dropdown is being expanded from 5 options (walkout-basement, egress-window, window-well-upgrade, retaining-walls, not-sure) to 7 options (walkout-basement, basement-remodeling, pavers-hardscapes, retaining-walls, artificial-turf, egress-window, not-sure). Validation and CMS must accept all new types.
