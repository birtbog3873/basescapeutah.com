# Quickstart: Site Image Assets

**Feature**: 008-site-image-assets

## Prerequisites

- `cwebp` installed (`brew install webp`)
- Source images present in `~/Pictures/gemini-output/` (8 service images)
- Source headshot present in `~/Downloads/bunker headshots/`
- Astro dev server runnable (`cd site && npm run dev`)

## Implementation Order

1. **Convert & copy images** — Run `cwebp` for each source→target pair
2. **Update index.astro** — Add `heroImage` to 4 service fallback objects
3. **Update service pages** — Add `heroImage` to 4 service detail fallback objects
4. **Update about.astro** — Add headshot reference
5. **Verify** — Run dev server, check all pages

## Verification

```bash
cd site && npm run dev
```

Check:
- Homepage: 4 new service cards show images
- /services/basement-remodeling: Hero image visible
- /services/pavers-hardscapes: Hero image visible
- /services/retaining-walls: Hero image visible
- /services/artificial-turf: Hero image visible
- /about: Steven Bunker headshot visible
