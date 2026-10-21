# Innovation scoring rubric (step 10)

## 1. Filter

A catalogue entry is a **candidate** only if it passes all three checks:

1. **Domain:** its `domains` contains `*` or one of the `project.domain` tags.
2. **Capabilities:** every value in `requires` is present in the product. A capability is present when a requirement provides it, or when an IR item connects to a system the stories say holds it. For example, ClinicDesk is the master calendar, so it provides `history-data`. If a capability depends on an OPEN question (for example, `user-accounts` waiting on an auth question), the entry may still pass. In that case relevance is at most 3, and the question goes in `dependencies`.
3. **Not already required:** no requirement already delivers it, and it doesn't contradict an OUT scope decision.

## 2. Score

Score each criterion from 1 to 5, as an integer. Effort and risk are **inverted**, so 5 means least effort or least risk.

| Criterion | Weight | 5 | 3 | 1 |
|---|---|---|---|---|
| `relevance` | 0.30 | Directly serves the story goal or answers an open gap or question | Plausible for this domain and product | Generic, or only loosely related |
| `user_value` | 0.25 | Removes a pain point the stories describe | A noticeable convenience | Barely noticed by users |
| `business_value` | 0.20 | Moves the client's stated objective (revenue, cost, load) | Indirect benefit | No measurable benefit |
| `effort_inverse` | 0.15 | S: days, using existing parts | M or L: weeks | XL: a new platform or team |
| `risk_inverse` | 0.10 | No new legal, data or delivery risk | Manageable risk with a known mitigation | Regulatory, safety or reputational exposure |

`weighted_total` = 0.30·relevance + 0.25·user_value + 0.20·business_value + 0.15·effort_inverse + 0.10·risk_inverse, rounded to 2 decimals. `npm run verify` recomputes it.

## 3. Select

- Discard candidates with `relevance` below 3.
- Rank the rest by `weighted_total`. Take **30–40**, aiming for about 10 at L1, 12 at L2, 8 at L3 and 3 at L4. Fill short levels from the next level down. **If fewer than 30 qualify, take what qualifies.** Never pad the list with irrelevant ideas.
- Then generate **3–5 bold bets**. These are ideas specific to this product that are not in the catalogue: `generated: true`, `catalogue_key: null`, `level: 4`, `recommended_phase: FUTURE`. Each one must trace to something in the draft (a goal, an open point or a constraint) and list its prerequisites in `dependencies`.

## 4. Recommended phase

| Level | Phase |
|---|---|
| 1, complexity S, builds only on MVP items and depends on no OPEN question | MVP |
| 1 or 2 otherwise | PHASE_2 |
| 3 | PHASE_3 |
| 4 | FUTURE |

The phase is a suggestion to the human, nothing more. An innovation never enters the requirements, and never affects any requirement's priority, until a human sets it to ACCEPT and `promote` runs.
