---
name: requirements-extraction
description: Steps 1–3 of the Business Requirements workflow. Parses user stories (actors, goals, features, actions, processes, data, constraints, outcomes, domain), extracts candidate requirements each with a US-### source and a verbatim evidence quote, and classifies each by type (FR, NFR, BR, DR, IR, SR, CR, CON, ASM, DEP) and origin (EXPLICIT, INFERRED, RECOMMENDED, UNKNOWN) without fabricating values. Use when asked to 'extract requirements', 'parse the user stories', 'classify requirements', or at the start of an analyze/update run.
argument-hint: "[path to user stories — default user-stories/]"
---

# requirements-extraction

> **Status:** frontmatter-only stub created in build phase 1. The full procedure is added in build phase 2.

## When to use

Start of an `analyze` or `update` run, or standalone when the user says *extract requirements*, *parse the stories*, *classify these requirements*. Requires stories with stable `US-###` IDs; stop and ask if any are missing.

## Procedure

*To be written in build phase 2.* Covers workflow step(s) 1–3 of the
[Business Requirements agent](../../agents/business-requirements.agent.md).

## Input / output contract

- **Reads:** `requirements/requirements.json` (or `requirements/.state/draft.json` inside a run)
- **Writes:** *to be defined in build phase 2*

When invoked alone as `/requirements-extraction`, read the current `requirements/requirements.json`; do not assume an in-progress session.

## References

- [requirement-schema.json](references/requirement-schema.json) — JSON Schema (draft 2020-12) for `requirements.json`, including `requirement`, `question`, `risk`, `innovation`, `trend`, `ambiguity`, `gap` and `validation_result` objects.
