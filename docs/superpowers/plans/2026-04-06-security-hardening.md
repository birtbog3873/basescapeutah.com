# BaseScape Security Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix security vulnerabilities and loose ends identified in the basescapeutah.com security audit — focusing on XSS in emails, debug info leaks, weak validation, missing headers, and an unregistered GA4 hook.

**Architecture:** All changes are surgical edits to existing files. No new files needed. The site is Astro 5 (static) with React form components, Payload CMS 3.x backend, deployed to Cloudflare Pages. Forms submit via Astro Actions to CMS API.

**Tech Stack:** TypeScript, Astro 5, React 19, Zod, Payload CMS 3.x, Cloudflare Pages

---

### Task 1: Fix XSS in Confirmation Email (HTML Escape `data.name`)

**Files:**
- Modify: `cms/src/email/lead-confirmation.ts:18-58`

The confirmation email injects `data.name` directly into HTML without escaping. The team notification email already has `escapeHtml()` — this file needs the same treatment. A user submitting `<script>alert(1)</script>` as their name would have it rendered in the email HTML.

- [ ] **Step 1: Add `escapeHtml` function and apply it to all user-controlled interpolations**

In `cms/src/email/lead-confirmation.ts`, add the `escapeHtml` function at the top (same implementation as `team-notification.ts`) and wrap every instance of `data.name` in the template:

```typescript
// Add at top of file, before SERVICE_LABELS
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
```

Then change line 24 (subject):
```typescript
    subject: `Thanks, ${escapeHtml(data.name)} — We received your ${serviceName} estimate request`,
```

Change line 28 (h1):
```html
          Thanks, ${escapeHtml(data.name)}!
```

- [ ] **Step 2: Verify the fix compiles**

