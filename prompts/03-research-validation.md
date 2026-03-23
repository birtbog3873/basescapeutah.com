# Phase 3: Research Validation

> **Role:** You are a market research analyst validating contractor trade opportunities for a direct-to-residential, in-home-selling startup on the Wasatch Front, Utah. You will use web research to validate or adjust heuristic scores from Phase 2.
>
> **Input files:** `data/first-pass-results.md` (Consideration list ONLY) + `Target Category Profile.md`
> **Output file:** Save your output to `data/candidate-list.md`

---

## Your Task

Research each trade on the Consideration list across 5 key areas. Re-score with validated data. Promote trades scoring 290+ with Big 4 122+ to Candidate status.

---

## Step 1: Prioritize by Score

**Research the highest-scoring trades first.** If you hit context limits or time constraints, the most promising candidates will already be fully researched. Work down the list from highest Phase 2 score to lowest.

---

## Step 2: Research Protocol

For each trade on the Consideration list, research these 5 areas using the specific search queries provided. Document your findings.

### Area 1: Local Competition

**Search queries to use:**
- "[trade] contractors Salt Lake City"
- "[trade] companies Utah County"
- "[trade] [specific city] Utah" (try Provo, Orem, Lehi, Sandy, Draper)
- "[trade] near me" (conceptually — look at Google Maps/Yelp/Thumbtack results for the area)

**What to document:**
- Approximate number of dedicated competitors on the Wasatch Front
- Franchise vs. independent breakdown
- Any dominant players (name, est. size, years in business)
- **Key question:** Does ANY competitor use a dedicated in-home-selling model (appointment setters → in-home consultants → one-call-close)? If no competitors use this model, it's a blue ocean opportunity — note this prominently.

### Area 2: Job Size & Pricing

**Search queries to use:**
- "[trade] average cost 2025"
- "[trade] cost per square foot"
- "how much does [trade] cost"
- Check HomeGuide, Angi, Forbes Home, Fixr, HomeAdvisor cost guides

**What to document:**
- Low / Mid / High price ranges for typical residential jobs
- Average job size for the Wasatch Front (adjust for Utah cost of living if national data)
- How well this maps to the $15K-$25K sweet spot
- Whether jobs can be scoped up (premium materials, add-ons) to reach the sweet spot

### Area 3: Margins

**Search queries to use:**
- "[trade] profit margins"
- "[trade] business profitability"
- "[trade] contractor markup"
- "[trade] material cost percentage"
- Check contractor forums (Reddit r/contractors, ContractorTalk, JLC Online)

**What to document:**
- Typical gross margins (material + labor cost as % of revenue)
- Material cost as % of job vs. labor cost as %
- Whether margins are compressed by competition or protected by differentiation
- Any hidden cost drivers (warranty, callbacks, insurance)

### Area 4: Local Demand & Utah-Specific Factors

**Search queries to use:**
- "[trade] demand trends 2025"
- "[trade] market growth"
- "[trade] Utah" or "[trade] Salt Lake City"

**Utah-specific factors to consider:**
- **Population growth:** Utah is one of the fastest-growing states, especially along the Wasatch Front
- **Housing stock age:** Significant 1970s-1990s tract housing (needs updating), lots of 2010s+ new construction (may need different services), relatively few pre-1960 homes
- **Climate:** Hot dry summers, cold snowy winters, low humidity, high UV exposure
- **Demographics:** Larger-than-average household sizes, family-oriented, homeownership rate above national average
- **Culture:** Strong DIY culture but also willingness to pay for quality; value and trust matter

### Area 5: Licensing & Permits

**Search queries to use:**
- "Utah [trade] contractor license requirements"
- "Utah DOPL [trade]" (Division of Professional Licensing)
- "[trade] permit requirements Utah"

**What to document:**
- Specific Utah license categories needed (S-series specialty, B-100 general, etc.)
- Whether a general contractor license covers this trade or specialty license required
- Permit requirements for typical jobs
- Any specific insurance or bonding requirements

---

## Step 3: Re-Score with Validated Data

For each dimension, compare Phase 2 heuristic score against research findings:

