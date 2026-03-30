# Research: Site Image Assets

**Feature**: 008-site-image-assets
**Date**: 2026-03-25

## Findings

### WebP Conversion Tool

- **Decision**: Use `cwebp` from libwebp (available via `brew install webp` on macOS)
- **Rationale**: Already standard on macOS, produces well-optimized WebP, supports quality tuning
- **Alternatives considered**: `sharp` (Node.js — overkill for one-off conversion), `ffmpeg` (heavier), Astro image optimization (only works for imported images, not public/ dir)

### Quality Settings

- **Decision**: `-q 82` for card images, `-q 85` for hero images, `-q 90` for headshot
- **Rationale**: Existing card images are 34-47 KB, hero images 145-193 KB. Quality 82 for cards hits ~40-50 KB from 1024px-wide source. Quality 85 for heroes hits ~150-200 KB. Headshot at 90 for portrait detail.
- **Alternatives considered**: Single quality setting for all — rejected because cards and heroes have different display sizes and file size targets.

### Image Dimensions

- **Decision**: No resizing needed. Gemini outputs are already appropriately sized for web. Let browser handle responsive display.
- **Rationale**: Existing images in the site vary in dimension. The Astro site uses CSS to constrain display size. Source images from Gemini are web-appropriate resolution.

### Fallback Data Pattern

- **Decision**: Add `heroImage: { url: '/images/services/{filename}', alt: '...' }` to each service's fallback data object
- **Rationale**: This matches the exact pattern used by existing services (walkout-basements, egress-windows) in both `index.astro` and individual service pages.

## No Unknowns Remaining

All technical questions resolved. Ready for implementation.
