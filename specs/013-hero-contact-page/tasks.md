# Tasks: Hero Redesign + Dedicated Contact Page

**Input**: Design documents from `/specs/013-hero-contact-page/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)

---

## Phase 1: Setup

**Purpose**: Verify existing dev environment is functional

- [x] T001 Verify dev environment by running `pnpm dev` and confirming site loads on localhost:4321 and CMS on localhost:3000

---

## Phase 2: User Story 1 — Homeowner Enters ZIP to Schedule Estimate (Priority: P1) MVP

**Goal**: Simplify the homepage hero to trust-forward copy + ZIP input, create a dedicated `/contact` page as the single lead form location, and pre-populate ZIP from URL params.

**Independent Test**: Visit homepage, enter ZIP "84645", click "Schedule a Free Design", verify `/contact?zip=84645` loads with ZIP pre-filled in step 1. Also visit `/contact` directly and verify form works with empty ZIP.

- [x] T002 [P] [US1] Add `initialZip` prop and `useEffect` to read `zip` from `URLSearchParams` on mount (pre-fill step 1 ZIP without auto-advancing) in `site/src/components/forms/MultiStepForm.tsx`
- [x] T003 [P] [US1] Rewrite homepage hero: replace subtitle with trust-forward copy (FR-001), replace `CTABlock variant="hero"` with `<form method="GET" action="/contact">` containing ZIP input (`maxlength="5"`, `pattern="[0-9]{5}"`, `name="zip"`) and "Schedule a Free Design" button (FR-002, FR-003); retain headline, overline, hero image (FR-004) in `site/src/pages/index.astro`
- [x] T004 [US1] Create dedicated `/contact` page: fetch site settings with hardcoded fallbacks (Constitution I), render `MultiStepForm` with `client:load` and `sourcePage="/contact"`, add `TrustBadges` below form, add "Prefer to call?" section with business phone number (FR-005, FR-006, FR-007) in `site/src/pages/contact.astro`

**Checkpoint**: Homepage hero shows ZIP input form. `/contact` page renders the multi-step form with trust badges. ZIP pre-fill works via URL param.

---

## Phase 3: User Story 2 — Mobile User Taps Bottom Bar for Estimate (Priority: P1)

**Goal**: Restyle the mobile bottom bar to flat, edge-to-edge cells with "Call Now" (teal) and "Free Estimate" (navy).

**Independent Test**: On a mobile viewport, verify bottom bar renders as two flat 50/50-split cells with no rounded corners/gaps/shadows. "Call Now" initiates tel: link, "Free Estimate" navigates to `/contact`. Verify safe-area inset padding on notched device viewport.

- [x] T005 [US2] Restyle mobile bottom bar: remove border-radius, box-shadow, and gaps; set 50/50 flex split; left cell "Call Now" with phone icon on light teal (`teal400`) background; right cell "Free Estimate" on dark navy (`navy800`) background linking to `/contact`; maintain `env(safe-area-inset-bottom)` padding (FR-009 through FR-012) in `site/src/components/layout/MobileBottomBar.astro`

**Checkpoint**: Mobile bottom bar is flat, edge-to-edge, with correct colors and links.

---

## Phase 4: User Story 4 — All CTAs Route to Contact Page (Priority: P2)

**Goal**: Route every estimate/appointment CTA across the site to `/contact` and remove the embedded form from all layouts.

**Independent Test**: Navigate to homepage, service pages, and landing pages — verify all CTA buttons link to `/contact`. Verify no embedded form section appears on any page except `/contact`. Search codebase for zero remaining `#estimate-form` references.

**Depends on**: US1 (contact page must exist at `/contact`)

- [x] T006 [P] [US4] Change default `estimateUrl` prop from `'#estimate-form'` to `'/contact'` in `site/src/components/content/CTABlock.astro`
- [x] T007 [P] [US4] Change CTA button `href` from `#estimate-form` to `/contact` in `site/src/components/layout/Header.astro`
- [x] T008 [P] [US4] Remove the `<section id="estimate-form">` block, `MultiStepForm` import, and associated styles from `site/src/layouts/BaseLayout.astro`; update noscript fallback CTA href from `#estimate-form` to `/contact`
- [x] T009 [P] [US4] Remove the `<section id="estimate-form">` block and `MultiStepForm` import from `site/src/layouts/LandingLayout.astro`
- [x] T010 [US4] Remove `id="estimate-form"` attributes from the form wrapper and success section in `site/src/components/forms/MultiStepForm.tsx` (scroll targeting no longer needed)

**Checkpoint**: All CTAs site-wide navigate to `/contact`. No embedded form exists outside of `/contact`. Zero `#estimate-form` references remain.

---

## Phase 5: User Story 3 — Lead Data Logs to Google Sheet (Priority: P2)

**Goal**: After a lead completes the form, POST lead data to a configurable Google Sheets webhook URL.

**Independent Test**: Submit a lead through the form. Verify lead data appears in the Google Sheet (if webhook URL is configured). Verify form submission completes successfully even if webhook URL is missing or unreachable.

