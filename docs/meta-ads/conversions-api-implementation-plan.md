# Meta Conversions API Implementation Plan

> Status: **Planned, not yet implemented** · Last updated: 2026-05-19

## Context

BaseScape currently runs a browser-only Meta Pixel via GTM (`GTM-TD7KRSBB`). The Pixel fires PageView, ViewContent, and Lead events correctly from the browser, but **zero events are flowing server-side to Meta's Conversions API**. Meta Events Manager Diagnostics flagged this on 2026-05-19 with the warning:

> "Improve your rate of Meta Pixel events covered by Conversions API. Your server is sending 670 fewer events than pixel in the last 7 days. Advertisers with a 75% coverage rate saw a 35.5% lower cost per result versus pixel alone."

Three Meta integrations show as "Connected" in the Partners view (Meta Pixel, Conversions API, Conversions API Gateway), but **"Connected" only means auth metadata is registered** — no code is actually calling the API. The Pixel is the only thing actually firing.

Without CAPI, BaseScape is losing roughly 20–30% of conversion signal to ad blockers, iOS ATT, and browser storage limits. The diagnostic estimates a 35.5% CPA improvement is on the table once CAPI coverage reaches 75%+.

## Decision: Direct API from Astro Actions

**Three paths were evaluated:**

| Path | Verdict |
|---|---|
| **Direct API from Astro Action** (write a `meta-capi.ts` helper, call it from the existing Cloudflare Worker that handles form submits) | ✅ **Chosen.** $0 hosting cost, highest data fidelity (Payload Lead record has email/phone/name/zip to hash), no extra latency, dedup via shared event_id is simple |
| **GTM client + Server-side GTM (Stape)** | ❌ Rejected. $15–100/mo Stape hosting, lower data fidelity (raw email/phone has to traverse browser → sGTM), extra latency, adds vendor dependency. Only worth it if running 5+ ad platforms simultaneously |
| **Conversions API Gateway** | ❌ Rejected. Requires DNS subdomain + Pixel reconfig; auto-mirrors browser events so still inherits browser limitations (defeats the point of CAPI) |

The Direct API path fits BaseScape's existing architecture: form submits already hit a Cloudflare Worker via Astro Action ([site/src/actions/index.ts](../../site/src/actions/index.ts)), the Lead record already exists in Payload with all the fields needed for user_data hashing, and the codebase already has a precedent for fire-and-forget side effects via `ctx.waitUntil()` (Resend emails, Google Sheets webhook).

## Architecture

```
React form           Astro Action                  Meta
 (browser)           (Cloudflare Worker)
    │                       │                       │
    │ 1. generate           │                       │
    │    event_id (UUID)    │                       │
    │                       │                       │
    │ 2. fbq('track','Lead',│                       │
    │       {}, {eventID})  │───────────────────────►   ← Pixel event (browser)
    │                       │                       │
    │ 3. POST action with   │                       │
    │    event_id + fbp/fbc │                       │
    │    + form data        │                       │
    │─────────────────────► │                       │
    │                       │ 4. create Lead in     │
    │                       │    Payload            │
    │                       │                       │
    │                       │ 5. ctx.waitUntil(     │
    │                       │      fireMetaCAPI(    │
    │                       │        event_id,      │
    │                       │        user_data,     │
    │                       │        client_ip,     │
    │                       │        user_agent     │
    │                       │      )                │
    │                       │    )                  │
    │                       │───────────────────────►   ← CAPI event (server)
    │                       │                       │   Meta dedups via event_id
    │ 6. {success: true}    │                       │
    │ ◄──────────────────── │                       │
```

## Files to create / modify

### New: `site/src/lib/meta-capi.ts`

Server-side helper for posting Lead events to Meta's Conversions API.

