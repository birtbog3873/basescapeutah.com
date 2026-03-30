# Feature Specification: Site Fixes & Content Updates

**Feature Branch**: `003-site-fixes-content`
**Created**: 2026-03-24
**Status**: Draft
**Input**: User description: "Fix CTA button, multi-column footer, hide reviews, add Pavers/Hardscapes and Artificial Turf services, update license number, update liability text, restore FAQ answers, hide Gallery page, expand FAQ, update phone number"

## Clarifications

### Session 2026-03-24

- Q: What is the CTA button destination? → A: The multi-step lead capture form (already built into the site).
- Q: Should new services get dedicated pages or just homepage cards? → A: Both — cards in Specialized Services section + dedicated service pages with FAQ.
- Q: How should the reviews/Gallery visibility toggle work? → A: Global site settings in Payload CMS (e.g., `showReviews: boolean`, `showGallery: boolean`).

### Pre-Implementation Checklist Session 2026-03-24

- Q: CTA interaction pattern? → A: Smooth-scroll to in-page form section (highest conversion — keeps user on page, reduces friction). The `MultiStepForm` component must be present on every page via `BaseLayout.astro`.
- Q: Canonical phone format? → A: `(888) 414-0007` everywhere (display). Tel link: `tel:+18884140007`.
- Q: Gallery when hidden — 404 or redirect? → A: Remove from navigation menus when `showGallery` is false. Direct URL access returns 404.
- Q: Tablet footer (768-1024px)? → A: 2-column layout is acceptable.
- Q: Reviews hiding mechanism? → A: Conditional render (not in DOM at all) when `showReviews` is false. Content is not crawlable when hidden.
- Q: New service pages — patterns? → A: Match existing service page patterns (walkout-basements as reference): same URL structure (`/services/{slug}`), same meta tag pattern, same JSON-LD schema generation, same ServiceLayout. No breadcrumbs (none exist on current pages).
- Q: FAQ expansion methodology? → A: Research via Google "People Also Ask" and related queries at implementation time. Author selects relevant questions. Minimum 3 additional per service page.
- Q: FAQ content still in CMS? → A: Confirmed — full Lexical JSON answer content exists in seed data. Issue is serialization, not missing data.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fix "Get Free Estimate" CTA Button (Priority: P1)

A visitor lands on any page of the BaseScape website and clicks the "Get Free Estimate" button (the primary call-to-action). Currently, the button does not work — nothing happens on click. The button must launch the multi-step lead capture form so the visitor can submit their project details and contact information through a guided sequence.

**Why this priority**: The CTA button is the primary lead generation mechanism. A broken CTA means zero conversions from the website — this is the most critical fix.

**Independent Test**: Click every "Get Free Estimate" button across all pages and confirm each one navigates to the estimate request destination.

**Acceptance Scenarios**:

1. **Given** a visitor is on the homepage, **When** they click the "Get Free Estimate" button in the hero section, **Then** the multi-step lead capture form is launched.
2. **Given** a visitor is on any service page, **When** they click any "Get Free Estimate" CTA, **Then** the same multi-step lead capture form is launched.
3. **Given** a visitor is on a mobile device, **When** they tap the "Get Free Estimate" button, **Then** the button responds and navigates correctly.

---

### User Story 2 - Restore FAQ Answers on Service Pages (Priority: P2)

A homeowner visiting the Walkout Basements, Egress Windows, or Window Well Upgrades service pages scrolls to the "Your Questions, Answered" section. Currently, only the category headings (e.g., "Structural Safety", "Code Compliance") are visible — the actual answers have disappeared. The FAQ items must display both the question/category and the expandable answer content.

**Why this priority**: Missing FAQ answers degrade user experience and hurt SEO. These pages need complete content to build trust and answer buyer objections.

**Independent Test**: Visit each of the three service pages, expand each FAQ category, and verify that answer content is displayed.

**Acceptance Scenarios**:

1. **Given** a visitor is on the Walkout Basements page, **When** they click on a FAQ category (e.g., "Structural Safety"), **Then** the answer content expands and is visible below the heading.
2. **Given** a visitor is on the Egress Windows page, **When** they interact with the FAQ section, **Then** all categories show their answer content when expanded.
3. **Given** a visitor is on the Window Well Upgrades page, **When** they interact with the FAQ section, **Then** all categories show their answer content when expanded.

---

### User Story 3 - Update Business Information (Priority: P3)

The website currently displays placeholder business information. The following must be updated site-wide to reflect accurate, real business details:

- **License Number**: Change from placeholder (e.g., "UT-2026-00001") to `14082066-5501 B100`
- **Liability Insurance**: Change "$2M General Liability" to just "General Liability" (remove the dollar amount)
- **Phone Number**: Update from placeholder "(801) 555-1234" to `1-888-414-0007`

**Why this priority**: Incorrect business information creates legal risk and erodes trust. The license number is a regulatory requirement for contractor websites in Utah.

**Independent Test**: Search all pages for each piece of business information and confirm the correct values appear everywhere (footer, contact sections, header phone link, etc.).

**Acceptance Scenarios**:

