---
name: requirements-documentation
description: Step 15 of the Requirements / PM workflow. Assigns or confirms permanent IDs against requirements/.state/id-registry.json, writes requirements/requirements.json, generates every Markdown view (requirements.md, client-summary.md, per-type files, assumptions, constraints, risks, open questions, innovation opportunities, trend analysis, dependencies with Mermaid graph, implementation phases, traceability matrix, validation report), merges innovation-decisions.json without touching non-PENDING entries, and appends to run-log.md. Use when asked to 'generate the requirements docs', 'regenerate the views', 'write requirements.md', or as the final step of any run.
argument-hint: "[optional: list of views to regenerate]"
---

# requirements-documentation

> **Status:** frontmatter-only stub created in build phase 1. The full procedure is added in build phase 7.

## When to use

Final step of every run, standalone via `summary` mode, or when the user says *regenerate the docs*, *write the client summary*. Requires a passed pre-output gate.

## Procedure

*To be written in build phase 7.* Covers workflow step(s) 15 of the
[Requirements / PM agent](../../agents/requirements.agent.md).

## Input / output contract

- **Reads:** `requirements/requirements.json` (or `requirements/.state/draft.json` inside a run)
- **Writes:** *to be defined in build phase 7*

When invoked alone as `/requirements-documentation`, read the current `requirements/requirements.json`; do not assume an in-progress session.
