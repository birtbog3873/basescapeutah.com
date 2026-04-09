# Meta Ads Campaign Setup — BaseScape

> **Date:** 2026-04-03 | Steven Bunker, AchieveCMO
> **Client:** BaseScape (basescapeutah.com)
> **Market:** Wasatch Front, Utah
> **Source spec:** `docs/superpowers/specs/2026-04-03-meta-ads-offer-angles-design.md`

---

## Campaign Architecture (Low-Budget)

At $20/day total, we use the **single ad set structure** per the low-budget playbook. Splitting across 5 ad sets would leave each at $2/day — none would ever exit Meta's Learning Phase.

```
Campaign: BaseScape — Walkout Basements (Leads objective, $10/day CBO)
└── Ad Set: Broad — All Angles
    ├── Ad 1: Rental Income
    ├── Ad 2: Home Value
    ├── Ad 3: Dark Basement
    ├── Ad 4: Space Without Moving
    └── Ad 5: Curiosity

Campaign: BaseScape — Retaining Walls (Leads objective, $10/day CBO)
└── Ad Set: Broad — All Angles
    ├── Ad 1: Spring Erosion
    ├── Ad 2: Unusable Yard
    ├── Ad 3: Failing Wall
    ├── Ad 4: Cost Transparency
    └── Ad 5: Licensed GC vs Landscaper
```

Meta's algorithm will naturally allocate more spend to higher-performing ads within each ad set.

---

## Shared Settings

| Setting | Value |
|---------|-------|
| **Campaign objective** | Leads (Instant Forms) |
| **Budget type** | Campaign Budget Optimization (CBO) |
| **Location** | Salt Lake County + Utah County + Davis County (25-mile radius from SLC) |
| **Age** | 30–60 |
| **Homeowners** | Yes (demographic targeting) |
| **Placements** | Facebook Feed + Facebook Marketplace (manual) |
| **Exclusions** | Renters, real estate agents, contractors |
| **Audience** | Broad (no interest targeting — let creative do the work) |
| **Optimization** | Leads |

---

## Walkout Basement Ads (5)

### Ad 1: Rental Income

| Field | Copy | Chars |
|-------|------|-------|
| **Primary Text** | Utah homeowners earn $1,200–$1,800/mo renting their basements. A walkout entrance makes it a legal ADU. See if your home qualifies. | 125 |
| **Headline** | Could Your Basement Be Earning Rent? | 37 |
| **Description** | Free eligibility check | 22 |
| **CTA** | Learn More | — |

**Image:** `walkout-01-rental-income.png`
**Instant Form:** "Is Your Basement ADU-Eligible?" (see Form Specs below)

---

### Ad 2: Home Value

| Field | Copy | Chars |
|-------|------|-------|
| **Primary Text** | One project. $25K–$40K in. $60K–$80K in added home value. A walkout entrance is Utah's highest-ROI home improvement. | 116 |
| **Headline** | The Renovation That Pays for Itself | 35 |
| **Description** | Free feasibility check | 22 |
| **CTA** | Get Details | — |

**Image:** `walkout-02-home-value.png`
**Instant Form:** "Free Walkout Feasibility Check" (see Form Specs below)

---

### Ad 3: Dark Basement

| Field | Copy | Chars |
|-------|------|-------|
| **Primary Text** | Your basement doesn't have to feel like a cave. A walkout entrance brings natural light, fresh air, and direct outdoor access. | 125 |
| **Headline** | Dark Basement? Not Anymore. | 27 |
| **Description** | Free home assessment | 20 |
| **CTA** | Learn More | — |

**Image:** `walkout-03-dark-basement.png`
**Instant Form:** "Is a Walkout Possible for Your Home?" (see Form Specs below)

---

### Ad 4: Space Without Moving

| Field | Copy | Chars |
|-------|------|-------|
| **Primary Text** | Need more room but love your neighborhood? A walkout basement creates a new floor of livable space — no moving required. | 120 |
| **Headline** | More Space. Same House. | 23 |
| **Description** | Takes just 2 minutes | 20 |
| **CTA** | Check Eligibility | — |

**Image:** `walkout-04-space.png`
**Instant Form:** "Is a Walkout Possible?" (see Form Specs below)

---

### Ad 5: Curiosity

| Field | Copy | Chars |
|-------|------|-------|
| **Primary Text** | Most Utah homeowners don't know you can add a walkout entrance to an existing basement. No addition. No new foundation. | 119 |
| **Headline** | Yes, You Can Do That. | 21 |
| **Description** | Free info, no strings | 21 |
| **CTA** | See How It Works | — |

**Image:** `walkout-05-curiosity.png`
**Instant Form:** "How Walkout Basements Work" (see Form Specs below)

---

## Retaining Wall Ads (5)

### Ad 6: Spring Erosion

