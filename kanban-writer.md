# kanban.md writer

Only A1 (Orchestrator) may write kanban.md. All other agents read it and send A1 a status event (item, from, to, evidence).

## Columns (from agents_and_plan.md)

| Column | Owner | Human approval |
|---|---|---|
| Backlog | A1 | No |
| Ready | A2 | Yes: Product Owner |
| Design | A4, A3, A7 | Yes: design approval |
| In Progress | A5 | No (Task Gate: lint, types, unit tests) |
| Testing | A6 | Yes: Quality GO |
| Review | A8 | Only at fix-loop limit |
| Release Ready | A8 | Yes: release approval |
| Done | A1 | No |

Approver roles. PROPOSED (human approves): Product Owner for Ready, design approval, and release approval; QA lead for Quality GO, falling back to Product Owner. Review approver at the fix-loop limit: TBD.

## Move rule

A1 moves an item to the next column only when both hold:
1. The exit criteria are verified (R4, R7). Exit criteria per column: TBD (not in kanban.md or input/; see open-questions.md).
2. The evidence is recorded in kanban.md.

## Gate rule

At a gated column A1 sets `Awaiting approval: <role>` on the item and does not move it.
The item moves only after a named approval is recorded in History with a date.
No agent, including A1, records an approval on a human's behalf (R5). A8 never approves its own release (R9).

## History

Every move or handoff adds exactly one row: `| date | item | from | to | agent | evidence | approval |`.

## Commits

PROPOSED: one A1 commit per status event that moves an item. Not applied in this build (no commits allowed).
