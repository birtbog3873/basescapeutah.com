# Tasks: Site Fixes & Content Updates

**Input**: Design documents from `/specs/003-site-fixes-content/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Included per project constitution Art. XV (TDD: Red → Green → Refactor). Unit tests via Vitest, E2E via Playwright.

**Organization**: Tasks grouped by user story (8 stories, P1–P6). Each story independently testable.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1–US8)
- Paths relative to repo root (`site/`, `cms/`)

---

## Phase 1: Setup

**Purpose**: Verify development environment and branch readiness

- [x] T001 Verify dev environment: `pnpm install`, start CMS (`cd cms && pnpm dev`), start site (`cd site && pnpm dev`) per specs/003-site-fixes-content/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: CMS schema changes and utilities that block multiple user stories

**⚠️ CRITICAL**: US2, US4, US5, US7 cannot begin until this phase is complete

- [x] T002 Add `showReviews` (boolean, default: false) and `showGallery` (boolean, default: false) fields to SiteSettings global under a "Visibility Controls" admin group in cms/src/globals/SiteSettings.ts — see data-model.md §1
- [x] T003 Write failing unit tests for Lexical JSON → HTML serializer covering paragraph, heading (h1-h6), list (bullet/number), listitem, text formatting (bold/italic/underline/strikethrough/code), link, and linebreak nodes in site/tests/unit/serialize-lexical.test.ts — see research.md §R-005
- [x] T004 Create Lexical serializer utility in site/src/lib/serialize-lexical.ts — recursive serializer supporting all node types from T003. Make T003 tests pass.

**Checkpoint**: SiteSettings has visibility toggles, Lexical serializer works. User story implementation can begin.

---

## Phase 3: User Story 1 — Fix "Get Free Estimate" CTA Button (Priority: P1) 🎯 MVP

**Goal**: All CTA buttons smooth-scroll to the in-page multi-step lead capture form on every page

**Independent Test**: Click every "Get Free Estimate" button across homepage, service pages, and about page — each one smooth-scrolls to the form section

**Root Cause**: `MultiStepForm` only rendered in `LandingLayout.astro`, not `BaseLayout.astro` (research.md §R-001)

### Implementation

- [x] T005 [US1] Write failing E2E test: CTA buttons on homepage, service pages, and about page smooth-scroll to `#estimate-form` section on both desktop and mobile viewports in site/tests/e2e/cta-navigation.spec.ts
- [x] T006 [US1] Add `<MultiStepForm client:load />` inside a form section wrapper with `id="estimate-form"` to site/src/layouts/BaseLayout.astro — matching the pattern in LandingLayout.astro (line 144-153). Verify T005 passes.

**Checkpoint**: CTA button works on all pages. This is the MVP — the primary conversion pipeline is restored.

---

## Phase 4: User Story 2 — Restore FAQ Answers on Service Pages (Priority: P2)

**Goal**: FAQ "Your Questions, Answered" sections display expandable answer content (not just headings) on all three existing service pages

**Independent Test**: Visit Walkout Basements, Egress Windows, Window Well Upgrades pages — expand each FAQ category and verify answer text appears

**Root Cause**: Lexical richText JSON not serialized to HTML — `typeof content === 'string' ? content : ''` drops objects (research.md §R-002)

**Depends on**: Phase 2 (serialize-lexical.ts)

### Implementation

- [x] T007 [US2] Write failing E2E test: FAQ answers visible when expanded on all three service pages (walkout-basements, egress-windows, window-well-upgrades) in site/tests/e2e/faq-answers.spec.ts
- [x] T008 [US2] Update site/src/layouts/ServiceLayout.astro to import and use `serializeLexical()` for all richText fields: `service.overview` (line 96), `step.stepDescription` (line 112-113), anxiety stack fields (line 129-134), and `service.differentiator` (line 149-150). Replace `typeof content === 'string' ? content : ''` pattern with `typeof content === 'string' ? content : serializeLexical(content)`. Verify T007 passes.

**Checkpoint**: All three service pages display full FAQ answers. SEO content restored.

---

## Phase 5: User Story 3 — Update Business Information (Priority: P3)

**Goal**: License number, insurance text, and phone number display correct values site-wide

**Independent Test**: Search all rendered pages for the old placeholder values — zero matches. Verify new values appear in footer, header phone link, service page CTAs, and JSON-LD.

### Implementation

