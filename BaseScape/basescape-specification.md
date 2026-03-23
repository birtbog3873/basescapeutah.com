# Feature Specification: BaseScape Website V1

Feature ID: 001  
Feature Name: BaseScape Website  
Status: Draft  
Last Updated: 2026-03-21

## 1. Purpose

This specification defines the product requirements for the first public website for BaseScape.

The site is intended to generate qualified leads for basement walkouts, egress windows, and related basement access / ADU-enabling projects in Utah. It must educate, build trust, and convert prospects who are evaluating high-stakes structural work.

This document defines **WHAT** the site must do and **WHY** it matters. It intentionally avoids detailed implementation choices, which belong in the implementation plan.

---

## 2. Product Thesis

Utah homeowners are increasingly motivated to turn underused basements into safe, legal, income-producing, and more livable spaces. They are also highly anxious about structural risk, code compliance, water intrusion, property disruption, and contractor reliability.

BaseScape wins when the website makes three things immediately clear:

1. BaseScape is a specialist, not a generic remodeler.
2. BaseScape understands the financial, safety, and architectural upside of this work.
3. BaseScape is the easiest trustworthy next step for a homeowner who wants clarity, confidence, and an estimate.

---

## 3. Assumptions

These assumptions are used to keep the spec actionable and should be validated before planning.

1. BaseScape serves Utah first, with launch focus on Salt Lake County and Utah County.
2. The initial offer set includes:
   - basement walkout entrances
   - egress window installation
   - basement access / ADU-enabling consultation and related structural scope
3. The website's primary goal is lead generation, not self-serve purchasing.
4. The brand name "BaseScape" is provisional until trademark clearance is confirmed.
5. The site will require non-technical editing capability for content, proof, and expansion.

---

## 4. Goals

### 4.1 Business Goals

1. Generate qualified estimate and consultation requests from Utah homeowners and investors.
2. Position BaseScape as the specialist authority in walkouts and egress work.
3. Support organic search, paid traffic, and referral traffic with purpose-built landing experiences.
4. Shorten the time from first visit to first contact.

### 4.2 User Goals

1. Quickly understand whether BaseScape handles the exact type of project the visitor needs.
2. Understand whether the project can improve safety, compliance, rental potential, or basement usability.
3. Trust that BaseScape can perform the work safely and professionally.
4. Contact BaseScape with minimal friction.

### 4.3 Editorial / Marketing Goals

1. Publish and update service, service-area, gallery, FAQ, and offer content without developer dependence.
2. Reuse structured content across the site for scale and consistency.
3. Support future paid landing pages and expansion into additional local markets.

---

## 5. Non-Goals (V1)

The following are explicitly out of scope for the first release unless later promoted by an approved change:

1. Full client portal functionality.
2. Self-serve instant quoting with contract-ready pricing.
3. Online permit submission or municipality-specific eligibility automation.
4. E-commerce checkout.
5. A large editorial content hub with dozens of articles at launch.
6. Complex personalization beyond basic service-area or campaign relevance.
7. Broad service expansion into unrelated remodeling categories.

---

## 6. Primary Audiences

### 6.1 Audience A — ROI-Focused Homeowner / House Hacker

A homeowner who wants to create a rentable basement apartment, offset a mortgage, or increase property value.

**Primary motivations**
- rental income
- ADU readiness
- property value increase
- financing clarity

**Primary anxieties**
- legality and permits
- cost and payback period
- finding the right contractor
- whether the basement is suitable

### 6.2 Audience B — Safety-Focused Family

A homeowner with a basement bedroom or finished basement who wants code-compliant egress and peace of mind.

**Primary motivations**
- emergency escape and rescue
- code compliance
- protecting children and guests

**Primary anxieties**
- whether existing conditions are unsafe
- whether a contractor will cut corners
- cost of correction

### 6.3 Audience C — Design / Lifestyle Homeowner

A homeowner who wants to transform a dark basement into a brighter, more usable, higher-end living space.

**Primary motivations**
- more natural light
- better backyard connection
- better basement usability
- property aesthetics

**Primary anxieties**
- how the work will look
- disruption to yard and home
- water issues and drainage
- cheap-looking outcomes

