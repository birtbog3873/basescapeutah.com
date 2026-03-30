# Feature Specification: Hero Redesign + Dedicated Contact Page

**Feature Branch**: `013-hero-contact-page`
**Created**: 2026-03-30
**Status**: Draft
**Input**: User description: "Simplify homepage hero with ZIP input + trust-forward copy, create dedicated /contact page, restyle mobile bottom bar, add Google Sheets webhook for lead logging"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Homeowner Enters ZIP to Schedule Estimate (Priority: P1)

A homeowner lands on the BaseScape homepage and sees a clear, trust-forward message with a simple ZIP code input. They enter their ZIP and click "Schedule a Free Design" to be taken to a dedicated contact page where their ZIP is pre-filled, reducing friction to complete the multi-step form.

**Why this priority**: This is the core conversion funnel — homepage visit to lead capture. Simplifying the hero and creating a dedicated contact page directly impacts lead generation.

**Independent Test**: Can be fully tested by visiting the homepage, entering a ZIP code, clicking the CTA button, and verifying the contact page loads with the ZIP pre-populated in the form.

**Acceptance Scenarios**:

1. **Given** a homeowner is on the homepage, **When** they see the hero section, **Then** they see a trust-forward message ("No high-pressure sales..."), a ZIP code input, and a "Schedule a Free Design" button.
2. **Given** a homeowner enters "84645" in the hero ZIP input, **When** they click "Schedule a Free Design", **Then** they are navigated to `/contact?zip=84645`.
3. **Given** a homeowner arrives at `/contact?zip=84645`, **When** the page loads, **Then** the ZIP code field in Step 1 of the form is pre-populated with "84645".
4. **Given** a homeowner arrives at `/contact` without a ZIP parameter, **When** the page loads, **Then** the ZIP code field is empty and the form works normally.

---

### User Story 2 - Mobile User Taps Bottom Bar for Estimate (Priority: P1)

A mobile visitor sees a flat, edge-to-edge bottom bar with two options: "Call Now" and "Free Estimate". Tapping "Free Estimate" navigates to the dedicated contact page. Tapping "Call Now" initiates a phone call.

**Why this priority**: Mobile is the primary device for residential homeowners searching for contractors. The bottom bar is always visible and is a critical conversion element.

**Independent Test**: Can be tested on a mobile viewport by verifying the bottom bar renders as two flat, 50/50-split cells and that each button navigates to the correct destination.

**Acceptance Scenarios**:

1. **Given** a mobile visitor is browsing any page, **When** they see the bottom bar, **Then** they see two flat, edge-to-edge buttons: "Call Now" (light teal) and "Free Estimate" (dark navy) with no rounded corners, gaps, or shadows.
2. **Given** a mobile visitor taps "Free Estimate", **When** the tap is registered, **Then** they are navigated to `/contact`.
3. **Given** a mobile visitor taps "Call Now", **When** the tap is registered, **Then** a phone call is initiated to the business phone number.
4. **Given** a mobile visitor is on a device with a notch, **When** the bottom bar renders, **Then** safe-area inset padding is applied to avoid overlap with the device UI.

---

### User Story 3 - Lead Data Logs to Google Sheet (Priority: P2)

After a homeowner completes the lead form, their information is automatically logged to a Google Sheet in addition to being saved in the CMS. This allows the team to manage callbacks without a CRM.

**Why this priority**: Enables callback management workflow. Lower priority than the UI changes because the CMS already captures leads — this adds a convenience layer.

**Independent Test**: Can be tested by submitting a lead through the form and verifying the row appears in the Google Sheet within seconds.

**Acceptance Scenarios**:

1. **Given** a lead is submitted via the contact form, **When** the CMS processes the lead, **Then** the lead data (timestamp, name, phone, email, ZIP, service, purpose, timeline, source, page URL) is posted to a Google Sheet.
2. **Given** the Google Sheets webhook is unreachable, **When** a lead is submitted, **Then** the form submission still completes successfully — the user sees no error and the lead is saved in the CMS.
3. **Given** the webhook returns an error, **When** a lead is submitted, **Then** the error is silently caught and does not affect the user experience.

---

### User Story 4 - All CTAs Route to Contact Page (Priority: P2)

Every "Book Appointment" or estimate CTA across the site (header, service pages, CTA blocks, landing pages) now routes to `/contact` instead of scrolling to a form embedded on the current page. This makes conversion tracking cleaner and the form a single centralized location.

**Why this priority**: Ensures consistent conversion tracking and eliminates the redundancy of having the form on every page. Depends on the contact page existing (Story 1).

**Independent Test**: Can be tested by navigating to any page with a CTA and verifying it links to `/contact` rather than `#estimate-form`.

**Acceptance Scenarios**:

1. **Given** any page with a CTA block, **When** a user clicks the estimate/appointment button, **Then** they are navigated to `/contact`.
2. **Given** the homepage, service pages, or landing pages, **When** the page renders, **Then** no embedded form section appears at the bottom of the page.
3. **Given** the site's base layout, **When** any page loads, **Then** no multi-step form component is rendered outside of `/contact`.

