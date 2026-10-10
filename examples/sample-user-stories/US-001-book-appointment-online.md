---
id: US-001
title: Patient books an appointment online
source:
  - examples/raw-input/brightsmile-email.md
---

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

## Client's words

> Our patients keep complaining that they can only book by calling us, and the front desk is swamped during opening hours.

> They should pick the dentist, the type of treatment and a free slot from the calendar.

> bookings need at least 24 hours' notice, and we don't open the diary more than 60 days ahead.

> Patients should get a confirmation email with the date, time and which dentist they'll see.

> Most people will do this on their phone, so the booking page needs to be quick.

> ClinicDesk stays our master calendar.

## Open points

- No target load time is given for "quick".
- The client hasn't decided whether patients can cancel online.
- The client hasn't decided about appointment reminders.