1. **Given** a visitor views the footer, **When** the page loads, **Then** the license number displays as "14082066-5501 B100".
2. **Given** a visitor views the footer, **When** the page loads, **Then** the insurance line reads "Fully Insured & Bonded — General Liability" (no dollar amount).
3. **Given** a visitor views any page with a phone number, **When** the page loads, **Then** the phone number displays as "1-888-414-0007" and is a clickable tel: link.

---

### User Story 4 - Hide Reviews Section (Priority: P3)

The website currently displays a "What Homeowners Say" section with fabricated testimonials (Jennifer K., David L., Sarah M.). Since BaseScape has no real customers yet, these must be hidden to avoid legal issues around fake reviews.

**Why this priority**: Displaying fabricated reviews poses legal and reputational risk. This is a compliance concern that must be addressed before the site goes live.

**Independent Test**: Visit all pages that display the reviews/testimonials section and confirm it is not visible.

**Acceptance Scenarios**:

1. **Given** a visitor is on the homepage, **When** the page loads, **Then** the "What Homeowners Say" testimonials section is not visible.
2. **Given** a visitor is on any other page that previously showed reviews, **When** the page loads, **Then** no testimonial content is displayed.
3. **Given** real reviews are added in the future, **When** a site administrator enables the reviews section, **Then** the section becomes visible with real content.

---

### User Story 5 - Hide Gallery Page (Priority: P4)

The Gallery page exists in the navigation but BaseScape has no completed project photos yet. The page should be hidden from navigation and not accessible until real project images are available.

**Why this priority**: An empty or placeholder gallery undermines credibility. Hiding it until real content exists is better than showing dummy content.

**Independent Test**: Verify the Gallery link is removed from all navigation menus and the page is not directly accessible.

**Acceptance Scenarios**:

1. **Given** a visitor views the site navigation (header, footer, sitemap), **When** the page loads, **Then** there is no "Gallery" link visible.
2. **Given** a visitor tries to navigate directly to the Gallery URL, **When** they enter the URL, **Then** they are redirected to the homepage or see a 404 page.
3. **Given** the site owner adds project images in the future via the CMS, **When** they re-enable the Gallery page, **Then** it reappears in navigation with the uploaded images.

---

### User Story 6 - Multi-Column Footer Layout (Priority: P5)

On desktop viewports, the footer currently displays all content in a single stacked column. The footer should use a multi-column layout on desktop so that the company info, Services links, Company links, and Resources links appear side-by-side (as shown in the screenshot, the content exists in logical groups but stacks vertically).

**Why this priority**: A multi-column footer is a standard UX pattern that makes navigation easier and looks more professional. The content is already grouped — it just needs a responsive layout.

**Independent Test**: View the footer on desktop (1024px+ viewport) and confirm columns are side-by-side. View on mobile and confirm it gracefully stacks.

**Acceptance Scenarios**:

1. **Given** a visitor is on a desktop device (viewport 1024px+), **When** they scroll to the footer, **Then** the footer displays in multiple columns (company info, Services, Company, Resources side-by-side).
2. **Given** a visitor is on a mobile device (viewport < 768px), **When** they scroll to the footer, **Then** the footer stacks vertically and remains readable.
3. **Given** a visitor is on a tablet device, **When** they scroll to the footer, **Then** the footer adapts appropriately (2-column or full multi-column depending on width).

---

### User Story 7 - Add Pavers/Hardscapes and Artificial Turf Services (Priority: P5)

The "Specialized Services" section currently lists only the three core services. Two additional services should be added: "Pavers & Hardscapes" and "Artificial Turf." Each new service should appear as a card in the Specialized Services section on the homepage AND have its own dedicated service page (matching the pattern of existing service pages like Walkout Basements, Egress Windows, etc.), including a FAQ section.

**Why this priority**: Expanding the service offerings increases the addressable market and SEO footprint. These are real services BaseScape plans to offer.

**Independent Test**: Visit the page(s) displaying specialized services and confirm both new services appear with appropriate content.

**Acceptance Scenarios**:

1. **Given** a visitor views the specialized services section, **When** the page loads, **Then** "Pavers & Hardscapes" appears as a service listing.
2. **Given** a visitor views the specialized services section, **When** the page loads, **Then** "Artificial Turf" appears as a service listing.
3. **Given** a visitor clicks on either new service card, **When** they interact with the listing, **Then** they are taken to a dedicated service page with a full description, FAQ section, and CTA.
4. **Given** a visitor is on the Pavers & Hardscapes or Artificial Turf service page, **When** they scroll to the FAQ section, **Then** they see relevant questions and expandable answers sourced from Google search research.

---

### User Story 8 - Expand FAQ with Google Research (Priority: P6)

The existing FAQ sections on service pages should be expanded with additional common questions sourced from Google search data (People Also Ask, Related Queries). This improves SEO value and addresses more homeowner concerns.

**Why this priority**: This is a content enhancement that builds on existing functionality. Lower priority than fixes but high value for organic search.

**Independent Test**: Compare FAQ sections before and after — new questions should appear and be relevant to the service topic.

