# Quickstart: Lighthouse Audit Fixes

**Branch**: `002-lighthouse-fixes` | **Date**: 2026-03-24

## Prerequisites

- Node.js 18+
- pnpm installed
- Project dependencies installed (`pnpm install` from repo root)

## Development

```bash
# Start dev server (site)
cd site && pnpm dev

# Start CMS (separate terminal)
cd cms && pnpm dev
```

Site runs on `http://localhost:4322`, CMS on `http://localhost:3000`.

## Verification

After implementing fixes, verify with:

```bash
# 1. Build production site
cd site && pnpm build

# 2. Preview production build
pnpm preview

# 3. Run Lighthouse audit on production preview
# Use Chrome DevTools > Lighthouse tab on the preview URL
# OR use Lighthouse CLI:
npx lighthouse http://localhost:4322 --output=json --output-path=./lighthouse-after.json
```

### Manual Checks

| Check | How to Verify |
|-------|---------------|
| CTA contrast | DevTools > Inspect CTA button > Computed styles > check contrast ratio ≥ 4.5:1 |
| Font loading | Network tab > filter by "font" > both woff2 files return 200 |
| Font rendering | Visual check that Fraunces (headings) and Space Grotesk (body) render correctly |
| Hero images | Network tab > filter by "media" > hero images return 200 (requires CMS with uploaded images) |
| Link text | Accessibility tab > run axe audit > no "Links must have discernible text" violations |
| Console errors | Console tab > zero 404 errors on page load |

### Success Criteria Validation

| Criterion | Target | Tool |
|-----------|--------|------|
| SC-001: Accessibility score | 100% | Lighthouse (production build) |
| SC-002: SEO score | 100% | Lighthouse (production build) |
| SC-003: Zero 404s | 0 errors | Browser console |
| SC-004: CTA contrast | ≥ 4.5:1 | DevTools color picker / axe |
| SC-005: Best Practices | ≥ 96% | Lighthouse (production build) |
