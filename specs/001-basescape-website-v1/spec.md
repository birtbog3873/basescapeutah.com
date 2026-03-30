# Feature Specification: BaseScape Website V1

**Feature Branch**: `001-basescape-website-v1`
**Created**: 2026-03-23
**Status**: Draft
**Input**: Consolidated from BaseScape constitution, product specification, competitive landscape analysis, messaging framework, and trade research documents.

## Purpose

Build the first public website for BaseScape, a specialized residential construction company focused exclusively on basement walkout installations, egress window systems, and ADU-enabling basement transformations on Utah's Wasatch Front.

The site exists to generate qualified leads by educating anxious homeowners, establishing specialized authority and trust, and converting visitors into estimate requests and consultation bookings. It is not a digital brochure. It is BaseScape's primary revenue-generating asset.

## Product Thesis

Utah homeowners are increasingly motivated to monetize underused basements through rental income, improve safety with code-compliant egress, or transform dark basements into premium living spaces. They are also highly anxious about structural risk, code compliance, water intrusion, property disruption, and contractor reliability.

BaseScape wins when the website makes three things immediately clear:

1. BaseScape is a specialist, not a generic remodeler.
2. BaseScape understands the financial, safety, and architectural upside of this work.
3. BaseScape is the easiest trustworthy next step for a homeowner who wants clarity, confidence, and an estimate.

## Primary Audiences

**Audience A -- ROI-Focused Homeowner / House Hacker**: Wants to create a rentable basement apartment, offset a mortgage, or increase property value. Motivated by rental income ($1,200-$8,400/mo depending on strategy), ADU readiness, and financing clarity. Anxious about legality, permits, cost, and payback period.

**Audience B -- Safety-Focused Family**: Has a basement bedroom or finished basement and wants code-compliant egress and peace of mind. Motivated by emergency escape, IRC code compliance, and protecting children/guests. Anxious about whether existing conditions are unsafe and whether a contractor will cut corners.

**Audience C -- Luxury / Aesthetics-Driven Homeowner**: Wants to transform a dark basement into a brighter, premium living space. Motivated by natural light, backyard connection, and architectural improvement. Anxious about aesthetic outcomes, yard disruption, and drainage.

**Secondary Audience**: Realtors, investors, builders, and referral partners who may refer prospects or explore BaseScape as a specialist trade partner.

## Assumptions

1. BaseScape serves Utah first, with V1 launch focused on Utah County and surrounding cities (25 cities; see FR-022 for full list).
2. The initial offer set includes basement walkout entrances, egress window installation, window well upgrades, and basement access / ADU-enabling consultation.
3. The website's primary goal is lead generation, not self-serve purchasing.
4. The brand name "BaseScape" is confirmed (no conflicting USPTO trademark found).
5. The site requires non-technical editing capability for content, proof assets, and geographic expansion.
6. Authentic project photography, team portraits, and before-and-after imagery are launch dependencies.
6a. The tech stack is Astro (MPA/Islands Architecture frontend) deployed on Cloudflare Pages + Workers, Payload CMS (TypeScript code-first headless CMS) as a separate service, Open Props + Vanilla Extract (zero-runtime styling with design tokens), Astro Actions + Zod (server-side form validation via Cloudflare Workers), and Payload CMS lifecycle hooks (afterChange/beforeEmail) for lead notifications and confirmation emails.
7. FSM software selection is pending. V1 will capture and store leads in the CMS; FSM webhook integration is deferred to a post-launch phase.
8. Live chat is deferred to Phase 2.
9. Paid advertising landing pages are included in V1 scope.
10. The competitive landscape includes 45+ businesses on the Wasatch Front, but no single competitor combines hyper-specialization with financial enablement, safety authority, and premium aesthetics in one digital experience.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Homepage Trust and Authority Establishment (Priority: P1)

As a homeowner landing on the BaseScape website for the first time, I immediately understand that BaseScape is a specialized, licensed, insured structural authority focused on walkout basements and egress windows in Utah, so I feel confident exploring further rather than bouncing to a competitor.

**Why this priority**: First impressions determine whether a visitor stays or leaves. Without immediate trust and clarity above the fold, no other feature matters. This is the foundational conversion prerequisite.