### 6.4 Secondary Audience — Realtors, Investors, Builders, and Referral Partners

A professional who may refer prospects or explore BaseScape as a specialist trade partner.

---

## 7. Primary User Journeys

### Journey 1 — "Can I rent my basement?"

1. User lands on homepage, service page, paid landing page, or local page.
2. User sees that BaseScape specializes in walkouts / egress / ADU-enabling basement work.
3. User learns the relationship between exterior access, egress, safety, and rentable space.
4. User sees proof, process, and an estimate/consult CTA.
5. User submits a consultation request.

**Success condition**: User requests an estimate or consultation with service type and location attached.

### Journey 2 — "Is my basement bedroom safe and legal?"

1. User lands on an egress-focused page.
2. User understands the role of egress windows and the basics of code compliance.
3. User sees photos, process, trust signals, and FAQs.
4. User contacts BaseScape for an assessment.

**Success condition**: User initiates contact without needing to leave the page to research basic trust or safety objections.

### Journey 3 — "Will this ruin my yard or foundation?"

1. User visits service or gallery content.
2. User sees explanations of drainage, structural planning, dust control, site protection, and respectful process.
3. User reviews real project images and before-and-after examples.
4. User requests a quote.

**Success condition**: User's primary objection shifts from risk avoidance to project feasibility and timing.

### Journey 4 — "I need a specialist in my city"

1. User lands on a service-area page from local search.
2. User confirms BaseScape serves the area.
3. User sees localized relevance and proof.
4. User converts through call or estimate request.

**Success condition**: A location page functions as a standalone trust and conversion page.

---

## 8. Scope for V1

### 8.1 In Scope

1. A public marketing site for BaseScape.
2. A homepage focused on authority, proof, and conversion.
3. Dedicated service pages for:
   - Walkout Basements
   - Egress Windows
   - Basement ADU / Access Enablement
4. An About / Why BaseScape page.
5. A Process page explaining how projects work.
6. A Gallery / Case Study experience using real project examples.
7. A Contact / Estimate Request page.
8. A Financing / Rebates / Affordability page.
9. A FAQ section or dedicated FAQ page.
10. A set of unique service-area pages for launch markets.
11. A downloadable lead magnet for early-stage lead capture.
12. Analytics and attribution for core conversion events.
13. Lead submission routing to the sales / operations workflow.

### 8.2 Later-Phase Candidates (Not V1 by Default)

1. Interactive ROI calculator.
2. Self-serve booking integrated with live calendar availability.
3. Live chat.
4. Video library and educational content center.
5. Multilingual experience.
6. Referral partner portal.

---

## 9. Functional Requirements

### FR-001 — Homepage Clarity

The homepage SHALL communicate above the fold:

1. what BaseScape does,
2. who it serves,
3. the primary geographic market, and
4. the next action a visitor should take.

**Acceptance criteria**
- A first-time visitor can identify BaseScape as a Utah specialist in walkout basements / egress windows / basement access without scrolling.
- A visitor can take a conversion action from the first viewport.

### FR-002 — Dual Conversion Paths

The site SHALL support two primary conversion paths:

1. immediate contact for high-intent users, and
2. estimate / consultation request for research-stage users.

**Acceptance criteria**
- Every core template includes a primary CTA and a supporting secondary CTA where appropriate.
- On mobile, a visitor can begin contact within two taps from any core page.

### FR-003 — Dedicated Service Architecture

The site SHALL provide dedicated service pages for the core offer set rather than collapsing all services into a single page.

**Acceptance criteria**
- Each service page has its own URL, metadata, content structure, proof modules, FAQs, and CTA.
- Each service page can rank and convert independently.

### FR-004 — Value-Pillar Messaging

The site SHALL present BaseScape through three recurring value lenses:

1. financial enablement,
2. life safety and compliance, and
3. basement transformation / aesthetics.

**Acceptance criteria**
- The homepage includes all three value lenses.
- Each service page emphasizes one primary value lens and uses the other two only as supporting context.

### FR-005 — Objection Handling Content

Core service pages SHALL address the most common homeowner objections, including:

1. structural safety,
2. drainage and moisture,
3. dust and site disruption,
4. code compliance,
5. cost and affordability,
6. aesthetics,
7. project timeline.

