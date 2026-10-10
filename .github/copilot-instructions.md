# Agentic SDLC pipeline (runs inside VS Code + Copilot; no UI, no backend; all state is files in this repo)

Pipeline: Figma / screenshot / client story → **User Story Agent** (`user-stories/*.md`) → **Business Requirements Agent** (`requirements/`) → [future] Planning → Architecture → Development → Code Review → Testing → Deployment.

- For any requirements work, select the **Business Requirements** agent from the agents dropdown; do not do it in the default agent.
- `requirements/requirements.json` is the source of truth; every `.md` under `requirements/` is a generated view of it. Edit the JSON, then regenerate the views.
- IDs (`FR`, `NFR`, `BR`, `DR`, `IR`, `SR`, `CR`, `CON`, `ASM`, `DEP`, `RISK`, `Q`, `INN`, `TRD`, `US`) are permanent: never renumber, reuse or delete one.
- Only a human may set a requirement to `APPROVED` or `BASELINED`; agents never do.
