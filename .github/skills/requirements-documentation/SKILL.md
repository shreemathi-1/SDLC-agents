---
name: requirements-documentation
description: Step 15 of the Requirements / PM workflow. Assigns or confirms permanent IDs against requirements/.state/id-registry.json, writes requirements/requirements.json, generates every Markdown view (requirements.md, client-summary.md, open-questions.md, innovation-opportunities.md with decision blocks, tech-trends.md, risks.md, business-rules.md, traceability.md with a Mermaid dependency graph), merges innovation-decisions.json and updates run-log.md. Also reads human edits (decision blocks, sign-off table) back into the JSON at the start of a run. Use when asked to 'write the requirements', 'regenerate the views', 'publish', or as the last step of a run.
argument-hint: "[optional: views to regenerate only the Markdown]"
---

# requirements-documentation

## When to use

| Situation | What runs |
|---|---|
| Step 15 of `analyze`, `update` or `promote`, **only after a pre-output gate PASS** | Publish: steps 1–6 below |
| `summary` mode, or the argument `views` | Read-back, then step 4 only, from the current `requirements.json` |
| Start of every run that has an existing `requirements.json` | [read-back.md](references/read-back.md) only |

## Procedure

Read [view-templates.md](references/view-templates.md), [read-back.md](references/read-back.md) and [worked-example.md](references/worked-example.md) first.

1. **Check the gate.** The draft's `validation` must be `{gate: PRE_OUTPUT, result: PASS}` from this run. If it isn't, stop. Never publish a draft that failed or wasn't checked.
2. **Confirm the IDs against `requirements/.state/id-registry.json`:**
   - Check each ID in the draft (requirements, questions, risks, innovations, trends):
     - If the registry already has the ID with the same `type` and fingerprint, it is confirmed.
     - If it has the ID with a different fingerprint, the item was edited. That is fine for `CHANGED` items, but the ID is never reassigned.
     - If the ID is new, add `ids[ID] = {type, fingerprint, created_in_run, retired: false}` and raise `counters[PREFIX]` to at least its number.
   - Use these fingerprints:

     | Item | Fingerprint |
     |---|---|
     | Requirement | `type\|sorted source US-IDs\|normalised title` |
     | Question | `q\|normalised text` |
     | Risk | `risk\|normalised title` |
     | Innovation | `inn\|catalogue_key`, or `inn\|bold\|normalised title` |
     | Trend | `trd\|library_key` |

   - A DEPRECATED item sets `retired: true`. Never remove an entry or lower a counter.
   - Set `last_updated` and `last_run`.
3. **Write `requirements/requirements.json`** from the draft, as is. Set `project.last_run` and `project.last_run_mode`.
4. **Generate every view** under `requirements/` as described in [view-templates.md](references/view-templates.md). Each view is written whole. Use the golden files in [views/](references/views/) as the exact pattern.
5. **Merge `requirements/.state/innovation-decisions.json`:**
   - Add an entry for each new INN: `{catalogue_key, title, decision: PENDING, reason: null, decided_by: null, decided_on: null, promoted_to: null}`.
   - **Never overwrite an entry whose decision isn't PENDING.**
   - Fill in `promoted_to` after a `promote` run.
   - Set `last_updated`.
6. **Finish:**
   - Delete `requirements/.state/draft.json`; this run is complete.
   - Append `step=15 status=DONE` to the run log.
   - Print the chat summary from the agent file.

## Input / output contract

- **Reads:** `requirements/.state/draft.json`, `id-registry.json`, `innovation-decisions.json`; for read-back, the existing views.
- **Writes:**
  - `requirements/requirements.json`
  - the 8 views (`validation-report.md` comes from the gate)
  - `id-registry.json`
  - `innovation-decisions.json`
  - `run-log.md`

  Nothing outside `requirements/`.

When invoked alone as `/requirements-documentation`, regenerate the views from `requirements/requirements.json` (summary behaviour), after reading back human edits.

## Self-check before finishing

- [ ] The gate result was PRE_OUTPUT PASS from this run.
- [ ] Every ID in `requirements.json` is in the registry with the right type, and no counter went down.
- [ ] All 8 views carry `(run <id>)` for this run.
- [ ] Every client-visible requirement has a heading with its badge and a sign-off row. No internal item appears in `requirements.md` or `client-summary.md`.
- [ ] Every OPEN question, risk, trend and business rule appears in its view. Every INN has a decision block that matches the JSON.
- [ ] `innovation-decisions.json` lost no human decision.

`npm run verify` checks all of these on `requirements/` once `requirements.json` exists. It also checks the golden example against [scripts/render-views.mjs](../../../scripts/render-views.mjs), the reference renderer kept in this scaffold repo.

## References

- [view-templates.md](references/view-templates.md): every view, what goes in it, and the decision-block and sign-off formats.
- [read-back.md](references/read-back.md): how human edits in the views and answers in chat get into the JSON.
- [worked-example.md](references/worked-example.md): US-001 published. It covers [worked-example.requirements.json](references/worked-example.requirements.json), [worked-example.id-registry.json](references/worked-example.id-registry.json), [worked-example.innovation-decisions.json](references/worked-example.innovation-decisions.json) and [views/](references/views/).
