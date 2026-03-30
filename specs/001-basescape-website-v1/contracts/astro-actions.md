# Contract: Astro Actions (Form Submission Endpoints)

> Defines server-side form handling actions running on Cloudflare Workers via `@astrojs/cloudflare`.

## Overview

Astro Actions handle form submissions from the Astro frontend. They:
1. Validate input via Zod schemas
2. Check honeypot + rate limiting
3. Forward validated data to Payload CMS REST API
4. Return success/error response to the client Island

All actions are defined in `site/src/actions/index.ts` and invoked from client Islands via `import { actions } from 'astro:actions'`.

---

## Action: saveFormStep

Saves partial lead data at each multi-step form step transition.

**Input Schema** (Zod discriminated union):

```typescript
// Step 1
{
  step: 1,
  sessionId: string (UUID v4),
  serviceType: "walkout-basement" | "egress-window" | "window-well-upgrade" | "not-sure",
  zipCode: string (5-digit),
  honeypot: string (must be empty),
  source: {
    page: string,
    utmSource?: string,
    utmMedium?: string,
    utmCampaign?: string,
    utmContent?: string,
    utmTerm?: string,
    referrer?: string
  }
}

// Step 2
{
  step: 2,
  sessionId: string (UUID v4),
  projectPurpose: "rental-unit" | "family-space" | "home-office" | "safety-compliance" | "other",
  timeline: "asap" | "1-3-months" | "3-6-months" | "6-plus-months" | "just-researching",
  honeypot: string (must be empty)
}

// Step 3
{
  step: 3,
  sessionId: string (UUID v4),
  name: string (1-100 chars),
  phone: string (valid phone),
  email: string (valid email),
  address?: string (0-200 chars),
  honeypot: string (must be empty)
}
```

**Success Response**:
```json
{
  "data": {
    "success": true,
    "leadId": "string",
    "step": 1
  }
}
```

**Error Response** (validation failure):
```json
{
  "error": {
    "code": "INPUT_VALIDATION_ERROR",
    "fields": {
      "zipCode": ["Must be a 5-digit zip code"]
    }
  }
}
```

**Server-Side Logic**:
1. Check honeypot field — if non-empty, return fake success (200)
2. Check rate limiter (5 requests/60s per IP) — if exceeded, return 429
3. Step 1: `POST /api/leads` to Payload (create partial lead)
4. Steps 2-3: `PATCH /api/leads/:id` to Payload (update existing lead by sessionId lookup)
5. Step 3: Set `status: "complete"` to trigger Payload `afterChange` hooks

---

## Action: submitQuickCallback

Handles the simplified quick callback form (Name + Phone + optional notes).

**Input Schema**:
```typescript
{
  sessionId: string (UUID v4),
  name: string (1-100 chars),
  phone: string (valid phone),
  notes?: string (0-1000 chars),
  honeypot: string (must be empty),
  source: {
    page: string,
    utmSource?: string,
    utmMedium?: string,
    utmCampaign?: string,
    referrer?: string
  }
}
```

**Success Response**:
```json
{
  "data": {
    "success": true,
    "leadId": "string"
  }
}
```

**Server-Side Logic**:
1. Check honeypot + rate limiter
2. `POST /api/leads` to Payload with `formType: "quick-callback"`, `status: "complete"`
3. Payload `afterChange` triggers team notification email

---

## Action: submitLeadMagnet

Handles lead magnet download form (minimal fields).

**Input Schema**:
```typescript
{
  sessionId: string (UUID v4),
  name?: string (0-100 chars),
  email: string (valid email),
  leadMagnetId: string,
  honeypot: string (must be empty),
  source: {
    page: string,
    utmSource?: string,
    utmMedium?: string,
    utmCampaign?: string,
    referrer?: string
  }
}
```

**Success Response**:
```json
{
  "data": {
    "success": true,
    "leadId": "string",
    "downloadUrl": "string"
  }
}
```

**Server-Side Logic**:
1. Check honeypot + rate limiter
2. `POST /api/leads` to Payload with `formType: "lead-magnet"`, `status: "complete"`
3. Fetch lead magnet file URL from Payload
4. Return download URL in response
5. Payload `afterChange` triggers delivery email with download link

---

## Shared Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| `sessionId` | UUID v4 format | "Invalid session" |
| `name` | 1-100 characters, no HTML | "Name is required" / "Name too long" |
| `phone` | Matches US phone pattern | "Enter a valid phone number" |
| `email` | Valid email format | "Enter a valid email address" |
| `zipCode` | Exactly 5 digits | "Enter a valid 5-digit zip code" |
| `address` | 0-200 characters | "Address too long" |
| `honeypot` | Must be empty string | (silent rejection — return fake 200) |

---

## Rate Limiting

Configured via Cloudflare Workers Rate Limiting binding:

| Endpoint | Limit | Window | Key |
|----------|-------|--------|-----|
| saveFormStep | 15 requests | 60 seconds | Client IP |
| submitQuickCallback | 5 requests | 60 seconds | Client IP |
| submitLeadMagnet | 5 requests | 60 seconds | Client IP |

Exceeded responses return:
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in a moment."
  }
}
```
HTTP status: 429
