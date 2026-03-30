# Research: Add Retaining Walls Service

**Branch**: `004-retaining-walls-service` | **Date**: 2026-03-25

## R-001: Service Page Pattern Compliance

**Decision**: Follow the exact pattern established by `walkout-basements.astro` and the 4 other existing service pages.

**Rationale**: All 5 existing service pages use an identical structure:
1. Astro frontmatter fetches from CMS via `fetchServices()`
2. Falls back to hardcoded data when CMS unavailable
3. Renders via `<ServiceLayout service={service} settings={settings} />`

This pattern is proven, Constitution-compliant (Art. I, XVI), and requires zero new components.

**Alternatives considered**:
- Creating a dynamic `[slug].astro` route: Rejected. While it would DRY up the 6 service pages, this is a speculative refactor outside the spec scope (Art. XVI §3) and would risk breaking existing pages.
- CMS-only content (no fallback): Rejected. Build-time CMS unavailability would break the page (spec FR-002, edge case).

## R-002: Value Pillar Selection

**Decision**: Primary pillar = `transformation`, Supporting pillar = `safety`

**Rationale**: Clarified with user during `/speckit.clarify` session (2026-03-25). Retaining walls primarily transform landscapes (terracing, usable yard space, curb appeal). Safety is the supporting pillar (structural integrity, erosion prevention, property protection).

**Impact on implementation**: The `transformation` pillar maps to the green accent color in ServiceLayout's `pillarAccents` mapping. The hero section will display a green-toned overline label.

## R-003: Pre-Existing Form/Lead Changes

**Decision**: Cherry-pick or verify the 6 files already modified on `003-site-fixes-content` rather than re-implementing.

**Rationale**: These changes (MultiStepForm.tsx, validation.ts, Leads.ts, payload-types.ts, team-notification.ts, lead-confirmation.ts) were implemented as part of the earlier form fix work. They are complete and tested.

**Risk**: Branch divergence if `003-site-fixes-content` is merged to main before this branch. Mitigation: verify changes exist on this branch before implementation; if missing, re-apply.

## R-004: Retaining Wall Content Research

**Decision**: Hardcoded fallback content will cover these retaining wall topics:

**Process Steps** (4 steps):
1. Site Assessment & Design — Evaluate terrain, soil, drainage, and load requirements
2. Engineering & Permits — Structural engineering plans, city permits, utility marking
3. Excavation & Construction — Foundation prep, block/stone installation, drainage system, backfill
4. Finish & Landscape Restoration — Cap installation, grading, landscape integration

**Anxiety Stack** (7 fields):
- structuralSafety: Engineered for soil pressure and load-bearing; proper footings and reinforcement
- codeCompliance: Permits required for walls over 4 feet; BaseScape handles all engineering and inspections
- drainageMoisture: French drains, weep holes, and gravel backfill prevent hydrostatic pressure
- dustDisruption: Excavation contained to the wall area; existing landscaping protected where possible
- costAffordability: Ranges from $5K-$50K+ depending on wall height, length, and material
- aesthetics: Natural stone, architectural block, or poured concrete matched to home's style
- timeline: Most residential retaining walls complete in 1-3 weeks depending on scope

**FAQs** (5+ targeting search queries):
- How much does a retaining wall cost in Utah?
- Do I need a permit for a retaining wall?
- What is the best material for a retaining wall?
- How long does a retaining wall last?
- Can a retaining wall help with yard drainage?
- How tall can a retaining wall be without engineering?
- Does a retaining wall increase property value?

**Rationale**: Content targets high-intent search queries on the Wasatch Front. Topics address the most common homeowner concerns and align with the transformation + safety value pillars.

## R-005: SEO Metadata

**Decision**:
- Meta title: `Retaining Walls | Utah Wasatch Front | BaseScape` (51 chars, under 60 limit)
- Meta description: `Transform your landscape with engineered retaining walls. Structural expertise, full permits, and quality materials. Free estimates across Utah's Wasatch Front.` (159 chars, under 160 limit)

**Rationale**: Follows the pattern of existing service pages (service name | location | brand). Description leads with transformation outcome (value pillar), includes trust signals (expertise, permits), and ends with CTA + location.

## R-006: Navigation Placement

**Decision**: Add "Retaining Walls" as the 6th item in both header and footer service lists, positioned after "Artificial Turf".

**Rationale**: Alphabetical ordering is not used by the existing nav (services are grouped roughly by category). Retaining walls is a newer service offering, so placing it last in the list is appropriate. CMS-managed navigation will override the fallback order when available.
