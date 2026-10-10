---
name: requirements-ambiguity-gap
description: Steps 4–5 of the Business Requirements workflow. Detects ambiguous or unmeasurable requirements (what is ambiguous, why it matters, possible interpretations, a clarification question, impact if unresolved) and runs a domain-filtered gap analysis across auth, roles, workflows, validation, error handling, notifications, payments, integrations, security, performance, accessibility, compliance, analytics, admin, backup/recovery, monitoring, localization, audit logging and data retention, bucketed CRITICAL/IMPORTANT/OPTIONAL, then triggers the mid-pipeline validation gate. Use when asked to 'find ambiguities', 'run gap analysis', 'what is missing from the requirements', or after extraction in an analyze/update run.
argument-hint: "[optional: category filter, e.g. security,payments]"
---

# requirements-ambiguity-gap

> **Status:** frontmatter-only stub created in build phase 1. The full procedure is added in build phase 3.

## When to use

After extraction in an `analyze`/`update` run, or standalone when the user says *find ambiguities*, *gap analysis*, *what's missing*.

## Procedure

*To be written in build phase 3.* Covers workflow step(s) 4–5 (+ mid-pipeline gate) of the
[Business Requirements agent](../../agents/business-requirements.agent.md).

## Input / output contract

- **Reads:** `requirements/requirements.json` (or `requirements/.state/draft.json` inside a run)
- **Writes:** *to be defined in build phase 3*

When invoked alone as `/requirements-ambiguity-gap`, read the current `requirements/requirements.json`; do not assume an in-progress session.