- [x] T009 [US3] Write failing E2E test: correct business info displays on all pages — license "14082066-5501 B100", insurance "General Liability" (no dollar amount), phone "(888) 414-0007" as clickable tel:+18884140007 link in site/tests/e2e/business-info.spec.ts
- [x] T010 [P] [US3] Update seed data in cms/src/seed.ts: set `phone` to `(888) 414-0007`, `licenseNumber` to `14082066-5501 B100`, `insuranceInfo` to `Fully Insured & Bonded — General Liability`
- [x] T011 [P] [US3] Update fallback business info defaults in site/src/components/layout/Footer.astro — phone, license number, insurance text to match canonical values
- [x] T012 [P] [US3] Update fallback phone number in site/src/components/layout/MobileBottomBar.astro to `(888) 414-0007` / `tel:+18884140007`
- [x] T013 [P] [US3] Update fallback phone number in site/src/pages/services/walkout-basements.astro, site/src/pages/services/egress-windows.astro, and site/src/pages/services/window-well-upgrades.astro

Verify T009 passes after all updates.

**Checkpoint**: All business information is accurate site-wide. Legal/compliance risk resolved.

---

## Phase 6: User Story 4 — Hide Reviews Section (Priority: P3)

**Goal**: "What Homeowners Say" testimonials section is conditionally rendered (not in DOM) when `showReviews` is false

**Independent Test**: Visit homepage and all service pages — no review/testimonial content visible or in page source

**Depends on**: Phase 2 (SiteSettings showReviews field)

### Implementation

- [x] T014 [US4] Write failing E2E test: reviews section not visible on homepage and service pages when showReviews is false, visible when true in site/tests/e2e/reviews-hidden.spec.ts
- [x] T015 [P] [US4] Wrap reviews/testimonials section in site/src/pages/index.astro with conditional render: only render when `settings.showReviews` is true
- [x] T016 [P] [US4] Wrap reviews section in site/src/layouts/ServiceLayout.astro with conditional render: only render when `settings.showReviews` is true
- [x] T017 [US4] Update seed data in cms/src/seed.ts to set `showReviews: false` in SiteSettings defaults

Verify T014 passes.

**Checkpoint**: No fabricated reviews visible. Compliance risk resolved. Re-enable via CMS toggle when real reviews exist.

---

## Phase 7: User Story 5 — Hide Gallery Page (Priority: P4)

**Goal**: Gallery page removed from navigation, returns 404 on direct access, excluded from sitemap — all controlled by `showGallery` CMS toggle

**Independent Test**: No "Gallery" link in header/footer/mobile nav. Direct URL `/gallery` returns 404. Sitemap does not contain `/gallery`.

**Depends on**: Phase 2 (SiteSettings showGallery field)

### Implementation

- [x] T018 [US5] Write failing E2E test: Gallery link absent from all nav menus, direct /gallery URL returns 404, Gallery not in sitemap when showGallery is false in site/tests/e2e/gallery-hidden.spec.ts
- [x] T019 [P] [US5] Filter Gallery link from navigation in site/src/components/layout/Header.astro when `settings.showGallery` is false — apply to both CMS nav data and fallback hardcoded nav
- [x] T020 [P] [US5] Filter Gallery link from navigation in site/src/components/layout/Footer.astro when `settings.showGallery` is false — apply to both CMS nav data and fallback hardcoded nav
- [x] T021 [US5] Update site/src/pages/gallery.astro to return 404 response when `showGallery` is false — read SiteSettings at build time, render 404 component if hidden
- [x] T022 [US5] Add sitemap filter in site/astro.config.ts to exclude `/gallery` when `showGallery` is false (FR-006a)
- [x] T023 [US5] Update seed data in cms/src/seed.ts to set `showGallery: false` in SiteSettings defaults

Verify T018 passes.

**Checkpoint**: Gallery fully hidden. Re-enable via CMS toggle when real project photos exist.

---

## Phase 8: User Story 6 — Multi-Column Footer Layout (Priority: P5)

**Goal**: Footer displays 4 columns on desktop (1024px+), 2 columns on tablet (768–1024px), 1 column on mobile (<768px)

**Independent Test**: View footer at 1280px (4 columns side-by-side), 900px (2 columns), and 375px (stacked)

### Implementation

- [x] T024 [US6] Write failing E2E test: footer column count at desktop (1024px+), tablet (768–1024px), and mobile (<768px) breakpoints in site/tests/e2e/footer-layout.spec.ts
- [x] T025 [US6] Update Footer.astro CSS in site/src/components/layout/Footer.astro: explicit 4-column grid at 1024px+ (brand column + 3 nav columns), 2-column grid at 768–1024px, single column below 768px. Replace current `auto-fit` approach with explicit column definitions per research.md §R-003.

