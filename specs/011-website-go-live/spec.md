# Feature Specification: BaseScape Website Go-Live

**Feature Branch**: `011-website-go-live`
**Created**: 2026-03-25
**Status**: Draft
**Input**: User description: "What do we need to do to get the BaseScape website live?"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Homeowner Finds BaseScape and Submits a Lead (Priority: P1)

A homeowner on the Wasatch Front searches for basement walkout or egress window services, finds basescape.com, browses service pages, and submits the multi-step lead form. Within 15 seconds, the homeowner receives a confirmation email and the BaseScape team is notified with the lead details.

**Why this priority**: This is the core revenue-generating flow. Without working forms, email delivery, and a live website, the business cannot capture leads. Everything else depends on this working end-to-end.

**Independent Test**: Can be fully tested by submitting the multi-step form on the live site and verifying both confirmation and team notification emails arrive within 15 seconds.

**Acceptance Scenarios**:

1. **Given** the site is deployed to basescape.com with DNS configured, **When** a user visits basescape.com, **Then** the homepage loads with all content, images, and navigation working correctly over HTTPS.
2. **Given** a homeowner is on a service page, **When** they complete all 3 steps of the multi-step form with a valid Wasatch Front zip code, **Then** a lead is created in the CMS with status "complete" and both emails (homeowner confirmation + team notification) are sent.
3. **Given** a homeowner enters an out-of-service-area zip code, **When** they submit the form, **Then** the lead is still captured but flagged as out-of-service-area for the team's review.
4. **Given** a spam bot fills in the honeypot field, **When** the form is submitted, **Then** no lead is created and a fake success response is returned.

---

### User Story 2 - Site Renders Correctly Across Devices and Passes Quality Checks (Priority: P2)

All pages (homepage, 6 service pages, 24 location pages, about, how-it-works, FAQ, financing, gallery, privacy, blog) render correctly on mobile, tablet, and desktop. Lighthouse scores meet minimum thresholds. Accessibility standards are met. SEO metadata (JSON-LD, meta tags, sitemap, robots.txt) is correct.

**Why this priority**: A site that looks broken or performs poorly will undermine trust with homeowners. Quality and performance directly impact conversion rates and search rankings.

**Independent Test**: Can be tested by running Lighthouse audits, visual regression tests, and accessibility checks across all page types on the live URL.

**Acceptance Scenarios**:

1. **Given** the site is live, **When** Lighthouse is run against the homepage, **Then** Performance score is 90+, Accessibility 95+, Best Practices 90+, and SEO 95+.
2. **Given** a user visits on a mobile device (375px width), **When** they navigate the site, **Then** all pages display correctly with no horizontal scroll, readable text, and tappable CTAs.
3. **Given** search engines crawl the site, **When** they read robots.txt and sitemap.xml, **Then** all public pages are discoverable and the sitemap reflects the actual page structure.
4. **Given** the CMS is temporarily unavailable, **When** a user visits any page, **Then** the site still renders using hardcoded fallback content.

---

### User Story 3 - CMS is Populated with Real Content and Manageable by the Team (Priority: P3)

The Payload CMS is deployed and seeded with real business content: actual service descriptions, real customer reviews, project photos, FAQs, and location-specific messaging for the 24 Wasatch Front service areas. The team can log in to the CMS admin panel to manage content.

**Why this priority**: Real content is what converts visitors. Placeholder/seed data is fine for development but not for a live site that needs to build trust with homeowners making $20K+ decisions.

**Independent Test**: Can be tested by logging into the CMS admin panel, verifying all collections have real data, and confirming content changes in the CMS appear on the live site.

**Acceptance Scenarios**:

1. **Given** the CMS is deployed, **When** a team member visits the admin panel URL, **Then** they can log in with their credentials and see all content collections.
2. **Given** the Services collection is populated with professional copy, **When** a user visits a service page, **Then** the content shown is polished and credible (not generic seed/placeholder data).
3. **Given** the Reviews collection has professional testimonial content, **When** a user visits the homepage or service pages, **Then** credible reviews are displayed (real reviews will replace these as they become available).

---

### User Story 4 - Analytics Tracking is Active from Day One (Priority: P4)

From the moment the site goes live, page views, form submissions, and phone calls are tracked. The team can see which pages drive the most leads and which marketing channels are performing.

**Why this priority**: Without analytics from launch, the team loses critical data about early traffic patterns and conversion rates. This data informs marketing spend decisions.

**Independent Test**: Can be tested by visiting the site, submitting a form, and verifying events appear in the analytics dashboard within minutes.

**Acceptance Scenarios**:

1. **Given** GA4 is configured, **When** a user visits any page, **Then** the page view is recorded in GA4.
2. **Given** a user submits any form type, **When** the submission completes, **Then** a GA4 conversion event is tracked.
3. **Given** the team wants to review performance, **When** they open the GA4 dashboard, **Then** they can see traffic by page, source, and device for any date range.

---

### User Story 5 - Quick Callback and Lead Magnet Forms Work End-to-End (Priority: P5)

In addition to the multi-step form, the Quick Callback form (name + phone) and Lead Magnet form (email capture for gated PDFs) both work on the live site, creating leads in the CMS and triggering appropriate notifications.

**Why this priority**: These secondary conversion paths capture leads who aren't ready for the full form. They increase total lead volume at lower friction.

**Independent Test**: Can be tested by submitting each form type on the live site and verifying leads are created with the correct form type and emails are sent.

**Acceptance Scenarios**:

1. **Given** a user is on any page with a Quick Callback widget, **When** they enter their name and phone and submit, **Then** a lead with form type "quick-callback" is created and the team is notified.
2. **Given** a user wants a lead magnet PDF, **When** they enter their email and submit, **Then** a lead with form type "lead-magnet" is created and the user receives access to the PDF.

