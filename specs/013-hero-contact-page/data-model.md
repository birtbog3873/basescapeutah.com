# Data Model: Hero Redesign + Dedicated Contact Page

**Feature**: 013-hero-contact-page | **Date**: 2026-03-30

## Entities

### Lead (Existing — No Schema Changes)

The Lead entity already exists in `cms/src/collections/Leads.ts` with all required fields. No new fields or schema changes are needed for this feature.

**Fields used by Google Sheets webhook:**

| Field | Type | Source |
|-------|------|--------|
| `name` | string | Form step 3 |
| `phone` | string | Form step 3 |
| `email` | string | Form step 3 |
| `zipCode` | string | Form step 1 |
| `serviceType` | enum | Form step 1 |
| `projectPurpose` | enum | Form step 2 |
| `timeline` | enum | Form step 2 |
| `source.page` | string | Auto-captured from referrer |
| `createdAt` | datetime | Auto-set by Payload |

### Google Sheets Webhook (New External Integration)

**Not a data model** — this is an outbound HTTP integration.

| Field | Maps To | Notes |
|-------|---------|-------|
| `timestamp` | `doc.createdAt` | ISO 8601 format |
| `name` | `doc.name` | |
| `phone` | `doc.phone` | |
| `email` | `doc.email` | |
| `zipCode` | `doc.zipCode` | |
| `serviceType` | `doc.serviceType` | Enum value string |
| `projectPurpose` | `doc.projectPurpose` | Enum value string |
| `timeline` | `doc.timeline` | Enum value string |
| `source` | `doc.source?.page` | Page URL where form was started |
| `pageUrl` | `doc.source?.page` | Same as source (spec lists both) |

**Configuration**: `GOOGLE_SHEETS_WEBHOOK_URL` environment variable in CMS.

## State Transitions

### Lead Status (Unchanged)

```
partial (step 1) → partial (step 2) → complete (step 3)
                                        ↓
                              afterLeadCreate hook fires:
                              1. Confirmation email to homeowner
                              2. Team notification email
                              3. [NEW] Google Sheets webhook POST
```

### ZIP Code Flow (New)

```
Homepage hero ZIP input
  → GET /contact?zip=XXXXX
    → MultiStepForm reads URL param on mount
      → Pre-fills zipCode field in step 1
        → User continues form normally
```

## Component Interfaces

### MultiStepForm (Modified)

```typescript
interface Props {
  sourcePage?: string
  initialZip?: string  // NEW: pre-populate ZIP in step 1
}
```

### CTABlock (Modified)

```typescript
interface Props {
  headline?: string
  phone?: string
  estimateUrl?: string  // Default changes: '#estimate-form' → '/contact'
  variant?: 'default' | 'hero' | 'section'
}
```

### MobileBottomBar (Modified)

No prop changes — the estimate URL changes from `#estimate-form` to `/contact`, and styling changes to flat edge-to-edge cells.

## Validation Rules (Unchanged)

ZIP code validation remains: `/^\d{5}$/` — exactly 5 numeric digits. The hero ZIP input uses the same constraint via `maxlength="5"` and `pattern="[0-9]{5}"` HTML attributes (progressive enhancement).
