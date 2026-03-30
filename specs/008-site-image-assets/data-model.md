# Data Model: Site Image Assets

**Feature**: 008-site-image-assets
**Date**: 2026-03-25

## Entities

### Service Image

Represents an image asset used on the BaseScape website.

| Field | Description | Example |
|-------|-------------|---------|
| slug | URL-friendly service identifier | `basement-remodeling` |
| use_case | Where the image is displayed | `card` or `hero` |
| filename | Target filename in public/images/ | `card-basement-remodeling.webp` |
| url | Absolute path from site root | `/images/services/card-basement-remodeling.webp` |
| alt | Descriptive alt text for SEO/accessibility | "Finished basement living area with..." |
| format | File format | `webp` |

### heroImage Object (Astro fallback data)

The data shape expected by `ServiceCard.astro` and `ServiceLayout.astro` components.

```
heroImage: {
  url: string,   // Absolute path from site root, e.g., "/images/services/card-basement-remodeling.webp"
  alt: string    // Descriptive alt text
}
```

### Services Affected

| Slug | Card Image | Hero Image | Homepage | Detail Page |
|------|-----------|------------|----------|-------------|
| `basement-remodeling` | `card-basement-remodeling.webp` | `hero-basement-remodeling.webp` | Yes | `services/basement-remodeling.astro` |
| `pavers-hardscapes` | `card-pavers-hardscapes.webp` | `hero-pavers-hardscapes.webp` | Yes | `services/pavers-hardscapes.astro` |
| `retaining-walls` | `card-retaining-walls.webp` | `hero-retaining-walls.webp` | Yes | `services/retaining-walls.astro` |
| `artificial-turf` | `card-artificial-turf.webp` | `hero-artificial-turf.webp` | Yes | `services/artificial-turf.astro` |

### Team Member Image

| Field | Value |
|-------|-------|
| filename | `team-steven-bunker.webp` |
| url | `/images/team-steven-bunker.webp` |
| alt | "Steven Bunker, Founder of BaseScape" |
| location | `site/public/images/` (not in services/ subdirectory) |
