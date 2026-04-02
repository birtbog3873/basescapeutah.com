# Lead Magnets Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add lead magnet CTAs to the retaining walls and walkout basements service pages, and wire up the email delivery for lead magnet form submissions.

**Architecture:** The lead magnet infrastructure (CMS collection, form component, server action, email template) already exists. This plan adds: (1) a `leadMagnet` prop to `ServiceLayout` so service pages can pass lead magnet data, (2) the `LeadMagnetCTA` + `LeadMagnetForm` rendering in the layout below the existing CTABlock, and (3) lead magnet email delivery wired into the `afterLeadCreate` hook.

**Tech Stack:** Astro 5.x, React 19, Payload CMS 3.x, TypeScript

**Spec:** `docs/superpowers/specs/2026-04-02-lead-magnets-design.md`

---

### Task 1: Add lead magnet section to ServiceLayout

**Files:**
- Modify: `site/src/layouts/ServiceLayout.astro:1-217`

This task adds an optional lead magnet section below the Trust + CTA block. The lead magnet only renders when the `service` object has a `leadMagnet` property.

- [ ] **Step 1: Add LeadMagnetCTA and LeadMagnetForm imports**

At the top of `ServiceLayout.astro`, add the two new imports after the existing imports (after line 8):

```astro
import LeadMagnetCTA from '../components/content/LeadMagnetCTA.astro'
import LeadMagnetForm from '../components/forms/LeadMagnetForm.tsx'
```

- [ ] **Step 2: Add the lead magnet section below the Trust + CTA block**

After the closing `</section>` tag of the Trust + CTA block (after line 216), add a new conditional section:

```astro
  <!-- Lead Magnet CTA (tertiary — below both booking CTAs) -->
  {service.leadMagnet && (
    <section class="service-section">
      <div class="service-section__inner service-section__inner--narrow">
        <div class="lead-magnet-section">
          <p class="lead-magnet-section__intro">Not ready to schedule yet? No pressure.</p>
          <LeadMagnetCTA
            title={service.leadMagnet.title}
            description={service.leadMagnet.description}
            ctaText={service.leadMagnet.ctaText || 'Download Free Guide'}
            leadMagnetId={service.leadMagnet.id}
          />
          <div id={`lead-magnet-${service.leadMagnet.id}`} class="lead-magnet-section__form">
            <LeadMagnetForm
              client:visible
              leadMagnetId={service.leadMagnet.id}
              ctaText={service.leadMagnet.ctaText || 'Download Free Guide'}
            />
          </div>
        </div>
      </div>
    </section>
  )}
```

- [ ] **Step 3: Add styles for the lead magnet section**

Add these styles inside the existing `<style>` block in ServiceLayout.astro (before the closing `</style>` tag):

```css
  .lead-magnet-section {
    text-align: center;
  }

  .lead-magnet-section__intro {
    font-family: var(--font-serif);
    font-weight: 700;
    font-variation-settings: "WONK" 0, "SOFT" 100;
    font-size: clamp(1.25rem, 2vw + 0.5rem, 1.75rem);
    line-height: 1.2;
    color: var(--color-textPrimary);
    margin-bottom: var(--size-4);
  }

  .lead-magnet-section__form {
    max-width: 480px;
    margin-inline: auto;
    margin-top: var(--size-5);
  }
```

- [ ] **Step 4: Verify the build passes**

Run: `cd /Users/stevenbunker/clients/general-contracting && pnpm build`

Expected: Build succeeds. No lead magnet sections render yet (no service pages pass the prop).

- [ ] **Step 5: Commit**

```bash
git add site/src/layouts/ServiceLayout.astro
git commit -m "feat: add optional lead magnet section to ServiceLayout"
```

---

### Task 2: Add lead magnet data to retaining walls service page

**Files:**
- Modify: `site/src/pages/services/retaining-walls.astro:1-64`

