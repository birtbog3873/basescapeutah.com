# Data Model: FAQ Nested Accordion

**Branch**: `009-faq-nested-accordion` | **Date**: 2026-03-25

## Entities

### FAQ Category

Represents a top-level grouping of FAQ items displayed as the outer accordion level.

| Field | Type | Description |
|-------|------|-------------|
| key | string | Machine-readable identifier (e.g., `cost`, `code-compliance`) |
| label | string | Human-readable display name (e.g., "Cost & Pricing") |
| displayOrder | number | Implicit via `categoryOrder` array position |
| items | FAQItem[] | Collection of question-answer pairs in this category |

**Source**: Defined in `faq.astro` as `categoryLabels` map and `categoryOrder` array. Not a CMS entity — categories are derived from the `category` field on individual FAQ items.

### FAQ Item

An individual question-answer pair belonging to a single category.

| Field | Type | Description |
|-------|------|-------------|
| question | string | The FAQ question text |
| answer | string | HTML string of the answer content |
| category | string | Category key this item belongs to (e.g., `cost`, `timeline`) |
| sortOrder | number | Display order within the category |

**Source**: Fetched from Payload CMS via `fetchFAQs()` with hardcoded fallback data. The `answer` field may be a rich text object from CMS, converted via `richTextToString()`.

## Relationships

```
FAQ Category 1──* FAQ Item
  (category key)    (category field)
```

- One category contains zero or more FAQ items
- Each FAQ item belongs to exactly one category
- Categories with no items are filtered out before rendering
- Display order: categories follow `categoryOrder` array; items follow `sortOrder` within category

## Data Flow (unchanged)

```
Payload CMS → fetchFAQs() → rawFaqs[] → grouped{} by category → categories[] (filtered, ordered)
                                ↓
                        richTextToString()
                                ↓
                    { question, answer } pairs per category
```

No changes to the data model are required. The nested accordion is purely a rendering change — the same grouped FAQ data feeds into a new component structure instead of flat sections.

## State Transitions

Accordion items have two visual states managed entirely by the browser via the native `<details>` element:

| State | Trigger | Visual |
|-------|---------|--------|
| Collapsed (default) | Page load / user clicks open item | Content hidden, chevron pointing down |
| Expanded | User clicks collapsed item | Content visible, chevron rotated 180° |

Both levels (category and question) follow the same state model independently. No application state management required.
