---
name: code
description: Plan and implement accepted work in a focused phase.
---

# Code

Implement an accepted task using a deliberate plan-first workflow.

This skill is for work that already has a source of truth: a task file, ticket,
issue, pasted brief, or developer instruction. Do not assume the implementing
developer created the task. Treat the provided task as the product intent, then
plan and implement against the actual code.

## Context and Arguments

Use $ARGUMENTS and visible conversation context as the starting context. If the
request includes enough task, ticket, brief, approved plan, or prior discussion
context to proceed, use it without asking for more setup.

## Process

Find the source of truth. If $ARGUMENTS names a task file, ticket text, or plan
file, read it. If the task is missing or ambiguous, ask for the source of truth
before planning.

Inspect enough code to plan. Read only the files needed to identify likely
seams, nearby conventions, and verification points. Use active conventions when
available. Avoid broad exploration unless the task is unclear.

Use the request's intent to decide whether to stop for approval. If $ARGUMENTS
is a plan, names a plan file, or the developer asks you to implement or proceed,
treat the work as ready to implement. Otherwise, present a concise
implementation plan and ask the developer to confirm or revise it before editing
code.

Implement in focused passes. Make the smallest coherent set of changes that
satisfies the task. If the code disproves the plan, revise course and note the
deviation instead of forcing the original plan.

When implementation edits are complete, stop. Follow-up review, cleanup, and
verification responsibilities will run before the final report.

## Output When Planning Is Needed

```markdown
# Implementation Plan: {Task title}

## Approach

{How the change will be made. Prefer short prose. Use bullets only when multiple
phases or touch points are clearer as a list.}

## Touch points

{Likely files or modules and why they are involved. Omit if not useful.}

## Risks / unknowns

{Only if they may change the approach. Omit if none.}
```

End with: `Approve this plan before I implement?` only if needing approval.

## Notes

Do not expand scope beyond the task without asking. Prefer one complete, focused
implementation over scattered opportunistic cleanup. If the task is not ready to
implement, ask targeted questions or suggest using `/task` first.
