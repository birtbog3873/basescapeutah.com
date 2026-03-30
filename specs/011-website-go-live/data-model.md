# Data Model: BaseScape Website Go-Live

**Branch**: `011-website-go-live` | **Date**: 2026-03-25

> No new entities are being created for go-live. This document maps the existing Payload CMS collections and their relationships as they exist in the codebase, for reference during implementation.

## Entities

### Lead
The core business entity -- a homeowner expressing interest.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| sessionId | string | yes | Client-generated UUID for multi-step tracking |
| status | enum | yes | partial, complete, abandoned, contacted, qualified |
| currentStep | number | no | 0-3 for multi-step form progress |
| serviceType | string | no | Selected service (walkout, egress, etc.) |
| zipCode | string | no | 5-digit zip |
| projectPurpose | string | no | Why the homeowner wants this service |
| timeline | string | no | When they want to start |
| name | string | no | Full name (required at step 3) |
| phone | string | no | Phone number (required at step 3) |
| email | string | no | Email address (required at step 3) |
| address | string | no | Street address (optional) |
| additionalNotes | string | no | Free text |
| formType | enum | yes | multi-step, quick-callback, lead-magnet |
| source | object | no | { page, utm_campaign, utm_source, utm_medium, referrer } |
| isOutOfServiceArea | boolean | no | Set by beforeValidate hook |
| confirmationSentAt | date | no | Timestamp of confirmation email |
| teamNotifiedAt | date | no | Timestamp of team notification |

**State transitions**: partial → complete (on step 3 or single-step submit) → contacted → qualified

### Service
Trade offering displayed on service pages.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | string | yes | Service name |
| slug | string | yes | URL slug |
| tagline | string | no | Short description |
| valuePillars | array | no | Key selling points |
| heroImage | relation(Media) | no | Hero image for service page |
| content | richtext | no | Lexical editor content |
| anxietyStack | array | no | 7-part objection neutralization |
| faqs | relation(FAQ[]) | no | Related FAQ entries |

**6 services**: walkout-basements, egress-windows, basement-remodeling, pavers, retaining-walls, artificial-turf

### ServiceArea
Geographic locations served, drives location pages.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| cityName | string | yes | City name |
| stateAbbrev | string | yes | State abbreviation |
| slug | string | yes | URL slug |
| county | string | no | County name |
| coordinates | object | no | { lat, lng } |
| serviceRadius | number | no | Miles |
| localContent | richtext | no | City-specific messaging |
| localReferences | array | no | Local landmarks/details |
| seoMetadata | object | no | Title, description |

**24 cities**: Provo, Orem, Sandy, Lehi, Draper, etc.

### Review
Customer testimonials.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| customerName | string | yes | Display name |
| content | text | yes | Testimonial text |
| rating | number | no | 1-5 stars |
| service | relation(Service) | no | Related service |
| featured | boolean | no | Show on homepage |

### SiteSettings (Global)
Business configuration.

| Field | Type | Notes |
|-------|------|-------|
| businessName | string | "BaseScape" |
| phone | string | Business phone number |
| email | string | Contact email |
| address | string | Business address |
| operatingHours | array | Day + open/close times |
| licenseNumber | string | Contractor license |
| insuranceInfo | string | Insurance details |
| serviceAreaZipCodes | array | Valid zip codes for service area validation |
| riskReversals | array | Trust signals (guarantee text) |
| showReviews | boolean | Toggle reviews display |
| showGallery | boolean | Toggle gallery display |

## Relationships

```
Lead ──references──→ Service (via serviceType string match)
Service ──has many──→ FAQ
Service ──has one──→ Media (heroImage)
Review ──belongs to──→ Service
ServiceArea ──independent── (no direct relations)
SiteSettings ──global── (referenced by zip validation hook)
```

## Changes Needed for Go-Live

1. **Add 2 missing services to seed**: basement-remodeling, retaining-walls
2. **Update SiteSettings seed**: correct phone, address, hours; set showReviews: true
3. **Replace placeholder content**: all service descriptions, FAQ text, review content with polished professional copy
4. **No schema changes required** -- all collections are already defined correctly
