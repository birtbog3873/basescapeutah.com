# Feature Specification: Add Retaining Walls Service

**Feature Branch**: `004-retaining-walls-service`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "I'd like to add a new service for Retaining Walls"

## Clarifications

### Session 2026-03-25

- Q: What is the primary value pillar for retaining walls? → A: Transformation (primary) + Safety (supporting) — emphasizes landscape transformation.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Homeowner Discovers Retaining Walls Service (Priority: P1)

A homeowner on the Wasatch Front searches for retaining wall services or arrives at the BaseScape site through another service page. They navigate to the Retaining Walls service page, learn what BaseScape offers, understand the process, and feel confident enough to request a free estimate.

**Why this priority**: Without a dedicated service page, there is no way for potential customers to learn about retaining wall offerings or convert into leads. This is the foundational piece — everything else depends on it.

**Independent Test**: Can be fully tested by navigating to `/services/retaining-walls` and verifying the page loads with all required sections (hero, overview, process steps, anxiety stack, differentiator, FAQs, CTA).

**Acceptance Scenarios**:

1. **Given** the site is loaded, **When** a visitor navigates to `/services/retaining-walls`, **Then** they see a fully rendered service page with hero, overview, process steps, anxiety-relief content, differentiator, FAQs, and estimate CTA sections.
2. **Given** a visitor is on the retaining walls page, **When** they click "Get Free Estimate", **Then** they are scrolled to the estimate form with "Retaining Walls" available as a service selection.
3. **Given** the CMS is unavailable, **When** the retaining walls page is built, **Then** the page renders using hardcoded fallback content with all sections intact.

---

### User Story 2 - Navigation Access to Retaining Walls (Priority: P2)

A visitor browsing the BaseScape website can find "Retaining Walls" in the site navigation (header services dropdown and footer), making the service discoverable from any page on the site.

**Why this priority**: The service page exists (P1) but visitors need to find it. Without navigation links, the page is only accessible via direct URL or search engines.

**Independent Test**: Can be tested by verifying "Retaining Walls" appears in the header services dropdown and footer service links, and that each link navigates to `/services/retaining-walls`.

**Acceptance Scenarios**:

1. **Given** a visitor is on any page, **When** they open the Services dropdown in the header, **Then** "Retaining Walls" appears as a navigation item linking to `/services/retaining-walls`.
2. **Given** a visitor scrolls to the footer, **When** they look at the services section, **Then** "Retaining Walls" is listed with a link to `/services/retaining-walls`.

---

### User Story 3 - Retaining Walls Lead Capture (Priority: P3)

A homeowner interested in retaining walls submits the multi-step estimate form selecting "Retaining Walls" as their service type. The lead is captured, the team receives a notification email with the correct service label, and the homeowner receives a confirmation email.

**Why this priority**: Lead capture already works for other services. This story verifies the end-to-end flow specifically for the new "Retaining Walls" option — ensuring no data mapping gaps.

**Independent Test**: Can be tested by submitting the estimate form with "Retaining Walls" selected and verifying the lead record is created in the CMS with the correct service type, and both notification and confirmation emails display "Retaining Walls" as the service.

**Acceptance Scenarios**:

1. **Given** a visitor is on the estimate form, **When** they select "Retaining Walls" from the service dropdown, **Then** the value `retaining-walls` is submitted and accepted by the form validation.
2. **Given** a lead is submitted with service type `retaining-walls`, **When** the team notification email is sent, **Then** the email displays "Retaining Walls" as the service label.
3. **Given** a lead is submitted with service type `retaining-walls`, **When** the homeowner confirmation email is sent, **Then** the email references the retaining walls service correctly.

---

### User Story 4 - SEO & Schema Markup (Priority: P4)

The retaining walls service page has proper SEO metadata (title, description, OG tags) and structured data (Service schema, FAQ schema) so search engines can index and display rich results for retaining wall queries on the Wasatch Front.

**Why this priority**: SEO is important for organic discovery but the page must exist and be functional first. Schema markup can be added alongside or shortly after the page without blocking launch.

