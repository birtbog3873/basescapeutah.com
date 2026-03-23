# Phase 2: First Pass Heuristic Screening

> **Role:** You are a trade opportunity analyst scoring contractor trades against a weighted rubric for a direct-to-residential, in-home-selling startup on the Wasatch Front, Utah.
>
> **Input files:** `data/master-trade-list.md` + `Target Category Profile.md`
> **Output file:** Save your output to `data/first-pass-results.md`

---

## Your Task

Score every trade from the master list on all 16 dimensions of the Target Category Profile rubric. Split into Rejected and Consideration lists based on score thresholds.

---

## Step 1: Internalize the Rubric

Read `Target Category Profile.md` completely. Pay special attention to:

- **Section 3:** All 16 dimensions with weights and rationale
- **Section 4:** Scoring definitions (1, 3, 5 for each dimension — interpolate for 2 and 4)
- **Section 6:** Blank evaluation template

Understand the business model parameters in Section 2 — every score should reflect fit with THIS specific business model (direct-to-residential, in-home selling, $100K startup, Wasatch Front).

---

## Step 2: Score Calibration Anchors

**Before scoring the full list**, score these 4 calibration trades in full detail. These establish reference points and prevent scoring drift.

### Anchor 1: Residential Painting
- **Expected range:** ~230-260
- **Why this range:** High competition (many painters), commodity risk, but decent job size and year-round work

### Anchor 2: Epoxy Garage Flooring
- **Expected range:** ~310-350
- **Why this range:** Lower competition, good margins (material cost low relative to perceived value), quick 1-2 day installs, strong differentiation potential

### Anchor 3: Fence Installation
- **Expected range:** ~250-290
- **Why this range:** Decent margins, some differentiation possible, but seasonal and moderate competition

### Anchor 4: Basement Finishing
- **Expected range:** ~220-260
- **Why this range:** High job size but very long installation (weeks), complex permitting, high post-sale risk, needs licensed subs

For each anchor, produce a full scorecard (see output format below). If your scores fall significantly outside the expected ranges, re-examine your scoring — your calibration may be off. The ranges are guidelines, not hard rules, but large deviations warrant reflection.

**STOP after calibration anchors.** Present them to Steven for review before proceeding to the full list. If running autonomously, note that the anchors should be reviewed but continue with the full scoring.

---

## Step 3: Score All Trades

Process the master trade list in batches of 10-15 trades.

### Batch Protocol

At the **start of each batch:**
1. Re-read the scoring definitions in Section 4 of the Target Category Profile
2. Remind yourself of the anchor scores as reference points
3. Score each trade on all 16 dimensions

### Scoring Rules

1. **1-sentence reasoning per dimension per trade.** Not a word or two — a real sentence explaining WHY this score.

2. **Conservative default.** When uncertain between adjacent scores (e.g., "is this a 3 or a 4?"), default to the lower score. Phase 3 research will correct upward where warranted.

3. **Use the full 1-5 range.** After each batch, check: did any trade get a 1 on any dimension? Did any get a 5? If no trade in a batch got a 1 or 5 on at least one dimension, go back and reassess — you're likely compressing toward the center.

4. **Dimension 16 (Visibility of Work)** has weight 0. Score it if you want, but it won't affect totals.

5. **Score what you know.** For dimensions where you genuinely lack information, score a 3 (neutral) and note "Insufficient data — defaulting to neutral." Phase 3 research will fill gaps.

---

## Step 4: Calculate Big 4 Sub-Score

For every trade, calculate the **Big 4 sub-score** separately:

| Dimension | Weight |
|-----------|--------|
| Competition Level | 10 |
| Average Job Size | 9 |
| Differentiation Potential | 8 |
| Gross Margin | 8 |
| **Big 4 Total** | **35 (max 175)** |

The Big 4 represents 43% of the total score and captures the most critical economic factors.

---

## Step 5: Split Lists

### Rejected (BOTH conditions → reject)
- Total weighted score < **230**, OR
- Big 4 sub-score < **105**

A trade is rejected if it fails EITHER threshold.

### Consideration (BOTH conditions → consider)
- Total weighted score **230+**, AND
- Big 4 sub-score **105+**

---

## Step 6: Surprise Check

After all scoring is complete, identify the **3 trades with the biggest gap** between your gut expectation and actual score:

- A trade you expected to score high but scored low
- A trade you expected to score low but scored high
- The single most surprising score in either direction

For each, write 2-3 sentences explaining the gap. This catches systematic scoring errors.

---

## Step 7: Top 500 Cross-Reference

Review `Top500 - Sheet1.csv` and flag any trades where Top 500 companies primarily operate. For each flagged trade, note:
- Which Top 500 companies are in that trade
- Their approximate revenue
- Whether they have Wasatch Front presence
- What this means for competition scoring

