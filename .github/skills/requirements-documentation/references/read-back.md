# Reading human edits back (start of every run)

Humans may edit two places in the generated views. Before any step changes data, the agent copies those edits into the JSON. Views are regenerated whole in step 15, so an edit that isn't read back is lost.

Run this at the start of every `analyze`, `update`, `promote` and `summary` run, before step 1 (or before the mode's first step). It needs an existing `requirements/requirements.json`. Log it as `step=00r`.

## 1. Innovation decision blocks

Source: `requirements/innovation-opportunities.md`, between `<!-- decision:INN-### -->` and `<!-- /decision -->`.

For each block, compare it with `innovation-decisions.json` and with the item in `requirements.json`.

| Block | `innovation-decisions.json` | Action |
|---|---|---|
| ACCEPT, REJECT or DEFER | PENDING | Copy the decision, reason, decided_by and date into **both** JSON files |
| Same as the JSON | anything | Nothing to do |
| Differs from the JSON | ACCEPT, REJECT or DEFER | **Conflict: the JSON wins.** Keep the JSON value and report the conflict in the run summary. Never overwrite a human decision with another human decision |
| PENDING | ACCEPT, REJECT or DEFER | The JSON was edited directly. Keep it; the block is regenerated in step 15 |

If `Decided by` or `Date` is empty, still apply the decision. Record `decided_by: "unknown (view edit)"` and today's date, and report it.

## 2. Sign-off table

Source: the `## Sign-off` table in `requirements/requirements.md`.

| `Decision` cell | Action |
|---|---|
| `APPROVED`, with `By` filled in | Set `status: APPROVED`. Append `change_log: {date, by: "human", change: "APPROVED by <By> via sign-off table: <Note>", run}`. If the item was BASELINED, CHANGED or DEPRECATED, report a conflict instead |
| `CHANGES` | Leave the status unchanged. Create an INTERNAL question with the note as its text that blocks the item, and report it |
| `APPROVED` without `By` | Do not apply it. Report "approval without a name" |
| empty | Nothing to do |

This is the **only** way, apart from an explicit chat instruction naming the IDs, that an agent writes `APPROVED`. The agent never writes `BASELINED`; humans set it in the JSON.

## 3. Answers given in chat

When the user answers a question in chat ("Q-004: match name, date of birth and phone"):
- set `status: ANSWERED`
- `answer`: the user's words
- `answered_by`: the user's name, or `"user (chat)"`
- `answered_on`: today

Then run `update` mode, so the answered question can turn into requirements: a gap's `resulting_requirements`, or an UNKNOWN item's value. **The agent never writes `answered_by` as itself.**
