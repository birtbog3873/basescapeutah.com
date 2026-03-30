# Data Model: BaseScape Website V1

> Phase 1 output | Generated 2026-03-23 | 10 collections, 2 globals

## Overview

All entities are Payload CMS 3.x collections or globals, defined code-first in TypeScript. The database is Cloudflare D1 (SQLite) via `@payloadcms/db-d1-sqlite`. Media files are stored in Cloudflare R2. All collections support Payload's built-in draft/publish workflow, access control, and admin UI.

---

## Collections

### 1. Services

Represents BaseScape's core service offerings. Each service has a dedicated page on the site.

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `id` | auto | — | — | Payload auto-generated |
| `title` | text | ✅ | maxLength: 100 | e.g., "Walkout Basements" |
| `slug` | text | ✅ | unique, URL-safe | e.g., "walkout-basements". Auto-generated from title. |
| `tagline` | text | ✅ | maxLength: 200 | Benefit-driven one-liner |
| `primaryValuePillar` | select | ✅ | enum: `financial`, `safety`, `transformation` | Per FR-009: one primary pillar |
| `supportingPillars` | select (multi) | ❌ | enum: same as above | Supporting context pillars |
| `heroImage` | upload (Media) | ✅ | — | Hero image for service page |
| `overview` | richText | ✅ | — | Service description (Payload's lexical editor) |
| `process` | array | ✅ | minRows: 3 | Ordered process steps |
| `process.stepTitle` | text | ✅ | maxLength: 100 | |
| `process.stepDescription` | richText | ✅ | — | |
| `process.stepImage` | upload (Media) | ❌ | — | |
| `anxietyStack` | group | ✅ | — | Addresses FR-008 objections |
| `anxietyStack.structuralSafety` | richText | ✅ | — | |
| `anxietyStack.codeCompliance` | richText | ✅ | — | |
| `anxietyStack.drainageMoisture` | richText | ✅ | — | |
| `anxietyStack.dustDisruption` | richText | ✅ | — | |
| `anxietyStack.costAffordability` | richText | ✅ | — | |
| `anxietyStack.aesthetics` | richText | ✅ | — | |
| `anxietyStack.timeline` | richText | ✅ | — | |
| `differentiator` | richText | ❌ | — | e.g., "Surgical Extraction Protocol" |
| `faqs` | relationship (FAQs) | ❌ | hasMany: true | Linked FAQ items |
| `projects` | relationship (Projects) | ❌ | hasMany: true | Linked case studies |
| `reviews` | relationship (Reviews) | ❌ | hasMany: true | Linked reviews |
| `ctaHeadline` | text | ❌ | maxLength: 100 | Service-specific CTA text |
| `seo` | group | ✅ | — | SEO metadata |
| `seo.metaTitle` | text | ✅ | maxLength: 60 | |
| `seo.metaDescription` | textarea | ✅ | maxLength: 160 | |
| `seo.ogImage` | upload (Media) | ❌ | — | |
| `status` | select | ✅ | enum: `draft`, `published` | Payload draft/publish |
| `createdAt` | date | auto | — | |
| `updatedAt` | date | auto | — | |

**Access Control**: Admin-only write. Public read for published documents.

---

### 2. ServiceAreas

Geographic markets BaseScape serves. Each generates a unique location page.

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `id` | auto | — | — | |
| `cityName` | text | ✅ | maxLength: 60 | e.g., "Draper" |
| `stateAbbrev` | text | ✅ | default: "UT", maxLength: 2 | |
| `slug` | text | ✅ | unique, URL-safe | e.g., "draper-ut" |
| `county` | select | ✅ | enum: `utah`, `salt-lake`, `davis` | |
| `coordinates` | group | ✅ | — | For schema markup (FR-023) |
| `coordinates.lat` | number | ✅ | min: 39.0, max: 42.0 | |
| `coordinates.lng` | number | ✅ | min: -113.0, max: -109.0 | |
| `serviceRadius` | number | ✅ | default: 15 | Miles |
| `localContent` | richText | ✅ | — | Unique localized copy (FR-022: not template-swapped) |
| `localReferences` | textarea | ✅ | — | Genuine local references (landmarks, neighborhoods, concerns) |
| `localProjects` | relationship (Projects) | ❌ | hasMany: true | Projects completed in this area |
| `localReviews` | relationship (Reviews) | ❌ | hasMany: true | Reviews from this area |
| `localFAQs` | relationship (FAQs) | ❌ | hasMany: true | City-specific FAQ overrides |
| `heroImage` | upload (Media) | ❌ | — | City-specific hero or fallback to service |
| `seo` | group | ✅ | — | |
| `seo.metaTitle` | text | ✅ | maxLength: 60 | e.g., "Walkout Basements in Draper, UT" |
| `seo.metaDescription` | textarea | ✅ | maxLength: 160 | |
| `status` | select | ✅ | enum: `draft`, `published` | |
| `createdAt` | date | auto | — | |
| `updatedAt` | date | auto | — | |

**Initial Data**: 25 launch cities per FR-022 (Provo, Orem, Sandy, Lehi, South Jordan, Herriman, Taylorsville, Eagle Mountain, Draper, Saratoga Springs, Riverton, Spanish Fork, Pleasant Grove, American Fork, Springville, Payson, Bluffdale, Santaquin, Mapleton, Alpine, Salem, Cedar Hills, Nephi, Mona, Elk Ridge).

---

### 3. Leads

Submitted prospect records. Core revenue entity.

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `id` | auto | — | — | |
| `sessionId` | text | ✅ | UUID format | Client-generated, links partial steps |
| `status` | select | ✅ | enum: `partial`, `complete`, `abandoned`, `contacted`, `qualified` | State machine (see below) |
| `currentStep` | number | ✅ | min: 0, max: 3 | Last completed step |
| `serviceType` | select | ❌ | enum: `walkout-basement`, `egress-window`, `window-well-upgrade`, `not-sure` | Step 1 |
| `zipCode` | text | ❌ | regex: `^\d{5}$` | Step 1 |
| `projectPurpose` | select | ❌ | enum: `rental-unit`, `family-space`, `home-office`, `safety-compliance`, `other` | Step 2 |
| `timeline` | select | ❌ | enum: `asap`, `1-3-months`, `3-6-months`, `6-plus-months`, `just-researching` | Step 2 |
| `name` | text | ❌ | maxLength: 100 | Step 3 |
| `phone` | text | ❌ | regex: phone validation | Step 3 |
| `email` | email | ❌ | — | Step 3 |
| `address` | text | ❌ | maxLength: 200 | Step 3 (autocomplete) |
| `additionalNotes` | textarea | ❌ | maxLength: 1000 | Optional free text |
| `source` | group | ✅ | — | Attribution (FR-020) |
| `source.page` | text | ✅ | — | Page URL where form was submitted |
| `source.utmSource` | text | ❌ | — | |
| `source.utmMedium` | text | ❌ | — | |
| `source.utmCampaign` | text | ❌ | — | |
| `source.utmContent` | text | ❌ | — | |
| `source.utmTerm` | text | ❌ | — | |
| `source.referrer` | text | ❌ | — | HTTP referer |
| `isOutOfServiceArea` | checkbox | ✅ | default: false | Flag for zip codes outside service area |
| `formType` | select | ✅ | enum: `multi-step`, `quick-callback`, `lead-magnet` | Which form was used |
| `confirmationSentAt` | date | ❌ | — | Timestamp of confirmation email |
| `teamNotifiedAt` | date | ❌ | — | Timestamp of team notification |
| `createdAt` | date | auto | — | |
| `updatedAt` | date | auto | — | |

**State Transitions**:
```
partial → complete    (Step 3 submitted)
partial → abandoned   (TTL expiry: 24 hours with no update)
complete → contacted  (Manual: team follows up)
contacted → qualified (Manual: team qualifies lead)
```

**Access Control**: Admin-only read/write. No public access. Leads are created via Astro Actions calling Payload REST API with an API key.

**Hooks**:
- `afterChange` (on status change to `complete`): Send confirmation email to homeowner, send notification email to team.
- `beforeValidate`: Check zip code against service area list, set `isOutOfServiceArea` flag.

---

### 4. Projects (Case Studies / Gallery)

Completed project examples with before-and-after imagery.

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `id` | auto | — | — | |
| `title` | text | ✅ | maxLength: 100 | e.g., "Draper Walkout — Full Basement Access" |
| `slug` | text | ✅ | unique, URL-safe | |
| `projectType` | relationship (Services) | ✅ | — | Which service this project represents |
| `city` | relationship (ServiceAreas) | ✅ | — | Where the project was completed |
| `challenge` | richText | ✅ | — | What the homeowner needed |
| `solution` | richText | ✅ | — | What BaseScape did |
| `outcome` | richText | ✅ | — | Results and homeowner impact |
| `beforeImages` | array | ✅ | minRows: 1 | |
| `beforeImages.image` | upload (Media) | ✅ | — | |
| `beforeImages.caption` | text | ❌ | maxLength: 200 | |
| `afterImages` | array | ✅ | minRows: 1 | |
| `afterImages.image` | upload (Media) | ✅ | — | |
| `afterImages.caption` | text | ❌ | maxLength: 200 | |
| `detailImages` | array | ❌ | — | Close-up craftsmanship shots |
| `detailImages.image` | upload (Media) | ✅ | — | |
| `detailImages.caption` | text | ❌ | maxLength: 200 | |
| `featured` | checkbox | ✅ | default: false | Show on homepage/gallery |
| `seo` | group | ❌ | — | |
| `status` | select | ✅ | enum: `draft`, `published` | |
| `createdAt` | date | auto | — | |
| `updatedAt` | date | auto | — | |

**Access Control**: Admin write. Public read for published.

---

### 5. FAQs

Reusable question-and-answer pairs tagged to services/pages (FR-035, FR-036).

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `id` | auto | — | — | |
| `question` | text | ✅ | maxLength: 200 | |
| `answer` | richText | ✅ | — | |
| `category` | select | ✅ | enum: `cost`, `code-compliance`, `city-variability`, `timeline`, `disruption`, `financing-rebates`, `drainage-moisture`, `rental-readiness`, `general` | Per FR-035 |
| `applicableServices` | relationship (Services) | ❌ | hasMany: true | Which service pages show this FAQ |
| `applicableAreas` | relationship (ServiceAreas) | ❌ | hasMany: true | Which city pages show this FAQ |
| `sortOrder` | number | ❌ | default: 0 | Display priority |
| `status` | select | ✅ | enum: `draft`, `published` | |
| `createdAt` | date | auto | — | |

**Access Control**: Admin write. Public read for published.

---

### 6. Reviews

Manually curated customer reviews with source attribution (FR-026). V1 only — Phase 2 replaces with Google Places API.

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `id` | auto | — | — | |
| `reviewerName` | text | ✅ | maxLength: 60 | |
| `reviewText` | textarea | ✅ | maxLength: 500 | |
| `starRating` | number | ✅ | min: 1, max: 5 | |
| `city` | relationship (ServiceAreas) | ❌ | — | Where the reviewer is from |
| `serviceType` | relationship (Services) | ❌ | — | Which service they used |
| `source` | text | ✅ | maxLength: 60 | e.g., "via Google", "via Yelp" |
| `reviewDate` | date | ❌ | — | When the review was written |
| `featured` | checkbox | ✅ | default: false | Show on homepage |
| `status` | select | ✅ | enum: `draft`, `published` | |
| `createdAt` | date | auto | — | |

---

### 7. LeadMagnets

Gated educational resources (FR-037, FR-038).

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `id` | auto | — | — | |
| `title` | text | ✅ | maxLength: 100 | e.g., "Utah ADU Compliance Checklist" |
| `slug` | text | ✅ | unique | |
| `description` | textarea | ✅ | maxLength: 300 | What the resource covers |
| `file` | upload (Media) | ✅ | — | Downloadable file (PDF) |
| `thumbnailImage` | upload (Media) | ❌ | — | Preview image for CTA |
| `ctaText` | text | ✅ | default: "Download Free Guide" | |
| `requiredFields` | select (multi) | ✅ | enum: `name`, `email`, `phone` | Which fields the capture form requires |
| `status` | select | ✅ | enum: `draft`, `published` | |
| `createdAt` | date | auto | — | |

---

### 8. BlogPosts

Educational content for organic SEO (FR-039, FR-040).

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `id` | auto | — | — | |
| `title` | text | ✅ | maxLength: 100 | |
| `slug` | text | ✅ | unique, URL-safe | |
| `excerpt` | textarea | ✅ | maxLength: 300 | |
| `heroImage` | upload (Media) | ❌ | — | |
| `content` | richText | ✅ | — | Payload lexical editor with embedded CTAs |
| `category` | select | ✅ | enum: `walkout-basements`, `egress-windows`, `window-wells`, `adu-compliance`, `financing`, `local-guides`, `safety` | |
| `relatedServices` | relationship (Services) | ❌ | hasMany: true | Internal linking targets (FR-040) |
| `leadMagnetCTA` | relationship (LeadMagnets) | ❌ | — | Embedded lead magnet CTA (FR-040) |
| `author` | text | ✅ | maxLength: 60 | |
| `publishDate` | date | ✅ | — | |
| `seo` | group | ✅ | — | |
| `seo.metaTitle` | text | ✅ | maxLength: 60 | |
| `seo.metaDescription` | textarea | ✅ | maxLength: 160 | |
| `status` | select | ✅ | enum: `draft`, `published` | |
| `createdAt` | date | auto | — | |
| `updatedAt` | date | auto | — | |

---

### 9. Offers

Time-bound or evergreen promotions.

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `id` | auto | — | — | |
| `headline` | text | ✅ | maxLength: 100 | |
| `description` | richText | ✅ | — | |
| `terms` | textarea | ❌ | maxLength: 500 | Offer terms and conditions |
| `startDate` | date | ✅ | — | |
| `endDate` | date | ❌ | — | Null = evergreen |
| `applicableServices` | relationship (Services) | ❌ | hasMany: true | |
| `applicablePages` | select (multi) | ❌ | enum: `homepage`, `service`, `location`, `landing-page` | Where to display |
| `status` | select | ✅ | enum: `draft`, `active`, `expired` | |
| `createdAt` | date | auto | — | |

---

### 10. PaidLandingPages

Campaign-specific conversion pages (FR-041, FR-042).

| Field | Type | Required | Validation | Notes |
|-------|------|----------|------------|-------|
| `id` | auto | — | — | |
| `campaignSlug` | text | ✅ | unique, URL-safe | URL path under `/lp/` |
| `headline` | text | ✅ | maxLength: 100 | Aligned with ad copy |
| `subheadline` | text | ❌ | maxLength: 200 | |
| `heroImage` | upload (Media) | ❌ | — | |
| `bodyContent` | richText | ✅ | — | Focused offer content |
| `trustBadges` | select (multi) | ✅ | enum: `licensed`, `insured`, `bonded`, `free-estimate`, `no-hidden-charges`, `dust-containment` | |
| `formType` | select | ✅ | enum: `multi-step`, `quick-callback` | Which form to embed |
| `offer` | relationship (Offers) | ❌ | — | Associated offer |
| `targetService` | relationship (Services) | ❌ | — | For form pre-selection |
| `suppressNavigation` | checkbox | ✅ | default: true | FR-041: suppress standard nav |
| `utmCampaign` | text | ❌ | — | Expected campaign tag for analytics |
| `seo` | group | ✅ | — | |
| `seo.metaTitle` | text | ✅ | maxLength: 60 | |
| `seo.metaDescription` | textarea | ✅ | maxLength: 160 | |
| `seo.noindex` | checkbox | ✅ | default: true | Landing pages typically noindex |
| `status` | select | ✅ | enum: `draft`, `published` | |
| `createdAt` | date | auto | — | |

---

## Globals

### SiteSettings

Site-wide configuration values. Single document.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `businessName` | text | ✅ | "BaseScape" |
| `phone` | text | ✅ | Must match GBP character-for-character (FR-024) |
| `email` | email | ✅ | Business email |
| `address` | group | ✅ | Physical address |
| `address.street` | text | ✅ | |
| `address.city` | text | ✅ | |
| `address.state` | text | ✅ | |
| `address.zip` | text | ✅ | |
| `operatingHours` | array | ✅ | Days + hours for schema markup |
| `operatingHours.day` | select | ✅ | enum: Mon-Sun |
| `operatingHours.open` | text | ✅ | e.g., "08:00" |
| `operatingHours.close` | text | ✅ | e.g., "18:00" |
| `licenseNumber` | text | ✅ | For trust badges |
| `insuranceInfo` | text | ✅ | |
| `socialLinks` | group | ❌ | |
| `socialLinks.google` | text | ❌ | GBP URL |
| `socialLinks.facebook` | text | ❌ | |
| `socialLinks.instagram` | text | ❌ | |
| `riskReversals` | array | ✅ | FR-028 statements |
| `riskReversals.statement` | text | ✅ | e.g., "Free Written Estimates" |
| `serviceAreaZipCodes` | textarea | ✅ | Newline-separated list of valid zip codes |

### Navigation

Site navigation structure. Single document.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `mainNav` | array | ✅ | Primary navigation items |
| `mainNav.label` | text | ✅ | |
| `mainNav.url` | text | ✅ | |
| `mainNav.children` | array | ❌ | Dropdown items |
| `mainNav.children.label` | text | ✅ | |
| `mainNav.children.url` | text | ✅ | |
| `footerNav` | array | ✅ | Footer navigation columns |
| `footerNav.heading` | text | ✅ | Column heading |
| `footerNav.links` | array | ✅ | |
| `footerNav.links.label` | text | ✅ | |
| `footerNav.links.url` | text | ✅ | |

---

## Media Collection

Payload CMS's built-in `media` collection handles file uploads. Configured with:

- **Storage**: Cloudflare R2 via `@payloadcms/storage-s3` (R2 is S3-compatible)
- **Image sizes**: Defined presets for thumbnail (200px), card (600px), hero (1200px), full (2400px)
- **Accepted types**: image/jpeg, image/png, image/webp, image/avif, application/pdf
- **Alt text**: Required field on all image uploads (WCAG 2.1 AA compliance)

---

## Entity Relationship Diagram

```
Services ──────┬── has many ──── FAQs
               ├── has many ──── Projects
               ├── has many ──── Reviews
               └── referenced by ── Leads (serviceType)

ServiceAreas ──┬── has many ──── Projects (localProjects)
               ├── has many ──── Reviews (localReviews)
               ├── has many ──── FAQs (localFAQs)
               └── referenced by ── Leads (zipCode → service area lookup)

Leads ─────────── standalone (created via form submission)
                   Links to same contact via shared email/phone (FR-020a)

Projects ──────┬── belongs to ──── Services (projectType)
               └── belongs to ──── ServiceAreas (city)

BlogPosts ─────┬── relates to ──── Services (relatedServices)
               └── relates to ──── LeadMagnets (leadMagnetCTA)

PaidLandingPages ── relates to ── Services (targetService)
                    relates to ── Offers (offer)

Offers ────────── relates to ──── Services (applicableServices)

SiteSettings ──── global (NAP, hours, license, risk reversals)
Navigation ────── global (main nav, footer nav)
```
