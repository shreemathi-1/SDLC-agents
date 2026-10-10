---
name: business-rules-extraction
description: Step 6 of the Business Requirements workflow. Extracts business rules as BR-### items kept separate from features, categorised as validation, eligibility, authorization, calculation, workflow, time-based, state-transition or data-constraint, each traced to its story evidence and linked from the requirements it governs. Use when asked to 'extract business rules', 'what rules govern this', 'list validation rules', or after gap analysis in an analyze/update run.
argument-hint: "[optional: rule category filter]"
---

# business-rules-extraction

> **Status:** frontmatter-only stub created in build phase 1. The full procedure is added in build phase 3.

## When to use

After the mid-pipeline gate in an `analyze`/`update` run, or standalone when the user says *extract business rules*, *what are the rules*.

## Procedure

*To be written in build phase 3.* Covers workflow step(s) 6 of the
[Business Requirements agent](../../agents/business-requirements.agent.md).

## Input / output contract

- **Reads:** `requirements/requirements.json` (or `requirements/.state/draft.json` inside a run)
- **Writes:** *to be defined in build phase 3*

When invoked alone as `/business-rules-extraction`, read the current `requirements/requirements.json`; do not assume an in-progress session.
