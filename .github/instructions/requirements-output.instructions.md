---
name: Requirements output rules
description: Standing rules for every file under requirements/ — the source-of-truth JSON, the generated Markdown views and the .state files. Attached automatically whenever a requirements file is in context.
applyTo: "requirements/**"
---

# Rules for files under `requirements/`

These rules apply to any agent or human editing anything under `requirements/`. The
[Requirements / PM agent](../agents/requirements.agent.md) is the normal writer;
these rules also bind ad-hoc edits made in the default agent.

## 1. Source of truth

- `requirements/requirements.json` is the single source of truth. It must validate against
  [requirement-schema.json](../skills/requirements-extraction/references/requirement-schema.json).
- Every other file in `requirements/` (all `*.md`) is a **generated view**. Never hand-edit a
  view to change facts; change the JSON, then regenerate (`summary` run mode or `/requirements-documentation`).
- The two exceptions where humans edit Markdown directly are the **decision blocks** in
  `innovation-opportunities.md` and the **sign-off table** in `requirements.md`. Those edits are
  read back into the JSON on the next run; on conflict the JSON wins and the conflict is reported.

## 2. IDs are permanent

- Registry: `requirements/.state/id-registry.json`. Counters only ever increase.
- Never renumber, reuse or reassign an ID — not even after deprecation. Removed items become
  `status: DEPRECATED` and stay in the JSON and the registry.
- Prefixes: `FR` functional · `NFR` non-functional · `BR` business rule · `DR` data · `IR` integration ·
  `SR` security · `CR` compliance · `CON` constraint · `ASM` assumption · `DEP` dependency ·
  `RISK` · `Q` question · `INN` innovation · `TRD` trend. Story IDs are `US-###`. They are minted only in the Requirements / PM agent's `stories` mode, from the `US` counter, or written by a human. Every other step takes them from the input and never invents one.
- Format is `PREFIX-` + zero-padded three-digit number (`FR-007`); the fourth digit is added only when a counter passes 999.

## 3. Origin tags — nothing silently becomes a client requirement

Every requirement carries exactly one uppercase origin:

| Origin | Meaning | Required fields |
|---|---|---|
| `EXPLICIT` | Stated in a user story | `evidence` = verbatim quote from the story, `source` = US-ID(s) |
| `INFERRED` | Derived by reasoning from the stories | `rationale` |
| `RECOMMENDED` | Suggested by the team/agent; always a proposal | `rationale`; `promoted_from` if it came from an INN item |
| `UNKNOWN` | Needed but not determinable | at least one linked `Q-###` in `open_questions`; **never a fabricated default** |

- `nfr_metric` is mandatory for `NON_FUNCTIONAL` items. If the target is not known, the origin is `UNKNOWN` and a question is linked. Never invent a number.
- Innovation (`INN`) and trend (`TRD`) content is **never** copied into `requirements[]` except by the `promote` run mode acting on a human `ACCEPT` decision.

## 4. Lifecycle (state machine)

```
DRAFT → ANALYZED → (NEEDS_CLARIFICATION ↔ ANALYZED) → PROPOSED → CLIENT_REVIEW → APPROVED → BASELINED
BASELINED → CHANGED → CLIENT_REVIEW
any state → DEPRECATED
```

- **Agents may never set `APPROVED` or `BASELINED`.** Only a human does, either by editing
  `requirements.json` or by an explicit chat instruction naming the IDs, and every such change is
  appended to that item's `change_log` with `"by": "human"`.
- `priority` and `phase` are always `priority_status: PROPOSED` until a human sets `CONFIRMED`.
- Downstream agents (Planning onward) read only `APPROVED` and `BASELINED` items.

## 5. Human decisions are never deleted

- `requirements/.state/innovation-decisions.json`: an entry whose `decision` is not `PENDING` is
  read-only for agents. Re-runs merge new entries and never overwrite existing non-`PENDING` ones.
- Answered questions (`status: ANSWERED`) keep their answer; a re-run may only add new questions or mark stale ones `WITHDRAWN` with a note.
- `change_log` arrays are append-only.

## 6. Generated views

- Every requirement in a view shows its origin badge: `**[Explicit]**`, `**[Inferred]**`, `**[Recommended]**`, `**[Unknown]**`.
- Items with `client_visible: false` are omitted from `requirements.md` and `client-summary.md`; they still appear in `traceability.md`, `business-rules.md` and `risks.md`, marked *(internal)*. The view set and formats are defined in [view-templates.md](../skills/requirements-documentation/references/view-templates.md).
- Acceptance criteria are written as `Given … When … Then …`.
- Views are regenerated whole; do not patch them by hand except as noted in §1. Human edits to decision blocks and the sign-off table are read back into the JSON at the start of the next run ([read-back.md](../skills/requirements-documentation/references/read-back.md)).

## 7. State files

- `requirements/.state/run-log.md` gets one checkpoint line after **every** workflow step. A run that finds an unfinished checkpoint for the same mode resumes from the next step.
- Never write outside `requirements/` when producing requirements artifacts.
