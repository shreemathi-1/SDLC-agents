# Worked example: US-001 after step 6

- Input: the step 5 output, `requirements-ambiguity-gap/references/worked-example.draft.json`.
- Output: [worked-example.draft.json](worked-example.draft.json).

| Candidate | Source | Decision |
|---|---|---|
| "Appointments can only be booked between 24 hours and 60 days in advance." | Details | **Already BR-001** (from step 3, TIME_BASED). Nothing new. |
| "the slot is no longer shown as free" | Acceptance criterion 1 | **New BR-002**: DATA_CONSTRAINT, EXPLICIT. The evidence is quoted verbatim from the criterion. It constrains every booking path, not just FR-001's screen. |
| "ClinicDesk stays our master calendar" | Details | **Not a rule.** It restricts how the system is built, so it stays CON-001. |
| Confirmation email "with the date, time and dentist" | Details | **Not a rule.** It describes what the email contains, so it is part of FR-002. |
| "Only existing patients can book" | (nowhere) | **Not created.** Nothing in the story says this. Who may book is already asked as Q-004. |

Links: FR-001 `business_rules` = `[BR-001, BR-002]`. Both rules govern a requirement.

BR-002 gets its own acceptance criterion, which a tester could fail:
> Given a slot has just been booked, when another patient views the calendar, then that slot is not shown as free.
