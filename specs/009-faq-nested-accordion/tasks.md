# Tasks: FAQ Nested Accordion

**Input**: Design documents from `/specs/009-faq-nested-accordion/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: No project initialization needed — existing Astro site with all dependencies in place. This phase is empty.

*(No tasks — project structure and dependencies already exist)*

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Modify the existing FAQ component to support multi-open behavior required by FR-004 and FR-005. This change unblocks all user stories.

**CRITICAL**: No user story work can begin until this phase is complete.

- [x] T001 Remove `name` attribute from `<details>` elements in `site/src/components/content/FAQ.astro` — currently `name={id}` makes questions mutually exclusive; removing it allows multiple questions open simultaneously per FR-005. Keep all other markup and styles unchanged.

**Checkpoint**: FAQ.astro now allows multiple questions open within a category. Existing FAQ usage on service pages is unaffected (progressive enhancement still works).

---

## Phase 3: User Story 1 - Browse FAQ by Category (Priority: P1) MVP

**Goal**: Visitors see 5 top-level category accordions. Clicking a category expands to reveal nested question/answer accordions. Clicking a question reveals its answer. Core two-level nested accordion interaction.

**Independent Test**: Visit `/faq`, click "Cost & Pricing" → see questions appear. Click a question → see the answer. Click the question again → answer collapses. Click "Cost & Pricing" again → entire category collapses.

### Implementation for User Story 1

- [x] T002 [US1] Create `site/src/components/content/FAQCategory.astro` — outer accordion component using native `<details>/<summary>`. Props: `label` (string), `id` (string). The `<summary>` displays the category label with a chevron SVG (24px, rotates 180° on open). Style category headers with `--font-serif`, font-weight 700, larger font size than questions, navy background on `<summary>` (`--color-navy50` or `--color-bgAlt`), border-radius `--radius-md`, min-height 48px. Inner content area wraps a `<slot>` for nested FAQ items.
- [x] T003 [US1] Restructure `site/src/pages/faq.astro` — replace the `categories.map()` that renders separate `<section>` elements per category with a single `<section>` containing a container div. Inside the container, map categories to `<FAQCategory>` components, each wrapping a `<FAQ>` component with that category's items. Preserve: hero section, empty state, final CTA section, JSON-LD schema generation (unchanged — uses flat `allFaqs` list). Remove: alternating `section--alt` backgrounds per category (no longer separate sections). Remove: per-category `<h2>` headings (category name now lives in `<FAQCategory>` summary).
- [x] T004 [US1] Style the nested accordion container in `site/src/pages/faq.astro` — add a wrapper class for the accordion group with `max-width: 800px`, `margin-inline: auto`, `display: flex`, `flex-direction: column`, `gap: var(--size-3)`. Each `FAQCategory` should appear as a distinct card-like block.
- [x] T005 [US1] Ensure visual hierarchy between levels per FR-009 and research R3 — category `<summary>` uses `--font-serif` at `clamp(1.125rem, 1vw + 0.75rem, 1.375rem)`, color `--color-navy700`; question `<summary>` keeps existing `--font-sans` at `1rem`, color `--color-navy600`. Category chevron is 24px, question chevron stays 20px. Verify clear visual distinction when both levels are visible.

**Checkpoint**: Core nested accordion is functional. All 5 categories render, expand/collapse, and nest questions correctly. This is the MVP.

---

## Phase 4: User Story 2 - Explore Multiple Categories (Priority: P2)

**Goal**: Multiple top-level categories can remain open simultaneously. Opening a second category does not close the first.

**Independent Test**: Open "Cost & Pricing", then open "Timeline & Scheduling" — both remain expanded. Collapse one — the other stays open.

### Implementation for User Story 2

- [x] T006 [US2] Verify no `name` attribute on outer `<details>` in `site/src/components/content/FAQCategory.astro` — ensure the `FAQCategory` component does NOT include a `name` attribute on its `<details>` element. This is the only requirement for multi-open behavior (native browser behavior when `name` is absent). If T002 already omitted `name`, this task is a verification-only pass.

**Checkpoint**: Multiple categories open simultaneously. Combined with US1, the full browse + explore flow works.

---

## Phase 5: User Story 3 - Mobile FAQ Browsing (Priority: P2)

**Goal**: Nested accordion is usable on mobile devices (320px–768px). Tap targets meet 48px minimum, no horizontal scrolling, readable text.

**Independent Test**: View `/faq` at 375px viewport width. Tap a category → expands. Tap a question → answer readable without zoom. No horizontal overflow.

### Implementation for User Story 3

- [x] T007 [US3] Add responsive styles to `site/src/components/content/FAQCategory.astro` — reduce padding on `<summary>` for mobile (e.g., `padding: var(--size-3) var(--size-4)` below 768px), ensure font size scales down gracefully with `clamp()`, verify min-height 48px for tap targets on all breakpoints.
- [x] T008 [US3] Adjust inner FAQ question padding in `site/src/components/content/FAQ.astro` for nested context — when FAQ is inside a category accordion, questions may need slightly reduced left padding to prevent excessive indentation on mobile. Use existing responsive breakpoints (768px) to tighten spacing on small screens while maintaining readability.

**Checkpoint**: FAQ page is fully usable across 320px–2560px viewports. Touch targets are accessible.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, accessibility, and build verification

- [x] T009 Add empty category fallback in `site/src/components/content/FAQCategory.astro` — if no child content is provided (slot is empty), display a message like "No questions available yet." inside the expanded category per edge case spec.
- [x] T010 Verify keyboard navigation across both levels — Tab through all categories and questions on `/faq`, confirm Enter/Space toggles expand/collapse at both levels per FR-007. Fix any focus order issues.
- [x] T011 Run `pnpm build` in `site/` directory and verify static build succeeds with no errors. Check built HTML output for `/faq` to confirm JSON-LD FAQPage schema is present and valid.
- [x] T012 Run quickstart.md verification checklist — walk through all 11 items in `specs/009-faq-nested-accordion/quickstart.md` verification section and confirm each passes.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Empty — no setup needed
- **Foundational (Phase 2)**: T001 must complete before any US work — removes `name` attribute blocking FR-005
- **US1 (Phase 3)**: Depends on T001. T002 → T003 → T004 → T005 (sequential — each builds on previous)
- **US2 (Phase 4)**: Depends on T002. T006 is verification only
- **US3 (Phase 5)**: Depends on T002, T003. T007 and T008 can run in parallel [P]
- **Polish (Phase 6)**: Depends on all user stories complete. T009, T010, T011 can run in parallel [P]

### User Story Dependencies

- **User Story 1 (P1)**: Depends only on Foundational (T001). Core MVP.
- **User Story 2 (P2)**: Depends on US1 component creation (T002). Verification task only.
- **User Story 3 (P2)**: Depends on US1 components (T002, T003). Independent responsive styling.

### Within Each User Story

- T002 (create component) before T003 (use component in page)
- T003 (page restructure) before T004 (container styling)
- T004 (container styling) before T005 (hierarchy polish)

### Parallel Opportunities

- T007 and T008 (US3 mobile styles) can run in parallel — different files
- T009, T010, T011 (Polish) can run in parallel — independent concerns

---

## Parallel Example: User Story 3

```bash
# Launch mobile responsive tasks together (different files):
Task: "T007 Add responsive styles to FAQCategory.astro"
Task: "T008 Adjust inner FAQ question padding in FAQ.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 2: Foundational (T001 — remove `name` attribute)
2. Complete Phase 3: User Story 1 (T002–T005 — nested accordion)
3. **STOP and VALIDATE**: Visit `/faq` in dev server, verify categories expand/collapse with nested questions
4. Build passes with `pnpm build`

### Incremental Delivery

1. T001 → Foundation ready (multi-open enabled)
2. T002–T005 → User Story 1 complete → MVP functional
3. T006 → User Story 2 verified → multi-category confirmed
4. T007–T008 → User Story 3 complete → mobile-ready
5. T009–T012 → Polish complete → production-ready

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- No test tasks included (not requested in spec)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Total: 12 tasks across 6 phases
