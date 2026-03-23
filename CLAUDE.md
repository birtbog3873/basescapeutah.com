# General Contracting — Trade Evaluation Pipeline

## Project Context

Steven Bunker and his business partner are evaluating contractor trades to start a direct-to-residential, in-home-selling business on the Wasatch Front, Utah. This project uses a 4-phase evaluation pipeline to narrow ~1,200 raw service entries down to a ranked shortlist of 5-10 trade opportunities.

## Business Model (Non-Negotiable)

- **Model:** Direct to Residential, In-Home Selling
- **Structure:** Independent startup (no franchise)
- **Market:** Wasatch Front, Utah (SLC, Utah County, Davis County)
- **Year 1 Revenue Target:** $500K-$1M
- **Startup Capital:** Under $100K
- **Founders:** Steven Bunker (marketing, offer-building, lead gen) + Business Partner (sales management, field ops, crew management)

## Pipeline Phases

```
Phase 1: List Building        →  data/master-trade-list.md     (~80-120 trades)
Phase 2: First Pass Screening →  data/first-pass-results.md    (Rejected + Consideration)
Phase 3: Research Validation   →  data/candidate-list.md        (~5-10 candidates)
Phase 4: Deep Analysis         →  data/final-analysis.md        (Ranked recommendation)
```

Each phase has a prompt file in `prompts/` and produces output in `data/`. Steven reviews output at each quality gate before proceeding.

## Key Files

| File | Purpose |
|------|---------|
| `Target Category Profile.md` | 16-dimension weighted scoring rubric (max 410 points) |
| `prompts/01-list-building.md` | Phase 1 prompt — normalize & deduplicate trade lists |
| `prompts/02-first-pass-screening.md` | Phase 2 prompt — heuristic scoring with calibration anchors |
| `prompts/03-research-validation.md` | Phase 3 prompt — web research validation of top trades |
| `prompts/04-deep-analysis.md` | Phase 4 prompt — comprehensive analysis & go-to-market |

## Reference Lists (Phase 1 Input)

- `AngisList List of Services` — 888 entries
- `Thumbtack Services` — 245 entries
- `HomeAdvisor List` — 65 entries
- `Houzz List of Professionals` — professional categories
- `Houzz Design Ideas` — design/remodel categories
- `List of Trades` — 69 trades
- `Top500 - Sheet1.csv` — Top 500 remodeling companies (market context)

## Excluded Trades

Roofing, Windows/Doors, Bath/Kitchen Remodel, Pergolas/Pavilions/Decks (non-compete), Retaining Walls (conflict of interest).

## Scoring Quick Reference

- **Max score:** 410 points (16 dimensions x weight x score 1-5)
- **Big 4 sub-score:** Competition (10) + Job Size (9) + Differentiation (8) + Margin (8) = max 175
- **Phase 2 cutoffs:** Total 230+ AND Big 4 105+ → Consideration
- **Phase 3 cutoffs:** Total 290+ AND Big 4 122+ → Candidate
- **Conservative default:** When uncertain between adjacent scores, default lower

## Important Notes

- Each phase prompt is designed to run in a **fresh Claude session**
- Do NOT fabricate research data — "No data found" is acceptable
- Score with the full 1-5 range; avoid clustering at 3
- All output files use markdown tables for scores (human-readable + parseable)
- Phase metadata format: `> Phase N output | Generated [date] | [count] trades`
