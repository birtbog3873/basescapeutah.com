# Tasks: Site CTA and Phone Display Updates

**Input**: Design documents from `/specs/007-site-cta-updates/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Not explicitly requested in spec. Test file updates included only because existing tests reference old CTA text and will break otherwise.

**Organization**: Tasks are grouped by user story. US1 and US2 are both P1 and can proceed in parallel since they modify different elements within the same files (CTA buttons vs call buttons). US3 is delivered as part of the US2 Header changes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: User Story 1 - Book Appointment CTA (Priority: P1) MVP

**Goal**: Rename all "Get Free Estimate" / "Free Estimate" CTA button labels to "Book Appointment" across Header, MobileBottomBar, and CTABlock components.

**Independent Test**: All primary CTA buttons read "Book Appointment" and clicking them still opens the estimate form.

### Implementation for User Story 1

- [x] T001 [P] [US1] Change "Get Free Estimate" to "Book Appointment" in `site/src/components/layout/Header.astro` (line 75, `header__cta` link text)
- [x] T002 [P] [US1] Change "Free Estimate" to "Book Appointment" in `site/src/components/layout/MobileBottomBar.astro` (line 34, `mobile-bar__btn--estimate` link text)
- [x] T003 [P] [US1] Change "Get Free Estimate" to "Book Appointment" in `site/src/components/content/CTABlock.astro` (line 30, `cta-block__btn--estimate` link text)

**Checkpoint**: All CTA buttons now read "Book Appointment". Form submission flow unchanged.

---

## Phase 2: User Story 2 + 3 - Phone Number Display with Icon (Priority: P1 + P2)

**Goal**: Replace "Call Now" text with phone icon + visible phone number on call buttons. Add phone icon next to phone number in desktop header nav (US3). Add `aria-label` attributes for accessibility.

**Independent Test**: Call buttons show the actual phone number (e.g., "(888) 414-0007") with a phone icon. Tapping/clicking still initiates a call. Desktop nav phone number has an icon next to it.

### Implementation for User Stories 2 & 3

- [x] T004 [P] [US2] Replace phone text link with phone icon SVG + number and add `aria-label`, flex styling to `header__phone` in `site/src/components/layout/Header.astro` (lines 71-73, plus CSS for `.header__phone` to add `display: inline-flex; align-items: center; gap: var(--size-1)`)
- [x] T005 [P] [US2] Replace "Call Now" text with `{phone}` and add `aria-label` to call button in `site/src/components/layout/MobileBottomBar.astro` (line 21, keep existing phone SVG icon, change text only)
- [x] T006 [P] [US2] Replace "Call Now" text with `{phone}` and add `aria-label` to call button in `site/src/components/content/CTABlock.astro` (line 27, keep existing phone SVG icon, change text only)
- [x] T007 [US2] Verify mobile bottom bar layout at 320px viewport width — phone number is longer than "Call Now", confirm `flex: 1` handles the wider text without overflow in `site/src/components/layout/MobileBottomBar.astro`

**Checkpoint**: All call buttons show phone icon + phone number. Desktop nav has phone icon. `tel:` links work. US3 delivered via T004.

---

## Phase 3: Polish & Cross-Cutting Concerns

**Purpose**: Update test selectors to match new button text and perform final verification.

- [x] T008 [P] Update CTA text selectors in `site/tests/a11y/homepage.spec.ts` — change `"Call Now"` references to match phone number pattern, change `"Get Free Estimate"` to `"Book Appointment"` (lines 85, 88, 104, 107)
- [x] T009 [P] Update CTA comment/selectors in `site/tests/visual/homepage.spec.ts` — update "Call Now + Get Free Estimate" reference (line 30)
- [x] T010 Run Astro build (`cd site && pnpm build`) to verify no compile errors from template changes
- [ ] T011 Run quickstart.md manual verification checklist (desktop, tablet, mobile viewports)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (US1)**: No dependencies — can start immediately
- **Phase 2 (US2+US3)**: No dependencies on Phase 1 — can run in parallel
- **Phase 3 (Polish)**: Depends on Phase 1 and Phase 2 completion

### User Story Dependencies

- **User Story 1 (P1)**: Independent — label-only changes to CTA buttons
- **User Story 2 (P1)**: Independent — text/icon changes to call buttons
- **User Story 3 (P2)**: Delivered alongside US2 in T004 (same `header__phone` element)

### Within Each Phase

- T001, T002, T003 can all run in parallel (different files)
- T004, T005, T006 can all run in parallel (different files)
- T007 depends on T005 (verify the MobileBottomBar change)
- T008, T009 can run in parallel (different test files)
- T010 depends on all component changes (T001-T007)
- T011 depends on T010 (build must succeed first)

### Parallel Opportunities

```bash
# Wave 1 — All component changes in parallel (6 tasks across 3 files):
Task: T001 [US1] Header.astro CTA rename
Task: T002 [US1] MobileBottomBar.astro CTA rename
Task: T003 [US1] CTABlock.astro CTA rename
Task: T004 [US2] Header.astro phone icon + number
Task: T005 [US2] MobileBottomBar.astro phone number
Task: T006 [US2] CTABlock.astro phone number

# Wave 2 — Verification + test updates:
Task: T007 Mobile layout check
Task: T008 a11y test selectors
Task: T009 visual test selectors

# Wave 3 — Final validation:
Task: T010 Build verification
Task: T011 Manual QA
```

Note: Since T001+T004 both edit Header.astro, T002+T005 both edit MobileBottomBar.astro, and T003+T006 both edit CTABlock.astro, in practice these pairs should be done together per-file to avoid merge conflicts.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete T001, T002, T003 (label renames)
2. **STOP and VALIDATE**: All CTA buttons read "Book Appointment", forms still work
3. Can deploy this alone if phone number changes need more time

### Full Delivery (Recommended)

1. Complete Phase 1 (T001-T003) + Phase 2 (T004-T007) together per-file
2. Complete Phase 3 (T008-T011)
3. Deploy all changes together

### Practical Per-File Order

Since US1 and US2 modify the same files, the most efficient approach:

1. **Header.astro**: T001 + T004 together (both CTA rename + phone icon)
2. **MobileBottomBar.astro**: T002 + T005 together + T007 verify
3. **CTABlock.astro**: T003 + T006 together
4. **Tests**: T008 + T009 in parallel
5. **Validate**: T010 → T011

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US3 is not a separate phase because it's the same Header.astro change as US2 (T004)
- No new files created — all changes are in-place edits to existing components
- Form headings ("Get Your Free Estimate") are intentionally NOT changed per research.md R1
- Phone SVG icon reused from existing MobileBottomBar/CTABlock per research.md R4
