# Worked example: the US-001 gates

## Mid-pipeline gate (after step 5): PASS

These checks ran on the step 5 draft (`requirements-ambiguity-gap/references/worked-example.draft.json`):
- SCHEMA
- TRACEABILITY: evidence, and story coverage
- CONSISTENCY: links, and `open_questions` ↔ `blocks`
- COMPLETENESS: UNKNOWN items have questions, and every question offers an option
- LIFECYCLE: NEEDS_CLARIFICATION has an OPEN question
- SCOPE_CONTAMINATION: every gap still has `resulting_requirements: []`
- AMBIGUITY (warning): the vague terms "fast", "treatment type" and "free time slot" are each covered by a question

There were no issues. Logged as `step=05g status=DONE note=0 blocking`.

## Pre-output gate (step 14): PASS

This gate ran on the step 13 draft. The result is in [worked-example.draft.json](worked-example.draft.json), with `validation.result: PASS` and `issues: []`.

What the gate looked at:
- **Contamination:**
  - IR-001 is the only INFERRED item. Its rationale cites CON-001 and FR-001, not an innovation or a default, so it is clean.
  - None of the 33 innovations was promoted, and no requirement shares an innovation's title.
  - The NFR-001 target is still `UNKNOWN`.
  - All 9 questions are OPEN.
- **Testability:** every non-DRAFT, non-NEEDS_CLARIFICATION item outside CON, ASM and DEP has an acceptance criterion (BR-001 and BR-002). CON-001 is exempt.
- **Feasibility (warning considered, not raised):** FR-001 (MUST, MVP) relies on IR-001, which has RISK-001 rated MEDIUM likelihood and HIGH impact. That is not the HIGH/HIGH combination, so no warning was raised. RISK-001 still appears in the risk list for the client.

## Contamination case: FAIL (the test)

[contamination-case.draft.json](contamination-case.draft.json) is the same draft with six leaks of the kind an over-eager agent produces:

| # | Leak | Why it is contamination | Auto-fix if created in this run |
|---|---|---|---|
| 1 | FR-003 "Automatic reminders", INFERRED from "best practice" | Copies INN-001 without ACCEPT and promote. The client said reminders are undecided (Q-006) | Remove FR-003. The idea stays as INN-001 |
| 2 | FR-004 promoted from INN-015 | INN-015 is still PENDING | Remove FR-004 |
| 3 | NFR-001 target "≤ 3 s" from "industry norm" | The number appears in no story and no answer, and Q-001 is still open | Set target back to UNKNOWN and origin to UNKNOWN |
| 4 | Q-004 ANSWERED by `agent` | The agent turned its own default option into the answer | Reopen Q-004 and clear the answer |
| 5 | CR-001 "Comply with HIPAA", produced by the COMPLIANCE gap | Q-005 (which regime applies) is unanswered, and the regime is a guess | Remove CR-001 and empty `resulting_requirements` |
| 6 | FR-002 text "(see INN-019)" | Innovation content inside a client requirement | Remove the sentence |

The expected result is recorded in that file's `validation` block: `FAIL`, with 6 BLOCKING `SCOPE_CONTAMINATION` issues. `npm run verify` recomputes the issues and requires exactly these six, so a gate rule that stops firing, or starts firing on clean data, fails the build.
