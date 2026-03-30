# Research: Square Founder Headshot

**Feature**: 010-headshot-aspect-ratio
**Date**: 2026-03-25

## R1: Image Cropping Approach

**Decision**: Crop the existing 800x750 image to 750x750 (center crop), then upscale to 800x800 if needed — OR canvas-extend the 800x750 to 800x800 by adding 50px to the bottom (if the subject's framing allows).

**Rationale**: The current image is 800 wide x 750 tall, so the image is already wider than tall. A center crop to 750x750 would trim 25px from each side, which is minimal. Alternatively, since the CSS currently uses `object-position: center top`, the bottom of the image is what gets cropped by CSS anyway — meaning we could add canvas at the bottom if the subject allows.

**Alternatives considered**:
- **Re-generate/re-photograph**: Would produce ideal composition but requires a new photo shoot or AI generation — overkill for 50px difference
- **Crop to 750x750 from center**: Loses 25px on each side — acceptable since the subject is centered
- **Crop to 800x800 by extending canvas at bottom**: Adds 50px of background at bottom — only works if background is solid/uniform
- **Use `sips` to crop**: macOS native tool, no dependencies needed

**Selected approach**: Use `sips` to crop the image to square. The exact crop strategy (trim sides vs. extend bottom) will be determined by inspecting the image composition. Since the background appears to be solid dark gray, extending the canvas at the bottom by 50px is likely the cleanest approach — it preserves all existing content and the CSS `object-position: center top` means the top is already the focal point.

## R2: WebP Quality Preservation

**Decision**: Use `cwebp` with quality 90+ for the final output to maintain visual fidelity.

**Rationale**: The existing image is already WebP. If we crop via `sips`, the output may be PNG/TIFF which then needs `cwebp` conversion. Using high quality (90+) ensures no visible degradation.

**Alternatives considered**:
- `sips` can output WebP directly on recent macOS — check availability first
- `cwebp` is already listed in the project's tech stack (008-site-image-assets)
- ImageMagick `convert` — not listed as a dependency, avoid adding one

## R3: HTML Attribute Update

**Decision**: Update `height="750"` to `height="800"` on the `<img>` tag in `about.astro` line 82.

**Rationale**: The `width` and `height` attributes provide aspect ratio hints to the browser for layout stability (CLS prevention). After making the image 800x800, the height attribute must match. The width is already 800.

**No NEEDS CLARIFICATION items remain.**
