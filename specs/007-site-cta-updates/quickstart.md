# Quickstart: Site CTA and Phone Display Updates

**Feature**: 007-site-cta-updates
**Date**: 2026-03-25

## What This Feature Does

Changes three things across the BaseScape site:
1. Renames "Get Free Estimate" buttons to "Book Appointment"
2. Replaces "Call Now" text with a phone icon + visible phone number
3. Adds a phone icon next to the phone number in the desktop navigation

## Files to Modify

| File | Change |
|------|--------|
| `site/src/components/layout/Header.astro` | Add phone icon to `header__phone`, rename CTA to "Book Appointment" |
| `site/src/components/layout/MobileBottomBar.astro` | Replace "Call Now" with phone number, rename "Free Estimate" to "Book Appointment" |
| `site/src/components/content/CTABlock.astro` | Replace "Call Now" with phone number, rename "Get Free Estimate" to "Book Appointment" |
| `site/tests/a11y/homepage.spec.ts` | Update selectors for new button text |
| `site/tests/visual/homepage.spec.ts` | Update comment/selectors for new button text |

## How to Verify

```bash
# Start dev server
cd site && pnpm dev

# Run tests
pnpm test:e2e
pnpm test:a11y
```

### Manual Checks
1. Desktop: Header shows phone icon + number in nav, "Book Appointment" CTA button
2. Mobile: Bottom bar shows phone icon + number (tap to call), "Book Appointment" button
3. Any page with CTABlock: phone icon + number, "Book Appointment" button
4. Click "Book Appointment" — form opens normally
5. Click phone number — initiates call (or shows tel: prompt on desktop)

## Key Decisions

- Form headings ("Get Your Free Estimate") are NOT changed — only CTA buttons
- The same inline SVG phone icon already used in MobileBottomBar/CTABlock is reused everywhere
- Phone number is dynamic from CMS with fallback to (888) 414-0007
