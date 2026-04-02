# Lead Magnets: Retaining Walls & Walkout Basements

**Date:** 2026-04-02
**Status:** Approved
**Services:** Retaining Walls, Walkout Basements

## Overview

Two downloadable PDF guides following Marcus Sheridan's "They Ask, You Answer" Big 5 framework. Each guide provides transparent, mid-funnel content that builds trust and captures leads from homeowners who are interested but not yet ready to book a consultation.

**Goal:** Convert hesitant service page visitors into leads by offering a low-friction email-for-PDF exchange, positioned as a tertiary CTA below the primary conversion paths.

## Content Strategy

### Framework: They Ask, You Answer — Big 5

Each guide covers 4-5 of the Big 5 topics that drive buying decisions:

1. **Cost** — Transparent pricing ranges with what drives cost up/down
2. **Problems** — Honest "what can go wrong" and how to avoid it
3. **Comparisons** — Materials, methods, or approaches compared
4. **Reviews/Best** — Questions to ask contractors (positions BaseScape by implication)
5. **Best of** — Best material/approach for specific situations

### Tone

Transparent and educational — "here's what we'd tell a friend." No hard sell. The CTA page at the end is the only promotional content.

### Format

- 4-6 page focused PDF (Option B — punchier than comprehensive, higher completion rate)
- Parallel structure across both guides for brand consistency
- Email-only capture (lowest friction)

## Lead Magnet 1: Retaining Walls

**Title:** The Utah Homeowner's Guide to Retaining Walls
**Subtitle:** Costs, Materials & What to Expect
**Slug:** `retaining-walls-guide`
**CTA Text:** Download Free Guide

### Content Outline

| Page | Section | Content |
|------|---------|---------|
| 1 | Cover | Title, BaseScape logo, "Free Guide" badge, hero image |
| 2 | What Does a Retaining Wall Cost? | Price ranges by wall height and linear footage ($5K-$50K). What drives cost up/down (site access, soil conditions, drainage complexity, wall height, material choice). "Why the range is so wide" transparency section. |
| 3 | Materials Compared | Segmental block vs. poured concrete vs. natural stone vs. timber. For each: pros, cons, lifespan, relative cost tier, best use case. |
| 4 | Common Problems & How to Avoid Them | Drainage failures (#1 cause of wall failure), frost heave, improper compaction, missing permits, cutting corners on geogrid. Honest "what can go wrong" with prevention tips. |
| 5 | What to Expect: The Process | Site assessment, engineering, permits, excavation, build, backfill/drainage, final grade. Timeline expectations (1-3 weeks typical). |
| 6 | Questions to Ask Any Contractor | 8-10 questions: licensed/insured?, engineer-designed?, drainage plan included?, permits included in bid?, warranty terms?, using subcontractors?, references for similar projects?, timeline guarantee? |
| 7 | CTA Page | "Ready to Get an Estimate?" Phone number + link to /contact. Brief BaseScape intro: licensed, bonded, insured, Utah-based. |

## Lead Magnet 2: Walkout Basements

**Title:** The Utah Homeowner's Guide to Walkout Basements
**Subtitle:** Costs, ROI & What to Expect
**Slug:** `walkout-basements-guide`
**CTA Text:** Download Free Guide

### Content Outline

| Page | Section | Content |
|------|---------|---------|
| 1 | Cover | Title, BaseScape logo, "Free Guide" badge, hero image |
| 2 | What Does a Walkout Basement Cost? | Price ranges ($50K-$100K). What drives cost (foundation type, slope grade, drainage requirements, finish level). "Why this is a major investment — and why it pays off." |
| 3 | The ROI Case | Property value increase ($70K+). ADU rental income potential. Utah ADU laws (HB 398, SB 174, "the Stove Rule"). How walkouts compare to standard basement finishes for resale value. |
| 4 | Common Problems & How to Avoid Them | Waterproofing failures, structural concerns with cutting foundation walls, drainage grading mistakes, permit/inspection issues, contractor inexperience with structural work. |
| 5 | What to Expect: The Process | Consultation, structural engineering, permits, excavation, foundation cut, framing, waterproofing, drainage, finishes. Timeline (6-12 weeks typical). |
| 6 | Questions to Ask Any Contractor | 8-10 questions: structural engineer on staff?, waterproofing warranty?, permit timeline estimate?, how many walkouts completed?, insurance coverage for foundation work?, drainage engineering plan?, references? |
| 7 | CTA Page | "Ready to Get an Estimate?" Phone number + link to /contact. Brief BaseScape intro: licensed, bonded, insured, Utah-based. |

## Page Placement

Lead magnet CTAs are positioned as the **tertiary conversion opportunity** on each service page, below both primary CTAs:

```
1. Hero CTA (Book Appointment + Call)
2. Service content (anxiety stack, FAQs, process, etc.)
3. Bottom CTABlock (Book Appointment + Call — existing)
4. Lead Magnet CTA — "Not ready yet? Download our free guide"
   (catches scroll-to-bottom-but-didn't-convert visitors)
```

**Rationale:** The lead magnet must not compete with the primary booking CTAs. It only appears after the homeowner has passed two opportunities to book. Visitors who reach this point are interested but hesitant — exactly the audience a free guide converts.

## Technical Implementation

### PDF Hosting

- Upload PDFs to the CMS via the existing `LeadMagnets` collection
- Files stored on Cloudflare R2 (existing media storage)
- Two CMS records, one per guide:
  - `title`, `slug`, `description`, `file` (PDF upload), `thumbnailImage` (optional), `ctaText`: "Download Free Guide", `requiredFields`: [email], `status`: published

### Capture Form

- Uses existing `LeadMagnetForm.tsx` React component
- **Email-only** (lowest friction — no name field required)
- Honeypot spam protection (already implemented)
- Source/UTM tracking (already implemented)

### Delivery

- **Immediate:** Download link shown in success state after form submission
- **Email:** Wire existing `lead-magnet-delivery.ts` template into `afterLeadCreate` hook
  - Currently the hook only fires for confirmation + team notification emails
  - Add condition: if `formType === 'lead-magnet'`, also send the delivery email
  - Subject: "Your free guide: [title]"
  - Body: Greeting, guide title/description, download button, consultation CTA

### Display Component

- Uses existing `LeadMagnetCTA.astro` component on service pages
- Headline: "Not Ready Yet? Get Our Free Guide"
- Shows thumbnail, title, description, download button
- Rendered inside a new section below the existing bottom CTABlock

### Service Page Changes

Two service pages need the lead magnet CTA added:
- `site/src/pages/services/retaining-walls.astro` — reference retaining walls guide
- `site/src/pages/services/walkout-basements.astro` — reference walkout basements guide

### GA4 Tracking

- `lead_magnet_submit` event already fires on form submission (existing)
- Already configured as a key event in GA4 (existing)

### Blog Integration

- Existing `leadMagnetCTA` relationship field on BlogPosts collection
- Any future blog post about retaining walls or walkout basements can reference the corresponding guide

## What We're NOT Building

- **No drip email sequence** — wait for real appointment data to inform follow-up content
- **No gated landing pages** — service page inline CTA is sufficient for now
- **No A/B testing** of form fields or placement
- **No name field requirement** — email-only for lowest friction
- **No interactive calculators** — future iteration once pricing data is available from real estimates

## PDF Creation

Content will be generated as markdown. Final PDF design can be produced in Canva or generated via Gemini image MCP for a quick branded version. The PDF files are then uploaded to the CMS.

## Success Metrics

- Lead magnet form submissions (tracked via `lead_magnet_submit` GA4 event)
- Email capture rate on service pages (submissions / page views)
- Downstream conversion: lead magnet leads that eventually book a consultation