This task adds the lead magnet metadata to the retaining walls service page. The data is hardcoded in the fallback object for now (CMS records will be created separately when PDFs are uploaded).

- [ ] **Step 1: Add lead magnet data to the fallback service object**

In `retaining-walls.astro`, add a `leadMagnet` property to the fallback service object (after the `seo` block, before the closing `}` on line 62):

```typescript
    leadMagnet: {
      id: 'retaining-walls-guide',
      title: 'The Utah Homeowner\'s Guide to Retaining Walls',
      description: 'Costs, materials, common problems, and questions to ask any contractor — so you can make an informed decision.',
      ctaText: 'Download Free Guide',
    },
```

- [ ] **Step 2: Verify the build passes and the section renders**

Run: `cd /Users/stevenbunker/clients/general-contracting && pnpm build`

Expected: Build succeeds. The retaining walls page now includes the lead magnet section below the Trust + CTA block.

- [ ] **Step 3: Commit**

```bash
git add site/src/pages/services/retaining-walls.astro
git commit -m "feat: add lead magnet CTA to retaining walls service page"
```

---

### Task 3: Add lead magnet data to walkout basements service page

**Files:**
- Modify: `site/src/pages/services/walkout-basements.astro`

Same pattern as Task 2, for walkout basements.

- [ ] **Step 1: Read the current walkout basements file**

Read `site/src/pages/services/walkout-basements.astro` to find the fallback service object's closing brace.

- [ ] **Step 2: Add lead magnet data to the fallback service object**

Add a `leadMagnet` property after the `seo` block, before the closing `}`:

```typescript
    leadMagnet: {
      id: 'walkout-basements-guide',
      title: 'The Utah Homeowner\'s Guide to Walkout Basements',
      description: 'Costs, ROI, ADU potential, common problems, and questions to ask any contractor — so you can move forward with confidence.',
      ctaText: 'Download Free Guide',
    },
```

- [ ] **Step 3: Verify the build passes**

Run: `cd /Users/stevenbunker/clients/general-contracting && pnpm build`

Expected: Build succeeds. Both service pages now render the lead magnet section.

- [ ] **Step 4: Commit**

```bash
git add site/src/pages/services/walkout-basements.astro
git commit -m "feat: add lead magnet CTA to walkout basements service page"
```

---

### Task 4: Wire lead magnet delivery email into afterLeadCreate hook

**Files:**
- Modify: `cms/src/hooks/afterLeadCreate.ts:1-142`

This task adds a conditional branch to the existing `afterLeadCreate` hook: when `formType === 'lead-magnet'`, send the delivery email instead of the standard confirmation email. Team notification and Google Sheets webhook still fire for all leads.

- [ ] **Step 1: Add the import for the lead magnet email generator**

At the top of `afterLeadCreate.ts`, add the import after line 3:

```typescript
import { generateLeadMagnetDeliveryEmail, generateLeadMagnetDeliverySubject } from '../email/lead-magnet-delivery'
```

- [ ] **Step 2: Replace the homeowner confirmation email block with a conditional**

Replace the homeowner confirmation email block (lines 32-62) with this code that branches on `formType`:

