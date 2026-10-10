---
name: tech-trend-analysis
description: Step 11 of the Business Requirements workflow. Identifies patterns and technologies currently adopted in comparable products, filtered to the domain (no buzzword dumps), as TRD-### items with adoption level, relevance, last_reviewed date and ADOPT/TRIAL/ASSESS/HOLD recommendation; verifies time-sensitive claims with web/fetch when available and otherwise marks them unverified. Kept separate from innovation. Use when asked to 'analyse technology trends', 'what are comparable products doing', 'tech radar', or after innovation discovery in an analyze run.
argument-hint: "[optional: domain override]"
# experimental — delete the next line to run this skill in the main session instead of a forked subagent
context: fork
---

# tech-trend-analysis

> **Status:** frontmatter-only stub created in build phase 1. The full procedure is added in build phase 5.

## When to use

After innovation discovery in an `analyze` run, or standalone when the user says *tech trends*, *what are competitors using*, *tech radar*.

## Procedure

*To be written in build phase 5.* Covers workflow step(s) 11 of the
[Business Requirements agent](../../agents/business-requirements.agent.md).

## Input / output contract

- **Reads:** `requirements/requirements.json` (or `requirements/.state/draft.json` inside a run)
- **Writes:** *to be defined in build phase 5*

When invoked alone as `/tech-trend-analysis`, read the current `requirements/requirements.json`; do not assume an in-progress session.
