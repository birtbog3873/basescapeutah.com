# AEO Clarity Package Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make BaseScape's website machine-readable for AI search engines by adding `llms.txt`, plain-language clarity blocks, comparison tables, expanded FAQs, and a lead-with-answer content audit across all pages.

**Architecture:** Static content changes only — no CMS schema changes, no new routes, no new dependencies. All changes are to hardcoded fallback data in Astro page files and static assets. One new Astro component (`ComparisonTable.astro`) is added. The ServiceLayout is modified to render an optional `comparisonTable` prop.

**Tech Stack:** Astro 5.x, HTML, CSS (scoped `<style>` blocks following existing site patterns)

**Spec:** `docs/superpowers/specs/2026-04-03-aeo-clarity-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `site/public/llms.txt` | Create | Machine-readable business summary + content map |
| `site/public/robots.txt` | Edit | Add llms.txt reference |
| `site/src/components/content/ComparisonTable.astro` | Create | Semantic HTML comparison table component |
| `site/src/layouts/ServiceLayout.astro` | Edit | Render optional comparison table between Overview and Process |
| `site/src/pages/index.astro` | Edit | Add "Who We Are" clarity block section |
| `site/src/pages/about.astro` | Edit | Add declarative summary block after hero |
| `site/src/pages/services/walkout-basements.astro` | Edit | Add comparison data, expand FAQs, audit content |
| `site/src/pages/services/basement-remodeling.astro` | Edit | Add comparison data, expand FAQs, audit content |
| `site/src/pages/services/egress-windows.astro` | Edit | Add comparison data, expand FAQs, audit content |
| `site/src/pages/services/retaining-walls.astro` | Edit | Add comparison data, expand FAQs, audit content |
| `site/src/pages/services/pavers-hardscapes.astro` | Edit | Add comparison data, expand FAQs, audit content |
| `site/src/pages/services/artificial-turf.astro` | Edit | Add comparison data, expand FAQs, audit content |

---

## Task 1: Create `llms.txt` and update `robots.txt`

**Files:**
- Create: `site/public/llms.txt`
- Modify: `site/public/robots.txt`

- [ ] **Step 1: Create `site/public/llms.txt`**

```text
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
- Basement Remodeling ($30K-$80K, 6-12 weeks)
- Egress Windows ($5K-$12K per window, 2-3 days)
- Retaining Walls ($5K-$50K+, 1-3 weeks)
- Pavers & Hardscapes ($15-$35/sqft, 3-5 days)
- Artificial Turf ($8-$15/sqft, 2-4 days)

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

- [ ] **Step 2: Update `site/public/robots.txt`**

Add the llms.txt reference after the Sitemap line. The full file should be:

```text
User-agent: *
Allow: /

Sitemap: https://basescapeutah.com/sitemap-index.xml

# AI search — structured business summary
# See https://llmstxt.org for spec
Llms-txt: https://basescapeutah.com/llms.txt

# Disallow admin and API paths
Disallow: /admin/
Disallow: /api/
```

- [ ] **Step 3: Verify files are accessible**

Run: `ls -la site/public/llms.txt site/public/robots.txt`
Expected: Both files exist.

- [ ] **Step 4: Commit**

```bash
git add site/public/llms.txt site/public/robots.txt
git commit -m "feat: add llms.txt and reference in robots.txt for AI search visibility"
```

---

## Task 2: Create `ComparisonTable.astro` component

**Files:**
- Create: `site/src/components/content/ComparisonTable.astro`

- [ ] **Step 1: Create `site/src/components/content/ComparisonTable.astro`**

```astro
---
interface Props {
  caption: string
  columns: string[]
  rows: string[][]
}

const { caption, columns, rows } = Astro.props
---
<div class="comparison-table-wrapper">
  <table class="comparison-table">
    <thead>
      <tr>
        {columns.map((col) => (
          <th scope="col">{col}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row) => (
        <tr>
          {row.map((cell, i) => (
            i === 0
              ? <th scope="row">{cell}</th>
              : <td>{cell}</td>
          ))}
        </tr>
      ))}
    </tbody>
    <caption>{caption}</caption>
  </table>
</div>

<style>
  .comparison-table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: var(--size-4) 0;
  }

  .comparison-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-sans);
    font-size: 0.9375rem;
    line-height: 1.5;
    caption-side: bottom;
    min-width: 600px;
  }

  .comparison-table caption {
    padding: var(--size-3) var(--size-2);
    font-size: 0.875rem;
    color: var(--color-textMuted);
    text-align: left;
    line-height: 1.5;
  }

  .comparison-table thead th {
    background: var(--color-navy600);
    color: white;
    font-weight: 600;
    padding: var(--size-3) var(--size-4);
    text-align: left;
    white-space: nowrap;
  }

  .comparison-table thead th:first-child {
    border-radius: var(--radius-md) 0 0 0;
  }

  .comparison-table thead th:last-child {
    border-radius: 0 var(--radius-md) 0 0;
  }

  .comparison-table tbody th {
    font-weight: 600;
    color: var(--color-textPrimary);
    background: var(--color-bgSurface);
    padding: var(--size-3) var(--size-4);
    text-align: left;
  }

  .comparison-table tbody td {
    padding: var(--size-3) var(--size-4);
    color: var(--color-textBody);
    border-bottom: 1px solid var(--color-border);
  }

  .comparison-table tbody tr:nth-child(even) td,
  .comparison-table tbody tr:nth-child(even) th {
    background: var(--color-bgAlt);
  }

  .comparison-table tbody tr:last-child td,
  .comparison-table tbody tr:last-child th {
    border-bottom: none;
  }
</style>
```

- [ ] **Step 2: Verify component renders**

