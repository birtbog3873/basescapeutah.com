# Research: Site Fixes & Content Updates

**Branch**: `003-site-fixes-content` | **Date**: 2026-03-24

## R-001: CTA Button Not Working — Root Cause

**Decision**: The "Get Free Estimate" button is broken because `MultiStepForm.tsx` (with `id="estimate-form"`) is only rendered inside `LandingLayout.astro`. Regular pages (`BaseLayout.astro`, `ServiceLayout.astro`) do not include the form component, so the `href="#estimate-form"` anchor links have no target.

**Rationale**:
- `CTABlock.astro` defaults `estimateUrl = '#estimate-form'` (line 12)
- `MultiStepForm.tsx` renders with `id="estimate-form"` (line 155/176)
- `LandingLayout.astro` renders `<MultiStepForm client:load />` (line 144-153)
- `BaseLayout.astro` does NOT include MultiStepForm — only Header, Footer, MobileBottomBar
- Result: on homepage, service pages, about, etc., clicking the CTA scrolls nowhere

**Fix approach**: Add `<MultiStepForm client:load />` to `BaseLayout.astro` so the form is available as a scroll target on all regular pages. This maintains the Astro Island pattern (selective hydration per Art. I §2) since `MultiStepForm` is already a React component with `client:load`.

**Alternatives considered**:
- Modal overlay approach: More complex, requires new UI pattern. Rejected — anchor scroll to embedded form is simpler and already the intended pattern.
- Separate `/estimate` page: Adds navigation friction, violates Art. V (conversion architecture wants form accessible immediately). Rejected.

## R-002: FAQ Answers Disappeared — Root Cause

**Decision**: The "Your Questions, Answered" section in `ServiceLayout.astro` uses the Anxiety Stack fields (structuralSafety, codeCompliance, etc.), not the FAQ accordion. When CMS is connected, Payload's Lexical richText editor returns JSON objects, but the rendering logic (`typeof content === 'string' ? content : ''`) only handles plain HTML strings.

**Rationale**:
- `ServiceLayout.astro` line 126: `<h2>Your Questions, Answered</h2>` — this is the Anxiety Stack section, not the FAQ accordion
- Line 129-134: Each anxiety field checks `if (!content) return null`, then renders via `set:html={typeof content === 'string' ? content : ''}`
- When CMS returns Lexical JSON (an object), `typeof content === 'string'` is `false`, so it renders `''` (empty string)
- The fallback data in service pages (e.g., `walkout-basements.astro`) uses plain HTML strings, which work — but only when CMS is unavailable
- The same issue exists for `service.overview` (line 96), `step.stepDescription` (line 112-113), and `service.differentiator` (line 149-150)

**Fix approach**: Create a `serializeLexical(node)` utility in `src/lib/` that converts Payload's Lexical JSON to HTML strings. Apply it to all richText rendering points in ServiceLayout.astro (and anywhere else richText from CMS is used with `set:html`).

**Alternatives considered**:
- Configure Payload to output HTML instead of Lexical JSON: Payload 3.x uses Lexical natively; switching output format isn't straightforward without custom hooks. Rejected.
- Use `@payloadcms/richtext-lexical` serializer on the frontend: This adds a dependency and complexity. A lightweight custom serializer is simpler for the node types we use. Preferred.

## R-003: Footer Multi-Column Layout

**Decision**: The footer CSS at `Footer.astro` line 117-121 already has a 768px breakpoint for multi-column: `grid-template-columns: 1.5fr repeat(auto-fit, minmax(160px, 1fr))`. The issue may be that CMS navigation data isn't loading (empty `footerNav` array), or the `auto-fit` is collapsing because columns don't have enough content.

**Rationale**:
- The CSS pattern looks correct for 4-column layout (brand + 3 nav groups)
- The spec requires 1024px+ for desktop multi-column — current breakpoint is 768px (more aggressive, which is fine)
- If CMS nav data loads correctly, this should already work
- Need to verify during implementation whether this is a CSS issue, data issue, or both

**Fix approach**:
1. Verify CMS navigation data is populating `footerNav` correctly
2. If CSS is the issue, replace `auto-fit` with explicit `repeat(3, 1fr)` to guarantee 3 nav columns
3. Add a 1024px breakpoint that ensures all 4 columns show, with a 768px intermediate that shows 2 columns

## R-004: New Services — Constitution Art. III Tension

**Decision**: Adding "Pavers & Hardscapes" and "Artificial Turf" creates tension with Art. III (Specialized Authority Mandate) which requires BaseScape to be positioned as a basement/egress specialist, not a generic contractor. However, the user explicitly requested these services and they represent real business offerings.

