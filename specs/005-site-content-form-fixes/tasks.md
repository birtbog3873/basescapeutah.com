# Tasks: Site Content & Form Fixes

**Input**: Design documents from `/specs/005-site-content-form-fixes/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not requested -- no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Environment configuration required before any implementation

- [ ] T001 Set valid PAYLOAD_API_KEY in `site/.env` (line 2) -- requires generating an API key from the Payload CMS instance. This is the root cause of the form "Something went wrong" error (see R-001).

---

## Phase 2: Foundational -- Schema Alignment (serves US1, US2, US5)

**Purpose**: Align all service type enums across validation, form, and CMS. These changes are blocking prerequisites for the form fix (US2), services grid (US1), and Window Well removal (US5).

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T002 [P] Update Zod serviceType enum from `['walkout-basement', 'egress-window', 'window-well-upgrade', 'retaining-walls', 'not-sure']` to `['walkout-basement', 'basement-remodeling', 'pavers-hardscapes', 'retaining-walls', 'artificial-turf', 'egress-window', 'not-sure']` in `site/src/lib/validation.ts:21`
- [x] T003 [P] Update SERVICE_OPTIONS array to 7 options (6 services + "Not Sure -- Help Me Decide") matching new enum order in `site/src/components/forms/MultiStepForm.tsx:5-11`
- [x] T004 [P] Update serviceType select field options to match new Zod enum in `cms/src/collections/Leads.ts:68-74`

**Checkpoint**: US2 (Free Estimate Form) is satisfied -- form submits all 3 steps without error, dropdown shows 7 options, validation accepts all new types.

---

## Phase 3: US1 -- Services Grid Displays Correct Services in Correct Order (Priority: P1) MVP

**Goal**: Homepage shows exactly 6 service cards in order: Walkout Basements, Basement Remodeling, Pavers & Hardscapes, Retaining Walls, Artificial Turf, Egress Windows. Navigation updated to match.

**Independent Test**: Navigate to homepage, verify 6 services in specified order. Check header and footer nav for all 6 services. No "Window Well" visible.

### Implementation for US1

- [x] T005 [US1] Replace fallback services array with 6 services in specified display order (each entry: title, tagline, slug, primaryValuePillar) in `site/src/pages/index.astro:53-59`
- [x] T006 [P] [US1] Update fallback nav services dropdown -- add Basement Remodeling, add Retaining Walls, remove Window Well Upgrades, ensure 6 services in correct order in `site/src/components/layout/Header.astro:18-26`
- [x] T007 [P] [US1] Mirror header nav changes in footer fallback nav -- same 6 services, same order in `site/src/components/layout/Footer.astro:23-42`

**Checkpoint**: Homepage displays 6 services in correct order. Header and footer nav list all 6 services. No Window Well references in grid or nav.

---

## Phase 4: US3 -- Basement Remodeling Service Page Exists (Priority: P2)

**Goal**: Full-depth service page at `/services/basement-remodeling` matching existing service page pattern and depth.

**Independent Test**: Navigate to `/services/basement-remodeling`, verify all sections render (hero, overview, process steps, anxiety stack, differentiator, CTA). Compare depth against walkout-basements page.

### Implementation for US3

- [x] T008 [US3] Create `site/src/pages/services/basement-remodeling.astro` following exact pattern of `site/src/pages/services/walkout-basements.astro`:
  - Import ServiceLayout + fetch functions
  - Define fallback data: title ("Basement Remodeling"), slug ("basement-remodeling"), tagline, primaryValuePillar ("transformation"), supportingPillars
  - Overview (HTML) framed as "basement transformation" per Art. III compliance (R-007) -- NOT generic remodeling
  - Process steps (min 3): consultation/assessment, design/planning, construction/build-out
  - AnxietyStack (7 concerns): cost, timeline, disruption, moisture/waterproofing, structural integrity, code compliance, ROI
  - Differentiator emphasizing basement-specific expertise
  - SEO metadata (metaTitle, metaDescription) targeting basement transformation keywords
  - Render via `<ServiceLayout service={service} settings={settings} />`

**Checkpoint**: `/services/basement-remodeling` loads with all sections. Content matches depth of walkout-basements. Content frames as specialist basement transformation, not generic remodeling.

---

## Phase 5: US4 -- FAQ Page Displays Actual Questions and Answers (Priority: P2)

**Goal**: Replace FAQ placeholder with categorized, expandable Q&A content covering the updated service lineup.

**Independent Test**: Navigate to FAQ page, verify categorized questions display (no placeholder message). Click questions to verify expand/collapse. Check hero subtitle reflects all 6 services.

### Implementation for US4

- [x] T009 [US4] Update hero subtitle text to reflect full service lineup (walkout basements, basement remodeling, pavers & hardscapes, retaining walls, artificial turf, egress windows) in `site/src/pages/faq.astro:91-93`
- [x] T010 [US4] Add fallback FAQ content array with 8-10 FAQs across categories in `site/src/pages/faq.astro`:
  - **Cost** (2-3): General pricing ranges, free estimate process, payment options/financing
  - **Timeline** (1-2): Typical project durations, scheduling/availability
  - **General** (2-3): Wasatch Front service area, licensing/insurance, what to expect
  - **Code Compliance** (1-2): Permit handling, inspection process
  - **Disruption** (1): What to expect during construction
  - Each FAQ: question (string), answer (HTML string), category (matching existing 9 category slugs), sortOrder (number)
- [x] T011 [P] [US4] Update FAQ seed data in `cms/src/seed.ts:362-411` to match new fallback FAQ content -- remove any Window Well-specific FAQs, add questions covering the updated service list

**Checkpoint**: FAQ page shows categorized questions with expand/collapse. No placeholder "We're building out our FAQ section" visible. Hero subtitle lists all 6 services.

---

## Phase 6: US5 -- Window Well Updates Service is Fully Removed (Priority: P3)

**Goal**: Cleanly remove all traces of Window Well Upgrades from the site with proper redirect for old URLs.

**Independent Test**: Visit `/services/window-well-upgrades` -- should redirect to `/`. Search all user-facing pages for "Window Well" -- should find zero matches.

### Implementation for US5

- [x] T012 [US5] Delete `site/src/pages/services/window-well-upgrades.astro`
- [x] T013 [US5] Add permanent redirect in `site/astro.config.ts` redirects config: `'/services/window-well-upgrades': '/'` (301)
- [x] T014 [US5] Remove Window Well Upgrades from navigation seed data and remove Window Well-specific FAQ entries from seed data in `cms/src/seed.ts`
- [x] T015 [US5] Verify no remaining "Window Well" references across all user-facing files -- search `site/src/` for "window.well", "Window Well", "window-well" and confirm only the redirect config remains

**Checkpoint**: `/services/window-well-upgrades` redirects to homepage. Zero "Window Well" references in any user-facing content, navigation, form options, or seed data.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Final validation across all user stories

- [x] T016 Run full site build (`cd site && pnpm build`) and verify no build errors
- [x] T017 Execute quickstart.md verification checklist:
  1. Homepage shows 6 services in order
  2. Form completes all 3 steps without error
  3. `/services/basement-remodeling` loads with full content
  4. `/services/window-well-upgrades` redirects to homepage
  5. FAQ page shows categorized Q&A (no placeholder)
  6. No "Window Well" references anywhere on site

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies -- can start immediately
- **Foundational (Phase 2)**: Depends on Setup -- BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational (Phase 2)
- **US3 (Phase 4)**: Depends on Foundational (Phase 2) -- can run parallel with US1
- **US4 (Phase 5)**: No dependencies on other user stories -- can run parallel with US1/US3
- **US5 (Phase 6)**: Depends on Foundational (Phase 2) -- should run AFTER US1 to avoid double-editing nav files
- **Polish (Phase 7)**: Depends on ALL user stories complete

### User Story Dependencies

- **US2 (Form Fix, P1)**: Fully satisfied by Setup (T001) + Foundational (T002-T004) -- no dedicated phase needed
- **US1 (Services Grid, P1)**: Independent after Foundational. Modifies index.astro, Header.astro, Footer.astro
- **US3 (Basement Remodeling, P2)**: Independent after Foundational. Creates new file only -- no conflicts
- **US4 (FAQ Content, P2)**: Independent. Modifies faq.astro and seed.ts
- **US5 (Window Well Removal, P3)**: Independent after Foundational. Deletes file, modifies astro.config.ts and seed.ts. Overlaps with US4 on seed.ts -- run US5 after US4 to avoid merge conflicts

### Within Each User Story

- Core content changes before verification
- Fallback data in Astro pages before CMS seed data
- Page modifications before cross-file cleanup

### Parallel Opportunities

**After Foundational completes, these can run in parallel:**
```
Agent 1: US1 (T005, T006, T007) -- grid + nav updates
Agent 2: US3 (T008) -- new basement remodeling page
Agent 3: US4 (T009, T010, T011) -- FAQ content
```

**Within Phase 2 (Foundational):**
```
All three tasks (T002, T003, T004) can run in parallel -- different files
```

**Within US1:**
```
T006 (Header) and T007 (Footer) can run in parallel after T005 (index)
```

---

## Implementation Strategy

### MVP First (US2 + US1)

1. Complete Phase 1: Setup (API key)
2. Complete Phase 2: Foundational (schema alignment) -- **US2 is now complete**
3. Complete Phase 3: US1 (services grid + nav)
4. **STOP and VALIDATE**: Form works, homepage correct, nav updated
5. This alone unblocks lead capture and fixes the most visible issues

### Incremental Delivery

1. Setup + Foundational -> Form fixed (US2 done)
2. Add US1 (grid + nav) -> Correct services displayed (US1 done)
3. Add US3 (basement remodeling page) -> New service live (US3 done)
4. Add US4 (FAQ content) -> FAQ populated (US4 done)
5. Add US5 (window well removal) -> Clean removal (US5 done)
6. Polish -> Build verified, full checklist passed

### Parallel Execution (Recommended)

1. Complete Setup + Foundational sequentially (T001-T004)
2. Launch US1, US3, US4 in parallel (T005-T011)
3. Complete US5 after US4 finishes (shared seed.ts file)
4. Polish phase validates everything