Run: `pnpm build` or check the dev server.
Expected: No build errors from the new component file (it won't appear on any page yet).

- [ ] **Step 3: Commit**

```bash
git add site/src/components/content/ComparisonTable.astro
git commit -m "feat: add ComparisonTable Astro component for AEO comparison tables"
```

---

## Task 3: Update ServiceLayout to render optional comparison table

**Files:**
- Modify: `site/src/layouts/ServiceLayout.astro`

The comparison table data will be passed as part of the `service` prop. The ServiceLayout needs to render it between the Overview and Process Steps sections.

- [ ] **Step 1: Add ComparisonTable import to ServiceLayout**

In `site/src/layouts/ServiceLayout.astro`, add the import at line 13 (after the LeadMagnetForm import):

```astro
import ComparisonTable from '../components/content/ComparisonTable.astro'
```

- [ ] **Step 2: Add comparison table section between Overview and Process Steps**

In `site/src/layouts/ServiceLayout.astro`, insert the following block between the closing `</section>` of the Overview section (line 100) and the `<!-- Process Steps -->` comment (line 102):

```astro
  <!-- Comparison Table -->
  {service.comparisonTable && (
    <section class="service-section service-section--alt">
      <div class="service-section__inner">
        <h2 class="service-section__heading">{service.comparisonTable.heading}</h2>
        <ComparisonTable
          caption={service.comparisonTable.caption}
          columns={service.comparisonTable.columns}
          rows={service.comparisonTable.rows}
        />
      </div>
    </section>
  )}
```

- [ ] **Step 3: Verify build still works**

Run: `pnpm build`
Expected: No errors. Existing service pages still render (they don't have `comparisonTable` data yet, so the section is skipped).

- [ ] **Step 4: Commit**

```bash
git add site/src/layouts/ServiceLayout.astro
git commit -m "feat: render optional comparison table in ServiceLayout"
```

---

## Task 4: Add "Who We Are" clarity block to homepage

**Files:**
- Modify: `site/src/pages/index.astro`

- [ ] **Step 1: Add the clarity block section**

In `site/src/pages/index.astro`, insert the following section between the Trust Badges section (closing `</section>` around line 139) and the `<!-- BaseScape Promise -->` comment (line 142):

```astro
  <!-- Who We Are — AEO clarity block -->
  <section class="clarity-section">
    <div class="clarity-section__inner">
      <h2 class="section-heading">Who We Are</h2>
      <div class="clarity-block">
        <p>
          BaseScape is a licensed and insured residential contractor serving Utah's Wasatch Front —
          Salt Lake County, Utah County, and Davis County. We specialize exclusively in basement
          access, egress, and outdoor living: walkout basement conversions, egress window
          installations, basement remodeling, retaining walls, paver patios and hardscapes, and
          artificial turf. We are not a general contractor that offers these services alongside
          dozens of others. Basement structural work and outdoor hardscaping are the only things
          we do — and that singular focus is what sets us apart.
        </p>
        <p>
          Every project starts with structural engineering, not a tape measure. Our crews are
          trained specifically in foundation cutting, load-bearing modifications, and below-grade
          construction. We handle all permits, city inspections, and structural engineering plans
          in-house. Homeowners on the Wasatch Front choose BaseScape because we bring
          engineering-grade precision to work that most contractors treat as general carpentry.
        </p>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Add the scoped styles**

Add the following inside the existing `<style>` block in `index.astro` (before the closing `</style>` tag):

```css
  .clarity-section {
    padding: var(--size-8) 0;
  }

  @media (min-width: 768px) {
    .clarity-section {
      padding: var(--size-10) 0;
    }
  }

  .clarity-section__inner {
    max-width: 1200px;
    margin-inline: auto;
    padding-inline: var(--size-4);
  }

  @media (min-width: 768px) {
    .clarity-section__inner {
      padding-inline: var(--size-6);
    }
  }

  .clarity-block {
    max-width: 720px;
  }

  .clarity-block p {
    font-family: var(--font-sans);
    font-size: clamp(1rem, 0.5vw + 0.75rem, 1.125rem);
    line-height: 1.7;
    color: var(--color-textBody);
    margin-bottom: var(--size-4);
  }

  .clarity-block p:last-child {
    margin-bottom: 0;
  }
```

- [ ] **Step 3: Verify the page renders**

Run the dev server (`pnpm dev`) and visit `http://localhost:4321/`. The "Who We Are" section should appear between Trust Badges and the BaseScape Promise.

- [ ] **Step 4: Commit**

```bash
git add site/src/pages/index.astro
git commit -m "feat: add 'Who We Are' AEO clarity block to homepage"
```

---

## Task 5: Add declarative summary block to about page

**Files:**
- Modify: `site/src/pages/about.astro`

- [ ] **Step 1: Add the clarity block**

In `site/src/pages/about.astro`, insert the following section between the hero closing `</section>` (line 66) and the `<!-- Team Section -->` comment (line 68):

```astro
  <!-- AEO Clarity Block -->
  <section class="section">
    <div class="section__inner">
      <div class="clarity-block">
        <p>
          BaseScape is a residential contractor based in Draper, Utah, serving homeowners across
          the Wasatch Front — Salt Lake County, Utah County, and Davis County. We specialize
          exclusively in basement access, egress, and outdoor living. Our services include walkout
          basement conversions, egress window installations, basement remodeling, retaining walls,
          paver patios and hardscapes, and artificial turf installation.
        </p>
        <p>
          We are a single-trade specialist. Unlike general contractors who offer basement work as
          one of many services, BaseScape was built around this single discipline. Every crew member
          is trained in structural foundation work. Every project begins with a structural engineering
          assessment. We hold Utah contractor license #14082066-5501 (B100 classification), carry full
          general liability and workers' compensation insurance, and handle all permits and city
          inspections in-house. Founded by Steven Bunker, BaseScape exists because cutting into
          foundational load-bearing walls is structural engineering, not general carpentry.
        </p>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Add the scoped styles**

Add the following inside the existing `<style>` block in `about.astro` (before the closing `</style>` tag):

```css
  .clarity-block {
    max-width: 720px;
  }

  .clarity-block p {
    font-family: var(--font-sans);
    font-size: clamp(1rem, 0.5vw + 0.75rem, 1.125rem);
    line-height: 1.7;
    color: var(--color-textBody);
    margin-bottom: var(--size-4);
  }

  .clarity-block p:last-child {
    margin-bottom: 0;
  }
```

- [ ] **Step 3: Verify the page renders**

Visit `http://localhost:4321/about`. The declarative summary should appear between the hero and the Team section.

- [ ] **Step 4: Commit**

```bash
git add site/src/pages/about.astro
git commit -m "feat: add AEO clarity block to about page"
```

---

## Task 6: Walkout Basements — comparison table, FAQ expansion, content audit

**Files:**
- Modify: `site/src/pages/services/walkout-basements.astro`

- [ ] **Step 1: Add comparison table data**

In `site/src/pages/services/walkout-basements.astro`, add the following property to the fallback `service` object (after the `seo` property, before the closing `}` around line 61):

```javascript
    comparisonTable: {
      heading: 'Walkout Entry vs. Egress Window vs. Patio Door',
      caption: 'BaseScape specializes in walkout basement conversions and egress windows. A walkout entry delivers the highest ROI through rental income potential and maximum light gain, but an egress window is the right choice when your lot or budget doesn\'t support a full walkout.',
      columns: ['Option', 'Cost Range', 'Light Gain', 'Code Requirements', 'Rental Income Potential', 'Best For'],
      rows: [
        ['Walkout Entry', '$50K–$100K', 'Maximum — full door opening', 'Structural engineering, city permits, IRC egress compliance', 'High — enables full ADU with separate entrance', 'Sloped lots, rental income goals, maximum basement transformation'],
        ['Egress Window', '$5K–$12K per window', 'Significant — large window opening', 'IRC Section R310 (5.7 sq ft min opening), city permit', 'Moderate — adds legal bedroom count', 'Flat lots, adding legal bedrooms, budget-conscious safety upgrades'],
        ['Patio Door (above grade)', '$3K–$8K', 'Moderate — standard door size', 'Standard building permit, no structural engineering', 'Low — no basement access improvement', 'Above-grade rooms with existing openings, not a basement solution'],
      ],
    },
```

- [ ] **Step 2: Add new situational FAQs**

In the same file, append these FAQs to the existing `faqs` array (after the last existing FAQ object):

```javascript
      { question: 'Can I add a walkout basement to a home built on a flat lot?', answer: 'Flat lots are challenging for walkout conversions because there isn\'t enough grade change to create a ground-level exit. In most cases, a flat lot is better suited for an egress window installation instead. However, if your lot has even a 4-6 foot elevation change from front to back, a partial walkout may be possible. BaseScape provides a free site assessment to evaluate your specific lot topography and recommend the best option.' },
      { question: 'Does Utah clay soil affect walkout basement construction?', answer: 'Yes — Utah\'s Wasatch Front has expansive clay soils that swell when wet and shrink when dry, creating significant lateral pressure on foundation walls. BaseScape accounts for this in every walkout design by specifying steel or LVL headers rated for local soil conditions, installing proper drainage to manage clay moisture, and engineering the new opening to handle the additional load transfer. Ignoring clay soil conditions is the most common cause of walkout conversion failures by general contractors.' },
      { question: 'What happens to my sprinkler system during a walkout conversion?', answer: 'Sprinkler lines in the excavation zone are temporarily capped and rerouted during construction. BaseScape coordinates with your irrigation system before excavation begins, marks all existing lines, and restores or reroutes them as part of the landscape restoration phase. Most homeowners see 1-2 zones temporarily offline for 2-3 weeks during the exterior work phase.' },
      { question: 'Is a walkout basement or egress window better for adding rental income?', answer: 'A walkout basement entry is significantly better for rental income because it provides a separate ground-level entrance — the key requirement for a comfortable, independent living space. Under Utah\'s ADU laws (HB 398, SB 174), a walkout with a full kitchen can qualify as an Accessory Dwelling Unit generating $1,200-$2,000+/month in rental income on the Wasatch Front. An egress window adds a legal bedroom but doesn\'t provide separate access.' },
      { question: 'Do walkout basements need separate utility metering under Utah ADU law?', answer: 'It depends on whether you add a full kitchen with a stove. Under Utah\'s HB 398 and SB 174, adding a stove reclassifies the space as an ADU, which triggers additional requirements in most Wasatch Front cities — including separate utility metering, fire separation, and sometimes additional parking. A kitchenette without a stove avoids reclassification. BaseScape explains these trade-offs during the design phase so you can make an informed decision.' },
      { question: 'Can I convert my basement to a walkout if my lot has a 10% grade?', answer: 'Yes — a 10% grade is generally sufficient for a walkout conversion. For a standard 8-foot basement wall, you need approximately 6-7 feet of grade change from the interior floor level to the exterior grade. A 10% slope over a 60-70 foot lot depth provides that. BaseScape evaluates your exact grade, soil conditions, and foundation type during a free structural assessment to confirm feasibility.' },
      { question: 'How does BaseScape handle dust during foundation cutting?', answer: 'BaseScape uses a sealed dust containment system with negative air pressure and HEPA filtration. Poly barriers are installed between the work area and your living space, and a commercial HEPA air scrubber maintains negative pressure in the construction zone — pulling dust toward the filters rather than into your home. Most families stay in their homes throughout the project with minimal disruption to daily life.' },
      { question: 'What structural engineering is required for a walkout basement in Utah?', answer: 'Every walkout conversion requires a licensed structural engineer to design the opening. This includes calculating the load path through the foundation, specifying the steel or LVL header size and bearing requirements, determining temporary shoring needs during construction, and verifying the modified foundation meets seismic requirements for Utah\'s Zone 3 classification. BaseScape works with licensed Utah structural engineers and includes the engineering plans in every project scope.' },
```

- [ ] **Step 3: Audit overview content for lead-with-answer pattern**

The existing walkout basements overview already opens with a direct definition: "A walkout basement conversion creates a full-height, ground-level entry from your below-grade basement to your backyard." This is good — no rewrite needed for this service.

Review the anxiety stack answers — the current ones open with concrete statements and include specific numbers. No changes needed for walkout basements.

- [ ] **Step 4: Verify the page renders**

Run the dev server and visit `http://localhost:4321/services/walkout-basements`. The comparison table should appear between Overview and Process Steps. New FAQs should appear in the FAQ accordion.

- [ ] **Step 5: Commit**

```bash
git add site/src/pages/services/walkout-basements.astro
git commit -m "feat: add comparison table and expanded FAQs to walkout basements page"
```

---

## Task 7: Basement Remodeling — comparison table, FAQ expansion, content audit

**Files:**
- Modify: `site/src/pages/services/basement-remodeling.astro`

- [ ] **Step 1: Add comparison table data**

Add to the fallback `service` object (after `seo`, before closing `}`):

```javascript
    comparisonTable: {
      heading: 'DIY vs. Professional Basement Remodel',
      caption: 'BaseScape specializes in professional basement transformations with below-grade expertise. DIY works for cosmetic updates, but structural, electrical, plumbing, and moisture work requires licensed professionals to meet code and protect your investment.',
      columns: ['Factor', 'DIY', 'Professional (BaseScape)', 'Why It Matters'],
      rows: [
        ['Moisture Assessment', 'Visual inspection only', 'Moisture meter testing, drainage evaluation, vapor barrier specification', 'Undetected moisture destroys finishes within 2-5 years — the #1 cause of basement remodel failure'],
        ['Structural Work', 'Not possible without a license', 'Licensed structural assessment, engineered modifications, load-bearing wall identification', 'Removing or modifying the wrong wall compromises your entire home\'s structural integrity'],
        ['Electrical & Plumbing', 'Homeowner permit possible for minor work', 'Licensed subcontractors, full code compliance, inspection-ready', 'Basement electrical must meet specific code requirements for GFCI, AFCI, and circuit loading'],
        ['Egress Compliance', 'Often overlooked', 'IRC R310 compliance verified — every bedroom gets a code-compliant egress window', 'Without egress, basement bedrooms are illegal and a life-safety hazard'],
        ['Timeline', '3-6 months (weekends)', '6-12 weeks (full-time crews)', 'Professional crews work full days with coordinated trades — no waiting between phases'],
        ['Typical Cost', '$15K-$40K (materials + your time)', '$30K-$80K (turnkey)', 'Professional cost includes engineering, permits, inspections, and warranty — DIY costs often escalate 30-50% from initial estimates'],
      ],
    },
```

- [ ] **Step 2: Add new situational FAQs**

Append to the existing `faqs` array:

```javascript
      { question: 'Can I finish my basement if it has moisture issues?', answer: 'Yes, but the moisture must be addressed first — before any framing or drywall. BaseScape starts every basement project with a moisture assessment using moisture meters and visual inspection of the foundation. If we find elevated moisture, we install interior drainage systems, vapor barriers, or waterproof membranes as needed. Finishing over moisture problems leads to mold, rot, and failed finishes within 2-5 years.' },
      { question: 'How much does it cost to add a bathroom to a basement?', answer: 'Adding a basement bathroom typically costs $8,000-$20,000 depending on whether you have an existing rough-in (drain stubs in the concrete floor). If you have a rough-in, the plumbing work is straightforward. Without one, we need to cut the concrete floor to install drain lines — adding $3,000-$5,000 to the cost. BaseScape includes bathroom plumbing in our detailed project estimates.' },
      { question: 'Does a finished basement need egress windows in Utah?', answer: 'Yes — every sleeping room (bedroom) in a finished basement requires at least one egress window or door per IRC Section R310. The window must have a minimum net clear opening of 5.7 square feet, a minimum width of 20 inches, and a sill height no more than 44 inches from the floor. BaseScape installs egress windows as part of basement remodeling projects when bedrooms are included in the design.' },
      { question: 'What ceiling height do I need for a legal finished basement?', answer: 'The IRC requires a minimum ceiling height of 7 feet for habitable space in basements. Beams and ducts can drop to 6 feet 4 inches if they don\'t span more than 50% of the room. If your basement has low ceilings, options include raising the floor joists above (expensive), lowering the concrete floor (underpinning), or designing around obstacles with creative framing and soffit placement.' },
      { question: 'Can I convert my basement into an apartment in Utah?', answer: 'Yes — Utah\'s HB 398 and SB 174 allow Accessory Dwelling Units (ADUs) in most Wasatch Front cities. Requirements include a separate entrance (walkout or side entry), egress from every sleeping room, fire separation between units, and — if you include a stove — separate utility metering. BaseScape handles ADU compliance from design through inspection.' },
      { question: 'How do you handle low basement ceilings during a remodel?', answer: 'Low ceilings are the most common basement challenge on the Wasatch Front. BaseScape uses several strategies: recessed LED lighting instead of drop ceilings (saves 4-6 inches), strategic soffit placement to hide mechanicals while maximizing open ceiling area, spray-foam insulation directly on the foundation walls (thinner than fiberglass batt), and careful HVAC duct routing. For basements below the 7-foot IRC minimum, we can discuss underpinning options.' },
      { question: 'Is basement insulation required by code in Utah?', answer: 'Yes — Utah falls in IECC Climate Zones 5 and 6, which require basement wall insulation of R-15 continuous or R-19 cavity (Zone 5) to R-20 continuous or R-25 cavity (Zone 6). BaseScape installs either spray-foam insulation (higher R-value per inch, built-in vapor barrier) or rigid foam board with cavity insulation depending on your budget and wall conditions.' },
      { question: 'What happens if my basement has asbestos or lead paint?', answer: 'Homes built before 1980 may have asbestos in floor tiles, pipe insulation, or joint compound, and lead paint on walls or trim. BaseScape recommends testing before any demolition work. If hazardous materials are found, we coordinate with licensed abatement contractors to safely remove them before construction begins. Abatement typically adds $2,000-$5,000 to the project depending on scope.' },
```

- [ ] **Step 3: Content audit — rewrite overview lead**

The current overview opens with: "A basement transformation goes beyond cosmetic updates." This is vague — it doesn't define what the service is. Replace the first `<p>` tag content in the `overview` field:

Replace:
```
<p>A basement transformation goes beyond cosmetic updates. BaseScape specializes in converting raw or outdated below-grade space into fully finished, code-compliant living areas — from rental-ready ADU apartments to home theaters, gyms, and family rooms that feel like an extension of your main floor.</p>
```

With:
```
<p>Basement remodeling is the conversion of unfinished or outdated below-grade space into fully finished, code-compliant living areas — bedrooms, family rooms, home offices, rental apartments, or home theaters. BaseScape specializes in the unique structural and environmental challenges of below-grade construction: moisture management, foundation assessment, egress compliance, and the engineering required to make basements safe, dry, and comfortable for Utah homeowners on the Wasatch Front.</p>
```

- [ ] **Step 4: Verify the page renders**

Visit `http://localhost:4321/services/basement-remodeling`.

- [ ] **Step 5: Commit**

```bash
git add site/src/pages/services/basement-remodeling.astro
git commit -m "feat: add comparison table, expanded FAQs, and content audit to basement remodeling page"
```

---

## Task 8: Egress Windows — comparison table, FAQ expansion, content audit

**Files:**
- Modify: `site/src/pages/services/egress-windows.astro`

- [ ] **Step 1: Add comparison table data**

Add to the fallback `service` object (after `seo`, before closing `}`):

```javascript
    comparisonTable: {
      heading: 'Standard Egress vs. Oversized Egress vs. Walkout Entry',
      caption: 'BaseScape installs both egress windows and walkout entries. Standard egress meets minimum code requirements at the lowest cost. Oversized egress maximizes light and livability. A walkout entry is the premium option for basements on sloped lots where rental income or separate access is the goal.',
      columns: ['Option', 'Minimum Size', 'Cost Range', 'Light Gain', 'Emergency Exit', 'Best For'],
      rows: [
        ['Standard Egress Window', '5.7 sq ft opening (20"W × 24"H min)', '$5K–$8K', 'Good — meets code minimum', 'Yes — IRC R310 compliant', 'Adding legal bedrooms on a budget, code compliance'],
        ['Oversized Egress Window', '8–12 sq ft opening', '$8K–$12K', 'Excellent — 40-100% more light than standard', 'Yes — exceeds code requirements', 'Maximum natural light, premium feel, higher home value'],
        ['Walkout Entry (Full Door)', 'Standard door opening (36"W × 80"H)', '$50K–$100K', 'Maximum — full door + sidelight options', 'Yes — exceeds all egress requirements', 'Rental income (ADU), separate entrance, sloped lots'],
      ],
    },
```

- [ ] **Step 2: Add new situational FAQs**

Append to the existing `faqs` array:

```javascript
      { question: 'Can I install an egress window in a poured concrete foundation?', answer: 'Yes — poured concrete is actually the most common foundation type for egress installations on the Wasatch Front. BaseScape uses diamond-blade concrete cutting to create the opening, then installs a structural steel or LVL header to redistribute the load. The process is well-established and takes 2-3 days for a single window. Block foundations are also suitable but require different cutting and reinforcement techniques.' },
      { question: 'What are Utah\'s egress window size requirements for a bedroom?', answer: 'Utah follows IRC Section R310, which requires every sleeping room to have at least one egress opening with a minimum net clear area of 5.7 square feet, a minimum width of 20 inches, a minimum height of 24 inches, and a maximum sill height of 44 inches from the finished floor. The window must open without tools or special knowledge. BaseScape verifies compliance and schedules the city inspection.' },
      { question: 'How much natural light does an oversized egress window add compared to standard?', answer: 'An oversized egress window (8-12 sq ft opening) provides 40-100% more natural light than a standard code-minimum egress window (5.7 sq ft). The difference is dramatic — an oversized window can make a basement room feel like an above-grade space. For $3,000-$4,000 more than standard, the additional light and ventilation significantly improve livability and resale value.' },
      { question: 'Do I need a permit for an egress window in Salt Lake County?', answer: 'Yes — all structural modifications to foundation walls require a building permit in Salt Lake County and every other Wasatch Front jurisdiction. The permit process requires structural engineering plans showing the header design and load path. BaseScape handles the entire permit process: engineering plans, permit application, and inspection scheduling. Typical permit turnaround is 2-4 weeks.' },
      { question: 'Can I install an egress window below grade?', answer: 'Yes — most basement egress windows are installed below grade. That\'s exactly what they\'re designed for. The window sits in a window well that extends above grade to allow emergency exit and provide natural light. The window well must be at least 36 inches wide (9 sq ft minimum area for wells deeper than 44 inches) and include a permanently attached ladder or steps if the well depth exceeds 44 inches from grade.' },
      { question: 'What\'s the difference between an egress window and a walkout basement entry?', answer: 'An egress window is a code-compliant emergency exit window installed in a foundation wall, providing natural light and ventilation to basement rooms. A walkout basement entry is a full door opening cut into the foundation that provides ground-level access to the backyard. Egress windows cost $5,000-$12,000 per window; walkout entries cost $50,000-$100,000. Both meet egress code requirements, but a walkout provides separate access for rental units.' },
      { question: 'How does egress window installation affect my foundation\'s structural integrity?', answer: 'When done correctly, it doesn\'t compromise structural integrity at all. The key is proper structural engineering — calculating the load above the opening and installing a header (steel lintel or LVL beam) sized to carry that load. BaseScape has every opening engineered by a licensed structural engineer before cutting begins. The header redistributes the load around the opening, maintaining the foundation\'s structural capacity.' },
      { question: 'What size egress window well do I need in Utah?', answer: 'For wells with a depth of 44 inches or less, there\'s no minimum area requirement beyond fitting the window. For wells deeper than 44 inches (most basement installations), the well must have a minimum area of 9 square feet with a minimum horizontal dimension of 36 inches. Wells deeper than 44 inches also require a permanently attached ladder or steps. BaseScape sizes every well to meet code and maximize usability.' },
```

- [ ] **Step 3: Content audit**

The existing egress windows overview already leads with a strong definition and specific code requirements. No rewrite needed.

- [ ] **Step 4: Verify and commit**

```bash
git add site/src/pages/services/egress-windows.astro
git commit -m "feat: add comparison table and expanded FAQs to egress windows page"
```

---

## Task 9: Retaining Walls — comparison table, FAQ expansion, content audit

**Files:**
- Modify: `site/src/pages/services/retaining-walls.astro`

- [ ] **Step 1: Add comparison table data**

Add to the fallback `service` object (after `seo`, before the closing `}` and before the `leadMagnet` assignment):

```javascript
    comparisonTable: {
      heading: 'Retaining Wall Materials Compared',
      caption: 'BaseScape builds retaining walls in all three materials. Concrete block offers the best combination of durability, cost, and design options for most Wasatch Front projects. Natural stone is the premium choice for visible, high-profile walls.',
      columns: ['Material', 'Cost per Linear Foot', 'Lifespan', 'Utah Soil Suitability', 'Maintenance', 'Best For'],
      rows: [
        ['Concrete Block (Segmental)', '$50–$150/LF', '50–75+ years', 'Excellent — engineered for expansive clay, geogrid-compatible', 'Very low — no mortar joints to repoint', 'Most residential projects, walls over 4 feet, curved or tiered designs'],
        ['Natural Stone', '$100–$300/LF', '75–100+ years', 'Good — requires proper drainage engineering for clay soils', 'Low — occasional re-pointing of mortar joints', 'High-visibility walls, premium landscaping, architectural focal points'],
        ['Timber (Pressure-Treated)', '$30–$80/LF', '15–25 years', 'Poor — wood deteriorates faster in Utah\'s wet clay', 'High — requires replacement every 15-25 years', 'Short-term retaining under 3 feet, garden borders, budget projects'],
      ],
    },
```

- [ ] **Step 2: Add new situational FAQs**

Append to the existing `faqs` array:

```javascript
      { question: 'Do I need a retaining wall permit in Lehi, Utah?', answer: 'Yes, if the wall exceeds 4 feet in height (measured from the bottom of the footing to the top of the wall). This applies to Lehi and virtually all Wasatch Front cities. Walls over 4 feet require structural engineering plans stamped by a licensed Utah engineer. BaseScape handles the full permit process — engineering, application, and inspection scheduling — for every wall we build.' },
      { question: 'What causes retaining walls to fail on the Wasatch Front?', answer: 'The #1 cause of retaining wall failure in Utah is hydrostatic pressure from poor drainage — water saturates the clay soil behind the wall, creating enormous lateral pressure that pushes the wall forward. The second most common cause is inadequate footings that can\'t handle the load. BaseScape prevents both by engineering French drain systems and properly sized footings for every wall, regardless of height.' },
      { question: 'Can I build a retaining wall on a slope with Utah clay soil?', answer: 'Yes — but clay soil requires more engineering than sandy or gravelly soil. Utah\'s expansive clay swells significantly when wet, generating high lateral pressure against retaining walls. BaseScape designs walls for local clay conditions using deeper footings, geogrid reinforcement for walls over 4 feet, and oversized French drain systems with clean gravel backfill to manage moisture and prevent clay from contacting the wall face directly.' },
      { question: 'How close to my property line can I build a retaining wall?', answer: 'Setback requirements vary by city on the Wasatch Front. Most cities require a minimum of 1-3 feet from the property line for retaining walls, but some allow walls on the property line with neighbor consent. Walls that also function as fences may have different height limits. BaseScape verifies your specific city\'s setback requirements during the design phase and applies for any necessary variances.' },
      { question: 'Should I use geogrid reinforcement in my retaining wall?', answer: 'Geogrid is required for segmental retaining walls over 4 feet tall and strongly recommended for any wall in Utah\'s clay soils. Geogrid layers extend horizontally into the soil behind the wall, creating a reinforced earth mass that resists the lateral pressure trying to push the wall forward. Without geogrid, tall walls rely solely on their own weight — which is insufficient for Utah\'s expansive clay conditions.' },
      { question: 'Can a retaining wall fix standing water in my yard?', answer: 'Yes — retaining walls are often part of a comprehensive drainage solution for sloped Wasatch Front lots. By reshaping terrain into level terraces, the wall redirects surface water flow. Combined with French drains, gravel backfill, and proper grading, a retaining wall system can eliminate standing water, redirect runoff away from your foundation, and create usable yard space where water previously pooled.' },
      { question: 'What is the cheapest retaining wall option in Utah?', answer: 'Pressure-treated timber walls are the lowest upfront cost at $30-$80 per linear foot, but they last only 15-25 years in Utah\'s climate and are not suitable for walls over 3-4 feet. Segmental concrete block starts at $50-$150 per linear foot and lasts 50-75+ years — making it significantly cheaper over a 50-year period. BaseScape recommends concrete block for most residential projects based on long-term value.' },
      { question: 'How deep do retaining wall footings need to be in Utah?', answer: 'Retaining wall footings in Utah must extend below the frost line, which is 30-36 inches on the Wasatch Front depending on elevation. A typical footing is 12-24 inches deep below grade with a compacted gravel base of 6-12 inches underneath. Taller walls and walls in clay soils require deeper, wider footings. BaseScape\'s structural engineers specify exact footing dimensions for every wall based on soil conditions and wall height.' },
```

- [ ] **Step 3: Content audit**

The existing retaining walls overview leads well. No rewrite needed.

- [ ] **Step 4: Verify and commit**

```bash
git add site/src/pages/services/retaining-walls.astro
git commit -m "feat: add comparison table and expanded FAQs to retaining walls page"
```

---

## Task 10: Pavers & Hardscapes — comparison table, FAQ expansion, content audit

**Files:**
- Modify: `site/src/pages/services/pavers-hardscapes.astro`

- [ ] **Step 1: Add comparison table data**

Add to the fallback `service` object (after `seo`, before closing `}`):

```javascript
    comparisonTable: {
      heading: 'Pavers vs. Poured Concrete vs. Stamped Concrete',
      caption: 'BaseScape specializes in interlocking paver installations engineered for Utah\'s freeze-thaw cycles. Pavers offer superior long-term durability and repairability compared to poured or stamped concrete, which commonly crack within 3-5 years on the Wasatch Front.',
      columns: ['Option', 'Cost per Sq Ft', 'Durability (Utah Climate)', 'Freeze-Thaw Performance', 'Maintenance', 'Best For'],
      rows: [
        ['Interlocking Pavers', '$15–$35/sqft installed', '25–50 years', 'Excellent — flex with ground movement, individual replacement', 'Low — polymeric sand every 2-3 years, occasional pressure wash', 'Patios, walkways, pool decks, areas where repair access matters'],
        ['Poured Concrete', '$8–$15/sqft installed', '15–25 years', 'Poor — cracks from freeze-thaw heaving, expensive to repair', 'Low initially — but cracks require full slab replacement', 'Driveways, utility areas, budget-first installations'],
        ['Stamped Concrete', '$12–$25/sqft installed', '10–20 years', 'Poor — same cracking issues as poured, plus surface seal failure', 'High — requires resealing every 2-3 years, color fading', 'Decorative look on a moderate budget, low-traffic areas'],
      ],
    },
```

- [ ] **Step 2: Add new situational FAQs**

Append to the existing `faqs` array:

```javascript
      { question: 'Why do concrete patios crack in Utah?', answer: 'Utah\'s Wasatch Front experiences 100+ freeze-thaw cycles per year. Water seeps into the soil beneath the concrete slab, freezes and expands, then thaws and contracts — heaving the slab unevenly over time. This cycle cracks poured concrete within 3-5 years on many Utah properties. Interlocking pavers avoid this problem because the joints between pavers flex with ground movement instead of cracking.' },
      { question: 'How thick should a paver base be in Utah?', answer: 'For Utah\'s freeze-thaw climate, BaseScape installs 6-8 inches of compacted aggregate base for patios and walkways, and 10-12 inches for driveways. This is deeper than the 4-inch minimum many contractors use. The extra base depth prevents settling and heaving through Utah\'s harsh winter cycles. We also install geotextile fabric beneath the base to prevent soil migration into the aggregate.' },
      { question: 'Can pavers be installed over existing concrete?', answer: 'In some cases, yes — if the existing concrete is level, structurally sound, and not actively heaving. Pavers are laid on a thin sand bed over the concrete. However, cracked, heaved, or settling concrete should be removed first. Overlaying pavers on failed concrete just transfers the problem upward. BaseScape evaluates your existing surface during the design consultation and recommends the best approach.' },
      { question: 'What type of sand goes between pavers?', answer: 'BaseScape uses polymeric sand — a specially formulated sand that hardens when wet, locking pavers together and preventing weed growth, insect penetration, and sand washout. Regular sand erodes and allows weed growth within months. Polymeric sand needs replenishment every 2-3 years as it gradually breaks down from UV exposure and foot traffic.' },
      { question: 'Do paver patios increase home value in Utah?', answer: 'Yes — a professionally installed paver patio typically returns 50-80% of its cost at resale and can return more through improved lifestyle and outdoor entertaining space. Real estate agents on the Wasatch Front consistently report that outdoor living improvements are among the most desirable features for Utah homebuyers, especially when combined with other landscape improvements like retaining walls or turf.' },
      { question: 'How long does it take to install a paver patio?', answer: 'Most residential paver patios (200-400 sq ft) are completed in 3-5 days: 1 day for excavation and base preparation, 1-2 days for base compaction and leveling, and 1-2 days for paver installation, edge restraint, and polymeric sand. Larger projects with retaining walls or complex grading may take 1-2 weeks. BaseScape provides an exact timeline after the design phase.' },
      { question: 'Are permeable pavers worth the extra cost in Utah?', answer: 'Permeable pavers cost 20-30% more than standard pavers but allow rainwater and snowmelt to drain directly through the surface into the ground below. They are valuable for driveways, areas near foundations, and properties with drainage concerns. Several Utah cities are beginning to incentivize permeable paving for stormwater management. For most residential patios, standard pavers with proper grading provide adequate drainage at lower cost.' },
      { question: 'What is the best paver pattern for a patio?', answer: 'Herringbone is the strongest pattern for driveways and high-traffic areas because the interlocking 45° or 90° angle prevents lateral shifting. For patios, running bond (brick pattern) and basketweave offer a classic look with good structural performance. Large-format slabs in a stacked or offset pattern create a modern aesthetic. BaseScape helps you choose a pattern that matches your home\'s style and handles your expected traffic.' },
```

- [ ] **Step 3: Content audit**

The existing pavers overview leads well with a clear definition. No rewrite needed.

- [ ] **Step 4: Verify and commit**

```bash
git add site/src/pages/services/pavers-hardscapes.astro
git commit -m "feat: add comparison table and expanded FAQs to pavers & hardscapes page"
```

---

## Task 11: Artificial Turf — comparison table, FAQ expansion, content audit

**Files:**
- Modify: `site/src/pages/services/artificial-turf.astro`

- [ ] **Step 1: Add comparison table data**

Add to the fallback `service` object (after `seo`, before closing `}`):

```javascript
    comparisonTable: {
      heading: 'Artificial Turf vs. Natural Grass in Utah',
      caption: 'BaseScape installs premium artificial turf systems engineered for Utah\'s climate. For Wasatch Front homeowners, artificial turf eliminates 40,000-60,000 gallons of annual water use per 1,000 sq ft — a significant savings in the second-driest state in the nation.',
      columns: ['Factor', 'Artificial Turf', 'Natural Grass (Utah)', 'Notes'],
      rows: [
        ['Annual Water Use', '0 gallons (occasional rinse only)', '40,000–60,000 gallons per 1,000 sq ft', 'Utah outdoor water use is up to 60% of residential consumption'],
        ['Annual Maintenance Cost', '$0–$100 (occasional brushing)', '$500–$1,200 (mowing, fertilizer, aeration, overseeding)', 'Artificial turf eliminates mowing, fertilizing, and seasonal reseeding'],
        ['Installation Cost', '$8–$15 per sq ft', '$2–$5 per sq ft (sod)', 'Turf pays back the difference in 3-5 years through water and maintenance savings'],
        ['Lifespan', '15–20 years', 'Ongoing (requires annual reseeding, seasonal replacement)', 'Premium UV-stabilized turf resists fading from Utah\'s intense sun'],
        ['Winter Appearance', 'Green year-round', 'Brown/dormant November–March', 'Natural bluegrass and fescue go dormant in Utah winters'],
        ['Pet Friendliness', 'Antimicrobial infill, drains 30+ in/hr, no mud', 'Mud, brown spots, digging, parasites', 'Modern pet turf is specifically designed for drainage and odor control'],
        ['Summer Heat', '120–150°F in direct sun (coolable with water)', '75–85°F surface temperature', 'Heat-reflective turf options reduce temperatures by 15-20%'],
        ['Water Rebates', 'Eligible — $1-$3/sq ft from Utah water districts', 'Not applicable', 'BaseScape helps you apply for available conservation rebates'],
      ],
    },
```

- [ ] **Step 2: Add new situational FAQs**

Append to the existing `faqs` array:

```javascript
      { question: 'How much water does artificial turf save per year in Utah?', answer: 'A typical 1,000 square foot natural grass lawn in Utah uses 40,000-60,000 gallons of water per year. Artificial turf eliminates virtually all of that — the only water use is an occasional rinse for pet areas or dust. At current Wasatch Front water rates, that translates to $200-$500+ in annual water bill savings. Most homeowners recoup the installation cost difference within 3-5 years.' },
      { question: 'Is artificial turf safe for kids to play on?', answer: 'Yes — modern artificial turf is specifically designed as a safe play surface. Premium turf systems include shock-absorbing padding underneath that meets ASTM F1292 fall-height safety standards for playgrounds. The surface is non-abrasive, drains quickly (no puddles or mud), and doesn\'t require pesticides or fertilizers that children might contact. BaseScape installs IPEMA-certified padding for play areas upon request.' },
      { question: 'Does artificial turf smell in hot weather?', answer: 'Standard infill can develop odor in hot weather, especially in pet areas. BaseScape addresses this by using antimicrobial infill options (Zeolite or BioFill) that neutralize bacteria and prevent odor buildup. For pet-specific installations, we also recommend a slightly higher drainage base and periodic enzyme treatment. Proper installation with adequate drainage eliminates 95%+ of odor concerns.' },
      { question: 'Can I install artificial turf on a slope?', answer: 'Yes — artificial turf installs well on slopes up to about 30% grade. The turf is secured with landscape spikes and the aggregate base is compacted to the slope profile. For steeper slopes, we anchor the turf with additional perimeter fastening and may recommend geogrid reinforcement in the sub-base to prevent erosion underneath. Drainage engineering is critical on slopes to prevent water from undermining the base.' },
      { question: 'What happens to artificial turf in Utah snow?', answer: 'Snow sits on artificial turf just like natural grass and melts naturally. You can gently remove snow with a leaf blower or plastic shovel (avoid metal blades). Turf drains at 30+ inches per hour, so snowmelt drains quickly and doesn\'t puddle. Freeze-thaw cycles don\'t damage the turf — the flexible backing and aggregate base move with the ground without cracking or separating.' },
      { question: 'How do I maintain artificial turf?', answer: 'Artificial turf requires minimal maintenance: brush the fibers with a stiff broom or power broom 2-4 times per year to keep them upright, remove leaves and debris as needed, and rinse pet areas weekly. Every 2-3 years, top up the infill and apply a UV-protective treatment. That\'s it — no mowing, watering, fertilizing, aerating, or overseeding. Total annual maintenance time is roughly 2-4 hours.' },
      { question: 'What turf rebates are available in Utah?', answer: 'Several Wasatch Front water districts offer rebates for converting natural grass to water-efficient landscaping. Jordan Valley Water Conservancy District offers $1.25-$3.00 per square foot. Central Utah Water Conservancy District and other local providers have similar programs. Rebate amounts and eligibility requirements change annually. BaseScape checks current rebate availability during your consultation and helps you apply.' },
      { question: 'Can I install a putting green with artificial turf?', answer: 'Yes — putting greens use a specialized short-pile turf (typically 10-15mm pile height vs. 35-50mm for lawn turf) with a specific speed rating that simulates real green conditions. BaseScape installs residential putting greens with proper contouring, breaks, and fringe turf. A typical backyard putting green (200-500 sq ft) costs $3,000-$8,000 installed depending on complexity and contouring.' },
```

- [ ] **Step 3: Content audit**

The existing artificial turf overview leads with a clear definition. No rewrite needed.

- [ ] **Step 4: Verify and commit**

```bash
git add site/src/pages/services/artificial-turf.astro
git commit -m "feat: add comparison table and expanded FAQs to artificial turf page"
```

---

## Task 12: Final build verification

**Files:** None (verification only)

- [ ] **Step 1: Run full build**

Run: `pnpm build`
Expected: Build completes without errors. All pages generate successfully.

- [ ] **Step 2: Verify `llms.txt` is in build output**

Run: `ls -la site/dist/llms.txt`
Expected: File exists in the build output.

- [ ] **Step 3: Verify robots.txt includes llms.txt reference**

Run: `cat site/dist/robots.txt`
Expected: Contains `Llms-txt: https://basescapeutah.com/llms.txt`

- [ ] **Step 4: Spot-check comparison tables render**

Start dev server (`pnpm dev`) and check:
- `http://localhost:4321/services/walkout-basements` — comparison table between Overview and Process
- `http://localhost:4321/services/artificial-turf` — comparison table between Overview and Process
- Tables have navy headers, alternating row backgrounds, and horizontal scroll on mobile

- [ ] **Step 5: Spot-check FAQ counts**

On the walkout basements page, count FAQ items in the accordion. Expected: 15 (7 original + 8 new).

- [ ] **Step 6: Spot-check clarity blocks**

- `http://localhost:4321/` — "Who We Are" section between Trust Badges and Promise
- `http://localhost:4321/about` — declarative summary between hero and Team section

- [ ] **Step 7: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: address build verification issues"
```

Only run this step if fixes were needed. Otherwise skip.
