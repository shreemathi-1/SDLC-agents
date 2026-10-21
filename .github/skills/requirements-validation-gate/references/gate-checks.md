# Gate checks

Each check has a `check` code (one of the schema's `validation_issue.check` values), a severity, and an auto-fix policy. **"Verify"** marks a rule that `npm run verify` also enforces with the same logic, so the two cannot drift apart.

The **Gate** column says when a check runs: **mid** (after step 5), **pre** (step 14) or **all** (mid, pre, and `validate` mode).

## BLOCKING checks

A pre-output gate with any of these unresolved returns **FAIL**, and step 15 doesn't publish.

| Code | Rule | Gate | Verify |
|---|---|---|---|
| SCHEMA | The document validates against `requirement-schema.json` | all | yes |
| TRACEABILITY | Every EXPLICIT item's `evidence` is verbatim in a source story | all | yes |
| TRACEABILITY | Every active story is traced by at least one requirement, and every requirement has a source story or a `promoted_from` | all | yes |
| TRACEABILITY | An unverified trend carries exactly `unverified; check before client presentation` | pre | yes |
| CONSISTENCY | Every referenced ID exists: `dependencies`, `business_rules`, `open_questions`, `risks`, `blocks`, ambiguities, gaps, `risks.related`, `applies_to`, innovation `dependencies` | all | yes |
| CONSISTENCY | `open_questions` and `blocks` agree in both directions. A WITHDRAWN question is no longer linked | all | yes |
| CONSISTENCY | Each `business_rules` entry is a BR, and each BR governs at least one requirement | pre | yes |
| CONSISTENCY | A dependency cycle has a risk covering every member | pre | yes |
| CONSISTENCY | An NFR with target `UNKNOWN` has origin UNKNOWN | all | yes |
| CONSISTENCY | OUT or FUTURE items have a `scope_reason`, priority NOT_NOW and phase FUTURE | pre | yes |
| CONSISTENCY | A MUST item depends only on MUST items, and no item depends on one in a later phase | pre | yes |
| CONSISTENCY | Catalogue and library keys exist, and `weighted_total` matches the formula | pre | yes |
| COMPLETENESS | Every UNKNOWN item has an OPEN question. Every OPEN question blocks something and offers an "Option: …" | all | yes |
| LIFECYCLE | NEEDS_CLARIFICATION means at least one OPEN question is linked | all | yes |
| LIFECYCLE | APPROVED, BASELINED or a CONFIRMED priority has a `change_log` entry `by: "human"` | all | yes |
| ID_REGISTRY | No ID is duplicated. Once published, every ID is within the registry counters, and no registry ID is reused for a different item | pre | yes |
| **SCOPE_CONTAMINATION** | A requirement comes from an innovation only through ACCEPT and `promote`, with `promoted_from` and `promoted_to` pointing at each other | all | yes |
| **SCOPE_CONTAMINATION** | No unpromoted requirement has an innovation's title, or cites an `INN-` or `TRD-` ID in its text | all | yes |
| **SCOPE_CONTAMINATION** | No NFR target uses a number that appears in no story and no answered question | all | yes |
| **SCOPE_CONTAMINATION** | No question is ANSWERED by the agent. Only a human answers questions | all | yes |
| **SCOPE_CONTAMINATION** | No gap has produced requirements while its question is unanswered | all | yes |
| **SCOPE_CONTAMINATION** | No INFERRED item fills in a decision an OPEN question is asking for. Example: "patients log in with email" while Q-004 asks how patients identify | all | no (judgement) |

## WARNING checks

These are reported but never block.

| Code | Rule | Gate | Verify |
|---|---|---|---|
| TESTABILITY | Every non-DRAFT, non-NEEDS_CLARIFICATION requirement has at least one acceptance criterion. CON, ASM and DEP items are exempt | pre | yes (as a warning) |
| DUPLICATION | No two active requirements share a normalised title or evidence | all | yes (as a warning) |
| AMBIGUITY | Every vague term from `requirements-ambiguity-gap/references/ambiguity-patterns.md` is covered by an ambiguity or a question | all | no (judgement) |
| FEASIBILITY | A MUST MVP item that relies on an IR with an OPEN BLOCKING question or a HIGH/HIGH risk is flagged, so the client sees what MVP depends on | pre | no (judgement) |

## Auto-fix policy

The gate fixes an issue itself **only** if the fix restores a fact that is already recorded somewhere else. When it does, it sets `auto_fixed: true` on the issue.

**Safe to fix:**
- A missing back-link (a question's `blocks`, a requirement's `risks[]` or `open_questions`) when the other side already records the link.
- A `status` that contradicts its linked questions, for example NEEDS_CLARIFICATION with no OPEN question.
- A miscalculated `weighted_total`.
- A missing or wrong standard verification note.
- **Contamination created in the current run and not yet published** (its ID isn't in the registry):
  - Remove the leaked requirement. The idea remains as its INN.
  - Put an agent-answered question back to `OPEN`, and clear `answer`, `answered_by` and `answered_on`.
  - Empty `resulting_requirements` on a gap.
  - Replace an invented NFR target with `UNKNOWN`, set the origin to UNKNOWN, and link the question.

  Each of these fixes is still reported, so the user can see the agent tried to leak.

**Never fixed by the gate:**
- Anything changing what the client said: evidence, scope, priority, origin of human-set items.
- Contamination in **published** items (IDs already in the registry). Report it as BLOCKING for a human to resolve; the item is never deleted. A human may mark it DEPRECATED.
- Any human decision, such as APPROVED, CONFIRMED, ACCEPT, REJECT or DEFER, or an answer given by a human.