| Field | Copy | Chars |
|-------|------|-------|
| **Primary Text** | Every spring, Utah's freeze-thaw cycle takes another piece of your yard. A retaining wall stops erosion permanently — not just one season. | 125 |
| **Headline** | Snowmelt Is Eating Your Yard | 28 |
| **Description** | Free on-site assessment | 23 |
| **CTA** | Get Free Assessment | — |

**Image:** `wall-06-spring-erosion.png`
**Instant Form:** "Free Erosion Assessment" (see Form Specs below)

---

### Ad 7: Unusable Yard

| Field | Copy | Chars |
|-------|------|-------|
| **Primary Text** | That slope in your backyard isn't "just how it is." A retaining wall turns unusable hillside into flat, usable outdoor space. | 124 |
| **Headline** | Turn Your Slope Into Usable Yard | 32 |
| **Description** | Free yard assessment | 20 |
| **CTA** | See What's Possible | — |

**Image:** `wall-07-unusable-yard.png`
**Instant Form:** "Free Yard Assessment" (see Form Specs below)

---

### Ad 8: Failing Wall

| Field | Copy | Chars |
|-------|------|-------|
| **Primary Text** | A leaning retaining wall isn't just ugly — it's a liability. The repair bill triples if you wait for it to collapse. | 115 |
| **Headline** | Is Your Retaining Wall Failing? | 31 |
| **Description** | Free wall inspection | 20 |
| **CTA** | Get Free Inspection | — |

**Image:** `wall-08-failing-wall.png`
**Instant Form:** "Free Wall Inspection" (see Form Specs below)

---

### Ad 9: Cost Transparency

| Field | Copy | Chars |
|-------|------|-------|
| **Primary Text** | How much does a retaining wall cost in Utah? Most run $150–$500 per linear foot. Get a real number for your property — free. | 123 |
| **Headline** | What Does a Retaining Wall Cost? | 31 |
| **Description** | Free ballpark estimate | 22 |
| **CTA** | Get My Estimate | — |

**Image:** `wall-09-cost.png`
**Instant Form:** "Free Ballpark Estimate" (see Form Specs below)

---

### Ad 10: Licensed GC vs Landscaper

| Field | Copy | Chars |
|-------|------|-------|
| **Primary Text** | Your neighbor hired a landscaper for their wall. Looked great for 2 years. Now it's leaning. Walls over 4 ft need permits. | 122 |
| **Headline** | Read This Before Hiring a Landscaper | 36 |
| **Description** | Free contractor guide | 21 |
| **CTA** | Get the Guide | — |

**Image:** `wall-10-gc-vs-landscaper.png`
**Instant Form:** "Retaining Wall Hiring Guide" (see Form Specs below)

---

## Instant Form Specs

### Walkout Basement Forms

#### Form 1: "Is Your Basement ADU-Eligible?" (Rental Income angle)
- **Type:** Higher Intent
- **Intro:** "Answer 4 quick questions to see if your basement qualifies for a legal rental unit under Utah law."
- **Fields:**
  1. How old is your home? (dropdown: Under 10 years / 10–30 years / 30+ years)
  2. What type of basement do you have? (dropdown: Full unfinished / Full finished / Partial / Not sure)
  3. Zip code (short text, required)
  4. Email (prefilled from Meta)
  5. Phone (prefilled from Meta)
- **Privacy policy:** Link to basescapeutah.com/privacy
- **Thank-you screen:**
  - Headline: "Thanks! We'll check your eligibility."
  - Description: "A BaseScape specialist will call you within 1 business day with your results."
  - CTA: "Visit Our Website" → basescapeutah.com/services/walkout-basements

#### Form 2: "Free Walkout Feasibility Check" (Home Value angle)
- **Type:** Higher Intent
- **Intro:** "Find out if a walkout entrance is possible for your home — and what it could add to your property value."
- **Fields:**
  1. Name (prefilled)
  2. Email (prefilled)
  3. Phone (prefilled)
  4. When are you thinking of selling? (dropdown: Within 1 year / 1–3 years / 3+ years / Not selling, building equity)
- **Thank-you screen:**
  - Headline: "We'll be in touch!"
  - Description: "A BaseScape specialist will call to discuss your home's walkout potential and ROI."
  - CTA: "Visit Our Website" → basescapeutah.com/services/walkout-basements

#### Form 3: "Is a Walkout Possible for Your Home?" (Dark Basement angle)
- **Type:** More Volume
- **Intro:** "3 quick questions to see if your home is a candidate for a walkout entrance."
- **Fields:**
  1. What type of home? (dropdown: Single-family / Townhome / Duplex / Other)
  2. Does your lot slope? (dropdown: Yes, slopes down in back / Yes, slopes down on side / Flat lot / Not sure)
  3. Zip code (short text)
- **Conditional:** If "Flat lot" → show message: "Flat lots can sometimes work — we'll need to take a look. Leave your info below."
- **Follow-up fields:**
  4. Email (prefilled)
  5. Phone (prefilled)
- **Thank-you screen:**
  - Headline: "Got it! Here's what happens next."
  - Description: "We'll review your info and reach out within 1 business day."
  - CTA: "Learn More" → basescapeutah.com/services/walkout-basements

#### Form 4: "Is a Walkout Possible?" (Space Without Moving angle)
- **Type:** More Volume
- **Intro:** "See if you can unlock the hidden space in your basement — takes 2 minutes."
- **Fields:**
  1. What type of home? (dropdown: Single-family / Townhome / Duplex / Other)
  2. Does your lot slope? (dropdown: Yes, slopes down in back / Yes, slopes down on side / Flat lot / Not sure)
  3. Zip code (short text)
  4. Email (prefilled)
- **Thank-you screen:**
  - Headline: "We'll check your home's potential!"
  - Description: "A BaseScape specialist will follow up within 1 business day."
  - CTA: "Visit Our Website" → basescapeutah.com/services/walkout-basements

#### Form 5: "How Walkout Basements Work" (Curiosity angle)
- **Type:** More Volume
- **Intro:** "Get a quick 1-page guide explaining how walkout basement conversions work — delivered to your inbox."
- **Fields:**
  1. Email (prefilled)
- **Thank-you screen:**
  - Headline: "Check your inbox!"
  - Description: "Your walkout guide is on its way. Questions? We're here to help."
  - CTA: "Visit Our Website" → basescapeutah.com/services/walkout-basements
- **Follow-up:** Automated email with PDF explainer + 3-email nurture sequence

### Retaining Wall Forms

#### Form 6: "Free Erosion Assessment" (Spring Erosion angle)
- **Type:** Higher Intent
- **Intro:** "Tell us about your situation and we'll schedule a free on-site erosion assessment."
- **Fields:**
  1. Name (prefilled)
  2. Phone (prefilled)
  3. Zip code (short text)
  4. Describe your situation (optional long text, placeholder: "e.g., slope washing out, soil erosion near foundation...")
- **Thank-you screen:**
  - Headline: "We'll call to schedule your assessment."
  - Description: "A licensed BaseScape contractor will reach out within 1 business day."
  - CTA: "Visit Our Website" → basescapeutah.com/services/retaining-walls

#### Form 7: "Free Yard Assessment" (Unusable Yard angle)
- **Type:** Higher Intent
- **Intro:** "Tell us what you'd do with a flat yard and we'll show you what's possible."
- **Fields:**
  1. Name (prefilled)
  2. Phone (prefilled)
  3. Zip code (short text)
  4. What would you use the space for? (dropdown: Patio / Kids' play area / Flat lawn / Garden / Firepit / Other)
- **Thank-you screen:**
  - Headline: "Let's make it happen."
  - Description: "We'll call to schedule a free yard assessment at your property."
  - CTA: "Visit Our Website" → basescapeutah.com/services/retaining-walls

#### Form 8: "Free Wall Inspection" (Failing Wall angle)
- **Type:** Higher Intent
- **Intro:** "A free structural inspection by a licensed Utah general contractor. Tell us what you're seeing."
- **Fields:**
  1. Name (prefilled)
  2. Phone (prefilled)
  3. Zip code (short text)
  4. What are you seeing? (dropdown: Leaning / Cracking / Bulging / Water damage / Multiple issues / Not sure)
- **Thank-you screen:**
  - Headline: "Priority callback scheduled."
  - Description: "Wall failures are time-sensitive. We'll reach out within 1 business day."
  - CTA: "Visit Our Website" → basescapeutah.com/services/retaining-walls

#### Form 9: "Free Ballpark Estimate" (Cost Transparency angle)
- **Type:** Higher Intent
- **Intro:** "Get a ballpark cost estimate for your retaining wall — free, no pressure."
- **Fields:**
  1. Name (prefilled)
  2. Phone (prefilled)
  3. Zip code (short text)
  4. Approximate wall length (dropdown: Under 20 ft / 20–50 ft / 50–100 ft / 100+ ft / Not sure)
  5. Approximate wall height (dropdown: Under 4 ft / 4–8 ft / Over 8 ft / Not sure)
- **Thank-you screen:**
  - Headline: "We'll get you a number."
  - Description: "A BaseScape specialist will call with a ballpark estimate based on your inputs."
  - CTA: "Visit Our Website" → basescapeutah.com/services/retaining-walls

#### Form 10: "Retaining Wall Hiring Guide" (Licensed GC vs Landscaper angle)
- **Type:** More Volume
- **Intro:** "Get our free guide: '5 Questions to Ask Before Hiring a Retaining Wall Contractor.'"
- **Fields:**
  1. Email (prefilled)
- **Thank-you screen:**
  - Headline: "Check your inbox!"
  - Description: "Your guide is on the way. Know someone who needs a wall? Share this with them."
  - CTA: "Visit Our Website" → basescapeutah.com/services/retaining-walls
- **Follow-up:** Automated email with PDF guide + 3-email nurture sequence

---

## Budget & Timeline

### Phase 1: Angle Discovery (14 days)

| Campaign | Daily Budget | 14-Day Spend | Ads |
|----------|-------------|-------------|-----|
| Walkout Basements | $10/day | $140 | 5 in 1 ad set |
| Retaining Walls | $10/day | $140 | 5 in 1 ad set |
| **Total** | **$20/day** | **$280** | **10** |

**Day 7 check:** Kill any ad with 0 leads after $10+ spent or CTR below 0.3%.

**Day 14:** Rank all 5 ads per campaign by cost per lead. Pause bottom 3, keep top 2.

### Phase 2: Scale Winners (14 days)

| Campaign | Daily Budget | 14-Day Spend | Ads Running |
|----------|-------------|-------------|-------------|
| Walkout Basements | $10/day | $140 | 2 |
| Retaining Walls | $10/day | $140 | 2 |
| **Total** | **$20/day** | **$280** | **4** |

### Total 30-Day Test: $560

### Graduation to 2-Campaign Architecture

When all three conditions are met:
1. 2–4 weeks of data collected
2. 1–2 ads consistently outperform at or below target CPL
3. Budget can support ≥$25/day per ad set after splitting

Then split into Sandbox (testing, 20% budget) + Scaling (evergreen, 80% budget).

---

## Success Metrics

| Metric | Good | Great | Kill |
|--------|------|-------|------|
| **CPL** (cost per lead) | < $40 | < $20 | > $75 |
| **Form completion rate** | > 30% | > 50% | < 15% |
| **CTR** (link clicks) | > 1.0% | > 2.0% | < 0.5% |

At low budget, **focus on cost per lead** as the primary metric. Ignore CPM and other vanity metrics — sample sizes are too small to be meaningful.

---

## Lead Follow-Up Protocol

| Timeframe | Action |
|-----------|--------|
| < 5 min | Automated text + email: "Thanks [name], we got your request..." |
| < 1 hour | Phone call attempt #1 |
| < 24 hours | Phone call attempt #2 + value email |
| 48 hours | Phone call attempt #3 |
| 72+ hours | Move to email nurture sequence |

---

## Naming Conventions

**Campaigns:**
- `BaseScape — Walkout Basements — Leads — Phase 1`
- `BaseScape — Retaining Walls — Leads — Phase 1`

**Ad Sets:**
- `Broad — All Angles — $10/day`

**Ads:**
- `WB-01 Rental Income — Designed Image`
- `WB-02 Home Value — Designed Image`
- `WB-03 Dark Basement — Designed Image`
- `WB-04 Space — Designed Image`
- `WB-05 Curiosity — Designed Image`
- `RW-01 Spring Erosion — Designed Image`
- `RW-02 Unusable Yard — Designed Image`
- `RW-03 Failing Wall — Designed Image`
- `RW-04 Cost — Designed Image`
- `RW-05 GC vs Landscaper — Designed Image`

---

## Ad Creative Images

All images are 1080x1080 (1:1) designed graphics using BaseScape brand colors. Saved to `docs/meta-ads/images/`.

| Ad | File | Concept |
|----|------|---------|
| WB-01 | `walkout-01-rental-income.png` | Bold text: "Your basement could be paying your mortgage" with "$1,400/mo" callout |
| WB-02 | `walkout-02-home-value.png` | "$25K In → $80K Out" with arrow graphic, "ROI: 200%+" |
| WB-03 | `walkout-03-dark-basement.png` | Split: left dark/gray "BEFORE", right bright/warm "AFTER" |
| WB-04 | `walkout-04-space.png` | Floor plan outline showing "1,200 sq ft of hidden space" |
| WB-05 | `walkout-05-curiosity.png` | Bold text: "Wait... you can DO that?" with simple basement diagram |
| RW-01 | `wall-06-spring-erosion.png` | "How much yard did you lose this spring?" on earthy/green |
| RW-02 | `wall-07-unusable-yard.png` | Split: "SLOPE" (angled lines) → "YOUR NEW YARD" (flat with patio) |
| RW-03 | `wall-08-failing-wall.png` | "Leaning? Cracking? Bulging?" with warning icon |
| RW-04 | `wall-09-cost.png` | "$150–$500/linear ft" pricing graphic with material icons |
| RW-05 | `wall-10-gc-vs-landscaper.png` | "Landscaper vs. Licensed GC — Know the Difference" |
