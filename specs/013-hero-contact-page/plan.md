# Implementation Plan: Hero Redesign + Dedicated Contact Page

**Branch**: `013-hero-contact-page` | **Date**: 2026-03-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/013-hero-contact-page/spec.md`

## Summary

Simplify the homepage hero to a trust-forward message with inline ZIP code input, create a dedicated `/contact` page as the single lead form location, restyle the mobile bottom bar to flat edge-to-edge cells, route all site CTAs to `/contact`, and add a fire-and-forget Google Sheets webhook in the CMS lead hook.

## Technical Context

**Language/Version**: TypeScript, Astro 5.7.x, React 19.1.x
**Primary Dependencies**: Astro, React, Vanilla Extract, Zod, Payload CMS 3.x, Lucide (icons)
**Storage**: Cloudflare D1 (SQLite) via Payload CMS, Cloudflare R2 (media)
**Testing**: Vitest 3.1.x (unit), Playwright 1.52.x (e2e, a11y via axe-core)
**Target Platform**: Cloudflare Pages (static site), Cloudflare Workers (CMS)
**Project Type**: Static website (Astro) with headless CMS backend (Payload)
**Performance Goals**: Lighthouse 90+ all categories (constitution mandate)
**Constraints**: Static-first build (must succeed without CMS), no external asset dependencies in output
**Scale/Scope**: ~20 pages, residential contractor lead generation site

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Static-First, CMS-Enriched | PASS | `/contact` page uses same `fetchSiteSettings()` with hardcoded fallbacks. Hero is static markup. |
| II. Local Assets Over External URLs | PASS | No new external assets. Hero image unchanged. No new fonts or icons. |
| III. Monorepo Boundary Discipline | PASS | Site changes are site-only. CMS hook change is CMS-only. No cross-imports. Webhook is HTTP. |
| IV. Spec-Driven Development | PASS | Following speckit workflow: spec → plan → tasks. |
| V. Accessibility and Performance | PASS | Contact page will include proper headings, form labels, axe-core AA. No performance regressions expected (removing form from every page reduces bundle). |
| VI. Code Style Consistency | PASS | All code follows Prettier/ESLint config. Vanilla Extract for styles. |

**Post-Design Re-Check**: All principles remain satisfied. The Google Sheets webhook is an outbound HTTP call from the CMS (Workers), not a new external dependency in the static site output.

## Project Structure

### Documentation (this feature)

```text
specs/013-hero-contact-page/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0: decision log
├── data-model.md        # Phase 1: entity/interface documentation
├── quickstart.md        # Phase 1: dev workflow guide
├── contracts/
│   └── google-sheets-webhook.md  # Outbound webhook payload contract
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
site/src/
├── pages/
│   ├── index.astro              # MODIFY: hero section rewrite
│   └── contact.astro            # NEW: dedicated contact page
├── components/
│   ├── forms/
│   │   └── MultiStepForm.tsx    # MODIFY: add initialZip prop, read URL params
│   ├── content/
│   │   └── CTABlock.astro       # MODIFY: default estimateUrl → /contact
│   ├── layout/
│   │   ├── Header.astro         # MODIFY: CTA href → /contact
│   │   └── MobileBottomBar.astro # MODIFY: flat styling, href → /contact
│   └── trust/
│       └── TrustBadges.astro    # REUSE: on contact page (no changes)
├── layouts/
│   ├── BaseLayout.astro         # MODIFY: remove estimate-form section
│   └── LandingLayout.astro      # MODIFY: remove estimate-form section
└── styles/
    └── contact.css.ts           # NEW: contact page styles (if needed)

cms/src/
└── hooks/
    └── afterLeadCreate.ts       # MODIFY: add Google Sheets webhook POST
```

**Structure Decision**: Existing monorepo structure (`site/` + `cms/`) is preserved. Only one new page (`contact.astro`) and potentially one new style file are created. All other changes are modifications to existing files.

## Implementation Phases

### Phase A: Hero Simplification + Contact Page (P1)

**Scope**: User Stories 1 & 2 (core conversion funnel)

1. **Create `/contact` page** (`site/src/pages/contact.astro`)
   - Fetch site settings with fallback (Constitution I)
   - Render `MultiStepForm` with `client:load`
   - Include `TrustBadges` below the form
   - Add "Prefer to call?" section with phone number
   - Read `zip` query param concept (see step 3)

2. **Modify `MultiStepForm.tsx`**
   - Add `initialZip?: string` prop
   - Add `useEffect` to read `URLSearchParams` on mount: if `zip` param exists and matches `/^\d{5}$/`, set it as the initial ZIP value
   - Pre-populate step 1 ZIP field without auto-advancing

3. **Rewrite homepage hero** (`site/src/pages/index.astro`)
   - Replace current subtitle paragraph with trust-forward copy (FR-001)
   - Replace `CTABlock variant="hero"` with inline HTML form: `<form method="GET" action="/contact">` with ZIP input + submit button (FR-002, FR-003)
   - Retain headline, overline, and hero image layout (FR-004)

4. **Restyle `MobileBottomBar.astro`**
   - Flat, edge-to-edge 50/50 split (no rounded corners, gaps, shadows)
   - Left: "Call Now" with phone icon, light teal background
   - Right: "Free Estimate", dark navy background, links to `/contact`
   - Maintain `env(safe-area-inset-bottom)` padding (FR-012)

### Phase B: CTA Routing Consolidation (P2)

**Scope**: User Story 4 (all CTAs → /contact)

5. **Update `CTABlock.astro`** — Change default `estimateUrl` from `'#estimate-form'` to `'/contact'`

6. **Update `Header.astro`** — Change CTA button `href` from `#estimate-form` to `/contact`

7. **Remove form from `BaseLayout.astro`** — Delete the `<section id="estimate-form">` block and `MultiStepForm` import (FR-013)

8. **Remove form from `LandingLayout.astro`** — Same removal as BaseLayout

9. **Update `MultiStepForm.tsx`** — Remove any `id="estimate-form"` attributes from the component (they were for scroll targeting, no longer needed)

10. **Update noscript fallback** in `BaseLayout.astro` — Change from `#estimate-form` anchor to `/contact` link

### Phase C: Google Sheets Webhook (P2)

**Scope**: User Story 3 (lead logging)

11. **Add webhook to `afterLeadCreate.ts`**
    - After team notification email block
    - Check `process.env.GOOGLE_SHEETS_WEBHOOK_URL` exists
    - POST JSON payload (see `contracts/google-sheets-webhook.md`)
    - Wrap in try/catch — log errors, never throw (FR-016)

12. **Add `GOOGLE_SHEETS_WEBHOOK_URL`** to CMS environment documentation and `.env.example` (if exists)

### Phase D: Testing & Verification

13. **Unit tests** — ZIP pre-population logic in MultiStepForm
14. **E2E tests** — Homepage hero → /contact navigation, ZIP carry-through, mobile bottom bar
15. **A11y tests** — Contact page axe-core AA compliance
16. **Manual verification** — All CTA links across site point to `/contact`, no remaining `#estimate-form` references

## Complexity Tracking

> No constitution violations. No complexity justifications needed.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | — | — |
