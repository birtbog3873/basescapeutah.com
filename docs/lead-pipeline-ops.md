# BaseScape Lead Pipeline — Operations Guide

> Last updated: 2026-04-04

This document covers the end-to-end lead pipeline: how form submissions flow from the website through Payload CMS to Google Sheets, and how offline conversion tracking feeds data back into GA4.

---

## Architecture Overview

```
[Astro Site]                    [Payload CMS (Vercel)]              [Google Sheets]           [GA4]
  Form submit                       afterChange hook                  Apps Script
  ─────────────►  POST /api/leads  ──────────────────►  doPost()   ──────────────►  Row added
                  (Turso DB)        webhook fires        (Web App)                   onEdit()
                                                                                     ──────►  Measurement
                                                                                              Protocol
```

### Key Systems

| System | URL / Location | Purpose |
|--------|---------------|---------|
| Site (Astro) | basescapeutah.com | Static site, form components |
| CMS Admin (Payload + Next.js) | admin.basescapeutah.com | Lead management, hooks, API |
| Database | Turso (libsql) | Production lead storage |
| Google Sheets | Spreadsheet ID `1mhIZk_12mfYRHq4zl5LXx1wsZ3otzBAOD1fNwbV4dqs` | Lead tracking + status management |
| Apps Script | Deployed as Web App (see env vars) | Receives webhook, writes rows, fires GA4 events |

---

## Production Environment: admin/ on Vercel (NOT cms/ on Cloudflare)

**Critical:** The production CMS is the `admin/` directory deployed to Vercel, NOT `cms/` on Cloudflare Workers.

- `admin.basescapeutah.com` resolves to **Vercel**, not Cloudflare
- Database is **Turso** (libsql), not Cloudflare D1
- D1 has 0 production leads — it is unused
- When making changes to collections, hooks, or config, edit files in `admin/src/`, not `cms/src/`
- After editing, deploy with: `cd admin && npx vercel --prod --yes`

### Keeping cms/ and admin/ in sync

Both directories share the same collection/hook definitions but with different database adapters. When you add fields or hooks:

1. Make the change in `cms/src/` first (canonical source)
2. Copy the changed files to `admin/src/`
3. If adding database columns, apply migrations to **both** D1 (via `wrangler d1 execute`) and Turso (via `turso db shell`)

---

## Vercel Environment Variables (Production)

| Variable | Set? | Purpose |
|----------|------|---------|
| `PAYLOAD_SECRET` | Yes | CMS auth secret |
| `TURSO_AUTH_TOKEN` | Yes | Turso database auth |
| `R2_ACCESS_KEY_ID` | Yes | Cloudflare R2 media storage |
| `R2_SECRET_ACCESS_KEY` | Yes | Cloudflare R2 media storage |
| `RESEND_API_KEY` | Yes | Email sending (currently unused in hook — see Known Issues) |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Yes | Apps Script web app deployment URL |
| `GOOGLE_SHEETS_WEBHOOK_SECRET` | Yes | Shared secret for webhook auth |
| `TURSO_DATABASE_URL` | Yes | Turso connection string |
| `R2_BUCKET_NAME` | **Missing** | Defaults to `basescape-media` |
| `R2_ENDPOINT` | **Missing** | Required for R2 |
| `TEAM_NOTIFICATION_EMAIL` | **Missing** | Needed when email sending is re-enabled |
| `PAYLOAD_BASE_URL` | **Missing** | Admin link in notification emails |
| `GA4_MP_API_SECRET` | **Missing** | Needed if Measurement Protocol is triggered from CMS |

---

## Lead Data Flow (Detailed)

### 1. Frontend Capture

**Files:** `site/src/components/forms/MultiStepForm.tsx`, `QuickCallback.tsx`, `LeadMagnetForm.tsx`

Forms capture:
- Standard fields (name, phone, email, address, zip, service type, etc.)
- `source.page` — current page URL
- `source.gaClientId` — extracted from `_ga` cookie via `getGaClientId()` in `site/src/lib/analytics.ts`
- `source.gclid` — extracted from URL params via `getGclid()` in `site/src/lib/analytics.ts`
- UTM parameters from URL

### 2. Astro Actions

**File:** `site/src/actions/index.ts`

Three actions with Zod validation (`site/src/lib/validation.ts`):
- `saveFormStep` — Multi-step form (creates on step 0, updates on steps 1-2, sets status=complete on final step)
- `submitQuickCallback` — Single-step (creates with status=complete)
- `submitLeadMagnet` — Email capture (creates with status=complete)

All actions POST/PATCH to `PAYLOAD_URL/api/leads` with `PAYLOAD_API_KEY` auth.

### 3. Payload CMS afterChange Hook

**File:** `admin/src/collections/Leads.ts` (inline hook)

Triggers when `status` changes to `complete`. Sends webhook to Google Sheets with all lead fields including `gaClientId` and `gclid`.

**Current state (2026-04-04):** The hook ONLY sends the Google Sheets webhook. Email sending (confirmation + team notification) is disabled because Resend API calls crash the Vercel serverless function. See Known Issues.

### 4. Google Sheets Apps Script

**Location:** Extensions > Apps Script in the Leads spreadsheet

Two functions:
- `doPost(e)` — Receives webhook, validates secret, appends row with 21 columns
- `onEdit(e)` — Fires when Status column is edited to "Qualified" or "Closed Won", sends GA4 Measurement Protocol event

### 5. GA4 Offline Conversions

When a lead's status is changed in the spreadsheet:
- **Qualified** → sends `qualify_lead` event via Measurement Protocol
- **Closed Won** → sends `close_convert_lead` event with `value` and `currency` from Closed Value column

