# Data Model: Lighthouse Audit Fixes

**Branch**: `002-lighthouse-fixes` | **Date**: 2026-03-24

## Overview

This feature does not introduce new data entities. All changes are to presentation-layer tokens, templates, and existing CMS content. Documented here for completeness.

## Affected Entities

### Design Tokens (CSS Custom Properties)

| Token | Current Value | New Value | Used By |
|-------|--------------|-----------|---------|
| `--color-ctaPrimaryBg` | `#B87308` | `#946106` | CTABlock, MobileBottomBar, skip-link |
| `--font-serif` | `'Fraunces', Georgia, ...` | `'Fraunces Variable', Georgia, ...` | All serif text |
| `--font-sans` | `'Space Grotesk', system-ui, ...` | `'Space Grotesk Variable', system-ui, ...` | All sans-serif text |

These tokens are defined in two locations that must stay synchronized:
1. `site/src/styles/global.css` (CSS custom properties in `:root`)
2. `site/src/styles/theme.css.ts` (Vanilla Extract `createGlobalTheme()`)

### Media (Payload CMS)

| Entity | Collection | Issue |
|--------|-----------|-------|
| Hero images | `media` | Placeholder seed data creates 1x1 PNGs; actual images need uploading via admin |

No schema changes needed — the Media collection already supports JPEG, PNG, WebP, AVIF, and PDF.