```typescript
  // Send homeowner email (confirmation or lead magnet delivery)
  if (doc.email) {
    try {
      if (doc.formType === 'lead-magnet') {
        // Fetch lead magnet details for email
        let leadMagnetTitle = 'Your Free Guide'
        let leadMagnetDescription = ''
        let downloadUrl = ''
        try {
          const leadMagnets = await req.payload.find({
            collection: 'lead-magnets',
            where: { status: { equals: 'published' } },
            limit: 100,
          })
          // Match by source page URL containing the service slug
          const sourcePage = doc.source?.page || ''
          const match = leadMagnets.docs?.find((lm: any) => {
            return sourcePage.includes(lm.slug?.replace('-guide', ''))
          })
          if (match) {
            leadMagnetTitle = match.title
            leadMagnetDescription = match.description || ''
            downloadUrl = match.file?.url || ''
          }
        } catch {
          // Continue with defaults
        }

        const html = generateLeadMagnetDeliveryEmail({
          name: doc.name || undefined,
          leadMagnetTitle,
          downloadUrl,
          description: leadMagnetDescription,
          businessPhone,
          businessName,
        })

        await req.payload.sendEmail({
          to: doc.email,
          from: `${businessName} <noreply@basescape.com>`,
          replyTo: 'hello@basescape.com',
          subject: generateLeadMagnetDeliverySubject(leadMagnetTitle),
          html,
        })
      } else {
        // Standard confirmation email
        const confirmation = generateConfirmationEmail({
          name: doc.name || 'Homeowner',
          serviceType: doc.serviceType,
          phone: businessPhone,
          businessName,
        })

        await req.payload.sendEmail({
          to: doc.email,
          from: `${businessName} <noreply@basescape.com>`,
          replyTo: 'hello@basescape.com',
          subject: confirmation.subject,
          html: confirmation.html,
        })
      }

      await req.payload.update({
        collection: 'leads',
        id: doc.id,
        data: { confirmationSentAt: new Date().toISOString() },
      })
    } catch (error) {
      req.payload.logger.error({
        msg: 'Failed to send homeowner email',
        leadId: doc.id,
        formType: doc.formType,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
```

- [ ] **Step 3: Verify the CMS builds**

Run: `cd /Users/stevenbunker/clients/general-contracting && pnpm --filter cms build`

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 4: Commit**

```bash
git add cms/src/hooks/afterLeadCreate.ts
git commit -m "feat: wire lead magnet delivery email into afterLeadCreate hook"
```

---

### Task 5: Write lead magnet PDF content (retaining walls)

**Files:**
- Create: `docs/lead-magnets/retaining-walls-guide.md`

This task writes the markdown content for the retaining walls PDF guide. This content will be designed in Canva or similar and uploaded to the CMS as a PDF.

- [ ] **Step 1: Create the content directory**

```bash
mkdir -p docs/lead-magnets
```

- [ ] **Step 2: Write the retaining walls guide content**

Create `docs/lead-magnets/retaining-walls-guide.md`:

