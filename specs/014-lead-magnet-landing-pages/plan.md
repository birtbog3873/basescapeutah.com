# Implementation Plan: Lead Magnet Dedicated Landing Pages

**Branch**: `014-lead-magnet-landing-pages` | **Date**: 2026-04-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/014-lead-magnet-landing-pages/spec.md`

## Summary

Each published lead magnet gets a dedicated landing page at `/guides/[slug]` featuring a PDF cover image, benefits description, and email capture form. Service pages link to these landing pages instead of rendering inline forms. The LeadMagnets CMS collection is extended with `coverImage` and `benefits` fields. The existing `LeadMagnetForm` component and `submitLeadMagnet` action are reused unchanged.

## Technical Context

**Language/Version**: TypeScript (strict mode), Astro 5.7.x, React 19.1.x
**Primary Dependencies**: Astro, Payload CMS 3.x, Vanilla Extract, Zod, Lucide
**Storage**: Cloudflare D1 (SQLite) via Payload CMS, Cloudflare R2 (media)
**Testing**: Vitest (unit), Playwright (E2E, a11y, visual) across 4 viewports
**Target Platform**: Static site on Cloudflare Pages + CMS on Cloudflare Workers
**Project Type**: Monorepo (site/ + cms/ + admin/)
**Performance Goals**: Lighthouse 90+, static output with zero external dependencies at runtime
**Constraints**: Static-first build (must work without CMS), local asset preference, monorepo boundary discipline
**Scale/Scope**: 2-5 lead magnets initially (walkout basements, retaining walls, potentially more)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-First, CMS-Enriched | PASS | Landing pages use `getStaticPaths()` with CMS data at build time. Hardcoded fallback data in service pages already exists for lead magnets. New `/guides/[slug]` pages only generate when CMS returns published magnets -- no page = no build error. |
| II. Local Assets Over External URLs | PASS | Cover images uploaded to CMS (R2) will be referenced via CMS media URLs in static builds, consistent with how `thumbnailImage` is already handled. No new external dependency pattern. |
| III. Monorepo Boundary Discipline | PASS | Site fetches lead magnet data via HTTP API at build time (`fetchPayload`). No cross-imports between site/ and cms/. New CMS fields are defined in cms/, new pages in site/. |
| IV. Spec-Driven Development | PASS | This is the speckit plan for spec 014. |
| V. Accessibility and Performance | PASS | Landing pages will use semantic HTML, proper heading hierarchy, alt text on cover images, and form labels. Will be included in a11y test suite. |
| VI. Code Style Consistency | PASS | All code follows Prettier/ESLint config (no semicolons, single quotes, 2-space indent, 100-char width). |

**Gate Result: PASS** -- All principles satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/014-lead-magnet-landing-pages/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
cms/src/collections/
└── LeadMagnets.ts              # MODIFY: add coverImage + benefits fields

site/src/
├── pages/
│   └── guides/
│       └── [slug].astro        # NEW: lead magnet landing page route
├── layouts/
│   ├── ServiceLayout.astro     # MODIFY: remove inline form, keep CTA
│   └── GuideLayout.astro       # NEW: landing page layout for guides
├── components/
│   └── content/
│       └── LeadMagnetCTA.astro # MODIFY: link to /guides/[slug] instead of #anchor
├── lib/
│   └── payload.ts              # MODIFY: add fetchLeadMagnet(slug) single-fetch
└── styles/
    └── guide.css.ts            # NEW: Vanilla Extract styles for guide landing page

site/src/pages/
├── services/walkout-basements.astro  # MODIFY: update hardcoded lead magnet with slug
├── services/retaining-walls.astro    # MODIFY: update hardcoded lead magnet with slug
└── blog/[...slug].astro              # MODIFY: CTA links to landing page
```

**Structure Decision**: Follows the existing monorepo pattern. New guide pages get their own route directory (`pages/guides/`) and layout (`GuideLayout.astro`) to separate concerns from paid landing pages (`/lp/`). CMS changes stay in cms/src/collections/.

## Complexity Tracking

No violations. No additional complexity beyond what the feature requires.

## Phase 0: Research

See [research.md](./research.md) for full findings.

## Phase 1: Design

See [data-model.md](./data-model.md) for entity schema.
See [quickstart.md](./quickstart.md) for dev setup.

## Phase 2: Implementation Phases

### Phase 2A: CMS Schema Extension (P3 requirements)

**Goal**: Add `coverImage` and `benefits` fields to LeadMagnets collection.

**Files**:
- `cms/src/collections/LeadMagnets.ts` -- Add two new fields after `thumbnailImage`

**Changes**:
1. Add `coverImage` field (upload, relationTo: 'media', optional) with admin description "Front cover image of the PDF guide for the landing page"
2. Add `benefits` field (richText via `@payloadcms/richtext-lexical`, optional) with admin description "Benefits/highlights shown on the landing page"
3. Both fields are optional so existing lead magnets remain valid

