# MoSCoW, phase and urgency rubric (steps 12–13)

Every value here is a **proposal** (`priority_status: PROPOSED`). Only a human confirms it.

## Priority: go down the list and stop at the first rule that matches

| # | Rule | Priority |
|---|---|---|
| 1 | `scope` is OUT or FUTURE | NOT_NOW |
| 2 | The client used *must*, *only*, *always*, *never*, *required* or *needs to* for this item | MUST |
| 3 | Without it, the story's **I want** goal cannot be met at all | MUST |
| 4 | It is a CON, CR or BR that governs or constrains a MUST item, or a legal obligation | MUST |
| 5 | A MUST item lists it in `dependencies` | MUST |
| 6 | The client used *should* or *want*, or the goal works without it but is noticeably worse | SHOULD |
| 7 | The client used *could*, *nice to have*, *ideally* or *if possible*, or it is an INFERRED convenience | COULD |
| 8 | Anything else | SHOULD, with a reason that says it is the default |

- Wording in the **story** takes precedence over wording in the raw input, because the story is the version the human reviewed.
- An **UNKNOWN** item still gets a priority, because the need is real. Its `priority_reason` says that the item cannot be approved until its question is answered.
- **Never** promote an item to MUST because it is common practice. Only the rules above make an item MUST.

## Phase

| Priority | Phase |
|---|---|
| MUST | MVP |
| SHOULD | MVP if it is small (S or M) and builds only on MVP items; otherwise PHASE_2 |
| COULD | PHASE_2, or PHASE_3 if it depends on PHASE_2 items |
| NOT_NOW | FUTURE |

Two constraints apply to every item:
- An item's `dependencies` must be in the **same or an earlier** phase.
- A MUST item's dependencies must also be MUST. If an item breaks either constraint, raise the dependency to match; never lower the item that depends on it.

## Question urgency (step 12)

| Raised by | Urgency |
|---|---|
| A CRITICAL gap or ambiguity, or a question that blocks the story's core goal | BLOCKING |
| An IMPORTANT gap or ambiguity, or an UNKNOWN item from step 3 | HIGH |
| An OPTIONAL gap or ambiguity | NORMAL |

If several sources raise the same question, take the highest urgency.

## `priority_reason`

Write one or two sentences the client can read. Quote the deciding word ("the client says patients *should* get …") or name the rule ("FR-001 (MUST) depends on it"). Do not use the internal rule numbers.
