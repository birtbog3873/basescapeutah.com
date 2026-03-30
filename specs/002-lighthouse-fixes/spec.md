# Feature Specification: Lighthouse Audit Fixes

**Feature Branch**: `002-lighthouse-fixes`
**Created**: 2026-03-24
**Status**: Draft
**Input**: Lighthouse audit report (localhost:4322, 2026-03-24) — Performance 65%, Accessibility 96%, Best Practices 96%, SEO 92%

## Audit Summary

The Lighthouse audit identified issues across four categories. Several findings (unminified JS, BFCache/WebSocket, inflated FCP/LCP/TTI) are **dev-mode artifacts** caused by Vite HMR and will not exist in production builds. This spec covers only production-relevant issues.

**Dev-mode artifacts (excluded from scope):**
- Unminified JavaScript (1,356 KiB) — Vite dev client and Astro dev bundles
- BFCache failure — WebSocket from Vite HMR
- Inflated FCP (4.8s), LCP (5.8s), TTI (9.3s) — dev-mode overhead

**Production issues (in scope):**
- Color contrast failures on CTA buttons and skip link
- Missing font files (404s)
- Missing CMS media files (404s)
- Non-descriptive link text
- Image format optimization opportunity

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Accessible CTA Buttons (Priority: P1)

Visitors with low vision or in bright ambient light need sufficient contrast on call-to-action buttons to read and interact with them. Four elements currently fail WCAG 2.2 AA contrast requirements (ratio 3.82:1, minimum 4.5:1 required for normal text).

**Failing elements:**
- Skip-to-content link (`a.skip-link`)
- Hero section estimate button (`div.hero__content .cta-block__btn--estimate`)
- Final CTA section estimate button (`div.final-cta-section__inner .cta-block__btn--estimate`)
- Mobile bottom bar estimate button (`nav.mobile-bar .mobile-bar__btn--estimate`)

**Current colors:** `#ffffff` foreground on `#b87308` background (contrast 3.82:1)

**Why this priority**: Accessibility compliance is both a legal consideration and directly impacts conversion — users who can't read CTA text won't click.

**Independent Test**: Visually verify button text is readable; run Lighthouse accessibility audit and confirm contrast ratio >= 4.5:1 on all four elements.

**Acceptance Scenarios**:

1. **Given** the homepage is loaded, **When** a user views any estimate CTA button, **Then** the foreground-to-background contrast ratio meets or exceeds 4.5:1 per WCAG 2.2 AA
2. **Given** the homepage is loaded on mobile, **When** the mobile bottom bar is visible, **Then** the estimate button text has a contrast ratio >= 4.5:1
3. **Given** a keyboard user tabs to the skip link, **When** it becomes visible, **Then** its text has a contrast ratio >= 4.5:1

---

### User Story 2 - Fix Missing Font Files (Priority: P1)

Two web font files return 404, causing fallback font rendering and layout shift. The missing fonts are core to the site's visual identity.

**Missing files:**
- `/_astro/fraunces-latin-wght-normal.woff2`
- `/_astro/space-grotesk-latin-wght-normal.woff2`

**Why this priority**: Missing fonts degrade visual quality on every page load for every visitor and may contribute to layout shift (CLS).

**Independent Test**: Load the homepage and confirm both Fraunces and Space Grotesk render correctly with no 404s in the network tab.

**Acceptance Scenarios**:

1. **Given** the homepage is loaded, **When** fonts are requested, **Then** both Fraunces and Space Grotesk woff2 files return 200 status
2. **Given** the homepage is loaded, **When** text renders, **Then** headings use Fraunces and body text uses Space Grotesk (no fallback flash)
3. **Given** the browser console is open, **When** the page loads, **Then** no 404 errors appear for font resources

---

### User Story 3 - Fix Missing Hero Images (Priority: P2)

Two hero images served from the CMS media API return 404, resulting in broken or missing visuals in the hero section.

