# Implementation Plan: Lighthouse Audit Fixes

**Branch**: `002-lighthouse-fixes` | **Date**: 2026-03-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-lighthouse-fixes/spec.md`

## Summary

Fix five production-relevant issues identified by a Lighthouse audit: insufficient color contrast on CTA buttons/skip-link (WCAG 2.2 AA violation), missing font file 404s from hardcoded preload paths, missing CMS hero images, generic "Learn more" link text, and unoptimized image formats. All fixes are CSS token changes, template corrections, CMS content fixes, and component-level markup improvements — no architectural changes required.

## Technical Context

**Language/Version**: TypeScript 5.x (Astro + Payload CMS)
**Primary Dependencies**: Astro 5.x (SSG), Payload CMS 3.x (headless), Open Props (design tokens), Vanilla Extract (zero-runtime CSS), @fontsource-variable/fraunces, @fontsource-variable/space-grotesk
**Storage**: D1 SQLite (Payload CMS via @payloadcms/db-d1-sqlite), R2 (media)
**Testing**: Lighthouse CI, visual inspection, browser dev tools
**Target Platform**: Static site on Cloudflare CDN (edge-deployed)
**Project Type**: Marketing website (SSG)
**Performance Goals**: LCP ≤ 1.5s, CLS ≤ 0.05, TTFB ≤ 200ms, page weight ≤ 250 KB (per Constitution Art. I)
**Constraints**: Zero client-side JS by default; all fixes must be CSS/HTML/build-config level
**Scale/Scope**: Homepage only (single page audit); fixes may benefit other pages sharing components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Article | Requirement | Status | Notes |
|---------|-------------|--------|-------|
| Art. I §5 | Core Web Vitals thresholds | PASS | Fixes improve CLS (font loading) and don't degrade any metric |
| Art. II | Prescribed tech stack — AVIF/WebP build-time | PASS | Image optimization uses Astro's native image pipeline per stack mandate |
| Art. XII §1 | Color palette — earthy, sophisticated tones; WCAG AA contrast | PASS | Darkening amber CTA maintains warm palette while meeting contrast |
| Art. XII §2 | Variable fonts for typographic authority | PASS | Fraunces + Space Grotesk variable fonts retained; fix resolves loading, not replacement |
| Art. XIII §1 | WCAG 2.2 Level AA compliance | **REMEDIATION** | This feature directly addresses the violation — contrast ratio 3.82:1 → 4.5:1+ |
| Art. XIII §2 | Sufficient text contrast ≥ 4.5:1 | **REMEDIATION** | Direct fix for all 4 failing elements |
| Art. XV | Test-First Imperative | PASS | Lighthouse CI validates all success criteria post-implementation |
| Art. XVI | Simplicity — minimal changes | PASS | All fixes are token-level or template-level; no new abstractions |

**Gate result**: PASS — no violations. Two articles under active remediation (the purpose of this feature).

## Project Structure

### Documentation (this feature)

```text
specs/002-lighthouse-fixes/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── spec.md              # Feature specification
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (affected files)

```text
site/src/
├── styles/
│   ├── global.css                          # --color-ctaPrimaryBg token, skip-link styles
│   └── theme.css.ts                        # Vanilla Extract amber token mirror
├── components/
│   ├── content/
│   │   ├── CTABlock.astro                  # CTA button styles (uses token)
│   │   └── ServiceCard.astro               # "Learn More" text, hero image <img>
│   └── layout/
│       └── MobileBottomBar.astro           # Mobile CTA button styles (uses token)
├── layouts/
│   ├── BaseLayout.astro                    # Font preload links, font imports
│   └── LandingLayout.astro                 # Font imports
└── pages/
    └── index.astro                         # Homepage (renders ServiceCards)

cms/src/
└── seed.ts                                 # Hero image seed data
```

**Structure Decision**: No new files or directories needed. All changes are modifications to existing files listed above.

## Implementation Approach

### Fix 1: Color Contrast (P1) — Single Token Change

