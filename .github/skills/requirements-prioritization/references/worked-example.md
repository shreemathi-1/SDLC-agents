# Worked example: US-001 after steps 12–13

- Input: the step 11 output, `tech-trend-analysis/references/worked-example.draft.json`, which includes 33 innovations and 9 trends. Neither step changes requirements or priorities.
- Output: [worked-example.draft.json](worked-example.draft.json).

## Step 12: questions

**Duplicates:** none. The closest pair is Q-004 (how patients identify themselves) and Q-005 (which health-data regime applies). Different answers settle them, so both stay.

**Urgency changes:**

| Question | Raised by | Urgency |
|---|---|---|
| Q-004, Q-005 | CRITICAL gaps | BLOCKING (no change) |
| Q-001 | UNKNOWN NFR-001 | HIGH (no change) |
| Q-002, Q-003 | IMPORTANT ambiguities | HIGH (no change) |
| Q-008 | IMPORTANT gap | HIGH (no change) |
| Q-006, Q-007, Q-009 | IMPORTANT gaps | **NORMAL → HIGH** |

Every OPEN question blocks at least one item and offers an "Option: …".

## Step 13: priority and phase

| Item | Priority | Phase | Deciding rule |
|---|---|---|---|
| FR-001 | MUST | MVP | It is the story's core goal |
| BR-001 | MUST | MVP | The client says "can only", and it governs FR-001 |
| BR-002 | MUST | MVP | It governs FR-001 and prevents double booking |
| CON-001 | MUST | MVP | The client says "We must keep using" ClinicDesk |
| IR-001 | MUST | MVP | FR-001 (MUST) depends on it |
| FR-002 | SHOULD | MVP | The client says "should"; it is small and builds only on FR-001 |
| NFR-001 | SHOULD | MVP | The story says "should load fast". It cannot be approved until Q-001 is answered |

Note the wording: the raw email said the page "needs to be quick", which reads as MUST. The **story** that the human reviewed says "should load fast", and story wording takes precedence, so NFR-001 is SHOULD.

**Status:**
- BR-001, BR-002 and CON-001 move from ANALYZED to **PROPOSED**.
- FR-001, FR-002, NFR-001 and IR-001 stay **NEEDS_CLARIFICATION**. They have a priority but remain blocked by open questions.

**Constraints check:**
- Every MUST item depends only on MUST items: FR-001 → IR-001 → CON-001.
- Every item is in MVP, so no item depends on a later phase.
- US-001 is traced by all seven items.