**Missing files:**
- `/api/media/file/hero-window-well-3.png`
- `/api/media/file/hero-egress-3.png`

**Why this priority**: Hero images are above-the-fold and directly impact first impression, but the fix may depend on CMS content availability rather than code changes.

**Independent Test**: Load the homepage and verify hero images display correctly with no 404s.

**Acceptance Scenarios**:

1. **Given** the homepage is loaded, **When** the hero section renders, **Then** all referenced hero images load successfully (200 status)
2. **Given** the browser console is open, **When** the page loads, **Then** no 404 errors appear for `/api/media/file/` resources

---

### User Story 4 - Descriptive Link Text (Priority: P3)

One link uses generic "Learn more" text, which fails SEO best practices and is unhelpful for screen reader users navigating by link list.

**Why this priority**: Minor SEO and accessibility improvement; single occurrence.

**Independent Test**: Search page for "Learn more" link text; verify all links have descriptive, context-specific text.

**Acceptance Scenarios**:

1. **Given** the homepage is loaded, **When** a screen reader lists all links, **Then** no link has generic text like "Learn more," "Click here," or "Read more" without surrounding context
2. **Given** Lighthouse SEO audit is run, **When** link-text audit evaluates, **Then** the audit passes

---

### User Story 5 - Image Format Optimization (Priority: P3)

Images can be served in modern formats (WebP/AVIF) for ~51 KiB savings, improving load performance on slower connections.

**Why this priority**: Small optimization with low effort; nice-to-have for performance.

**Independent Test**: Inspect network requests for image assets; verify modern formats are served to supporting browsers.

**Acceptance Scenarios**:

1. **Given** the homepage is loaded in a browser supporting WebP/AVIF, **When** images are requested, **Then** modern image formats are served where supported
2. **Given** the homepage is loaded in a browser without WebP support, **Then** fallback formats (PNG/JPEG) are served

---

### Edge Cases

- What happens if the amber CTA color is darkened too much, losing brand identity? The adjusted color must remain visually consistent with the site's warm amber palette.
- What happens if Fraunces or Space Grotesk fonts are not available from the configured source? The site should define appropriate fallback font stacks.
- What happens if CMS media files are missing because they haven't been uploaded yet? The site should handle missing hero images gracefully (no broken image indicators).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All interactive elements with text MUST meet WCAG 2.2 AA contrast ratio (4.5:1 for normal text, 3:1 for large text)
- **FR-002**: All font files referenced in CSS MUST be available and return 200 status on page load
- **FR-003**: All image sources referenced in page markup MUST either load successfully or degrade gracefully (no broken image indicators)
- **FR-004**: All links MUST have descriptive text that conveys purpose out of context (no generic "Learn more" or "Click here")
- **FR-005**: *(Deferred — see research decision R-005)* Images SHOULD be served in modern formats (WebP or AVIF) with appropriate fallbacks for unsupported browsers

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Lighthouse Accessibility score reaches 100% on the homepage (production build)
- **SC-002**: Lighthouse SEO score reaches 100% on the homepage (production build)
- **SC-003**: Zero 404 errors in the browser console on homepage load (production build)
- **SC-004**: All CTA button contrast ratios measure 4.5:1 or higher
- **SC-005**: Lighthouse Best Practices score remains at or above 96%

## Assumptions

- The amber color (`#b87308`) can be darkened to meet contrast requirements while maintaining brand consistency — research selected `#946106` (~5.4:1 ratio with white)
- Font files are expected to be bundled by Astro's build process; the 404s indicate a configuration or build issue, not missing source files
- Hero image 404s may be a CMS content issue (images not yet uploaded) rather than a code bug
- Performance metrics (FCP, LCP, TTI, Speed Index) will improve significantly in production builds without code changes, due to removal of Vite dev overhead
- The "Learn more" link pointing to Astro docs is a development placeholder that should be removed or replaced
