# validation-report.md template

The gate writes `requirements/validation-report.md` after the pre-output gate and in `validate` mode. The mid-pipeline gate only writes to `validation` in the draft. The whole report is regenerated on each run, never patched.

```markdown
# Validation report

<the agent's end-of-run chat summary block, copied verbatim (analyze, update and promote modes only)>

**Gate:** PRE_OUTPUT | STANDALONE · **Result:** PASS | FAIL · **Run:** <run_id> · **Checked:** <n> requirements, <n> questions, <n> innovations, <n> trends

## Blocking issues (<n>)

| # | Check | Items | Issue | Auto-fixed |
|---|---|---|---|---|
| 1 | SCOPE_CONTAMINATION | FR-003, INN-001 | FR-003 copies innovation INN-001 without ACCEPT + promote | no |

<If the result is FAIL, add: "Nothing was published. Fix the issues above (or answer the linked questions), then run `validate` or `analyze` again.">

## Warnings (<n>)

<the same table, for WARNING issues>

## Auto-fixed (<n>)

<one line per fix: what was restored, and which fact it was restored from>

## Checks run

<one line per check code: ✓ pass, ✗ n blocking, or ! n warnings>
```

Rules:
- Order the issues: SCOPE_CONTAMINATION first, then SCHEMA, TRACEABILITY, LIFECYCLE, ID_REGISTRY, CONSISTENCY, COMPLETENESS, then the warnings.
- Each issue lists the exact IDs involved, and its message names the fact that is wrong. Never write just "invalid".
- If there are no issues, write `None.` under the heading. Do not leave a section out.
