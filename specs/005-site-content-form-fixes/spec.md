# Feature Specification: Site Content & Form Fixes

**Feature Branch**: `005-site-content-form-fixes`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "Reorder services grid, add Basement Remodeling, ensure Retaining Walls appears, remove Window Well Updates, fix Free Estimate form error, populate FAQ page with questions"

## Clarifications

### Session 2026-03-25

- Q: What content depth for the Basement Remodeling service page? → A: Full content matching existing service pages (overview, process steps, anxiety stack, differentiators, CTA, SEO metadata).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Services Grid Displays Correct Services in Correct Order (Priority: P1)

A visitor lands on the homepage and scrolls to "Our Specialized Services." They see six service cards displayed in this exact order: Walkout Basements, Basement Remodeling, Pavers and Hardscapes, Retaining Walls, Artificial Turf, Egress Windows. The "Window Well Updates" service no longer appears.

**Why this priority**: The services grid is the primary way visitors discover available services. Incorrect or missing services directly impacts lead generation and misrepresents the business offering.

**Independent Test**: Navigate to the homepage, scroll to the services section, and verify all six services appear in the specified order with no extras.

**Acceptance Scenarios**:

1. **Given** a visitor on the homepage, **When** they view "Our Specialized Services," **Then** they see exactly six service cards in this order: Walkout Basements, Basement Remodeling, Pavers and Hardscapes, Retaining Walls, Artificial Turf, Egress Windows.
2. **Given** a visitor on the homepage, **When** they view "Our Specialized Services," **Then** "Window Well Updates" does not appear as a service card.
3. **Given** a visitor clicks on "Basement Remodeling" in the grid, **When** the page loads, **Then** they are taken to a dedicated Basement Remodeling service detail page.
4. **Given** a visitor clicks on "Retaining Walls" in the grid, **When** the page loads, **Then** they are taken to the Retaining Walls service detail page.

---

### User Story 2 - Free Estimate Form Works Without Errors (Priority: P1)

A visitor wants to request a free estimate. They open the form, select a service, enter their ZIP code, and click "Next: Project Details." The form advances to step 2 without displaying "Something went wrong. Please try again."

**Why this priority**: The estimate form is the primary conversion mechanism. A broken form means zero leads are captured, directly blocking revenue.

**Independent Test**: Submit step 1 of the Free Estimate form with any valid service and ZIP code. Verify it advances to step 2 without error.

**Acceptance Scenarios**:

1. **Given** a visitor on any page with the Free Estimate form, **When** they select a service and enter a valid ZIP code and click "Next: Project Details," **Then** the form advances to step 2 (Details) without error.
2. **Given** a visitor completes all three form steps (Service, Details, Contact), **When** they submit the form, **Then** the form shows a success confirmation.
3. **Given** the form service dropdown, **When** a visitor opens it, **Then** the options include: Walkout Basement, Basement Remodeling, Pavers & Hardscapes, Retaining Walls, Artificial Turf, Egress Windows, and "Not Sure -- Help Me Decide." Window Well Upgrade is not listed.
4. **Given** a visitor enters an invalid or empty ZIP code, **When** they try to advance, **Then** they see a clear validation message (not a generic "Something went wrong" error).

---

### User Story 3 - Basement Remodeling Service Page Exists (Priority: P2)

A visitor interested in basement remodeling navigates to the Basement Remodeling service detail page (via the services grid or direct URL). They see a full-depth service page matching existing pages: overview, step-by-step process, anxiety stack (objection handling), differentiators, and a call-to-action to request an estimate.

**Why this priority**: Adding a new service requires a corresponding detail page so visitors from the grid have somewhere to land. A full-content page maintains quality parity with other services.

**Independent Test**: Navigate to the Basement Remodeling service page URL and verify it loads with all content sections matching the depth of other service pages.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the Basement Remodeling service page, **When** the page loads, **Then** they see a title, multi-section overview, step-by-step process, anxiety stack, differentiators, and a CTA to request an estimate.
2. **Given** a visitor is on the Basement Remodeling page, **When** they click "Get Free Estimate," **Then** the estimate form section is accessible with "Basement Remodeling" as a selectable option.
3. **Given** the Basement Remodeling page, **When** compared to other service pages (e.g., Walkout Basements), **Then** it has the same content sections and depth -- no missing sections.

---

### User Story 4 - FAQ Page Displays Actual Questions and Answers (Priority: P2)

A visitor navigates to the FAQ page and sees categorized, expandable questions with answers instead of the placeholder message "We're building out our FAQ section."

**Why this priority**: A populated FAQ page builds trust, reduces support calls, and helps with SEO. The current placeholder undermines credibility.

**Independent Test**: Navigate to the FAQ page and verify at least one category with questions appears, and each question expands to reveal an answer.

**Acceptance Scenarios**:

