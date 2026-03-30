# Data Model: Site CTA and Phone Display Updates

**Feature**: 007-site-cta-updates
**Date**: 2026-03-25

## No Data Model Changes

This feature is a presentation-only change. No new entities, fields, or relationships are introduced.

### Existing Entities (unchanged)

- **Site Settings (CMS)**: Contains `phone` field (string). Already sourced by Header, MobileBottomBar, and CTABlock components via `fetchSiteSettings()`. No schema changes needed.

### State Transitions

None. The CTA buttons continue to link to the same `#estimate-form` anchor and `tel:` URLs. Only the visible text labels and icon placement change.
