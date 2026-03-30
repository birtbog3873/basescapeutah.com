# Tasks: Add Retaining Walls Service

**Input**: Design documents from `/specs/004-retaining-walls-service/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Not explicitly requested in the feature specification. Verification is achieved through build checks and manual page inspection. Constitution Art. XV (TDD) is acknowledged — automated test infrastructure setup is deferred as it exceeds this feature's scope.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Verify pre-existing changes and branch readiness

- [x] T001 Verify `retaining-walls` exists in `site/src/components/forms/MultiStepForm.tsx` SERVICE_OPTIONS array
- [x] T002 [P] Verify `retaining-walls` exists in `site/src/lib/validation.ts` serviceType Zod enum
- [x] T003 [P] Verify `retaining-walls` exists in `cms/src/collections/Leads.ts` serviceType select options
- [x] T004 [P] Verify `retaining-walls` exists in `cms/payload-types.ts` serviceType union type
- [x] T005 [P] Verify `retaining-walls` exists in `cms/src/email/team-notification.ts` SERVICE_LABELS
- [x] T006 [P] Verify `retaining-walls` exists in `cms/src/email/lead-confirmation.ts` SERVICE_LABELS

**Checkpoint**: All 6 pre-existing changes confirmed present. If any are missing, re-apply from `003-site-fixes-content` branch before proceeding.

---

## Phase 2: User Story 1 — Homeowner Discovers Retaining Walls Service (Priority: P1) MVP

**Goal**: Create a fully rendered service page at `/services/retaining-walls` with hero, overview, process steps, anxiety stack, differentiator, FAQs, and CTA sections — all with hardcoded fallback content.

**Independent Test**: Navigate to `http://localhost:4321/services/retaining-walls` (dev) or build the site and inspect `dist/services/retaining-walls/index.html`. Page should render all sections with retaining-wall-specific content.

### Implementation for User Story 1

- [x] T007 [US1] Create service page file at `site/src/pages/services/retaining-walls.astro` — copy structure from `site/src/pages/services/walkout-basements.astro`
- [x] T008 [US1] Replace frontmatter CMS slug filter to find service by slug `retaining-walls` in `site/src/pages/services/retaining-walls.astro`
- [x] T009 [US1] Write fallback service metadata in `site/src/pages/services/retaining-walls.astro`: title ("Retaining Walls"), slug ("retaining-walls"), tagline (transformation-focused, < 200 chars), primaryValuePillar ("transformation"), supportingPillars (["safety"]), serviceType ("core")
- [x] T010 [US1] Write fallback overview HTML in `site/src/pages/services/retaining-walls.astro`: describe retaining wall service offering, landscape transformation, structural engineering, material options
- [x] T011 [US1] Write fallback process array (4 steps) in `site/src/pages/services/retaining-walls.astro`: (1) Site Assessment & Design, (2) Engineering & Permits, (3) Excavation & Construction, (4) Finish & Landscape Restoration — each with stepTitle and stepDescription HTML
- [x] T012 [US1] Write fallback anxietyStack group (7 fields) in `site/src/pages/services/retaining-walls.astro`: structuralSafety (footings, reinforcement, soil pressure), codeCompliance (permits for walls over 4ft, engineering), drainageMoisture (French drains, weep holes, gravel backfill), dustDisruption (excavation containment), costAffordability (ranges $5K-$50K+), aesthetics (stone, block, concrete options), timeline (1-3 weeks)
- [x] T013 [US1] Write fallback differentiator HTML in `site/src/pages/services/retaining-walls.astro`: emphasize BaseScape's structural engineering expertise applied to retaining walls
- [x] T014 [US1] Write fallback FAQs array (7 items) in `site/src/pages/services/retaining-walls.astro`: cost in Utah, permit requirements, best materials, lifespan, drainage benefits, height limits without engineering, property value impact
- [x] T015 [US1] Write fallback SEO metadata in `site/src/pages/services/retaining-walls.astro`: metaTitle "Retaining Walls | Utah Wasatch Front | BaseScape" (< 60 chars), metaDescription (< 160 chars)
- [x] T016 [US1] Set fallback projects and reviews to empty arrays in `site/src/pages/services/retaining-walls.astro`
- [x] T017 [US1] Verify page builds successfully: run `cd site && pnpm build` and confirm `dist/services/retaining-walls/index.html` exists

**Checkpoint**: Retaining walls page is fully functional at `/services/retaining-walls` with all required content sections. ServiceLayout auto-generates JSON-LD structured data (Service + FAQ schemas).

---

## Phase 3: User Story 2 — Navigation Access to Retaining Walls (Priority: P2)

**Goal**: "Retaining Walls" appears in the header services dropdown and footer service links, discoverable from any page.

**Independent Test**: Load any page and verify "Retaining Walls" appears in the header dropdown menu and footer services column, with links navigating to `/services/retaining-walls`.

### Implementation for User Story 2

- [x] T018 [P] [US2] Add `{ label: 'Retaining Walls', url: '/services/retaining-walls' }` to the fallback nav Services children array in `site/src/components/layout/Header.astro` (after the Artificial Turf entry, before the closing bracket)
- [x] T019 [P] [US2] Add `{ label: 'Retaining Walls', url: '/services/retaining-walls' }` to the fallback footer Services links array in `site/src/components/layout/Footer.astro` (after the Artificial Turf entry, before the closing bracket)
- [x] T020 [US2] Verify navigation links render on dev server: header dropdown shows "Retaining Walls" and footer Services column includes "Retaining Walls"

