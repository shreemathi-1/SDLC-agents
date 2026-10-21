---
name: requirements-validation-gate
description: Step 14 of the Requirements / PM workflow, also run mid-pipeline after step 5 and alone in validate mode. Checks requirements.json for completeness, consistency, ambiguity, traceability, testability, feasibility, duplication, scope contamination (INN/TRD content or unlabeled assumptions leaked into requirements) and JSON-schema validity, auto-fixes what it safely can, and writes requirements/validation-report.md. A failed pre-output gate blocks publishing. Use when asked to 'validate the requirements', 'run the gate', 'check for leaks', or before writing final output.
argument-hint: "[mid|pre-output|standalone]"
---

# requirements-validation-gate

## When to use

| Gate | When | Target | On failure |
|---|---|---|---|
| `mid` | After step 5 in `analyze` or `update` | `requirements/.state/draft.json` | Fix what is safe. Record the rest as INTERNAL questions (or reuse existing ones), then **continue** |
| `pre-output` | Step 14 in `analyze`, `update` or `promote` | `draft.json` | Fix what is safe. If any BLOCKING issue is left, **stop**: step 15 doesn't run and nothing is published |
| `standalone` | `validate` mode, or when the user says *validate*, *run the gate* or *check for contamination* | `requirements/requirements.json` | Report only. Never edit `requirements.json` |

With no argument, infer the gate from the run mode.

## Procedure

Read [gate-checks.md](references/gate-checks.md) and [worked-example.md](references/worked-example.md) first.

1. **Load** the target document, the stories in `stories[].path`, `requirements/.state/id-registry.json`, the innovation catalogue and the trend library.
2. **Run each check** that `gate-checks.md` lists for this gate, in table order. Record every finding as a `validation_issue` with:
   - `check`
   - `severity`
   - `items`: every ID involved, most important first
   - `message`: names the exact fact that is wrong
3. **Check contamination first and most carefully.** For every requirement that isn't EXPLICIT, ask: *did a client say this, or did an innovation, a trend, a default option or the agent's own judgement put it here?* If it is the last, it is contamination, even when it looks reasonable.
4. **Auto-fix** only what `gate-checks.md` allows. Set `auto_fixed: true` on those issues and keep them in the list, so the fix is visible. Never fix by deleting a human decision or a published ID.
5. **Decide the result.** **PASS** if no BLOCKING issue remains unfixed; otherwise **FAIL**. Warnings never cause FAIL.
6. **Write the result:**
   - Set `validation = { last_run, gate: MID_PIPELINE | PRE_OUTPUT | STANDALONE, result, issues }`. Write it to the draft (mid and pre-output gates), or report it only (standalone).
   - `pre-output` and `standalone` gates: write `requirements/validation-report.md` from [report-template.md](references/report-template.md).
   - Append a run-log checkpoint:
     - `step=05g` for the mid gate, or `step=14` for the pre-output and standalone gates
     - status `DONE` on PASS, `FAILED` on FAIL
     - a note giving the count of blocking issues
7. **On a pre-output FAIL, stop the run.** Show the blocking issues in chat with their IDs. The next `analyze` run resumes from step 14 (see the agent's resume rules).

## Input / output contract

- **Reads:**
  - the target JSON
  - story files
  - `id-registry.json`
  - `innovation-catalogue.json`
  - `trend-library.json`
- **Writes:**
  - `validation`, plus auto-fixed fields, in `draft.json` (mid and pre-output)
  - `requirements/validation-report.md` (pre-output and standalone)
  - the run log

  The standalone gate never modifies `requirements.json`.

## Self-check before finishing

- [ ] Every check for this gate ran, and each BLOCKING issue names its IDs.
- [ ] Contamination was checked for every non-EXPLICIT requirement, every ANSWERED question and every gap with `resulting_requirements`.
- [ ] Auto-fixes stay within the policy and are listed with `auto_fixed: true`.
- [ ] On a pre-output FAIL, nothing was written to `requirements/requirements.json` or the `.md` views.

`npm run verify` encodes every rule marked "Verify" in `gate-checks.md`. It also proves the gate works: [contamination-case.draft.json](references/contamination-case.draft.json) contains six planted leaks, and verify must find exactly those six, no more and no fewer.

## References

- [gate-checks.md](references/gate-checks.md): every check with its code, severity, gate and auto-fix policy.
- [report-template.md](references/report-template.md): the format of `validation-report.md`.
- [worked-example.md](references/worked-example.md) and [worked-example.draft.json](references/worked-example.draft.json): the US-001 pre-output gate, which passes.
- [contamination-case.draft.json](references/contamination-case.draft.json): the same draft with six planted leaks, and the FAIL result the gate must produce.