**Acceptance criteria**
- A qualified visitor can find answers to these objections without having to leave the site for basic reassurance.

### FR-006 — Trust Stack

The site SHALL include an explicit trust stack across homepage, service pages, and conversion pages.

**Trust stack should include as available**
- authentic photos
- before-and-after visuals
- review/testimonial content
- specialist positioning
- process clarity
- service-area clarity
- licensing/insurance/permitting competence
- financing/rebate help
- warranty or workmanship statements [NEEDS CLARIFICATION]

**Acceptance criteria**
- No core conversion page relies only on text claims without adjacent proof.

### FR-007 — Gallery / Case Studies

The site SHALL provide a gallery or case study experience that shows real work.

**Each case study/project SHOULD support**
- project type
- city/location
- challenge
- solution
- proof imagery
- outcome summary

**Acceptance criteria**
- Gallery content can be reused on service and location pages.
- Before-and-after presentation is available when assets exist.

### FR-008 — Service Area Architecture

The site SHALL support unique service-area pages for launch markets.

**Initial launch markets SHOULD include a prioritized subset of**
- Salt Lake City
- Sandy
- Draper
- Herriman
- Riverton
- Lehi
- Provo
- Orem
- Eagle Mountain
- [NEEDS CLARIFICATION: final launch list]

**Acceptance criteria**
- Each service-area page has unique copy and localized relevance.
- Each service-area page includes a clear CTA and local trust context.

### FR-009 — Contact and Estimate Experience

The site SHALL include a dedicated estimate/contact experience.

**The contact flow SHALL**
- capture core lead information
- capture project/service interest
- capture location or service area context
- support follow-up by BaseScape
- minimize unnecessary friction

**Acceptance criteria**
- The form avoids irrelevant fields.
- If the form is multi-step, users see clear progress and concise questions.
- Form confirmation clearly communicates what happens next.

### FR-010 — Lead Magnet

The site SHALL include at least one early-stage lead capture asset.

**Recommended launch asset**
- Utah Basement ADU / Egress Checklist

**Acceptance criteria**
- Visitors can request the asset without entering excessive information.
- Asset capture is measurable and attributable.

### FR-011 — FAQ Coverage

The site SHALL include FAQ content covering the questions prospects repeatedly ask before contacting a contractor.

**FAQ themes should include**
- cost ranges
- code basics
- city variability
- timelines
- project disruption
- financing/rebates
- drainage/moisture concerns
- whether a walkout or egress project helps rental readiness

**Acceptance criteria**
- FAQ content is available on the site and reusable across templates.

### FR-012 — Financing and Affordability Content

The site SHALL include content that reframes the project as feasible and understandable.

**This content may include**
- financing pathways
- phased project language
- available rebates or tax-credit guidance
- examples of value or income scenarios

**Acceptance criteria**
- Affordability content is informative without making unsupported guarantees.

### FR-013 — About / Why BaseScape

The site SHALL include an About / Why BaseScape page focused on trust, specialization, process, and founder/team credibility.

**Acceptance criteria**
- This page explains why BaseScape is meaningfully different from a general contractor.
- It includes real-world credibility, not generic brand copy.

### FR-014 — Editorial Control

Marketing stakeholders SHALL be able to update routine site content without requiring code changes.

**Acceptance criteria**
- Routine edits to pages, FAQs, testimonials, case studies, offers, and service areas can be handled by non-developers.

### FR-015 — Lead Routing and Notification

Submitted leads SHALL be routed into a follow-up workflow.

**Acceptance criteria**
- BaseScape is notified of new leads.
- Lead records include enough context for follow-up.
- Lead source attribution is preserved where available.

### FR-016 — Analytics and Attribution

The site SHALL measure core funnel events.

**Tracked events SHOULD include**
- call clicks
- form starts
- form completions
- lead magnet downloads
- contact page visits
- service-page conversions
- location-page conversions
- campaign/source attribution

**Acceptance criteria**
- Core templates have a defined primary event.
- Marketing can identify which page types and sources are generating leads.

### FR-017 — Brand Fit and Visual Direction

The site SHALL feel premium, specialized, and architecturally credible.

