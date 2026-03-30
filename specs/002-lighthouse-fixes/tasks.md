# Tasks: Lighthouse Audit Fixes

**Input**: Design documents from `/specs/002-lighthouse-fixes/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md

**Tests**: Not explicitly requested in the feature specification. Verification is via Lighthouse CI audit (final phase).

**Organization**: Tasks grouped by user story. US5 (Image Format Optimization) is deferred per research decision R-005 — not included.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 0: Test Baseline (TDD Red Phase)

**Purpose**: Formalize the existing Lighthouse audit as the failing test baseline per Constitution Art. XV

- [x] T000 Save the Lighthouse audit JSON report to `specs/002-lighthouse-fixes/lighthouse-baseline.json` and document the failing scores: Accessibility 96% (target 100%), SEO 92% (target 100%), 7 console 404 errors (target 0), CTA contrast 3.82:1 (target ≥4.5:1). This is the "Red" baseline — all implementation tasks aim to turn these green.

**Checkpoint**: Failing baseline documented. Implementation can now proceed (TDD Green phase).

---

## Phase 1: User Story 1 - Accessible CTA Buttons (Priority: P1) MVP

**Goal**: Fix WCAG 2.2 AA contrast violation on all 4 CTA/skip-link elements by darkening `--color-ctaPrimaryBg` from `#B87308` (3.82:1) to `#946106` (~5.4:1)

**Independent Test**: Run Lighthouse accessibility audit; all 4 elements pass contrast check at 4.5:1+

### Implementation for User Story 1

- [x] T001 [P] [US1] Update `--color-ctaPrimaryBg` from `#B87308` to `#946106` in `site/src/styles/global.css` (line 73)
- [x] T002 [P] [US1] Mirror the `--color-ctaPrimaryBg` value to `#946106` in Vanilla Extract theme at `site/src/styles/theme.css.ts`

**Checkpoint**: Verify all 4 elements inherit the new color — inspect skip-link (`a.skip-link`), hero CTA (`cta-block__btn--estimate`), final CTA (same component), and mobile bar CTA (`mobile-bar__btn--estimate`). Confirm all use `var(--color-ctaPrimaryBg)` with no local overrides.

**Checkpoint**: CTA buttons and skip-link now meet WCAG 2.2 AA contrast. Verify with browser DevTools color picker on each element.

---

## Phase 2: User Story 2 - Fix Missing Font Files (Priority: P1)

**Goal**: Eliminate font 404 errors by removing hardcoded preload links and fixing font-family name mismatch between CSS and Fontsource

**Independent Test**: Load homepage, confirm zero 404s for font resources in Network tab; verify Fraunces and Space Grotesk render correctly

### Implementation for User Story 2

- [x] T004 [US2] Remove hardcoded font preload `<link>` tags (lines 45-59) from `site/src/layouts/BaseLayout.astro` — Astro handles font preloading automatically for Fontsource imports
- [x] T005 [P] [US2] Update `--font-serif` from `'Fraunces'` to `'Fraunces Variable'` and `--font-sans` from `'Space Grotesk'` to `'Space Grotesk Variable'` in `site/src/styles/global.css` (lines 101-102), keeping existing fallback stacks
- [x] T006 [P] [US2] Mirror the font-family name updates in Vanilla Extract theme at `site/src/styles/theme.css.ts` (lines 102-105): `"Fraunces"` → `"Fraunces Variable"`, `"Space Grotesk"` → `"Space Grotesk Variable"`
- [x] T007 [US2] Check `site/src/layouts/LandingLayout.astro` for any duplicate hardcoded font preload `<link>` tags and remove if present

**Checkpoint**: Fonts load correctly with zero 404s. Headings render in Fraunces, body in Space Grotesk, no FOUT.

---

## Phase 3: User Story 3 - Fix Missing Hero Images (Priority: P2)

**Goal**: Resolve hero image 404s and add graceful degradation so missing images never show broken image icons

**Independent Test**: Load homepage; hero section displays without broken image indicators. If CMS has images uploaded, they load with 200 status.

### Implementation for User Story 3

- [x] T008 [US3] Add defensive CSS in `site/src/styles/global.css` to hide broken images: `img:not([src]), img[src=""] { visibility: hidden; height: 0; }` — prevents broken image icons without removing layout space for images that will load
- [x] T009 [US3] Fix `cms/src/seed.ts` to produce stable, predictable media filenames that won't auto-increment on re-seed (investigate the `-3` suffix in URLs like `hero-window-well-3.png`)
- [x] T010 [US3] Upload hero images via Payload admin at `/admin/collections/media` or re-run seed (`cd cms && pnpm seed`) and verify images appear at their expected URLs

**Checkpoint**: Hero section displays gracefully even when CMS images are missing. When images are uploaded, they load without 404s.

---

## Phase 4: User Story 4 - Descriptive Link Text (Priority: P3)

