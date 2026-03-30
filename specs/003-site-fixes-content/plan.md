# Implementation Plan: Site Fixes & Content Updates

**Branch**: `003-site-fixes-content` | **Date**: 2026-03-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-site-fixes-content/spec.md`

## Summary

Fix the broken "Get Free Estimate" CTA button (P1), restore disappeared FAQ answer content on service pages (P2), update business information site-wide (P3), hide fabricated reviews and empty Gallery page (P3-P4), implement multi-column footer layout (P5), add two new service pages with FAQ (P5), and expand FAQ content via Google research (P6).

**Root causes identified**:
- CTA bug: `MultiStepForm` component only rendered in `LandingLayout.astro`, not in `BaseLayout.astro` used by regular pages (see [R-001](./research.md#r-001-cta-button-not-working--root-cause))
- FAQ disappearance: Lexical richText from CMS returns JSON objects, but `ServiceLayout.astro` only handles HTML strings via `typeof content === 'string' ? content : ''` (see [R-002](./research.md#r-002-faq-answers-disappeared--root-cause))

## Technical Context

**Language/Version**: TypeScript 5.8
**Primary Dependencies**: Astro 5.7, Payload CMS 3.x, React 19, Open Props, Vanilla Extract, Zod
**Storage**: Cloudflare D1 (SQLite) via @payloadcms/db-d1-sqlite, R2 (media)
**Testing**: Vitest (unit), Playwright (E2E + a11y), Lighthouse CI (performance)
**Target Platform**: Cloudflare Workers (CDN edge), SSG
**Project Type**: Web application (Astro SSG + Payload CMS headless)
**Performance Goals**: LCP ≤ 1.5s, FID ≤ 50ms, CLS ≤ 0.05, TTFB ≤ 200ms, page weight ≤ 250KB (per Art. I)
**Constraints**: Zero client-side JS by default (Islands Architecture), mobile-first design
**Scale/Scope**: ~15 pages, 5 service pages (3 existing + 2 new), 11 CMS collections, 2 globals

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Article | Requirement | Status | Notes |
|---------|-------------|--------|-------|
| I. Content-First, Static-First | All pages SSG, CWV thresholds met | PASS | MultiStepForm is already a React Island with `client:load`; adding it to BaseLayout doesn't change SSG nature. New service pages are static. |
| II. Prescribed Stack | No prohibited technologies | PASS | No new dependencies added. Lexical serializer is a utility file, not a new library. |
| III. Specialized Authority | Positioned as basement/egress specialist | TENSION | Adding Pavers & Hardscapes and Artificial Turf are non-basement services. Mitigated by `serviceType: 'specialized'` distinction — see Complexity Tracking. |
| IV. Mobile-First | Thumb-driven, 48px touch targets | PASS | Footer changes maintain mobile-first approach. New pages use existing responsive patterns. |
| V. Conversion Architecture | Dual CTA, multi-step form, speed-to-lead | PASS | Fixing CTA button restores the conversion pipeline. Form already exists — just needs to be rendered on all pages. |
| VI. Trust Signals | Trust elements before/adjacent to CTA | PASS | Hiding fake reviews improves trust integrity. Real reviews can be re-enabled via CMS toggle. |
| VII. Outcome-Led Messaging | Headlines lead with homeowner outcomes | PASS | New service page copy must follow this principle. |
| VIII. Compliance | Claims as guidance, not certainty | PASS | License number update ensures accurate regulatory info. |
| IX. SEO & Geographic Authority | Schema markup, NAP consistency | PASS | New service pages get JSON-LD. Phone number update maintains NAP consistency. |
| X. Structured Content | Reusable CMS entities | PASS | New services follow existing Services collection pattern. FAQs use existing FAQs collection. |
| XI. Data Sovereignty | First-party data ownership | PASS | No third-party data storage changes. |
| XII. Brand Identity | Color psychology, typography | PASS | No visual design system changes. New pages use existing tokens. |
| XIII. Accessibility | WCAG 2.2 Level AA | PASS | Footer layout changes must maintain contrast/keyboard/focus. FAQ accordion uses native `<details>/<summary>`. |
| XIV. Measurement | Full lead funnel tracking | PASS | CTA fix restores form tracking. No new conversion events needed. |
| XV. Test-First | TDD: Red → Green → Refactor | PASS | Tests must be written before implementation code. |
| XVI. Simplicity | Minimal projects, framework trust | PASS | All changes within existing project structure. No new abstractions. |

**Post-Design Re-check**: All gates still pass. Art. III tension is documented and justified in Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/003-site-fixes-content/
├── plan.md              # This file
├── research.md          # Phase 0: Root cause analysis + research
├── data-model.md        # Phase 1: Schema changes
├── quickstart.md        # Phase 1: Developer setup guide
├── checklists/
│   └── requirements.md  # Spec quality checklist
├── spec.md              # Feature specification
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
site/src/
├── actions/
│   └── index.ts                          # Form submission actions (unchanged)
├── components/
│   ├── content/
│   │   ├── CTABlock.astro                # CTA buttons (unchanged — estimateUrl default works)
│   │   ├── FAQ.astro                     # FAQ accordion (unchanged)
│   │   └── ServiceCard.astro             # Service cards (unchanged)
│   ├── forms/
│   │   └── MultiStepForm.tsx             # Lead form (unchanged — already has id="estimate-form")
│   ├── layout/
│   │   ├── Footer.astro                  # MODIFY: multi-column CSS, business info fallbacks, Gallery filtering
│   │   ├── Header.astro                  # MODIFY: Gallery link filtering based on showGallery
│   │   └── MobileBottomBar.astro         # MODIFY: phone fallback
│   └── trust/
│       ├── ReviewCard.astro              # Unchanged
│       └── TrustBadges.astro             # Unchanged (reads from settings)
├── layouts/
│   ├── BaseLayout.astro                  # MODIFY: Add MultiStepForm component
│   └── ServiceLayout.astro               # MODIFY: Fix richText serialization, conditional reviews
├── lib/
│   ├── payload.ts                        # CMS API client (unchanged)
│   ├── schema.ts                         # JSON-LD generators (unchanged)
│   ├── serialize-lexical.ts              # NEW: Lexical JSON → HTML serializer
│   └── validation.ts                     # Form validation (unchanged)
├── pages/
│   ├── index.astro                       # MODIFY: Conditional reviews section, business info fallbacks
│   ├── gallery.astro                     # MODIFY: Return 404 when showGallery is false
│   └── services/
│       ├── walkout-basements.astro       # MODIFY: Update phone fallback
│       ├── egress-windows.astro          # MODIFY: Update phone fallback
│       ├── window-well-upgrades.astro    # MODIFY: Update phone fallback
│       ├── pavers-hardscapes.astro       # NEW: Pavers & Hardscapes service page
│       └── artificial-turf.astro         # NEW: Artificial Turf service page
└── styles/                               # Unchanged

site/tests/
├── unit/
│   └── serialize-lexical.test.ts         # NEW: Lexical serializer tests
├── integration/
│   └── cta-form.test.ts                  # NEW: CTA → form connection test
└── e2e/
    ├── cta-navigation.spec.ts            # NEW: E2E CTA button tests
    ├── faq-answers.spec.ts               # NEW: E2E FAQ visibility tests
    ├── business-info.spec.ts             # NEW: E2E business info tests
    ├── reviews-hidden.spec.ts            # NEW: E2E reviews hidden tests
    ├── gallery-hidden.spec.ts            # NEW: E2E gallery hidden tests
    ├── footer-layout.spec.ts             # NEW: E2E footer column tests
    └── new-services.spec.ts              # NEW: E2E new service pages tests

cms/src/
├── collections/
│   └── Services.ts                       # MODIFY: Add serviceType field, make anxietyStack optional
├── globals/
│   └── SiteSettings.ts                   # MODIFY: Add showReviews, showGallery toggles
└── seed.ts                               # MODIFY: Update business info, add new services + FAQs

site/astro.config.ts                      # MODIFY: Sitemap filter for gallery when hidden
```

**Structure Decision**: Existing monorepo structure with `site/` (Astro) and `cms/` (Payload CMS) packages. All changes fit within the current structure. One new utility file (`serialize-lexical.ts`) and two new service pages. No new packages, projects, or abstractions.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Art. III: Adding non-basement services (Pavers & Hardscapes, Artificial Turf) | User explicitly requested these as real services BaseScape plans to offer. Business diversification. | Rejecting user's business decision isn't our call. Mitigated by `serviceType: 'specialized'` field that maintains visual/hierarchical distinction from core basement/egress services. Homepage can show core services prominently with specialized services in a separate subsection. |
