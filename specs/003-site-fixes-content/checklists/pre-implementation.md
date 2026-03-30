# Pre-Implementation Sanity Check: Site Fixes & Content Updates

**Purpose**: Validate that all requirements are sufficiently specified to begin implementation without ambiguity or blocked decisions
**Created**: 2026-03-24
**Feature**: [spec.md](../spec.md) | [plan.md](../plan.md)
**Audience**: Author (pre-coding gate)
**Status**: All items resolved — ready for implementation

## Requirement Clarity

- [x] CHK001 - Is the CTA "launch" interaction pattern defined — does clicking open a modal, scroll to an in-page form, or navigate to a new page? [Clarity, Spec §FR-001] → **Resolved: Smooth-scroll to in-page form. MultiStepForm rendered on every page via BaseLayout. Highest conversion pattern (keeps user on page).**
- [x] CHK002 - Is a single canonical phone number display format specified, or are both "(888) 414-0007" and "1-888-414-0007" intentionally allowed? [Clarity, Spec §FR-002] → **Resolved: Canonical format is `(888) 414-0007`. Updated FR-002.**
- [x] CHK003 - Is the Gallery page fallback behavior defined — redirect to homepage OR return 404? Acceptance scenario allows either. [Ambiguity, Spec §FR-006 / US5-2] → **Resolved: Remove from nav when `showGallery` false. Direct URL returns 404. Updated FR-006.**
- [x] CHK004 - Is "expandable answer content" in the FAQ section defined with a specific interaction pattern (e.g., native `<details>/<summary>`, JS accordion, always-visible)? [Clarity, Spec §FR-007] → **Resolved: Native `<details>/<summary>` (per constitution Art. XIII, already used in FAQ.astro).**
- [x] CHK005 - Are the footer column groupings explicitly specified — which content blocks go in which columns? [Clarity, Spec §FR-008] → **Resolved: Brand/address column + Services, Company, Resources columns (matches CMS footerNav). Updated FR-008.**
- [x] CHK006 - Is the footer tablet breakpoint behavior (768px–1024px) defined beyond "adapts appropriately"? [Ambiguity, Spec §US6-3] → **Resolved: 2-column layout. Added FR-008a.**

## Requirement Completeness — New Service Pages

- [x] CHK007 - Are URL slugs defined for the new service pages (e.g., `/services/pavers-hardscapes`, `/services/artificial-turf`)? [Gap, Spec §FR-010/FR-011] → **Resolved: Match existing pattern — `/services/{slug}`. Slugs: `pavers-hardscapes`, `artificial-turf`.**
- [x] CHK008 - Are content briefs or keyword targets specified for new service page copy, or is the author expected to research and write from scratch? [Gap, Spec §FR-010/FR-011] → **Resolved: Research and write at implementation time, matching existing page depth/style.**
- [x] CHK009 - Are image/icon requirements defined for the new service cards in the Specialized Services section? [Gap, Spec §FR-010/FR-011] → **Resolved: Match existing pattern (ServiceCard.astro uses CMS `image` field from Services collection).**
- [x] CHK010 - Is the display order of services in the Specialized Services section specified (existing 3 first, then new 2? Alphabetical? CMS-driven)? [Gap, Spec §FR-010/FR-011] → **Resolved: CMS-driven (existing pattern — Services collection has `sortOrder` or position-based rendering).**
- [x] CHK011 - Are SEO meta titles and descriptions specified for the two new service pages? [Gap] → **Resolved: Match existing pattern (seed data includes `seo.metaTitle` and `seo.metaDescription`).**
- [x] CHK012 - Are breadcrumb requirements defined for new service pages? [Gap] → **Resolved: No breadcrumbs — none exist on current service pages. Not in scope.**
- [x] CHK013 - Do the new service pages require JSON-LD structured data (plan mentions it, spec does not)? [Consistency, Plan §Project Structure vs Spec] → **Resolved: Yes — ServiceLayout auto-generates JSON-LD via `generateServiceSchema()` and `generateFAQPageSchema()`. No additional work needed.**

## Requirement Completeness — FAQ Expansion

- [x] CHK014 - Is the methodology for "sourced from Google search research" defined — who runs the queries, how are questions selected, what qualifies as a valid source? [Clarity, Spec §FR-012] → **Resolved: Author researches Google "People Also Ask" + related queries at implementation time. Selects relevant questions. Added to spec clarifications.**
- [x] CHK015 - Does "at least 3 additional questions" per service page apply to existing pages only, or also to the two new service pages (which have no "original set")? [Ambiguity, Spec §SC-009] → **Resolved: New service pages start fresh with research-sourced FAQs (no "original set" concept). SC-009 applies to existing pages. New pages should have ≥5 FAQs total to match existing page depth.**

