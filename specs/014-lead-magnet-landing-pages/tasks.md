# Tasks: Lead Magnet Dedicated Landing Pages

**Input**: Design documents from `/specs/014-lead-magnet-landing-pages/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, quickstart.md

**Tests**: Not explicitly requested in the spec. Test tasks included in Polish phase for verification.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Create directory structure for new files

- [x] T001 Create `site/src/pages/guides/` directory for guide landing page routes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: CMS schema extension and data fetching that MUST be complete before any user story can be implemented

**Why blocking**: US1 needs the new CMS fields and fetch function to render landing pages. US2 needs the slug field to generate URLs. US3 is the CMS admin experience of these fields.

- [x] T002 Add `coverImage` upload field (relationTo: 'media', optional) to LeadMagnets collection in `cms/src/collections/LeadMagnets.ts` — placed in a "Landing Page Content" admin group after `thumbnailImage`, with admin description "Front cover image of the PDF guide for the landing page"
- [x] T003 Add `benefits` richText field (Lexical, optional) to LeadMagnets collection in `cms/src/collections/LeadMagnets.ts` — placed in the same "Landing Page Content" admin group, with admin description "Benefits/highlights shown on the landing page"
- [x] T004 Add `fetchLeadMagnet(slug: string)` function to `site/src/lib/payload.ts` — queries `lead-magnets?where[slug][equals]=${slug}&where[status][equals]=published&depth=1`, returns single lead magnet with coverImage and benefits populated, with try/catch returning null on failure

**Checkpoint**: CMS admin panel shows new fields on LeadMagnets. `fetchLeadMagnets()` returns objects with `coverImage` and `benefits` fields. Foundation ready for user story implementation.

---

## Phase 3: User Story 1 — Visitor Downloads Guide from Dedicated Landing Page (Priority: P1) MVP

**Goal**: Each published lead magnet has a dedicated landing page at `/guides/[slug]` with PDF cover image, benefits description, and email capture form.

**Independent Test**: Navigate to `/guides/walkout-basements-guide`, see cover image + benefits + form. Submit email, receive download link.

### Implementation for User Story 1

- [x] T005 [P] [US1] Create Vanilla Extract styles for guide landing page in `site/src/styles/guide.css.ts` — two-column layout (cover image left, benefits + form right), stacks vertically on mobile, uses project design tokens (navy/green palette, Fraunces + Space Grotesk fonts, fluid type scale from typography.css.ts)
- [x] T006 [US1] Create `site/src/layouts/GuideLayout.astro` wrapping BaseLayout — hero section with guide title + description (overline "FREE RESOURCE"), two-column body with cover image and benefits (serialized from Lexical JSON via `serialize-lexical.ts`) + LeadMagnetForm (client:idle hydration), graceful degradation when coverImage or benefits are missing, SEO meta tags (title, description, og:image from coverImage)
- [x] T007 [US1] Create dynamic route `site/src/pages/guides/[slug].astro` — `getStaticPaths()` calls `fetchLeadMagnets()` to generate a page per published lead magnet, passes full lead magnet object as props to GuideLayout, includes JSON-LD schema markup for the guide resource

**Checkpoint**: Visiting `/guides/[slug]` shows a complete landing page with cover image, benefits, and working email form. Form submission triggers `lead_magnet_submit` GA4 event and shows download link.

---

## Phase 4: User Story 2 — Service Page Links to Lead Magnet Landing Page (Priority: P2)

**Goal**: Service page "Download Free Guide" CTA links to the dedicated landing page. Inline form removed from service pages.

**Independent Test**: Visit `/services/walkout-basements`, click "Download Free Guide" button, verify navigation to `/guides/walkout-basements-guide`. Confirm no inline form visible on service page.

### Implementation for User Story 2

- [x] T008 [US2] Add optional `landingPageUrl` prop to `site/src/components/content/LeadMagnetCTA.astro` — when provided, button `href` points to the URL instead of `#lead-magnet-${leadMagnetId}`. When omitted, falls back to anchor link (backward compatible). Update Props interface accordingly.
- [x] T009 [US2] Update `site/src/layouts/ServiceLayout.astro` — remove the `<div id="lead-magnet-{id}">` form wrapper and `<LeadMagnetForm>` component. Remove the `LeadMagnetForm` import. Pass `landingPageUrl={"/guides/" + service.leadMagnet.slug}` to LeadMagnetCTA. Keep the "Not ready to schedule yet?" section with the CTA card.
- [x] T010 [P] [US2] Update hardcoded lead magnet fallback in `site/src/pages/services/walkout-basements.astro` — add `slug: 'walkout-basements-guide'` to the hardcoded `service.leadMagnet` object so URL generation works without CMS
- [x] T011 [P] [US2] Check `site/src/pages/services/retaining-walls.astro` for hardcoded lead magnet data — if present, add `slug` field. If no lead magnet data exists, skip.

