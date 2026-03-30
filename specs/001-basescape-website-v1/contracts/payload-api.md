# Contract: Payload CMS REST API

> Defines the interface between the Astro frontend (build-time data fetching) and Payload CMS.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://cms.basescape.com/api` (Cloudflare Workers endpoint)

## Authentication

- **Build-time reads** (public content): No auth required. Collections with `read` access set to public.
- **Lead creation** (Astro Actions → Payload): API key via `Authorization: Bearer <PAYLOAD_API_KEY>` header. Key stored in Cloudflare Workers environment variable.
- **Admin panel**: Payload's built-in email/password auth with session cookies.

---

## Build-Time Read Endpoints (Astro `getStaticPaths()`)

### GET /api/services

Fetch all published services for service page generation.

**Query**: `?where[status][equals]=published&limit=100&depth=2`

**Response** (200):
```json
{
  "docs": [
    {
      "id": "string",
      "title": "Walkout Basements",
      "slug": "walkout-basements",
      "tagline": "string",
      "primaryValuePillar": "financial",
      "supportingPillars": ["safety", "transformation"],
      "heroImage": { "url": "string", "alt": "string", "width": 1200, "height": 800 },
      "overview": { "root": { "children": [] } },
      "process": [{ "stepTitle": "string", "stepDescription": {}, "stepImage": null }],
      "anxietyStack": {
        "structuralSafety": {},
        "codeCompliance": {},
        "drainageMoisture": {},
        "dustDisruption": {},
        "costAffordability": {},
        "aesthetics": {},
        "timeline": {}
      },
      "differentiator": {},
      "faqs": [{ "id": "string", "question": "string", "answer": {} }],
      "projects": [{ "id": "string", "title": "string", "slug": "string" }],
      "reviews": [{ "id": "string", "reviewerName": "string", "starRating": 5 }],
      "ctaHeadline": "string",
      "seo": { "metaTitle": "string", "metaDescription": "string", "ogImage": null }
    }
  ],
  "totalDocs": 3,
  "limit": 100,
  "page": 1,
  "totalPages": 1,
  "hasNextPage": false,
  "hasPrevPage": false
}
```

### GET /api/service-areas

Fetch all published service areas for location page generation.

**Query**: `?where[status][equals]=published&limit=100&depth=2`

**Response** (200):
```json
{
  "docs": [
    {
      "id": "string",
      "cityName": "Draper",
      "stateAbbrev": "UT",
      "slug": "draper-ut",
      "county": "salt-lake",
      "coordinates": { "lat": 40.5246, "lng": -111.8638 },
      "serviceRadius": 15,
      "localContent": {},
      "localReferences": "string",
      "localProjects": [],
      "localReviews": [],
      "localFAQs": [],
      "heroImage": null,
      "seo": { "metaTitle": "string", "metaDescription": "string" }
    }
  ],
  "totalDocs": 25
}
```

### GET /api/projects

Fetch all published projects for gallery and inline display.

**Query**: `?where[status][equals]=published&depth=2&sort=-featured,-createdAt`

### GET /api/faqs

**Query**: `?where[status][equals]=published&sort=sortOrder`

### GET /api/reviews

**Query**: `?where[status][equals]=published&sort=-featured,-reviewDate`

### GET /api/blog-posts

**Query**: `?where[status][equals]=published&sort=-publishDate&depth=1`

### GET /api/lead-magnets

**Query**: `?where[status][equals]=published`

### GET /api/offers

**Query**: `?where[status][equals]=active`

### GET /api/paid-landing-pages

**Query**: `?where[status][equals]=published&depth=2`

---

## Globals

### GET /api/globals/site-settings

Returns the single SiteSettings document. No auth required.

### GET /api/globals/navigation

Returns the single Navigation document. No auth required.

---

## Write Endpoints (Astro Actions → Payload)

### POST /api/leads

Create or update a lead record (called from Astro Actions on form step completion).

**Headers**: `Authorization: Bearer <PAYLOAD_API_KEY>`

**Request Body** (Step 1 — create partial lead):
```json
{
  "sessionId": "uuid-v4-string",
  "status": "partial",
  "currentStep": 1,
  "serviceType": "walkout-basement",
  "zipCode": "84020",
  "formType": "multi-step",
  "source": {
    "page": "/services/walkout-basements",
    "utmSource": "google",
    "utmMedium": "cpc",
    "utmCampaign": "walkout-basements-utah",
    "referrer": "https://google.com"
  }
}
```

**Response** (201):
```json
{
  "doc": {
    "id": "string",
    "sessionId": "uuid-v4-string",
    "status": "partial",
    "currentStep": 1,
    "createdAt": "2026-03-23T12:00:00.000Z"
  },
  "message": "Lead created successfully."
}
```

### PATCH /api/leads/:id

Update an existing partial lead with additional step data.

**Headers**: `Authorization: Bearer <PAYLOAD_API_KEY>`

**Request Body** (Step 2 update):
```json
{
  "currentStep": 2,
  "projectPurpose": "rental-unit",
  "timeline": "1-3-months"
}
```

**Request Body** (Step 3 — finalize):
```json
{
  "currentStep": 3,
  "status": "complete",
  "name": "Jane Smith",
  "phone": "801-555-1234",
  "email": "jane@example.com",
  "address": "123 Mountain View Dr, Draper, UT 84020"
}
```

**Response** (200): Updated doc.

**Side Effects** (on `status: "complete"`):
- `afterChange` hook sends confirmation email to homeowner via Resend
- `afterChange` hook sends notification email to BaseScape team via Resend

### POST /api/leads (Quick Callback)

**Request Body**:
```json
{
  "sessionId": "uuid-v4-string",
  "status": "complete",
  "currentStep": 1,
  "name": "John Doe",
  "phone": "801-555-5678",
  "additionalNotes": "Need walkout for rental unit",
  "formType": "quick-callback",
  "source": {
    "page": "/",
    "referrer": ""
  }
}
```

### POST /api/leads (Lead Magnet)

**Request Body**:
```json
{
  "sessionId": "uuid-v4-string",
  "status": "complete",
  "currentStep": 1,
  "name": "Sarah Connor",
  "email": "sarah@example.com",
  "formType": "lead-magnet",
  "source": {
    "page": "/resources/adu-compliance-checklist",
    "referrer": ""
  }
}
```

---

## Error Responses

| Status | Meaning | Example |
|--------|---------|---------|
| 400 | Validation error | `{ "errors": [{ "message": "zip code required", "field": "zipCode" }] }` |
| 401 | Missing/invalid API key | `{ "errors": [{ "message": "Unauthorized" }] }` |
| 404 | Document not found | `{ "errors": [{ "message": "Not Found" }] }` |
| 500 | Server error | `{ "errors": [{ "message": "Internal Server Error" }] }` |

---

## Rate Limits

Payload CMS on Cloudflare Workers is subject to Workers limits:
- 50ms CPU time per request (paid plan: 50ms default, can burst)
- 128MB memory per request
- No explicit Payload-level rate limiting (handled at Astro Action layer via CF Workers Rate Limiting binding)