**It SHALL NOT feel like**
- a generic contractor template
- a broad home-remodeling brochure
- a stock-photo-heavy lead farm

**Acceptance criteria**
- Visual direction emphasizes precision, professionalism, and integrated outdoor/structural transformation.

---

## 10. Content Requirements

### CR-001 — Voice and Tone

The voice SHALL be:
- specific
- authoritative
- calm
- practical
- locally relevant

The voice SHALL NOT be:
- overly hype-driven
- generic
- vague
- manipulative
- dependent on empty superlatives

### CR-002 — Proof-Backed Claims

Important claims about safety, code, financing, rebates, ROI, or property value SHALL be presented with careful language and supporting context.

### CR-003 — Authentic Media Dependency

Authentic project images are a launch dependency for core service and gallery pages.

### CR-004 — Local Relevance

Location pages SHALL incorporate local proof and localized relevance rather than city-name substitutions.

### CR-005 — Reusable Entities

At minimum, content must support structured reuse of:
- services
- locations
- FAQs
- testimonials
- case studies/projects
- lead magnets/resources
- offers/promotions

---

## 11. Quality and Experience Requirements

### QR-001 — Performance

The experience SHALL be fast enough that page performance does not undermine trust or conversion.

**Target guidance**
- Core pages should target strong Core Web Vitals on mobile.
- Critical landing pages should target LCP of 2.5 seconds or better.

### QR-002 — Accessibility

The experience SHALL meet a WCAG 2.2 AA baseline.

### QR-003 — Mobile Ergonomics

The mobile experience SHALL prioritize thumb-friendly CTAs, readable spacing, and fast access to contact actions.

### QR-004 — Scannability

Pages SHALL be easy to scan, with obvious hierarchy, short sections, and clear CTA transitions.

### QR-005 — Reliability

Forms and conversion elements SHALL fail gracefully and provide clear error handling.

### QR-006 — Search Readiness

Core pages SHALL be structured so they can earn organic visibility for relevant service and location intent.

### QR-007 — Privacy and Consent

Tracking and lead capture SHALL respect applicable privacy expectations and any required consent mechanisms. [NEEDS CLARIFICATION: final analytics/consent stack]

---

## 12. Success Metrics

### Primary Success Metrics

1. Qualified estimate / consultation requests.
2. Phone-click initiated contacts.
3. Lead-to-follow-up speed.
4. Conversion rate by page type (homepage, service page, location page, paid landing page).

### Secondary Success Metrics

1. Lead magnet capture rate.
2. Scroll depth and CTA engagement on service pages.
3. Organic landing sessions to service and location pages.
4. Gallery / case study assisted conversions.

### Launch Readiness Metrics

1. Every core template has a measurable primary conversion event.
2. Every launch page has a mapped CTA.
3. Every launch service has a dedicated page.
4. Every launch market has a unique location page or is intentionally deferred.

---

## 13. Open Questions / Needs Clarification

1. [NEEDS CLARIFICATION: final service radius and exact launch cities]
2. [NEEDS CLARIFICATION: final CRM / FSM / follow-up system]
3. [NEEDS CLARIFICATION: should V1 include live booking or only call + form?]
4. [NEEDS CLARIFICATION: what guarantees, warranties, or workmanship promises can be published?]
5. [NEEDS CLARIFICATION: which financing partners and rebate programs are actually available at launch?]
6. [NEEDS CLARIFICATION: how many authentic project case studies and reviews are available now?]
7. [NEEDS CLARIFICATION: is "BaseScape" legally cleared for use?]
8. [NEEDS CLARIFICATION: does the launch require bilingual content?]
9. [NEEDS CLARIFICATION: should paid-traffic landing pages be included in V1 launch scope or immediately after?]
10. [NEEDS CLARIFICATION: what internal SLA should govern new-lead follow-up?]

---

## 14. Release Recommendation

Proceed to planning only after the following are confirmed:

1. launch geography,
2. core service list,
3. conversion workflow,
4. available proof assets,
5. follow-up system,
6. brand naming confidence.

Once clarified, this spec is ready to feed into a planning step that defines architecture, data models, contracts, content types, and task breakdown.
