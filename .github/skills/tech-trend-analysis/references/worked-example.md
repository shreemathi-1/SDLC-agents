# Worked example: US-001 after step 11

- Input: the step 10 output, `innovation-discovery/references/worked-example.draft.json`.
- Output: [worked-example.draft.json](worked-example.draft.json). It holds 9 trends, all unverified, because the example was produced without #tool:web/fetch.

| ID | Library key | Applies to | Relevance | Recommendation |
|---|---|---|---|---|
| TRD-001 | online-self-scheduling | FR-001 | HIGH | ADOPT |
| TRD-002 | two-way-sms-reminders | INN-001, INN-019, Q-006 | HIGH | TRIAL |
| TRD-003 | core-web-vitals | NFR-001, Q-001 | HIGH | ADOPT |
| TRD-004 | accessibility-regulation | Q-009, INN-020 | HIGH | ADOPT |
| TRD-005 | passkeys | Q-004, INN-005 | MEDIUM | ASSESS |
| TRD-006 | sms-otp-only-mfa | Q-004 | MEDIUM | **HOLD** (a warning: don't use SMS as the only factor for health data) |
| TRD-007 | invisible-bot-protection | INN-009 | MEDIUM | TRIAL |
| TRD-008 | voice-ai-agents | INN-027 | MEDIUM | ASSESS |
| TRD-009 | business-messaging-apps | INN-019 | LOW | ASSESS (depends on the country, Q-005) |

**Left out, although they match the domain:**
- `llm-assistants`: covered more specifically by voice AI agents.
- `telehealth`, `fhir-interoperability` and `ai-clinical-scribes`: healthcare trends, but none applies to dental booking.
- `pwa`, `opentelemetry` and `feature-flags`: engineering practices with no requirement or question to attach to yet. They are Architecture's concern.

**Verification:** every trend is `verified: false` and carries the note `unverified; check before client presentation`. In a live run with #tool:web/fetch, the agent checks each entry's `time_sensitive_claim` and records the sources it actually fetched. A typical example is the accessibility law that applies in the client's country.
