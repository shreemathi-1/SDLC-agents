# Open questions

## Resolved (input/open_questions_answers.md)
- Skill descriptions: supplied via input/phase1_skill_details.csv (all 65 Purposes; Steps and Verification are PROPOSED).
- Framework: not fixed for the system; each project picks one in the A4.02 ADR with human approval.
- A2 and kanban.md: A2 read-only, sends status events to A1. input/agents_and_plan.md updated.
- All.01-All.06: shared by every agent, no split.
- Sample story: input/sample_story.md (T-01).

## Needs human decision
1. R6 fix-loop limit: PROPOSED 3 loops. Approve? (used in R6, A8.09)
2. Approver roles: PROPOSED Product Owner for Ready, design approval, and release approval; QA lead for Quality GO, fallback Product Owner. Approver at the Review fix-loop limit: TBD. Approve?
3. Commit rule: PROPOSED one A1 commit per status event that moves an item. Confirm. (Not applied in this build.)
4. Column exit criteria: your answer says they are in kanban.md, but kanban.md has none and none are in input/. Please supply them (A1.03, A1.05 depend on them).
5. Team Definition of Ready text: TBD (A2.05).
6. Repo/template location for the structure check: TBD (A4.06).
7. Original .xlsx/.pptx were not attached; input/ holds converted copies. Confirm they are complete.

## T-01 dry run
- Platforms, persistence, currency, sample product data, loading/error states: TBD (see dry-run/T-01-A2-output.md).
- Dry run stopped at the Ready gate: no Product Owner approval is recorded.
