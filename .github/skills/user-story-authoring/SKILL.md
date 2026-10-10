---
name: user-story-authoring
description: Step 0 of the Requirements / PM workflow (stories mode). Turns raw client material (notes, emails, meeting minutes, Figma links, screenshots, pasted chat text) into INVEST-shaped user stories in user-stories/US-###-*.md, minting US IDs from the registry. Each story has As a / I want / So that, details, Given-when-then acceptance criteria, verbatim design references, verbatim client quotes and open points, with nothing invented. Use when asked to 'write user stories', 'turn these notes into stories', 'create stories from this email', or in a stories run.
argument-hint: "[path to raw input — default raw-input/ — or paste the text]"
---

# user-story-authoring

## When to use

Use this in `stories` mode, or standalone when the user says *write user stories*, *turn this into stories* or *create stories from these notes*. Input is a folder (by default `raw-input/`) or text pasted into chat.

## Procedure

Read [story-template.md](references/story-template.md) and [worked-example.md](references/worked-example.md) before starting.

1. **Collect.** Read every file in the input folder, recursively. Text files are read in full. For an image, record its path; do not describe what you think it shows unless you can actually view it. For a URL, record it verbatim. Pasted chat text counts as source `chat:<run_id>`.
2. **List goals.** Find every distinct *actor + goal* pair in the material. One goal gives one story. Use these splitting rules:
   - Split when two goals could ship and be tested independently, for example "book online" and "staff manage the calendar".
   - Keep a behaviour inside its goal when it has no value on its own, for example the confirmation email belongs to booking.
   - Never create a story for something the client calls undecided or optional ("not sure", "maybe later", "haven't decided"). Record it as an **Open point** in the most closely related story.
   - Never create a story for something the material doesn't mention. Gaps are found later, in step 5.
3. **Check for existing stories.** Read `user-stories/`. If a goal is already covered by an existing story, do **not** write a duplicate. Report it, and suggest the human edit that story instead. Existing story files are never overwritten.
4. **Mint IDs.** Read `requirements/.state/id-registry.json`. Each new story gets `US-` followed by (counter + 1), zero-padded to three digits, counting up within the run. If a human has written a higher `US-###` by hand, start above it. Write the new counter value and a `stories_seen` entry for each new ID (`{ "path", "created_in_run" }`) to the registry **in the same run**, because story files are final output.
5. **Write each story** using the template, at `user-stories/US-###-<kebab-title>.md`:
   - **As a / I want / So that.** Use the most specific actor the material names. Phrase the benefit in the client's terms.
   - **Details.** One fact per bullet, in plain sentences. Each fact must be backed by a quote under *Client's words*. Keep the client's numbers, names and system names exactly as written. Do not add numbers, limits or technologies.
   - **Acceptance criteria.** Write `Given …, when …, then …` for each behaviour, using only facts from Details. If a behaviour can't be tested without a missing value, leave out its criterion and add an Open point.
   - **Design.** Copy every Figma URL, screenshot path and other design link verbatim.
   - **Client's words.** One `> ` line per supporting quote, copied **exactly**. Shorten by cutting, never by rewording.
   - **Open points.** Include what the client called undecided, and every needed value the material doesn't give, such as a missing target, limit or audience.
6. **INVEST check** for each story:
   - **I**ndependent: it doesn't need another story to deliver value.
   - **N**egotiable: Details describe *what*, not UI or technical design.
   - **V**aluable: the "so that" names a real benefit.
   - **E**stimable: each Open point is explicit rather than hidden.
   - **S**mall: it has five or fewer acceptance criteria; otherwise split it.
   - **T**estable: every behaviour has a criterion or an Open point.
7. **Checkpoint.** Append `step=00` to `requirements/.state/run-log.md`, then stop. Ask the user to review the stories before `analyze`.

## Input / output contract

- **Reads:** the raw input, `user-stories/` and `requirements/.state/id-registry.json`.
- **Writes:** new files in `user-stories/`, and the `US` counter plus `stories_seen` in `id-registry.json`. It never edits existing stories or anything under `raw-input/`.

## Self-check before finishing

- [ ] Every `> ` quote appears verbatim in a file listed in the story's `source`.
- [ ] Every Details bullet is backed by a quote.
- [ ] No number, limit, system or feature appears that the raw input doesn't contain.
- [ ] Undecided items are Open points, not stories.
- [ ] Each file name starts with its frontmatter `id`, and no ID is reused.

`npm run verify` checks the template structure, the ID and file name, and that quotes are verbatim, for every file in `user-stories/` and `examples/sample-user-stories/`.

## References

- [story-template.md](references/story-template.md): the story file format.
- [worked-example.md](references/worked-example.md): one client email turned into US-001.
