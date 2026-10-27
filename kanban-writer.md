# kanban.md writer

Only A1 (Orchestrator) may write kanban.md. All other agents read it and send A1 a status event (item, from, to, evidence).
Columns, owners, entry criteria, exit criteria and human approvals are defined in the Columns table in [kanban.md](kanban.md).

## Move rule

A1 moves an item to the next column only when both hold:
1. The column's exit criteria (Columns table in kanban.md) are verified (R4, R7).
2. The evidence is recorded in kanban.md.

## Gate rule

At a gated column A1 sets `Awaiting approval: <role>` on the item and does not move it.
The item moves only after a named approval is recorded in History with a date.
No agent, including A1, records an approval on a human's behalf (R5). A8 never approves its own release (R9).

Approver roles (approved by human): Product Owner for Ready, design approval, and release approval; QA lead for Quality GO, falling back to Product Owner.

## Fix loops (R6)

Limit is 3 loops. After the third, A1 sets `Awaiting approval: human decision` on the item and the item does not move until a human decision is recorded in History.

## History

Every move or handoff adds exactly one row: `| date | item | from | to | agent | evidence | approval |`.

## Commits

One A1 commit per status event that moves an item (confirmed by human). Agents in this build run no commits; the first commit happens when the human allows it.