**Independent Test**: Can be fully tested by loading the homepage on a mobile device and verifying that a first-time visitor can identify BaseScape's specialization, geographic focus, and available next actions without scrolling.

**Acceptance Scenarios**:

1. **Given** a first-time visitor loads the homepage on mobile 4G, **When** the page renders, **Then** the hero section communicates BaseScape's core competency (walkout basements / egress windows), geographic focus (Utah), and a benefit-driven headline within 2.5 seconds.
2. **Given** a visitor is viewing the homepage, **When** they look above the fold, **Then** they see two distinct conversion paths: a "Call Now" action and a "Get Free Estimate" action.
3. **Given** a visitor scrolls the homepage, **When** they encounter trust signals, **Then** they see authentic project photography (no stock images), licensing/insurance badges, risk-reversal statements ("Free Written Estimates," "No Hidden Charges"), and real customer reviews.
4. **Given** a visitor is on any page, **When** they scroll, **Then** a persistent sticky navigation bar provides immediate access to the phone number and a booking/estimate CTA without scrolling back to the top.

---

### User Story 2 - Service Page Education and Objection Neutralization (Priority: P1)

As a homeowner researching a specific service (walkout basements, egress windows, or window well upgrades), I find a dedicated, in-depth page that explains what the service entails, why it matters (safety, compliance, ROI), BaseScape's specific process, and proof of completed work, so I feel informed and confident enough to request an estimate.

**Why this priority**: Dedicated service pages are the primary organic search landing pages and the core educational content that qualifies visitors before conversion. Without them, the site cannot rank for high-intent keywords or address specific homeowner anxieties.

**Independent Test**: Can be fully tested by navigating to each service page and verifying it contains benefit-driven content, code compliance information, before-and-after imagery, FAQ content, and a service-specific CTA.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the Walkout Basements page, **When** they read the content, **Then** they find explanations of structural safety (stepped footings, frost line engineering, shear walls), drainage and moisture mitigation, dust containment protocols, code compliance, financial projections (rental income ranges, property value appreciation), and BaseScape's "Surgical Extraction Protocol" differentiator.
2. **Given** a visitor navigates to the Egress Windows page, **When** they read the content, **Then** they find IRC egress code requirements (5.7 sq ft minimum net clear opening, 44-inch maximum sill height, 24x20 inch minimum opening dimensions), window style options, window well materials and upgrades, and the safety imperative framing.
3. **Given** a visitor is on any service page, **When** they look for answers to common objections, **Then** they find FAQ content addressing structural safety, drainage/moisture, dust/disruption, code compliance, cost/affordability, aesthetics, and project timeline without leaving the page.
4. **Given** a visitor is on a service page, **When** they view proof elements, **Then** they see before-and-after project photography, localized review excerpts, and a clear CTA specific to that service.

---

### User Story 3 - Multi-Step Lead Capture (Priority: P1)

As a homeowner ready to take action, I complete a lead capture form that feels easy and progressive, and I receive immediate confirmation that BaseScape will follow up, so I trust that my request has been received and will be handled promptly.

**Why this priority**: Lead capture is the direct revenue mechanism. Without a working, low-friction form that stores leads with full context, the website generates zero business value regardless of how good the content is.

**Independent Test**: Can be fully tested by completing the multi-step form end-to-end and verifying the lead appears in the CMS with service type, location, and contact info, and that the homeowner receives a confirmation.

**Acceptance Scenarios**:

1. **Given** a visitor clicks "Get Free Estimate," **When** the form loads, **Then** it presents a multi-step sequence: Step 1 (service type selection + zip code), Step 2 (project context + rough timeline), Step 3 (name, phone, email with address autocomplete), with a visual progress indicator.
2. **Given** a visitor completes each form step, **When** they advance to the next step, **Then** the partial data is captured in the background, enabling retargeting of abandoned submissions.
3. **Given** a visitor submits the completed form, **When** submission succeeds, **Then** they see an on-screen confirmation communicating what happens next, and they receive a confirmation email or SMS within 3 seconds.
4. **Given** a lead is submitted, **When** the data is validated, **Then** the lead record (including service interest, location context, and source attribution) is stored in the CMS and a notification is sent to the BaseScape team for follow-up.
5. **Given** a visitor wants immediate contact but does not want to fill a detailed form, **When** they tap the "Call Now" button, **Then** it initiates a phone call to the BaseScape business line.