**Rationale**:
- Art. III §2: "The website MUST NOT present BaseScape as a generic remodeling company"
- Pavers/Hardscapes and Artificial Turf are outdoor landscape services, not basement/egress work
- Mitigating factor: These are listed under "Specialized Services" (distinct from core services), maintaining the specialist positioning for the primary offerings

**Resolution**: Frame these as complementary landscape services that enhance the outdoor areas created by walkout basement conversions. The homepage "Our Specialized Services" section already uses `fetchServices()` which will include all published services — need to differentiate between core and specialized services in the data model. Add a `serviceType` field (`core` | `specialized`) to the Services collection.

## R-005: Payload Lexical RichText Serialization

**Decision**: Implement a lightweight Lexical-to-HTML serializer for the Astro frontend rather than using the full `@payloadcms/richtext-lexical` package.

**Rationale**:
- Payload 3.x uses Lexical editor which stores content as a JSON tree structure
- The tree has a `root` node with `children` array containing `paragraph`, `heading`, `list`, etc. nodes
- Each node has `children` with `text` nodes that have `format` flags (bold, italic, etc.)
- A simple recursive serializer (50-100 lines) handles all the node types we use
- Adding the full `@payloadcms/richtext-lexical` package to the Astro frontend adds unnecessary bundle size and complexity

**Node types to support**: paragraph, heading (h1-h6), list (bullet/number), listitem, text (with bold/italic/underline/strikethrough/code formatting), link, linebreak

## R-006: SiteSettings Toggle Fields

**Decision**: Add `showReviews` and `showGallery` boolean fields to the `SiteSettings` Payload global, defaulting to `false`.

**Rationale**:
- Per clarification session: visibility toggles use global Payload CMS site settings
- Boolean fields with `defaultValue: false` ensure reviews and gallery start hidden
- No code deployment needed to toggle — admin flips the switch in CMS
- Site rebuilds via SSG pick up the new values on next build

**Implementation**:
- Add fields to `cms/src/globals/SiteSettings.ts`
- Read `showReviews` in `index.astro` (homepage) and `ServiceLayout.astro`
- Read `showGallery` in `Header.astro` (nav filtering), `Footer.astro` (nav filtering), and `gallery.astro` (redirect to 404/homepage)
- Remove Gallery from navigation in CMS + update fallback hardcoded nav

## R-007: New Service Page Pattern

**Decision**: Create new Astro page files following the exact pattern of existing service pages (e.g., `walkout-basements.astro`), with CMS entries and comprehensive fallback data.

**Rationale**:
- Existing pattern: static `.astro` file in `src/pages/services/` → fetches from CMS → falls back to hardcoded data → renders via `ServiceLayout`
- The `Services` collection schema has an `anxietyStack` group with basement-specific fields (structuralSafety, codeCompliance, etc.)
- For outdoor services, these fields can be repurposed: "structuralSafety" → base preparation/substrate integrity, "codeCompliance" → HOA/permit compliance, etc.
- The anxiety stack fields are already handled gracefully — `ServiceLayout.astro` skips empty fields (`if (!content) return null`)
- Making the anxiety stack fields optional in the collection schema would be cleaner but requires a DB migration — assess during implementation

**New pages needed**:
- `site/src/pages/services/pavers-hardscapes.astro`
- `site/src/pages/services/artificial-turf.astro`

## R-008: Phone Number Format

**Decision**: Display as `1-888-414-0007` with `tel:+18884140007` for the href.

**Rationale**:
- User provided raw digits: "18884140007" → toll-free number (888)
- Spec allows "(888) 414-0007" or "1-888-414-0007" — the `1-` prefix makes the toll-free nature explicit
- `tel:+18884140007` is the E.164 standard for tel: links
- Current phone display logic in `Footer.astro` line 60: `phone.replace(/[^\d+]/g, '')` strips non-digits for tel href
- Same pattern in `CTABlock.astro` line 16
- Update `settings.phone` value in CMS and fallback defaults; rendering logic stays the same

## R-009: Gallery Page Hiding Strategy

**Decision**: When `showGallery` is `false`, the gallery page should return a 404 rather than redirect to homepage.

**Rationale**:
- Per spec acceptance scenario: "they are redirected to the homepage or see a 404 page"
- A 404 is cleaner for SEO — tells search engines the page doesn't exist, rather than a redirect that might still be indexed
- The sitemap integration (`@astrojs/sitemap`) should exclude `/gallery` when hidden — can use the existing `filter` function in `astro.config.ts`
- The Gallery `.astro` page can check `showGallery` at build time and render a 404 component when hidden

However, since this is SSG, the page content is determined at build time. The `showGallery` flag from CMS will be read at build time and either generate the full gallery page or a 404/redirect page. Toggling requires a rebuild.