```markdown
# The Utah Homeowner's Guide to Retaining Walls

**Costs, Materials & What to Expect**

*A free resource from BaseScape — Licensed, Bonded & Insured*

---

## What Does a Retaining Wall Cost?

Retaining wall projects on Utah's Wasatch Front typically range from **$5,000 to $50,000+**. That's a wide range — here's what drives the number:

**Wall height** is the biggest cost factor. A 2-foot garden wall is a fraction of the cost of an 8-foot structural wall. Taller walls require deeper footings, more material, and often structural engineering.

**Total linear footage** determines material volume. A 20-foot wall costs less than a 100-foot wall of the same height.

**Material selection** affects both material and labor costs. Natural stone is the most expensive. Architectural concrete block (Belgard, Pavestone) offers the best balance of durability and cost. Timber is cheapest but has the shortest lifespan.

**Site access** matters more than most homeowners expect. If equipment can't reach the wall location, manual labor increases costs significantly.

**Soil and drainage conditions** can add cost if the site requires extra drainage infrastructure, soil remediation, or retaining systems like geogrid reinforcement.

### Why We Share Pricing

Most contractors won't put numbers on their website. We do because we believe you deserve to know what you're getting into before you pick up the phone. No surprises, no bait-and-switch.

---

## Materials Compared

| Material | Lifespan | Cost | Best For |
|----------|----------|------|----------|
| **Segmental Concrete Block** | 50-75 years | $$ | Most residential walls — durable, versatile, wide style selection |
| **Poured Concrete** | 75-100 years | $$$ | Tall walls, modern aesthetics, maximum structural strength |
| **Natural Stone** | 100+ years | $$$$ | Premium landscapes, organic look, high curb appeal |
| **Timber** | 15-20 years | $ | Short garden walls, budget projects, rustic settings |

**Our recommendation for most Utah homeowners:** Segmental concrete block. It handles freeze-thaw cycles well, comes in dozens of colors and textures, and offers the best value for walls under 6 feet.

---

## Common Problems & How to Avoid Them

### 1. Drainage Failure
**The #1 cause of retaining wall failure.** Without proper drainage behind the wall, water pressure (hydrostatic pressure) builds up and pushes the wall outward. Every wall needs a French drain, gravel backfill, and weep holes.

### 2. Inadequate Footings
A retaining wall is only as strong as what it sits on. Proper footings require excavation below frost depth (36 inches in most of Utah) and a compacted gravel base. Skipping this step leads to settling, cracking, and leaning.

### 3. Missing Geogrid Reinforcement
Walls over 4 feet need geogrid — layers of high-strength mesh buried in the backfill that anchor the wall to the soil behind it. Without geogrid, tall walls lean forward over time.

### 4. No Permits
In most Wasatch Front cities, walls over 4 feet require a building permit and engineered plans. Building without a permit can result in fines, mandatory demolition, or problems when you sell your home.

### 5. Poor Compaction
Every layer of backfill behind the wall must be mechanically compacted. Hand-tamping isn't sufficient. Poorly compacted backfill settles unevenly, creating pressure points that stress the wall.

**The pattern:** Most failures trace back to shortcuts during construction. Proper engineering, drainage, and compaction prevent virtually all retaining wall problems.

---

## What to Expect: The Process

### Step 1: Site Assessment & Design
We evaluate your terrain, soil, drainage patterns, and what you want the wall to accomplish. You'll receive a detailed design with material options, height specifications, and a clear scope of work.

### Step 2: Engineering & Permits
For walls over 4 feet, we provide structural engineering plans stamped by a licensed engineer. We handle all city permits, utility locates, and inspection scheduling. You never visit a permit office.

### Step 3: Excavation & Construction
Foundation preparation, compacted gravel base, drainage system installation, and precision block or stone placement. Every course is leveled and backfilled to engineered specifications.

### Step 4: Finish & Landscape Restoration
Cap installation, final grading, backfill compaction, and landscape integration. Your new wall blends seamlessly with your existing yard and hardscape.

**Typical timeline:** 1 to 3 weeks for most residential retaining walls, depending on wall size and site complexity.

---

## Questions to Ask Any Contractor

Use this checklist when getting estimates. A good contractor will answer these without hesitation:

- [ ] Are you licensed, bonded, and insured in Utah?
- [ ] Will the wall be designed by a structural engineer?
- [ ] What drainage system is included in the bid?
- [ ] Are permits and inspections included in the price?
- [ ] What warranty do you offer on materials and labor?
- [ ] Will you use subcontractors, or is this your own crew?
- [ ] Can you provide references for similar retaining wall projects?
- [ ] What happens if we hit unexpected conditions (rock, water, utilities)?
- [ ] Is the estimate a fixed price or an approximation?
- [ ] What does the cleanup and restoration include?

**Red flag:** If a contractor can't clearly answer the drainage and engineering questions, that tells you something about how they build walls.

---

## Ready to Get an Estimate?

BaseScape specializes in engineered retaining walls across Utah's Wasatch Front. Every wall we build includes proper drainage, engineered footings, and quality materials — because shortcuts aren't worth it.

**Call us:** (888) 414-0007
**Schedule online:** basescapeutah.com/contact

Licensed | Bonded | Insured — Utah Contractor License #14082066-5501

*Free estimates. No pressure. We'll tell you honestly what your project needs.*
```

- [ ] **Step 3: Commit**

```bash
git add docs/lead-magnets/retaining-walls-guide.md
git commit -m "content: add retaining walls lead magnet PDF copy"
```

---

### Task 6: Write lead magnet PDF content (walkout basements)

