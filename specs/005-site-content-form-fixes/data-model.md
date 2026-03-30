# Data Model: 005-site-content-form-fixes

**Date**: 2026-03-25 | **Branch**: `005-site-content-form-fixes`

## Entity Changes

### Service (existing entity -- modified)

**Active services after this change (6 total, in display order):**

| # | Title | Slug | Primary Value Pillar | Status |
|---|-------|------|---------------------|--------|
| 1 | Walkout Basements | walkout-basements | financial | Existing |
| 2 | Basement Remodeling | basement-remodeling | transformation | **New** |
| 3 | Pavers & Hardscapes | pavers-hardscapes | transformation | Existing |
| 4 | Retaining Walls | retaining-walls | transformation | Existing |
| 5 | Artificial Turf | artificial-turf | transformation | Existing |
| 6 | Egress Windows | egress-windows | safety | Existing |

**Removed**: Window Well Upgrades (slug: `window-well-upgrades`)

**No schema changes to Services collection** -- all fields already support the new service.

### Lead (existing entity -- modified enum)

**serviceType field options (before)**:
```
walkout-basement | egress-window | window-well-upgrade | retaining-walls | not-sure
```

**serviceType field options (after)**:
```
walkout-basement | basement-remodeling | pavers-hardscapes | retaining-walls | artificial-turf | egress-window | not-sure
```

**Changes**: +3 added (basement-remodeling, pavers-hardscapes, artificial-turf), -1 removed (window-well-upgrade)

**Affected files**:
- `cms/src/collections/Leads.ts` -- serviceType select options
- `site/src/lib/validation.ts` -- Zod enum for leadStepOneSchema
- `site/src/components/forms/MultiStepForm.tsx` -- SERVICE_OPTIONS array

### FAQ (existing entity -- no schema changes)

No structural changes to FAQ collection. New content entries needed:

**Minimum content plan (5+ FAQs across categories)**:
- Cost: General pricing/estimate questions
- Timeline: Project duration questions
- General: Service area, licensing, process questions
- Code Compliance: Permit and inspection questions
- Disruption: What to expect during work

### Navigation (existing global -- modified)

**Services dropdown (before)**: Walkout Basements, Egress Windows, Window Well Upgrades, Pavers & Hardscapes, Artificial Turf

**Services dropdown (after)**: Walkout Basements, Basement Remodeling, Pavers & Hardscapes, Retaining Walls, Artificial Turf, Egress Windows

## Validation Rules

| Rule | Current | Updated |
|------|---------|---------|
| Service type enum (form) | 5 values | 7 values (add 3, remove 1) |
| ZIP code format | 5-digit US ZIP | No change |
| Process steps minimum | 3 per service | No change |
| FAQ question max length | 200 chars | No change |

## Relationship Map

```
Service (6 active)
  ├── displayed in: Homepage Grid (fallback + CMS)
  ├── displayed in: Navigation (header + footer fallback + CMS)
  ├── linked from: ServiceCard component
  ├── linked to: Service Detail Page (1:1 by slug)
  └── referenced by: Lead.serviceType (form dropdown)

Lead
  ├── serviceType: references Service (by slug value)
  ├── validated by: Zod schema (validation.ts)
  └── stored in: Payload CMS Leads collection

FAQ
  ├── displayed on: FAQ page (grouped by category)
  ├── displayed on: Service pages (via relationship)
  └── stored in: Payload CMS FAQs collection
```
