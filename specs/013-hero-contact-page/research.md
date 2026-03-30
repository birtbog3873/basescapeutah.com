# Research: Hero Redesign + Dedicated Contact Page

**Feature**: 013-hero-contact-page | **Date**: 2026-03-30

## Decision 1: Hero ZIP Form — HTML Form vs JavaScript Navigation

**Decision**: Use a plain HTML `<form method="GET" action="/contact">` with a named ZIP input.

**Rationale**:
- Progressive enhancement — works without JavaScript
- Produces a clean URL: `/contact?zip=84645`
- No React hydration needed for the hero ZIP input (stays in Astro, not a client component)
- The existing hero uses a `CTABlock` component, but the new design replaces both buttons with a single input+button — simpler to build as inline Astro markup in `index.astro`

**Alternatives considered**:
- JavaScript `window.location` navigation: Requires `client:load`, adds bundle size, breaks without JS
- Astro form action: Overkill — no server processing needed, just a redirect with a query param

## Decision 2: Contact Page Architecture — Static Page with URL Params

**Decision**: Create `/contact` as a static Astro page (`site/src/pages/contact.astro`) that reads `zip` from `Astro.url.searchParams` at build time for SSR-like behavior, or passes it client-side via the React form component.

**Rationale**:
- Astro static output mode means `Astro.url.searchParams` is NOT available at build time
- The ZIP pre-population must happen client-side: the `MultiStepForm` React component reads `URLSearchParams` from `window.location` on mount via `useEffect`
- This keeps the page fully static while enabling dynamic ZIP pre-fill

**Alternatives considered**:
- SSR mode for `/contact` only: Would require switching Astro output mode or using hybrid rendering — adds deployment complexity on Cloudflare Pages
- Data attribute on the form element: Works but less clean than reading URL params directly in React

## Decision 3: MultiStepForm Prop Extension

**Decision**: Add an optional `initialZip?: string` prop to `MultiStepForm`. On the contact page, pass the ZIP from URL params via a thin client-side wrapper. The form reads `window.location.search` in a `useEffect` on mount.

**Rationale**:
- The form already uses React hooks and `client:load` — adding URL param reading is trivial
- Keeps the prop interface simple: one optional string
- No auto-advance — just pre-fills the ZIP field in step 1 (per FR-008)
- The form component already has `sourcePage` prop precedent

**Alternatives considered**:
- Reading URL params in Astro and passing as prop: Won't work in static mode since the page is pre-rendered
- Custom wrapper component: Unnecessary indirection — the form itself can read params

## Decision 4: Google Sheets Webhook Location

**Decision**: Add the webhook POST in `cms/src/hooks/afterLeadCreate.ts`, after the team notification email block, as a fire-and-forget `fetch()` call.

**Rationale**:
- The afterLeadCreate hook already runs when lead status becomes "complete"
- It already has access to all lead fields (name, phone, email, zip, service, etc.)
- The hook already handles errors non-blocking (try/catch with logging)
- Adding here keeps all post-completion side effects in one place
- CMS runs on Cloudflare Workers — `fetch` is natively available

**Alternatives considered**:
- Astro action (site-side): Would require the site to know the webhook URL and duplicate the data assembly logic. Also runs at form submission time, adding latency for the user.
- Separate Payload hook: Unnecessary — afterLeadCreate already covers this trigger point
- n8n workflow: Adds external dependency; simpler to do a direct POST to Google Apps Script

## Decision 5: Google Apps Script Receiving Endpoint

**Decision**: The spec assumes a Google Apps Script web app will be deployed separately (Assumption in spec). The CMS just POSTs JSON to a configurable `GOOGLE_SHEETS_WEBHOOK_URL` env var. The receiving endpoint is out of scope for this feature but the payload format is documented.

**Rationale**:
- Separation of concerns: CMS sends data, Apps Script receives and writes to Sheet
- The webhook URL is configurable per environment (FR-018)
- If the webhook is not configured (`!process.env.GOOGLE_SHEETS_WEBHOOK_URL`), the call is skipped entirely (edge case from spec)

## Decision 6: Removing Form from BaseLayout

**Decision**: Remove the `<section id="estimate-form">` block entirely from `BaseLayout.astro`. The `MultiStepForm` will only exist on the `/contact` page.

**Rationale**:
- FR-013 explicitly requires removing the embedded form from the base layout
- All CTAs will route to `/contact` (FR-014), so no page needs the inline form
- `LandingLayout.astro` also has an `estimate-form` section — that must be removed too
- The `noscript` fallback CTA in BaseLayout should also be updated to link to `/contact`

**Alternatives considered**:
- Hiding the form with CSS: Leaves dead code; contradicts the spec's intent
- Conditional rendering: No condition needed — the form simply moves to one page

## Decision 7: Mobile Bottom Bar Restyling

**Decision**: Restyle `MobileBottomBar.astro` to flat, edge-to-edge cells with no rounded corners, gaps, or shadows. Use CSS custom properties for the teal (call) and navy (estimate) backgrounds.

**Rationale**:
- FR-009 through FR-012 specify exact visual requirements
- Existing component already has the two-button structure — just needs restyling
- Safe-area inset padding is already implemented (`env(safe-area-inset-bottom)`)
- Color tokens already exist: `teal400`/`teal500` for call, `navy800`/`navy900` for estimate

## Decision 8: Webhook Payload Format

**Decision**: POST JSON with these fields:

```json
{
  "timestamp": "2026-03-30T14:30:00Z",
  "name": "Jane Smith",
  "phone": "(801) 555-1234",
  "email": "jane@example.com",
  "zipCode": "84645",
  "serviceType": "walkout-basement",
  "projectPurpose": "family-space",
  "timeline": "1-3-months",
  "source": "https://basescapeutah.com/contact",
  "pageUrl": "https://basescapeutah.com/contact"
}
```

**Rationale**:
- Matches FR-015 field list exactly: timestamp, name, phone, email, ZIP, service, purpose, timeline, source, page URL
- JSON is the standard format for webhook payloads
- Google Apps Script `doPost(e)` can parse `JSON.parse(e.postData.contents)` trivially
- Source is the `source.page` field from the lead; pageUrl maps to the same
