# User story template

File name: `user-stories/US-###-<kebab-case-title>.md`, where `###` is the minted ID.

```markdown
---
id: US-###
title: <Actor> <verb>s <object>
source:
  - <repo-relative path of each raw file used, or "chat:<run_id>" for pasted text>
---

# US-### — <title>

**As a** <specific actor, not "user" if the material names one>
**I want** <one goal>
**So that** <the benefit, in the client's terms>

## Details

- <one fact per bullet, each backed by a quote below>

## Acceptance criteria

- Given <context>, when <action>, then <observable outcome>.

## Design

- Figma: <url, verbatim>
- Screenshot: <path, verbatim>

## Client's words

> <verbatim excerpt from the raw input>

## Open points

- <what the material leaves undecided or unmeasured; never answered here>
```

Rules:
- Every section is present. If a section has nothing to say, write `- none`; the Design section may be omitted when there are no references.
- Acceptance criteria use the `Given …, when …, then …` form, with commas allowed. They contain only facts from Details.
- Each `> ` quote is a single line copied exactly from a file listed in `source`. Markdown emphasis may be dropped and whitespace collapsed.
