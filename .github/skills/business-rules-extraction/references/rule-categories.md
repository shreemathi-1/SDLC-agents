# Business rule categories (step 6)

A **business rule** is a policy the business would keep even if the software were replaced by paper. It constrains *what is allowed*, while a feature describes *what the system does*.

| `rule_category` | Signal words | Example |
|---|---|---|
| VALIDATION | must be, valid, format, required, between … and … (for input values) | "Phone number must be 10 digits" |
| ELIGIBILITY | only, if the customer is, members, qualified, allowed to (by status) | "Only registered patients can book" |
| AUTHORIZATION | only staff, admin can, requires approval from, on behalf of | "Only a manager can refund over $500" |
| CALCULATION | total, fee, discount, rate, rounded, computed as | "Late fee is 5% per week, capped at 20%" |
| WORKFLOW | after, then, must first, approved by, escalated to | "An order over $1,000 needs approval before shipping" |
| TIME_BASED | in advance, within, before, after N days, expires, business hours | "Bookings between 24 hours and 60 days ahead" |
| STATE_TRANSITION | cannot … once, after it is …, moves to, reopen | "A shipped order cannot be cancelled" |
| DATA_CONSTRAINT | unique, no more than one, no longer, at most, must not overlap | "A booked slot is no longer free" |

How to decide:
- The rule is the **constraint**, and the requirement is the **behaviour** that obeys it. "Patient picks a free slot" is FR-001. "A booked slot is no longer free" is a rule FR-001 must respect.
- If a constraint matches more than one category, choose the one a tester would test it with. "Cannot book within 24 hours" is TIME_BASED, not VALIDATION.
- If a rule names a value the stories don't give ("a cancellation fee applies" with no amount), it is UNKNOWN and needs a question. Do not supply a typical value.
