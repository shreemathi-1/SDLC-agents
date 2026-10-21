---
name: tech-trend-analysis
description: Step 11 of the Requirements / PM workflow. Identifies patterns and technologies currently adopted in comparable products, filtered to the domain (no buzzword dumps), as TRD-### items with adoption level, relevance, last_reviewed date and ADOPT/TRIAL/ASSESS/HOLD recommendation; verifies time-sensitive claims with web/fetch when available and otherwise marks them unverified. Kept separate from innovation. Use when asked to 'analyse technology trends', 'what are comparable products doing', 'tech radar', or after innovation discovery in an analyze run.
argument-hint: "[optional: domain override]"
# experimental — delete the next line to run this skill in the main session instead of a forked subagent
context: fork
---

# tech-trend-analysis

## When to use

Use this skill after innovation discovery in an `analyze` run. It can also run on its own when the user says *tech trends*, *what are competitors using* or *tech radar*.

Trends describe **what comparable products are doing now**, which is context for decisions. Innovations (step 10) are **ideas for this product**. Keep the two separate: a trend never becomes a requirement or an innovation by itself.

## Procedure

Read [worked-example.md](references/worked-example.md), then load [trend-library.json](references/trend-library.json).

1. **Filter by domain.** Keep library trends whose `domains` contains `*` or one of the `project.domain` tags. The argument overrides the domain tags.
2. **Keep only trends that touch this draft.** A trend is used only if it informs a specific requirement, question, gap or innovation. Record those IDs in `applies_to`. **No buzzword dumps:** a trend that applies to nothing is left out, however popular it is. Aim for 6–12 trends.
3. **Add a trend that isn't in the library** only if comparable products clearly adopt it and it applies to this draft. Set `library_key: null` and note it in the run log as a candidate library entry.
4. **For each trend, set:**
   - `relevance` (question urgency is set later, in step 12, so don't base relevance on it):
     - HIGH if the client or team needs it to build an MVP requirement, or to answer a question the client must decide
     - MEDIUM if it helps choose between a question's options, or shapes an innovation
     - LOW if it informs only a low-scoring idea, or depends on facts that aren't known yet (such as the country)
   - `relevance_reason`: name the IDs it applies to, in product terms
   - `recommendation`:
     - **ADOPT**: mainstream, and it fits an in-scope requirement
     - **TRIAL**: growing; try it on an innovation or a small slice
     - **ASSESS**: worth investigating once a question is answered
     - **HOLD**: declining, or wrong for this product; use it to warn against a choice
   - `last_reviewed`: today's date
5. **Verify claims that can go out of date.** Each library entry has a `time_sensitive_claim`.
   - If #tool:web/fetch is available, check that claim against a current, reputable source. If it holds, set `verified: true` and add each source with `title`, `url` and `accessed`. If the source disagrees, change `adoption_level` to match what the source says and note the change in the run log.
   - Otherwise, set `verified: false` and `verification_note` to exactly `unverified; check before client presentation`.

   Never cite a source you didn't fetch.
6. **IDs.** New IDs come from the `TRD` counter. A trend already in `requirements.json` with the same `library_key` keeps its ID and is updated in place.
7. **Never touch requirements or innovations.**

## Input / output contract

- **Reads:** `requirements/.state/draft.json` during a run, otherwise `requirements/requirements.json`; the trend library.
- **Writes:** `trends[]` in `draft.json` only.
- **Checkpoint:** `step=11`, with the counts of verified and unverified trends.

When invoked alone as `/tech-trend-analysis`, read `requirements.json` and write the result to `requirements/.state/draft.json`.

## Self-check before finishing

- [ ] Every trend's `applies_to` names at least one existing ID, so there are no buzzword dumps.
- [ ] Every `library_key` exists in the library, or is null with a note in the run log.
- [ ] Every unverified trend carries the standard note, and every verified trend lists the sources actually fetched.
- [ ] No requirement or innovation changed.

`npm run verify` checks library keys, the `applies_to` IDs and the verification note.

## References

- [trend-library.json](references/trend-library.json): 34 trends, each with domains, adoption level and the claim that can go out of date. Last reviewed on the date in the file. You may add entries; keys are permanent.
- [worked-example.md](references/worked-example.md) and [worked-example.draft.json](references/worked-example.draft.json): US-001 after step 11.
