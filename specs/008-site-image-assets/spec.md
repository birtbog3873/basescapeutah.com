# Feature Specification: Site Image Assets — Copy & Place Service Images

**Feature Branch**: `008-site-image-assets`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "Copy approved images to site assets with clean filenames and update site content to reference them."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Copy Approved Images to Site Assets (Priority: P1)

A developer has 8 approved generated images in `~/Pictures/gemini-output/` with long auto-generated filenames. They need these images copied into the site's `public/images/services/` directory with clean, convention-matching filenames so the Astro site can serve them.

**Why this priority**: Without the images physically present in the site assets directory with correct filenames, no content updates can reference them. This is the prerequisite for everything else.

**Independent Test**: After completion, all 8 images exist in `site/public/images/services/` with the correct naming convention and are valid image files.

**Acceptance Scenarios**:

1. **Given** 4 approved homepage card images in `~/Pictures/gemini-output/`, **When** they are copied to `site/public/images/services/`, **Then** they exist as `card-basement-remodeling.webp`, `card-pavers-hardscapes.webp`, `card-retaining-walls.webp`, `card-artificial-turf.webp`
2. **Given** 4 approved service page hero images in `~/Pictures/gemini-output/`, **When** they are copied to `site/public/images/services/`, **Then** they exist as `hero-basement-remodeling.webp`, `hero-pavers-hardscapes.webp`, `hero-retaining-walls.webp`, `hero-artificial-turf.webp`
3. **Given** source images are PNG format, **When** copied to site assets, **Then** they are converted to WebP format to match the existing site convention (existing images are all WebP, 34-193 KB)

---

### User Story 2 - Update Homepage Service Cards Content (Priority: P2)

The homepage (`index.astro`) displays service cards for each service. The 4 new services (Basement Remodeling, Pavers & Hardscapes, Retaining Walls, Artificial Turf) currently show placeholder SVGs because no `heroImage` is defined. The fallback data needs to be updated with the correct image paths and descriptive alt text.

**Why this priority**: The homepage is the highest-traffic page. Service cards with real images convert significantly better than placeholder icons.

**Independent Test**: Load the homepage locally and verify all 4 new service cards display their respective images instead of placeholder SVGs.

**Acceptance Scenarios**:

1. **Given** the homepage fallback service data in `index.astro`, **When** the Basement Remodeling service card is rendered, **Then** it displays `card-basement-remodeling.webp` with descriptive alt text
2. **Given** the homepage fallback service data in `index.astro`, **When** the Pavers & Hardscapes service card is rendered, **Then** it displays `card-pavers-hardscapes.webp` with descriptive alt text
3. **Given** the homepage fallback service data in `index.astro`, **When** the Retaining Walls service card is rendered, **Then** it displays `card-retaining-walls.webp` with descriptive alt text
4. **Given** the homepage fallback service data in `index.astro`, **When** the Artificial Turf service card is rendered, **Then** it displays `card-artificial-turf.webp` with descriptive alt text

---

### User Story 3 - Update Service Detail Page Heroes (Priority: P2)

Each service detail page (`services/basement-remodeling.astro`, `services/pavers-hardscapes.astro`, `services/retaining-walls.astro`, `services/artificial-turf.astro`) has fallback data that needs a `heroImage` with the correct hero image path and descriptive alt text.

**Why this priority**: Service pages are the primary conversion pages. Hero images set the visual tone and demonstrate capability. Equal priority to homepage cards since both are customer-facing.

**Independent Test**: Navigate to each of the 4 service detail pages and verify the hero section displays the correct full-width hero image.

**Acceptance Scenarios**:

1. **Given** the Basement Remodeling service page, **When** rendered, **Then** it displays `hero-basement-remodeling.webp` as the hero image with descriptive alt text
2. **Given** the Pavers & Hardscapes service page, **When** rendered, **Then** it displays `hero-pavers-hardscapes.webp` as the hero image with descriptive alt text
3. **Given** the Retaining Walls service page, **When** rendered, **Then** it displays `hero-retaining-walls.webp` as the hero image with descriptive alt text
4. **Given** the Artificial Turf service page, **When** rendered, **Then** it displays `hero-artificial-turf.webp` as the hero image with descriptive alt text

---

### User Story 4 - Add Steven Bunker Headshot to About Page (Priority: P3)

The About page (`about.astro`) needs Steven Bunker's headshot image added to the team/founder section.

**Why this priority**: The about page builds trust but has lower traffic than homepage and service pages. Still important for credibility.