Verify T024 passes.

**Checkpoint**: Footer layout is responsive across all viewports.

---

## Phase 9: User Story 7 — Add Pavers/Hardscapes and Artificial Turf Services (Priority: P5)

**Goal**: Two new service cards in Specialized Services section, each with a dedicated service page including description, FAQ, and CTA

**Independent Test**: Homepage shows 5 service cards (3 core + 2 specialized). Clicking each new card navigates to a full service page with FAQ section. JSON-LD generated automatically.

**Depends on**: Phase 2 (serialize-lexical.ts for new pages), Phase 4 completion (ServiceLayout fix)

### CMS Schema

- [x] T026 [US7] Update Services collection in cms/src/collections/Services.ts: add `serviceType` select field (`core` | `specialized`, default: `core`) and make all 7 anxietyStack sub-fields optional (remove `required: true`) per data-model.md §3-4

### Content Research

- [x] T027 [P] [US7] Research Pavers & Hardscapes content: Google "People Also Ask" for paver patio costs Utah, hardscape installation process, material options, maintenance. Write service overview, process steps, and 5-8 FAQ entries with answers.
- [x] T028 [P] [US7] Research Artificial Turf content: Google "People Also Ask" for artificial turf installation cost Utah, turf vs grass, pet-friendly turf, maintenance. Write service overview, process steps, and 5-8 FAQ entries with answers.

### CMS Data

- [x] T029 [US7] Add Pavers & Hardscapes and Artificial Turf seed data to cms/src/seed.ts: service entries (title, slug, tagline, serviceType: specialized, seo meta, overview, process steps) + FAQ entries per data-model.md §5-6. Set existing services to `serviceType: 'core'`.

### Pages & Navigation

- [x] T030 [US7] Write failing E2E test: both new service cards visible on homepage, clickable to dedicated pages with description and FAQ section in site/tests/e2e/new-services.spec.ts
- [x] T031 [P] [US7] Create site/src/pages/services/pavers-hardscapes.astro following the exact pattern of walkout-basements.astro — fetch from CMS, fallback to hardcoded data, render via ServiceLayout
- [x] T032 [P] [US7] Create site/src/pages/services/artificial-turf.astro following the exact pattern of walkout-basements.astro — fetch from CMS, fallback to hardcoded data, render via ServiceLayout
- [x] T033 [US7] Add new services to navigation: update nav seed data in cms/src/seed.ts and fallback hardcoded nav in site/src/components/layout/Header.astro and site/src/components/layout/Footer.astro

Verify T030 passes.

**Checkpoint**: Five services visible on homepage. Both new service pages fully functional with FAQ and CTA.

---

## Phase 10: User Story 8 — Expand FAQ with Google Research (Priority: P6)

**Goal**: Each of the 3 existing service pages has at least 3 additional FAQ questions sourced from Google PAA/Related Queries

**Independent Test**: Compare FAQ count before and after — each page has measurably more questions. Content is relevant to the service topic.

**Depends on**: Phase 4 (FAQ rendering fix must be in place)

### Content Research

- [x] T034 [P] [US8] Research additional FAQ questions for Walkout Basements via Google "People Also Ask" and Related Queries. Select 3+ relevant questions with answers.
- [x] T035 [P] [US8] Research additional FAQ questions for Egress Windows via Google "People Also Ask" and Related Queries. Select 3+ relevant questions with answers.
- [x] T036 [P] [US8] Research additional FAQ questions for Window Well Upgrades via Google "People Also Ask" and Related Queries. Select 3+ relevant questions with answers.

### CMS Data

- [x] T037 [US8] Add all researched FAQ entries to cms/src/seed.ts for Walkout Basements, Egress Windows, and Window Well Upgrades — associate via `applicableServices` field. Update fallback FAQ data in each service page .astro file.

**Checkpoint**: All 5 service pages have comprehensive FAQ sections. SEO footprint expanded.

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all stories

