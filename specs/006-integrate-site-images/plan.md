# Implementation Plan: Integrate Site Images

**Branch**: `006-integrate-site-images` | **Date**: 2026-03-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-integrate-site-images/spec.md`

## Summary

Replace all SVG placeholder images on the BaseScape website with 7 approved photorealistic images. Copy optimized images to `site/public/images/services/`, update the homepage hero section to render a real photo, and add `heroImage` properties to fallback service data so ServiceCard and ServiceLayout components display the images.

## Technical Context

**Language/Version**: TypeScript 5.8 + Astro 5.7
**Primary Dependencies**: Astro 5.7.10, React 19, Vanilla Extract, Open Props
**Storage**: Static files in `public/images/`; CMS via Payload 3.x + Cloudflare R2 (not used for this feature)
**Testing**: Visual inspection + Lighthouse audit (no test framework configured)
**Target Platform**: Static site deployed to Cloudflare Pages
**Project Type**: Static website (Astro SSG)
**Performance Goals**: Lighthouse performance > 80, LCP < 3s, CLS < 0.1
**Constraints**: Each image < 500KB, maintain existing CMS-first architecture
**Scale/Scope**: 7 images across 4 pages (homepage + 3 service pages)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution is an unfilled template — no project-specific gates defined. No violations to check.

## Project Structure

### Documentation (this feature)

```text
specs/006-integrate-site-images/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (minimal — no entities)
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
site/
├── public/
│   └── images/
│       ├── basescape-logo.png          # Existing
│       └── services/                   # NEW — all 7 images
│           ├── hero-homepage.webp
│           ├── card-walkout-basements.webp
│           ├── card-egress-windows.webp
│           ├── card-window-well-upgrades.webp
│           ├── hero-walkout-basements.webp
│           ├── hero-egress-windows.webp
│           └── hero-window-well-upgrades.webp
└── src/
    ├── pages/
    │   ├── index.astro                 # MODIFIED — hero image + fallback heroImage data
    │   └── services/
    │       ├── walkout-basements.astro  # MODIFIED — add heroImage to fallback
    │       ├── egress-windows.astro     # MODIFIED — add heroImage to fallback
    │       └── window-well-upgrades.astro # MODIFIED — add heroImage to fallback
    ├── components/
    │   └── content/
    │       └── ServiceCard.astro       # NO CHANGES — already supports heroImage prop
    └── layouts/
        └── ServiceLayout.astro         # NO CHANGES — already supports service.heroImage
```

**Structure Decision**: Images go in `public/images/services/` because the site uses plain `<img>` tags with URL strings (no Astro Image component, no `sharp` dependency). This matches the existing pattern (`public/images/basescape-logo.png`). WebP format for compression. Components already have conditional rendering for `heroImage` — we just need to provide the data.

## Implementation Approach

### Step 1: Optimize and Copy Images

Convert the 7 source PNGs from `~/Pictures/gemini-output/` to WebP format, resize to appropriate dimensions:
- **Hero images** (homepage + 3 service pages): 1200x800px (matches existing `width="1200" height="800"` in ServiceLayout)
- **Card images** (3 service cards): 600x400px (matches existing `width="600" height="400"` in ServiceCard)

Use `sips` (macOS built-in) or `cwebp` to convert. Target < 500KB per image.

Naming convention: `{type}-{service-slug}.webp`

### Step 2: Update Homepage Hero Section

Replace the SVG placeholder in `index.astro` hero section (`div.hero__placeholder`) with an `<img>` tag pointing to `/images/services/hero-homepage.webp`. Keep the gradient background as a loading fallback.

### Step 3: Add heroImage to Fallback Service Data

In each service page file and in the homepage services array, add `heroImage` to the fallback data:

```typescript
heroImage: {
  url: '/images/services/{type}-{slug}.webp',
  alt: 'Descriptive alt text for the service'
}
```

This is the minimal change — the existing ServiceCard and ServiceLayout components already check for `heroImage` and render it when present. CMS data (when available) will override these fallbacks since CMS fetch happens first.

### Step 4: Verify

- Build the site (`pnpm build`)
- Check all 4 pages visually
- Run Lighthouse on homepage and one service page
- Confirm no CLS issues

## Complexity Tracking

No constitution violations to track. This is a straightforward asset integration with minimal code changes (4 files modified, 7 images added).
