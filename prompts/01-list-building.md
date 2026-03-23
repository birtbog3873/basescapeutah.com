# Phase 1: Trade List Building & Brainstorm

> **Role:** You are a trade category analyst helping evaluate contractor trades for a direct-to-residential, in-home-selling startup on the Wasatch Front, Utah.
>
> **Output file:** Save your output to `data/master-trade-list.md`

---

## Your Task

Build a comprehensive, normalized, deduplicated master list of contractor trades that could work as an in-home-selling business. Target: **80-120 trades** (below 70 = too aggressive filtering, above 140 = insufficient consolidation).

---

## Step 1: Read All Reference Lists

Read every file listed below and extract all service/trade entries:

1. `AngisList List of Services` (888 entries)
2. `Thumbtack Services` (245 entries)
3. `Houzz List of Professionals`
4. `Houzz Design Ideas`
5. `HomeAdvisor List` (65 entries)
6. `List of Trades` (69 trades)
7. `Top500 - Sheet1.csv` (500 remodeling companies — extract the trade categories they operate in)

Also read `Target Category Profile.md` Section 2 (Business Model Parameters) and Section 5 (Excluded Trades) for context.

---

## Step 2: Normalize to Business-Unit Level

Consolidate raw entries to the level at which you'd realistically start a company in that trade. Use these calibration examples:

| Raw Entries | Normalized Trade | Reasoning |
|-------------|-----------------|-----------|
| "Garage Door Repair" + "Garage Door Installation" + "Garage Doors" | **Garage Door Installation & Repair** | Same crew, same customer, same business |
| "Epoxy Flooring" + "Garage Floor Coating" | **Epoxy Garage Flooring** | Specific enough to be a standalone business; NOT rolled into generic "Flooring" |
| "Interior Painting" + "Exterior Painting" | **Residential Painting** | One painting company does both |
| "Hardwood Floor Installation" + "Hardwood Floor Refinishing" | **Hardwood Flooring** | Same business, different services |
| "Cabinet Refacing" vs "Kitchen Remodel" | Keep **Cabinet Refacing** separate | Different customer, different crew, different price point than full remodel |

**Rule: Err on the side of splitting.** If two sub-trades serve different customers, need different crews, or have meaningfully different economics, keep them as separate entries. You can always merge later; splitting later is harder.

---

## Step 3: Deduplicate Across Sources

Track which source lists contained each trade. This becomes the "Sources" column in the output.

---

## Step 4: Apply Exclusion Filters

Remove trades that fail ANY of these filters. Track every exclusion in Appendix A.

### Filter 1: Explicitly Excluded Trades
- Roofing
- Windows/Doors (replacement windows, door installation)
- Bath/Kitchen Remodel (full remodels — but niche bath services like shower-to-walk-in conversion are OK)
- Pergolas/Pavilions/Decks (non-compete with Western Timber Frame)
- Retaining Walls (conflict of interest)

### Filter 2: B2B / Commercial Only
Remove trades that primarily serve commercial clients with no meaningful residential market:
- Commercial HVAC, parking lot paving, commercial roofing, office buildouts, etc.

### Filter 3: Service/Repair Only — No Project Sale
Remove trades that are pure service/repair with no defined "project" that can be scoped, proposed, and sold:
- Appliance repair, lawn mowing, house cleaning, pest control, handyman (general), locksmith, etc.
- **Test:** Can you create a proposal with a defined scope, price, and timeline? If no, exclude.

### Filter 4: No In-Home Sales Model Possible
Remove trades where the buying decision is need-based, emergency-driven, or insurance-driven — not proactive:
- Tree removal (emergency/need-based), mold remediation (insurance-driven), water damage restoration, fire damage, etc.
- **Test:** Would a homeowner invite a salesperson in to discuss this proactively? If no, exclude.

### Filter 5: Too Capital-Intensive
Remove trades requiring more than $100K startup capital:
- Pool construction, home additions, new home construction, etc.

### Filter 6: Licensed Trade Gatekeeping
Remove trades that ARE the licensed trade itself:
- Pure plumbing company, pure electrical company, pure HVAC company
- **Exception:** Trades that USE licensed subs are fine (e.g., a bathroom remodel company uses a plumber as a sub — that's OK)

---

## Step 5: Brainstorm Additional Trades

After processing all lists, brainstorm **10-20 additional trades** that may be missing — niche, emerging, or underserved categories. Use these seeds as inspiration (don't just copy them — think of more):

- Polyaspartic / epoxy garage coatings
- Outdoor living packages (fire pits + patios + lighting)
- Smart home retrofit / automation
- Whole-house fan installation
- Radiant barrier / attic insulation
- Decorative concrete overlays (stamped, stained)
- Custom closet systems
- Shower-to-walk-in conversions (aging-in-place)
- Holiday lighting installation (seasonal business)
- Artificial turf installation
- Interior accent walls (shiplap, stone veneer, wood slat)
- Garage organization / storage systems
- Window film / tinting (residential)
- Gutter guard installation

For each brainstormed trade, briefly note why it might be a good fit for an in-home-selling model on the Wasatch Front.

---

## Step 6: Final Filter

Review the complete list one more time. For every trade, ask:

1. **Can a salesperson visit, scope, propose, and close in 1-2 visits?**
2. **Is it a defined project with a clear start and end?**
3. **Would a homeowner proactively seek this out (not just when something breaks)?**

Remove anything that fails all three. Flag anything that fails one as "borderline" in your notes.

---

## Output Format

### File Header

```markdown
> Phase 1 output | Generated [today's date] | [count] trades

# Master Trade List
```

### Trade List

Numbered entries, sorted alphabetically:

```markdown
### 1. [Trade Name]

- **Sources:** Angi, Thumbtack, HomeAdvisor (list which reference lists contained this trade)
- **Description:** 1-2 sentence description of what this trade does as a business
- **In-Home Sales Fit:** 1 sentence on why this works (or has concerns) for in-home selling
```

### Appendix A: Excluded Trades

Table format:

```markdown
| # | Trade | Filter | Reason |
|---|-------|--------|--------|
| 1 | Roofing | Explicitly Excluded | Not interested, saturated market |
| 2 | Lawn Mowing | No Project Sale | Pure service, no defined project scope |
```

### Appendix B: Normalization Map

Show which raw entries from each source rolled into each normalized trade:

```markdown
| Normalized Trade | Raw Entries |
|-----------------|-------------|
| Residential Painting | Interior Painting (Angi), Exterior Painting (Angi), House Painting (Thumbtack), Painters (Houzz) |
| Epoxy Garage Flooring | Epoxy Flooring (Angi), Garage Floor Coating (Thumbtack) |
```

---

## Quality Checklist (Self-Review Before Saving)

Before saving to `data/master-trade-list.md`, verify:

- [ ] Total trade count is 80-120
- [ ] All 7 reference lists were read and processed
- [ ] Normalization follows the "business unit" principle with calibration examples
- [ ] All 6 exclusion filters were applied
- [ ] Appendix A captures every exclusion with its filter reason
- [ ] Appendix B shows the normalization mapping
- [ ] 10-20 brainstormed trades are included
- [ ] Final filter (3 questions) was applied to the complete list
- [ ] No trades from the excluded list (Section 5 of Target Category Profile) slipped through
