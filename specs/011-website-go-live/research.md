# Research: BaseScape Website Go-Live

**Branch**: `011-website-go-live` | **Date**: 2026-03-25

## Decision 1: Cloudflare Deployment Architecture

**Decision**: Cloudflare Workers (CMS) + Cloudflare Pages (site) with D1 SQLite + R2 media storage

**Rationale**: Already configured in astro.config.ts (Cloudflare Pages adapter), wrangler.jsonc (Workers + D1 + R2), and payload.config.ts (sqliteD1Adapter). No architecture decision needed -- just provision resources and deploy.

**Alternatives considered**: None -- the tech stack is already committed.

**Implementation notes**:
- `cms/wrangler.jsonc` has placeholder database_id `00000000-0000-0000-0000-000000000000` -- needs real D1 database
- R2 bucket `basescape-media` defined in wrangler but s3Storage adapter NOT wired in payload.config.ts -- must be connected
- Rate limiter configured at 15 req/min via Cloudflare Durable Objects binding `FORM_RATE_LIMITER`

## Decision 2: CMS Webhook → Site Rebuild Pipeline

**Decision**: Payload CMS afterChange hook sends POST to Cloudflare Pages deploy hook URL

**Rationale**: Cloudflare Pages supports deploy hooks -- a unique URL that triggers a new build when called. Payload CMS supports global afterChange hooks that can fire an HTTP request. This is the simplest webhook-based rebuild approach with no additional infrastructure.

**Alternatives considered**:
- GitHub Actions webhook (adds GitHub dependency, slower cold start) -- rejected
- Manual rebuild via wrangler CLI -- rejected (violates FR-006 no-developer-intervention requirement)
- n8n automation layer -- rejected (out of scope per spec)

**Implementation notes**:
- Create a Cloudflare Pages deploy hook in the dashboard
- Add a Payload global afterChange hook for content collections (Services, FAQs, Reviews, Projects, ServiceAreas, SiteSettings, Navigation)
- Debounce: Batch rapid edits with a 30-second cooldown to avoid excessive rebuilds
- Store deploy hook URL as env var `DEPLOY_HOOK_URL` (never hardcode)

## Decision 3: GA4 Integration

**Decision**: Add GA4 measurement tag via gtag.js to BaseLayout.astro; fire custom events from form components

**Rationale**: GA4 is the standard free analytics platform. gtag.js is the recommended integration method for static sites. The existing Plausible integration in BaseLayout.astro provides the pattern -- add GA4 alongside it.

**Alternatives considered**:
- Google Tag Manager (GTM) -- overkill for launch; adds complexity and a SPOF
- Server-side GA4 measurement protocol -- unnecessary for static site

**Implementation notes**:
- Existing Plausible script in BaseLayout.astro tracks form steps via `plausible()` calls
- GA4 gtag.js script needs to be added to BaseLayout `<head>`
- Custom events: `form_step_1`, `form_step_2`, `form_complete`, `quick_callback`, `lead_magnet`
- Env var: `GA4_MEASUREMENT_ID` (e.g., `G-XXXXXXXXXX`)
- Do NOT remove Plausible integration -- it's already built and can be activated later via env var

## Decision 4: Google Places Autocomplete

**Decision**: Integrate Google Places Autocomplete API on the address field in MultiStepForm step 3

**Rationale**: FR-016 requires address autocomplete. The env var `GOOGLE_PLACES_API_KEY` already exists in `.env.example`. The address field exists but currently uses plain `autoComplete="street-address"` (browser autocomplete only).

**Alternatives considered**:
- Browser-native autocomplete only -- insufficient for structured address data
- Mapbox address autocomplete -- additional vendor, not configured

**Implementation notes**:
- Load Google Maps JavaScript API with `libraries=places` in BaseLayout
- Use `Autocomplete` widget bound to address input in MultiStepForm.tsx step 3
- Restrict to US addresses, bias to Utah region
- Only load script on pages with forms (not all pages) to avoid unnecessary JS

## Decision 5: Content Strategy for Launch

**Decision**: Polished professional copy for all 6 services; seed data has only 4 services (walkout, egress, pavers, artificial turf) -- must add basement remodeling and retaining walls

**Rationale**: Seed creates 4 of 6 services. Service page Astro files exist for all 6 but 2 lack CMS entries. All 6 need polished copy, not the developer-placeholder text in the current seed.

**Implementation notes**:
- Update `cms/src/seed.ts` to include basement-remodeling and retaining-walls services
- Rewrite all 6 service descriptions with professional marketing copy
- Update FAQ content for professional tone
- Update 3 sample reviews with professional-sounding testimonials
- Ensure SiteSettings has correct phone number, address, and hours
- Set `showReviews: true` and `showGallery: false` (gallery needs real project photos)

## Decision 6: DNS and SSL

**Decision**: Point basescape.com to Cloudflare Pages via CNAME/A records; use Cloudflare-managed SSL

**Rationale**: Cloudflare Pages provides automatic SSL and CDN. No additional SSL certificate needed.

**Implementation notes**:
- Add custom domain in Cloudflare Pages dashboard
- Configure DNS: `basescape.com` → Cloudflare Pages
- Configure DNS: `cms.basescape.com` → Cloudflare Workers (CMS admin + API)
- SSL is automatic with Cloudflare proxy
- Set low TTL (300s) during initial DNS propagation

## Decision 7: R2 Storage Integration

**Decision**: Wire R2 bucket as Payload CMS media storage via s3Storage adapter with Cloudflare R2 credentials

**Rationale**: s3Storage adapter is imported in payload.config.ts but not configured. R2 bucket `basescape-media` is defined in wrangler.jsonc. R2 is S3-compatible, so the s3Storage adapter works with R2 credentials.

**Implementation notes**:
- Configure s3Storage adapter in payload.config.ts with R2 endpoint, access key, and bucket
- R2 endpoint format: `https://<account_id>.r2.cloudflarestorage.com`
- Required env vars: `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_BUCKET_NAME`
- Public R2 bucket URL for image serving: configure custom domain or use R2 public URL
