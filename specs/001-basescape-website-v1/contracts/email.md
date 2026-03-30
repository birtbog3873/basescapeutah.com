# Contract: Transactional Email

> Defines email templates and delivery triggered by Payload CMS lifecycle hooks via Resend.

## Provider

**Resend** via `@payloadcms/email-resend` adapter. REST-based (no SMTP), compatible with Cloudflare Workers.

## Trigger

Payload CMS `afterChange` hook on the `Leads` collection, when `status` changes to `"complete"`.

---

## Email 1: Homeowner Confirmation

**Trigger**: Lead status → `"complete"`
**Recipient**: Homeowner (lead's email address)
**SLA**: Delivered within 3 seconds of form submission (FR-018)

| Field | Value |
|-------|-------|
| From | `BaseScape <noreply@basescape.com>` |
| Subject | `Thanks, {name} — We received your {serviceType} estimate request` |
| Reply-To | `hello@basescape.com` |

**Template Variables**:
```
{name}           — Lead's name
{serviceType}    — Human-readable service name ("Walkout Basement", "Egress Window", etc.)
{phone}          — BaseScape business phone (from SiteSettings)
{businessName}   — "BaseScape" (from SiteSettings)
```

**Content Structure**:
1. Greeting with name
2. Confirmation that the request was received
3. What happens next (team will call within 24 hours)
4. BaseScape phone number for immediate contact
5. Brief trust signal (Licensed, Bonded, Insured — Utah)
6. No-reply footer with unsubscribe/privacy link

**Fallback**: If email delivery fails, log error to Payload CMS (no retry in V1 — team notification serves as backup).

---

## Email 2: Team Notification

**Trigger**: Lead status → `"complete"`
**Recipient**: BaseScape team email (configured in SiteSettings or environment variable)
**SLA**: Delivered within 5 seconds of form submission (SC-004)

| Field | Value |
|-------|-------|
| From | `BaseScape Leads <leads@basescape.com>` |
| Subject | `New {formType} Lead: {name} — {serviceType} in {zipCode}` |
| Reply-To | Lead's email address |

**Template Variables**:
```
{name}            — Lead's name
{phone}           — Lead's phone number
{email}           — Lead's email address
{address}         — Lead's address (if provided)
{serviceType}     — Service interest
{projectPurpose}  — Project purpose
{timeline}        — Rough timeline
{zipCode}         — Property zip code
{formType}        — "Multi-Step Estimate" | "Quick Callback" | "Lead Magnet"
{sourcePage}      — Page URL where form was submitted
{utmCampaign}     — Campaign attribution (if any)
{createdAt}       — Submission timestamp
{isOutOfArea}     — "⚠️ OUT OF SERVICE AREA" flag if applicable
{leadId}          — Link to lead record in Payload admin
```

**Content Structure**:
1. Lead type and priority indicators (out-of-area flag)
2. Full contact information (clickable phone, email)
3. Project details (service, purpose, timeline)
4. Attribution data (source page, campaign, referrer)
5. Direct link to lead record in Payload CMS admin panel

---

## Email 3: Lead Magnet Delivery

**Trigger**: Lead created with `formType: "lead-magnet"`, `status: "complete"`
**Recipient**: Homeowner (lead's email address)

| Field | Value |
|-------|-------|
| From | `BaseScape <noreply@basescape.com>` |
| Subject | `Your free guide: {leadMagnetTitle}` |
| Reply-To | `hello@basescape.com` |

**Content Structure**:
1. Thank you + download link (direct R2 URL or signed URL)
2. Brief description of what's inside
3. CTA to schedule a free estimate
4. BaseScape phone number

---

## Resend Configuration

```typescript
// cms/payload.config.ts
import { resendAdapter } from '@payloadcms/email-resend'

export default buildConfig({
  email: resendAdapter({
    defaultFromAddress: 'noreply@basescape.com',
    defaultFromName: 'BaseScape',
    apiKey: process.env.RESEND_API_KEY,
  }),
  // ...
})
```

## Environment Variables

| Variable | Location | Purpose |
|----------|----------|---------|
| `RESEND_API_KEY` | Cloudflare Workers env | Resend API authentication |
| `TEAM_NOTIFICATION_EMAIL` | Cloudflare Workers env | Team email for lead notifications |
| `PAYLOAD_BASE_URL` | Cloudflare Workers env | For admin panel deep links in notifications |
