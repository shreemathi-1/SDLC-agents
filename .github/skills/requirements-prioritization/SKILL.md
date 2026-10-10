---
name: requirements-prioritization
description: Steps 12–13 of the Business Requirements workflow. Consolidates and de-duplicates clarification questions (Q-###) with the requirements each blocks, a suggested default option and audience CLIENT/INTERNAL; then prioritises every requirement with MoSCoW and assigns phases MVP/PHASE_2/PHASE_3/FUTURE, all marked PROPOSED. Use when asked to 'prioritise requirements', 'MoSCoW', 'assign phases', 'consolidate questions', or after trend analysis in an analyze/update run.
argument-hint: "[optional: questions|priorities to run one part]"
---

# requirements-prioritization

> **Status:** frontmatter-only stub created in build phase 1. The full procedure is added in build phase 4.

## When to use

After trend analysis in an `analyze`/`update` run, or standalone when the user says *prioritise*, *MoSCoW*, *phases*, *consolidate the questions*.

## Procedure

*To be written in build phase 4.* Covers workflow step(s) 12–13 of the
[Business Requirements agent](../../agents/business-requirements.agent.md).

## Input / output contract

- **Reads:** `requirements/requirements.json` (or `requirements/.state/draft.json` inside a run)
- **Writes:** *to be defined in build phase 4*

When invoked alone as `/requirements-prioritization`, read the current `requirements/requirements.json`; do not assume an in-progress session.
