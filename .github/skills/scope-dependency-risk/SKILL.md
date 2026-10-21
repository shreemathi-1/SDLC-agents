---
name: scope-dependency-risk
description: Steps 7–9 of the Requirements / PM workflow. Sets scope IN/OUT/FUTURE with a reason per item, builds the requirement dependency graph (Mermaid) and flags cycles, and identifies business, technical, security, integration, scalability, compliance and requirement-quality risks each with likelihood, impact and mitigation. Use when asked to 'define scope', 'map dependencies', 'find cycles', 'identify risks', or after business rules in an analyze/update run.
argument-hint: "[optional: scope|dependencies|risks to run one part]"
---

# scope-dependency-risk

## When to use

Run this after the business rules step in an `analyze` or `update` run. It can also run on its own when the user says *define scope*, *dependency graph* or *risk register*. Passing `scope`, `dependencies` or `risks` as the argument runs only that part.

## Procedure

Read [risk-checklist.md](references/risk-checklist.md) and [worked-example.md](references/worked-example.md) first.

### Step 7: scope

Give every non-deprecated requirement a `scope` and a `scope_reason`:
- **IN** is the default for items traced to a story. Reason: "Stated in US-###". For an INFERRED item, the reason names the in-scope items it is needed for.
- **OUT** or **FUTURE** only when a story or client quote says so ("not in the first release", "later", "we don't need"). The reason quotes those words. **You never move an item out of scope on your own judgement.** If you think scope is too large, raise a `SCOPE` question for step 12 instead.
- Never change the scope of an `APPROVED` or `BASELINED` item.

### Step 8: dependencies

1. Fill in `dependencies[]` for each requirement: the items that must exist first for it to work or be tested. Use these patterns:
   - an FR depends on the IR or DR it reads or writes
   - an IR depends on the CON that mandates the external system
   - an FR that reacts to another FR (for example, a confirmation sent after a booking) depends on that FR
   - an NFR depends on the FR whose behaviour it measures
2. Business rules are linked through `business_rules[]`, **not** through `dependencies`.
3. **Cycle check.** Follow the `dependencies` links from each item. A path that returns to an item it has already visited is a cycle. For each cycle:
   - create a `REQUIREMENT_QUALITY` risk (step 9) whose `related` lists every item in the cycle
   - create an INTERNAL question asking which link is wrong

   Do not break the cycle yourself.
4. The Mermaid graph is **not** stored in the JSON. The documentation step draws it from `dependencies[]`.

### Step 9: risks

1. Go through every category in `risk-checklist.md`. Pay particular attention to these sources:
   - CRITICAL gaps
   - UNKNOWN items
   - questions that block several items
   - every IR
   - every dependency cycle
2. For each risk, create a `RISK-###` with these fields:
   - `title` and `category`
   - `description`: names the cause found in the draft
   - `likelihood` and `impact`, set using the rubric
   - `mitigation`: a concrete action
   - `related`: the requirement and question IDs it concerns
   - `status: OPEN`
   - `origin` and `rationale`
   - `owner: null`; a human assigns it
   - `client_visible`: `false` only for purely internal engineering risks
   - `created_in_run`
3. Add the risk ID to `risks[]` on every requirement it lists in `related`.
4. One cause gives one risk. Don't log the same cause again under a second category.

## Input / output contract

- **Reads:** `requirements/.state/draft.json` in a run, otherwise `requirements/requirements.json`.
- **Writes:** `scope` and `scope_reason`, `dependencies[]`, and `risks[]` on requirements; new items in `risks[]`; new cycle questions in `questions[]`. All of it goes to `draft.json`.
- **IDs:** new IDs come from the `RISK` and `Q` counters in `id-registry.json`.
- **Checkpoints:** `step=07`, `step=08`, `step=09`.

When invoked alone as `/scope-dependency-risk`, read `requirements.json` and write the result to `requirements/.state/draft.json`.

## Self-check before finishing

- [ ] Every item has a `scope_reason`. Every OUT or FUTURE reason quotes the client.
- [ ] Every dependency ID exists, and every cycle has a risk covering all its members.
- [ ] Every risk has a concrete mitigation and `related` IDs that exist, and is linked back from those requirements.
- [ ] No risk duplicates another.

`npm run verify` checks dependency IDs, cycles, risk links and OUT/FUTURE reasons.

## References

- [risk-checklist.md](references/risk-checklist.md): prompts for each category, the likelihood and impact rubric, and risk rules.
- [worked-example.md](references/worked-example.md) and [worked-example.draft.json](references/worked-example.draft.json): US-001 after step 9.
