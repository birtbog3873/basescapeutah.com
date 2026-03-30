# Tasks: BaseScape Website V1

**Input**: Design documents from `/specs/001-basescape-website-v1/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Per-story test tasks included per constitution Art. XV (TDD). Each user story phase begins with test tasks (Red phase) before implementation tasks (Green phase). Test hierarchy: contract → integration → visual regression → a11y → performance → unit.

**Organization**: Tasks grouped by user story (10 stories from spec.md) to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **site/**: Astro frontend project (Cloudflare Pages)
- **cms/**: Payload CMS backend project (Cloudflare Workers + D1 + R2)
- **Root**: pnpm workspace root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize pnpm workspace, scaffold both projects, configure tooling and environment

- [x] T001 Initialize pnpm workspace with root package.json (dev scripts: dev, build, test) and pnpm-workspace.yaml declaring site/ and cms/ packages
- [x] T002 [P] Scaffold Astro 5.x project in site/ with @astrojs/cloudflare adapter, TypeScript strict mode, and astro.config.ts
- [x] T003 [P] Scaffold Payload CMS 3.x project in cms/ with @payloadcms/db-d1-sqlite adapter, TypeScript config, and src/ directory structure (collections/, globals/, hooks/, email/)
- [x] T004 [P] Create environment variable templates: site/.env.example (PAYLOAD_URL, PAYLOAD_API_KEY, PLAUSIBLE_DOMAIN, GOOGLE_PLACES_API_KEY) and cms/.dev.vars.example (PAYLOAD_SECRET, RESEND_API_KEY, TEAM_NOTIFICATION_EMAIL)
- [x] T005 [P] Configure Wrangler for CMS deployment in cms/wrangler.jsonc with D1 database binding, R2 bucket binding (basescape-media), and Workers rate limiting binding (FORM_RATE_LIMITER)
- [x] T006 [P] Configure ESLint and Prettier at workspace root with TypeScript and Astro parser support
- [x] T090 [P] Configure Vitest with Astro's getViteConfig() in site/vitest.config.ts and add test scripts to site/package.json
- [x] T091 [P] Configure Vitest for CMS hook and collection tests in cms/vitest.config.ts and add test scripts to cms/package.json
- [x] T092 [P] Configure Playwright for E2E, visual regression, and a11y testing with @axe-core/playwright in site/playwright.config.ts (breakpoints: 375px, 768px, 1024px, 1440px)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Design system, CMS configuration, shared collections, base layouts, and utility libraries that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Design System

- [x] T007 Configure Vanilla Extract Vite plugin in site/astro.config.ts (import @vanilla-extract/vite-plugin, add to vite.plugins array)
- [x] T008 [P] Create design token mapping (Open Props custom properties → Vanilla Extract typed constants) in site/src/styles/theme.css.ts with brand colors via createGlobalTheme
- [x] T009 [P] Create global CSS reset, Open Props imports (import 'open-props/style'), and base custom properties in site/src/styles/global.css
- [x] T010 [P] Create typography scale using Fraunces (serif headlines) and Space Grotesk (sans-serif body) with responsive sizes in site/src/styles/typography.css.ts
- [x] T011 [P] Create responsive layout utilities (container widths, grid patterns, spacing) in site/src/styles/layouts.css.ts
- [x] T012 Install and configure self-hosted variable fonts (@fontsource-variable/fraunces, @fontsource-variable/space-grotesk) with font-face declarations in site/

### Payload CMS Core

- [x] T013 Configure Payload CMS root config with D1 adapter, R2 storage via @payloadcms/storage-s3, Resend email adapter, media collection (image sizes: thumbnail 200px, card 600px, hero 1200px, full 2400px), and register all collections/globals in cms/payload.config.ts
- [x] T014 [P] Create SiteSettings global (businessName, phone, email, address group, operatingHours array, licenseNumber, insuranceInfo, socialLinks, riskReversals array, serviceAreaZipCodes) in cms/src/globals/SiteSettings.ts
- [x] T015 [P] Create Navigation global (mainNav array with children, footerNav array with columns/links) in cms/src/globals/Navigation.ts
- [x] T016 [P] Create Services collection (title, slug, tagline, primaryValuePillar select, heroImage, overview richText, process array, anxietyStack group with 7 richText fields, differentiator, FAQ/Project/Review relationships, SEO group, draft/publish status) in cms/src/collections/Services.ts
- [x] T017 [P] Create FAQs collection (question, answer richText, category enum per FR-035, applicableServices/applicableAreas relationships, sortOrder, status) in cms/src/collections/FAQs.ts
- [x] T018 [P] Create Reviews collection (reviewerName, reviewText, starRating 1-5, city/serviceType relationships, source attribution text, reviewDate, featured checkbox, status) in cms/src/collections/Reviews.ts
- [x] T019 [P] Create Projects collection (title, slug, projectType→Services, city→ServiceAreas, challenge/solution/outcome richText, beforeImages/afterImages/detailImages arrays with captions, featured checkbox, SEO, status) in cms/src/collections/Projects.ts

### Shared Utilities

- [x] T020 Create Payload CMS REST API client utility (typed fetch wrappers for getStaticPaths: fetchServices, fetchServiceAreas, fetchProjects, fetchFAQs, fetchReviews, fetchBlogPosts, fetchLeadMagnets, fetchOffers, fetchLandingPages, fetchSiteSettings, fetchNavigation) in site/src/lib/payload.ts
- [x] T021 [P] Create shared Zod validation schemas (leadStepOneSchema, leadStepTwoSchema, leadStepThreeSchema, quickCallbackSchema, leadMagnetSchema with phone/email/zip validators and honeypot field) in site/src/lib/validation.ts
- [x] T022 [P] Create JSON-LD structured data generation helpers (generateOrganizationSchema, generateLocalBusinessSchema with aggregateRating support, generateServiceSchema, generateFAQPageSchema, generateBreadcrumbSchema, generateArticleSchema) in site/src/lib/schema.ts

### Foundational Tests (Art. XV TDD)

- [x] T093 [P] Write unit tests for Zod validation schemas (leadStepOneSchema through leadStepThreeSchema, quickCallbackSchema, honeypot rejection, zip code validation) in site/tests/unit/validation.test.ts
- [x] T094 [P] Write unit tests for JSON-LD schema generation helpers (Organization, LocalBusiness with aggregateRating, Service, FAQPage, Breadcrumb, Article) in site/tests/unit/schema.test.ts
- [x] T095 [P] Write contract test skeleton for Payload CMS REST API (GET /api/services, GET /api/service-areas, POST /api/leads, PATCH /api/leads/:id) in site/tests/contract/payload-api.spec.ts

### Base Layout & Navigation Components

- [x] T023 Create BaseLayout.astro with font imports (Fraunces, Space Grotesk), global.css import, <head> meta tags, Plausible analytics snippet, Header/Footer component slots, and MobileBottomBar in site/src/layouts/BaseLayout.astro
- [x] T024 [P] Create Header component with logo, sticky desktop navigation bar, click-to-call phone CTA, "Get Free Estimate" CTA button, and mobile hamburger trigger in site/src/components/layout/Header.astro
- [x] T025 [P] Create Footer component with NAP (matching GBP per FR-024), navigation columns from Navigation global, license/insurance info, social links in site/src/components/layout/Footer.astro
- [x] T026 [P] Create MobileBottomBar sticky CTA component with "Call Now" + "Free Estimate" buttons, 48px+ touch targets, 20px bottom edge buffer per FR-003 in site/src/components/layout/MobileBottomBar.astro

### Dev Seed Data

- [x] T027 Create seed script populating 3 services, 25 service areas (FR-022 cities), SiteSettings global, Navigation global, sample FAQs (1 per FR-035 category), sample reviews (3 featured), and 1 sample project in cms/src/seed.ts

**Checkpoint**: Foundation ready — all shared infrastructure, CMS collections, design system, and layouts in place. User story implementation can now begin.

---

## Phase 3: User Story 1 — Homepage Trust and Authority Establishment (Priority: P1) 🎯 MVP

**Goal**: First-time visitors immediately understand BaseScape's specialization, geographic focus, and available next actions. Trust signals (licensing, reviews, risk reversals) and dual CTAs visible above the fold.

**Independent Test**: Load homepage on mobile — verify hero communicates walkout basements / egress windows specialization + Utah focus, dual CTAs (Call Now + Get Free Estimate) visible above fold, trust badges and reviews present below fold.

### Tests (Red Phase)

- [x] T096 [P] [US1] Write visual regression test for homepage: mobile (375px) hero above-fold content, dual CTAs visible, trust badges; desktop (1440px) full layout in site/tests/visual/homepage.spec.ts
- [x] T097 [P] [US1] Write a11y test for homepage (axe-core scan, keyboard navigation to both CTAs, color contrast on hero, heading hierarchy) in site/tests/a11y/homepage.spec.ts

### Implementation

- [x] T028 [P] [US1] Create TrustBadges component displaying licensing, insurance, bonding badges with license numbers, and risk-reversal statements from SiteSettings in site/src/components/trust/TrustBadges.astro
- [x] T029 [P] [US1] Create ReviewCard component (star rating display, reviewer name, review text, source attribution, city) in site/src/components/trust/ReviewCard.astro
- [x] T030 [P] [US1] Create LicenseBadge component (license number, insurance status, visual badge styling) in site/src/components/trust/LicenseBadge.astro
- [x] T031 [P] [US1] Create CTABlock component with dual conversion paths (primary "Call Now" tel: link + secondary "Get Free Estimate" button) per FR-004 in site/src/components/content/CTABlock.astro
- [x] T032 [P] [US1] Create ServiceCard component (service title, tagline, hero thumbnail, value pillar tag, link to service page) for homepage overview section in site/src/components/content/ServiceCard.astro
- [x] T033 [US1] Build homepage fetching Services, Reviews, SiteSettings from Payload CMS with hero section (benefit-driven headline, specialization + Utah focus, dual CTAs), services overview, trust stack (badges + risk reversals above fold per FR-028), featured reviews section, and final CTA block in site/src/pages/index.astro
- [x] T034 [US1] Create JsonLd component (accepts schema type + data props, renders <script type="application/ld+json">) and add Organization + LocalBusiness (with aggregateRating) JSON-LD structured data to homepage (business name, address, phone, geo coordinates, operating hours, services offered) in site/src/components/seo/JsonLd.astro

**Checkpoint**: Homepage fully functional — visitors can identify specialization, see trust signals, and access both CTAs. Test independently on mobile.

---

## Phase 4: User Story 2 — Service Page Education and Objection Neutralization (Priority: P1)

**Goal**: Three dedicated service pages (Walkout Basements, Egress Windows, Window Well Upgrades) each containing benefit-driven content, anxiety stack objection handling, process steps, gallery proof, FAQs, and service-specific CTA.

**Independent Test**: Navigate to each service page — verify benefit content, code compliance info, before-and-after imagery, FAQ section, and service-specific CTA are all present and fetched from CMS.

### Tests (Red Phase)

- [x] T098 [P] [US2] Write visual regression tests for ServiceLayout template: mobile + desktop, anxiety stack sections, FAQ accordion expanded/collapsed states in site/tests/visual/service-page.spec.ts
- [x] T099 [P] [US2] Write a11y test for service pages (FAQ accordion keyboard navigation, heading hierarchy, image alt text, anxiety stack section landmarks) in site/tests/a11y/service-page.spec.ts

### Implementation

- [x] T035 [P] [US2] Create ServiceLayout.astro template with sections: hero + tagline, overview, process steps, anxiety stack (7 objection blocks per FR-008), gallery proof (BeforeAfter + ProjectCard), FAQ accordion, and CTA block in site/src/layouts/ServiceLayout.astro
- [x] T036 [P] [US2] Create FAQ accordion component (expandable Q&A items, supports FAQPage schema output, reusable across templates) in site/src/components/content/FAQ.astro
- [x] T037 [P] [US2] Create BeforeAfter image comparison component (paired images, captions, consistent vantage point per FR-031) in site/src/components/gallery/BeforeAfter.astro
- [x] T038 [P] [US2] Create ProjectCard component (project type, city, thumbnail from afterImages[0], challenge excerpt, link to gallery) in site/src/components/gallery/ProjectCard.astro
- [x] T039 [US2] Build Walkout Basements service page using ServiceLayout, fetching service data + related FAQs/projects/reviews from Payload CMS, with "Surgical Extraction Protocol" differentiator content in site/src/pages/services/walkout-basements.astro
- [x] T040 [P] [US2] Build Egress Windows service page with IRC code requirements (5.7 sq ft opening, 44-inch sill height, 24x20 minimum), window style options, safety imperative framing in site/src/pages/services/egress-windows.astro
- [x] T041 [P] [US2] Build Window Well Upgrades service page with materials, landscaping integration, and aesthetic transformation content in site/src/pages/services/window-well-upgrades.astro
- [x] T042 [US2] Add Service + FAQPage JSON-LD structured data to all service pages using JsonLd component (T034) with generateServiceSchema and generateFAQPageSchema helpers
- [x] T100 [US2] Create "Stove Rule" and ADU compliance content explaining Utah-specific legislation (HB 398, SB 174) and Apartment Code reclassification trigger in plain language per FR-048, embedded on walkout basements service page and referenceable from blog/financing pages

**Checkpoint**: All three service pages fully functional with CMS content, objection handling, gallery proof, and FAQs. Each page independently navigable and testable.

---

## Phase 5: User Story 3 — Multi-Step Lead Capture (Priority: P1)

**Goal**: Working lead capture pipeline — multi-step form (3 steps with per-step background capture), quick callback form, server-side validation via Astro Actions + Zod, Payload CMS lead storage, and email notifications (homeowner confirmation + team notification) via Resend.

**Independent Test**: Complete multi-step form end-to-end → verify lead appears in Payload CMS with all fields, homeowner receives confirmation email, team receives notification email. Test quick callback form separately.

### Tests (Red Phase)

- [x] T101 [P] [US3] Write contract tests for Leads collection API (POST /api/leads creates partial lead, PATCH /api/leads/:id updates by sessionId, status transitions partial→complete, honeypot rejection returns fake 200) in site/tests/contract/leads-api.spec.ts
- [x] T102 [P] [US3] Write integration test for lead pipeline end-to-end (multi-step form submit → Astro Action validation → Payload CMS storage → confirmation email sent + team notification sent) in site/tests/integration/lead-pipeline.spec.ts

### CMS Lead Infrastructure

- [x] T043 [P] [US3] Create Leads collection (sessionId UUID, status state machine [partial/complete/abandoned/contacted/qualified], currentStep 0-3, serviceType/zipCode/projectPurpose/timeline/name/phone/email/address fields, source group with UTM fields, isOutOfServiceArea flag, formType enum, confirmationSentAt/teamNotifiedAt timestamps) in cms/src/collections/Leads.ts
- [x] T044 [P] [US3] Create validateLead hook (beforeValidate: check zipCode against SiteSettings.serviceAreaZipCodes, set isOutOfServiceArea flag; accept lead regardless per edge case spec) in cms/src/hooks/validateLead.ts
- [x] T045 [P] [US3] Create homeowner confirmation email template (greeting with name, request confirmation, next steps, BaseScape phone, trust signal, no-reply footer) in cms/src/email/lead-confirmation.ts
- [x] T046 [P] [US3] Create team notification email template (lead type/priority, full contact info, project details, attribution data, admin panel deep link, out-of-area flag) in cms/src/email/team-notification.ts
- [x] T047 [US3] Create afterLeadCreate hook (afterChange on Leads: when status changes to "complete", send confirmation email to homeowner + notification email to team via Resend adapter, update confirmationSentAt/teamNotifiedAt timestamps) in cms/src/hooks/afterLeadCreate.ts

### Astro Actions (Server-Side Form Handling)

- [x] T048 [US3] Define Astro Actions entry point registering saveFormStep, submitQuickCallback, and submitLeadMagnet actions with Zod input schemas in site/src/actions/index.ts
- [x] T049 [US3] Implement saveFormStep action: honeypot check (silent fake 200 if filled), rate limiting via CF Workers binding (15 req/60s per IP), Step 1 → POST /api/leads (create partial), Steps 2-3 → PATCH /api/leads/:id (update by sessionId lookup), Step 3 sets status "complete" in site/src/actions/lead-submit.ts
- [x] T050 [P] [US3] Implement submitQuickCallback action: honeypot + rate limit (5 req/60s), POST /api/leads with formType "quick-callback" and status "complete" in site/src/actions/callback-request.ts

### Form UI Components (Islands)

- [x] T051 [US3] Build MultiStepForm Island (client:load): UUID session generation on mount, 3-step wizard (Step 1: service type + zip, Step 2: project purpose + timeline, Step 3: name + phone + email + address autocomplete), visual progress indicator, per-step background POST via saveFormStep action, inline validation errors, honeypot hidden field in site/src/components/forms/MultiStepForm.tsx
- [x] T052 [P] [US3] Build QuickCallback form Island (client:load): name + phone + optional notes fields, submit via submitQuickCallback action, honeypot field in site/src/components/forms/QuickCallback.tsx
- [x] T053 [US3] Create FormSuccess confirmation component (on-screen message: "what happens next", BaseScape phone number, expected follow-up timeline) in site/src/components/forms/FormSuccess.astro

**Checkpoint**: Full lead capture pipeline operational — multi-step form saves partial data per step, final submission triggers CMS storage + email notifications. Quick callback form works independently. Test by submitting forms and verifying CMS records + email delivery.

---

## Phase 6: User Story 4 — Service Area Pages for Local Search Authority (Priority: P2)

**Goal**: 25 unique city pages with genuine localized content, local proof elements, structured data with geographic coordinates, and NAP consistency matching Google Business Profile.

**Independent Test**: Navigate to a city's service area page (e.g., /areas/draper-ut) — verify unique localized content, local project/review references, geographic structured data, and NAP matching GBP.

### Tests (Red Phase)

- [x] T103 [P] [US4] Write visual regression test for LocationLayout template: localized content, local projects gallery (with fallback for empty), NAP display, dual CTAs in site/tests/visual/location-page.spec.ts
- [x] T104 [P] [US4] Write unit test for LocalBusiness + GeoCoordinates JSON-LD output including aggregateRating, service radius, and operating hours in site/tests/unit/location-schema.test.ts

### Implementation

- [x] T054 [P] [US4] Create ServiceAreas collection (cityName, stateAbbrev, slug, county enum, coordinates group with lat/lng, serviceRadius, localContent richText, localReferences textarea, localProjects/localReviews/localFAQs relationships, heroImage, SEO group, status) in cms/src/collections/ServiceAreas.ts
- [x] T055 [US4] Create LocationLayout.astro template with hero (city-specific or fallback), localized content section, local projects gallery (or site-wide fallback if none per edge case spec), local reviews, local FAQs, dual CTA block, NAP from SiteSettings in site/src/layouts/LocationLayout.astro
- [x] T056 [US4] Build dynamic service area pages using getStaticPaths() fetching all published ServiceAreas, rendering with LocationLayout, passing local relationships as props in site/src/pages/areas/[...slug].astro
- [x] T057 [US4] Add LocalBusiness + GeoCoordinates + Service JSON-LD structured data (coordinates, service radius, operating hours, aggregateRating per FR-023 and Art. IX §3) to service area pages using JsonLd component (T034)
- [x] T058 [US4] Verify NAP consistency: phone and address on every location page fetched from SiteSettings global, matching GBP character-for-character per FR-024

**Checkpoint**: All 25 city pages rendering with unique localized content, geographic structured data, and consistent NAP. Each page independently navigable.

---

## Phase 7: User Story 5 — Financial Enablement and Affordability Content (Priority: P2)

**Goal**: Financing page presenting rental income projections, rebates/tax credits, construction financing options, and property value appreciation — all framed as estimates with disclaimers per FR-033.

**Independent Test**: Navigate to /financing — verify rental income projections (by strategy), rebate/credit details, financing options, and disclaimer language present.

### Tests (Red Phase)

- [x] T105 [US5] Write a11y test for financing page (disclaimer text contrast, financial data table accessibility, heading hierarchy) in site/tests/a11y/financing-page.spec.ts

### Implementation

- [x] T059 [US5] Build financing and affordability page with sections: rental income projections (Long-Term $1,200-$1,800/mo, Short-Term Airbnb $3,100-$8,400/mo, Mid-Term Corporate $2,000-$3,000/mo with 2-5 year break-even), utility rebates/federal tax credits/local grants, construction financing features (interest-only during construction, draw schedules), property value ranges ($40K-$70K+), all with FR-033 disclaimer language in site/src/pages/financing.astro
- [x] T060 [US5] Add FinancialProduct or WebPage JSON-LD structured data to financing page

**Checkpoint**: Financing page live with compliant financial projections and disclaimers.

---

## Phase 8: User Story 6 — About Page and Brand Humanization (Priority: P2)

**Goal**: About page with authentic team photography, origin story, credentialing information, and BaseScape's differentiating philosophy (structural engineering, not general carpentry).

**Independent Test**: Navigate to /about — verify team photos (no stock imagery), origin story, background check/licensing/insurance language, and differentiating statement present.

### Implementation

- [x] T061 [US6] Build About page with sections: team portraits placeholder (authentic photography required for launch), origin story, "why specialization" philosophy ("cutting into foundational load-bearing walls is structural engineering, not general carpentry"), background check/licensing/insurance/training credentials in site/src/pages/about.astro
- [x] T062 [US6] Add Organization + Person JSON-LD structured data to About page

**Checkpoint**: About page live with brand humanization content. Team photography TBD for launch.

---

## Phase 9: User Story 7 — Gallery and Project Showcase (Priority: P2)

**Goal**: Gallery page showing real completed projects with before-and-after imagery, filterable by service type. Gallery content reusable on service and location pages.

**Independent Test**: Navigate to /gallery — verify project entries with before-and-after images, project details, and service type filtering. Verify gallery entries also appear inline on corresponding service and location pages.

### Tests (Red Phase)

- [x] T106 [US7] Write visual regression test for gallery page: ProjectCard grid, BeforeAfter paired image display, service type filter interaction in site/tests/visual/gallery.spec.ts

### Implementation

- [x] T063 [US7] Build main gallery page listing all published Projects (fetched from Payload CMS), filterable by service type, using ProjectCard + BeforeAfter components, sorted by featured then date in site/src/pages/gallery.astro
- [x] T064 [US7] Wire gallery content reuse: verify ServiceLayout (Phase 4) and LocationLayout (Phase 6) correctly display related Projects inline from their relationship fields per FR-030

**Checkpoint**: Gallery page functional with project entries. Before-and-after components reusable across service and location pages.

---

## Phase 10: User Story 8 — Paid Advertising Landing Pages (Priority: P3)

**Goal**: Campaign-specific landing pages with suppressed navigation, focused offer + trust badges, embedded lead capture form, deployable via CMS without engineering intervention per FR-042.

**Independent Test**: Navigate to a campaign landing page (e.g., /lp/walkout-spring-2026) — verify standard nav is suppressed, offer content is focused, trust badges display, and form is present.

### Tests (Red Phase)

- [x] T107 [US8] Write visual regression test for LandingLayout: suppressed navigation, focused offer content, embedded form, trust badges, phone CTA in site/tests/visual/landing-page.spec.ts

### Implementation

- [x] T065 [P] [US8] Create Offers collection (headline, description richText, terms, startDate, endDate nullable, applicableServices relationship, applicablePages multi-select, status enum [draft/active/expired]) in cms/src/collections/Offers.ts
- [x] T066 [P] [US8] Create PaidLandingPages collection (campaignSlug, headline, subheadline, heroImage, bodyContent richText, trustBadges multi-select enum, formType select [multi-step/quick-callback], offer relationship, targetService relationship, suppressNavigation checkbox default true, utmCampaign, SEO group with noindex default true, status) in cms/src/collections/PaidLandingPages.ts
- [x] T067 [US8] Create LandingLayout.astro template (conditionally suppress Header/Footer based on suppressNavigation flag, focused offer content area, embedded form component based on formType, trust badges, phone CTA) in site/src/layouts/LandingLayout.astro
- [x] T068 [US8] Build dynamic paid landing pages using getStaticPaths() fetching all published PaidLandingPages, rendering with LandingLayout, pre-selecting targetService on embedded form in site/src/pages/lp/[...slug].astro

**Checkpoint**: Paid landing pages deployable via CMS. Test by creating a landing page in Payload admin and verifying it renders with suppressed nav and focused conversion layout.

---

## Phase 11: User Story 9 — Lead Magnet for Early-Stage Capture (Priority: P3)

**Goal**: Gated educational resources (e.g., "Utah ADU Compliance Checklist") with minimal-friction capture form, lead storage with source attribution, and resource delivery via email.

**Independent Test**: Submit lead magnet form — verify resource download delivered, lead record created in CMS with formType "lead-magnet" and source attribution.

### Tests (Red Phase)

- [x] T108 [US9] Write integration test for lead magnet pipeline (form submit → CMS lead creation with formType "lead-magnet" → download URL delivery → lead magnet delivery email) in site/tests/integration/lead-magnet-pipeline.spec.ts

### Implementation

- [x] T069 [P] [US9] Create LeadMagnets collection (title, slug, description, file upload to R2, thumbnailImage, ctaText, requiredFields multi-select [name/email/phone], status) in cms/src/collections/LeadMagnets.ts
- [x] T070 [US9] Create lead magnet delivery email template (thank you, download link to R2 file URL, resource description, CTA to schedule estimate, BaseScape phone) in cms/src/email/lead-magnet-delivery.ts
- [x] T071 [US9] Implement submitLeadMagnet Astro Action: honeypot + rate limit (5 req/60s), POST /api/leads with formType "lead-magnet" and status "complete", fetch lead magnet file URL from Payload, return downloadUrl in response in site/src/actions/index.ts (add to existing actions)
- [x] T072 [P] [US9] Create LeadMagnetCTA component (inline embeddable block: thumbnail, title, description, CTA button triggering capture form) for use on pages and blog posts in site/src/components/content/LeadMagnetCTA.astro
- [x] T073 [US9] Build LeadMagnetForm Island (client:load): dynamic required fields based on leadMagnet config, submit via submitLeadMagnet action, display download link on success, honeypot field in site/src/components/forms/LeadMagnetForm.tsx

**Checkpoint**: Lead magnet pipeline operational — form captures lead with attribution, resource delivered via response + email.

---

## Phase 12: User Story 10 — Blog / Resource Hub for Organic SEO (Priority: P3)

**Goal**: Blog section targeting long-tail keywords with articles that include internal links to service pages and embedded lead magnet CTAs, authorable via CMS.

**Independent Test**: Navigate to /blog — verify article listing with categories. Open an article — verify internal links to service pages, embedded lead magnet CTA, and Article structured data.

### Tests (Red Phase)

- [x] T109 [US10] Write unit test for Article JSON-LD structured data output (headline, author, publishDate, image, description) in site/tests/unit/article-schema.test.ts

### Implementation

- [x] T074 [P] [US10] Create BlogPosts collection (title, slug, excerpt, heroImage, content richText with embedded CTAs, category enum [walkout-basements/egress-windows/window-wells/adu-compliance/financing/local-guides/safety], relatedServices relationship, leadMagnetCTA relationship, author, publishDate, SEO group, status) in cms/src/collections/BlogPosts.ts
- [x] T075 [US10] Build blog index page listing published posts with category filtering, excerpt cards, and pagination in site/src/pages/blog/index.astro
- [x] T076 [US10] Build dynamic blog post pages using getStaticPaths() fetching all published BlogPosts, rendering content with internal links to service pages and inline LeadMagnetCTA component per FR-040 in site/src/pages/blog/[...slug].astro
- [x] T077 [US10] Add Article JSON-LD structured data (headline, author, publishDate, image, description) to blog post pages

**Checkpoint**: Blog section functional with CMS-authored articles, internal linking, lead magnet CTAs, and structured data.

---

## Phase 13: Polish & Cross-Cutting Concerns

**Purpose**: Required pages without dedicated user stories, analytics integration, SEO infrastructure, performance/accessibility validation, and progressive enhancement

### Required Pages (FR-035, FR-050, FR-049)

- [x] T078 [P] Build dedicated FAQ page aggregating all published FAQs by category with FAQ accordion component and FAQPage structured data in site/src/pages/faq.astro
- [x] T079 [P] Build How It Works page explaining BaseScape's step-by-step process from consultation through completion per FR-050 in site/src/pages/how-it-works.astro
- [x] T080 [P] Build Privacy Policy page with privacy policy content, consent language per FR-049 in site/src/pages/privacy.astro

### Analytics & SEO

- [x] T081 Configure Plausible Analytics with custom events (Form Step 1/2/3, Call Click via CSS class, Lead Magnet Download) and optional GA4 hedge script in site/src/layouts/BaseLayout.astro
- [x] T082 [P] Configure @astrojs/sitemap integration and create robots.txt with sitemap reference in site/
- [x] T083 [P] Ensure all page templates declare a primary conversion event per FR-045 (homepage: form_start, service: form_start, location: form_start, blog: lead_magnet_click, landing: form_start)

### Progressive Enhancement & Edge Cases

- [x] T084 Implement JS-disabled fallback: single-page HTML form or phone CTA direction for visitors without JavaScript per edge case spec
- [x] T085 Implement CMS failure retry logic in Astro Actions (retry lead creation once on 500 response, log error for investigation per edge case spec)

### Validation

- [x] T086 Run Lighthouse CI performance audit against all page templates targeting LCP ≤ 1.5s, FID ≤ 50ms, CLS ≤ 0.05, TTFB ≤ 200ms, page weight ≤ 250KB compressed per QR-001
- [x] T087 Run axe-core accessibility audit across all page templates ensuring WCAG 2.2 AA compliance: alt text, form labels, keyboard navigation, color contrast per QR-002
- [x] T088 Validate mobile ergonomics: all interactive elements 48px+ touch targets, tel: links with large high-contrast buttons, MobileBottomBar 20px buffer per QR-003
- [x] T089 Validate quickstart.md instructions against actual project setup (install, dev server start, seed data, test commands)
- [x] T110 Run cross-browser smoke tests via Playwright (Chrome, Safari, Firefox, Edge on desktop + mobile viewports) per QR-009
- [x] T111 Verify editorial workflows end-to-end: non-technical user can create and publish a blog post, update a service page, and deploy a paid landing page via Payload admin per FR-043
- [x] T112 Validate page scannability across all page templates: heading hierarchy, section lengths, CTA transition clarity per QR-004

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **US1-US3 (Phases 3-5, P1)**: All depend on Foundational. Can proceed in priority order or in parallel:
  - US1 (Homepage) and US2 (Service Pages) share no file conflicts — parallelizable
  - US3 (Lead Capture) CMS + action development is independent of US1/US2, but form Island integration testing requires US1/US2 pages to exist as hosts
- **US4-US7 (Phases 6-9, P2)**: Depend on Foundational. Can proceed after P1 stories or in parallel:
  - US4 (Service Areas) needs ServiceAreas collection only — no P1 dependency
  - US5 (Financing), US6 (About) are standalone static pages — no story dependencies
  - US7 (Gallery) reuses components from US2 (BeforeAfter, ProjectCard) — run after US2
- **US8-US10 (Phases 10-12, P3)**: Depend on Foundational. Can proceed after P2 or in parallel:
  - US8 (Landing Pages) needs Offers + PaidLandingPages collections — independent
  - US9 (Lead Magnet) needs LeadMagnets collection + submitLeadMagnet action — extends US3 action file
  - US10 (Blog) needs BlogPosts collection + LeadMagnetCTA from US9
- **Polish (Phase 13)**: Depends on all desired user stories being complete

### User Story Dependencies

| Story | Depends On | Can Parallelize With |
|-------|-----------|---------------------|
| US1 (Homepage) | Foundational only | US2, US3 |
| US2 (Service Pages) | Foundational only | US1, US3 |
| US3 (Lead Capture) | Foundational only | US1, US2 |
| US4 (Service Areas) | Foundational only | US5, US6, US7 |
| US5 (Financing) | Foundational only | US4, US6, US7 |
| US6 (About) | Foundational only | US4, US5, US7 |
| US7 (Gallery) | US2 (reuses components) | US4, US5, US6 |
| US8 (Landing Pages) | Foundational only | US9 |
| US9 (Lead Magnet) | US3 (extends actions) | US8, US10 |
| US10 (Blog) | US9 (uses LeadMagnetCTA) | US8 |

### Within Each User Story

0. **Tests first** (Red phase per Art. XV TDD) — write failing tests before implementation code
1. CMS collections/hooks before Astro pages (data must exist before templates fetch it)
2. Layout templates before page files (pages use layouts)
3. Components before pages that use them
4. Utility code before components that depend on it

### Parallel Opportunities

**Phase 1** (after T001): T002-T006 (scaffolding + tooling), T090-T092 (test infrastructure)

**Phase 2** (after T007): T008-T011 (all style files), T014-T019 (all CMS collections), T021-T022 (lib utilities), T024-T026 (layout components), T093-T095 (foundational tests)

**Phase 3** (US1): T028-T032 (all component files) can run in parallel, then T033 (homepage page file depends on all components)

**Phase 5** (US3): T043-T046 (CMS collections/hooks/templates) in parallel, then T047 (afterLeadCreate depends on templates), T048-T050 (actions) after collections, T051-T052 (form Islands) after actions

---

## Parallel Example: User Story 1

```bash
# Launch all US1 components in parallel (different files, no deps):
Task: "Create TrustBadges component in site/src/components/trust/TrustBadges.astro"
Task: "Create ReviewCard component in site/src/components/trust/ReviewCard.astro"
Task: "Create LicenseBadge component in site/src/components/trust/LicenseBadge.astro"
Task: "Create CTABlock component in site/src/components/content/CTABlock.astro"
Task: "Create ServiceCard component in site/src/components/content/ServiceCard.astro"