---

### Edge Cases

- What happens when the email service is temporarily down? Leads are still captured in the CMS; email delivery failures are logged but do not block the user experience.
- What happens when the CMS database approaches its storage limit? Monitoring should alert the team before capacity is reached.
- What happens when a user submits the multi-step form and closes the browser mid-way? Partial leads are preserved via the session tracking ID and can be followed up on.
- What happens when DNS propagation is incomplete? Some users may see no site; DNS TTL should be set low during the transition period.
- What happens when multiple team members edit the same CMS content simultaneously? The CMS handles conflict resolution via optimistic locking.

## Clarifications

### Session 2026-03-25

- Q: How should CMS content changes reach the live site? → A: Automatic rebuild via CMS webhook -- content changes in the CMS trigger an automatic site rebuild and redeploy within minutes, no developer intervention required.
- Q: What is the minimum content needed to launch? → A: Launch with polished professional copy on all 6 services; real project photos, reviews, and case studies will be swapped in as they become available post-launch.
- Q: Which analytics platform(s) for launch? → A: GA4 only -- full-featured, free, integrates with Google Ads for future paid traffic. Plausible can be added later if desired.

## Requirements *(mandatory)*

### Functional Requirements

**Deployment & Infrastructure**
- **FR-001**: Site MUST be accessible at basescape.com over HTTPS with a valid SSL certificate
- **FR-002**: CMS MUST be deployed to a production environment with persistent database storage
- **FR-003**: All environment variables (email service keys, CMS secrets, analytics IDs, address autocomplete keys) MUST be configured in the production environment
- **FR-004**: DNS MUST be configured to point basescape.com to the hosting provider
- **FR-005**: Site MUST serve a valid robots.txt and sitemap.xml reflecting all public pages
- **FR-006**: CMS MUST trigger an automatic site rebuild and redeploy when content is published or updated, with no developer intervention required

**Email & Notifications**
- **FR-007**: System MUST send homeowner confirmation emails upon completed form submissions via a transactional email service
- **FR-008**: System MUST send team notification emails with lead details and a link to the CMS admin panel
- **FR-009**: Email delivery failures MUST NOT block lead creation -- the lead is saved regardless

**Content & CMS**
- **FR-010**: All 6 service pages MUST display polished professional copy (not placeholder/seed data); real project photos, reviews, and case studies will replace professional copy as they become available post-launch
- **FR-011**: All 24 location pages MUST render with city-specific messaging
- **FR-012**: CMS admin panel MUST be accessible to authorized team members with secure credentials
- **FR-013**: System MUST use a production-grade secret for CMS authentication (not the default development secret)

**Forms & Lead Capture**
- **FR-014**: All three form types (multi-step, quick callback, lead magnet) MUST create leads in the CMS
- **FR-015**: Multi-step form MUST validate zip codes against the service area list
- **FR-016**: Address autocomplete MUST work on the multi-step form's address field
- **FR-017**: Honeypot spam protection MUST be active on all forms

**Analytics & Tracking**
- **FR-018**: Site MUST include GA4 analytics tracking on all pages
- **FR-019**: Form submission events MUST be tracked as GA4 conversion events

**Quality & Performance**
- **FR-020**: All pages MUST pass WCAG 2.1 Level AA accessibility standards
- **FR-021**: Site MUST load in under 3 seconds on a 4G mobile connection
- **FR-022**: All images MUST be served in optimized format at appropriate sizes

### Key Entities

- **Lead**: A homeowner who has expressed interest via any form type. Key attributes: contact info, service interest, zip code, form type, submission status (partial/complete), session tracking ID.
- **Service**: A trade offered by BaseScape (walkout basements, egress windows, basement remodeling, pavers, retaining walls, artificial turf). Key attributes: title, description, value pillars, FAQs, related projects.
- **Service Area**: A geographic location served by BaseScape (24 Wasatch Front cities). Key attributes: city name, county, coordinates, localized messaging.
- **Review**: A customer testimonial. Key attributes: customer name, content, rating, related service, featured status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Homeowners can visit basescape.com and see the homepage load fully within 3 seconds on a standard mobile connection
- **SC-002**: A completed multi-step form submission results in team email notification within 15 seconds
- **SC-003**: 100% of form submissions are captured as leads in the CMS, even when email delivery fails
- **SC-004**: All 6 service pages and 24 location pages render with polished professional content (zero pages showing generic placeholder/seed data)
- **SC-005**: Homepage achieves Lighthouse Performance 90+ and Accessibility 95+
- **SC-006**: GA4 dashboard shows accurate page view and conversion data within 5 minutes of site activity
- **SC-007**: CMS admin panel is accessible to team members and content changes trigger an automatic rebuild, appearing on the live site within 5 minutes with no developer intervention

## Assumptions

- The basescape.com domain is already registered and available for DNS configuration
- The hosting provider is already selected (as configured in the existing site adapter and tech stack design)
- A transactional email service account is set up or obtainable
- An address autocomplete API key is obtainable
- Polished professional copy will be created for all 6 services at launch; real project photos, customer reviews, and case studies will be swapped in post-launch as they become available
- The operations stack (JobTread, Nimbata, OpenPhone, n8n, YouCanBook.me) is explicitly OUT OF SCOPE for this go-live -- those integrations will follow as separate features
- Paid landing pages and blog content are NOT required for initial launch, but the routes should work with whatever content exists
- Phone number routing (Quick Callback to actual phone system) is OUT OF SCOPE -- forms capture leads in CMS only for now