---

### User Story 4 - Service Area Pages for Local Search Authority (Priority: P2)

As a homeowner searching for "walkout basement [my city]" or "egress window installation near me," I find a dedicated BaseScape landing page for my city that contains localized content, confirms BaseScape serves my area, and provides a clear path to request an estimate.

**Why this priority**: Local search intent drives the highest-quality organic leads. Service area pages are the primary mechanism for capturing "[service] + [city]" search traffic and establishing geographic authority through unique, localized content.

**Independent Test**: Can be fully tested by navigating to a specific city's service area page and verifying it contains unique localized content, local proof elements, and conversion paths.

**Acceptance Scenarios**:

1. **Given** a visitor from Draper searches for "walkout basements Draper UT," **When** they land on the Draper service area page, **Then** they see unique copy with genuine local references (not city-name-swapped template content), localized testimonials or project examples where available, and a clear CTA.
2. **Given** a service area page exists for a launch city, **When** the page is rendered, **Then** it includes structured data markup specifying geographic coordinates, service radius, and operating hours.
3. **Given** a visitor is on any service area page, **When** they check BaseScape's contact information, **Then** the name, address, and phone number match the Google Business Profile listing character-for-character.

---

### User Story 5 - Financial Enablement and Affordability Content (Priority: P2)

As a homeowner who wants a walkout but is intimidated by the cost, I see clear financial projections, available rebates and tax credits, and financing options, so I understand this is an investment with a measurable return rather than an unaffordable expense.

**Why this priority**: Cost is the primary conversion barrier. Without financial enablement content that reframes the project as an investment vehicle and shows accessible financing paths, a large segment of qualified prospects will abandon the funnel.

**Independent Test**: Can be fully tested by navigating to the financing/affordability page and verifying it contains rental income projections, rebate/credit details, and financing partner information.

**Acceptance Scenarios**:

1. **Given** a visitor views the walkout service page or financing page, **When** they read the financial content, **Then** they see rental income projections by strategy (Long-Term: $1,200-$1,800/mo; Short-Term Airbnb: $3,100-$8,400/mo peak; Mid-Term Corporate: $2,000-$3,000/mo) with estimated break-even timelines (2-5 years).
2. **Given** a visitor views the financing page, **When** they look for rebates, **Then** they find details on available incentive programs including utility rebates, federal tax credits, and local municipal grants, framed as estimates and educational guidance (not guaranteed amounts).
3. **Given** a visitor views the financing page, **When** they look for payment options, **Then** they find information about construction financing with key features highlighted (interest-only payments during construction, structured draw schedules, rapid pre-approvals).
4. **Given** a visitor views property value information, **When** they read the content, **Then** claims about property value appreciation are presented as ranges or scenarios (e.g., "$40,000-$70,000+ added to resale value") with appropriate disclaimers.

---

### User Story 6 - About Page and Brand Humanization (Priority: P2)

As a homeowner about to invite strangers into my home for major structural work, I need to know who these people are and why I should trust them, so I feel comfortable engaging with BaseScape.

**Why this priority**: For high-stakes structural work, personal trust in the team is a significant conversion factor. The About page converts research-stage visitors who need to validate the people behind the company before committing to a consultation.

**Independent Test**: Can be fully tested by visiting the About page and verifying it contains authentic team photography, origin story, credentialing information, and differentiating philosophy.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the About page, **When** they view the content, **Then** they see professional portraits of the founder(s) and key team members (no stock photography), the company's origin story and "why" behind the specialization, and explicit language regarding background checks, licensing, insurance, and ongoing training for field crews.
2. **Given** a visitor reads the About page, **When** they encounter BaseScape's philosophy, **Then** they see the core differentiating statement: cutting into a home's foundational load-bearing walls is high-stakes structural engineering, not general carpentry.

---

### User Story 7 - Gallery and Project Showcase (Priority: P2)

As a homeowner evaluating BaseScape, I want to see real examples of completed projects with before-and-after photography, so I can visualize the quality of work and gain confidence that my project will be handled professionally.

