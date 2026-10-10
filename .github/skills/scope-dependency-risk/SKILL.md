---
name: scope-dependency-risk
description: Steps 7–9 of the Business Requirements workflow. Sets scope IN/OUT/FUTURE with a reason per item, builds the requirement dependency graph (Mermaid) and flags cycles, and identifies business, technical, security, integration, scalability, compliance and requirement-quality risks each with likelihood, impact and mitigation. Use when asked to 'define scope', 'map dependencies', 'find cycles', 'identify risks', or after business rules in an analyze/update run.
argument-hint: "[optional: scope|dependencies|risks to run one part]"
---

# scope-dependency-risk

> **Status:** frontmatter-only stub created in build phase 1. The full procedure is added in build phase 3.

## When to use

After business rules in an `analyze`/`update` run, or standalone when the user says *define scope*, *dependency graph*, *risk register*.

## Procedure

*To be written in build phase 3.* Covers workflow step(s) 7–9 of the
[Business Requirements agent](../../agents/business-requirements.agent.md).

## Input / output contract

- **Reads:** `requirements/requirements.json` (or `requirements/.state/draft.json` inside a run)
- **Writes:** *to be defined in build phase 3*

When invoked alone as `/scope-dependency-risk`, read the current `requirements/requirements.json`; do not assume an in-progress session.
