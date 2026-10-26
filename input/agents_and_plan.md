# Agents and plan (from SDLC_Claude_Code_Input.xlsx)

## Agents

| ID | Agent | Job | Permissions |
|---|---|---|---|
| A1 | Orchestrator | Routes work, checks exit criteria, updates kanban.md | Write kanban.md; read code only |
| A2 | Requirements | Intake, user stories, acceptance criteria, UX spec, open questions | Read kanban.md; send status events to A1; read Figma/screenshot |
| A3 | UI Designer | UI/UX baseline, component specs, design tokens | Read Figma/screenshot; write UI specs |
| A4 | Architect | Architecture, ADRs, API contracts, task breakdown | Read code; write docs |
| A5 | Developer | Implements web or mobile features, unit tests in Task Gate | Read/write code; open PRs |
| A6 | Test Engineer | Test plans, tests, traceability, quality summary | Read/write tests |
| A7 | BFF Engineer | Backend-for-Frontend spec, code, contract checks | BFF repo only |
| A8 | Reviewer & Release | Reviews PRs; prepares releases | Review read-only; release needs human approval |

## Phases

| Phase | Name | Goal | Exit criteria (proposed) |
|---|---|---|---|
| 1 | Thin slice | Text story through every agent to a released app | A text-only feature passes all gates and ships |
| 2 | Depth | Figma and screenshot input, security and accessibility depth, BFF checks, E2E | A Figma-based feature passes UI/UX checklist and security review |
| 3 | Optional | Store, OTA, staged rollout, metrics, retrospectives | Releases roll out in stages with metrics |
| KANBAN (kanban.md) |  |  |  |
| Column | Owner | Human approval | Note |
| Backlog | A1 | No |  |
| Ready | A2 | Yes: Product Owner |  |
| Design | A4, A3, A7 | Yes: design approval | A3 always runs; text input gets a PROPOSED baseline |
| In Progress | A5 | No | Task Gate: lint, types, unit tests |
| Testing | A6 | Yes: Quality GO |  |
| Review | A8 | Only at fix-loop limit |  |
| Release Ready | A8 | Yes: release approval |  |
| Done | A1 | No |  |

## Rules

| R1 | Every item cites its source ID |  |  |
|---|---|---|---|
| R2 | Missing values = TBD + open question; never guess |  |  |
| R3 | Agents propose options; humans decide |  |  |
| R4 | Fresh-context check before each handoff |  |  |
| R5 | Agents never mark gates done |  |  |
| R6 | Fix loops have a limit; then a human decides |  |  |
| R7 | Tool results (lint, tests, scans) beat model opinion |  |  |
| R8 | Every output has an open-questions section |  |  |
| R9 | Reviewer does not approve its own release |  |  |
| R10 | Proposed defaults labeled PROPOSED; human approves |  |  |

## Implementation Steps

| 1 | Create agent definitions A1 to A8 from the Agents sheet |  |  |
|---|---|---|---|
| 2 | Create one SKILL.md per Phase 1 skill in the Skills sheet |  |  |
| 3 | Create the kanban.md writer; only A1 may use it |  |  |
| 4 | Put rules R1 to R10 into every agent |  |  |
| 5 | Test: run one text-only story through Phase 1 |  |  |
| 6 | Add Phase 2, then Phase 3, after Phase 1 passes |  |  |
