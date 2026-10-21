# Risk checklist (step 9)

Ask each question below against the current draft. A "yes" that the draft doesn't already handle is a candidate risk. Record it only if it could change cost, schedule, quality or legal exposure.

| Category | Prompts |
|---|---|
| BUSINESS | Does the value depend on users changing their behaviour? Is a key decision still open with the client? Does a CRITICAL gap block the core feature? |
| TECHNICAL | Is there concurrency, such as two writers to one resource? Is any data flow or algorithm new to the team? Are performance targets unknown or aggressive? |
| SECURITY | Is personal, health or payment data stored or sent? Is the auth model still undecided? Is there a public endpoint that could be abused? |
| INTEGRATION | Does a feature rely on an external system whose API, limits or terms are unconfirmed? Is that system the master of the data? What happens when it is down? |
| SCALABILITY | Are there peaks (opening hour, campaigns, month end)? Do volumes grow with tenants or regions? |
| COMPLIANCE | Is regulated data involved while the regime is unknown? Are retention or consent rules unstated? |
| REQUIREMENT_QUALITY | Is any item untestable (UNKNOWN target, no acceptance criteria)? Are there dependency cycles or conflicting items? Are many items blocked by one question? |

## Likelihood and impact

| Level | Likelihood | Impact |
|---|---|---|
| HIGH | Expected unless action is taken; the cause is already present in the draft | Blocks launch, causes a legal breach, or needs major rework |
| MEDIUM | Plausible; it depends on an unconfirmed fact | Delays a phase or degrades a core feature |
| LOW | Possible, but nothing in the draft points to it | Cosmetic, or confined to one non-core feature |

## Rules

- **Mitigation** is an action the team or client can take now, such as "confirm the API with the vendor" or "agree a target via Q-001". It is never "be careful".
- `related` lists every requirement, question or gap question the risk touches. Link the risk back in each affected requirement's `risks[]`.
- `origin` is `INFERRED` with a `rationale`, or `EXPLICIT` with the client's words in the description if the client named the risk.
- Each dependency cycle found in step 8 becomes a `REQUIREMENT_QUALITY` risk whose `related` lists every member of the cycle.