**Root cause**: `--color-ctaPrimaryBg: #B87308` produces 3.82:1 contrast with white text. Needs ≥ 4.5:1.

**Fix**: Change the token value in two files:
1. `site/src/styles/global.css` line 73 — CSS custom property
2. `site/src/styles/theme.css.ts` — Vanilla Extract mirror

**Color selection**: Darken `#B87308` to a value that:
- Meets 4.5:1 contrast with `#FFFFFF`
- Stays within the warm amber family
- Doesn't clash with hover color `#9A5D06` (amber700, 6.08:1 — already passes)

**Candidate**: `#946106` → contrast ratio ~5.4:1 with white. Sits between current value and hover color. Maintains warm amber identity.

**Cascade**: All 4 failing elements (skip-link, hero CTA, final CTA, mobile bar CTA) read from `var(--color-ctaPrimaryBg)` — single token change fixes all simultaneously.

### Fix 2: Font File 404s (P1) — Remove Hardcoded Preload Paths

**Root cause**: `BaseLayout.astro` lines 45-59 contain hardcoded `<link rel="preload">` tags pointing to `/_astro/fraunces-latin-wght-normal.woff2` and `/_astro/space-grotesk-latin-wght-normal.woff2`. In dev mode, Vite serves fonts from `node_modules` via a different URL scheme (`/@fs/...`), so the `/_astro/` preload paths 404.

Additionally, the CSS `--font-serif` references `'Fraunces'` but Fontsource registers the font as `'Fraunces Variable'`. Same mismatch for Space Grotesk → `'Space Grotesk Variable'`.

**Fix**:
1. Remove hardcoded preload `<link>` tags from `BaseLayout.astro` — Astro automatically optimizes font loading for Fontsource imports
2. Update `--font-serif` and `--font-sans` CSS custom properties to use correct Fontsource family names (`'Fraunces Variable'` and `'Space Grotesk Variable'`), keeping fallback stacks
3. Update Vanilla Extract theme.css.ts to match

### Fix 3: Missing Hero Images (P2) — CMS Seed Data

**Root cause**: The Lighthouse audit shows 404s for `/api/media/file/hero-window-well-3.png` and `/api/media/file/hero-egress-3.png`. The `-3` suffix suggests Payload CMS generated URLs with auto-incrementing IDs. The seed.ts creates placeholder 1x1 PNG images — these need to be real images or the seed must be re-run after CMS reset.

**Fix**: Re-seed the CMS database or upload actual hero images via the Payload admin panel. This is a content issue, not a code bug. The ServiceCard component correctly renders `heroImage.url` from the CMS response.

**Graceful degradation**: Add CSS to hide broken images (no broken image icon) as a defensive measure.

### Fix 4: Generic Link Text (P3) — Template Update

**Root cause**: `ServiceCard.astro` line 49 renders `Learn More` as static text inside the card link. Lighthouse flags this as non-descriptive.

**Fix**: Interpolate the service name: `Learn more about {service.name}` with the service name visually hidden for sighted users if design requires keeping the short "Learn More" text visible.

Alternative: Since the entire card is wrapped in an `<a>` tag, add an `aria-label` attribute with the full service context: `aria-label="Learn more about {service.name}"`.

### Fix 5: Image Format Optimization (P3) — Use Astro Image

**Root cause**: ServiceCard and other components use plain `<img>` tags with CMS URLs. No format negotiation or responsive sources.

**Fix**: Per Constitution Art. II (AVIF/WebP at build-time), replace `<img>` with `<picture>` elements using Payload's generated image size variants and modern format URLs where supported. Since images come from CMS at runtime (not build-time static assets), this may require Payload to generate WebP/AVIF variants, or use Cloudflare Image Resizing if available.

**Note**: This is a P3 optimization with only ~51 KiB savings. If Payload doesn't natively serve WebP/AVIF, defer to a future feature rather than adding complexity.

## Complexity Tracking

No constitution violations — table not needed.