**Files:**
- Create: `docs/lead-magnets/walkout-basements-guide.md`

- [ ] **Step 1: Write the walkout basements guide content**

Create `docs/lead-magnets/walkout-basements-guide.md`:

```markdown
# The Utah Homeowner's Guide to Walkout Basements

**Costs, ROI & What to Expect**

*A free resource from BaseScape — Licensed, Bonded & Insured*

---

## What Does a Walkout Basement Cost?

Walkout basement conversions on Utah's Wasatch Front typically range from **$50,000 to $100,000+**. This is a major structural project — here's what drives the investment:

**Foundation type** is the primary factor. Poured concrete foundations are more straightforward to cut than block foundations, which require more structural reinforcement after opening.

**Slope grade** determines how much excavation is needed. A lot with existing grade change requires less earthwork than a flat lot where you need to create the walkout elevation.

**Drainage requirements** vary by site. Proper waterproofing, French drains, and grading are non-negotiable for a below-grade opening — and more complex sites cost more.

**Finish level** inside the walkout space affects total cost. A basic shell (framed, insulated, drywall-ready) is significantly less than a fully finished living space with bathroom, kitchenette, and flooring.

### Why This Investment Pays Off

A walkout basement isn't just a renovation — it's one of the highest-ROI improvements you can make to a Utah home. You're adding livable square footage, natural light, and direct outdoor access to space that's already under your roof. More on the ROI in the next section.

---

## The ROI Case for Walkout Basements

### Property Value Increase
A walkout basement conversion can add **$70,000 or more** to your home's value. Above-grade square footage (which a walkout creates) is valued significantly higher than below-grade space by appraisers and buyers.

### ADU Rental Income
Utah's ADU-friendly laws make walkout basements ideal rental units:

- **HB 398** allows internal ADUs (like basement apartments) in all residential zones statewide
- **SB 174** requires cities to allow at least one ADU type per lot
- **"The Stove Rule"** — a space with a separate entrance, kitchen, and bathroom qualifies as an ADU

A walkout basement with a separate entrance is the most natural ADU configuration. Rental income on the Wasatch Front for a 1-bed basement unit ranges from **$900 to $1,500/month** depending on location and finish.

### Compared to Standard Basement Finishes
A standard basement finish adds value, but a walkout conversion adds significantly more because:
- Natural light transforms the space from "basement" to "living area"
- Direct outdoor access makes the space independently usable
- ADU potential creates income that a standard finish cannot
- Appraisers value above-grade square footage 2-3x higher than below-grade

---

## Common Problems & How to Avoid Them

### 1. Waterproofing Failures
**The biggest risk in any below-grade opening.** Cutting into a foundation wall creates a new path for water. Every walkout requires exterior waterproofing membrane, proper drainage tile, and carefully engineered grading away from the opening.

### 2. Structural Concerns
You're cutting a hole in a load-bearing wall. This requires a structural engineer to design the header beam, support columns, and any reinforcement needed to maintain the foundation's integrity. Never let anyone cut a foundation without stamped engineering plans.

### 3. Drainage Grading Mistakes
The walkout area must drain away from the opening, not toward it. This seems obvious, but incorrect grading is one of the most common issues we see on DIY or poorly planned walkouts. A 2% minimum slope away from the opening is standard.

### 4. Permit and Inspection Issues
A walkout conversion requires building permits, structural engineering, and multiple inspections. Skipping permits creates legal liability, insurance problems, and complications when you sell. If you're building an ADU, additional requirements (egress, fire separation, utilities) apply.

### 5. Contractor Inexperience
Walkout basements require a combination of structural engineering, excavation, foundation work, waterproofing, and finish carpentry. Many contractors are strong in one area but weak in others. Look for a contractor who has completed multiple walkout conversions, not just standard basement finishes.

**The pattern:** Walkout problems almost always trace back to inadequate engineering or waterproofing. These are the two areas where you cannot afford shortcuts.

---

## What to Expect: The Process

### Step 1: Consultation & Feasibility Assessment
We evaluate your foundation type, lot slope, soil conditions, and zoning requirements. Not every basement is a candidate for a walkout — we'll tell you honestly if yours is.

### Step 2: Structural Engineering
A licensed structural engineer designs the opening: header beam specifications, support column placement, foundation reinforcement, and load path analysis. You receive stamped plans.

### Step 3: Permits & Approvals
BaseScape handles all permit applications, plan submissions, and inspection scheduling. For ADU conversions, we coordinate any additional zoning or utility requirements.

### Step 4: Excavation & Foundation Work
Exterior excavation to expose the foundation wall, precision cutting of the opening, header beam and support installation, and waterproofing membrane application.

### Step 5: Waterproofing & Drainage
Exterior waterproofing, drainage tile installation, gravel backfill, and finish grading. This is the most critical phase for long-term performance.

### Step 6: Framing, Finishing & Restoration
Door and window installation, interior framing, insulation, and finishes. Exterior landscape restoration and walkout area grading.

**Typical timeline:** 6 to 12 weeks depending on scope and finish level. The structural and waterproofing phases take 2-3 weeks; finishing takes the remainder.

---

## Questions to Ask Any Contractor

Use this checklist when evaluating contractors for a walkout basement project:

- [ ] Do you have a structural engineer on staff or on retainer?
- [ ] How many walkout basement conversions have you completed?
- [ ] What waterproofing system do you use, and what's the warranty?
- [ ] How do you handle drainage around the new opening?
- [ ] Are permits and engineering included in your bid?
- [ ] What's your timeline for the structural phase vs. the finish phase?
- [ ] Do you carry insurance that covers foundation and structural work?
- [ ] Can you provide references for similar walkout projects?
- [ ] What happens if the foundation reveals unexpected conditions?
- [ ] Will you handle ADU compliance if we want a rental unit?

**Red flag:** If a contractor hasn't done walkout conversions specifically (not just basement finishes), they may not have the structural and waterproofing expertise this project requires.

---

## Ready to Get an Estimate?

BaseScape specializes in walkout basement conversions across Utah's Wasatch Front. We bring structural engineering expertise, proper waterproofing systems, and full permit management to every project — because a walkout is only as good as its engineering.

**Call us:** (888) 414-0007
**Schedule online:** basescapeutah.com/contact

Licensed | Bonded | Insured — Utah Contractor License #14082066-5501

*Free estimates. No pressure. We'll tell you honestly if your basement is a good candidate.*
```

