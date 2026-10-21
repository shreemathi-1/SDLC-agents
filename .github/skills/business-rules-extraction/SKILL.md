---
name: business-rules-extraction
description: Step 6 of the Requirements / PM workflow. Extracts business rules as BR-### items kept separate from features, categorised as validation, eligibility, authorization, calculation, workflow, time-based, state-transition or data-constraint, each traced to its story evidence and linked from the requirements it governs. Use when asked to 'extract business rules', 'what rules govern this', 'list validation rules', or after gap analysis in an analyze/update run.
argument-hint: "[optional: rule category filter]"
---

# business-rules-extraction

## When to use

Run this after the mid-pipeline gate in an `analyze` or `update` run. It can also run on its own when the user says *extract business rules* or *what are the rules*.

## Procedure

Read [rule-categories.md](references/rule-categories.md) and [worked-example.md](references/worked-example.md) first.

1. **Find candidate rules.** Read every story's Details, Acceptance criteria and Client's words, and every FR's description and acceptance criteria. Mark each constraint on *what is allowed*: a limit, window, uniqueness, permission, formula, order of steps or forbidden transition.
2. **Skip rules already captured.** Step 3 already recorded rules that a story states directly, such as BR-001. Don't duplicate them. If a candidate restates an existing BR, add the new source or evidence to it instead.
3. **Create each new rule** as a `BUSINESS_RULE` item with:
   - `rule_category`: chosen from the reference table
   - `title`: the rule as one sentence
   - `description`: the rule stated precisely
   - `acceptance_criteria`: at least one `Given … when … then …` that a tester could fail
   - origin set by the step 3 rules:
     - `EXPLICIT` when the rule can be quoted. `evidence` must be verbatim, and it may come from an acceptance criterion.
     - `INFERRED` when it follows from other items. `rationale` names them.
     - `UNKNOWN` when a value is missing. Link a new `Q-###` to it.
   - `status`: `ANALYZED`, or `NEEDS_CLARIFICATION` if it has an OPEN question
   - the other provisional fields, as in step 3
4. **Link each rule.** Add the rule's ID to `business_rules[]` of every requirement that must obey it. **Every rule governs at least one requirement.** If a rule governs nothing, it is either a missing feature (raise a question) or not a rule (don't create it).
5. **Keep features clean.** If an FR's description contains a rule, leave the FR text as it is and link the BR. Never delete facts from an existing item.
6. **Never invent policy.** Common practice ("most clinics charge a no-show fee") is not a rule. At most it is a question in step 12.

## Input / output contract

- **Reads:** `requirements/.state/draft.json` in a run, otherwise `requirements/requirements.json`, plus the story files listed in `stories[].path`.
- **Writes:** new `BR-###` items in `requirements[]`, and `business_rules[]` links on the requirements they govern. Any new questions go in `questions[]`. All output goes to `draft.json`.
- **IDs:** new IDs come from the `BR` counter in `id-registry.json`. Count above the highest BR already in the draft.
- **Checkpoint:** `step=06`.

When invoked alone as `/business-rules-extraction`, read `requirements.json` and write the result to `requirements/.state/draft.json`.

## Self-check before finishing

- [ ] Every BR has a `rule_category` and a testable acceptance criterion.
- [ ] Every BR is linked from at least one requirement, and every `business_rules[]` entry points to a BR.
- [ ] EXPLICIT evidence is verbatim. No value was invented.
- [ ] No duplicate of an existing BR was created.

`npm run verify` checks the first three automatically.

## References

- [rule-categories.md](references/rule-categories.md): the 8 categories, their signal words, and how to tell a rule from a feature.
- [worked-example.md](references/worked-example.md) and [worked-example.draft.json](references/worked-example.draft.json): US-001 after step 6.
