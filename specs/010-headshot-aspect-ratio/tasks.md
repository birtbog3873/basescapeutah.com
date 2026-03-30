# Tasks: Square Founder Headshot

**Input**: Design documents from `/specs/010-headshot-aspect-ratio/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md

**Tests**: Not requested — no test tasks included.

**Organization**: Single user story (P1), minimal scope — 3 implementation tasks + 1 verification task.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

---

## Phase 1: User Story 1 - Square founder headshot (Priority: P1) MVP

**Goal**: Replace the 800x750 founder headshot with an 800x800 square version and update the HTML attributes to match.

**Independent Test**: Run `sips -g pixelWidth -g pixelHeight site/public/images/team-steven-bunker.webp` and confirm both dimensions are 800. Open the about page and visually confirm the headshot displays correctly.

### Implementation for User Story 1

- [x] T001 [US1] Crop the founder headshot image to 750x750 square at `site/public/images/team-steven-bunker.webp`
- [x] T002 [P] [US1] Update the `<img>` tag `width` and `height` attributes to `"750"` in `site/src/pages/about.astro` (line 81-82)
- [x] T003 [US1] Verify image dimensions are 750x750 using `sips -g pixelWidth -g pixelHeight site/public/images/team-steven-bunker.webp`

**Checkpoint**: Headshot displays as a properly composed square on the about page at all viewport sizes

---

## Phase 2: Polish & Cross-Cutting Concerns

**Purpose**: Final validation

- [x] T004 Run quickstart.md validation — confirm all verification steps pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (US1)**: No prerequisites — can start immediately
- **Phase 2 (Polish)**: Depends on Phase 1 completion

### Within User Story 1

- T001 (image crop) must complete before T002 (HTML update) can be meaningfully verified
- T002 (HTML update) can technically run in parallel with T001 since they modify different files — marked [P]
- T003 (verification) depends on T001 completion

### Parallel Opportunities

- T001 and T002 modify different files and can execute in parallel

---

## Parallel Example: User Story 1

```bash
# These can run in parallel (different files):
Task T001: "Crop/extend headshot image to 800x800 at site/public/images/team-steven-bunker.webp"
Task T002: "Update height attribute in site/src/pages/about.astro"

# Then verify sequentially:
Task T003: "Verify image dimensions with sips"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete T001: Crop/extend the image to square
2. Complete T002: Update HTML height attribute
3. Complete T003: Verify dimensions
4. **STOP and VALIDATE**: Visual check on about page
5. Complete T004: Run quickstart validation

### Implementation Notes

- **Preferred crop approach** (from research.md): Extend canvas at bottom by 50px with matching dark gray background — preserves all existing content
- **Fallback approach**: Center crop to 750x750 and upscale to 800x800
- Use `sips` (macOS native) for image manipulation; use `cwebp` if format conversion needed

---

## Notes

- [P] tasks = different files, no dependencies
- [US1] label maps all tasks to User Story 1
- Total: 4 tasks (3 implementation + 1 validation)
- Commit after image replacement + HTML update together as one logical change