**Acceptance**: CMS admin can upload a cover image and enter rich text benefits for any lead magnet. API returns these fields when queried.

---

### Phase 2B: Data Fetching (FR-001, FR-010)

**Goal**: Add single lead magnet fetch function and update `getStaticPaths` data flow.

**Files**:
- `site/src/lib/payload.ts` -- Add `fetchLeadMagnet(slug)` function

**Changes**:
1. Add `fetchLeadMagnet(slug: string)` that queries `lead-magnets?where[slug][equals]=${slug}&where[status][equals]=published&depth=1`
2. The existing `fetchLeadMagnets()` already fetches all published -- reuse for `getStaticPaths`

**Acceptance**: `fetchLeadMagnet('walkout-basements-guide')` returns the full lead magnet object with cover image and benefits populated.

---

### Phase 2C: Guide Landing Page (FR-001, FR-002, FR-003, FR-004, FR-005, FR-011, FR-012)

**Goal**: Create the dedicated landing page route and layout.

**Files**:
- `site/src/pages/guides/[slug].astro` -- NEW: dynamic route
- `site/src/layouts/GuideLayout.astro` -- NEW: page layout
- `site/src/styles/guide.css.ts` -- NEW: Vanilla Extract styles

**Changes**:
1. **`[slug].astro`**: Uses `getStaticPaths()` to generate a page for each published lead magnet. Passes lead magnet data as props to GuideLayout.
2. **`GuideLayout.astro`**: Standard site navigation (BaseLayout wrapper). Sections:
   - Hero: Guide title + description
   - Two-column layout: Cover image (left) + benefits list with form (right)
   - On mobile: stacks vertically (cover image, benefits, form)
   - Reuses `<LeadMagnetForm>` component with `client:idle` hydration
3. **`guide.css.ts`**: Vanilla Extract styles following the project's design token system (navy, green, amber palette; Fraunces + Space Grotesk fonts; fluid type scale)

**Acceptance**: Visiting `/guides/walkout-basements-guide` shows the cover image, benefits, and form. Submitting the form triggers `lead_magnet_submit` analytics event and shows download link.

---

### Phase 2D: Update Service Page CTAs (FR-006, FR-007)

**Goal**: Service page CTA links to landing page; inline form removed.

**Files**:
- `site/src/components/content/LeadMagnetCTA.astro` -- Change href from anchor to URL
- `site/src/layouts/ServiceLayout.astro` -- Remove inline `<LeadMagnetForm>` section
- `site/src/pages/services/walkout-basements.astro` -- Update hardcoded data with slug
- `site/src/pages/services/retaining-walls.astro` -- Update hardcoded data with slug (if it has a lead magnet)

**Changes**:
1. **LeadMagnetCTA**: Add optional `landingPageUrl` prop. When provided, button href points to URL instead of `#lead-magnet-{id}`. When not provided, falls back to anchor (backward compatible).
2. **ServiceLayout**: Remove the `<div id="lead-magnet-{id}">` form wrapper and `<LeadMagnetForm>` import. Keep the `<LeadMagnetCTA>` with the new `landingPageUrl` prop set to `/guides/${service.leadMagnet.slug}`.
3. **Service pages**: Ensure hardcoded fallback lead magnet objects include `slug` field for URL generation.

**Acceptance**: Clicking "Download Free Guide" on a service page navigates to `/guides/[slug]`. No inline form is visible on service pages.

---

### Phase 2E: Update Blog Lead Magnet CTAs

**Goal**: Blog post lead magnet CTAs link to the landing page.

**Files**:
- `site/src/pages/blog/[...slug].astro` -- Pass landingPageUrl to LeadMagnetCTA

**Changes**:
1. When rendering `<LeadMagnetCTA>` for a blog post's `leadMagnetCTA` relationship, compute `landingPageUrl` from the lead magnet's slug: `/guides/${leadMagnet.slug}`
2. No inline form exists in blog posts currently, so only the CTA link changes

**Acceptance**: Clicking a lead magnet CTA in a blog post navigates to `/guides/[slug]`.

---

### Phase 2F: Testing & Validation

**Goal**: Verify all acceptance criteria across viewports.

**Files**:
- `site/tests/unit/guide-landing-page.test.ts` -- NEW: unit tests for data fetching
- `site/tests/integration/guide-landing-page.spec.ts` -- NEW: E2E tests

**Tests**:
1. Unit: `fetchLeadMagnet()` returns correct data shape
2. E2E: Guide landing page renders cover image, benefits, form
3. E2E: Form submission works and shows download link
4. E2E: Service page CTA navigates to guide page (no inline form)
5. A11y: Guide landing page passes axe-core AA checks
6. Visual: Renders correctly on mobile, tablet, desktop, wide viewports
