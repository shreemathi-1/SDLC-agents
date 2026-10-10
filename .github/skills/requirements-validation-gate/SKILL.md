---
name: requirements-validation-gate
description: Step 14 of the Business Requirements workflow, also run mid-pipeline after step 5 and alone in validate mode. Checks requirements.json for completeness, consistency, ambiguity, traceability, testability, feasibility, duplication, scope contamination (INN/TRD content or unlabeled assumptions leaked into requirements) and JSON-schema validity, auto-fixes what it safely can, and writes requirements/validation-report.md. A failed pre-output gate blocks publishing. Use when asked to 'validate the requirements', 'run the gate', 'check for leaks', or before writing final output.
argument-hint: "[mid|pre-output|standalone]"
---

# requirements-validation-gate

> **Status:** frontmatter-only stub created in build phase 1. The full procedure is added in build phase 6.

## When to use

Mid-pipeline after step 5, pre-output as step 14, or standalone via `validate` mode / when the user says *validate*, *run the gate*, *check for contamination*.

## Procedure

*To be written in build phase 6.* Covers workflow step(s) 14 (and mid-pipeline after 5) of the
[Business Requirements agent](../../agents/business-requirements.agent.md).

## Input / output contract

- **Reads:** `requirements/requirements.json` (or `requirements/.state/draft.json` inside a run)
- **Writes:** *to be defined in build phase 6*

When invoked alone as `/requirements-validation-gate`, read the current `requirements/requirements.json`; do not assume an in-progress session.
