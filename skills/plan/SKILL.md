---
name: plan
description: Create a concise implementation plan for an existing task.
---

# Plan

Create a concise implementation plan for accepted work. The task source
describes what should change and why. This skill describes how the agent intends
to implement it.

The plan should be short enough that the developer will read it, then the first
code pass should validate or revise it.

## Context and Arguments

Use $ARGUMENTS and visible conversation context as the starting context. If the
request includes enough task, ticket, issue, brief, or prior discussion context
to plan, proceed without asking for more setup. Ask targeted questions only when
missing information would change the approach.

Do not ask the developer to restate context that is already present in
$ARGUMENTS or the visible conversation. Do not edit code from this skill.

## Process

Find the task source first. If $ARGUMENTS names an issue, local task file,
pasted brief, or developer instruction, use it. Otherwise ask for the source of
truth. Local task drafts live in `.wip/tasks/` when used.

Use the task source as the source of truth for the problem, proposed solution,
and requirements. Do not restate the task at length, and do not invent
requirements beyond the task file and codebase evidence.

Inspect enough code to find the seams. Read only the files needed to understand
where the change likely belongs, the nearby conventions, and any specific tests,
checks, or manual flows that should prove the work. Avoid broad codebase
exploration unless the task is ambiguous.

Draft the implementation plan in `.wip/plans/`. Keep it concise and practical.
Focus on implementation strategy, not product rationale. Mention files or
modules only when they are likely touch points. Call out risks or unknowns only
when they may change the approach. Do not include line-by-line steps,
speculative edge cases, or a massive checklist.

Show the plan and ask whether the developer wants changes before implementation.
When implementation begins, treat the plan as something to validate. If the code
disproves the plan, revise course and summarize material deviations instead of
forcing the code to match the original plan.

## Output Format

```markdown
# Implementation Plan: {Task title}

## Task

{Issue, local task path, pasted brief, or developer instruction. One sentence
max if context is needed.}

## Approach

{Implementation strategy, important sequencing, and design choices. Prefer short
prose. Use bullets only when multiple distinct phases or decisions are clearer
as a list.}

## Touch points

{Likely files or modules and why they are involved. Omit if this would be
speculative.}

## Risks / unknowns

{Only include items that could change the approach. Omit if none.}

## Verification

{Specific test, check, or manual flow that proves this change. Omit routine
project-wide commands that are already part of the normal implementation
process, such as the default test or lint script.}
```

Omit sections that do not add value. Keep the plan readable in under two
minutes.

## Notes

`.wip/plans/` contains work-in-progress implementation plans. Whether these
files are committed is a project decision. If the task is not clear enough to
plan, ask targeted questions instead of guessing.
