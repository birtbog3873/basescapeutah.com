# Quickstart: Integrate Site Images

## Prerequisites

- Node.js 18+ and pnpm installed
- Source images in `~/Pictures/gemini-output/` (7 approved PNGs from Gemini generation)
- macOS with `sips` (built-in) for image resizing

## Setup

```bash
cd /Users/stevenbunker/clients/general-contracting
git checkout 006-integrate-site-images
```

## Implementation Steps

### 1. Create image directory and optimize images

```bash
mkdir -p site/public/images/services

# For each source image: resize with sips, then copy as WebP
# Hero images → 1200x800
# Card images → 600x400
```

### 2. Add heroImage to fallback service data

In each service page (`site/src/pages/services/*.astro`), add to the fallback object:

```typescript
heroImage: {
  url: '/images/services/hero-{service-slug}.webp',
  alt: 'Descriptive alt text'
}
```

In `site/src/pages/index.astro`, add heroImage to each service in the fallback services array.

### 3. Update homepage hero section

Replace the SVG placeholder in `index.astro` with an `<img>` tag:

```html
<img src="/images/services/hero-homepage.webp" alt="..." width="1200" height="800" />
```

### 4. Verify

```bash
cd site && pnpm build && pnpm preview
```

- Check homepage: hero image + 3 service cards
- Check each service page: hero image
- Run Lighthouse in Chrome DevTools

## Key Files

| File | Change |
| ---- | ------ |
| `site/public/images/services/*.webp` | 7 new image files |
| `site/src/pages/index.astro` | Hero image + fallback heroImage data |
| `site/src/pages/services/walkout-basements.astro` | Add heroImage to fallback |
| `site/src/pages/services/egress-windows.astro` | Add heroImage to fallback |
| `site/src/pages/services/window-well-upgrades.astro` | Add heroImage to fallback |
