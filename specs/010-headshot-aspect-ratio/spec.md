# Feature Specification: Square Founder Headshot

**Feature Branch**: `010-headshot-aspect-ratio`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "I would like the about basescape founder headshot to be square 1:1 aspect ratio."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor views properly composed founder headshot (Priority: P1)

A visitor navigates to the BaseScape about page and sees Steven Bunker's founder headshot displayed as a properly proportioned square image. The subject is intentionally centered and framed for the square format rather than being auto-cropped from a non-square source.

**Why this priority**: The founder headshot is a key trust signal on the about page. Currently the source image is 800x750px (not square), and CSS `object-fit: cover` crops it to fit the 1:1 container. Replacing the source with a true 1:1 image ensures intentional composition.

**Independent Test**: Open the about page, inspect the founder headshot image file, and confirm it has equal width and height. Visually verify the subject is well-framed with no awkward cropping.

**Acceptance Scenarios**:

1. **Given** a visitor on the about page, **When** the team section loads, **Then** the founder headshot displays as a perfect square with the subject properly centered and framed
2. **Given** the source image file, **When** its dimensions are inspected, **Then** the width and height are equal (1:1 aspect ratio)
3. **Given** the about page on a mobile device, **When** the team section renders in single-column layout, **Then** the headshot still displays correctly without distortion

---

### Edge Cases

- The replacement image must maintain visual quality at the current display sizes (desktop grid and full-width mobile)
- The image file must remain in WebP format to match the existing asset pipeline
- The filename and path must stay the same to avoid breaking any references

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The founder headshot source image MUST have a 1:1 (square) aspect ratio with equal width and height
- **FR-002**: The replacement image MUST maintain the same or better visual quality as the current 800x750 image
- **FR-003**: The replacement image MUST use the same file path and name (`site/public/images/team-steven-bunker.webp`) so no code changes are required
- **FR-004**: The subject MUST be properly centered and framed within the square composition, with face and upper body visible

### Key Entities

- **Founder Headshot**: WebP image file at `site/public/images/team-steven-bunker.webp`, currently 800x750px, to be replaced with a square version (e.g., 800x800px)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The source image file has identical width and height dimensions (1:1 ratio)
- **SC-002**: The founder's face and upper body are fully visible and properly composed in the square frame
- **SC-003**: The about page renders the headshot correctly on both desktop and mobile without visible cropping artifacts or distortion

## Assumptions

- The current image can be cropped or regenerated to 1:1 without losing important visual content
- No HTML or CSS changes are needed since the container already uses `aspect-ratio: 1/1`
- The target resolution of approximately 800x800px is sufficient for all display contexts
