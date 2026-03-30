# Implementation Plan: BaseScape Website V1

**Branch**: `001-basescape-website-v1` | **Date**: 2026-03-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-basescape-website-v1/spec.md`

## Summary

Build the first public website for BaseScape — a specialized residential construction company focused on basement walkout installations, egress window systems, and ADU-enabling basement transformations on Utah's Wasatch Front. The site is a lead-generation engine: Astro SSG frontend served from Cloudflare Pages edge, Payload CMS headless backend for structured content and lead storage, Open Props + Vanilla Extract for zero-runtime styling, Astro Actions + Zod for server-side form validation on Cloudflare Workers, and Payload CMS lifecycle hooks for lead notifications and confirmation emails.

## Technical Context

**Language/Version**: TypeScript 5.x (Astro + Payload CMS are both TypeScript-first)
**Primary Dependencies**: Astro 5.x (MPA/SSG), Payload CMS 3.x (headless CMS), Open Props (design tokens), Vanilla Extract (zero-runtime CSS), Zod (validation)
**Storage**: Payload CMS on Cloudflare Workers with D1 (SQLite) via `@payloadcms/db-d1-sqlite` + R2 for media (see [R-001](./research.md#r-001-payload-cms-hosting-strategy), [R-002](./research.md#r-002-payload-cms-database-choice))
**Testing**: Vitest (unit, via Astro's `getViteConfig()`), Playwright (E2E + visual regression), @axe-core/playwright (a11y), Lighthouse CI (CWV thresholds against CF Pages preview URLs) (see [R-009](./research.md#r-009-testing-setup))
**Target Platform**: Web — Cloudflare Pages (static assets) + Cloudflare Workers (Astro Actions / server endpoints)
**Project Type**: Marketing website with headless CMS backend (two services: Astro site + Payload CMS)
**Performance Goals**: LCP ≤ 1.5s, FID ≤ 50ms, CLS ≤ 0.05, TTFB ≤ 200ms, page weight ≤ 250KB compressed (Article I thresholds)
**Constraints**: Zero client-side JS default (Islands only for documented interactions), static-first SSG, mobile-first design, all pages pre-rendered at build time, no runtime DB queries for public visitors
**Scale/Scope**: ~75+ total pages (3 service pages, 25 city pages × 3 service variants potential, homepage, about, gallery, financing, process, blog, FAQ, privacy, paid landing pages), 10 CMS collections, 25 launch cities

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*
*Post-Phase 1 re-check: 2026-03-23 — ALL GATES PASS. No new violations introduced by design decisions.*

| Article | Gate | Status | Notes |
|---------|------|--------|-------|
| I. Content-First, Static-First | All pages SSG, zero-JS default, CWV thresholds | ✅ PASS | Astro SSG + Cloudflare Pages edge delivery. Islands only for multi-step form + mobile nav. |
| II. Prescribed Tech Stack | Astro + Payload CMS + Open Props + Vanilla Extract + Zod | ✅ PASS | Exact match to canonical stack. No prohibited technologies used. |
| III. Specialized Authority | Every high-intent page shows proof of specialization | ✅ PASS | Spec requires specialization messaging on all service/location pages (FR-006–009). |
| IV. Mobile-First | 48px touch targets, sticky CTA, thumb-driven | ✅ PASS | Spec FR-003, FR-005 enforce mobile CTA placement and sizing. |
| V. Conversion Architecture | Dual CTA, multi-step form, speed-to-lead < 5s | ✅ PASS | Spec FR-004, FR-010–018 define exact form architecture. |
| VI. Trust Signals | Trust adjacent to CTA on all key pages | ✅ PASS | Spec FR-025–028 require trust stack. V1 uses manually curated reviews with source attribution per amended Art. VI §3 (v1.2.0). API integration deferred to Phase 2. |
| VII. Outcome-Led Messaging | Three value pillars, outcome-first headlines | ✅ PASS | Spec FR-047–048 enforce pillar alignment. |
| VIII. Compliance/Claims | Claims as guidance, not guarantees | ✅ PASS | Spec FR-033 requires disclaimer language on all financial claims. |
| IX. SEO/Geo Authority | Unique city pages, schema markup, NAP consistency | ✅ PASS | Spec FR-022–024 define 25 cities with unique content requirement. |
| X. Structured Content | Reusable CMS entities, non-technical editing | ✅ PASS | Spec FR-043 requires editorial control. 10 entity types identified. |
| XI. Data Sovereignty | First-party lead storage, secure transmission | ✅ PASS | Spec FR-019 mandates CMS-first storage. HTTPS + Zod validation. |
| XII. Brand Identity | Color psychology, serif+sans, no construction cliches | ✅ PASS | Fraunces (serif headlines) + Space Grotesk (geometric sans body). ~89KB combined. No construction cliches. See R-008. |
| XIII. Accessibility | WCAG 2.2 AA | ✅ PASS | Spec QR-002 + constitution Art. XIII (v1.2.0) both aligned on WCAG 2.2 AA. |
| XIV. Measurement | Full funnel analytics | ✅ PASS | Plausible Analytics (~1KB script) for funnel tracking. GA4 hedge for Google Ads. See R-013. |
| XV. Test-First | TDD with test hierarchy | ✅ PASS | Constitution defines test priority order. Researched in Phase 0. |
| XVI. Simplicity | Minimal projects, no speculative features | ✅ PASS | Two services only (Astro + Payload CMS). Per Art. XVI §1. |

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Art. VI §3: V1 uses manually curated reviews (resolved) | BaseScape is a startup with zero reviews at launch. | **RESOLVED** — Constitution Art. VI §3 amended (v1.2.0) to permit curated reviews with source attribution in V1. No longer a deviation. |
| Art. V §3: FSM webhook dispatch deferred | FSM software selection is pending (spec Assumption 7). Speed-to-lead pipeline cannot include FSM dispatch without a selected vendor. | V1 stores leads in Payload CMS and sends email notification to team for manual follow-up. FSM webhook integration is a post-launch phase. Pipeline still meets < 5s for the steps it can execute (validation → storage → email confirmation). |

## Project Structure

### Documentation (this feature)

```text
specs/001-basescape-website-v1/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── payload-api.md   # Payload CMS REST/Local API contracts
│   ├── astro-actions.md # Form submission + server action contracts
│   ├── webhooks.md      # FSM webhook contracts (deferred but documented)
│   └── email.md         # Transactional email contracts
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
site/                              # Astro project root
├── astro.config.ts
├── src/
│   ├── actions/                   # Astro Actions (form handlers, server endpoints)
│   │   ├── lead-submit.ts
│   │   └── callback-request.ts
│   ├── components/                # Astro components (zero-JS by default)
│   │   ├── layout/                # Header, Footer, StickyNav, MobileBottomBar
│   │   ├── forms/                 # Multi-step form (Island), QuickCallback (Island)
│   │   ├── trust/                 # TrustBadges, ReviewCard, LicenseBadge
│   │   ├── gallery/               # BeforeAfter, ProjectCard
│   │   ├── content/               # FAQ, ServiceCard, CTABlock
│   │   └── seo/                   # SchemaMarkup, StructuredData
│   ├── layouts/                   # Page layouts
│   │   ├── BaseLayout.astro       # Root layout (nav, footer, analytics)
│   │   ├── ServiceLayout.astro    # Service page template
│   │   ├── LocationLayout.astro   # Service area page template
│   │   └── LandingLayout.astro    # Paid landing page (suppressed nav)
│   ├── pages/                     # File-based routing
│   │   ├── index.astro            # Homepage
│   │   ├── about.astro
│   │   ├── how-it-works.astro
│   │   ├── financing.astro
│   │   ├── gallery.astro
│   │   ├── faq.astro
│   │   ├── privacy.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   ├── services/
│   │   │   ├── walkout-basements.astro
│   │   │   ├── egress-windows.astro
│   │   │   └── window-well-upgrades.astro
│   │   ├── areas/                 # Service area pages (generated from CMS)
│   │   │   └── [...slug].astro
│   │   └── lp/                    # Paid landing pages
│   │       └── [...slug].astro
│   ├── styles/                    # Vanilla Extract + Open Props
│   │   ├── theme.css.ts           # Design tokens (maps Open Props to VE vars)
│   │   ├── global.css             # Reset, Open Props imports, custom properties
│   │   ├── typography.css.ts
│   │   └── layouts.css.ts
│   ├── lib/                       # Shared utilities
│   │   ├── payload.ts             # Payload CMS client (build-time fetching)
│   │   ├── schema.ts              # JSON-LD schema generation helpers
│   │   └── validation.ts          # Shared Zod schemas (form validation)
│   └── content/                   # Astro Content Collections (if any static content)
├── public/
│   ├── fonts/                     # Variable font files (self-hosted)
│   └── images/                    # Static images (favicons, logos)
└── tests/
    ├── contract/                  # API contract tests (Payload ↔ Astro)
    ├── integration/               # Lead pipeline E2E, form submission flows
    ├── visual/                    # Playwright visual regression (mobile-first)
    ├── a11y/                      # axe-core accessibility tests
    ├── performance/               # Lighthouse CI thresholds
    └── unit/                      # Zod schemas, schema markup generation

