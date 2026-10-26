# All.01 Source traceability check

- Agent: All agents
- Skill: Source traceability check
- Phase: 1
- Human gate: No

## Purpose
Every output item cites its source (input ID, Figma node ID, screenshot region, doc section, file and line); untraceable items are flagged
(Source: SDLC_Agent_Skills_Excel.xlsx, via input/phase1_skill_details.csv)

## Steps (PROPOSED, human approves; R10)
1. Check each output item has a source ID.
2. Flag items with no source.

## Verification (PROPOSED)
Zero items are left without a source or a flag.
Rules [R1-R10](../rules/R1-R10.md) also apply.
