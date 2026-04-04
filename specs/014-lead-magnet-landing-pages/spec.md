# Feature Specification: Lead Magnet Dedicated Landing Pages

**Feature Branch**: `014-lead-magnet-landing-pages`  
**Created**: 2026-04-04  
**Status**: Draft  
**Input**: User description: "The Lead Magnet has the 'Download Free Guide Button' and the Download Free Guide Form right below it. I think that the lead magnet should have a dedicated landing page for each of the lead magnets where the form is located. I'd also like an image of the front cover of the pdf guide and an explanation of the guide's benefits on the landing page for the Lead Magnet."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor Downloads Guide from Dedicated Landing Page (Priority: P1)

A homeowner visits a lead magnet landing page (e.g., `/guides/walkout-basements`) and sees a compelling page with the PDF guide's front cover image, a clear explanation of what they'll learn, and a simple email capture form. After submitting their email, they receive the download link immediately on the page.

**Why this priority**: This is the core feature -- the dedicated landing page is the primary conversion mechanism. Without this, no other story matters.

**Independent Test**: Can be fully tested by navigating to a lead magnet landing page URL, viewing the cover image and benefits, submitting the form with an email address, and receiving the download link.

**Acceptance Scenarios**:

1. **Given** a published lead magnet with a cover image and benefits configured, **When** a visitor navigates to the lead magnet's landing page URL, **Then** they see the PDF cover image, the guide title, a description of benefits, and an email capture form.
2. **Given** a visitor is on a lead magnet landing page, **When** they enter their email and submit the form, **Then** they receive a download link for the PDF guide and a success confirmation.
3. **Given** a visitor is on a lead magnet landing page, **When** they submit the form without a valid email, **Then** they see a clear validation error and the form does not submit.

---

### User Story 2 - Service Page Links to Lead Magnet Landing Page (Priority: P2)

On service pages, the existing "Download Free Guide" CTA card links visitors to the dedicated lead magnet landing page instead of scrolling to an inline form on the same page. The inline form is removed from service pages.

**Why this priority**: This connects the existing traffic funnel (service pages) to the new dedicated landing pages, ensuring visitors are funneled to the optimized conversion experience.

**Independent Test**: Can be tested by visiting a service page with an associated lead magnet, clicking the "Download Free Guide" button, and verifying it navigates to the correct lead magnet landing page.

**Acceptance Scenarios**:

1. **Given** a service page with an associated lead magnet, **When** a visitor clicks the "Download Free Guide" button, **Then** they are navigated to the lead magnet's dedicated landing page.
2. **Given** a service page with an associated lead magnet, **When** the page renders, **Then** there is no inline lead magnet form visible below the CTA card.

---

### User Story 3 - CMS Admin Manages Landing Page Content (Priority: P3)

A CMS admin configures each lead magnet's landing page content -- uploading a cover image, writing a list of benefits/what the guide covers, and previewing how it will appear. This content is managed through the existing LeadMagnets collection.

**Why this priority**: Content management is essential for ongoing operations but is secondary to the visitor-facing experience being functional.

**Independent Test**: Can be tested by logging into the CMS admin, editing a lead magnet entry, uploading a cover image, entering benefits text, and verifying the published landing page reflects the changes.

**Acceptance Scenarios**:

1. **Given** a CMS admin is editing a lead magnet, **When** they upload a cover image and enter benefits content, **Then** the fields save successfully and are retrievable via the API.
2. **Given** a lead magnet has a cover image and benefits configured, **When** the site is rebuilt, **Then** the landing page displays the updated content.
3. **Given** a lead magnet is in "draft" status, **When** a visitor tries to access its landing page URL, **Then** the page is not generated (404).

---

### Edge Cases

- What happens when a lead magnet has no cover image uploaded? The landing page renders without the image, showing only the title, benefits, and form.
- What happens when a lead magnet has no benefits content? The landing page renders with just the title, description, cover image (if present), and form.
- What happens when a visitor accesses a lead magnet landing page URL that doesn't exist? They see a 404 page.
- What happens when a service page references a lead magnet that has been unpublished? The CTA card is hidden on that service page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Each published lead magnet MUST have a dedicated landing page accessible at a unique URL path.
- **FR-002**: The landing page MUST display the PDF guide's front cover image when one is configured.
- **FR-003**: The landing page MUST display a list of benefits or description of what the guide covers.
- **FR-004**: The landing page MUST include an email capture form (with optional name field) that triggers the existing lead magnet submission flow.
- **FR-005**: After successful form submission, the visitor MUST receive a download link on the page.
- **FR-006**: The "Download Free Guide" CTA on service pages MUST link to the lead magnet's dedicated landing page instead of an inline form.
- **FR-007**: The inline lead magnet form on service pages MUST be removed.
- **FR-008**: The CMS MUST allow admins to upload a cover image for each lead magnet.
- **FR-009**: The CMS MUST allow admins to enter benefits/highlights content for each lead magnet.
- **FR-010**: Only published lead magnets MUST generate landing pages; draft lead magnets MUST NOT be accessible.
- **FR-011**: The landing page MUST include the guide title and description prominently.
- **FR-012**: The landing page MUST track form submissions with the existing analytics events.

### Key Entities

- **Lead Magnet**: The core resource -- a downloadable PDF guide with title, description, cover image, benefits content, download file, and publication status. Extended from the existing entity with new cover image and benefits fields.
- **Lead Magnet Landing Page**: A dedicated page generated for each published lead magnet, containing the cover image, benefits, and email capture form. This is a new page type derived from the lead magnet entity (not a separate CMS collection).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Each published lead magnet has a unique, accessible landing page URL that loads successfully.
- **SC-002**: Visitors can complete the email capture form and receive a download link in under 30 seconds.
- **SC-003**: The landing page displays the cover image, benefits, and form without layout issues across mobile, tablet, and desktop viewports.
- **SC-004**: Service page "Download Free Guide" buttons correctly navigate to the associated lead magnet landing page (zero broken links).
- **SC-005**: Lead magnet form submissions from the landing page are tracked as conversion events in analytics.

## Assumptions

- The landing page URL pattern will follow `/guides/[slug]` (similar to how blog uses `/blog/[slug]`), keeping `/lp/` reserved for paid ad landing pages.
- The cover image is a static image uploaded by the admin (e.g., a designed mockup of the PDF cover), not an auto-generated thumbnail from the PDF.
- The benefits content will be a rich text field allowing flexible formatting (bullet lists, bold text, etc.).
- The existing `submitLeadMagnet` Astro Action and `LeadMagnetForm` React component will be reused on the landing page with no changes to the submission flow.
- The landing page layout will use the site's standard navigation (not the suppressed landing page layout used for paid ads).
- Blog post lead magnet CTAs (inline within articles) will also link to the dedicated landing page.
