# Kanban (writer: A1 only; see kanban-writer.md)

## Columns

| Column | Purpose | Owner (agent) | Entry criteria | Exit criteria (gate) | Human approval |
|---|---|---|---|---|---|
| Backlog | Prioritized ideas and stories | A1 | Idea recorded (text, user story, Figma link, or screenshot) | Routed to A2 for intake | No |
| Ready | Stories that meet the Definition of Ready | A2 | Input manifest, stories, acceptance criteria, open questions recorded | Definition of Ready passed; traceability check passed; open questions answered or accepted | Yes: Product Owner |
| Design | Architecture, UI/UX baseline or design spec, BFF spec, task breakdown | A4, A3 (always; text-only input gets a PROPOSED baseline), A7 (only if BFF is approved) | Story is Ready | Design doc approved; UI/UX baseline or design spec approved by a human; BFF spec approved where it applies | Yes: design approval (includes UI/UX baseline) |
| In Progress | Active implementation | A5 (A3 and A7 implement their parts) | Design approved; task plan written | PR open; Task Gate passed (lint, type check, unit tests); minimum UI/UX checklist passed on built screens | No |
| Testing | Test execution and QA | A6 | PR merged to test branch | Tests pass; every acceptance criterion has a test; quality summary written | Yes: Quality GO |
| Review | Code, design, security, privacy, accessibility review | A8 | PR open and CI green | No blocker or major findings open; findings consolidated; fix-loop limit not exceeded (limit: 3 loops; then a human decides) | Only if the fix-loop limit is reached |
| Release Ready | Built and staged for release | A8 | Review and tests passed | Release checklist complete; rollout plan set | Yes: release approval |
| Done | Released or closed | A1 | Release Ready and approved | Deployed, or staged rollout started | No |

## Backlog
- **T-01 — Product browsing and cart flow** (Source: T-01; text user story)
  - Scope: browse products, view product details, add products to a cart with a quantity indicator, and review cart items, quantities, subtotals, and total.
  - Current owner: A2 Requirements for intake, story conversion, Given/When/Then acceptance criteria, UX states, and traceability verification.
  - Confirmed decisions: platform is web; framework is ReactJS and NodeJS; currency and price format are INR.
  - Accepted decisions: persist the cart in browser localStorage; show loading skeletons while products load; show a retryable error state for failed product loading; mark out-of-stock products as unavailable and disable Add to Cart (Product Owner approval received 2026-10-27; source: T-01).
  - Sample product data: A2/A5 may create representative data for the requested flow, subject to requirements and design review.
  - User-provided requirements update (source: current chat, T-01): platform, framework, persistence, currency, sample-data ownership, and loading/error/out-of-stock behavior are answered and accepted.
  - Gate status: Product Owner approval received 2026-10-27; A2 handoff requested. Not Ready until A2 records the current intake manifest, converted stories, Given/When/Then acceptance criteria, traceability result, and open-question record.

## Ready

## Design

## In Progress

## Testing

## Review

## Release Ready

## Done

## History

| date | item | from | to | agent | evidence | approval |
|---|---|---|---|---|---|---|
| 2026-10-27 | T-01 | Backlog | A2 Requirements intake | A1 | User-provided decisions recorded in [open-questions.md](open-questions.md); A2 intake, stories, Given/When/Then criteria, UX states, and traceability requested | N/A; Ready gate not entered |
