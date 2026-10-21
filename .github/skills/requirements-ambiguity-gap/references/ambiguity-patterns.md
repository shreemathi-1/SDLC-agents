# Ambiguity patterns (step 4)

Check every requirement against each pattern. A match is an ambiguity only if two reasonable readers could build **different** things from the text.

| Pattern | Signal | Example | Typical question |
|---|---|---|---|
| Vague quality | fast, quick, easy, simple, intuitive, secure, reliable, modern, user-friendly, scalable, robust | "The page should load fast" | What measurable target, and measured how? |
| Unbounded quantity | many, several, a lot, large, unlimited, all, any, multiple | "Upload multiple files" | What is the maximum count or size? |
| Undefined term | a domain noun the stories never define, such as "treatment type", "premium user" or "active order" | "pick a treatment type" | Which values does it take, and who maintains the list? |
| Undefined actor | user, they, someone, the system, admin (when several roles exist) | "The user can approve" | Which role exactly? |
| Unclear boundary | between, within, up to, before, after, at least, or a time with no zone | "orders between 10 and 50 items get a discount" | Are the ends inclusive? In which time zone? Measured from when? |
| Missing unit or granularity | a number with no unit, or a duration with no slot size | "a free time slot" | How long is a slot? |
| Unstated error behaviour | a happy-path verb with no failure case: pays, sends, syncs, imports | "receives a confirmation email" | Not recorded here: collect all failure cases in one ERROR_HANDLING gap in step 5 |
| Open-ended list | etc., and so on, such as, including | "notify by email, SMS, etc." | Is the list closed? |
| Conflicting statements | two stories or bullets that disagree | "Guests can book" vs "Login required" | Which wins? |
| Optionality words | should, may, ideally, if possible, nice to have | "should support dark mode" | Is it required for the first release? |

Rules:
- **Every** ambiguity has at least two concrete interpretations. If you can only think of one, it isn't an ambiguity.
- An UNKNOWN item from step 3 (such as an NFR with no target) is also an ambiguity. **Reuse** its existing `Q-###`; do not create a second question.
- Severity:
  - `CRITICAL` if the interpretations lead to different architecture or legal exposure
  - `IMPORTANT` if they lead to different features or tests
  - `OPTIONAL` if they only change wording or UI detail