**Why this priority**: Visual proof is the most powerful trust signal for construction services. Before-and-after galleries directly address the aesthetic anxiety of all three audience segments and serve as the primary evidence of competence.

**Independent Test**: Can be fully tested by navigating to the gallery and verifying it contains real project entries with before-and-after imagery, project details, and that gallery content is reusable on service and location pages.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the gallery, **When** they browse projects, **Then** each project entry includes project type, city/location, challenge, solution approach, proof imagery (before-and-after where available), and outcome summary.
2. **Given** gallery content exists for a specific service or city, **When** a visitor views the corresponding service or location page, **Then** relevant gallery entries are displayed inline on that page.

---

### User Story 8 - Paid Advertising Landing Pages (Priority: P3)

As a homeowner who clicked a Google or Facebook ad, I land on a focused, distraction-free page designed to convert me immediately, without standard site navigation pulling me away from the offer.

**Why this priority**: Paid traffic requires purpose-built landing pages to achieve acceptable cost-per-lead economics. Without dedicated PPC pages, ad spend converts inefficiently through the general site.

**Independent Test**: Can be fully tested by navigating to a campaign landing page and verifying it suppresses standard navigation, contains a focused offer with trust badges, and provides a clear conversion path.

**Acceptance Scenarios**:

1. **Given** a visitor arrives on a paid campaign landing page, **When** the page renders, **Then** standard header navigation is suppressed, forcing a binary decision: convert or exit.
2. **Given** a paid landing page is loaded, **When** a visitor views the content, **Then** they see a benefit-driven headline aligned with the ad copy, trust badges, a short-form or multi-step lead capture form, and a phone number CTA.
3. **Given** the marketing team needs a new campaign, **When** they create a landing page, **Then** it can be built and deployed through the content management system without engineering intervention.

---

### User Story 9 - Lead Magnet for Early-Stage Capture (Priority: P3)

As an early-stage homeowner who is not yet ready to request an estimate, I can download a valuable educational resource (like an ADU compliance checklist) in exchange for my email, so I continue engaging with BaseScape while I research.

**Why this priority**: Not all visitors are ready to convert on their first visit. Lead magnets capture early-stage prospects who can be nurtured into qualified leads over time, expanding the addressable funnel beyond high-intent visitors only.

**Independent Test**: Can be fully tested by submitting the lead magnet form and verifying the resource is delivered and the lead is captured with source attribution.

**Acceptance Scenarios**:

1. **Given** a visitor encounters a lead magnet CTA, **When** they submit minimal contact information, **Then** they receive access to the downloadable resource.
2. **Given** a lead magnet submission is captured, **When** the data is stored, **Then** the lead record includes the specific resource requested, source attribution, and enough context for follow-up.

---

### User Story 10 - Blog / Resource Hub for Organic SEO (Priority: P3)

As a homeowner in the early research phase, I discover BaseScape through informative, keyword-optimized content that answers my specific questions and establishes the company as an authority.

**Why this priority**: Content marketing drives long-tail organic traffic and builds topical authority. Blog content targets high-intent keywords like "cost to finish a basement in Riverton," "legal basement bedroom requirements Utah," and "Utah ADU zoning 2026."

**Independent Test**: Can be fully tested by navigating to the blog, verifying articles exist with proper internal linking to service pages and lead magnet CTAs.

**Acceptance Scenarios**:

1. **Given** a visitor navigates to the Resources section, **When** they browse content, **Then** they find articles with a clean, scannable layout that include internal links to relevant service pages and lead magnet CTAs.
2. **Given** a blog post is needed, **When** a non-technical team member creates it, **Then** it can be authored and published through the content management system and generates a static page during the site build process.

---

### Edge Cases

