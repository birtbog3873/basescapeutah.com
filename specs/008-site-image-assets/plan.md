# Implementation Plan: Site Image Assets — Copy & Place Service Images

**Branch**: `008-site-image-assets` | **Date**: 2026-03-25 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/008-site-image-assets/spec.md`

## Summary

Copy 8 approved service images + 1 headshot from source locations into the Astro site's `public/images/` directory, converting from PNG/JPG to WebP with clean filenames. Then update fallback data in `index.astro` (homepage service cards), 4 service detail pages, and `about.astro` to reference the new images with descriptive alt text.

## Technical Context

**Language/Version**: Astro 5.7.10 (static site, `.astro` files)
**Primary Dependencies**: `cwebp` (WebP conversion CLI from libwebp)
**Storage**: Static files in `site/public/images/services/` and `site/public/images/`
**Testing**: Visual verification via `npm run dev` in `site/`
**Target Platform**: Cloudflare Pages (static site)
**Project Type**: Static website (Astro)
**Performance Goals**: Card images ~34-50 KB WebP, hero images ~150-200 KB WebP
**Constraints**: Must match existing naming convention (`card-{slug}.webp`, `hero-{slug}.webp`)
**Scale/Scope**: 9 images, 6 Astro page files to update

## Constitution Check

*GATE: No constitution principles defined. No gates to enforce.*

The project constitution is a blank template. No violations possible. Proceeding.

## Project Structure

### Documentation (this feature)

```text
specs/008-site-image-assets/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (minimal — no unknowns)
├── data-model.md        # Phase 1 output (image mapping)
├── quickstart.md        # Phase 1 output (setup instructions)
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
site/
├── public/
│   └── images/
│       ├── services/
│       │   ├── card-basement-remodeling.webp     # NEW
│       │   ├── card-pavers-hardscapes.webp       # NEW
│       │   ├── card-retaining-walls.webp         # NEW
│       │   ├── card-artificial-turf.webp         # NEW
│       │   ├── hero-basement-remodeling.webp     # NEW
│       │   ├── hero-pavers-hardscapes.webp       # NEW
│       │   ├── hero-retaining-walls.webp         # NEW
│       │   └── hero-artificial-turf.webp         # NEW
│       └── team-steven-bunker.webp               # NEW
└── src/
    └── pages/
        ├── index.astro                           # MODIFIED (4 service card heroImage refs)
        ├── about.astro                           # MODIFIED (headshot ref)
        └── services/
            ├── basement-remodeling.astro          # MODIFIED (heroImage ref)
            ├── pavers-hardscapes.astro            # MODIFIED (heroImage ref)
            ├── retaining-walls.astro              # MODIFIED (heroImage ref)
            └── artificial-turf.astro              # MODIFIED (heroImage ref)
```

**Structure Decision**: All changes land in the existing `site/` directory structure. No new directories needed beyond what already exists.

## Implementation Steps

### Step 1: Convert and Copy Images to Site Assets

Convert all 9 source images from PNG/JPG to WebP and place them with clean filenames:

**Service Card Images** (homepage):
| Source | Target | Quality |
|--------|--------|---------|
| `~/Pictures/gemini-output/photorealistic-4k-hdr-professional-residential-construction-photography-a-20260325-145214.png` | `site/public/images/services/card-basement-remodeling.webp` | `-q 82` |
| `~/Pictures/gemini-output/photorealistic-4k-hdr-professional-residential-construction-photography-a-close-20260325-144109.png` | `site/public/images/services/card-pavers-hardscapes.webp` | `-q 82` |
| `~/Pictures/gemini-output/photorealistic-4k-hdr-professional-residential-construction-photography-an-20260325-144129.png` | `site/public/images/services/card-retaining-walls.webp` | `-q 82` |
| `~/Pictures/gemini-output/photorealistic-4k-hdr-professional-residential-construction-photography-a-20260325-144149.png` | `site/public/images/services/card-artificial-turf.webp` | `-q 82` |

**Service Hero Images** (detail pages):
| Source | Target | Quality |
|--------|--------|---------|
| `~/Pictures/gemini-output/photorealistic-4k-hdr-professional-residential-construction-photography-a-20260325-145233.png` | `site/public/images/services/hero-basement-remodeling.webp` | `-q 85` |
| `~/Pictures/gemini-output/photorealistic-4k-hdr-professional-residential-construction-photography-a-wide-20260325-144242.png` | `site/public/images/services/hero-pavers-hardscapes.webp` | `-q 85` |
| `~/Pictures/gemini-output/photorealistic-4k-hdr-professional-residential-construction-photography-a-wide-20260325-144303.png` | `site/public/images/services/hero-retaining-walls.webp` | `-q 85` |
| `~/Pictures/gemini-output/photorealistic-4k-hdr-professional-residential-construction-photography-a-wide-20260325-144326.png` | `site/public/images/services/hero-artificial-turf.webp` | `-q 85` |

**Headshot**:
| Source | Target | Quality |
|--------|--------|---------|
| `~/Downloads/bunker headshots/DSCF6812 profile headshot picture.jpg` | `site/public/images/team-steven-bunker.webp` | `-q 90` |

Quality rationale: Cards are smaller display size, so `-q 82` keeps them in the 34-50 KB range. Heroes are larger, so `-q 85` targets 150-200 KB. Headshot at `-q 90` for portrait detail.

### Step 2: Update Homepage Service Card Data

In `site/src/pages/index.astro`, update the fallback service data array to add `heroImage` objects for each of the 4 new services.

**Alt text for each card:**
- Basement Remodeling: "Finished basement living area with exterior entry door and large egress window flooding the space with natural light"
- Pavers & Hardscapes: "Interlocking paver patio with bistro dining set extending from a Utah home, Wasatch foothills in the background"
- Retaining Walls: "Tiered stone retaining walls with landscaping creating usable flat outdoor space in a sloped Utah backyard"
- Artificial Turf: "Vibrant green artificial turf lawn with paver borders and a dog playing in a fenced Utah backyard"

### Step 3: Update Service Detail Page Heroes

Update fallback data in each service page to include `heroImage`:

- `services/basement-remodeling.astro` → `hero-basement-remodeling.webp`
- `services/pavers-hardscapes.astro` → `hero-pavers-hardscapes.webp`
- `services/retaining-walls.astro` → `hero-retaining-walls.webp`
- `services/artificial-turf.astro` → `hero-artificial-turf.webp`

**Alt text for each hero:**
- Basement Remodeling: "Spacious transformed basement kitchen with island, pendant lighting, and exterior door opening to a paver patio walkout"
- Pavers & Hardscapes: "Complete hardscape installation featuring paver patio with fire pit, stone retaining wall, and outdoor furniture in a Utah backyard"
- Retaining Walls: "Multi-tiered engineered stone retaining wall system transforming a sloped Utah backyard into usable outdoor living space"
- Artificial Turf: "Family enjoying a lush artificial turf yard with paver borders, brown Utah foothills contrasting the year-round green"

### Step 4: Update About Page with Headshot

Update `site/src/pages/about.astro` to reference the headshot image in the team/founder section.

**Alt text:** "Steven Bunker, Founder of BaseScape"

### Step 5: Verify

Build the site locally with `npm run dev` and verify:
- All 4 homepage service cards show images (no placeholder SVGs)
- All 4 service detail pages show hero images
- About page shows Steven Bunker's headshot
- All images load without errors in browser dev tools
- File sizes are within expected ranges

## Complexity Tracking

No constitution violations to justify. This is a straightforward file operations + content update task.
