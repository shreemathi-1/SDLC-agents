---
name: requirements-extraction
description: Steps 1–3 of the Requirements / PM workflow. Parses user stories (actors, goals, features, actions, processes, data, constraints, outcomes, domain), extracts candidate requirements each with a US-### source and a verbatim evidence quote, and classifies each by type (FR, NFR, BR, DR, IR, SR, CR, CON, ASM, DEP) and origin (EXPLICIT, INFERRED, RECOMMENDED, UNKNOWN) without fabricating values. Use when asked to 'extract requirements', 'parse the user stories', 'classify requirements', or at the start of an analyze/update run.
argument-hint: "[path to user stories — default user-stories/]"
---

# requirements-extraction

## When to use

Use this at the start of an `analyze` or `update` run. Use it standalone when the user says *extract requirements*, *parse the stories* or *classify these requirements*. Every story needs a stable `US-###` ID; if any story lacks one, stop and ask.

## Procedure

Read [worked-example.md](references/worked-example.md) once before starting. It shows a single story taken through all three steps.

### Step 1: parse the stories

1. Read every `*.md` file under the input directory, recursively. Get each story's ID from frontmatter `id:`, then from the filename, then from the first heading, in that order. If two files share an ID, or a file has no ID, stop and ask (#tool:vscode/askQuestions).
2. For each story, add an entry to `stories[]` with `id`, `title`, `path` (repo-relative), `status: ACTIVE`, and `source_refs`. `source_refs` holds every Figma URL, screenshot or image path and other design link, copied **verbatim**.
3. Record these elements for each story, as working notes that are not written to the file: **actors**, **goals**, **features**, **actions**, **processes**, **data**, **constraints**, **expected outcomes**, plus any acceptance criteria the story already gives.
4. Fill in `project` from all the stories together:
   - `name` and `description`
   - `business_problem` and `business_objectives` (the "so that" clauses)
   - `user_roles` (the actors) and `stakeholders`
   - `input_dir`, `last_run` = the run ID and `last_run_mode`
   - `domain`: 1–3 lowercase tags that later steps use for filtering. Prefer common tags such as `healthcare`, `fintech`, `e-commerce`, `saas-b2b`, `saas-b2c`, `marketplace`, `edtech`, `logistics`, `hr`, `government`, `media`, `iot`. Add a narrower tag where it helps, such as `appointment-scheduling`.

### Step 2: extract requirements

Go through each story sentence by sentence, including bullets and acceptance criteria. Stories written by the [user-story-authoring](../user-story-authoring/SKILL.md) skill have two extra sections:
- **Client's words** are verbatim client quotes. They may be used as `evidence`, but prefer the Details bullet they back.
- **Open points** are **not** requirements. Use one only when it shows that a needed value is missing (the item becomes UNKNOWN with a question). Step 4 turns the rest into questions.

Create one requirement per **independently testable** need:

- **Split** a sentence that joins two behaviours with "and" or a comma if each could pass or fail on its own.
- **Merge** the same need stated in several stories into a single item with all the story IDs in `source`. Use the clearest sentence as the evidence.
- **Evidence** is copied from the story exactly. Two exceptions: Markdown emphasis markers (`**`, `*`) may be dropped, and whitespace may be collapsed. Never paraphrase inside `evidence`; paraphrase goes in `description`.
- Copy the story's `source_refs` onto every requirement taken from it.
- **Acceptance criteria:** move a story criterion onto the requirement it tests and keep its wording, as long as it fits `Given … when … then …`. If an EXPLICIT functional requirement has no criterion, write one using only facts in the evidence. Otherwise leave the list empty; step 14 flags anything untestable.
- Add an **INFERRED** item only if it necessarily follows from explicit items, for example a constraint that forces an integration. Its `rationale` names the IDs it follows from. Do not infer features the stories do not point to; missing categories belong to step 5 (gaps).
- Fill `dependencies` only when the story or a rationale states the link. Step 8 builds the full graph.

### Step 3: classify

**Type.** Pick the first row that matches:

| Type | Prefix | It is this if it… |
|---|---|---|
| CONSTRAINT | CON | restricts *how* the solution may be built (mandated system, platform, budget, deadline, technology) |
| COMPLIANCE | CR | cites a law, regulation, standard or audit duty |
| SECURITY | SR | concerns authentication, authorization, encryption, privacy controls or abuse prevention |
| BUSINESS_RULE | BR | states a policy that holds regardless of UI (window, limit, eligibility, calculation, approval path). Set `rule_category` |
| NON_FUNCTIONAL | NFR | describes a quality (speed, availability, scale, usability, accessibility). `nfr_metric` is mandatory |
| INTEGRATION | IR | exchanges data with an external system |
| DATA | DR | defines data to capture, keep, migrate or report on |
| DEPENDENCY | DEP | relies on something outside the team's control (vendor, other project, client deliverable) |
| ASSUMPTION | ASM | is a belief the stories rely on but do not confirm |
| FUNCTIONAL | FR | anything else the system *does* for an actor |