- What happens when a visitor submits a form from a zip code outside the service area? The system should accept the lead but flag it for manual review rather than rejecting the prospect outright.
- What happens when a visitor submits a form with an invalid phone number or email? The form should display clear, inline validation errors before allowing submission.
- What happens when the CMS fails to store a lead submission? The system should retry and send an internal alert so no lead is lost.
- What happens when a visitor accesses the site with JavaScript disabled? Core content and the phone number CTA remain accessible. Multi-step form functionality degrades gracefully to a single-page form or directs to phone contact.
- What happens when a service area page has no local project examples or testimonials yet? The page should display site-wide trust signals and general portfolio content rather than showing empty sections.
- What happens when a visitor loads the site on a very slow mobile connection (2G/3G)? Core content and CTAs remain usable within performance thresholds; images load progressively.

---

## Clarifications

### Session 2026-03-23

- Q: What CMS / framework stack should power the site? → A: Astro (frontend) + Payload CMS (headless CMS) + Open Props / Vanilla Extract (styling) + Astro Actions with Zod (server-side form validation) + Payload CMS lifecycle hooks (lead notifications and confirmation emails).
- Q: What form spam protection approach should the site use? → A: Honeypot fields + server-side rate limiting (zero user friction, no external deps). Harden with Cloudflare Turnstile or similar if spam becomes an issue post-launch.
- Q: How should the system handle duplicate lead submissions from the same person? → A: Store all submissions as separate lead records, linked by shared email/phone. Deduplication logic deferred to FSM/CRM layer in Phase 2.
- Q: How should third-party reviews be integrated? → A: Google Places API integration deferred to Phase 2 (startup has no reviews at launch). V1 supports manually curated reviews with source attribution in Payload CMS. API-based pull will replace manual curation once review volume warrants it.
- Q: What API should power address autocomplete in the lead form? → A: Google Places API (Autocomplete) on the free tier (10K requests/month). Sufficient for V1 lead volume. Revisit if volume exceeds free tier.
- Q: Where should the site be hosted? → A: Cloudflare Pages + Workers. Unlimited free bandwidth for ad traffic spikes, edge-executed Workers for zero cold-start form submissions, existing account. Payload CMS runs as a separate self-hosted or Payload Cloud service.

---

## Requirements *(mandatory)*

### Functional Requirements

**Homepage and Navigation**

- **FR-001**: The homepage MUST communicate above the fold: what BaseScape does, who it serves, the primary geographic market (Utah), and the next action a visitor should take.
- **FR-002**: Every page MUST include a persistent sticky navigation bar that provides immediate access to the phone number (click-to-call on mobile) and a primary CTA ("Get Free Estimate" or "Book Consultation").
- **FR-003**: On mobile, a bottom-anchored sticky CTA bar MUST be centered with sufficient margins to avoid conflict with native phone UI elements (iOS swipe bars, Android navigation gestures). No interactive element shall be placed within 20px of the absolute bottom edge of the viewport.

**Dual Conversion Paths**

- **FR-004**: Every page with commercial intent MUST present two distinct conversion pathways: a primary "Call Now" action for immediate contact and a secondary "Get Free Estimate" action leading to the multi-step lead capture form.
- **FR-005**: Both CTAs MUST be visible above the fold and within the persistent sticky navigation or bottom bar.

**Service Pages**

- **FR-006**: The site MUST provide dedicated service pages for each core offer: Walkout Basements, Egress Windows, and Window Well Upgrades / Landscaping Integration.
- **FR-007**: Each service page MUST have its own URL, metadata, content structure, proof modules (before-and-after galleries, localized reviews), FAQ section, and service-specific CTA.
- **FR-008**: Each service page MUST address the homeowner anxiety stack: structural safety, code compliance, drainage/moisture, dust/disruption, cost/affordability, aesthetics, and project timeline.
- **FR-009**: Each service page MUST present content through one primary value pillar (financial enablement, life safety, or architectural transformation) with the other two as supporting context.

**Lead Capture**

