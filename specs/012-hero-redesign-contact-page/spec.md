# 012 — Hero Redesign + Dedicated Contact Page

## Problem

BaseScape's current homepage hero feels redundant — the same phone CTA + "Book Appointment" appears in the hero, the sticky mobile bottom bar, and CTABlock sections throughout the site. The hero also lists all 6 services in a long paragraph that buries the value proposition.

Additionally, the MultiStepForm lives at the bottom of **every page** (embedded in BaseLayout), making it impossible to track contact-page visits as a distinct conversion metric. There's also no mechanism to log leads to a Google Sheet for callback management without a CRM.

## Goals

1. Simplify the above-the-fold hero to match Groundworks' pattern: ZIP input + single CTA
2. Replace the service-listing hero copy with trust-forward, no-pressure messaging (Southwest Exteriors style)
3. Move the form to a dedicated `/contact` page for cleaner analytics tracking
4. Restyle the mobile bottom bar to flat, edge-to-edge squares (Groundworks style)
5. Add a webhook from Payload CMS to Google Sheets via Apps Script for lead logging

## Design References

- **Groundworks** (groundworks.com): ZIP input + "Schedule a free Inspection" hero, flat bottom bar with "Call Now" | "Free Estimate"
- **Southwest Exteriors** (southwestexteriors.com): "We promise to never sell you anything...EVER. We'll teach you, guide you, and let you decide on your timeline."

---

## Requirements

### FR-01: Homepage Hero Redesign

**File:** `site/src/pages/index.astro` (lines 82-107)

- Keep headline: "Your Basement Has a **Better Future**"
- Keep overline: "Utah's Wasatch Front"
- Replace the long 6-service description with trust-forward copy:
  > "No high-pressure sales. No surprise charges. We'll walk you through your options, give you an honest estimate, and let you decide on your timeline."
- Replace the CTABlock component with:
  - A ZIP code text input (placeholder: "Enter your ZIP code", `inputmode="numeric"`, `maxlength="5"`)
  - A single **"Schedule a Free Design"** submit button (dark navy, full-width on mobile)
- The ZIP + button should be wrapped in a `<form action="/contact" method="get">` so clicking submits navigates to `/contact?zip=XXXXX`
- Keep the hero image on the right (desktop) / below (mobile)
- Remove the CTABlock import from the hero section

### FR-02: Mobile Bottom Bar Redesign

**File:** `site/src/components/layout/MobileBottomBar.astro`

- Restyle to match Groundworks' flat, edge-to-edge bottom bar:
  - No `border-radius` on buttons
  - No `gap` or `margin` between buttons
  - No `box-shadow` on the bar container
  - Two cells split 50/50, flush to the edges of the screen
  - Keep safe-area inset padding for notched devices (bottom only)
- Left cell: "Call Now" (with phone icon) — light blue/teal background, links to `tel:`
- Right cell: "Free Estimate" (no icon needed) — dark navy background, links to `/contact`
- Change text from "Book Appointment" → "Free Estimate"
- Change href from `#estimate-form` → `/contact`

### FR-03: Dedicated `/contact` Page

**New file:** `site/src/pages/contact.astro`

- Uses BaseLayout
- Page title: "Contact Us" or "Get Your Free Estimate"
- Heading: "Schedule Your Free Estimate"
- Reads `zip` query parameter from the URL (e.g., `/contact?zip=84645`)
- Embeds `<MultiStepForm client:load initialZip={zip} />`
- Below the form: trust badges (reuse `TrustBadges` component) and a "Prefer to call?" section with phone number
- The page should be the single location for the lead capture form site-wide

### FR-04: MultiStepForm `initialZip` Prop

**File:** `site/src/components/forms/MultiStepForm.tsx`

- Add optional prop: `initialZip?: string`
- When provided, pre-populate the ZIP code field in Step 1
- If `initialZip` is a valid 5-digit ZIP, auto-fill the field value on mount
- Do not auto-advance steps — let the user confirm and continue

### FR-05: Remove Form Section from BaseLayout

**File:** `site/src/layouts/BaseLayout.astro` (lines 87-93)

- Remove the `<section id="estimate-form">` block and its contents
- Remove the `MultiStepForm` import statement
- The form now only lives on `/contact`

### FR-06: Update All CTA Links Site-Wide

Change every `#estimate-form` reference to `/contact`:

| File | Change |
|------|--------|
| `site/src/components/content/CTABlock.astro` | Default `estimateUrl` prop: `#estimate-form` → `/contact` |
| `site/src/components/layout/MobileBottomBar.astro` | href: `#estimate-form` → `/contact` |
| `site/src/components/layout/Header.astro` | Update estimate link if present |
| Any page explicitly passing `estimateUrl="#estimate-form"` | Change to `/contact` |
| `site/src/layouts/LandingLayout.astro` | Update form references |

### FR-07: Webhook — Payload CMS → Google Sheets via Apps Script

**Files:**
- `cms/src/hooks/afterLeadCreate.ts` — add webhook POST
- Google Apps Script (deployed as web app) — receives POST, appends row

**Payload hook:**
- After the existing email notification logic in `afterLeadCreate.ts`
- POST lead data as JSON to `process.env.GOOGLE_SHEETS_WEBHOOK_URL`
- Fire-and-forget — `fetch()` with no `await` (don't block the response on Sheet logging)
- Wrap in try/catch so Sheet failures don't affect the form experience
- Include fields: timestamp, name, phone, email, zipCode, service, purpose, timeline, source, pageUrl

**Apps Script (`doPost` function):**
- Parse incoming JSON payload
- Append a row to the configured Google Sheet
- Return `{ status: 'ok' }` JSON response
- Sheet columns: Timestamp | Name | Phone | Email | ZIP | Service | Purpose | Timeline | Source | Page URL

**Environment:**
- Add `GOOGLE_SHEETS_WEBHOOK_URL` to CMS environment variables

---

## Files Summary

| File | Action |
|------|--------|
| `site/src/pages/index.astro` | MODIFY — rewrite hero section |
| `site/src/components/layout/MobileBottomBar.astro` | MODIFY — flat-square style |
| `site/src/components/content/CTABlock.astro` | MODIFY — default URL change |
| `site/src/layouts/BaseLayout.astro` | MODIFY — remove form section |
| `site/src/components/forms/MultiStepForm.tsx` | MODIFY — add `initialZip` prop |
| `site/src/pages/contact.astro` | CREATE — dedicated contact page |
| `cms/src/hooks/afterLeadCreate.ts` | MODIFY — add Google Sheets webhook |

---

## Acceptance Criteria

1. Homepage hero displays trust-forward copy + ZIP input + "Schedule a Free Design" button
2. Entering a ZIP and clicking the button navigates to `/contact?zip=XXXXX`
3. `/contact` page loads MultiStepForm with ZIP pre-populated from query string
4. Mobile bottom bar shows two flat, edge-to-edge squares: "Call Now" (light) | "Free Estimate" (dark)
5. Bottom bar "Free Estimate" links to `/contact`
6. No form sections render at the bottom of non-contact pages
7. All "Book Appointment" / `#estimate-form` links across the site now point to `/contact`
8. After form submission, lead data appears in both Payload CMS and the Google Sheet
9. Google Sheet webhook failures do not break the form submission flow
