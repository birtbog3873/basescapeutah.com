# Feature Specification: Integrate Site Images

**Feature Branch**: `006-integrate-site-images`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "Integrate 7 approved Gemini-generated images into the BaseScape website — homepage hero, 3 service cards, and 3 service page heroes."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Homepage Displays Real Imagery (Priority: P1)

A visitor lands on the BaseScape homepage and sees a professional photo of a completed walkout basement in the hero section, replacing the current SVG icon placeholder. The three service cards below (Walkout Basements, Egress Windows, Window Well Upgrades) each display a relevant photo instead of placeholder icons.

**Why this priority**: The homepage is the first impression. Replacing 4 placeholder icons with real photography immediately communicates professionalism and the scope of BaseScape's work.

**Independent Test**: Load the homepage in a browser and visually confirm all 4 images (hero + 3 cards) render correctly at appropriate sizes with no layout shift.

**Acceptance Scenarios**:

1. **Given** a visitor loads the homepage, **When** the page renders, **Then** the hero section displays the approved walkout basement hero photo (not an SVG placeholder)
2. **Given** a visitor scrolls to the services section, **When** the 3 service cards render, **Then** each card shows its corresponding service photo (walkout basements, egress windows, window well upgrades) instead of SVG placeholders
3. **Given** the page loads on a mobile device, **When** images render, **Then** they maintain correct 3:2 aspect ratio and fit their containers without distortion

---

### User Story 2 - Service Pages Display Hero Images (Priority: P1)

A visitor navigates to any of the 3 service pages (Walkout Basements, Egress Windows, Window Well Upgrades) and sees a large, professional hero photo at the top of the page that visually represents that service.

**Why this priority**: Service pages are where visitors evaluate whether BaseScape can solve their specific problem. A strong hero image builds confidence and keeps visitors engaged.

**Independent Test**: Navigate to each of the 3 service pages and confirm the hero image renders at the correct size with no placeholder fallback.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the Walkout Basements service page, **When** the page renders, **Then** the hero section displays the approved walkout basements service hero photo
2. **Given** a visitor navigates to the Egress Windows service page, **When** the page renders, **Then** the hero section displays the approved egress windows service hero photo
3. **Given** a visitor navigates to the Window Well Upgrades service page, **When** the page renders, **Then** the hero section displays the approved window well upgrades service hero photo
4. **Given** any service page loads, **When** the hero image renders, **Then** it maintains the 3:2 aspect ratio and fills the hero container using object-fit cover behavior

---

### User Story 3 - Images Load Performantly (Priority: P2)

All 7 images are optimized for web delivery so that page load times remain acceptable and Lighthouse performance scores are not significantly degraded.

**Why this priority**: Large unoptimized images can destroy page load performance. The images must be right-sized for their display contexts.

**Independent Test**: Run Lighthouse on the homepage and each service page; confirm performance score remains above 80 and Largest Contentful Paint stays under 3 seconds.

**Acceptance Scenarios**:

1. **Given** the homepage loads, **When** Lighthouse audits performance, **Then** no image triggers "properly size images" or "serve images in next-gen formats" warnings
2. **Given** a service page loads, **When** the browser requests the hero image, **Then** the image file size is under 500KB
3. **Given** any page with images loads, **When** below-the-fold images are present, **Then** they use lazy loading to defer loading until needed

---

### Edge Cases

- What happens if an image file is missing or fails to load? The existing SVG placeholder fallback should remain as a graceful degradation path.
- What happens on very slow connections? Images should have explicit width/height attributes to prevent layout shift (CLS).
- What happens if the CMS later provides images for these same slots? CMS-provided images should take precedence over the static fallback images.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The homepage hero section MUST display the approved homepage hero image in place of the current SVG icon placeholder
- **FR-002**: Each of the 3 homepage service cards (Walkout Basements, Egress Windows, Window Well Upgrades) MUST display its corresponding approved image
- **FR-003**: Each of the 3 service pages (Walkout Basements, Egress Windows, Window Well Upgrades) MUST display its corresponding approved hero image
- **FR-004**: All 7 images MUST maintain 3:2 aspect ratio in their containers
- **FR-005**: All images MUST include descriptive alt text for accessibility
- **FR-006**: Images MUST be optimized for web (appropriately sized, compressed) so that no single image exceeds 500KB
- **FR-007**: The existing SVG placeholder fallback MUST be preserved as a graceful degradation path (not removed from components)
- **FR-008**: Images MUST have explicit width and height attributes to prevent cumulative layout shift
- **FR-009**: Below-the-fold images MUST use lazy loading

### Image Assignments

| Slot                              | Source File                                                  |
| --------------------------------- | ------------------------------------------------------------ |
| Homepage Hero                     | `photorealistic-...-a-20260325-112643.png`                   |
| Card: Walkout Basements           | `photorealistic-...-a-20260325-110138.png`                   |
| Card: Egress Windows              | `photorealistic-...-an-20260325-112814.png`                  |
| Card: Window Well Upgrades        | `photorealistic-...-a-close-20260325-112854.png`             |
| Service Hero: Walkout Basements   | `photorealistic-...-a-20260325-112735.png`                   |
| Service Hero: Egress Windows      | `in-the-window-well-...-20260325-111748.png`                 |
| Service Hero: Window Well Upgrades | `remove-the-extra-...-20260325-114551.png`                  |

Full paths located in `/Users/stevenbunker/Pictures/gemini-output/`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 7 image slots display real photographs instead of SVG placeholders when the site is loaded
- **SC-002**: Lighthouse performance score on homepage and service pages remains above 80
- **SC-003**: Largest Contentful Paint on pages with hero images stays under 3 seconds
- **SC-004**: No cumulative layout shift caused by image loading (CLS score under 0.1)
- **SC-005**: All images pass WCAG 2.1 Level AA requirements (descriptive alt text present)
- **SC-006**: CMS-provided images (when available) take precedence over static images without code changes

## Assumptions

- The 7 approved images from the Gemini generation session are the final versions and do not need further editing
- The source PNG files will be converted/optimized for web delivery as part of this work
- The site's existing component architecture (ServiceCard, ServiceLayout) will be adapted to support static images alongside CMS images
- No new pages or components need to be created; this is purely wiring images into existing slots
