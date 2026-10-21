---
name: innovation-discovery
description: Step 10 of the Requirements / PM workflow. Scores a 150+ entry innovation catalogue (UX, AI, automation, analytics, personalization, collaboration, security, integrations, performance, mobile/offline, engagement, operations) against the product domain and goals using a weighted five-criteria rubric, and produces 30–40 INN-### candidates in four levels plus 3–5 generated bold bets, every one with a PENDING decision block. Never merges anything into requirements. Use when asked to 'find innovation opportunities', 'what could we add', 'feature ideas', or after risks in an analyze run.
argument-hint: "[optional: category filter or minimum score]"
# experimental — delete the next line to run this skill in the main session instead of a forked subagent
context: fork
---

# innovation-discovery

## When to use

Use this skill after the risks step in an `analyze` run. It can also run on its own when the user says *innovation opportunities*, *what else could we build* or *feature ideas*.

The output is a list of ideas for the developer and client to triage. **An idea is never a requirement.** It becomes one only after a human sets it to ACCEPT and `promote` runs.

## Procedure

Read [scoring-rubric.md](references/scoring-rubric.md) and [worked-example.md](references/worked-example.md) first. Then load [innovation-catalogue.json](references/innovation-catalogue.json).

1. **Profile the product** from the draft:
   - `project.domain`, the business objectives and the "so that" goals
   - the capabilities present (see `catalogue.capabilities` and rubric §1)
   - OPEN CRITICAL and IMPORTANT gaps and questions
   - OUT and FUTURE scope decisions
2. **Keep existing decisions.**
   - Read `requirements/.state/innovation-decisions.json` and any `innovations[]` already in `requirements/requirements.json`.
   - A catalogue key that already has an INN keeps **the same ID**, and its non-PENDING decision is copied exactly as it is.
   - Never re-score a decided item or change its decision.
   - A REJECT or DEFER item stays in the list unchanged. Never resurrect it under a new ID.
3. **Filter, score and select** using the rubric:
   - Go through every entry: filter it, then score the survivors.
   - Select 30–40 ideas across the four levels.
   - Generate 3–5 bold bets.
   - The optional argument narrows the categories or sets a minimum `weighted_total`.
4. **Tailor each idea to this product.** Starting from the catalogue entry:
   - `title`, `description` and `technology` may be taken as they are.
   - Write these for this product, naming its actors and systems:
     - `problem_solved`
     - `business_value`
     - `user_value`
     - `relevance_reason`: cite the requirement, question or gap it relates to
   - `dependencies` lists requirement, question and risk IDs, plus free-text prerequisites.
   - `risks` starts from the catalogue's `typical_risk`; add risks specific to this product.
5. **Write each item:**
   - New items get IDs from the `INN` counter.
   - Set these fields on every new item: `decision: PENDING`, `decision_reason: null`, `decided_by: null`, `decided_on: null`, `promoted_to: null`, `created_in_run`.
6. **Never touch requirements.**
   - Do not add, edit, re-prioritise or link requirements.
   - If an idea shows a real gap the client must decide, the gap belongs to step 5. Mention it in the run-log note; do not create a question here.

## Input / output contract

- **Reads:**
  - `requirements/.state/draft.json` during a run, otherwise `requirements/requirements.json`
  - `requirements/.state/innovation-decisions.json`
  - the catalogue
- **Writes:** `innovations[]` in `draft.json` only. Step 15 merges the new PENDING entries into `innovation-decisions.json` and renders `innovation-opportunities.md` with a decision block for each item.
- **Checkpoint:** `step=10`, with counts per level in the note.

When invoked alone as `/innovation-discovery`, read `requirements.json` and write `requirements/.state/draft.json`.

## Self-check before finishing

- [ ] There are 30–40 catalogue ideas, or every qualifying one if fewer qualify, plus 3–5 bold bets.
- [ ] Every `catalogue_key` exists in the catalogue. Every `weighted_total` matches the formula.
- [ ] Every idea has a product-specific `relevance_reason` that names a requirement, question or gap.
- [ ] All new items are PENDING, and existing decisions are unchanged.
- [ ] No requirement was added or changed.

`npm run verify` checks catalogue keys, score maths, ID links and contamination: a requirement may come from an innovation only after an ACCEPT and `promote`, and no unpromoted requirement may share an innovation's title.

## References

- [innovation-catalogue.json](references/innovation-catalogue.json): 156 generic ideas in 12 categories, with domain tags, required capabilities, level, complexity and typical risk. You may add entries; never rename or reuse a key.
- [scoring-rubric.md](references/scoring-rubric.md): the filter, the five weighted criteria, selection quotas and the phase mapping.
- [worked-example.md](references/worked-example.md) and [worked-example.draft.json](references/worked-example.draft.json): US-001 after step 10.