**Independent Test**: Load the about page and verify Steven Bunker's headshot is displayed in the appropriate section.

**Acceptance Scenarios**:

1. **Given** Steven Bunker's headshot source image at `~/Downloads/bunker headshots/DSCF6812 profile headshot picture.jpg`, **When** copied to site assets, **Then** it exists as `team-steven-bunker.webp` in `site/public/images/`
2. **Given** the About page, **When** rendered, **Then** Steven Bunker's headshot is displayed with appropriate alt text ("Steven Bunker, Founder of BaseScape")

---

### Edge Cases

- What happens if a source image file is missing or corrupted? Copy should fail with a clear error rather than silently producing a broken asset.
- What happens if WebP conversion changes image quality too drastically? Conversion should use high quality settings (90+) to preserve detail.
- What happens if a target filename already exists in `public/images/services/`? Existing files should be overwritten since these are approved replacements.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST copy 4 homepage card images from `~/Pictures/gemini-output/` to `site/public/images/services/` with filenames matching the pattern `card-{service-slug}.webp`
- **FR-002**: System MUST copy 4 service hero images from `~/Pictures/gemini-output/` to `site/public/images/services/` with filenames matching the pattern `hero-{service-slug}.webp`
- **FR-003**: System MUST convert source PNG images to WebP format during the copy to match the existing site convention
- **FR-004**: System MUST copy Steven Bunker's headshot to `site/public/images/team-steven-bunker.webp`
- **FR-005**: System MUST update the homepage fallback service data in `index.astro` to include `heroImage` references for all 4 new services with correct paths and descriptive alt text
- **FR-006**: System MUST update each service detail page's fallback data to include the correct `heroImage` path and descriptive alt text
- **FR-007**: All image alt text MUST be descriptive and SEO-friendly, describing the actual content of the image
- **FR-008**: System MUST update the About page to reference Steven Bunker's headshot image

### Key Entities

- **Service Image**: An approved image file with a source path (gemini-output), a target path (public/images/services/), a use case (card or hero), a service slug, and alt text
- **Service Slug**: The URL-friendly identifier for each service: `basement-remodeling`, `pavers-hardscapes`, `retaining-walls`, `artificial-turf`

## Source-to-Target Image Mapping

| Use Case | Service | Source File (in ~/Pictures/gemini-output/) | Target File (in site/public/images/services/) |
|----------|---------|-------------------------------------------|----------------------------------------------|
| Card | Basement Remodeling | `photorealistic-...-a-20260325-145214.png` | `card-basement-remodeling.webp` |
| Card | Pavers & Hardscapes | `photorealistic-...-a-close-20260325-144109.png` | `card-pavers-hardscapes.webp` |
| Card | Retaining Walls | `photorealistic-...-an-20260325-144129.png` | `card-retaining-walls.webp` |
| Card | Artificial Turf | `photorealistic-...-a-20260325-144149.png` | `card-artificial-turf.webp` |
| Hero | Basement Remodeling | `photorealistic-...-a-20260325-145233.png` | `hero-basement-remodeling.webp` |
| Hero | Pavers & Hardscapes | `photorealistic-...-a-wide-20260325-144242.png` | `hero-pavers-hardscapes.webp` |
| Hero | Retaining Walls | `photorealistic-...-a-wide-20260325-144303.png` | `hero-retaining-walls.webp` |
| Hero | Artificial Turf | `photorealistic-...-a-wide-20260325-144326.png` | `hero-artificial-turf.webp` |
| Headshot | Steven Bunker | `~/Downloads/bunker headshots/DSCF6812 profile headshot picture.jpg` | `site/public/images/team-steven-bunker.webp` |

## Assumptions

- The existing site convention uses WebP format for all images; new images should match this convention
- Homepage card images are typically 34-47 KB WebP; hero images are 145-193 KB WebP — conversion quality should be calibrated to match
- The fallback data pattern in `.astro` files uses `heroImage: { url: '/images/services/{filename}', alt: '...' }` format
- The About page structure supports a team member image section (to be verified during implementation)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All 8 service images are present in `site/public/images/services/` with correct filenames and WebP format
- **SC-002**: Steven Bunker's headshot is present in `site/public/images/` as WebP
- **SC-003**: All 4 homepage service cards display their respective images when the site is built locally (no placeholder SVGs)
- **SC-004**: All 4 service detail pages display their respective hero images when the site is built locally
- **SC-005**: All image alt text is descriptive and contains relevant keywords for the service
- **SC-006**: The About page displays Steven Bunker's headshot