- **FR-010**: The primary lead capture form MUST use multi-step sequencing with a visual progress indicator when collecting five or more data fields.
- **FR-011**: Multi-step form Step 1 MUST begin with the lowest-friction question: service type selection (Walkout Basement / Egress Window / Window Well Upgrade / Not Sure) and property zip code.
- **FR-012**: Multi-step form Step 2 MUST capture project context (purpose: rental unit, family space, home office) and rough timeline.
- **FR-013**: Multi-step form Step 3 MUST capture contact information (Name, Phone, Email) with address autocomplete to reduce manual input.
- **FR-014**: Each form step's data MUST be captured in the background upon step completion, enabling retargeting of abandoned submissions.
- **FR-015**: Form validation MUST occur server-side via Astro Actions with Zod schema validation. Client-side interaction MUST be limited to step transitions and success state display.
- **FR-015a**: All public-facing forms MUST include honeypot fields and server-side rate limiting to prevent bot/spam submissions without adding user-facing friction. Additional hardening (e.g., Cloudflare Turnstile) may be added post-launch if spam volume warrants it.
- **FR-016**: A simplified quick callback form (Name + Phone Number + optional "What do you need help with?") MUST be accessible from the sticky CTA bar or as a modal.
- **FR-017**: Upon successful form submission, the user MUST see an on-screen confirmation that clearly communicates what happens next.
- **FR-018**: Upon successful form submission, the homeowner MUST receive a confirmation email within 3 seconds, triggered by Payload CMS afterChange/beforeEmail lifecycle hooks.

**Lead Storage and Notification**

- **FR-019**: All lead data MUST be stored in the CMS database under BaseScape's direct operational control. No lead data shall be stored exclusively in third-party platforms without a synchronized first-party copy.
- **FR-020**: Lead records MUST include service interest, location/zip code context, project details, and source attribution (page, campaign, referral).
- **FR-020a**: Each form submission MUST be stored as a separate lead record regardless of whether the same contact has submitted previously. Leads from the same person are linked by shared email or phone number but not merged. Deduplication is deferred to the FSM/CRM integration phase.
- **FR-021**: Upon lead submission, the BaseScape team MUST receive an email notification with lead details for manual follow-up, triggered by Payload CMS afterChange collection hooks. FSM system integration via webhook is deferred to a post-launch phase.

**Service Area Architecture**

- **FR-022**: The site MUST support unique service-area pages for the following 25 launch cities in Utah County and surrounding areas: Provo, Orem, Sandy, Lehi, South Jordan, Herriman, Taylorsville, Eagle Mountain, Draper, Saratoga Springs, Riverton, Spanish Fork, Pleasant Grove, American Fork, Springville, Payson, Bluffdale, Santaquin, Mapleton, Alpine, Salem, Cedar Hills, Nephi, Mona, and Elk Ridge. Each page MUST contain unique, localized copy with genuine local references rather than city-name-swapped template content.
- **FR-023**: Each service-area page MUST include a clear CTA, local trust context, and structured data markup specifying geographic coordinates, service radius, and operating hours.
- **FR-024**: Name, Address, and Phone number displayed on every page MUST match the Google Business Profile listing character-for-character.

**Trust Stack**

- **FR-025**: Trust signals MUST appear before or adjacent to the primary CTA on all key pages. No core conversion page shall rely only on text claims without adjacent proof.
- **FR-026**: The site MUST support displaying customer reviews. V1 launches with manually curated reviews stored in Payload CMS with source attribution (e.g., "via Google"). Automated Google Places API integration to pull verified reviews is deferred to Phase 2 once review volume exists.
- **FR-027**: Licensing, bonding, and insurance badges with specific license numbers MUST be prominently displayed on every page with commercial intent.
- **FR-028**: Risk-reversal statements (e.g., "Free Written Estimates," "No Hidden Charges," "Indoor Dust Containment Guaranteed") MUST be displayed above the fold on the homepage.

**Gallery / Case Studies**

- **FR-029**: The site MUST provide a gallery or project showcase showing real completed projects. Each entry SHOULD support: project type, city/location, challenge, solution, proof imagery (before-and-after), and outcome summary.
- **FR-030**: Gallery content MUST be reusable across service pages and location pages.
- **FR-031**: Before-and-after photography MUST follow consistent standards: same vantage point, similar lighting conditions, and paired wide establishing shots with close-up detail shots.

**Financial Content**

- **FR-032**: The site MUST include a financing and affordability page that presents financing pathways, available rebates and tax credits, and rental income scenarios.
- **FR-033**: All ROI, rental income, rebate, financing, or cost-saving claims MUST be framed as estimates, ranges, or scenarios unless contractually guaranteed. Financial claims MUST include appropriate disclaimer language.

**About Page**