cms/                               # Payload CMS project root
├── payload.config.ts
├── src/
│   ├── collections/               # Payload CMS collections
│   │   ├── Services.ts
│   │   ├── ServiceAreas.ts
│   │   ├── Leads.ts
│   │   ├── Projects.ts           # Case studies / gallery
│   │   ├── FAQs.ts
│   │   ├── Reviews.ts
│   │   ├── LeadMagnets.ts
│   │   ├── BlogPosts.ts
│   │   ├── Offers.ts
│   │   └── PaidLandingPages.ts
│   ├── globals/                   # Payload CMS globals
│   │   ├── SiteSettings.ts        # NAP, phone, business hours
│   │   └── Navigation.ts
│   ├── hooks/                     # Payload lifecycle hooks
│   │   ├── afterLeadCreate.ts     # Email notification + confirmation
│   │   └── validateLead.ts
│   └── email/                     # Email templates
│       ├── lead-confirmation.ts
│       └── team-notification.ts
└── tests/
    ├── collections/               # Collection CRUD tests
    └── hooks/                     # Lifecycle hook tests
```

**Structure Decision**: Two co-located projects at repository root (`site/` for Astro, `cms/` for Payload CMS) per Constitution Article XVI §1 ("single Astro project with Payload CMS as a co-located or adjacent service"). This is the minimum viable structure — Astro fetches from Payload's Local API at build time, and Payload runs as a separate Node.js service for the admin panel and API.
