---
name: innovation-discovery
description: Step 10 of the Requirements / PM workflow. Scores a 150+ entry innovation catalogue (UX, AI, automation, analytics, personalization, collaboration, security, integrations, performance, mobile/offline, engagement, operations) against the product domain and goals using a weighted five-criteria rubric, and produces 30–40 INN-### candidates in four levels plus 3–5 generated bold bets, every one with a PENDING decision block. Never merges anything into requirements. Use when asked to 'find innovation opportunities', 'what could we add', 'feature ideas', or after risks in an analyze run.
argument-hint: "[optional: category filter or minimum score]"
# experimental — delete the next line to run this skill in the main session instead of a forked subagent
context: fork
---

# innovation-discovery

> **Status:** frontmatter-only stub created in build phase 1. The full procedure is added in build phase 5.

## When to use

After risks in an `analyze` run, or standalone when the user says *innovation opportunities*, *what else could we build*, *feature ideas*. Output is a catalogue for the developer to triage; it never becomes a requirement until a human ACCEPTs and `promote` is run.

## Procedure

*To be written in build phase 5.* Covers workflow step(s) 10 of the
[Requirements / PM agent](../../agents/requirements.agent.md).

## Input / output contract

- **Reads:** `requirements/requirements.json` (or `requirements/.state/draft.json` inside a run)
- **Writes:** *to be defined in build phase 5*

When invoked alone as `/innovation-discovery`, read the current `requirements/requirements.json`; do not assume an in-progress session.
