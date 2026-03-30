# Data Model: Add Retaining Walls Service

**Branch**: `004-retaining-walls-service` | **Date**: 2026-03-25

## Entities

### Service (Retaining Walls)

No new CMS collection or schema changes required. The retaining walls service uses the existing `Services` collection (`cms/src/collections/Services.ts`).

**New CMS entry fields:**

| Field | Type | Value | Required |
|-------|------|-------|----------|
| title | text | "Retaining Walls" | Yes |
| slug | text (unique) | "retaining-walls" | Yes |
| tagline | text | Transformation-focused tagline (< 200 chars) | Yes |
| primaryValuePillar | select | "transformation" | Yes |
| supportingPillars | multi-select | ["safety"] | Yes |
| serviceType | select | "core" | Yes |
| heroImage | upload | Retaining wall project photo | Yes |
| overview | richText | Service overview HTML | Yes |
| process | array (min 3) | 4 process steps with title + description | Yes |
| anxietyStack | group | 7 richText fields (all populated) | Yes |
| differentiator | richText | Unique selling proposition | Optional |
| faqs | relationship (hasMany) | 5+ FAQ entries from FAQs collection | Yes |
| projects | relationship (hasMany) | Related project gallery items | Optional |
| reviews | relationship (hasMany) | Related review entries | Optional |
| ctaHeadline | text | Custom CTA headline | Optional |
| seo.metaTitle | text | < 60 chars | Yes |
| seo.metaDescription | textarea | < 160 chars | Yes |
| seo.ogImage | upload | Social sharing image | Optional |
| status | select | "published" | Yes |

### Lead (Extended)

Already completed. The `Leads` collection serviceType select options include `retaining-walls` as a valid value.

| Field | Change | Status |
|-------|--------|--------|
| serviceType | Added `{ label: 'Retaining Walls', value: 'retaining-walls' }` | Done |

### Validation Schema (Zod)

Already completed. The `serviceType` enum in `site/src/lib/validation.ts` includes `'retaining-walls'`.

## Relationships

```
Service (retaining-walls)
  ├── faqs: hasMany → FAQs collection
  ├── projects: hasMany → Projects collection
  └── reviews: hasMany → Reviews collection

Lead
  └── serviceType: 'retaining-walls' (enum value)
```

## State Transitions

No new state transitions. The Service entity uses the existing `status` field (`draft` → `published`). Leads follow the existing submission pipeline (form → Astro Action → Payload CMS → email notifications).
