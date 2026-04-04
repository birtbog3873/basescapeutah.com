# Data Model: Lead Magnet Dedicated Landing Pages

**Feature**: 014-lead-magnet-landing-pages
**Date**: 2026-04-04

## Entity: LeadMagnet (Extended)

The existing `LeadMagnets` CMS collection is extended with two new optional fields. No new collections are created.

### Current Fields (unchanged)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | text | yes | Resource title (max 100 chars) |
| slug | text | yes | URL identifier (unique) |
| description | textarea | yes | What the resource covers (max 300 chars) |
| file | upload (media) | yes | Downloadable PDF file |
| thumbnailImage | upload (media) | no | Preview image for CTA cards |
| ctaText | text | yes | Button label (default: "Download Free Guide") |
| requiredFields | select[] | yes | Form fields to collect: name, email, phone |
| status | select | yes | draft or published |

### New Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| coverImage | upload (media) | no | Front cover image of the PDF guide, displayed on the landing page. Separate from thumbnailImage (used in CTA cards). |
| benefits | richText (Lexical) | no | Benefits/highlights of the guide, displayed on the landing page. Supports bullet lists, bold text, formatting. |

### Field Placement

New fields are added in a "Landing Page" group after the existing `thumbnailImage` field:

```
title
slug
description
file
thumbnailImage
--- Landing Page Content ---
coverImage
benefits
--- Settings ---
ctaText
requiredFields
status
```

### Relationships

- **LeadMagnet → Media**: `file` (1:1, required), `thumbnailImage` (1:1, optional), `coverImage` (1:1, optional)
- **BlogPost → LeadMagnet**: `leadMagnetCTA` (many:1, optional) -- existing, unchanged
- **Service (hardcoded)**: Service pages reference lead magnets by slug in fallback data -- not a CMS relationship

### State Transitions

| From | To | Trigger | Effect |
|------|----|---------|--------|
| draft | published | Admin publishes | Landing page generated at next site build |
| published | draft | Admin unpublishes | Landing page removed at next site build; service page CTA hidden |

### Derived Data

- **Landing page URL**: `/guides/${slug}` -- computed from the slug field, not stored
- **CTA link URL**: `/guides/${slug}` -- passed to LeadMagnetCTA component as prop

### Validation Rules

- `coverImage` must be a valid media upload (image type) if provided
- `benefits` must be valid Lexical JSON if provided
- Existing validation rules (title max 100, description max 300, slug unique) remain unchanged
