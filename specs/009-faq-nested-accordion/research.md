# Research: FAQ Nested Accordion

**Branch**: `009-faq-nested-accordion` | **Date**: 2026-03-25

## R1: Nested `<details>` Element Support

**Decision**: Use native HTML `<details>/<summary>` elements nested two levels deep (category > question).

**Rationale**: Native `<details>` elements are supported in all modern browsers (Chrome 12+, Firefox 49+, Safari 6+, Edge 79+). Nesting `<details>` inside `<details>` is valid HTML and works without JavaScript. The existing FAQ component already uses this pattern for the question level — adding an outer `<details>` wrapper per category is a natural extension. This guarantees progressive enhancement: if JS fails, all content is still accessible (browsers render `<details>` as expanded by default when the `open` attribute is absent, or collapsed when scripted).

**Alternatives considered**:
- JavaScript-based accordion (e.g., React state): Rejected — adds JS bundle weight, breaks no-JS fallback, contradicts existing pattern
- CSS-only accordion with `:target` or checkbox hack: Rejected — poor accessibility, no keyboard support, complex state management
- `<details>` with `name` attribute for exclusive behavior: Rejected for top-level — spec requires multiple categories open simultaneously. The `name` attribute on inner questions was evaluated but rejected since FR-005 requires multiple questions open simultaneously too.

## R2: Accessibility for Nested Accordions

**Decision**: Use ARIA roles implicitly provided by `<details>/<summary>` elements, plus `aria-expanded` visual cues via CSS `[open]` selector.

**Rationale**: Native `<details>/<summary>` provides built-in keyboard support (Tab, Enter, Space) and screen reader announcements. WAI-ARIA 1.2 recognizes `<details>` as a disclosure widget. No additional ARIA attributes are needed when using native elements. The two-level nesting doesn't change the accessibility model — each level operates independently.

**Alternatives considered**:
- Custom `role="tree"` / `role="treeitem"`: Rejected — overkill for two-level FAQ, adds complexity, native `<details>` already handles disclosure semantics
- `role="tablist"` for categories: Rejected — tabs imply exclusive selection, not compatible with multiple-open requirement

## R3: Visual Hierarchy Between Levels

**Decision**: Differentiate category-level and question-level accordions through:
1. Category headers: larger font (serif, `--font-serif`), navy background strip, bolder weight
2. Question headers: current style (sans-serif, `--font-sans`), standard weight, indented within category
3. Category chevron: larger, different position or style than question chevron

**Rationale**: The spec requires (FR-009) that top-level categories are visually distinct from nested questions. Using the existing design tokens (serif vs. sans, navy vs. neutral backgrounds) creates clear hierarchy without new design elements.

**Alternatives considered**:
- Color-coded categories: Rejected — adds visual noise, doesn't match existing site palette approach
- Numbered or icon-prefixed categories: Rejected — unnecessary complexity for 5 categories

## R4: Page Structure Change

**Decision**: Replace the current multi-section layout (one `<section>` per category with `<h2>` headings) with a single section containing one nested accordion component.

**Rationale**: The current layout renders each category as a full-width page section with alternating backgrounds. The nested accordion spec requires all categories within a single interactive component. The hero, empty state, and final CTA sections remain unchanged. JSON-LD schema generation is unaffected since it uses a flat FAQ list regardless of page structure.

**Alternatives considered**:
- Keep separate sections with collapsible category headers: Rejected — doesn't match the "accordion within accordion" requirement; categories as full sections can't collapse
- Tabs for categories + accordion for questions: Rejected — tabs hide content from search engines and break progressive enhancement

## R5: `name` Attribute on `<details>`

**Decision**: Do NOT use the `name` attribute on either level of `<details>`.

**Rationale**: The HTML `name` attribute on `<details>` creates an exclusive accordion (only one `<details>` with the same `name` can be open at a time within its parent). FR-004 requires multiple categories open simultaneously, and FR-005 requires multiple questions open simultaneously. Therefore, neither level should use the `name` attribute.

**Note**: The existing `FAQ.astro` component currently uses `name={id}` on its `<details>` elements, which makes questions mutually exclusive within a category. This must be removed to comply with FR-005.

**Alternatives considered**:
- Keep `name` for questions within a category (exclusive within category): Rejected — FR-005 explicitly requires multiple questions open simultaneously