- **FR-034**: The site MUST include an About page featuring authentic team photography, the company origin story, background check and credentialing information, and the differentiating philosophy.

**FAQ Coverage**

- **FR-035**: The site MUST include FAQ content covering: cost ranges, code basics, city-by-city variability, timelines, project disruption, financing/rebates, drainage/moisture concerns, and rental readiness.
- **FR-036**: FAQ content MUST be reusable across templates (service pages, location pages, dedicated FAQ page).

**Lead Magnet**

- **FR-037**: The site MUST include at least one gated lead capture asset (recommended: "Utah ADU Compliance Checklist") accessible with minimal contact information.
- **FR-038**: Lead magnet captures MUST be measurable and attributable.

**Blog / Resources**

- **FR-039**: The site MUST include a blog or resource hub section that supports creating, publishing, and managing articles targeting long-tail, high-intent keywords.
- **FR-040**: Each blog post MUST include internal links to relevant service pages and lead magnet CTAs.

**Paid Landing Pages**

- **FR-041**: The site MUST support dedicated paid campaign landing pages that suppress standard header navigation, contain a focused offer with trust badges, and provide a conversion-focused layout.
- **FR-042**: Paid landing pages MUST be deployable through the content management system without engineering intervention.

**Editorial Control**

- **FR-043**: Non-technical team members MUST be able to create and update service pages, blog posts, FAQs, testimonials, case studies, service areas, lead magnets, offers, and paid landing pages without requiring code changes.

**Analytics and Attribution**

- **FR-044**: The site MUST measure core funnel events including: call clicks, form starts, form completions (by step), lead magnet downloads, contact page visits, and campaign/source attribution.
- **FR-045**: Each core page template MUST declare a defined primary conversion event.
- **FR-046**: Marketing MUST be able to identify which page types, services, locations, and traffic sources are generating leads.

**Messaging Framework Compliance**

- **FR-047**: All core messaging MUST ladder to one or more of three value pillars: Financial Enablement (rental income, home value, usable square footage), Life Safety (egress compliance, emergency escape, family protection), and Transformation (natural light, livable space, architectural improvement).
- **FR-048**: The "Stove Rule" and ADU compliance education content MUST be present, explaining Utah-specific legislation (HB 398, SB 174) and the Apartment Code reclassification trigger in plain language, positioning BaseScape as the compliance guide.

**Privacy and Compliance**

- **FR-049**: The site MUST display a clear, accessible privacy policy. Form submissions MUST include explicit consent language where required. No covert tracking mechanisms shall be deployed without transparent disclosure.

**Process Page**

- **FR-050**: The site MUST include a "How It Works" page explaining BaseScape's step-by-step project process from initial consultation through completion, reducing uncertainty about what engaging with BaseScape looks like.

### Key Entities

- **Service**: A specific type of work BaseScape performs (Walkout Basement, Egress Window, Window Well Upgrade). Each has a name, description, value pillar alignment, FAQ set, gallery entries, and dedicated page.
- **Service Area / Location**: A geographic market BaseScape serves. Each has a city name, localized content, local proof elements, structured data, and a dedicated page.
- **Lead**: A submitted prospect record. Contains contact info (name, phone, email), service interest, property zip code, project context, timeline, source attribution, and submission timestamp.
- **Project**: A completed project example (also referred to as a "case study" in marketing context). Contains project type, city, challenge, solution, before-and-after imagery, and outcome summary.
- **FAQ**: A question-and-answer pair. Contains question, answer, and tags for which services/pages it applies to.
- **Testimonial / Review**: A customer endorsement. Contains reviewer name, review text, star rating, city, service type, and source (third-party or curated).
- **Lead Magnet**: A gated educational resource. Contains title, description, file/content, and associated capture form configuration.
- **Blog Post / Article**: An educational content piece. Contains title, body, publish date, category, related services, and embedded CTAs.
- **Offer / Promotion**: A time-bound or evergreen offer. Contains headline, terms, expiration, and associated pages.
- **Paid Landing Page**: A campaign-specific conversion page. Contains campaign slug, headline, offer content, form configuration, and suppressed navigation flag.

---

## Non-Goals (V1)

The following are explicitly out of scope for the first release:

1. Real-time online booking widget with live calendar syncing (Phase 2).
2. Customer portal or authenticated user accounts.
3. E-commerce functionality.
4. Multi-language support.
5. Video hosting or embedded video player (YouTube embeds are acceptable).
6. Native mobile application.
7. Live chat functionality (deferred to Phase 2).
8. Automated email nurture sequence authoring within the platform (Phase 1 captures leads and triggers a single confirmation; full drip campaigns are managed externally or deferred).
9. Interactive ROI calculator (deferred to Phase 2 as an interactive component).
10. Self-serve instant quoting with contract-ready pricing.
11. FSM software integration via webhook (FSM selection pending; leads are stored in CMS and team is notified by email for manual follow-up in V1).
12. Automated Google Places API review integration (no reviews exist at launch; V1 uses manually curated reviews with attribution).

---

## Quality and Experience Requirements

- **QR-001 -- Performance**: Core pages MUST achieve strong Core Web Vitals on mobile. Critical landing pages MUST target LCP of 1.5 seconds or better under representative mobile conditions (per constitution Art. I). Total compressed page weight SHOULD NOT exceed 250 KB.
- **QR-002 -- Accessibility**: The experience MUST meet WCAG 2.2 AA baseline. All images must have descriptive alt text. All form fields must have associated labels. Keyboard navigation must reach every interactive element. Color must not be the sole means of conveying information.
- **QR-003 -- Mobile Ergonomics**: Mobile is the primary interface. All interactive elements (CTAs, form fields, navigation items) MUST have a minimum touch target size of 48px x 48px. Phone number links MUST use `tel:` protocol with large, high-contrast button styling.
- **QR-004 -- Scannability**: Pages MUST be easy to scan with obvious hierarchy, short sections, and clear CTA transitions.
- **QR-005 -- Reliability**: Forms and conversion elements MUST fail gracefully and provide clear error handling. Lead storage MUST include retry logic so no lead is lost.
- **QR-006 -- Search Readiness**: Core pages MUST be structured for organic visibility. Service area pages and service pages MUST include structured data markup.
- **QR-007 -- Brand Fit**: The visual design MUST feel premium, specialized, and architecturally credible. It MUST NOT look like a generic contractor template, a broad home-remodeling brochure, or a stock-photo-heavy lead farm. Visual language must align with high-end architectural firms and luxury landscape design, avoiding traditional construction cliches (clip-art hammers, hardhats, bulldozers).
- **QR-008 -- Scalability**: The site MUST handle traffic spikes of 10x normal volume (triggered by weather events, viral content, or aggressive ad campaigns) without performance degradation. Cloudflare Pages provides unlimited bandwidth and edge-level scaling with no configuration.
- **QR-009 -- Browser Support**: The platform must function correctly on the latest two major versions of Chrome, Safari, Firefox, and Edge on both desktop and mobile. iOS Safari and Android Chrome are the primary mobile targets.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors can identify BaseScape's specialization (walkout basements / egress windows), geographic focus (Utah), and primary next action within 5 seconds of first page load on mobile.
- **SC-002**: Visitors can initiate contact (phone call or form) within two taps from any core page on mobile.
- **SC-003**: The multi-step lead capture form achieves a completion rate of 70% or better among visitors who begin Step 1 (form abandonment rate at or below 30%).
- **SC-004**: Homeowner confirmation (email or SMS) is delivered within 3 seconds of form submission, and the BaseScape team receives a lead notification within 5 seconds.
- **SC-005**: The website achieves a visitor-to-lead conversion rate of 8% or better within 90 days of launch.
- **SC-006**: Organic lead volume reaches 150+ qualified leads per month within 6 months of launch.
- **SC-007**: Cost per lead from paid channels is at or below $45.
- **SC-008**: Every core page template has a measurable primary conversion event, every launch service has a dedicated page, and all 25 launch cities have unique location pages.
- **SC-009**: Non-technical team members can publish a new blog post, update a service page, or deploy a new paid landing page without engineering intervention.
- **SC-010**: A qualified visitor can find answers to the top 7 homeowner objections (structural safety, drainage, dust/disruption, code compliance, cost, aesthetics, timeline) without leaving the site.

