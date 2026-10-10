# sdlc-agents

An agentic SDLC pipeline that runs entirely inside **VS Code + GitHub Copilot**. No UI, no backend:
all agent configuration lives in `.github/`, all state persists as files in the client repo.

```
Figma / screenshot / raw client story
        ↓
  User Story Agent            →  user-stories/US-###-*.md
        ↓
  Business Requirements Agent →  requirements/   (requirements.json + generated .md views)
        ↓
  [future] Planning → Architecture → Development → Code Review → Testing → Deployment
```

This repo is the **scaffold**. Build and test the agents here; copy `.github/` into each client project.

## Layout

```
.github/
├── copilot-instructions.md          repo-wide, always loaded (kept tiny)
├── agents/                          ONE .agent.md per agent — nothing else goes in here
│   └── business-requirements.agent.md
├── instructions/
│   └── requirements-output.instructions.md   applyTo: requirements/**
└── skills/<skill-name>/SKILL.md     Agent Skills (also slash commands); references/ linked from SKILL.md
requirements/.state/                 pristine seeds: id-registry.json, innovation-decisions.json, run-log.md
user-stories/                        input (empty here)
examples/sample-user-stories/        test fixtures + review checklist (build phase 8)
scripts/verify-scaffold.mjs          frontmatter + JSON-schema checks → npm run verify
```

## Use in a client project

1. Copy `.github/` into the client repo root. If the client already has a
   `.github/copilot-instructions.md`, **merge** the pipeline lines into it instead of overwriting.
   If `.github/agents/` already exists, make sure no other `.md` files are in it (every `.md` there is loaded as an agent).
2. Copy `requirements/.state/` (the three seed files) and create `user-stories/`.
3. Open the client repo in VS Code. In the Chat view, right-click → **Diagnostics** and confirm the agent,
   the instruction file and the skills are listed with no errors.
4. Select **Business Requirements** in the agents dropdown and run `analyze` (default) or
   `analyze path/to/stories`. Other modes: `update`, `promote`, `validate`, `summary`.

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
NFR ⇒ metric, ID prefix ⇔ type). If `requirements/requirements.json` exists it is validated too.

## Build status

| Phase | Content | Status |
|---|---|---|
| 1 | Foundation: schema, state seeds, agent skeleton, instructions, skill stubs | done |
| 2 | `requirements-extraction` end to end on a sample story | next |
| 3 | `requirements-ambiguity-gap`, `business-rules-extraction`, `scope-dependency-risk` | — |
| 4 | `requirements-prioritization` (questions, MoSCoW, phases, traceability) | — |
| 5 | `innovation-discovery` (150+ catalogue, scoring), `tech-trend-analysis` | — |
| 6 | `requirements-validation-gate` incl. contamination test case | — |
| 7 | `requirements-documentation` (templates, all views) | — |
| 8 | `examples/sample-user-stories/` + review checklist | — |