- **If research changes the score:** Note the change as `Phase 2: [old] → Phase 3: [new]` with the specific evidence that drove the change. Example: "Phase 2: 3 → Phase 3: 4. HomeGuide data shows average job size $18K-$22K, squarely in sweet spot. Phase 2 underestimated."

- **If research confirms the score:** Note as `Confirmed [score]. [Source].` Example: "Confirmed 4. Angi cost guide shows 45-55% gross margins, consistent with Phase 2 estimate."

- **If no data found:** Note as `No data found — heuristic retained at [score].`

**Do NOT fabricate data.** "No data found" is an acceptable and expected outcome for some dimensions of some trades. Do not make up statistics, competitor counts, or pricing data.

---

## Step 4: Split — Candidate vs. Dropped

### Candidate (Both conditions must be met)
- Re-scored total weighted score **290+**
- Re-scored Big 4 sub-score **122+**

### Dropped
- Below either threshold

---

## Output Format

### File Header

```markdown
> Phase 3 output | Generated [today's date] | [count] trades researched | [count] Candidates | [count] Dropped

# Research-Validated Candidate List
```

### Per-Candidate Profile

For each Candidate trade (ranked by re-scored total, highest first):

```markdown
### [Trade Name] — Phase 3 Score: [score] / 410 (Phase 2: [old score]) | Big 4: [score] / 175

#### Validated Scorecard

| # | Dimension | Weight | Ph2 | Ph3 | Weighted | Change Notes |
|---|-----------|--------|-----|-----|----------|-------------|
| 1 | Competition Level | 10 | [old] | [new] | [w*new] | [evidence or "Confirmed"] |
| 2 | Average Job Size | 9 | [old] | [new] | [w*new] | [evidence or "Confirmed"] |
| ... | ... | ... | ... | ... | ... | ... |
| | **TOTAL** | **82** | | | **[total]** | |

#### Research Findings

**Local Competition:**
[2-4 sentences. Competitor count, franchise vs independent, dominant players, in-home-selling model presence or absence.]

**Job Size & Pricing:**
[2-4 sentences. Price ranges, average job size, sweet spot alignment. Cite sources.]

**Margins:**
[2-4 sentences. Gross margin data, material vs labor split, margin protection factors. Cite sources.]

**Local Demand & Utah Factors:**
[2-4 sentences. Demand trends, Utah-specific drivers or headwinds.]

**Licensing & Permits:**
[2-4 sentences. Utah license requirements, permit complexity, barriers.]

#### Key Insight

> [1-2 sentence callout: the single most important finding from research that either strengthens or weakens this trade's case]
```

### Dropped Trades Section

Brief format for trades that didn't make the cut:

```markdown
## Dropped Trades

### [Trade Name] — Phase 3 Score: [score] / 410 (Phase 2: [old score])

**Drop reason:** [Total below 290 / Big 4 below 122 / Both]
**Key finding:** [1-2 sentences on the research finding that most changed the picture]
```

---

## Research Quality Rules

1. **Cite your sources.** For any data point that changes a score, name the source (e.g., "HomeGuide 2024 cost guide," "Utah DOPL license lookup," "Google Maps search showing 15+ competitors").

2. **No fabrication.** If you can't find data, say so. "No data found — heuristic retained" is always acceptable.

3. **Utah-specific over national.** Prefer Utah/Wasatch Front data over national averages. If only national data available, note this and consider whether Utah would trend higher or lower.

4. **Recency matters.** Prefer 2024-2025 data over older data. Note the date of any data source.

5. **Triangulate.** For pricing and margins, try to find 2+ sources. If sources conflict, note the range and use the more conservative figure for scoring.

---

## Quality Checklist (Self-Review Before Saving)

Before saving to `data/candidate-list.md`, verify:

- [ ] All Consideration trades from Phase 2 were researched (highest scores first)
- [ ] Each trade has findings for all 5 research areas
- [ ] Score changes are supported by cited evidence
- [ ] No fabricated data — all "no data found" instances are honestly marked
- [ ] Candidate/Dropped split uses both thresholds (total 290+ AND Big 4 122+)
- [ ] Candidate list is 5-10 trades (if outside this range, note and consider threshold adjustment)
- [ ] Phase 2 → Phase 3 score progression is tracked for every dimension
- [ ] Key Insight callout provided for every Candidate
- [ ] Dropped trades have clear drop reason and key finding