Responsibilities:
- Hash user_data fields (email, phone, first name, last name, city, state, zip) per Meta's spec: SHA-256 of lowercased trimmed value (phone in E.164 format)
- Build the `/events` payload with `event_name`, `event_time`, `event_id`, `event_source_url`, `action_source: "website"`
- Include `user_data`: hashed identifiers + `client_ip_address` + `client_user_agent` + `fbp` + `fbc` (from cookies passed by the React form)
- Include `custom_data`: `value`, `currency`, optional `content_name`, `content_category`
- POST to `https://graph.facebook.com/v19.0/{PIXEL_ID}/events?access_token={TOKEN}`
- Silently no-op if env vars are missing (so preview deployments don't break)
- Pass `test_event_code` if `META_TEST_EVENT_CODE` env var is set (for verification in Events Manager Test Events tab)
- Log failures but never throw — this is fire-and-forget

Interface:
```ts
export async function fireMetaCAPI(params: {
  eventName: 'Lead'  // for now; expandable later
  eventId: string
  eventSourceUrl: string
  userData: {
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    city?: string
    state?: string
    zip?: string
    fbp?: string
    fbc?: string
    clientIp?: string
    clientUserAgent?: string
  }
  customData?: {
    value?: number
    currency?: string
    contentName?: string
    contentCategory?: string
  }
}): Promise<void>
```

### Modify: `site/src/actions/index.ts`

In `submitQuickCallback`, `saveFormStep` (on final step), and `submitLeadMagnet`, after the Payload Lead create succeeds, call `fireMetaCAPI()` inside `ctx.waitUntil()`. Same pattern as the existing `fireLeadWebhook` + `fireLeadEmails`.

Action input schema additions (Zod):
- `eventId?: string` — UUID generated client-side; required for dedup
- `fbp?: string` — Meta browser-pixel cookie value
- `fbc?: string` — Meta click-ID cookie value

Read `clientIp` from `Astro.request.headers.get('cf-connecting-ip')` and `userAgent` from `Astro.request.headers.get('user-agent')` — both available in the Cloudflare Worker runtime.

### Modify: React form components

- `site/src/components/forms/MultiStepForm.tsx`
- `site/src/components/forms/QuickCallback.tsx`
- `site/src/components/forms/LeadMagnetForm.tsx`

Changes per component:
1. Generate `eventId = crypto.randomUUID()` once at the moment of submission (not on mount — must be fresh per submit)
2. Read `_fbp` and `_fbc` cookies (small helper: `getCookie(name)`)
3. Pass `eventId`, `fbp`, `fbc` to the Astro Action call
4. Push `event_id` to the dataLayer alongside the existing `lead_submit` event so the GTM Pixel tag can read it as `eventID`:

```ts
window.dataLayer.push({
  event: 'lead_submit',
  event_id: eventId,           // NEW — for Pixel tag to consume as eventID
  form_id: 'multi_step_estimate',
  // ...existing fields
})
```

### GTM config (done in the GTM UI, not in code)

- Open container `GTM-TD7KRSBB` → Tags → Meta Pixel - Lead
- Under "Object Properties" or wherever the tag accepts custom event params, set **`eventID`** = `{{DLV - event_id}}` (a new Data Layer Variable mapped to the `event_id` key)
- This ensures the browser Pixel sends the same `eventID` as the server CAPI event, which is what triggers dedup on Meta's side

### New env vars

Add to Cloudflare Pages → Settings → Environment variables for the `basescape-site` project:

| Variable | Value | Notes |
|---|---|---|
| `META_PIXEL_ID` | (15–16 digit number from Events Manager → Overview) | Required |
| `META_CAPI_ACCESS_TOKEN` | (system-user token from Business Manager) | Required. Generate from Events Manager → Settings → Conversions API → Generate access token, OR from Business Settings → System Users → create system user → assign Pixel + generate token |
| `META_TEST_EVENT_CODE` | `TEST85402` (or whatever's shown in Events Manager Test Events) | **Set in preview env only**, NOT production. Marks events as test events so they show in the Test Events tab |

Also update `site/.env.example` to document the two production vars.

### Update GitHub Actions secrets

`.github/workflows/deploy-site.yml` writes env vars to `site/.env` from GitHub Actions secrets. Add `META_PIXEL_ID` and `META_CAPI_ACCESS_TOKEN` to the secret list there.

## Dedup mechanics (critical)

Meta dedups events when **both of these match**:
1. `event_name` (must be identical — case-sensitive)
2. `event_id` (must be identical)

Backup match (used if `event_id` differs): `event_name` + `external_id` OR `event_name` + `fbp`. Don't rely on this — always pass `event_id`.

The flow:
1. React component generates `eventId = crypto.randomUUID()` at submission time
2. That same UUID is:
   - Pushed to dataLayer as `event_id` → consumed by GTM Pixel tag as `eventID` parameter
   - Passed to Astro Action as input field
   - Used by `fireMetaCAPI()` as the `event_id` in the CAPI POST
3. Meta receives Pixel event (Browser) and CAPI event (Server) with identical `event_name: 'Lead'` and identical `event_id`
4. Meta keeps the first-arrived event and marks the second "Deduplicated"

## Event Match Quality (EMQ) targets

Current state: unknown but likely 4–6 (pixel only sends fbp, fbc, IP, UA — no PII).

Post-CAPI target: **8.0+**, ideally 8.5+.

Each hashed user_data field adds to the score:
- Email (`em`): biggest boost. Hashed lowercased trimmed
- Phone (`ph`): big boost. Hashed E.164 (e.g., `+18019198224` → SHA256)
- First/last name (`fn`, `ln`): hashed lowercased trimmed
- City/state/zip (`ct`, `st`, `zp`): hashed lowercased no-spaces
- IP + UA: passed unhashed
- `fbp` + `fbc`: passed as-is (cookie values, not hashed)

All seven fields are available on the BaseScape Lead record in Payload. We have everything Meta wants.

## Verification

1. **Set `META_TEST_EVENT_CODE` in preview env** (use the code shown in Events Manager → Test Events tab)
2. **Deploy a preview branch** with the new code
3. **Open Events Manager → Test Events** in one browser tab
4. **Submit a form** on the preview site in another tab
5. **Expected within ~5 seconds:**
   - Lead (Browser) event arrives with `event_id` = some UUID
   - Lead (Server) event arrives with the same `event_id`
   - The second one shows a **"Deduplicated"** badge
   - Both events have populated user_data (visible by expanding the event row)
6. **EMQ score** for Lead climbs to 8.0+ in Events Manager Overview within 24h
7. **Diagnostics tab** clears the "Improve your rate of Meta Pixel events covered by Conversions API" warning within 3–7 days of production traffic
8. **Remove `META_TEST_EVENT_CODE` from preview env** once verified — test events don't get used for ad optimization

## Out of scope (for this plan)

- **CallRail → Meta CAPI** for phone-call conversions. CallRail has a native Facebook Conversions API integration configured in CallRail's UI (Integrations → Facebook). That's separate work; CallRail's server posts directly to Meta, no overlap with the site code. Configure it after this plan ships.
- **Additional events beyond Lead** (e.g., ViewContent on service pages, AddToCart equivalents). Browser Pixel already sends these via GTM auto-instrumentation. CAPI mirroring those is lower priority — Lead is the conversion event Meta optimizes on.
- **Switching campaign optimization to CAPI Lead** once it's flowing. After 7+ days of solid CAPI data, edit the ad set's conversion event to ensure Meta is optimizing on the deduplicated server event, not the pixel-only one. This is a campaign edit (and a learning-phase reset) so do it deliberately.

## Estimated effort

- `meta-capi.ts` helper: 80–120 lines
- Astro Action changes: 15–20 lines per action × 3 actions = ~50 lines
- React form changes: 10–15 lines per form × 3 forms = ~40 lines
- GTM config: 5 minutes in the UI
- Env vars: 2 minutes in Cloudflare Pages
- Verification + EMQ check: 30 minutes
- **Total dev time: 2–4 hours for one PR.** Verification window: 24–72 hours of post-deploy monitoring.

## When to revisit this plan

- **If adding 3+ more ad platforms** (TikTok, LinkedIn, Pinterest, Snap, Reddit, Quora): re-evaluate Server-side GTM via Stape. At that scale, the $20/mo Stape cost is worth the unified config surface.
- **If form architecture changes** (e.g., moving to a Vercel-hosted Next.js form handler): the helper interface stays the same, but the runtime detection of IP/UA will need adjustment.
- **If Meta deprecates v19.0 of the Graph API**: update the URL in `meta-capi.ts`. Meta typically gives 1–2 years' notice; just bump the version when their docs flip.

## References

- Meta Conversions API for Web: https://developers.facebook.com/docs/marketing-api/conversions-api
- Event deduplication spec: https://developers.facebook.com/docs/marketing-api/conversions-api/deduplicate-pixel-and-server-events
- User data parameters (hashing rules): https://developers.facebook.com/docs/marketing-api/conversions-api/parameters/customer-information-parameters
- Test Events tool: Events Manager → BaseScape Website → Test Events
- Project CLAUDE.md → "CallRail Phone Number Routing" (for the Meta CallRail line and source-channel mapping)
