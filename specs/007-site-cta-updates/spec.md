# Feature Specification: Site CTA and Phone Display Updates

**Feature Branch**: `007-site-cta-updates`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "Change 'Get Free Estimate' to 'Book Appointment'. Replace 'Call Now' with a button showing the phone icon and phone number. Add phone icon next to the number in the Desktop menu. 'Book Appointment' still triggers a form submission."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Book Appointment CTA (Priority: P1)

A visitor sees a "Book Appointment" button prominently in the site header and CTA sections. Clicking it opens the existing estimate/callback form so they can submit their information. This replaces the previous "Get Free Estimate" label across the site.

**Why this priority**: The primary CTA label change is the core of this feature. It reframes the user action from requesting a passive estimate to actively scheduling, which better matches the in-home selling model.

**Independent Test**: Can be tested by verifying all instances of "Get Free Estimate" now read "Book Appointment" and still open the form submission flow.

**Acceptance Scenarios**:

1. **Given** a visitor is on any page with a CTA, **When** they see the primary action button, **Then** it reads "Book Appointment" (not "Get Free Estimate").
2. **Given** a visitor clicks "Book Appointment" in the header, **When** the form opens, **Then** the form submission flow works identically to the previous "Get Free Estimate" flow.
3. **Given** a visitor clicks "Book Appointment" in any CTA block section, **When** the form opens, **Then** the form submission flow works identically to the previous flow.
4. **Given** a visitor is on mobile and sees the bottom bar, **When** they view the bottom bar, **Then** it reads "Book Appointment" instead of "Free Estimate."

---

### User Story 2 - Phone Number Button with Icon (Priority: P1)

Instead of a generic "Call Now" text link, the call button displays a phone icon alongside the actual phone number (e.g., "(888) 414-0007"). On mobile, tapping the button initiates a phone call via `tel:` link. On desktop, the number is visible so users can read it and manually dial on their own phone if they prefer.

**Why this priority**: Showing the phone number directly removes a click barrier. Desktop users can see the number without clicking, and mobile users still get tap-to-call. Equal priority with the label change since both are part of the same CTA overhaul.

**Independent Test**: Can be tested by verifying the call button shows the phone icon + phone number, and that clicking/tapping it still initiates a call.

**Acceptance Scenarios**:

1. **Given** a visitor is on the site (desktop), **When** they look at the header call button, **Then** they see a phone icon followed by the phone number (e.g., "(888) 414-0007").
2. **Given** a visitor is on the site (desktop), **When** they click the phone number button, **Then** the browser initiates a `tel:` action.
3. **Given** a visitor is on mobile, **When** they see the call button in the mobile bottom bar, **Then** it displays the phone icon and phone number.
4. **Given** a visitor is on mobile, **When** they tap the phone number button, **Then** their phone initiates a call to the displayed number.
5. **Given** the phone number is updated in the CMS, **When** the site rebuilds, **Then** the button reflects the updated number everywhere.

---

### User Story 3 - Phone Icon in Desktop Menu (Priority: P2)

On desktop, the phone number displayed in the navigation/header area includes a phone icon next to it, making it visually clear that it is a callable number.

**Why this priority**: Visual enhancement that improves scannability but doesn't change functionality. The number is already displayed in the header; this adds an icon for clarity.

**Independent Test**: Can be tested by viewing the desktop header and confirming a phone icon appears adjacent to the phone number in the menu area.

**Acceptance Scenarios**:

1. **Given** a visitor is on the site using a desktop browser, **When** they view the header navigation, **Then** a phone icon appears next to the phone number.
2. **Given** a visitor resizes the browser below the mobile breakpoint, **When** the mobile layout activates, **Then** the desktop phone-icon-in-menu element is hidden (handled by mobile bottom bar instead).

---

### Edge Cases

- What happens if the phone number is missing from the CMS? The fallback phone number should still display with the icon.
- What happens on very narrow desktop viewports where space is tight? The phone number and icon in the button should remain intact without overflow or layout breaking.
- What happens with screen readers? Phone icons should have appropriate accessibility attributes so assistive technology announces the phone number correctly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All instances of "Get Free Estimate" text MUST be changed to "Book Appointment" across the header, mobile bottom bar, and CTA block components.
- **FR-002**: The "Call Now" button MUST be replaced with a button that displays a phone icon and the actual phone number (sourced from CMS with fallback).
- **FR-003**: The phone number button MUST use a `tel:` link so it is tappable/clickable to initiate a call.
- **FR-004**: The desktop header navigation MUST display a phone icon adjacent to the phone number in the menu area.
- **FR-005**: The "Book Appointment" button MUST still trigger the existing form submission flow with no changes to form behavior.
- **FR-006**: The phone number displayed in buttons MUST be dynamically sourced from the CMS settings, using the existing fallback value if CMS data is unavailable.
- **FR-007**: Phone icons MUST include appropriate accessibility attributes for screen readers.

### Key Entities

- **Site Settings (CMS)**: Contains the phone number used across all CTA components. No changes to the data model; only the display presentation changes.
- **CTA Components**: Header, MobileBottomBar, CTABlock -- all require label and icon updates.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of "Get Free Estimate" labels across the site are replaced with "Book Appointment."
- **SC-002**: The phone number is visible on the call button in both desktop and mobile views without requiring a click or hover.
- **SC-003**: A phone icon appears next to the phone number in the desktop navigation menu.
- **SC-004**: Form submission flow from "Book Appointment" buttons works with zero regressions -- same completion flow, same data captured.
- **SC-005**: The call button successfully initiates a phone call when tapped on mobile devices.

## Assumptions

- The existing form submission flow (MultiStepForm or QuickCallback) requires no functional changes -- only the button label that triggers it changes.
- The phone icon will use the existing icon system already in the codebase (same icon set used for the phone icon in the mobile bottom bar).
- The CTA changes apply globally -- there are no pages where the old "Get Free Estimate" label should be preserved.
- The mobile bottom bar's "Call Now" button should also be updated to show the phone number, consistent with the header pattern.
