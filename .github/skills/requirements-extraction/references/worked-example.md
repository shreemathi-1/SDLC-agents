# Worked example: US-001 → draft.json (steps 1–3)

Input: `examples/sample-user-stories/US-001-book-appointment-online.md`. Its main sections are copied below; the *Client's words* and *Open points* sections are left out because neither produces requirements here.
Expected output: [worked-example.draft.json](worked-example.draft.json). `npm run verify` checks that the
output is schema-valid and that every `evidence` quote appears verbatim in the story.

## Input story

```markdown
# US-001 — Patient books an appointment online

**As a** patient of Brightsmile Dental
**I want** to book a cleaning or check-up appointment online
**So that** I don't have to phone the front desk during opening hours.

## Details
- The patient picks a dentist, a treatment type and a free time slot from the calendar.
- Appointments can only be booked between 24 hours and 60 days in advance.
- After booking, the patient receives a confirmation email with the date, time and dentist.
- The booking page should load fast, even on mobile.
- We must keep using our existing practice-management system (ClinicDesk) as the master calendar.

## Acceptance criteria
- Given a patient on the booking page, when they select a dentist, treatment and free slot and confirm, then the appointment is saved and the slot is no longer shown as free.
- Given a slot less than 24 hours away, when the patient views the calendar, then the slot cannot be selected.

## Design
- Figma: https://www.figma.com/file/AbC123/Clinic-Booking?node-id=12-34
- Screenshot: designs/booking-mobile.png
```

## Step 1: parse

| Element | Found |
|---|---|
| Actors | Patient (primary), front-desk staff (mentioned) |
| Goal | Book without phoning during opening hours |
| Features | Pick dentist, treatment and slot; confirmation email |
| Data | Dentist, treatment type, time slot, appointment, patient email |
| Constraints | ClinicDesk stays the master calendar; 24 h–60 day window |
| Outcome | Appointment saved, slot no longer free |
| Design refs | Figma link and screenshot path, carried into `stories[].source_refs` |
| Domain | `healthcare`, `appointment-scheduling` |

## Steps 2–3: extract and classify

| ID | Origin | Why |
|---|---|---|
| FR-001 | EXPLICIT | A system behaviour stated in the story. Its acceptance criterion is copied from the story. |
| FR-002 | EXPLICIT | A separate behaviour, so it is split from FR-001. The criterion is rewritten from the evidence; no new facts are added. |
| BR-001 | EXPLICIT | A policy with numbers given by the client. Category `TIME_BASED`. It owns the story's second criterion. |
| NFR-001 | **UNKNOWN** | "Load fast" has no number. `target: "UNKNOWN"`, linked to Q-001. The evidence is still recorded because the need itself is explicit. **No number is invented.** |
| CON-001 | EXPLICIT | Restricts the solution rather than describing a behaviour. |
| IR-001 | **INFERRED** | Not stated, but follows from CON-001 and FR-001. It has a rationale and no evidence. Confidence is MEDIUM. |

What was deliberately **not** extracted here:
- The list of treatment types, and whether front-desk staff can override the window. These are ambiguities and gaps, handled in step 4.
- Authentication, reminders, cancellation and GDPR/HIPAA. These are gaps for step 5.
- Online payment. Nothing in the story points to it, so it is not inferred.

## Provisional fields

- `priority` is `MUST` only where the story says *must* or *can only* (BR-001, CON-001). Everything else is `SHOULD`.
- `phase` is `MVP` and `priority_status` is `PROPOSED` everywhere. Step 13 replaces both values.
- `status` is `DRAFT` everywhere.
