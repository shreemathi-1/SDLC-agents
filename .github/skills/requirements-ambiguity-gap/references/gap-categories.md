# Gap categories (step 5)

For each category, ask: *does the product as described need this, and do the stories cover it?* If the product needs it and the stories don't cover it, record a gap.

**Default severity** applies unless a domain tag raises it. **Not a gap when** describes cases where you skip the category; list each skipped category in the run notes so the reader can see it was considered.

| Category | Look for | Default | Raised to CRITICAL by | Not a gap when |
|---|---|---|---|---|
| AUTH | How users prove who they are | IMPORTANT | `healthcare`, `fintech`, `government`, any personal data | The product is fully anonymous and public |
| ROLES | Who may do what; admin vs. user vs. staff | IMPORTANT | `saas-b2b`, `marketplace`, `hr` | There is a single actor with no permissions |
| WORKFLOWS | Edit, cancel, undo, approve, and what happens next | IMPORTANT | (none) | Every lifecycle step is covered |
| VALIDATION | Field formats, required fields, limits | OPTIONAL | `fintech` | There is no user input |
| ERROR_HANDLING | External failure, concurrency, timeouts | IMPORTANT | Flows where a failure loses money or endangers safety (payments, medication, dispatch) | Nothing can fail visibly |
| NOTIFICATIONS | Confirmations, reminders, alerts, channels | OPTIONAL | (none) | No event matters to a user after the fact |
| PAYMENTS | Charging, refunds, invoices | IMPORTANT | `e-commerce`, `marketplace` | Nothing is sold through the product |
| INTEGRATIONS | Systems the stories name but don't specify | IMPORTANT | (none) | No external system is involved |
| SECURITY | Encryption, abuse and rate limits, session handling | IMPORTANT | `healthcare`, `fintech` | (always consider it) |
| PERFORMANCE | Response time, throughput, peak load | OPTIONAL | real-time or high-traffic domains | The stories already give a measurable NFR |
| ACCESSIBILITY | WCAG level, assistive technology | IMPORTANT | `government`, `edtech` | (rarely skipped for any user-facing UI) |
| COMPLIANCE | GDPR, HIPAA, PCI-DSS, local law | IMPORTANT | `healthcare`, `fintech`, `government`, `hr` | No personal or regulated data is stored |
| ANALYTICS | Usage metrics, business reporting | OPTIONAL | (none) | The client asked for no reporting |
| ADMIN | Back-office management of content, users and settings | IMPORTANT | `marketplace`, `saas-b2b` | All configuration lives in another system |
| BACKUP_RECOVERY | Restore after data loss | OPTIONAL | Products that hold the system of record | Another system is the master of all data |
| MONITORING | Uptime, alerting | OPTIONAL | (none) | (rarely a client question; usually INTERNAL) |
| LOCALIZATION | Languages, currencies, time zones | OPTIONAL | Products serving several regions | The product is single-region and the stories use one language |
| AUDIT_LOGGING | Who changed what, and when | OPTIONAL | `healthcare`, `fintech`, `government` | No sensitive changes occur |
| DATA_RETENTION | How long data is kept, and deletion on request | OPTIONAL | Any personal data under GDPR-like law | No personal data is stored |

Rules:
- A gap produces a **question, not a requirement**. Leave `resulting_requirements` empty. It is filled only when a later `update` run turns an answered question into a requirement.
- Items under the story's **Open points** that fit a category become gaps and keep their wording. For example, "reminders undecided" becomes a NOTIFICATIONS gap. Their severity is at least `IMPORTANT`, because the client raised them.
- **One gap per decision.** When several categories depend on the same client answer, record one gap under the root category and name the others in its description. For example, SECURITY, AUDIT_LOGGING and DATA_RETENTION obligations follow from which COMPLIANCE regime applies.
- `why_relevant_to_domain` names the domain tag. An answer that would apply to every product is too generic; make it specific.
- Questions about business facts are `CLIENT`; technical failure behaviour is `INTERNAL`.