# Then build the homepage (depends on all components above):
Task: "Build homepage in site/src/pages/index.astro"
```

## Parallel Example: User Story 3

```bash
# Launch CMS infrastructure in parallel:
Task: "Create Leads collection in cms/src/collections/Leads.ts"
Task: "Create validateLead hook in cms/src/hooks/validateLead.ts"
Task: "Create confirmation email template in cms/src/email/lead-confirmation.ts"
Task: "Create team notification email template in cms/src/email/team-notification.ts"

# Then wire the afterChange hook (depends on email templates):
Task: "Create afterLeadCreate hook in cms/src/hooks/afterLeadCreate.ts"

# Then Astro Actions (depends on Leads collection being defined):
Task: "Define actions entry in site/src/actions/index.ts"
Task: "Implement saveFormStep in site/src/actions/lead-submit.ts"
Task: "Implement submitQuickCallback in site/src/actions/callback-request.ts"  # [P] with above

# Then form Islands (depends on actions):
Task: "Build MultiStepForm Island in site/src/components/forms/MultiStepForm.tsx"
Task: "Build QuickCallback Island in site/src/components/forms/QuickCallback.tsx"  # [P] with above
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: US1 — Homepage
4. Complete Phase 4: US2 — Service Pages
5. Complete Phase 5: US3 — Lead Capture
6. **STOP and VALIDATE**: Test all P1 stories independently. Site has homepage + 3 service pages + working lead capture pipeline. This is a deployable MVP.

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. US1 (Homepage) → Deployable landing page with trust and CTAs
3. US2 (Service Pages) → Organic search landing pages ready
4. US3 (Lead Capture) → Revenue pipeline operational — **MVP Complete**
5. US4 (Service Areas) → 25 city pages for local SEO
6. US5-US7 (Financing, About, Gallery) → Supporting content and trust
7. US8-US10 (Landing Pages, Lead Magnets, Blog) → Paid channels + nurture + content SEO
8. Polish → Performance, accessibility, analytics validation

### Key Risk: Two-Service Architecture

The site has two co-located but separate services: Astro (site/) and Payload CMS (cms/). During development, both must be running. The seed script (T027) is critical for unblocking frontend work — run it immediately after CMS setup.

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps each task to its user story for traceability
- FSM webhook integration is DEFERRED (see contracts/webhooks.md) — V1 uses email notifications
- Google Places API for address autocomplete in MultiStepForm (T051) uses the free tier (10K req/month)
- All financial claims MUST include disclaimer language per FR-033 and Constitution Article VIII
- No stock photography — authentic project photography is a launch dependency (Assumption 6)
- Commit after each task or logical group
- Stop at any checkpoint to validate the story independently