Requires `GA4_MP_API_SECRET` set in Apps Script Project Settings > Script Properties.

---

## Google Apps Script Deployment — GOTCHAS

### Redeployment does NOT auto-update the web app

When you edit the Apps Script code:
- `onEdit` triggers update **immediately** (they're simple triggers, not web app endpoints)
- `doPost` / `doGet` (web app) require **explicit redeployment**

**To update the web app:**
1. Deploy > Manage deployments
2. Click pencil icon on the active deployment
3. Change Version to **"New version"**
4. Click Deploy

**If you create a NEW deployment instead of updating:**
- A **new URL** is generated
- The old URL continues serving old code
- You must update `GOOGLE_SHEETS_WEBHOOK_URL` on Vercel AND redeploy the admin app

### Column alignment is positional

`sheet.appendRow(row)` writes values by array position (index 0 = column A, index 1 = column B, etc.). The header row is cosmetic — it does NOT control where data lands.

If you add new fields:
1. Add the field to the webhook payload in `admin/src/collections/Leads.ts`
2. Add the field to the `row` array in Apps Script `doPost` at the correct position
3. Add a matching header in the HEADERS array at the same position
4. **Delete row 1** in the spreadsheet and let the script recreate it, OR manually add the header in the correct column
5. **Redeploy the Apps Script web app** (new version)
6. **Redeploy the admin app** on Vercel

### The onEdit function uses header names for column lookup

```javascript
var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
var statusCol = headers.indexOf('Status') + 1
var clientIdCol = headers.indexOf('gaClientId') + 1
```

If you rename headers in the HEADERS array, also update the `indexOf()` calls in `onEdit`.

Current header names used by `onEdit`:
- `'Status'` — triggers the offline conversion logic
- `'gaClientId'` — GA4 client_id for Measurement Protocol
- `'Closed Value'` — revenue amount for `close_convert_lead` events

---

## Database Column Naming

Payload CMS with SQLite adapters uses snake_case column names with group prefixes:

| Payload Field | DB Column |
|--------------|-----------|
| `source.gaClientId` | `source_ga_client_id` |
| `source.gclid` | `source_gclid` |
| `source.page` | `source_page` |
| `closedValue` | `closed_value` |
| `isOutOfServiceArea` | `is_out_of_service_area` |

When adding new fields, you need to run ALTER TABLE on **both** databases:

```bash
# Turso (production)
turso db shell basescape-cms "ALTER TABLE leads ADD COLUMN new_column text;"

# D1 (if keeping in sync)
npx wrangler d1 execute basescape-cms-db --command "ALTER TABLE leads ADD COLUMN new_column text;"
```

---

## Known Issues & Status (2026-04-04)

### Email sending crashes Vercel serverless functions

**Status:** Unresolved — emails disabled in production hook

The `afterLeadCreate` hook (`admin/src/hooks/afterLeadCreate.ts`) sends two emails via Resend:
1. Confirmation email to homeowner
2. Team notification email

When this hook runs on Vercel, the Resend API calls cause the serverless function to hang or crash, preventing ALL downstream operations (including the webhook). Evidence: every lead in Turso has NULL for `confirmation_sent_at` and `team_notified_at` from when the full hook was active.

**Current workaround:** The afterChange hook in `Leads.ts` is an inline function that only does the Google Sheets webhook (no email). The `afterLeadCreate.ts` file exists but is imported and unused.

**Potential fixes to investigate:**
- Make email calls fire-and-forget (don't await)
- Use Vercel's `waitUntil()` API for background work
- Move email sending to a separate endpoint/queue
- Debug why Resend specifically hangs on Vercel (timeout? cold start?)

### Missing Vercel env vars for full functionality

`TEAM_NOTIFICATION_EMAIL`, `PAYLOAD_BASE_URL`, and `GA4_MP_API_SECRET` are not set on Vercel. These are needed when email sending is re-enabled and if Measurement Protocol events are triggered from CMS hooks (vs. Google Sheets).

### Unused import in Leads.ts

`admin/src/collections/Leads.ts` imports `afterLeadCreate` but doesn't use it. Clean up once the email approach is finalized.

---

## Verification Checklist

### After any change to the lead pipeline:

1. **Deploy admin:** `cd admin && npx vercel --prod --yes`
2. **Create test lead:**
   ```bash
   curl -s -X POST https://admin.basescapeutah.com/api/leads \
     -H "Content-Type: application/json" \
     -d '{
       "sessionId": "test-'$(date +%s)'",
       "status": "complete",
       "currentStep": 3,
       "serviceType": "walkout-basement",
       "name": "Pipeline Test",
       "phone": "8015550000",
       "formType": "multi-step",
       "source": {
         "page": "/test",
         "gaClientId": "test.client.123",
         "gclid": "test-gclid-456"
       }
     }'
   ```
3. **Verify in Turso:** `turso db shell basescape-cms "SELECT id, name, source_ga_client_id, source_gclid, team_notified_at FROM leads ORDER BY id DESC LIMIT 1;"`
4. **Verify in Google Sheets:**
   ```bash
   gws sheets +read --spreadsheet 1mhIZk_12mfYRHq4zl5LXx1wsZ3otzBAOD1fNwbV4dqs --range 'Leads!R<last_row>:U<last_row>'
   ```
5. **Verify GA4 offline conversion:** Change Status cell to "Qualified" in the sheet, check GA4 Realtime for `qualify_lead` event

### After Apps Script changes:

1. Redeploy the web app (Deploy > Manage deployments > pencil > New version > Deploy)
2. If URL changed, update `GOOGLE_SHEETS_WEBHOOK_URL` on Vercel and redeploy admin
3. Run the test lead curl above and verify the new row has all expected columns populated
