# AEO Clarity Package — BaseScape Website

> **Date:** 2026-04-03
> **Status:** Approved
> **Scope:** Lever 1 (Clarity) from the "5 Levers for AI Search Visibility" framework
> **Approach:** Foundation → Homepage/About → Service Pages (Approach 3)

## Context

AI search (AEO) requires that LLMs can parse what a business does, who it serves, and how it's different — in plain, structured, retrievable language. BaseScape's site has a strong foundation (schema markup, heading hierarchy, FAQ coverage) but gaps in machine-readability that this spec addresses.

**Source framework:** "How to Be the Answer: 5 Levers for AI Search Visibility" by Zach Boyette, Managing Partner @ Saturation.

**Key data points driving this work:**
- Average AI prompt is ~23 words (7x longer than Google queries) — users describe situations, not keywords
- Pages structured in 120-180 word sections between headings earn 70% more LLM citations
- Structured tables increase AI citation rates by ~2.5x vs. paragraph form
- AI models extract from the first 100 words far more often than from buried conclusions
- Adding statistics to content improves AI visibility by 41%

## Phase 1: Foundation

### 1A. `llms.txt` — Machine-Readable Business Summary + Content Map

**File:** `site/public/llms.txt`

A plain-text file at the site root that gives AI models a structured overview of BaseScape. Follows the emerging llmstxt.org convention. Includes business summary + content map (not full page content).

**Contents:**

```
# BaseScape

> BaseScape is a licensed, insured residential contractor on Utah's Wasatch Front
> specializing exclusively in basement access, egress, and outdoor living.
> We transform dark, inaccessible basements into light-filled walkout entries
> and install code-compliant egress windows — it's all we do.

## Company Details
- Location: Draper, Utah
- Service Area: Utah's Wasatch Front (Salt Lake County, Utah County, Davis County)
- Phone: (888) 414-0007
- License: Utah #14082066-5501 B100
- Founded by: Steven Bunker

## Services
- Walkout Basement Conversions ($50K-$100K, 4-8 weeks)
- Basement Remodeling
- Egress Windows
- Retaining Walls
- Pavers & Hardscapes
- Artificial Turf

## What Makes BaseScape Different
- Single-trade specialization: basement access and egress only
- Structural engineering-first approach (not general carpentry)
- Proprietary "Surgical Extraction Protocol" for foundation work
- All permits and inspections handled
- Dust containment system — most families stay home during work

## Content Map
- [Homepage](https://basescapeutah.com/) — overview, services, trust signals
- [About](https://basescapeutah.com/about) — team, philosophy, credentials
- [Walkout Basements](https://basescapeutah.com/services/walkout-basements) — process, costs, FAQs, ADU guidance
- [Basement Remodeling](https://basescapeutah.com/services/basement-remodeling) — full transformations, process, FAQs
- [Egress Windows](https://basescapeutah.com/services/egress-windows) — code compliance, sizing, installation process
- [Retaining Walls](https://basescapeutah.com/services/retaining-walls) — materials, engineering, slope management
- [Pavers & Hardscapes](https://basescapeutah.com/services/pavers-hardscapes) — patios, walkways, outdoor living
- [Artificial Turf](https://basescapeutah.com/services/artificial-turf) — water savings, maintenance, installation
- [FAQ](https://basescapeutah.com/faq) — common questions across all services
- [How It Works](https://basescapeutah.com/how-it-works) — 4-step process
- [Financing](https://basescapeutah.com/financing) — payment options
- [Contact](https://basescapeutah.com/contact) — free estimate form
```

**Also update:** `site/public/robots.txt` — add a reference line pointing to `llms.txt`.

### 1B. `<ComparisonTable>` Astro Component

**File:** `site/src/components/content/ComparisonTable.astro`

A static Astro component that renders a semantic HTML comparison table. Not CMS-driven — data is hardcoded per service page.

**Props interface:**
```typescript
interface Props {
  caption: string        // 1-2 sentence summary with BaseScape positioning
  columns: string[]      // e.g., ["Option", "Cost Range", "Timeline", "Best For"]
  rows: string[][]       // Array of row arrays matching column count
}
```

**HTML output:**
- Semantic `<table>` with `<thead>`, `<tbody>`, `<caption>`
- Not a CSS grid pretending to be a table
- `<caption>` appears below the table (styled as a summary note)

