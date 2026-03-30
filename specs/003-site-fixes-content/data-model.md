# Data Model Changes: Site Fixes & Content Updates

**Branch**: `003-site-fixes-content` | **Date**: 2026-03-24

## Schema Changes

### 1. SiteSettings Global — Add Visibility Toggles

**File**: `cms/src/globals/SiteSettings.ts`

Add two boolean fields:

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `showReviews` | boolean | `false` | Controls visibility of "What Homeowners Say" sections site-wide |
| `showGallery` | boolean | `false` | Controls visibility of Gallery page and its nav links |

**Admin section**: Group under a new `Visibility Controls` admin group for easy access.

**Impact**: Both fields read at build time by Astro pages. Toggling requires a site rebuild (standard SSG pattern).

### 2. SiteSettings Global — Update Default Values

| Field | Current Value | New Value |
|-------|--------------|-----------|
| `phone` | `(801) 555-1234` | `1-888-414-0007` |
| `licenseNumber` | `UT-12345` | `14082066-5501 B100` |
| `insuranceInfo` | `Fully Insured & Bonded` | `Fully Insured & Bonded — General Liability` |

These are CMS-managed values, but the seed data and all fallback defaults in code must be updated too.

### 3. Services Collection — Add `serviceType` Field

**File**: `cms/src/collections/Services.ts`

| Field | Type | Options | Default | Purpose |
|-------|------|---------|---------|---------|
| `serviceType` | select | `core`, `specialized` | `core` | Distinguishes primary basement/egress services from complementary landscape services |

**Migration**: Existing services (Walkout Basements, Egress Windows, Window Well Upgrades) get `serviceType: 'core'`. New services (Pavers & Hardscapes, Artificial Turf) get `serviceType: 'specialized'`.

**Impact**: Homepage "Our Specialized Services" section may need to filter by `serviceType` or display all services, depending on how the distinction is presented visually.

### 4. Services Collection — Make Anxiety Stack Optional

**File**: `cms/src/collections/Services.ts`

Current anxiety stack fields are all `required: true`. For non-core services (Pavers, Artificial Turf), fields like `structuralSafety` don't apply.

**Change**: Remove `required: true` from all 7 `anxietyStack` sub-fields. The rendering logic in `ServiceLayout.astro` already handles missing fields (`if (!content) return null`).

### 5. New Service Data Entries

Two new services to be added to the Services collection (via seed data or CMS):

#### Pavers & Hardscapes

| Field | Value |
|-------|-------|
| `title` | Pavers & Hardscapes |
| `slug` | `pavers-hardscapes` |
| `tagline` | Custom paver patios, walkways, and hardscape installations |
| `primaryValuePillar` | `transformation` |
| `serviceType` | `specialized` |
| `status` | `published` |

#### Artificial Turf

| Field | Value |
|-------|-------|
| `title` | Artificial Turf |
| `slug` | `artificial-turf` |
| `tagline` | Low-maintenance, year-round green spaces |
| `primaryValuePillar` | `transformation` |
| `serviceType` | `specialized` |
| `status` | `published` |

Full content (overview, process, anxiety stack adaptations, FAQs) to be authored during implementation.

### 6. New FAQ Entries

New FAQs to be created in the FAQs collection for:

- **Existing services** (Walkout Basements, Egress Windows, Window Well Upgrades): At least 3 additional questions per service, sourced from Google PAA/Related Queries
- **New services** (Pavers & Hardscapes, Artificial Turf): Initial FAQ set (5-8 questions each)

FAQ schema is unchanged — existing `category`, `applicableServices`, and `sortOrder` fields support this.

## Navigation Changes

### Header Navigation

**File**: `cms/src/globals/Navigation.ts` (data) + `site/src/components/layout/Header.astro` (rendering)

- Remove Gallery from `mainNav` in CMS data
- Update fallback hardcoded nav in `Header.astro` to exclude Gallery when `showGallery` is `false`
- Add new services to the Services dropdown: Pavers & Hardscapes, Artificial Turf

### Footer Navigation

**File**: `site/src/components/layout/Footer.astro`

- Remove Gallery from `footerNav` in CMS data
- Update fallback hardcoded nav to exclude Gallery when `showGallery` is `false`
- Add new services to the Services column

## New Files

| File | Purpose |
|------|---------|
| `site/src/lib/serialize-lexical.ts` | Lexical JSON → HTML serializer |
| `site/src/pages/services/pavers-hardscapes.astro` | Pavers & Hardscapes service page |
| `site/src/pages/services/artificial-turf.astro` | Artificial Turf service page |

## Unchanged Entities

- **Leads** collection: No changes needed
- **Projects** collection: No changes needed
- **Reviews** collection: No changes needed (visibility controlled by SiteSettings toggle)
- **Media** collection: No changes needed
- **BlogPosts** collection: No changes needed
