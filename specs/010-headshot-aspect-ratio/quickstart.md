# Quickstart: Square Founder Headshot

**Feature**: 010-headshot-aspect-ratio
**Date**: 2026-03-25

## What This Feature Does

Replaces the founder headshot image with a true 1:1 square version and updates the HTML dimensions to match. Two files change: the image and one HTML attribute.

## Files Modified

1. **`site/public/images/team-steven-bunker.webp`** — Replace 800x750 image with 800x800 square version
2. **`site/src/pages/about.astro`** — Update `height="750"` to `height="800"` on the img tag (line 82)

## How to Verify

```bash
# Check image dimensions
sips -g pixelWidth -g pixelHeight site/public/images/team-steven-bunker.webp

# Expected output:
#   pixelWidth: 800
#   pixelHeight: 800
```

Then open the about page in a browser and visually confirm the headshot displays correctly at desktop and mobile widths.

## Implementation Notes

- The CSS container already uses `aspect-ratio: 1/1` so no style changes are needed
- The image can be made square by adding 50px of background canvas to the bottom (solid dark gray matches current background) or by center-cropping to 750x750 and upscaling
- Use `cwebp` (already in project toolchain) for final WebP output if intermediate format conversion is needed
