# Implementation Plan: FAQ Nested Accordion

**Branch**: `009-faq-nested-accordion` | **Date**: 2026-03-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-faq-nested-accordion/spec.md`

## Summary

Transform the existing FAQ page from a flat, section-per-category layout into a single nested accordion where top-level categories expand to reveal inner question/answer accordions. The current page already uses native `<details>` elements and fetches FAQ data from Payload CMS with fallback content — this feature restructures the rendering without changing the data layer.

## Technical Context

**Language/Version**: TypeScript 5.8.3, Astro 5.7.10
**Primary Dependencies**: Astro (static site generator), Vanilla Extract (design tokens), Payload CMS (FAQ data source)
**Storage**: Payload CMS (read-only via `fetchFAQs()`), fallback static data in `faq.astro`
**Testing**: Playwright (browser testing), Vitest (unit testing)
**Target Platform**: Static HTML deployed to Cloudflare Pages
**Project Type**: Static website (Astro)
**Performance Goals**: All FAQ content rendered at build time, zero JS required for core accordion behavior
**Constraints**: Must use native HTML `<details>/<summary>` for progressive enhancement (no-JS fallback), must preserve existing FAQPage JSON-LD schema
**Scale/Scope**: 5 categories, ~11 FAQ items (expandable via CMS)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution is a blank template — no project-specific gates defined. Proceeding with standard quality gates:

- [x] No new dependencies required
- [x] Feature uses existing data structures and CMS integration
- [x] Progressive enhancement preserved (native `<details>` elements)
- [x] No JavaScript framework needed for accordion behavior

## Project Structure

### Documentation (this feature)

```text
specs/009-faq-nested-accordion/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
site/src/
├── pages/
│   └── faq.astro                          # MODIFY — restructure from flat sections to single nested accordion
├── components/
│   └── content/
│       ├── FAQ.astro                      # MODIFY — add category-level wrapper with nested details
│       └── FAQCategory.astro              # NEW — top-level category accordion that wraps FAQ items
└── styles/
    └── (existing design tokens — no changes)
```

**Structure Decision**: Minimal changes — modify existing `faq.astro` page to render a single unified accordion instead of separate sections. Create one new component (`FAQCategory.astro`) for the outer accordion level. The existing `FAQ.astro` component continues to render the inner question-level accordions with minimal modification.

## Complexity Tracking

No violations to justify — this is a straightforward UI restructuring using existing patterns and native HTML elements.