---

### Edge Cases

- What happens when a user enters a non-numeric or partial ZIP (e.g., "846" or "abcde") in the hero input? The form navigates to `/contact?zip=846` — the contact page form handles validation normally without pre-populating an invalid value.
- What happens when a user bookmarks `/contact?zip=84645` and returns later? The ZIP is still pre-populated from the URL parameter.
- What happens when a CTA block explicitly passes an estimate URL prop? All explicit prop values referencing `#estimate-form` must be updated to `/contact`.
- What happens on pages that previously relied on `#estimate-form` anchor scrolling? Users are navigated to `/contact` — a full page navigation rather than a scroll.
- What happens if the Google Sheets webhook URL environment variable is not configured? The webhook call is skipped gracefully (check for the URL before attempting the POST).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Homepage hero MUST display trust-forward copy: "No high-pressure sales. No surprise charges. We'll walk you through your options, give you an honest estimate, and let you decide on your timeline." — replacing the current service-listing paragraph.
- **FR-002**: Homepage hero MUST include a ZIP code input field (numeric, 5-character max) and a single "Schedule a Free Design" submit button.
- **FR-003**: The hero ZIP form MUST navigate to `/contact?zip=XXXXX` on submission (GET method).
- **FR-004**: Homepage hero MUST retain the existing headline ("Your Basement Has a Better Future"), overline ("Utah's Wasatch Front"), and hero image layout (right on desktop, below on mobile).
- **FR-005**: A dedicated `/contact` page MUST exist as the single location for the lead capture form site-wide.
- **FR-006**: The contact page MUST read the `zip` query parameter from the URL and pre-populate the ZIP field in the form's first step.
- **FR-007**: The contact page MUST include trust badges and a "Prefer to call?" section with the business phone number below the form.
- **FR-008**: The multi-step form MUST accept an optional initial ZIP value and pre-populate Step 1 without auto-advancing steps.
- **FR-009**: The mobile bottom bar MUST render as two flat, edge-to-edge cells (50/50 split) with no rounded corners, gaps, or shadows.
- **FR-010**: The left cell of the mobile bottom bar MUST be "Call Now" with a phone icon on a light teal background, linking to the business phone number.
- **FR-011**: The right cell of the mobile bottom bar MUST be "Free Estimate" on a dark navy background, linking to `/contact`.
- **FR-012**: The mobile bottom bar MUST maintain safe-area inset padding for notched devices.
- **FR-013**: The embedded form section MUST be removed from the base layout so it no longer appears on every page.
- **FR-014**: All references to `#estimate-form` across the site (CTA blocks, header, landing layouts, mobile bottom bar) MUST be updated to `/contact`.
- **FR-015**: After a lead is saved in the CMS, the system MUST POST the lead data (timestamp, name, phone, email, ZIP, service, purpose, timeline, source, page URL) to a configurable webhook URL for Google Sheets logging.
- **FR-016**: The Google Sheets webhook MUST be fire-and-forget — it MUST NOT block the form response or cause user-visible errors if it fails.
- **FR-017**: A receiving endpoint MUST parse the incoming lead data and append a row to the configured Google Sheet with columns: Timestamp, Name, Phone, Email, ZIP, Service, Purpose, Timeline, Source, Page URL.
- **FR-018**: The webhook URL MUST be configurable via an environment variable so it can be changed without code deploys.

### Key Entities

- **Lead**: Name, phone, email, ZIP code, selected service, purpose, timeline, source URL, page URL, timestamp. Already exists in CMS — now additionally logged to Google Sheets.
- **Google Sheets Webhook**: External integration receiving lead data as JSON POST, configured via environment variable.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can navigate from homepage to the contact form in a single click (enter ZIP + click button).
- **SC-002**: The homepage above-the-fold area contains one clear call-to-action (ZIP + "Schedule a Free Design") rather than multiple competing CTAs.
- **SC-003**: Contact page visits are trackable as a distinct analytics event (dedicated URL `/contact`).
- **SC-004**: 100% of estimate/appointment CTAs across the site route to `/contact` — zero remaining references to `#estimate-form`.
- **SC-005**: Mobile bottom bar renders correctly on all tested viewports (iPhone, Android) with flat, edge-to-edge styling.
- **SC-006**: Lead data appears in both the CMS and the Google Sheet after every successful form submission.
- **SC-007**: Google Sheets webhook failures result in zero user-facing errors or form submission failures.
- **SC-008**: Pre-populated ZIP from the hero carries through to the contact page form, reducing form completion friction.

## Assumptions

- The business phone number is already available via the site's global settings (SiteSettings).
- The TrustBadges component already exists and can be reused on the contact page.
- The Google Apps Script web app will be deployed separately and the webhook URL provided as an environment variable.
- The existing multi-step form component can accept an optional prop for initial ZIP without breaking its current behavior.
- The hero image asset does not need to change — only the text and CTA elements are being redesigned.
