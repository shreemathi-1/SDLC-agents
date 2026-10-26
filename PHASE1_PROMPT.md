You are building Phase 1 of an SDLC agent system for web and mobile apps. Build agent definitions and skill files only. Do not build the user's app.

Attached (source of truth), all in input/:
- skills.csv: 128 skill rows (ID, Agent, Skill, Phase, Human gate). Phase 1 rows have Phase = 1.
- agents_and_plan.md: the 8 agents, phases, kanban columns, rules R1–R10, implementation steps.
- project_summary.md: project goal, build instructions, sprint 1 goal.
- agents_skills_board.png: visual of agents and skills by phase (reference only).
- Skill descriptions: only if SDLC_Agent_Skills_Excel.xlsx is attached as CSV or Markdown; otherwise none.

Scope
- Build only skills.csv rows where Phase = 1. Expect 65. Do not create Phase 2 or 3 skills.
- Agent IDs and jobs come only from agents_and_plan.md.

Do not invent
- If a skill's purpose, steps, inputs, or outputs are not in an attached file, write TBD and add it to Open questions. Do not guess.
- Do not choose a framework (React Native or Flutter). Write TBD and ask me.
- Do not set numbers (limits, budgets, sizes) that are not in the files.
- Label any proposed default PROPOSED, with a reason.

Build
1. agents/A1-orchestrator.md through agents/A8-reviewer-release.md. Each file: ID, job, permissions (from agents_and_plan.md), and the Phase 1 skill IDs it owns.
2. skills/<ID>.md for each Phase 1 skill (for example skills/A2.01.md). Fields: Agent, Skill, Phase 1, Human gate (from skills.csv), Purpose (from an attached description, else TBD), Steps (TBD unless given), Verification (R1–R10 apply). Keep each file under 40 lines.
3. kanban writer: only A1 may write kanban.md. Columns come from agents_and_plan.md. A1 moves an item only when the exit criteria are verified and the evidence is recorded. A gate sets "Awaiting approval: <role>" and does not move the item until a named approval is recorded in History with a date. Every move adds one History row.
4. rules/R1-R10.md from agents_and_plan.md, referenced by every agent file.

Hard rules
- Gates are human. No agent marks Ready, design approval, Quality GO, or release approval as done.
- The Reviewer & Release agent (A8) does not approve its own release.
- Missing values: TBD plus an open question.

Test
- Dry-run one text-only sample story through Phase 1: no app code, no commits. Use a sample story only if I give one; otherwise ask me for it.
- Record each handoff as a History row in kanban.md.

Limits
- Do not run git commit or git push.
- Do not install packages without asking.
- Stop and report before building if any attached file is missing or the Phase 1 count is not 65.

Report at the end, 15 lines maximum
- Files created, per folder.
- Phase 1 count check (must be 65).
- Open questions.
- Number of TBD fields.
- Anything you could not do.