1. **Given** a visitor on the FAQ page, **When** the page loads, **Then** they see FAQ categories with questions displayed (not the placeholder message).
2. **Given** a visitor sees a FAQ question, **When** they click on it, **Then** the answer expands/collapses smoothly.
3. **Given** the FAQ content, **When** displayed, **Then** questions are grouped by relevant categories (e.g., Cost, Timeline, General).

---

### User Story 5 - Window Well Updates Service is Fully Removed (Priority: P3)

The Window Well Updates/Upgrades service is removed from all site-facing locations: services grid, navigation, form dropdowns, and any internal references. Visitors can no longer navigate to or select this service.

**Why this priority**: Keeping remnants of a removed service creates confusion and broken user journeys.

**Independent Test**: Search the site for any reference to "Window Well" in user-facing areas and verify none exist.

**Acceptance Scenarios**:

1. **Given** a visitor on any page, **When** they browse the site, **Then** they do not see "Window Well Updates" or "Window Well Upgrades" as a service option anywhere.
2. **Given** the site navigation and footer, **When** rendered, **Then** no links to a Window Well service page exist.
3. **Given** the Free Estimate form dropdown, **When** opened, **Then** "Window Well Upgrade" is not an option.
4. **Given** a visitor who has bookmarked the old Window Well Upgrades URL, **When** they visit it, **Then** they are redirected to the homepage or services overview rather than seeing a 404.

---

### Edge Cases

- What happens if the CMS is unreachable when the services grid loads? The existing fallback data must be updated to reflect the new six-service list and order.
- What happens if a visitor has a bookmarked URL for the Window Well Upgrades page? They should be redirected rather than seeing a 404.
- What happens if the form is submitted while the CMS API is temporarily down? The form should show a user-friendly retry message rather than a generic error.
- What happens if a visitor selects "Basement Remodeling" in the form but the CMS doesn't have the new service type registered? Validation must accept the new service type end-to-end.
- What happens if no FAQs are published in the CMS for a given category? That category should not render on the FAQ page.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The homepage services grid MUST display exactly six services in this order: Walkout Basements, Basement Remodeling, Pavers and Hardscapes, Retaining Walls, Artificial Turf, Egress Windows.
- **FR-002**: The "Window Well Updates" (or "Window Well Upgrades") service MUST be removed from the services grid, form dropdowns, navigation, and all user-facing pages.
- **FR-003**: A "Basement Remodeling" service detail page MUST exist with full content matching existing service pages: overview, process steps, anxiety stack, differentiators, CTA, and SEO metadata.
- **FR-004**: The Free Estimate form MUST function without displaying a "Something went wrong" error during normal operation (valid inputs, CMS available).
- **FR-005**: The Free Estimate form service dropdown MUST list: Walkout Basement, Basement Remodeling, Pavers & Hardscapes, Retaining Walls, Artificial Turf, Egress Windows, and "Not Sure -- Help Me Decide."
- **FR-006**: The form validation MUST accept all updated service types (including basement-remodeling, pavers-hardscapes, artificial-turf) and reject the removed type (window-well-upgrade).
- **FR-007**: The CMS lead capture MUST accept and store the updated set of service types from form submissions.
- **FR-008**: The FAQ page MUST display actual FAQ questions and answers grouped by category instead of the placeholder message.
- **FR-009**: The homepage fallback service data (used when CMS is unavailable) MUST reflect the updated six-service list and order.
- **FR-010**: The old Window Well Upgrades page URL MUST redirect visitors rather than returning a 404.

### Key Entities

- **Service**: A contractor service offered by the business (title, slug, tagline, value pillar, hero image, overview, CTA). Six active services after this change.
- **FAQ**: A question-answer pair with a category, applicable services, and sort order. Stored in CMS and displayed grouped by category.
- **Lead**: A form submission capturing service interest, project details, and contact information across three form steps.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: All six services appear on the homepage in the specified order with no omissions or extras.
- **SC-002**: The Free Estimate form completes all three steps (Service, Details, Contact) without error when valid data is entered.
- **SC-003**: The FAQ page displays at least 5 categorized questions with expandable answers (no placeholder message visible).
- **SC-004**: Clicking any service card in the grid navigates to a working service detail page (no 404s).
- **SC-005**: 100% of form service dropdown options match the current active service list (7 options total including "Not Sure").
- **SC-006**: Visitors arriving at the old Window Well Upgrades URL are redirected to a valid page.

## Assumptions

- The Basement Remodeling service page will have full content depth (overview, process, anxiety stack, differentiators, CTA, SEO metadata) matching existing service pages like Walkout Basements.
- FAQ content will be authored and entered into the CMS. A starter set of FAQs covering common questions about services, costs, timelines, and the service area will be created as part of this work.
- The "Something went wrong" form error is caused by a backend issue (CMS API connectivity, missing API key, or validation mismatch) rather than a frontend rendering bug -- root-cause investigation and fix is required.
- The Retaining Walls service page already exists from the previous feature branch (004-retaining-walls-service).
- Pavers & Hardscapes and Artificial Turf service detail pages already exist in the site.
- The Basement Remodeling service page will be created following the same Astro page template used by other service pages.
