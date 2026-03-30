# Implementation Plan: Add Retaining Walls Service

**Branch**: `004-retaining-walls-service` | **Date**: 2026-03-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-retaining-walls-service/spec.md`

## Summary

Add a dedicated Retaining Walls service page at `/services/retaining-walls` following the established service page pattern (Astro SSG page + ServiceLayout + CMS fallback data). Update site navigation (header dropdown + footer) to include the new service. Lead capture form, validation, CMS collection, and email templates already support `retaining-walls` (implemented on `003-site-fixes-content` branch).

## Technical Context

**Language/Version**: TypeScript 5.8
**Primary Dependencies**: Astro 5.7 (SSG), Payload CMS 3.x, React 19, Zod
**Storage**: Cloudflare D1 (SQLite via `@payloadcms/db-d1-sqlite`), R2 (media)
**Testing**: Vitest (unit), Playwright (integration/visual)
**Target Platform**: Cloudflare CDN (pre-rendered static HTML)
**Project Type**: SSG marketing website
**Performance Goals**: LCP <= 1.5s, CLS <= 0.05, TTFB <= 200ms, page weight <= 250KB (per Constitution Art. I)
**Constraints**: Zero client-side JS by default (Islands Architecture); no new abstractions or components
**Scale/Scope**: Single new page + 2 navigation file edits; follows established pattern exactly

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Article | Gate | Status | Notes |
|---------|------|--------|-------|
| I. Content-First, Static-First | Page must be SSG, zero JS default | PASS | Astro SSG page using ServiceLayout; no interactive islands needed |
| II. Prescribed Tech Stack | Must use canonical stack only | PASS | Astro + Payload CMS + Open Props + Vanilla Extract |
| III. Specialized Authority | Must communicate specialization proof | PASS | Retaining walls align with structural/foundation expertise; anxiety stack addresses structural safety, drainage, code compliance |
| IV. Mobile-First | Mobile-first design, 48px touch targets | PASS | ServiceLayout already compliant; no new components |
| V. Conversion Architecture | Dual CTA, multi-step form | PASS | ServiceLayout includes phone CTA + estimate form CTA; form already accepts `retaining-walls` |
| VI. Trust Signals | Anxiety stack, trust badges, reviews | PASS | ServiceLayout renders all trust sections; fallback content includes full anxiety stack |
| VII. Outcome-Led Messaging | Headlines lead with outcomes, value pillars | PASS | Transformation (primary) + Safety (supporting); copy leads with landscape/structural outcomes |
| VIII. Compliance & Claims | No blanket promises, educational framing | PASS | Fallback copy uses ranges/estimates, not guarantees |
| IX. SEO & Geographic Authority | Schema markup, meta tags | PASS | ServiceLayout auto-generates Service + FAQ JSON-LD schemas |
| X. Structured Content | CMS entity + reusable fields | PASS | Services collection already supports all fields; fallback data mirrors CMS schema |
| XI. Data Sovereignty | First-party data storage | PASS | No new data flows; leads already stored in Payload CMS |
| XII. Brand Identity | Color system, typography, no cliches | PASS | ServiceLayout uses design token system; transformation pillar accent (green) |
| XIII. Accessibility | WCAG 2.2 AA | PASS | ServiceLayout meets accessibility requirements; no new interactive elements |
| XIV. Measurement | Conversion tracking | PASS | Existing form tracking covers retaining-walls service type |
| XV. Test-First | TDD mandatory | REQUIRED | Tests must be written before implementation code |
| XVI. Simplicity | No speculative features, minimal structure | PASS | Following exact existing pattern; zero new components or abstractions |

No violations. All gates pass.

## Project Structure

### Documentation (this feature)

```text
specs/004-retaining-walls-service/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── checklists/
│   └── requirements.md  # Spec quality checklist (complete)
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
site/src/
├── pages/services/
│   └── retaining-walls.astro          # NEW — Service page (P1)
├── components/layout/
│   ├── Header.astro                   # MODIFY — Add nav item (P2)
│   └── Footer.astro                   # MODIFY — Add footer link (P2)
├── layouts/
│   └── ServiceLayout.astro            # UNCHANGED — Renders all sections
├── lib/
│   ├── payload.ts                     # UNCHANGED — fetchServices(), fetchSiteSettings()
│   └── schema.ts                      # UNCHANGED — generateServiceSchema(), generateFAQPageSchema()
└── components/forms/
    └── MultiStepForm.tsx              # ALREADY DONE — retaining-walls option added

cms/src/
├── collections/
│   ├── Services.ts                    # UNCHANGED — Schema supports retaining walls
│   └── Leads.ts                       # ALREADY DONE — retaining-walls in serviceType
├── email/
│   ├── team-notification.ts           # ALREADY DONE — SERVICE_LABELS updated
│   └── lead-confirmation.ts           # ALREADY DONE — SERVICE_LABELS updated
└── payload-types.ts                   # ALREADY DONE — Union type updated

site/src/lib/
└── validation.ts                      # ALREADY DONE — Zod enum updated
```

**Structure Decision**: No new directories or components. This feature adds one new Astro page file and modifies two existing navigation components, following the exact pattern established by the 5 existing service pages.

## Pre-Existing Work

The following changes were already implemented on the `003-site-fixes-content` branch and should be cherry-picked or verified on this feature branch:

| File | Change | FR |
|------|--------|----|
| `site/src/components/forms/MultiStepForm.tsx` | Added `retaining-walls` to SERVICE_OPTIONS | FR-005 |
| `site/src/lib/validation.ts` | Added `retaining-walls` to Zod serviceType enum | FR-006 |
| `cms/src/collections/Leads.ts` | Added `retaining-walls` to serviceType select | FR-007 |
| `cms/payload-types.ts` | Updated union type | FR-007 |
| `cms/src/email/team-notification.ts` | Added `retaining-walls` to SERVICE_LABELS | FR-008 |
| `cms/src/email/lead-confirmation.ts` | Added `retaining-walls` to SERVICE_LABELS | FR-008 |

## Implementation Scope

### Task 1: Create retaining-walls.astro (FR-001, FR-002, FR-009, FR-010)

Create `site/src/pages/services/retaining-walls.astro` following the exact pattern from `walkout-basements.astro`:

1. Frontmatter: Import ServiceLayout, fetch services + settings from CMS
2. Find service by slug `retaining-walls`
3. Fallback data block with all required fields:
   - `primaryValuePillar: 'transformation'`, `supportingPillars: ['safety']`
   - `serviceType: 'core'`
   - 4+ process steps specific to retaining wall construction
   - 7 anxiety stack fields addressing retaining wall concerns
   - Differentiator section
   - 5+ FAQs targeting retaining wall search queries
   - SEO metadata (metaTitle < 60 chars, metaDescription < 160 chars)
4. Render: `<ServiceLayout service={service} settings={settings} />`

### Task 2: Update Header navigation (FR-003)

Add `{ label: 'Retaining Walls', url: '/services/retaining-walls' }` to the fallback nav children array in `site/src/components/layout/Header.astro` (line 24, before the closing bracket).

### Task 3: Update Footer navigation (FR-004)

Add `{ label: 'Retaining Walls', url: '/services/retaining-walls' }` to the fallback footer Services column in `site/src/components/layout/Footer.astro` (line 29, before the closing bracket).

### Task 4: Verify lead capture end-to-end (FR-005, FR-006, FR-007, FR-008)

Confirm the pre-existing changes from `003-site-fixes-content` are present on this branch. No new code needed — validation only.

## Complexity Tracking

No violations to justify. All implementation follows existing patterns with zero new abstractions.
