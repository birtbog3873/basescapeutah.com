# CMS API Contract

**Branch**: `011-website-go-live` | **Date**: 2026-03-25

> Payload CMS REST API endpoints consumed by the Astro site. These are existing contracts -- no changes needed for go-live, documented for reference.

## Authentication

All API requests require `Authorization: Bearer <PAYLOAD_API_KEY>` header.

## Endpoints

### GET /api/services
Fetch all published services.

**Response**: `{ docs: Service[], totalDocs: number }`

### GET /api/services?where[slug][equals]=:slug
Fetch a single service by slug.

### GET /api/service-areas?where[slug][equals]=:slug
Fetch a single service area by slug.

### GET /api/faqs?where[service][equals]=:serviceId
Fetch FAQs related to a specific service.

### GET /api/reviews?where[featured][equals]=true
Fetch featured reviews for homepage display.

### GET /api/globals/site-settings
Fetch global site settings (business info, hours, zip codes).

### GET /api/globals/navigation
Fetch navigation structure.

### POST /api/leads
Create a new lead (multi-step form step 1, quick callback, lead magnet).

**Body**: `{ sessionId, status, serviceType, zipCode, formType, source }`

### PATCH /api/leads?where[sessionId][equals]=:sessionId
Update an existing lead (multi-step form steps 2-3).

**Body**: `{ currentStep, projectPurpose, timeline, name, phone, email, address, status }`

## Deploy Hook Contract (NEW)

### POST <DEPLOY_HOOK_URL>
Triggered by CMS afterChange hooks on content collections.

**No body required** -- Cloudflare Pages deploy hooks accept empty POST.

**Trigger conditions**: Content published/updated in Services, FAQs, Reviews, Projects, ServiceAreas, SiteSettings, or Navigation.

**Debounce**: 30-second cooldown between triggers to batch rapid edits.