**Checkpoint**: Service pages show the CTA card linking to `/guides/[slug]`. No inline form is rendered. Clicking the button navigates to the guide landing page.

---

## Phase 5: User Story 3 — CMS Admin Manages Landing Page Content (Priority: P3)

**Goal**: CMS admin can configure cover image and benefits content for each lead magnet through the admin panel.

**Independent Test**: Log into CMS admin, edit a lead magnet, upload a cover image, enter benefits in rich text editor, save, rebuild site, verify landing page reflects changes.

### Implementation for User Story 3

- [x] T012 [US3] Update CMS seed data (if seed script exists) or create test data manually — add sample `coverImage` and `benefits` content to existing lead magnet entries so landing pages render with full content during development. Document the seed process in `specs/014-lead-magnet-landing-pages/quickstart.md` if needed.

**Checkpoint**: CMS admin panel shows "Landing Page Content" group with coverImage upload and benefits rich text editor. Saving and rebuilding produces updated landing pages.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Updates that affect multiple user stories and final validation

- [x] T013 [P] Update `site/src/pages/blog/[...slug].astro` — when rendering `<LeadMagnetCTA>` for a blog post's `leadMagnetCTA` relationship, pass `landingPageUrl={"/guides/" + leadMagnet.slug}` so blog CTAs link to the dedicated landing page instead of nowhere
- [x] T014 [P] Verify Astro build completes without CMS running — ensure `getStaticPaths()` in `site/src/pages/guides/[slug].astro` handles CMS-unreachable case gracefully (returns empty array, no build error), per Constitution Principle I
- [x] T015 Run `pnpm build` and verify all pages generate correctly — check `/guides/` pages exist in `site/dist/`, service pages have updated CTA links, no broken links in output

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational (T002-T004) — core landing page
- **US2 (Phase 4)**: Depends on US1 completion (landing pages must exist for CTAs to link to)
- **US3 (Phase 5)**: Depends on Foundational (T002-T003) — CMS fields must exist
- **Polish (Phase 6)**: Depends on US1 and US2 completion

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational only — can start immediately after Phase 2
- **US2 (P2)**: Depends on US1 — CTA links point to landing pages that must exist
- **US3 (P3)**: Depends on Foundational only — can run in parallel with US1 if desired

### Within Each User Story

- T005 (styles) can run in parallel with other setup but must complete before T006 (layout)
- T006 (layout) must complete before T007 (route page)
- T008 (CTA prop) must complete before T009 (ServiceLayout update)
- T010 and T011 can run in parallel (different service page files)

### Parallel Opportunities

- T002 and T003 can run in parallel (same file but different field additions — or sequential if preferred)
- T005 can run in parallel with T004 (different workspaces: site/styles vs site/lib)
- T010 and T011 can run in parallel (different service page files)
- T013 and T014 can run in parallel (different files, independent concerns)
- US3 can run in parallel with US1 (different workspaces: CMS admin vs site frontend)

---

## Parallel Example: User Story 1

```bash
# After Foundational phase completes:

# Step 1: Styles + data fetching in parallel
Task T004: "Add fetchLeadMagnet(slug) to site/src/lib/payload.ts"
Task T005: "Create guide.css.ts in site/src/styles/"

# Step 2: Layout (depends on T005 styles)
Task T006: "Create GuideLayout.astro in site/src/layouts/"

# Step 3: Route page (depends on T004 fetch + T006 layout)
Task T007: "Create [slug].astro in site/src/pages/guides/"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001)
2. Complete Phase 2: Foundational (T002-T004)
3. Complete Phase 3: User Story 1 (T005-T007)
4. **STOP and VALIDATE**: Visit `/guides/[slug]`, verify cover image + benefits + form
5. Deploy/demo if ready — lead magnet landing pages are live

### Incremental Delivery

1. Setup + Foundational → CMS fields ready, fetch function available
2. Add US1 → Guide landing pages live → Deploy (MVP!)
3. Add US2 → Service pages link to guides, inline forms removed → Deploy
4. Add US3 → Seed data, admin workflow verified → Deploy
5. Polish → Blog CTAs updated, build verification, testing → Deploy

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- The existing `LeadMagnetForm.tsx` and `submitLeadMagnet` action are reused unchanged — no form tasks needed
- The existing `serialize-lexical.ts` handles Lexical JSON → HTML — reuse in GuideLayout for benefits rendering
- Hardcoded fallback data on service pages (Constitution Principle I) must include `slug` for URL generation
- Total: 15 tasks across 6 phases