## Requirement Consistency

- [x] CHK016 - Is the reviews hiding mechanism consistent — CSS `display:none` (content still in DOM/crawlable) vs. conditional rendering (content absent from HTML)? SEO implications differ. [Consistency, Spec §FR-005/FR-013] → **Resolved: Conditional render — content NOT in DOM when `showReviews` is false. Updated FR-005.**
- [x] CHK017 - Does hiding the Gallery page also remove it from the XML sitemap? Edge cases mention this but no FR covers it. [Gap, Spec §Edge Cases vs FR-006] → **Resolved: Added FR-006a — Gallery excluded from sitemap when `showGallery` is false.**
- [x] CHK018 - Are the CMS toggle field names (`showReviews`, `showGallery`) confirmed, or are they suggestions? Does the data model document align? [Consistency, Spec §FR-013 vs data-model.md] → **Resolved: Fields do NOT exist yet in SiteSettings.ts. Must be created. Names `showReviews` and `showGallery` are confirmed.**

## Edge Case Coverage

- [x] CHK019 - Is the CTA form failure fallback specified — what happens if the form component fails to load (JS error, slow connection)? Edge cases mention it but no FR or acceptance scenario defines the behavior. [Gap, Spec §Edge Cases vs FR-001] → **Resolved: Acceptable risk. Form is a React Island with `client:load`. If JS fails, the anchor link `#estimate-form` simply won't scroll to anything meaningful. Edge case documented but no fallback mechanism required — the form loads reliably.**
- [x] CHK020 - Are requirements defined for what happens when a visitor lands on a hidden Gallery page via an external link or bookmark (not just direct URL entry)? [Coverage, Spec §FR-006] → **Resolved: 404 for all access methods when `showGallery` is false (FR-006 updated).**
- [x] CHK021 - Is the behavior defined for service pages when FAQ content is empty in the CMS (zero FAQ items)? [Edge Case, Gap] → **Resolved: Existing pattern handles this — ServiceLayout conditionally renders FAQ section only when `faqItems.length > 0`. No change needed.**
- [x] CHK022 - Are requirements defined for phone number display in structured data (JSON-LD) vs. visible text vs. tel: link — all three must be consistent? [Coverage, Gap] → **Resolved: All use canonical `(888) 414-0007` for display and `+18884140007` for tel:/JSON-LD. SiteSettings `phone` field is the single source of truth.**

## Acceptance Criteria Quality

- [x] CHK023 - Can SC-006 "3-4 columns" be objectively verified — is the exact column count specified or is either acceptable? [Measurability, Spec §SC-006] → **Resolved: 4 columns on desktop (brand + 3 nav groups from CMS). 2 columns on tablet. 1 column on mobile. Matches current footer structure.**
- [x] CHK024 - Can SC-009 "sourced from real search data" be objectively verified — what evidence is required? [Measurability, Spec §SC-009] → **Resolved: Author attestation. Questions must come from Google PAA/related queries. No formal evidence artifact required.**
- [x] CHK025 - Are acceptance scenarios defined for the CMS admin toggling reviews/Gallery back ON — not just the hidden state? [Coverage, Spec §US4-3/US5-3] → **Resolved: US4-3 and US5-3 already cover the re-enable scenario.**

## Dependencies & Assumptions

- [x] CHK026 - Is the assumption "FAQ answer content may still exist in the CMS" validated — has anyone checked whether the content is present in D1 or was lost? [Assumption, Spec §Assumptions] → **Resolved: Confirmed. Seed data (`cms/src/seed.ts` lines 303-324) includes full Lexical JSON answer content for all 8 FAQ entries. Updated spec assumption.**
- [x] CHK027 - Is the Lexical JSON → HTML serialization approach confirmed as the right fix (vs. fixing CMS output format or using Payload's built-in serializer)? [Assumption, Plan §R-002] → **Resolved: No built-in Payload serializer exists. Current code does brittle manual text extraction. Custom `serialize-lexical.ts` is the correct approach.**
- [x] CHK028 - Are the existing three service page `.astro` files confirmed to share a common `ServiceLayout.astro`, or do any have custom layouts that need separate fixes? [Assumption, Plan §Project Structure] → **Resolved: All 3 service pages import and use `ServiceLayout.astro` identically. Single fix point.**

## Notes

- All 28 items resolved. Spec updated with clarifications and refined FRs.
- No blockers for implementation. Proceed to `/speckit.tasks`.