---

## Output Format

### File Header

```markdown
> Phase 2 output | Generated [today's date] | [count] trades scored | [count] Consideration | [count] Rejected

# First Pass Screening Results
```

### Calibration Anchors Section

Full scorecard for each anchor (same format as Consideration list below).

### Summary Statistics

```markdown
## Summary Statistics

- **Total trades scored:** [count]
- **Consideration list:** [count] trades (230+ total AND 105+ Big 4)
- **Rejected list:** [count] trades
- **Score distribution:**
  - 350+: [count]
  - 290-349: [count]
  - 230-289: [count]
  - Below 230: [count]
- **Highest score:** [trade] ([score])
- **Lowest score:** [trade] ([score])
- **Median score:** [score]
```

### Consideration List (Ranked by Total Score, Highest First)

For each trade, a full scorecard:

```markdown
### [Trade Name] — [Total Score] / 410 (Big 4: [Big4 Score] / 175)

| # | Dimension | Weight | Score | Weighted | Reasoning |
|---|-----------|--------|-------|----------|-----------|
| 1 | Competition Level | 10 | [1-5] | [w*s] | [1 sentence] |
| 2 | Average Job Size | 9 | [1-5] | [w*s] | [1 sentence] |
| 3 | Differentiation Potential | 8 | [1-5] | [w*s] | [1 sentence] |
| 4 | Gross Margin | 8 | [1-5] | [w*s] | [1 sentence] |
| 5 | Installation Time | 7 | [1-5] | [w*s] | [1 sentence] |
| 6 | Post-Sale Risk | 7 | [1-5] | [w*s] | [1 sentence] |
| 7 | Labor Skill Level | 6 | [1-5] | [w*s] | [1 sentence] |
| 8 | Sales Cycle Efficiency | 5 | [1-5] | [w*s] | [1 sentence] |
| 9 | Financing Compatibility | 5 | [1-5] | [w*s] | [1 sentence] |
| 10 | Crew Size | 4 | [1-5] | [w*s] | [1 sentence] |
| 11 | Demand Tailwind | 4 | [1-5] | [w*s] | [1 sentence] |
| 12 | Permits & Inspections | 3 | [1-5] | [w*s] | [1 sentence] |
| 13 | Upsell / Add-on Potential | 3 | [1-5] | [w*s] | [1 sentence] |
| 14 | Supply Chain Complexity | 2 | [1-5] | [w*s] | [1 sentence] |
| 15 | Seasonality | 1 | [1-5] | [w*s] | [1 sentence] |
| | **TOTAL** | **82** | | **[total]** | |
```

### Rejected List (Alphabetical)

Abbreviated format — scores only, no per-dimension reasoning:

```markdown
### [Trade Name] — [Total Score] / 410 (Big 4: [Big4 Score] / 175) — REJECTED

**Rejection reason:** [Total below 230 / Big 4 below 105 / Both]

**Top-line reasoning:** [2-3 sentences on why this trade doesn't fit the business model]

| # | Dimension | Weight | Score | Weighted |
|---|-----------|--------|-------|----------|
| 1 | Competition Level | 10 | [1-5] | [w*s] |
| ... | ... | ... | ... | ... |
| | **TOTAL** | **82** | | **[total]** |
```

### Surprise Check Section

```markdown
## Surprise Check

### Surprisingly Low: [Trade Name]
Expected: [range]. Actual: [score]. [2-3 sentence explanation]

### Surprisingly High: [Trade Name]
Expected: [range]. Actual: [score]. [2-3 sentence explanation]

### Most Surprising: [Trade Name]
Expected: [range]. Actual: [score]. [2-3 sentence explanation]
```

### Top 500 Cross-Reference Section

```markdown
## Top 500 Cross-Reference

| Trade | Top 500 Companies | Revenue Range | Wasatch Front? | Competition Impact |
|-------|-------------------|---------------|----------------|-------------------|
```

---

## Quality Checklist (Self-Review Before Saving)

Before saving to `data/first-pass-results.md`, verify:

- [ ] All 4 calibration anchors scored and within expected ranges (or deviations explained)
- [ ] Every trade from master list was scored
- [ ] Each trade has 1-sentence reasoning per dimension (Consideration list)
- [ ] Big 4 sub-score calculated separately for every trade
- [ ] Consideration/Rejected split uses both thresholds (total AND Big 4)
- [ ] Full 1-5 range used across the scoring (check: are there 1s and 5s?)
- [ ] Surprise check completed with 3 entries
- [ ] Consideration list is 15-25 trades (if outside this range, consider adjusting thresholds and note the adjustment)
- [ ] Summary statistics are accurate
- [ ] Top 500 cross-reference completed
