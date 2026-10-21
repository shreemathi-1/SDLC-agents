# Worked example: US-001 after step 10

- Input: the step 9 output, `scope-dependency-risk/references/worked-example.draft.json`.
- Output: [worked-example.draft.json](worked-example.draft.json). It holds 30 catalogue ideas and 3 bold bets, all PENDING.

## Product profile

| Aspect | Value |
|---|---|
| Domain | `healthcare`, `appointment-scheduling` |
| Goal | Patients book without phoning a swamped front desk |
| Capabilities present | `scheduling` (FR-001), `notifications` (FR-002), `forms` and `public-forms` (the booking page), `external-system` (IR-001), `history-data` (ClinicDesk holds visit history) |
| Capabilities pending a question | `user-accounts`, waiting on Q-004 |
| Capabilities absent | `location`, `payments`, `content`, `multi-user`, `messaging`, `documents` |

## Filtered out (examples)

| Catalogue key | Reason |
|---|---|
| `int-maps-directions` | Needs `location`, which the product doesn't have |
| `ops-admin-console`, `ops-disaster-recovery` | ClinicDesk owns the settings and data, so relevance is 2 |
| `ux-multilingual` | No sign of more than one language, so relevance is 2 |
| `collab-video-visits`, `int-ehr-fhir` | Healthcare ideas, but not part of dental booking, so relevance is 2 |
| `ai-demand-forecast` | Low user value for one practice; ranked below the cut |

## Selected

| ID | Catalogue key | Level | Score | Phase |
|---|---|---|---|---|
| INN-001 | auto-reminders | L1 | 4.75 | PHASE_2 (waits on Q-006) |
| INN-002 | int-calendar-sync | L1 | 4.45 | MVP |
| INN-003 | perf-core-web-vitals | L1 | 4.10 | PHASE_2 (waits on Q-001) |
| INN-004 | ux-skeleton-loading | L1 | 3.60 | MVP |
| INN-005 | sec-magic-links | L1 | 3.80 | PHASE_2 (waits on Q-004) |
| INN-006 | auto-rebooking | L1 | 4.00 | PHASE_2 (waits on Q-007) |
| INN-007 | an-funnel-tracking | L1 | 3.65 | PHASE_2 (waits on Q-005) |
| INN-008 | eng-reviews | L1 | 3.75 | MVP |
| INN-009 | sec-bot-protection | L1 | 3.50 | MVP |
| INN-010 | mob-qr-checkin | L1 | 3.25 | MVP |
| INN-011 | pers-preferred-provider | L1 | 3.50 | PHASE_2 (waits on Q-004) |
| INN-012 to INN-024 | 13 L2 ideas: availability calendar view, availability cache, graceful fallback, waitlist, recall campaigns, intake forms, booking widget, messaging channels, accessible design system, consent, audit trail, utilisation, recurring bookings | L2 | 3.25–4.40 | PHASE_2 |
| INN-025 to INN-030 | 6 L3 ideas: book from search, no-show prediction, booking assistant, insurance check, field encryption, preventive nudges | L3 | 2.85–3.70 | PHASE_3 |
| INN-031 | **Bold bet:** treatment-plan booking | L4 | 3.20 | FUTURE |
| INN-032 | **Bold bet:** family check-up day | L4 | 3.25 | FUTURE |
| INN-033 | **Bold bet:** smile timeline | L4 | 3.00 | FUTURE |

Quotas:
- L1 took 11 ideas and L2 took 13, so they absorbed the shortfall from L3, which has only 6 qualifying ideas.
- No catalogue idea reached L4 for this product, so the 3 bold bets fill that level.
- The list was **not padded** to reach 40.

## What this step did not do

- **Reminders** (INN-001) and **rescheduling** (INN-006) were *not* added as requirements, even though they score highest. The client said both are undecided (Q-006, Q-007), so they stay as PENDING ideas. Only an ACCEPT followed by `promote` can turn them into requirements.
- No requirement, priority or question was changed.
