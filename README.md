# sdlc-agents

An agentic SDLC pipeline that runs entirely inside **VS Code + GitHub Copilot**. No UI, no backend:
all agent configuration lives in `.github/`, all state persists as files in the client repo.

```
raw-input/ (client notes, emails, Figma links, screenshots)
        ↓
  1. Requirements / PM   →  user-stories/US-###-*.md  →  requirements/  (requirements.json + .md views)
        ↓   human approves requirements
  2. Architecture        →  architecture/  (ADRs, models, API contracts, tasks.json)
        ↓
  3. Coding              →  application source  (one task at a time, incl. design-to-code)
        ⇅
  4. QA & Review         →  tests/, qa/  (tests traced to acceptance criteria, PR review, refactors)

  5. Orchestrator        →  pipeline/state.json  (built last; then owns workflow and delegation)
```

## Agents and build order

Agents are built **one at a time**. Each must meet the done criteria before the next starts, and the
Orchestrator comes last. Until it exists, agents chain with `handoffs:` and a human starts each one.

| # | Agent | File | Status |
|---|---|---|---|
| 1 | Requirements / PM | `.github/agents/requirements.agent.md` | in progress |
| 2 | Architecture | `.github/agents/architecture.agent.md` | not started |
| 3 | Coding / Implementation | `.github/agents/coding.agent.md` | not started |
| 4 | Testing / QA & Review | `.github/agents/qa-review.agent.md` | not started |
| 5 | Planner / Orchestrator | `.github/agents/orchestrator.agent.md` | not started (last) |

**Done criteria for each agent:**
- The agent file and all its skills are complete, with no stub procedures.
- It has state seeds and an output schema.
- It has a worked example and fixtures in `examples/`.
- `npm run verify` covers its output and passes.
- It has had one reviewed live Copilot run.

This repo is the **scaffold**. Build and test the agents here; copy `.github/` into each client project.

## Layout

```
.github/
├── copilot-instructions.md          repo-wide, always loaded (kept tiny)
├── agents/                          ONE .agent.md per agent — nothing else goes in here
│   └── requirements.agent.md
├── instructions/
│   └── requirements-output.instructions.md   applyTo: requirements/**
└── skills/<skill-name>/SKILL.md     Agent Skills (also slash commands); references/ linked from SKILL.md
requirements/.state/                 pristine seeds: id-registry.json, innovation-decisions.json, run-log.md
raw-input/                           client material for `stories` mode (not in this repo; create it in the client repo)
user-stories/                        stories written in `stories` mode, input to `analyze` (empty here)
examples/raw-input/                  sample client email (fixture for user-story-authoring)
examples/sample-user-stories/        sample stories (fixture for requirements-extraction) + review checklist
scripts/verify-scaffold.mjs          frontmatter, schema, gate and view checks → npm run verify
scripts/render-views.mjs             reference renderer for the requirements/ views (golden examples)
```

## Use in a client project

1. Copy `.github/` into the client repo root. If the client already has a
   `.github/copilot-instructions.md`, **merge** the pipeline lines into it instead of overwriting.
   If `.github/agents/` already exists, make sure no other `.md` files are in it (every `.md` there is loaded as an agent).
2. Copy `requirements/.state/` (the three seed files) and create `raw-input/` and `user-stories/`.
3. Open the client repo in VS Code. In the Chat view, right-click → **Diagnostics** and confirm the agent,
   the instruction file and the skills are listed with no errors.
4. Select **Requirements / PM** in the agents dropdown. Put the client material in `raw-input/` (or paste it)
   and run `stories`. Review and edit the generated `user-stories/`, then run `analyze`.
   Other modes: `update`, `promote`, `validate`, `summary`.

## Settings (VS Code, Sept 2026)

No setting is required for custom agents, skills or instruction files. `chat.agentFilesLocations` and
`chat.agentSkillsLocations` are deprecated — do not set them. Keep the defaults
`github.copilot.chat.codeGeneration.useInstructionFiles` and `chat.includeApplyingInstructions` on.
`github.copilot.chat.skillTool.enabled` is tied to `context: fork` (used by `innovation-discovery` and
`tech-trend-analysis`); if forked skills misbehave, enable it or delete the `context: fork` line.

## Verify the scaffold

```sh
npm install
npm run verify
```

Checks every frontmatter block (skill `name` == folder, ≤ 1024-char description, linked reference
files exist, agent `tools` is a list, instructions have `applyTo`), compiles the requirements JSON Schema,
and asserts its conditional rules (EXPLICIT ⇒ evidence, INFERRED/RECOMMENDED ⇒ rationale, UNKNOWN ⇒ question,
NFR ⇒ metric, ID prefix ⇔ type). It then validates the extraction worked example and, when present,
`requirements/.state/draft.json` and `requirements/requirements.json`, including cross-checks the schema
cannot express: EXPLICIT evidence appears verbatim in its source story, every linked `Q-###` exists and
lists the item in `blocks`, and an NFR with target `UNKNOWN` has origin `UNKNOWN`.

## Build status: agent 1, Requirements / PM

| Phase | Content | Status |
|---|---|---|
| 1 | Foundation: schema, state seeds, agent skeleton, instructions, skill stubs | done |
| 2 | `requirements-extraction` (steps 1–3) end to end on a sample story | done |
| 2b | `user-story-authoring` (step 0, `stories` mode): raw input → `US-###` stories; the old User Story agent is merged in | done |
| 3 | `requirements-ambiguity-gap`, `business-rules-extraction`, `scope-dependency-risk` (steps 4–9) | done |
| 4 | `requirements-prioritization` (steps 12–13: questions, MoSCoW, phases, traceability) | done |
| 5 | `innovation-discovery` (156-entry catalogue, scoring), `tech-trend-analysis` (34-trend library) | done |
| 6 | `requirements-validation-gate` (mid, pre-output, standalone) incl. contamination test case | done |
| 7 | `requirements-documentation` (step 15: IDs committed to the registry, 8 views, read-back of human edits) | done |
| 8 | Review checklist + live Copilot run: `stories` on `examples/raw-input/`, then `analyze` | next |

"Done" for phases 2–7 means the procedure, worked example and verify checks are in place. None has been run live in Copilot yet; that happens in phase 8.