- [x] T011 [US3] Add fire-and-forget Google Sheets webhook POST after team notification block in `cms/src/hooks/afterLeadCreate.ts`: check `process.env.GOOGLE_SHEETS_WEBHOOK_URL` exists, POST JSON payload per `contracts/google-sheets-webhook.md` (timestamp, name, phone, email, zipCode, serviceType, projectPurpose, timeline, source, pageUrl), wrap in try/catch — log errors, never throw (FR-015, FR-016, FR-018)
- [x] T012 [P] [US3] Add `GOOGLE_SHEETS_WEBHOOK_URL` to CMS environment variable documentation in `cms/.env.example` (if exists) or as a comment in `cms/src/dev-config.ts`

**Checkpoint**: Completed leads POST data to Google Sheets. Webhook failures are silent. Missing webhook URL is handled gracefully.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification across all user stories

- [x] T013 Search entire codebase for remaining `#estimate-form` references and fix any that were missed
- [x] T014 Run `npx eslint .` and fix any linting errors in modified files
- [x] T015 Run `pnpm build` to verify static build succeeds without CMS connectivity (Constitution I)
- [x] T016 Run quickstart.md validation: verify homepage hero, `/contact` page, `/contact?zip=84645` pre-fill, mobile bottom bar, and CTA routing all work on `localhost:4321`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **US1 (Phase 2)**: Depends on Setup — creates the contact page (MVP)
- **US2 (Phase 3)**: Depends on Setup — can run in parallel with US1 (different files)
- **US4 (Phase 4)**: Depends on US1 — contact page must exist before removing old form
- **US3 (Phase 5)**: Depends on Setup only — CMS-side, fully independent of site changes; can run in parallel with US1/US2/US4
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: No dependencies on other stories — creates `/contact` and modifies hero
- **US2 (P1)**: No dependencies on other stories — restyles mobile bottom bar
- **US3 (P2)**: No dependencies on other stories — CMS webhook, different workspace
- **US4 (P2)**: Depends on US1 — can't remove old form until `/contact` exists

### Within Each User Story

- T002 and T003 can run in parallel (different files: MultiStepForm.tsx vs index.astro)
- T004 depends on T002 (contact page needs the modified MultiStepForm)
- T006, T007, T008, T009 can all run in parallel (different files)
- T010 runs after T006-T009 (same file as T002 but different phase)
- T011 and T012 can run in parallel (different files: hook vs env docs)

### Parallel Opportunities

```
                    Phase 1: Setup (T001)
                          │
            ┌─────────────┼─────────────┐
            ▼             ▼             ▼
    Phase 2: US1    Phase 3: US2   Phase 5: US3
    (T002 ∥ T003)   (T005)         (T011 ∥ T012)
    then T004
            │
            ▼
    Phase 4: US4
    (T006 ∥ T007 ∥ T008 ∥ T009)
    then T010
            │
            ▼
    Phase 6: Polish (T013–T016)
```

---

## Parallel Example: User Story 1

```bash
# Launch T002 and T003 together (different files):
Task: "Add initialZip prop and URL param reading to MultiStepForm.tsx"
Task: "Rewrite homepage hero with ZIP form in index.astro"

# Then T004 (depends on T002):
Task: "Create /contact page with MultiStepForm in contact.astro"
```

## Parallel Example: User Story 4

```bash
# Launch T006, T007, T008, T009 together (all different files):
Task: "Update CTABlock default estimateUrl in CTABlock.astro"
Task: "Update Header CTA href in Header.astro"
Task: "Remove form section from BaseLayout.astro"
Task: "Remove form section from LandingLayout.astro"

# Then T010 (depends on above):
Task: "Remove id=estimate-form from MultiStepForm.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: US1 (T002–T004)
3. **STOP and VALIDATE**: Visit homepage, enter ZIP, verify `/contact` page works
4. Deploy preview if ready

### Incremental Delivery

1. US1 → Hero + Contact Page working (MVP!)
2. US2 → Mobile bottom bar restyled
3. US4 → All CTAs consolidated to `/contact`, old form removed
4. US3 → Google Sheets logging active
5. Polish → Final verification and cleanup

### Parallel Team Strategy

With multiple developers or subagents:
1. Complete Setup together
2. Once Setup is done:
   - Agent A: US1 (hero + contact page) — site/src/pages/, site/src/components/forms/
   - Agent B: US2 (mobile bar) — site/src/components/layout/MobileBottomBar.astro
   - Agent C: US3 (webhook) — cms/src/hooks/afterLeadCreate.ts
3. After Agent A completes: US4 (CTA routing) — multiple site files

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Hero ZIP form uses native HTML `<form method="GET">` — no React needed (research.md Decision 1)
- MultiStepForm reads ZIP from `URLSearchParams` client-side, not via Astro props (research.md Decision 2)
- Google Sheets webhook is fire-and-forget in CMS hook (research.md Decision 4)
- All form validation rules unchanged — ZIP still validated by `/^\d{5}$/`
- Contact page must include hardcoded fallback data for CMS fields (Constitution I)