- [x] T038 Run full E2E test suite: `cd site && pnpm test:e2e` — all tests must pass
- [ ] T039 [P] Run Lighthouse CI: `cd site && pnpm test:lighthouse` — verify LCP ≤ 1.5s, CLS ≤ 0.05, page weight ≤ 250KB
- [ ] T040 [P] Run accessibility tests: `cd site && pnpm test:a11y` — WCAG 2.2 Level AA compliance
- [x] T041 Validate quickstart.md manual checklist (10 items) in specs/003-site-fixes-content/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — BLOCKS US2, US4, US5, US7
- **Phase 3 (US1 — CTA Fix)**: Depends on Phase 1 only — no foundational dependency, can start immediately after setup
- **Phase 4 (US2 — FAQ Fix)**: Depends on Phase 2 (serialize-lexical.ts)
- **Phase 5 (US3 — Business Info)**: Depends on Phase 1 only — independent of foundational
- **Phase 6 (US4 — Hide Reviews)**: Depends on Phase 2 (showReviews field)
- **Phase 7 (US5 — Hide Gallery)**: Depends on Phase 2 (showGallery field)
- **Phase 8 (US6 — Footer Layout)**: Depends on Phase 1 only — CSS-only change
- **Phase 9 (US7 — New Services)**: Depends on Phase 2 (serialize-lexical.ts) + Phase 4 (ServiceLayout fix)
- **Phase 10 (US8 — Expand FAQ)**: Depends on Phase 4 (FAQ rendering must work)
- **Phase 11 (Polish)**: Depends on all desired stories being complete

### User Story Independence

| Story | Can Start After | Touches seed.ts | Notes |
|-------|----------------|-----------------|-------|
| US1 | Phase 1 | No | Fully independent |
| US2 | Phase 2 | No | Needs serialize-lexical.ts |
| US3 | Phase 1 | Yes | Independent of foundational |
| US4 | Phase 2 | Yes | Needs showReviews field |
| US5 | Phase 2 | Yes | Needs showGallery field |
| US6 | Phase 1 | No | CSS-only, fully independent |
| US7 | Phase 4 | Yes | Needs ServiceLayout fix + serializer |
| US8 | Phase 4 | Yes | Needs FAQ rendering working |

**seed.ts conflict note**: US3, US4, US5, US7, and US8 all modify `cms/src/seed.ts`. If running stories in parallel, coordinate seed.ts changes to avoid merge conflicts.

### Parallel Opportunities

**Immediate parallels** (after Phase 1):
- US1 (CTA fix) + US3 (business info) + US6 (footer CSS) — all independent, different files

**After Phase 2**:
- US2 (FAQ fix) + US4 (hide reviews) + US5 (hide Gallery) — all independent, different primary files

**Within stories**:
- US3: T010, T011, T012, T013 all [P] — different files
- US5: T019, T020 [P] — different files
- US7: T027, T028 [P] research tasks; T031, T032 [P] page creation
- US8: T034, T035, T036 [P] research tasks

---

## Parallel Example: Fastest Path

```
Phase 1 (Setup)
    │
    ├── Phase 2 (Foundational: SiteSettings + serializer)
    │       │
    │       ├── US2 (FAQ fix) ──→ US7 (new services) ──→ US8 (expand FAQ)
    │       ├── US4 (hide reviews)
    │       └── US5 (hide Gallery)
    │
    ├── US1 (CTA fix) ← START HERE (P1, no foundational dependency)
    ├── US3 (business info)
    └── US6 (footer CSS)
```

**Single developer recommended order**:
1. T001 (setup)
2. US1 (T005-T006) — MVP, unblocks conversions
3. Phase 2 (T002-T004) — unblocks remaining stories
4. US2 (T007-T008) — second highest priority
5. US3 (T009-T013) + US4 (T014-T017) — same priority, both quick
6. US5 (T018-T023) — gallery hiding
7. US6 (T024-T025) — footer CSS
8. US7 (T026-T033) — largest story, new content
9. US8 (T034-T037) — content expansion
10. Phase 11 (T038-T041) — final validation

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 3: US1 — Fix CTA Button
3. **STOP and VALIDATE**: Click every CTA button across the site
4. The primary conversion pipeline is restored — deploy if urgent

### Incremental Delivery

1. US1 → CTA works (conversions unblocked)
2. Phase 2 + US2 → FAQ answers visible (SEO + trust restored)
3. US3 + US4 → Business info correct + fake reviews hidden (compliance)
4. US5 + US6 → Gallery hidden + footer polished (UX)
5. US7 → New services live (expanded market)
6. US8 → FAQ expanded (SEO growth)
7. Each increment is deployable and adds value independently

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Commit after each story phase completion
- seed.ts is a shared file — if parallelizing stories, batch seed.ts changes or coordinate carefully
- Content research tasks (T027-T028, T034-T036) involve web research — may take longer than code tasks
- Phone number canonical format: `(888) 414-0007` display, `tel:+18884140007` href
