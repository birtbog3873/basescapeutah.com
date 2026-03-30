# Research: Lighthouse Audit Fixes

**Branch**: `002-lighthouse-fixes` | **Date**: 2026-03-24

## R-001: CTA Button Contrast Color

**Decision**: Darken `--color-ctaPrimaryBg` from `#B87308` to `#946106`

**Rationale**:
- Current contrast with `#FFFFFF`: 3.82:1 (fails WCAG 2.2 AA minimum 4.5:1)
- `#946106` contrast with `#FFFFFF`: ~5.4:1 (passes AA for all text sizes)
- Hover color `#9A5D06` has ~6.08:1 contrast (already passes — no change needed)
- `#946106` maintains warm amber identity, sits naturally in the existing palette between `amber600` (#C27708) and `amber700` (#9A5D06)
- All 4 failing elements share `var(--color-ctaPrimaryBg)` — single token change

**Alternatives considered**:
- `#8a5a00` (5.36:1) — slightly too dark, loses warmth
- `#A06A07` (4.6:1) — barely passes, no headroom for sub-pixel rendering variance
- Switching to dark text on amber background — breaks brand identity and CTA visual hierarchy

**Files to change**:
1. `site/src/styles/global.css` line 73: `--color-ctaPrimaryBg: #B87308` → `#946106`
2. `site/src/styles/theme.css.ts`: mirror the same value in Vanilla Extract theme

## R-002: Font File 404 Root Cause

**Decision**: Remove hardcoded `<link rel="preload">` tags; fix font-family name mismatch

**Rationale**:
- `BaseLayout.astro` lines 45-59 hardcode preload paths: `/_astro/fraunces-latin-wght-normal.woff2`
- In dev mode, Vite serves fonts via `/@fs/node_modules/...` — the `/_astro/` paths don't exist
- In production, Astro hashes font filenames (e.g., `fraunces-latin-wght-normal.BxK3q2.woff2`) — hardcoded paths would also 404
- Astro 5.x automatically handles font preloading for Fontsource imports — manual preload tags are unnecessary and harmful
- Font-family mismatch: CSS declares `'Fraunces'` but Fontsource registers `'Fraunces Variable'`; same for Space Grotesk → `'Space Grotesk Variable'`

**Alternatives considered**:
- Move fonts to `public/fonts/` for stable paths — adds maintenance burden, loses Astro build optimization
- Use Astro's `@astrojs/fonts` integration — not yet stable, overkill for this fix
- Keep preload tags but dynamicize paths — unnecessary complexity when Astro handles this natively

**Files to change**:
1. `site/src/layouts/BaseLayout.astro`: Remove lines 45-59 (preload links)
2. `site/src/styles/global.css` lines 101-102: `'Fraunces'` → `'Fraunces Variable'`, `'Space Grotesk'` → `'Space Grotesk Variable'`
3. `site/src/styles/theme.css.ts` lines 102-105: Mirror the font-family name fix

## R-003: Hero Image 404s

**Decision**: This is a CMS content issue, not a code bug. Add graceful degradation in CSS.

**Rationale**:
- `cms/src/seed.ts` creates placeholder 1x1 PNG images named `hero-window-well`, `hero-egress`, `hero-walkout`
- The 404 URLs include a `-3` suffix (e.g., `hero-window-well-3.png`) — Payload CMS likely auto-incremented the filename on a re-seed
- The ServiceCard component correctly renders `heroImage.url` from the CMS API response — no code bug
- Fix requires either: (a) re-seeding with correct filenames, or (b) uploading real hero images via Payload admin
- Real hero images will be needed for launch regardless — placeholder fix is temporary

**Alternatives considered**:
- Modify seed.ts to use fixed filenames — doesn't solve the underlying need for real images
- Proxy images through Astro — adds SSR complexity, violates Art. I (static-first)
- Serve fallback images from `/public/` — masks the real issue (CMS content not populated)

**Files to change**:
1. `site/src/styles/global.css`: Add defensive CSS for broken images (no broken image icon)
2. CMS admin: Upload actual hero images (manual step, not code)

## R-004: "Learn More" Link Text

**Decision**: Add `aria-label` with service name to the card's `<a>` wrapper

**Rationale**:
- `ServiceCard.astro` line 49 renders static "Learn More" text inside each card link
- Lighthouse flags this as non-descriptive for screen readers and SEO
- The "Learn more" Lighthouse flagged pointing to Astro docs (`https://docs.astro.build/...`) is likely from the Astro dev toolbar overlay — separate from the ServiceCard issue
- The entire ServiceCard is wrapped in an `<a>` tag on the homepage — adding `aria-label="Learn more about {service.name}"` provides context
- Visual text can remain "Learn More" for design consistency while accessible name is descriptive

**Alternatives considered**:
- Change visible text to "Learn more about {name}" — may break card layout at longer names
- Use `sr-only` span with service name — functionally equivalent to aria-label but more markup
- Remove "Learn More" text entirely (card is already clickable) — reduces affordance for sighted users

**Files to change**:
1. `site/src/components/content/ServiceCard.astro`: Add `aria-label` attribute to the wrapping `<a>` tag
2. If the Astro dev toolbar "Learn more" link persists in production builds, investigate removal

## R-005: Image Format Optimization

**Decision**: Defer to future feature. Minimal impact (~51 KiB) doesn't justify complexity.

**Rationale**:
- Lighthouse identified ~51 KiB savings from modern image formats
- Current images are served from Payload CMS via plain `<img>` tags
- Payload CMS Media collection already accepts WebP and AVIF MIME types
- However, implementing `<picture>` with format negotiation for CMS-served images requires either:
  - Payload generating multiple format variants (not currently configured)
  - Cloudflare Image Resizing (additional service)
  - Build-time image processing (not applicable for dynamic CMS content)
- Constitution Art. II mandates "AVIF/WebP (build-time)" — applies to static assets, not CMS-served images
- Per Art. XVI (Simplicity), adding image pipeline complexity for 51 KiB savings is not justified at V1

**Alternatives considered**:
- Cloudflare Polish (auto-converts images) — requires paid plan, external dependency
- Custom Astro middleware for image conversion — violates Art. I (static-first, no request-time processing)
- Payload CMS image hooks to generate WebP/AVIF on upload — good future enhancement, not V1 scope

**Files to change**: None (deferred)