**Acceptance Scenarios**:

1. **Given** a visitor views the FAQ section on any service page, **When** the page loads, **Then** additional questions beyond the original set are displayed.
2. **Given** a search engine crawls the FAQ content, **When** the page is indexed, **Then** the FAQ content is structured in a way that could qualify for rich snippets.

---

### Edge Cases

- What happens if the multi-step lead capture form fails to load? The button should fall back to a working destination (e.g., contact page or tel: link) — verify the form loads correctly.
- What happens on pages where the reviews section was embedded inline vs. as a standalone component? Both instances must be hidden.
- What happens to the Gallery page URL in any XML sitemap? It should be removed from the sitemap when hidden.
- What if the phone number appears in both display format ("1-888-414-0007") and tel: link format ("tel:+18884140007")? Both must be updated consistently.
- What happens to the footer on viewports between 768px and 1024px? The layout should have a sensible intermediate state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: All "Get Free Estimate" buttons across the site MUST smooth-scroll to the in-page multi-step lead capture form section. The `MultiStepForm` component MUST be rendered on every page via `BaseLayout.astro`.
- **FR-002**: The phone number MUST display as "(888) 414-0007" (canonical format) and MUST be a clickable tel: link pointing to `tel:+18884140007`.
- **FR-003**: The license number MUST display as "14082066-5501 B100" in the footer and any other location where it appears.
- **FR-004**: The insurance reference MUST read "General Liability" without any dollar amount (remove "$2M" prefix).
- **FR-005**: The "What Homeowners Say" / testimonials section MUST be conditionally rendered (not in DOM) on all pages when `showReviews` is false. Content MUST NOT be crawlable when hidden.
- **FR-006**: The Gallery page MUST be removed from all navigation menus (header, footer, mobile nav) when `showGallery` is false. Direct URL access MUST return 404 when hidden.
- **FR-006a**: The Gallery page MUST be excluded from the XML sitemap when `showGallery` is false.
- **FR-007**: The FAQ "Your Questions, Answered" sections on Walkout Basements, Egress Windows, and Window Well Upgrades pages MUST display expandable answer content (not just category headings).
- **FR-008**: The footer MUST display in a multi-column layout on desktop viewports (1024px+) with logical column groupings: brand/address column, then Services, Company, and Resources link columns (matching current CMS `footerNav` structure).
- **FR-008a**: The footer MUST display in a 2-column layout on tablet viewports (768px–1024px).
- **FR-009**: The footer MUST stack to a single-column layout on mobile viewports (<768px).
- **FR-010**: "Pavers & Hardscapes" MUST appear as a card in the specialized services section AND have a dedicated service page with description, FAQ, and CTA.
- **FR-011**: "Artificial Turf" MUST appear as a card in the specialized services section AND have a dedicated service page with description, FAQ, and CTA.
- **FR-012**: FAQ sections on service pages MUST be expanded with additional questions sourced from Google search research (People Also Ask, Related Queries).
- **FR-013**: The reviews section and Gallery page MUST be re-enable-able by a site administrator via global site settings toggles in Payload CMS (e.g., `showReviews`, `showGallery` booleans) — no code changes or redeployment required.

## Assumptions

- The "Get Free Estimate" button launches the existing multi-step lead capture form already built into the site — the fix is connecting the button to it, not creating a new form.
- The FAQ answer content exists in the CMS seed data as full Lexical JSON — the issue is serialization (Lexical JSON → HTML), not missing content. Confirmed 2026-03-24.
- The phone number "18884140007" MUST be displayed as "(888) 414-0007" (canonical format). No alternative formats.
- New service descriptions for Pavers & Hardscapes and Artificial Turf will need to be written as part of this work, including full service page content, FAQ sections, and appropriate CTAs — matching the pattern of existing service pages.
- "Hiding" reviews and Gallery means conditional rendering driven by global Payload CMS site settings (`showReviews`, `showGallery` booleans), so they can be toggled on/off by an admin without code changes.
- The Gallery page CMS upload capability is a future feature and is not in scope for this specification — only hiding the page is in scope.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of "Get Free Estimate" buttons across all pages launch the multi-step lead capture form on both desktop and mobile.
- **SC-002**: All three service pages (Walkout Basements, Egress Windows, Window Well Upgrades) display expandable FAQ answers — zero categories show only headings.
- **SC-003**: The license number "14082066-5501 B100" appears in all footer instances and matches the real license.
- **SC-004**: No fabricated testimonials or review content is visible anywhere on the site.
- **SC-005**: The Gallery page is inaccessible from navigation and direct URL access.
- **SC-006**: The footer displays in 3-4 columns on desktop (1024px+) and stacks on mobile (<768px).
- **SC-007**: Both "Pavers & Hardscapes" and "Artificial Turf" appear as cards in the specialized services section and each has a dedicated service page with description, FAQ, and CTA.
- **SC-008**: The phone number "(888) 414-0007" or "1-888-414-0007" appears and is clickable on all pages where a phone number is displayed.
- **SC-009**: Each service page FAQ section contains at least 3 additional questions beyond the original set, sourced from real search data.