Step 6 later adds derived business rules and links them. In this step, record only the rules a story states.

**Origin:**

| Origin | Use when | Must carry |
|---|---|---|
| EXPLICIT | The story states the need **and** every value in it | `evidence`, `source` |
| UNKNOWN | The story states the need, but a value needed to build or test it is missing (an NFR without a number, a limit without a value) | `open_questions` linked to a new `Q-###`. Keep `evidence` if the need is quoted |
| INFERRED | The need follows from other items but no story states it | `rationale` |
| RECOMMENDED | Not used in steps 1–3. It comes only from `promote` or a later step's suggestions | n/a |

**No fabrication.** If a value is missing, use `"UNKNOWN"` with a question. Never fill it with an industry default. For an NFR with no number, set `nfr_metric.target` to `"UNKNOWN"` and the origin to `UNKNOWN`.

**Questions for UNKNOWN items.** Each `Q-###` needs:
- `audience: CLIENT` for business facts, `INTERNAL` for technical facts
- `blocks: [<item id>]`
- `suggested_default_option` phrased as an option ("Option: …"), never as the answer
- `status: OPEN`, `source` and `created_in_run`

**Provisional fields:**

| Field | Value |
|---|---|
| `confidence` | `HIGH` for EXPLICIT; `MEDIUM` or `LOW` for INFERRED; `LOW` for UNKNOWN |
| `priority` | `MUST` only if the story says *must*, *only*, *always* or *never*; otherwise `SHOULD` |
| `priority_status` | `PROPOSED` |
| `phase` | `MVP` |
| `scope` | `IN` |
| `status` | `DRAFT` |
| `version` | `1` |
| `client_visible` | `true` |
| `change_log` | `[{date, by: "agent", change: "created", run}]` |

Steps 7 and 13 replace the provisional scope, priority and phase.

### IDs

- Read `requirements/.state/id-registry.json`. A new item gets `PREFIX-` followed by (counter + 1), zero-padded to three digits. Continue counting upward within the run. Do **not** write the registry here; step 15 commits it.
- **`update` mode.** Build each item's key: `type|sorted source US-IDs|title` (lowercase, punctuation removed, whitespace collapsed). If the key, or the same evidence, matches a registry entry, reuse that ID.
  - If its content changed, set `status: CHANGED`, bump `version` and append to `change_log`.
  - Registry items with no match become `DEPRECATED`.
  - Never renumber an ID.

## Input / output contract

- **Reads:** the input stories, `requirements/.state/id-registry.json`, and in `update` mode `requirements/requirements.json`.
- **Writes:** `requirements/.state/draft.json`, a complete document that **validates against [requirement-schema.json](references/requirement-schema.json)**:
  - after steps 1–3, `project`, `stories[]`, `requirements[]` and the `questions[]` raised by UNKNOWN items are filled in
  - `ambiguities`, `gaps`, `risks`, `innovations` and `trends` are `[]`
  - `validation` is `{last_run: null, gate: "NONE", result: "NOT_RUN", issues: []}`
- After each step, append a checkpoint line to `requirements/.state/run-log.md` (steps `01`, `02`, `03`).

When invoked alone as `/requirements-extraction`, run steps 1–3 into `requirements/.state/draft.json` and report the counts. Do not touch `requirements/requirements.json`.

## Self-check before finishing

- [ ] Every EXPLICIT item's `evidence` appears verbatim in a story listed in its `source`.
- [ ] Every UNKNOWN item has a `Q-###` that exists in `questions[]` and lists the item in `blocks`.
- [ ] Every INFERRED item has a rationale that names the items it follows from.
- [ ] Every NFR has an `nfr_metric`. No target was invented.
- [ ] Every ID prefix matches its type, and no ID is used twice.

`npm run verify` checks the first four items automatically for `draft.json` and `requirements.json`.

## References

- [requirement-schema.json](references/requirement-schema.json): the JSON Schema (draft 2020-12) for `requirements.json`, covering the `requirement`, `question`, `risk`, `innovation`, `trend`, `ambiguity`, `gap` and `validation_result` objects.
- [worked-example.md](references/worked-example.md) and [worked-example.draft.json](references/worked-example.draft.json): one story taken through steps 1–3.