**Independent Test**: Can be tested by inspecting the page's `<head>` for meta tags and JSON-LD structured data, and validating with Google's Rich Results Test.

**Acceptance Scenarios**:

1. **Given** the retaining walls page is rendered, **When** the page source is inspected, **Then** it contains a unique meta title (under 60 characters), meta description (under 160 characters), and OG tags.
2. **Given** the retaining walls page is rendered, **When** the page source is inspected, **Then** it contains JSON-LD structured data for the Service and FAQ schemas.

---

### Edge Cases

- What happens when the Payload CMS is unavailable during build? The page must render with hardcoded fallback content (matching the pattern used by all other service pages).
- What happens if a visitor bookmarks an old URL format? The service page should use the canonical slug `/services/retaining-walls` consistently.
- What happens when a lead selects "Retaining Walls" but the CMS Leads collection hasn't been migrated yet? The form validation and CMS select options must both include `retaining-walls` as a valid value.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST have a dedicated service page at `/services/retaining-walls` that follows the same layout structure as existing service pages (hero, overview, process steps, anxiety stack, differentiator, FAQs, trust badges, CTA).
- **FR-002**: The retaining walls page MUST include hardcoded fallback content so the page builds successfully when the CMS is unavailable.
- **FR-003**: The site navigation (header services dropdown) MUST include a "Retaining Walls" link pointing to `/services/retaining-walls`.
- **FR-004**: The site footer MUST include "Retaining Walls" in the services listing if other services are listed there.
- **FR-005**: The estimate form MUST include "Retaining Walls" as a selectable service option in the service type dropdown.
- **FR-006**: The form validation MUST accept `retaining-walls` as a valid service type value.
- **FR-007**: The CMS Leads collection MUST accept `retaining-walls` as a valid service type for lead records.
- **FR-008**: Team notification and lead confirmation emails MUST display "Retaining Walls" as a human-readable service label when a retaining walls lead is submitted.
- **FR-009**: The retaining walls page MUST include proper SEO metadata (meta title, meta description, OG tags) and JSON-LD structured data (Service schema and FAQ schema).
- **FR-010**: The retaining walls fallback content MUST include at least 4 process steps, at least 3 anxiety stack entries, at least 5 FAQs, a tagline, an overview, and a differentiator section — all specific to retaining wall services.

### Key Entities

- **Service (Retaining Walls)**: A new entry in the Services CMS collection with slug `retaining-walls`, title "Retaining Walls", appropriate value pillar, and all content fields populated. Relates to FAQs, Projects, and Reviews.
- **Lead**: Existing entity extended to accept `retaining-walls` as a valid `serviceType` value. No new fields required.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can navigate to the retaining walls service page from any page on the site in 2 clicks or fewer (header nav → service page).
- **SC-002**: The retaining walls page loads with all required content sections (hero, overview, process, anxiety stack, differentiator, FAQs, CTA) both with and without CMS connectivity.
- **SC-003**: 100% of estimate form submissions with "Retaining Walls" selected are successfully captured as leads with the correct service type.
- **SC-004**: The retaining walls page passes Google's Rich Results Test for Service and FAQ structured data.
- **SC-005**: The retaining walls page has a unique, keyword-targeted meta title and description that render correctly in search engine result previews.

## Assumptions

- The retaining walls service follows the same page layout, styling, and CMS content model as existing services (walkout basements, egress windows, etc.). No new layout components or CMS fields are needed.
- The primary value pillar for retaining walls is "transformation" (landscape/structural transformation) with "safety" as a supporting pillar.
- The service type in the CMS is "core" (primary offering, not specialized/complementary).
- Retaining wall content (overview, process, FAQs, anxiety stack) will be provided as hardcoded fallback data in the service page file, following the same pattern as the walkout basements page. CMS-managed content can override this later.
- No new Payload CMS collection or schema changes are needed beyond adding `retaining-walls` to the existing Leads `serviceType` select options (already completed).
- The estimate form, validation, and email template changes for `retaining-walls` have already been implemented as part of prior work.
