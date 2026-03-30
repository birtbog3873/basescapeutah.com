# Tasks: Integrate Site Images

**Feature**: 006-integrate-site-images
**Generated**: 2026-03-25

## Phase 1: Setup

- [x] **T-001**: Create `site/public/images/services/` directory
- [x] **T-002**: Optimize and copy 4 hero images (1200x805 WebP, all <200KB)
- [x] **T-003**: Optimize and copy 3 card images (600x402 WebP, all <50KB)

## Phase 2: Core Implementation

- [x] **T-004**: Update `site/src/pages/index.astro` — replace hero SVG placeholder with `<img>` tag for `hero-homepage.webp`
- [x] **T-005**: Update `site/src/pages/index.astro` — add `heroImage` to fallback services array for all 3 service cards
- [x] **T-006**: Update `site/src/pages/services/walkout-basements.astro` — add `heroImage` to fallback service data
- [x] **T-007**: Update `site/src/pages/services/egress-windows.astro` — add `heroImage` to fallback service data
- [x] **T-008**: Update `site/src/pages/services/window-well-upgrades.astro` — add `heroImage` to fallback service data

## Phase 3: Validation

- [x] **T-009**: Build the site (`pnpm build`) and verify no errors
- [x] **T-010**: Verify all 7 image files are under size limits