**Styling:**
- Follows existing Vanilla Extract patterns (or scoped `<style>` in the Astro component)
- Responsive: horizontal scroll wrapper on mobile, full table on desktop
- Matches site color palette (navy headers, alternating row backgrounds using --color-bgAlt)
- Clean, readable — optimized for both humans and AI extraction

## Phase 2: Homepage + About Page

### 2A. Homepage — "Who We Are" Clarity Block

**Location:** New section between Trust Badges and the Promise section in `site/src/pages/index.astro`.

**Heading:** H2 "Who We Are"

**Content (~150 words):** A single, declarative paragraph that directly answers:
1. **What does this company do?** BaseScape is a residential contractor that converts existing basements into walkout entries, installs egress windows, builds retaining walls, installs pavers and hardscapes, lays artificial turf, and remodels basements.
2. **Who is it for?** Homeowners on Utah's Wasatch Front (Salt Lake County, Utah County, Davis County) with dark, underutilized basement space or yards that need outdoor living improvements.
3. **How is it different?** Single-trade specialization in structural foundation work. Engineering-first approach — not general carpentry. Handles all permits, inspections, and structural engineering in-house.

Written as plain prose (not bullet points) — a self-contained paragraph an AI model could extract verbatim as a useful answer. No brand copy, no clever headlines. Direct declarative language.

### 2B. About Page — Declarative Summary Block

**Location:** Immediately after the hero subtitle in `site/src/pages/about.astro`, before the Team Section.

**Content (~120 words):** A plain-language summary block that front-loads factual information before the narrative origin story. Answers the same three questions as the homepage block but with more depth on credentials and philosophy.

The about page already has great narrative copy ("We started BaseScape because..."). This block goes before that story — ensuring AI models encounter the declarative facts in the first 100 words of the page.

No changes to existing about page content. This is additive only.

## Phase 3: Service Pages

### 3A. Comparison Tables

Static comparison tables added to each of the 6 service pages. Placed after the Overview section, before Process Steps — where the homeowner is still in decision-mode.

| Service | Comparison Topic | Columns |
|---------|-----------------|---------|
| Walkout Basements | Walkout Entry vs. Egress Window vs. Patio Door | Option, Cost Range, Light Gain, Code Requirements, Rental Income Potential, Best For |
| Basement Remodeling | DIY vs. Professional Basement Remodel | Factor, DIY, Professional (BaseScape), Why It Matters |
| Egress Windows | Standard Egress vs. Oversized Egress vs. Walkout Entry | Option, Minimum Size, Cost Range, Light Gain, Emergency Exit, Best For |
| Retaining Walls | Concrete Block vs. Natural Stone vs. Timber | Material, Cost/ft, Lifespan, Utah Soil Suitability, Maintenance, Best For |
| Pavers & Hardscapes | Pavers vs. Poured Concrete vs. Stamped Concrete | Option, Cost/sqft, Durability, Utah Freeze-Thaw, Maintenance, Best For |
| Artificial Turf | Artificial Turf vs. Natural Grass (Utah-specific) | Factor, Artificial Turf, Natural Grass (Utah), Notes |

Each table includes a `<caption>` with a 1-2 sentence summary that positions BaseScape's recommendation.

### 3B. FAQ Expansion — Situational Long-Tail Questions

Add **8-12 new situational FAQs** per service page alongside existing FAQs. New FAQs target the specific, contextual questions people ask AI models rather than generic short-tail queries.

**Intent categories for new FAQs:**

1. **Feasibility / "Can I..."** — Lot-specific, home-specific constraints
2. **Local conditions** — Utah/Wasatch Front specifics (soil, climate, code)
3. **Decision-making** — Questions comparing options
4. **Process / "What happens..."** — Specific procedural questions
5. **Compliance / Code** — Utah building code specifics

**Answer format requirements:**
- First sentence: Direct answer in 40-60 words (the extractable snippet)
- Supporting detail: 1-2 sentences with specific numbers (dimensions, cost ranges, timeframes, code references)
- Self-contained: If an AI pulls just this answer, it communicates something useful on its own

**Example new FAQs per service:**