- [ ] **Step 2: Commit**

```bash
git add docs/lead-magnets/walkout-basements-guide.md
git commit -m "content: add walkout basements lead magnet PDF copy"
```

---

### Task 7: Visual QA in browser

**Files:** None (verification only)

- [ ] **Step 1: Start the dev server**

Run: `cd /Users/stevenbunker/clients/general-contracting && pnpm dev`

- [ ] **Step 2: Check retaining walls page**

Navigate to `http://localhost:4321/services/retaining-walls`

Verify:
- Hero CTA (Book Appointment + Call) renders at top
- Service content displays normally
- Trust + CTA block renders at bottom with Book Appointment + Call
- Lead magnet section renders BELOW the Trust + CTA block
- "Not ready to schedule yet? No pressure." heading appears
- LeadMagnetCTA card shows title, description, download button
- Clicking "Download Free Guide" scrolls to the form
- LeadMagnetForm renders with email field and submit button

- [ ] **Step 3: Check walkout basements page**

Navigate to `http://localhost:4321/services/walkout-basements`

Verify same structure as retaining walls with walkout-specific content.

- [ ] **Step 4: Check other service pages are unaffected**

Navigate to any other service page (e.g., `http://localhost:4321/services/egress-windows`).

Verify: No lead magnet section appears (no `leadMagnet` prop passed).
