# Worked example: US-001 published (step 15)

**Input:** the step 14 draft (`requirements-validation-gate/references/worked-example.draft.json`). Its `validation` block is `PRE_OUTPUT PASS`.

**Output files:**

| File | Example |
|---|---|
| `requirements/requirements.json` | [worked-example.requirements.json](worked-example.requirements.json) |
| `requirements/.state/id-registry.json` | [worked-example.id-registry.json](worked-example.id-registry.json) |
| `requirements/.state/innovation-decisions.json` | [worked-example.innovation-decisions.json](worked-example.innovation-decisions.json) |
| `requirements/*.md` | [views/](views/) (8 files) |

## IDs recorded in the registry

| Prefix | Counter after the run | IDs |
|---|---|---|
| US | 1 | US-001 (minted in `stories` mode, recorded in `stories_seen`) |
| FR / BR / NFR / CON / IR | 2 / 2 / 1 / 1 / 1 | 7 requirements |
| Q | 9 | Q-001 – Q-009 |
| RISK | 4 | RISK-001 – RISK-004 |
| INN | 33 | INN-001 – INN-033 (30 catalogue ideas, 3 bold bets) |
| TRD | 9 | TRD-001 – TRD-009 |

Example fingerprints:
- `FR-001` → `functional|us-001|book an appointment online`
- `INN-001` → `inn|auto-reminders`
- `TRD-001` → `trd|online-self-scheduling`

A later `update` run that finds a requirement with the same fingerprint reuses the ID instead of creating a new one.

## Innovation decisions

`innovation-decisions.json` gets 33 entries, all PENDING. The view shows a decision block under each idea, for example:

```markdown
<!-- decision:INN-001 -->
**Decision:** PENDING
**Reason:**
**Decided by:**
**Date:**
<!-- /decision -->
```

## What the views show

- **requirements.md:** 7 requirements with badges. 6 are Explicit or Unknown and IR-001 is Inferred. There are 7 rows in the sign-off table, none filled in.
- **client-summary.md:** the MVP list of 7 items, plus the 2 BLOCKING client questions (Q-004 identification and Q-005 health-data regime). It shows the HIGH-impact risks RISK-001 (ClinicDesk) and RISK-003 (compliance), and the top 5 ideas labelled "not part of the requirements".
- **open-questions.md:** 8 client questions and 1 internal question (Q-008).
- **traceability.md:**

  ```mermaid
  graph LR
    FR_001["FR-001"] --> IR_001["IR-001"]
    FR_002["FR-002"] --> FR_001["FR-001"]
    NFR_001["NFR-001"] --> FR_001["FR-001"]
    IR_001["IR-001"] --> CON_001["CON-001"]
    BR_001["BR-001"]
    BR_002["BR-002"]
  ```

  BR-001 and BR-002 have no dependencies, so they appear as single nodes. They attach to FR-001 through `business_rules`, which is shown in business-rules.md.

## Next run: read-back

Suppose the client edits the INN-001 block to `ACCEPT` and writes `APPROVED | Dr. Rao | 2026-10-14` in the BR-001 sign-off row. The next run starts with [read-back.md](read-back.md):
- INN-001 becomes ACCEPT in both JSON files. It then waits for `promote`, which creates a RECOMMENDED requirement with `promoted_from: INN-001`.
- BR-001 becomes APPROVED, with a `change_log` entry `by: "human"`.

Until that run, `npm run verify` shows INN-001 as "awaiting read-back" (a warning, not a failure).
