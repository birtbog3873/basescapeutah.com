# Research: Integrate Site Images

## R-001: Image Format Choice

**Decision**: WebP
**Rationale**: WebP provides 25-35% smaller file sizes than PNG at equivalent quality. All modern browsers support it. The site already uses plain `<img>` tags, so no build tooling changes needed.
**Alternatives considered**:
- PNG (source format) — larger files, no benefit
- AVIF — better compression but slower to encode, less browser support (Safari 16+ only)
- Keep PNG and rely on Cloudflare polish — adds CDN dependency for optimization

## R-002: Image Storage Location

**Decision**: `site/public/images/services/`
**Rationale**: The site has no `src/assets/` directory and doesn't use Astro's Image component or `sharp`. Images in `public/` are served as-is, matching the existing pattern (`public/images/basescape-logo.png`). No build pipeline changes needed.
**Alternatives considered**:
- `src/assets/` with Astro Image — requires adding `sharp` dependency, refactoring all `<img>` tags to `<Image>` components, significant scope creep
- Upload to Payload CMS/R2 — correct long-term path, but CMS isn't running locally and this adds deployment dependency

## R-003: Image Optimization Approach

**Decision**: Pre-optimize images at copy time using macOS `sips` for resize + `cwebp` for WebP conversion
**Rationale**: One-time optimization at asset preparation time. No build-time dependency needed. `sips` is built into macOS. `cwebp` available via Homebrew if needed (or `sharp-cli` via npx).
**Alternatives considered**:
- Add `@astrojs/image` to the build pipeline — overkill for 7 static images, adds build complexity
- Use a CDN image proxy (Cloudflare Polish) — not available on all plans, hides optimization

## R-004: CMS Override Behavior

**Decision**: Fallback data provides `heroImage` as a default; CMS data takes precedence when available
**Rationale**: The existing code pattern fetches from CMS first, falls back to hardcoded data only when CMS is unavailable. By adding `heroImage` to the fallback data, images appear in both scenarios. When CMS returns a service with its own `heroImage`, that value is used instead.
**Alternatives considered**:
- Only add images to CMS — requires CMS to be running/seeded, doesn't work in static fallback mode
- Hardcode image paths directly in components — breaks the CMS-first architecture

## R-005: Image Dimensions

**Decision**: Hero images at 1200x800, card images at 600x400
**Rationale**: These match the existing `width`/`height` attributes already in the components:
- `ServiceLayout.astro` line 88: `width="1200" height="800"`
- `ServiceCard.astro` line 27: `width="600" height="400"`

Using matching dimensions prevents any "properly size images" Lighthouse warnings.
