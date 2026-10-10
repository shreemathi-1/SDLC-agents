# Agentic SDLC pipeline (runs inside VS Code + Copilot; no UI, no backend; all state is files in this repo)

Pipeline (5 agents): **Requirements / PM** (raw input → `user-stories/` → `requirements/`) → [future] **Architecture** (`architecture/`) → **Coding** → **QA & Review** (`qa/`), coordinated by a [future] **Orchestrator** (`pipeline/`), which is built last.

- For any user-story or requirements work, select the **Requirements / PM** agent from the agents dropdown; do not do it in the default agent.
- `requirements/requirements.json` is the source of truth; every `.md` under `requirements/` is a generated view of it. Edit the JSON, then regenerate the views.
- IDs (`FR`, `NFR`, `BR`, `DR`, `IR`, `SR`, `CR`, `CON`, `ASM`, `DEP`, `RISK`, `Q`, `INN`, `TRD`, `US`) are permanent: never renumber, reuse or delete one.
- Only a human may set a requirement to `APPROVED` or `BASELINED`; agents never do.
