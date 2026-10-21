---
name: requirements-ambiguity-gap
description: Steps 4–5 of the Requirements / PM workflow. Detects ambiguous or unmeasurable requirements (what is ambiguous, why it matters, possible interpretations, a clarification question, impact if unresolved) and runs a domain-filtered gap analysis across auth, roles, workflows, validation, error handling, notifications, payments, integrations, security, performance, accessibility, compliance, analytics, admin, backup/recovery, monitoring, localization, audit logging and data retention, bucketed CRITICAL/IMPORTANT/OPTIONAL, then triggers the mid-pipeline validation gate. Use when asked to 'find ambiguities', 'run gap analysis', 'what is missing from the requirements', or after extraction in an analyze/update run.
argument-hint: "[optional: category filter, e.g. security,payments]"
---

# requirements-ambiguity-gap

## When to use

Run this after extraction in an `analyze` or `update` run, or on its own when the user says *find ambiguities*, *gap analysis* or *what's missing*.

## Procedure

Before starting, read [ambiguity-patterns.md](references/ambiguity-patterns.md), [gap-categories.md](references/gap-categories.md) and [worked-example.md](references/worked-example.md).

### Step 4: ambiguities

1. Check every non-deprecated requirement against each pattern in `ambiguity-patterns.md`. Read its title, description, evidence and acceptance criteria.
2. Record an `ambiguities[]` entry only when two reasonable readers could build different things. Each entry has:
   - `requirement`: the ID it concerns
   - `what`: quote the ambiguous words
   - `why_it_matters`: the design or test decision that depends on the answer
   - `interpretations`: at least 2 concrete ones, taken from the text
   - `question`: see point 3
   - `impact_if_unresolved` and `severity`
3. **One question per decision.** If an existing `Q-###` already asks this (for example, one raised in step 3 for an UNKNOWN item), reuse it. Otherwise create the next `Q-###` with these fields:
   - `audience`
   - `category`
   - `blocks`: the requirement IDs
   - `suggested_default_option`: phrased "Option: …", never recorded as an answer
   - `options` and `urgency`
   - `source`: the story IDs
   - `status: OPEN` and `created_in_run`
4. Never rewrite the requirement to resolve its ambiguity. It stays as written until the client answers.

### Step 5: gaps

1. Go through all 19 categories in `gap-categories.md` (or only the categories given as the argument). Use `project.domain` to decide severity and whether a category applies at all.
2. Each story's **Open points** section is a direct source of gaps. Keep its wording, and set the severity to at least `IMPORTANT`.
3. When several categories hinge on one client answer, record **one gap** for the root category and name the others in its description.
4. Each gap has these fields:
   - `category` and `severity`
   - `description`: what the stories leave out
   - `why_relevant_to_domain`: names the domain tag
   - `question`: a new or reused `Q-###`
   - `resulting_requirements: []`

   **A gap never creates a requirement.** Requirements come only from answered questions, in a later `update` run.
5. Add each gap's question to the `blocks` of the requirements whose design depends on it, and add the question to each of those requirements' `open_questions`.
6. In the run-log note, list the categories that were considered but are not gaps, so the reader can see they were checked.

### Status update (end of step 5)

For every requirement in `DRAFT` or `ANALYZED`, apply the following. Leave every other status alone; never touch `APPROVED`, `BASELINED` or `DEPRECATED` items.
- If any linked question is `OPEN`, set the status to `NEEDS_CLARIFICATION`.
- Otherwise set it to `ANALYZED`.

Status changes on items created in the current run are not logged. For items from earlier runs, append a `change_log` entry.

### Mid-pipeline gate

Next, the agent runs the mid-pipeline gate from [requirements-validation-gate](../requirements-validation-gate/SKILL.md). Until that skill's procedure is written, run the self-check below as the gate, and log it as `step=05g`.

## Input / output contract

- **Reads:** `requirements/.state/draft.json` inside a run; otherwise `requirements/requirements.json`.
- **Writes:** `ambiguities[]` and `gaps[]`, new entries in `questions[]`, `open_questions` and `status` on requirements, and new `blocks` entries on existing questions. The output goes to `draft.json` and must still validate against the schema.
- **Run log:** append checkpoint lines for `step=04` and `step=05`.

When invoked alone as `/requirements-ambiguity-gap`, read `requirements/requirements.json` and write the result to `requirements/.state/draft.json`. Never overwrite `requirements.json` directly; only step 15 writes that file.

## Self-check before finishing

- [ ] Every ambiguity has at least 2 interpretations and a question that exists.
- [ ] No two OPEN questions ask the same thing.
- [ ] Every gap has a question, its `resulting_requirements` is empty, and no new requirement was added.
- [ ] Every question's `blocks` list matches the `open_questions` of the requirements it blocks, in both directions.
- [ ] Every `NEEDS_CLARIFICATION` item has an OPEN question.

`npm run verify` checks the last two items and that every ID resolves.

## References

- [ambiguity-patterns.md](references/ambiguity-patterns.md): what counts as ambiguous, and the severity rules.
- [gap-categories.md](references/gap-categories.md): the 19 categories, with domain-based severity.
- [worked-example.md](references/worked-example.md) and [worked-example.draft.json](references/worked-example.draft.json): US-001 after step 5.