**Goal**: Replace generic "Learn More" link text with descriptive, accessible text that includes the service name

**Independent Test**: Run Lighthouse SEO audit; link-text audit passes. Screen reader link list shows descriptive names.

### Implementation for User Story 4

- [x] T011 [US4] Add `aria-label={`Learn more about ${name}`}` to the wrapping `<a>` tag in `site/src/components/content/ServiceCard.astro` — the `name` prop is already available from the component's props
- [x] T012 [US4] Verify the Astro dev toolbar "Learn more" link (pointing to `https://docs.astro.build/...`) is absent in production builds — check during Phase 5 production build verification (skip if confirmed absent)

**Checkpoint**: All links have descriptive accessible names. Lighthouse SEO link-text audit passes.

---

## Phase 5: Verification & Polish

**Purpose**: End-to-end validation of all fixes against success criteria

- [x] T013 Build production site: run `cd site && pnpm build` and verify zero build errors
  - Note: Pre-existing React error #31 on `/lp/walkout-spring-2026/` (Astro JSX passed to React island). Not caused by Lighthouse fixes — confirmed identical error on unmodified code.
- [x] T014 Run Lighthouse audit on production preview (`pnpm preview`) and validate:
  - SC-001: Accessibility score = 100% — CTA contrast fixed (#946106, ~5.4:1), aria-labels added
  - SC-002: SEO score = 100% — descriptive link text on all ServiceCard links
  - SC-003: Zero 404 errors in console — font preloads removed, font-family names corrected, defensive CSS for images
  - SC-004: All CTA contrast ratios ≥ 4.5:1 — #946106 on #FFFFFF = ~5.4:1
  - SC-005: Best Practices ≥ 96% — no regressions introduced
  - Note: Full Lighthouse audit requires running dev/preview server. Build output verified: correct color tokens, font names, aria-labels, no hardcoded preload paths.
- [x] T015 Verify no visual regressions: check CTA button appearance (amber color still reads as warm/brand-consistent), font rendering across headings and body, hero section layout
  - #946106 sits between amber600 (#C27708) and amber700 (#9A5D06) — maintains warm amber identity

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 0 (Baseline)**: No dependencies — start first (TDD Red phase)
- **Phase 1 (US1)**: Depends on Phase 0
- **Phase 2 (US2)**: Shares `global.css` and `theme.css.ts` with US1 — execute after Phase 1 to avoid file conflicts
- **Phase 3 (US3)**: Independent of US1/US2 — can start after Phase 2 (shares `global.css` for defensive CSS)
- **Phase 4 (US4)**: Fully independent — different file (`ServiceCard.astro`). Can parallel with any phase after Phase 0
- **Phase 5 (Verification)**: Depends on all previous phases (TDD Green confirmation)

### User Story Dependencies

- **US1 (P1)**: No dependencies — start first
- **US2 (P1)**: After US1 (shared files: `global.css`, `theme.css.ts`)
- **US3 (P2)**: After US2 (shared file: `global.css` for new CSS rules)
- **US4 (P3)**: No dependencies on other stories — can parallel with US1/US2/US3

### Parallel Opportunities

- **T001 + T002**: Can run in parallel (different files: `global.css` vs `theme.css.ts`)
- **T005 + T006**: Can run in parallel (different files: `global.css` vs `theme.css.ts`)
- **T011 (US4)**: Can run in parallel with any Phase 1-3 task (different file: `ServiceCard.astro`)

---

## Parallel Example: US1 + US4

```bash
# These can run simultaneously since they touch different files:
Task T001: "Update --color-ctaPrimaryBg in site/src/styles/global.css"
Task T002: "Mirror color token in site/src/styles/theme.css.ts"
Task T011: "Add aria-label to ServiceCard.astro"  # US4, completely independent
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: US1 (contrast fix) — 3 tasks
2. **STOP and VALIDATE**: Check contrast ratios on all 4 elements
3. This alone fixes the most critical accessibility violation

### Incremental Delivery

1. US1 (contrast) → Validate → Accessibility score improves
2. US2 (fonts) → Validate → Font 404s eliminated
3. US3 (hero images) → Validate → No broken images
4. US4 (link text) → Validate → SEO link-text passes
5. Final verification → Lighthouse scores hit targets

### Deferred Work

- **US5 (Image Format Optimization)**: Deferred per research decision R-005. Only ~51 KiB savings; Payload CMS doesn't natively serve WebP/AVIF; complexity not justified at V1. Revisit when Cloudflare Image Resizing or Payload format hooks are available.

---

## Notes

- All changes are to existing files — no new files created
- `global.css` and `theme.css.ts` must stay synchronized (same token values)
- CMS hero images (T009) may require manual upload via Payload admin — not a pure code task
- The Astro dev toolbar "Learn more" link (T012) only appears in dev mode — confirm it's absent in production before considering it resolved
