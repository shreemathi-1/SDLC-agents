---
name: requirements-prioritization
description: Steps 12–13 of the Requirements / PM workflow. Consolidates and de-duplicates clarification questions (Q-###) with the requirements each blocks, a suggested default option and audience CLIENT/INTERNAL; then prioritises every requirement with MoSCoW and assigns phases MVP/PHASE_2/PHASE_3/FUTURE, all marked PROPOSED. Use when asked to 'prioritise requirements', 'MoSCoW', 'assign phases', 'consolidate questions', or after trend analysis in an analyze/update run.
argument-hint: "[optional: questions|priorities to run one part]"
---

# requirements-prioritization

## When to use

Run this after trend analysis in an `analyze` or `update` run. It also runs on its own when the user says *prioritise*, *MoSCoW*, *phases* or *consolidate the questions*. The argument `questions` runs only step 12, and `priorities` runs only step 13.

## Procedure

Read [moscow-rubric.md](references/moscow-rubric.md) and [worked-example.md](references/worked-example.md) first.

### Step 12: consolidate the questions

1. **Find duplicates.** Two OPEN questions are duplicates if one answer would settle both. Keep the one with the lower ID and merge the other into it:
   - Combine the `blocks` lists of both questions.
   - Copy any options the kept question lacks.
   - In every requirement, replace the merged question with the kept one in `open_questions`.
   - Set the merged question to `status: WITHDRAWN` with `note: "merged into Q-###"`.

   **Never delete a question.** Never touch an `ANSWERED` question.
2. **Withdraw stale questions.** An OPEN question whose blocked items are all `DEPRECATED` gets `status: WITHDRAWN` and `note: "all blocked items deprecated"`.
3. **Check the fields on every OPEN question:**
   - `audience`: CLIENT for business facts, INTERNAL for technical facts
   - `blocks`: names at least one item
   - `suggested_default_option`: begins with "Option:" and is a choice the client can accept, never a decided answer
   - `urgency`: set from the rubric
   - `category`: present

   Fix whichever fields are missing or wrong.
4. **Add questions found in later steps.** Questions from innovation and trends (steps 10–11) can only be INTERNAL, because INN and TRD items are not requirements. Make sure each one blocks an INN or TRD ID, not a requirement.

### Step 13: priority and phase

1. For every requirement that is not `DEPRECATED`, `APPROVED` or `BASELINED`, set these from the rubric:
   - `priority`
   - `phase`
   - `priority_status: PROPOSED`
   - `priority_reason`
2. **Leave confirmed items alone.** If `priority_status` is `CONFIRMED`, a human has decided; do not change the item. If the rubric disagrees, add an INTERNAL question instead.
3. **Enforce the dependency constraints** in the rubric. A MUST item depends only on MUST items, and every dependency is in the same or an earlier phase. Fix a violation by raising the dependency.
4. **Status.** Change `ANALYZED` items to `PROPOSED`. Leave `NEEDS_CLARIFICATION` unchanged: those items get a priority, but they stay blocked until their questions are answered.
5. For items carried over from an earlier run, append to `change_log` whenever their priority or phase changes.

## Input / output contract

- **Reads:** `requirements/.state/draft.json` inside a run, otherwise `requirements/requirements.json`.
- **Writes:**
  - questions: `status`, `note`, `blocks`, `options`, `urgency`, `audience`
  - requirements: `open_questions`, `priority`, `phase`, `priority_status`, `priority_reason`, `status`

  Output goes to `draft.json`.
- **Checkpoints:** `step=12` and `step=13`.

When invoked alone as `/requirements-prioritization`, read `requirements.json` and write the result to `requirements/.state/draft.json`.

## Self-check before finishing

- [ ] No two OPEN questions ask the same thing.
- [ ] Every WITHDRAWN question has a `note` and is no longer linked from any requirement.
- [ ] Every OPEN question blocks something and offers an "Option: …".
- [ ] Every requirement has a `priority_reason`, and `priority_status` is `PROPOSED` unless a human confirmed it.
- [ ] OUT and FUTURE items are `NOT_NOW` / `FUTURE`. MUST items depend only on MUST items, and no item depends on an item in a later phase.
- [ ] Every active story is traced by at least one requirement.

`npm run verify` checks all of these except the first and the `priority_reason` check.

## References

- [moscow-rubric.md](references/moscow-rubric.md): the priority rules in order, the phase mapping, the dependency constraints and the urgency rules.
- [worked-example.md](references/worked-example.md) and [worked-example.draft.json](references/worked-example.draft.json): US-001 after step 13.
