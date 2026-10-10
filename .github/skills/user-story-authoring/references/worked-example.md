# Worked example: client email → US-001 (step 0)

Input: `examples/raw-input/brightsmile-email.md`, copied below.
Expected output: `examples/sample-user-stories/US-001-book-appointment-online.md`.
`npm run verify` checks that the output follows the [template](story-template.md) and that every
quote under *Client's words* appears verbatim in the email.

## Input

```text
Subject: Online booking for Brightsmile

Hi team,

Our patients keep complaining that they can only book by calling us, and the front desk is swamped during opening hours. We'd like patients to book their cleanings and check-ups online. They should pick the dentist, the type of treatment and a free slot from the calendar.

A few things that matter to us:

- No same-day surprises: bookings need at least 24 hours' notice, and we don't open the diary more than 60 days ahead.
- Patients should get a confirmation email with the date, time and which dentist they'll see.
- Most people will do this on their phone, so the booking page needs to be quick.
- We're not changing practice software. ClinicDesk stays our master calendar.

Our designer has started on the screens: https://www.figma.com/file/AbC123/Clinic-Booking?node-id=12-34 (mobile mock in designs/booking-mobile.png).

Not sure yet whether we want patients to be able to cancel online, and we haven't decided about reminders.

Thanks,
The practice manager
```

## Decisions

| Material | Became | Why |
|---|---|---|
| "can only book by calling us … front desk is swamped" | The **So that** clause | This is the business problem, in the client's terms. |
| "book their cleanings and check-ups online … pick the dentist, the type of treatment and a free slot" | The **I want** clause and the first Details bullet | This is the one user goal, so there is **one story**. |
| "24 hours' notice … 60 days ahead" | A Details bullet and the second acceptance criterion | It is a firm rule with numbers. |
| "confirmation email with the date, time and which dentist" | A Details bullet | This is a separate behaviour of the same goal, so it stays in this story. |
| "the booking page needs to be quick" | A Details bullet, **plus an Open point**: no target is given | The need is stated but not measurable. Do not invent a number. |
| "ClinicDesk stays our master calendar" | A Details bullet | It is a constraint. Kept as stated. |
| Figma URL and screenshot path | The Design section, verbatim | Later steps carry them into `source_refs`. |
| "Not sure yet … cancel online … reminders" | **Open points** | The client explicitly hasn't decided. These are **not** stories. |
| The greeting and signature | Nothing | They carry no requirement. |

## What was deliberately not written

- A cancellation story or a reminder story. The client says these are undecided, so writing one would put words in the client's mouth.
- Login, payment or a patient account. The email doesn't mention them, so they are not invented here. The gap analysis (step 5) may raise them later.
- A load time such as "under 3 seconds". That is a value the client must give.