Run: `cd /Users/stevenbunker/clients/general-contracting && npx tsc --noEmit -p cms/tsconfig.json 2>&1 | head -20`
Expected: No new errors (existing errors may appear from other files, that's fine — just ensure no errors in `lead-confirmation.ts`)

- [ ] **Step 3: Commit**

```bash
git add cms/src/email/lead-confirmation.ts
git commit -m "fix: escape user name in confirmation email to prevent HTML injection"
```

---

### Task 2: Remove Debug Error Leaks from Form Actions

**Files:**
- Modify: `site/src/actions/index.ts:105-107`
- Modify: `site/src/components/forms/MultiStepForm.tsx:206-224`

The step 3 catch block returns a `debugError` field containing raw CMS error messages. The MultiStepForm logs these to console and also interpolates `err.message` directly into the UI error state. Both leak internal implementation details.

- [ ] **Step 1: Remove `debugError` from the action response**

In `site/src/actions/index.ts`, change lines 105-108 from:

```typescript
        } catch (err: any) {
          // DEBUG: Return the actual CMS error so we can see it in the UI
          return { success: false, leadId: null, step: 3, debugError: err?.message || String(err) }
        }
```

to:

```typescript
        } catch {
          return { success: false, leadId: null, step: 3 }
        }
```

- [ ] **Step 2: Remove console.error calls and debug references from MultiStepForm**

In `site/src/components/forms/MultiStepForm.tsx`, change lines 206-224 from:

```typescript
      if (result.error) {
        console.error('[Form Step 3] Action error:', JSON.stringify(result.error, null, 2))
        setErrors({ form: 'Something went wrong. Please try again.' })
      } else if (result.data && !result.data.success) {
        console.error('[Form Step 3] CMS error:', (result.data as any).debugError)
        setErrors({ form: 'Something went wrong. Please try again.' })
      } else {
```

to:

```typescript
      if (result.error || (result.data && !result.data.success)) {
        setErrors({ form: 'Something went wrong. Please try again.' })
      } else {
```

Also change lines 222-224 from:

```typescript
    } catch (err: any) {
      console.error('[Form Step 3] Catch error:', err)
      setErrors({ form: `Error: ${err?.message || 'Network error'}` })
    }
```

to:

```typescript
    } catch {
      setErrors({ form: 'Something went wrong. Please try again or call us directly.' })
    }
```

- [ ] **Step 3: Verify the site builds**

Run: `cd /Users/stevenbunker/clients/general-contracting && pnpm --filter site build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add site/src/actions/index.ts site/src/components/forms/MultiStepForm.tsx
git commit -m "fix: remove debug error messages and console.error from production forms"
```

---

### Task 3: Tighten Zod Validation Schemas

**Files:**
- Modify: `site/src/lib/validation.ts:3,6,38,55,81`

Several validation gaps: `leadMagnetId` accepts any string (path traversal risk), `preferredDate` accepts any string (not a date), `page` field has no length limit (database bloat vector), and the phone regex allows 4-6 trailing digits instead of exactly 4.

- [ ] **Step 1: Fix phone regex, add page length limit, add date format, tighten leadMagnetId**

In `site/src/lib/validation.ts`:

Change line 3 (phone regex — trailing `{4,6}` should be `{4}`):
```typescript
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/
```

Change line 6 (add max length to `page`):
```typescript
  page: z.string().max(2048, 'Page URL too long'),
```

Change line 38 (`preferredDate` — require ISO date format):
```typescript
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
```

Change line 55 (`preferredDate` on step 3 — also validate format when present):
```typescript
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format').optional(),
```

Change line 81 (`leadMagnetId` — restrict to slug characters):
```typescript
  leadMagnetId: z.string().regex(/^[a-z0-9][a-z0-9-]{0,98}[a-z0-9]$/, 'Invalid lead magnet ID'),
```

- [ ] **Step 2: Verify the site builds**

Run: `cd /Users/stevenbunker/clients/general-contracting && pnpm --filter site build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Run unit tests if any exist for validation**

Run: `cd /Users/stevenbunker/clients/general-contracting && pnpm test 2>&1 | tail -20`
Expected: All tests pass (or no test files found)

- [ ] **Step 4: Commit**

```bash
git add site/src/lib/validation.ts
git commit -m "fix: tighten Zod schemas — date format, slug pattern, page length, phone regex"
```

---

### Task 4: Add HSTS Header and X-Permitted-Cross-Domain-Policies

**Files:**
- Modify: `site/public/_headers:1-6`

The `_headers` file has good security headers but is missing HSTS (Strict-Transport-Security) and X-Permitted-Cross-Domain-Policies. HSTS tells browsers to always use HTTPS.

- [ ] **Step 1: Add missing security headers**

In `site/public/_headers`, add two new lines after line 1 (`/*`), before the existing headers. The full file should read:

```
/*
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Permitted-Cross-Domain-Policies: none
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://www.googletagmanager.com https://googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://tagmanager.google.com https://plausible.io https://*.callrail.com https://*.clarity.ms https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com; img-src 'self' data: https:; connect-src 'self' https://plausible.io https://maps.googleapis.com https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.callrail.com https://*.clarity.ms https://static.cloudflareinsights.com; font-src 'self' https://fonts.gstatic.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

- [ ] **Step 2: Commit**

```bash
git add site/public/_headers
git commit -m "fix: add HSTS and X-Permitted-Cross-Domain-Policies security headers"
```

---

### Task 5: Move Webhook Secret to Authorization Header

**Files:**
- Modify: `cms/src/hooks/afterLeadCreate.ts:108-133`

The Google Sheets webhook secret is currently sent in the JSON body. If any logging captures the request body, the secret is exposed. Move it to the `Authorization` header instead.

- [ ] **Step 1: Move secret from body to Authorization header**

In `cms/src/hooks/afterLeadCreate.ts`, change lines 108-133 from:

```typescript
  if (webhookUrl && webhookSecret) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret: webhookSecret,
          timestamp: doc.createdAt,
          name: doc.name,
          phone: doc.phone,
          email: doc.email,
          zipCode: doc.zipCode,
          serviceType: doc.serviceType,
          preferredDate: doc.preferredDate,
          timePreference: doc.timePreference,
          address: doc.address,
          additionalNotes: doc.additionalNotes,
          formType: doc.formType,
          isOutOfServiceArea: doc.isOutOfServiceArea,
          source: doc.source?.page,
          utmSource: doc.source?.utmSource,
          utmMedium: doc.source?.utmMedium,
          utmCampaign: doc.source?.utmCampaign,
          gaClientId: doc.source?.gaClientId,
          gclid: doc.source?.gclid,
        }),
      })
```

to:

```typescript
  if (webhookUrl && webhookSecret) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${webhookSecret}`,
        },
        body: JSON.stringify({
          timestamp: doc.createdAt,
          name: doc.name,
          phone: doc.phone,
          email: doc.email,
          zipCode: doc.zipCode,
          serviceType: doc.serviceType,
          preferredDate: doc.preferredDate,
          timePreference: doc.timePreference,
          address: doc.address,
          additionalNotes: doc.additionalNotes,
          formType: doc.formType,
          isOutOfServiceArea: doc.isOutOfServiceArea,
          source: doc.source?.page,
          utmSource: doc.source?.utmSource,
          utmMedium: doc.source?.utmMedium,
          utmCampaign: doc.source?.utmCampaign,
          gaClientId: doc.source?.gaClientId,
          gclid: doc.source?.gclid,
        }),
      })
```

- [ ] **Step 2: Update the Google Apps Script webhook to check Authorization header**

**IMPORTANT:** If `cms/google-apps-script/lead-webhook.gs` exists and validates the secret from the body, it must also be updated to read from `e.parameter` headers or `e.postData.contents` accordingly. Check first:

Run: `cat /Users/stevenbunker/clients/general-contracting/cms/google-apps-script/lead-webhook.gs 2>/dev/null | head -30`

If it contains `parsedBody.secret` or similar, change it to read from headers:
```javascript
// In the doPost(e) function, replace:
//   const secret = parsedBody.secret
// with:
//   const secret = e.parameter.authorization?.replace('Bearer ', '') 
//     || e.postData?.headers?.['Authorization']?.replace('Bearer ', '')
```

**Note:** Google Apps Script `doPost(e)` does NOT expose request headers directly. If the webhook is a Google Apps Script, you may need to keep the secret in the body OR switch to a Cloudflare Worker proxy that can read headers. In that case, skip this step and leave a TODO comment explaining why.

- [ ] **Step 3: Commit**

```bash
git add cms/src/hooks/afterLeadCreate.ts
git commit -m "fix: move webhook secret from request body to Authorization header"
```

---

### Task 6: Register sendOfflineConversion Hook in Leads Collection

**Files:**
- Modify: `cms/src/collections/Leads.ts:1,16`

The `sendOfflineConversion` hook is fully implemented in `cms/src/hooks/sendOfflineConversion.ts` but never imported or registered. It sends GA4 Measurement Protocol events when a lead status changes to `qualified` or `closed_won` — critical for offline conversion tracking.

- [ ] **Step 1: Import and register the hook**

In `cms/src/collections/Leads.ts`, add import at line 2:

```typescript
import { afterLeadCreate } from '../hooks/afterLeadCreate'
import { sendOfflineConversion } from '../hooks/sendOfflineConversion'
```

Wait — check if `afterLeadCreate` is already imported. Looking at the current file, the `hooks` block only has `beforeValidate` inline. The `afterLeadCreate` hook is imported in `admin/src/collections/Leads.ts` but NOT in `cms/src/collections/Leads.ts`. We need to add BOTH hooks.

Add imports at top of `cms/src/collections/Leads.ts` (after the existing type import on line 1):

```typescript
import { afterLeadCreate } from '../hooks/afterLeadCreate'
import { sendOfflineConversion } from '../hooks/sendOfflineConversion'
```

Then add `afterChange` to the hooks block. Change the hooks section (currently lines 16-35) to:

```typescript
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        if (data?.zipCode) {
          try {
            const settings = await req.payload.findGlobal({ slug: 'site-settings' })
            const validZips = (settings as any)?.serviceAreaZipCodes
              ?.split('\n')
              .map((z: string) => z.trim())
              .filter(Boolean) || []
            if (validZips.length > 0 && !validZips.includes(data.zipCode)) {
              data.isOutOfServiceArea = true
            }
          } catch {
            // If settings unavailable, don't flag
          }
        }
        return data
      },
    ],
    afterChange: [afterLeadCreate, sendOfflineConversion],
  },
```

- [ ] **Step 2: Verify CMS builds**

Run: `cd /Users/stevenbunker/clients/general-contracting && pnpm --filter cms build 2>&1 | tail -10`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add cms/src/collections/Leads.ts
git commit -m "feat: register afterLeadCreate and sendOfflineConversion hooks in CMS Leads collection"
```

---

### Task 7: Add Build Artifacts to .gitignore

**Files:**
- Modify: `.gitignore`

The `admin/.next/` directory and `cms/google-apps-script/` are showing as untracked in git status. Build artifacts should be ignored.

- [ ] **Step 1: Check current .gitignore for these entries**

Run: `grep -n '.next\|google-apps-script' /Users/stevenbunker/clients/general-contracting/.gitignore`

- [ ] **Step 2: Add missing entries if not already present**

Append to `.gitignore`:

```
# Admin build output
admin/.next/

# Google Apps Script working directory
cms/google-apps-script/
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: add admin/.next and cms/google-apps-script to gitignore"
```

---

### Task 8: Remove Enhanced Error Reporting from payload.ts

**Files:**
- Modify: `site/src/lib/payload.ts:116-122,136-142`

The `createLead` and `updateLead` functions parse raw CMS response bodies and include HTTP status codes and body content in error messages. These detailed errors propagate up through actions to the client. Revert to simpler error messages.

- [ ] **Step 1: Simplify error handling in createLead**

In `site/src/lib/payload.ts`, change lines 116-122 from:

```typescript
  if (!res.ok) {
    const rawBody = await res.text().catch(() => '')
    let parsed: any = {}
    try { parsed = JSON.parse(rawBody) } catch {}
    const msg = parsed?.errors?.[0]?.message || `HTTP ${res.status}: ${rawBody.slice(0, 300)}`
    throw new Error(msg)
  }
```

to:

```typescript
  if (!res.ok) {
    throw new Error(`Payload API error: ${res.status} ${res.statusText}`)
  }
```

- [ ] **Step 2: Simplify error handling in updateLead**

In `site/src/lib/payload.ts`, change lines 136-142 from:

```typescript
  if (!res.ok) {
    const rawBody = await res.text().catch(() => '')
    let parsed: any = {}
    try { parsed = JSON.parse(rawBody) } catch {}
    const msg = parsed?.errors?.[0]?.message || `HTTP ${res.status}: ${rawBody.slice(0, 300)}`
    throw new Error(msg)
  }
```

to:

```typescript
  if (!res.ok) {
    throw new Error(`Payload API error: ${res.status} ${res.statusText}`)
  }
```

- [ ] **Step 3: Verify the site builds**

Run: `cd /Users/stevenbunker/clients/general-contracting && pnpm --filter site build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add site/src/lib/payload.ts
git commit -m "fix: remove verbose CMS error parsing that leaked internal details"
```
