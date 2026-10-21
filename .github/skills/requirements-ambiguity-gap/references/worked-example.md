# Worked example: US-001 after steps 4–5

- Input: the extraction output, `requirements-extraction/references/worked-example.draft.json`.
- Output: [worked-example.draft.json](worked-example.draft.json).
- Domain: `healthcare`, `appointment-scheduling`.

## Step 4: ambiguities

| Item | Pattern | Recorded? | Question |
|---|---|---|---|
| FR-001 "a treatment type" | Undefined term | yes, IMPORTANT | Q-002 (new): which treatments can be booked online |
| FR-001 "a free time slot" | Missing granularity | yes, IMPORTANT | Q-003 (new): slot length |
| NFR-001 "load fast" | Vague quality | yes, IMPORTANT | **Q-001, reused** from step 3, so no duplicate question |
| BR-001 "between 24 hours and 60 days" | Unclear boundary | **no** | The client's email says "at least 24 hours' notice" and "not more than 60 days ahead". Both ends are clear, and a single practice has one time zone, so every reader would build the same rule. |
| FR-002 "receives a confirmation email" | Unstated error behaviour | **no** | Failure cases are collected in the ERROR_HANDLING gap below. |

## Step 5: gaps

| Category | Severity | Why | Question |
|---|---|---|---|
| AUTH | CRITICAL | `healthcare`: a booking is tied to a patient record | Q-004 |
| COMPLIANCE | CRITICAL | `healthcare`: treatment type is health data. SECURITY, AUDIT_LOGGING and DATA_RETENTION are **folded in**, because they all depend on the regime | Q-005 |
| NOTIFICATIONS | IMPORTANT | From the story's Open points ("reminders"), so at least IMPORTANT | Q-006 |
| WORKFLOWS | IMPORTANT | From the story's Open points ("cancel online") | Q-007 |
| ERROR_HANDLING | IMPORTANT | ClinicDesk is down, a double booking, or a failed email. INTERNAL audience | Q-008 |
| ACCESSIBILITY | IMPORTANT | A public booking page; no standard is named | Q-009 |

Considered but **not** gaps (these go in the run-log note):
- ROLES: only the patient acts.
- PAYMENTS: nothing is sold.
- INTEGRATIONS: ClinicDesk is already covered by IR-001.
- PERFORMANCE: already covered by NFR-001 and Q-001.
- ADMIN and BACKUP_RECOVERY: ClinicDesk is the master of all configuration and data.
- VALIDATION: the only inputs are picks from a list.
- ANALYTICS, MONITORING and LOCALIZATION: nothing in the story or domain calls for them.

No requirement was added. Every gap's `resulting_requirements` is `[]`.

## Status after step 5

| Item | Open questions | Status |
|---|---|---|
| FR-001 | Q-002, Q-003, Q-004, Q-005, Q-007, Q-009 | NEEDS_CLARIFICATION |
| FR-002 | Q-005, Q-006, Q-008 | NEEDS_CLARIFICATION |
| NFR-001 | Q-001 | NEEDS_CLARIFICATION |
| IR-001 | Q-008 | NEEDS_CLARIFICATION |
| BR-001, CON-001 | none | ANALYZED |
