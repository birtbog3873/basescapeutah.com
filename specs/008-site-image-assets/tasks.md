# Tasks: Site Image Assets

**Feature**: 008-site-image-assets
**Generated**: 2026-03-25
**Source**: [plan.md](plan.md)

## Phase 1: Setup

- [x] **T-001**: Verify `cwebp` is installed and available on PATH
  - Files: N/A (system check)

## Phase 2: Image Conversion & Copy

- [x] **T-002**: Convert and copy 4 homepage card images from PNG to WebP [P]
  - Source: `~/Pictures/gemini-output/` (4 PNG files)
  - Target: `site/public/images/services/card-{slug}.webp`
  - Quality: `-q 82`

- [x] **T-003**: Convert and copy 4 service hero images from PNG to WebP [P]
  - Source: `~/Pictures/gemini-output/` (4 PNG files)
  - Target: `site/public/images/services/hero-{slug}.webp`
  - Quality: `-q 85`

- [x] **T-004**: Convert and copy Steven Bunker headshot from JPG to WebP [P]
  - Source: `~/Downloads/bunker headshots/DSCF6812 profile headshot picture.jpg`
  - Target: `site/public/images/team-steven-bunker.webp`
  - Quality: `-q 90`

## Phase 3: Content Updates

- [x] **T-005**: Update `index.astro` homepage fallback data with heroImage for 4 new services
  - File: `site/src/pages/index.astro`
  - Add `heroImage: { url, alt }` to: basement-remodeling, pavers-hardscapes, retaining-walls, artificial-turf

- [x] **T-006**: Update `basement-remodeling.astro` fallback data with heroImage
  - File: `site/src/pages/services/basement-remodeling.astro`

- [x] **T-007**: Update `pavers-hardscapes.astro` fallback data with heroImage [P]
  - File: `site/src/pages/services/pavers-hardscapes.astro`

- [x] **T-008**: Update `retaining-walls.astro` fallback data with heroImage [P]
  - File: `site/src/pages/services/retaining-walls.astro`

- [x] **T-009**: Update `artificial-turf.astro` fallback data with heroImage [P]
  - File: `site/src/pages/services/artificial-turf.astro`

- [x] **T-010**: Update `about.astro` with Steven Bunker headshot reference
  - File: `site/src/pages/about.astro`

## Phase 4: Verification

- [x] **T-011**: Verify all 9 WebP images exist with correct filenames and reasonable file sizes
  - Files: `site/public/images/services/*.webp`, `site/public/images/team-steven-bunker.webp`

- [x] **T-012**: Build site locally and verify images render on all pages
  - Verify: homepage cards, 4 service pages, about page
