---
name: task
description:
  Think through a task with the developer and produce a local task draft.
---

# Task

Help the developer think through a task and produce a local task draft in
`.wip/tasks/` when a file is useful.

Task drafts are work-in-progress artifacts. They may later be pushed to an issue
tracker or discarded. Whether `.wip/` files are committed is a project decision.

This is a conversation, not a one-shot generation. Work with the developer to
understand the problem before writing anything.

## Context and Arguments

Use $ARGUMENTS and visible conversation context as the starting context. If the
request is clear enough to draft or refine the task, proceed without asking for
more setup. Ask targeted questions only when missing information would change
the task or hide important ambiguity.

Do not ask the developer to restate context that is already present in
$ARGUMENTS or the visible conversation.

## Local Convention Discovery

Before drafting, look for existing local task files in `.plans/tasks/`,
`.wip/tasks/`, or similar directories. If examples exist, match their directory,
filename pattern, frontmatter fields, section headings, and level of detail.

Do not introduce new metadata fields, tracker updates, or section headings
unless local examples show them or the developer asks.

## Task vs Plan Boundary

A task is the source of truth for what should change and why. It is not an
implementation plan.

Do not include affected files, verification plans, numbered implementation
steps, touch points, or plan-level notes by default. Include implementation
detail only when it is a real requirement or constraint. If implementation
strategy is needed after the task is accepted, use `/plan`.

## Process

Start by understanding the problem. If $ARGUMENTS gives context, use it as a
starting point. Ask the developer what's wrong or missing today and why it
matters. Explore the codebase if needed to ground the discussion in what
actually exists.

Clarify the desired outcome at a high level. Push back if the developer is
jumping to implementation details. The task should capture what and why, not
step-by-step how. Surface requirements that constrain the work, such as
compatibility, dependencies, test coverage, migrations, or performance.

Once the problem and outcome are clear, draft the task and show it to the
developer. Ask if anything needs to change.

When a local draft is created, report the file path. If the developer wants to
move the task into an issue tracker, treat the approved draft as the source
content for the issue.

## Naming

When the developer provides a ticket number, use `{ticket-id}-{short-title}.md`
(e.g., `APP-240-license-refresh.md`, `WEB-112-block-defaults.md`).

When no ticket number is known yet (the common case), use
`draft-{short-title}.md`. The file gets renamed once the ticket is created.

The short title is a few lowercase hyphenated words summarizing the task.

## Writing Style

Focus on what should change and why it matters. The Problem section should make
it clear what's wrong or missing today and why it matters. The Proposed solution
section should describe the desired outcome and constraints, not step-by-step
implementation instructions. Only get into the how if there's a non-obvious
technical decision that needs to be captured.

Write in plain, direct language. No em dashes. No colons as sentence
interrupters.

Prefer short prose paragraphs over labeled lists. Use bullets only for concrete
requirements, constraints, or multiple distinct cases that are clearer as a
list.

## Metadata

The frontmatter uses a required `status` field with one of `draft`, `todo`,
`in-progress`, or `done`. When a ticket identifier is assigned, include
`ticket`, such as `APP-240`. When work is in progress or done and a PR exists,
include `pr`, such as `"#145"`.

## Template

```markdown
---
status: draft
---

# {Title}

## Problem

{What's wrong or missing today, and why it matters.}

## Proposed solution

{The desired outcome and any constraints. Keep it focused on what should change,
not how to implement it line by line.}

## Requirements

{Optional. Concrete conditions that scope the work or affect the approach.
Things like compatibility constraints, dependencies on other work, required
tests, migrations, or performance targets. Omit this section if there's nothing
worth calling out.}
```

## Template (with ticket)

```markdown
---
ticket: { TICKET-ID }
status: todo
---

# {Title}

## Problem

{What's wrong or missing today, and why it matters.}

## Proposed solution

{The desired outcome and any constraints. Keep it focused on what should change,
not how to implement it line by line.}

## Requirements

{Optional. Concrete conditions that scope the work or affect the approach.
Things like compatibility constraints, dependencies on other work, required
tests, migrations, or performance targets. Omit this section if there's nothing
worth calling out.}
```
