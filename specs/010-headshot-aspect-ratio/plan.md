# Implementation Plan: Square Founder Headshot

**Branch**: `010-headshot-aspect-ratio` | **Date**: 2026-03-25 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/010-headshot-aspect-ratio/spec.md`

## Summary

Replace the founder headshot image (`team-steven-bunker.webp`) with a square 1:1 version and update the HTML `width`/`height` attributes to match. The current image is 800x750px; the CSS container already enforces 1:1 via `aspect-ratio` and `object-fit: cover`, but the source image itself is not square. This change ensures intentional composition rather than relying on CSS cropping.

## Technical Context

**Language/Version**: Astro 5.x (`.astro` files), HTML/CSS
**Primary Dependencies**: `cwebp` (WebP conversion CLI from libwebp), `sips` (macOS image tool)
**Storage**: Static file at `site/public/images/team-steven-bunker.webp`
**Testing**: Visual inspection + `sips` dimension check
**Target Platform**: Web (static site)
**Project Type**: Static website (Astro)
**Performance Goals**: N/A (single image replacement)
**Constraints**: Image must remain WebP format, same file path, same or better quality
**Scale/Scope**: 1 image file + 1 HTML attribute update

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution is an unfilled template — no project-specific gates defined. No violations possible.

## Project Structure

### Documentation (this feature)

```text
specs/010-headshot-aspect-ratio/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (minimal — asset metadata only)
└── quickstart.md        # Phase 1 output
```

### Source Code (repository root)

```text
site/
├── public/images/
│   └── team-steven-bunker.webp    # Image to replace (800x750 → 800x800)
└── src/pages/
    └── about.astro                # Update height="750" → height="800"
```

**Structure Decision**: No new files or directories needed. This is an in-place asset replacement with a single HTML attribute update.

## Complexity Tracking

No constitution violations to justify.