**Checkpoint**: Retaining Walls is discoverable from any page via header dropdown and footer navigation.

---

## Phase 4: User Story 3 — Retaining Walls Lead Capture (Priority: P3)

**Goal**: Estimate form accepts "Retaining Walls" as a service option, leads are captured with correct service type, and emails display the proper label.

**Independent Test**: Submit the estimate form with "Retaining Walls" selected and verify the form validates, CMS accepts the lead, and both emails reference the service correctly.

### Implementation for User Story 3

No implementation tasks — all changes were completed in prior work (Phase 1 verification).

- FR-005: MultiStepForm.tsx SERVICE_OPTIONS — verified in T001
- FR-006: validation.ts Zod enum — verified in T002
- FR-007: Leads.ts + payload-types.ts — verified in T003, T004
- FR-008: team-notification.ts + lead-confirmation.ts — verified in T005, T006

**Checkpoint**: Lead capture pipeline fully supports `retaining-walls` service type end-to-end.

---

## Phase 5: User Story 4 — SEO & Schema Markup (Priority: P4)

**Goal**: Retaining walls page has proper SEO metadata and JSON-LD structured data (Service + FAQ schemas).

**Independent Test**: Inspect page source for meta tags in `<head>` and JSON-LD `<script>` blocks. Validate with Google Rich Results Test.

### Implementation for User Story 4

No separate implementation tasks — SEO is handled by existing infrastructure:

- **Meta tags**: Set in the fallback `seo` object (T015) and rendered by ServiceLayout's BaseLayout `<head>` slot
- **Service schema**: Auto-generated by `generateServiceSchema()` in `site/src/lib/schema.ts` — uses service title, tagline, slug
- **FAQ schema**: Auto-generated by `generateFAQPageSchema()` in `site/src/lib/schema.ts` — uses the FAQs array from T014
- **OG tags**: Derived from seo metadata by BaseLayout

- [x] T021 [US4] Verify built page contains JSON-LD structured data: inspect `dist/services/retaining-walls/index.html` for `<script type="application/ld+json">` blocks containing Service and FAQPage schemas
- [x] T022 [US4] Verify built page contains meta title, meta description, and OG tags in `<head>` of `dist/services/retaining-walls/index.html`

**Checkpoint**: Page passes structured data validation and has complete SEO metadata.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all user stories

- [x] T023 Run full site build (`cd site && pnpm build`) and verify no errors
- [x] T024 Verify retaining walls page in `dist/` contains all required sections: hero, overview, process (4 steps), anxiety stack (7 fields), differentiator, FAQs (7 items), trust badges, CTA
- [x] T025 Verify `dist/services/retaining-walls/index.html` page weight < 250KB compressed (Constitution Art. I)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — verification only
- **US1 (Phase 2)**: No dependencies on other phases (fallback data is self-contained)
- **US2 (Phase 3)**: Depends on Phase 2 (page must exist for navigation links to be meaningful)
- **US3 (Phase 4)**: Already complete — verification only (Phase 1)
- **US4 (Phase 5)**: Depends on Phase 2 (SEO metadata is part of the page file)
- **Polish (Phase 6)**: Depends on Phases 2 and 3 completion

### User Story Dependencies

- **User Story 1 (P1)**: Independent — can start after Phase 1 verification
- **User Story 2 (P2)**: Logically depends on US1 (page should exist before adding nav links) but can technically be done in parallel
- **User Story 3 (P3)**: Complete — no work needed
- **User Story 4 (P4)**: Depends on US1 (schema data comes from the service page)

### Within Each User Story

- T007 (copy template) must come first in US1
- T008-T016 can be done as a single file edit (all modify the same file)
- T017 must come after all content is written
- T018 and T019 can run in parallel (different files)

### Parallel Opportunities

- Phase 1: T002-T006 can all run in parallel (different files)
- Phase 2: T008-T016 modify the same file — sequential within the file, but this is a single authoring task
- Phase 3: T018 and T019 can run in parallel (Header.astro vs Footer.astro)
- Phase 5: T021 and T022 can run in parallel

---

## Parallel Example: User Story 2

```bash
# These two tasks modify different files and can run in parallel:
Task T018: "Add Retaining Walls to header nav in site/src/components/layout/Header.astro"
Task T019: "Add Retaining Walls to footer nav in site/src/components/layout/Footer.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Verify pre-existing changes
2. Complete Phase 2: Create retaining-walls.astro with full fallback content
3. **STOP and VALIDATE**: Build site, inspect page, verify all sections render
4. Page is functional at `/services/retaining-walls` (accessible via direct URL)

### Incremental Delivery

1. Phase 1 (Setup verification) → Pre-existing work confirmed
2. Phase 2 (US1: Service page) → Page exists and renders → MVP!
3. Phase 3 (US2: Navigation) → Page is discoverable
4. Phase 4 (US3: Lead capture) → Already complete
5. Phase 5 (US4: SEO) → Verify structured data
6. Phase 6 (Polish) → Final build validation

### Practical Note

Since US1 is the bulk of the work (creating the page file with all fallback content), and US2 is two one-line edits, the entire feature can realistically be implemented in a single session. US3 and US4 require no new code — only verification.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- T007-T016 all modify the same file (`retaining-walls.astro`) and are best done as a single authoring pass
- US3 and US4 have no implementation tasks — they rely on existing infrastructure
- All content in the fallback data block should follow the patterns established in `walkout-basements.astro`
- The ServiceLayout component handles all rendering, styling, schema generation, and SEO automatically
