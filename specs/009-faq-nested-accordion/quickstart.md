# Quickstart: FAQ Nested Accordion

**Branch**: `009-faq-nested-accordion` | **Date**: 2026-03-25

## Overview

Transform the FAQ page from separate sections per category into a single nested accordion. Outer `<details>` elements represent categories; inner `<details>` elements represent individual questions.

## Files to Modify

| File | Action | Purpose |
|------|--------|---------|
| `site/src/pages/faq.astro` | Modify | Replace multi-section layout with single accordion container |
| `site/src/components/content/FAQ.astro` | Modify | Remove `name` attribute from `<details>` (allow multi-open) |

## Files to Create

| File | Purpose |
|------|---------|
| `site/src/components/content/FAQCategory.astro` | Outer accordion: category-level `<details>` wrapping inner FAQ items |

## Key Decisions

1. **Native `<details>` nesting** — no JavaScript accordion library needed
2. **No `name` attribute** on either level — allows multiple categories and questions open simultaneously
3. **Existing data flow unchanged** — same `fetchFAQs()` → group by category → render
4. **JSON-LD schema unaffected** — still uses flat FAQ list regardless of page structure

## Architecture

```
faq.astro (page)
└── Single accordion container
    ├── FAQCategory (category="cost", label="Cost & Pricing")
    │   └── FAQ (inner questions)
    │       ├── <details> Question 1
    │       ├── <details> Question 2
    │       └── <details> Question 3
    ├── FAQCategory (category="code-compliance", label="Code Compliance")
    │   └── FAQ (inner questions)
    │       └── ...
    └── ... (3 more categories)
```

## Dev Commands

```bash
cd site
pnpm dev          # Start dev server
pnpm build        # Static build (verify no errors)
```

## Verification Checklist

- [ ] All 5 categories render as collapsible outer accordions
- [ ] Clicking a category reveals its nested questions
- [ ] Questions expand/collapse independently within an open category
- [ ] Multiple categories can be open at the same time
- [ ] Multiple questions within a category can be open at the same time
- [ ] Collapsing a category hides all its nested content
- [ ] Keyboard navigation works (Tab + Enter/Space)
- [ ] Category headers are visually distinct from question headers
- [ ] Mobile: tap targets are at least 48px, no horizontal scroll
- [ ] No-JS fallback: disable JavaScript, all content is accessible
- [ ] JSON-LD FAQPage schema still present and valid in page source