**Walkout Basements:**
- "Can I add a walkout basement to a home built on a flat lot?"
- "Does Utah clay soil affect walkout basement construction?"
- "What happens to my sprinkler system during a walkout conversion?"
- "Is a walkout basement or egress window better for adding rental income?"
- "Do walkout basements need separate utility metering under Utah ADU law?"
- "Can I convert my basement to a walkout if my lot has a 10% grade?"
- "How does BaseScape handle dust during foundation cutting?"
- "What structural engineering is required for a walkout basement in Utah?"

**Egress Windows:**
- "Can I install an egress window in a poured concrete foundation?"
- "What are Utah's egress window size requirements for a bedroom?"
- "How much natural light does an oversized egress window add compared to standard?"
- "Do I need a permit for an egress window in Salt Lake County?"
- "Can I install an egress window below grade?"
- "What's the difference between an egress window and a walkout basement entry?"
- "How does egress window installation affect my foundation's structural integrity?"
- "What size egress window well do I need in Utah?"

**Similar sets for remaining 4 services** — written during implementation following the same intent category framework and answer format.

**Implementation:** Added to the hardcoded fallback data in each service page file (e.g., `site/src/pages/services/walkout-basements.astro`). Same data structure as existing FAQs. No CMS schema changes needed.

**Schema coverage:** The existing `generateFAQPageSchema()` in `site/src/lib/schema.ts` automatically generates JSON-LD for all FAQs on a service page, so new FAQs get structured data for free.

### 3C. Content Structure Audit — Lead-with-Answer Pattern

A quality pass across all service page content to optimize for AI extraction. No layout or component changes — this is a content rewrite of the hardcoded fallback data.

**Service overview rewrite pattern:**
- **Sentence 1:** Direct definition of what the service is (40-60 words)
- **Sentence 2:** Who it's for and what outcome it delivers
- **Sentence 3:** Why BaseScape specifically (the differentiator)
- **Then:** Elaboration, Utah-specific context, details

**Anxiety stack answer audit:**
- Each answer opens with a concrete, extractable statement (not "We take X seriously")
- Each includes at least one specific number (cost range, timeline, dimension, code reference)
- Each is self-contained as a standalone paragraph

**Section length audit:**
- Target: 120-180 words between headings
- Break up sections exceeding ~200 words with subheadings
- Flesh out sections under ~100 words with specific details

## Files Changed

| File | Change Type | Description |
|------|------------|-------------|
| `site/public/llms.txt` | New | Machine-readable business summary + content map |
| `site/public/robots.txt` | Edit | Add llms.txt reference |
| `site/src/components/content/ComparisonTable.astro` | New | Static comparison table component |
| `site/src/pages/index.astro` | Edit | Add "Who We Are" clarity block |
| `site/src/pages/about.astro` | Edit | Add declarative summary block |
| `site/src/pages/services/walkout-basements.astro` | Edit | Comparison table, FAQ expansion, content audit |
| `site/src/pages/services/basement-remodeling.astro` | Edit | Comparison table, FAQ expansion, content audit |
| `site/src/pages/services/egress-windows.astro` | Edit | Comparison table, FAQ expansion, content audit |
| `site/src/pages/services/retaining-walls.astro` | Edit | Comparison table, FAQ expansion, content audit |
| `site/src/pages/services/pavers-hardscapes.astro` | Edit | Comparison table, FAQ expansion, content audit |
| `site/src/pages/services/artificial-turf.astro` | Edit | Comparison table, FAQ expansion, content audit |

## Out of Scope

- CMS schema changes (comparison tables are static, FAQs use existing structure)
- Off-site presence (Lever 3) — PR, directories, community work
- Measurement/reconnaissance tooling (Lever 5)
- Blog content creation
- Location page content expansion
- New routes or pages

## Success Criteria

- Every key page answers "What does this company do? Who is it for? How is it different?" in the first 100 words
- All 6 service pages have comparison tables with semantic HTML
- FAQ count per service page increases from 6-8 to 14-20
- New FAQs match situational, long-tail query patterns (feasibility, local conditions, decision-making, process, compliance)
- Every content section between headings falls within 120-180 word range
- `llms.txt` is accessible at `https://basescapeutah.com/llms.txt`
- `robots.txt` references `llms.txt`
