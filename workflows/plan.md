# Plan Workflow

Use this workflow when the task or ticket is accepted but the implementation
approach is not yet agreed on.

A plan describes how the work should be approached. It should be concise enough
to read before implementation starts. It should identify likely seams,
sequencing, verification, and risks without restating the task at length.

Local implementation plans live in `.wip/plans/`. They are work-in-progress
artifacts. Whether they are committed is a project decision.

## Expectations

Treat the task, ticket, issue, or developer instruction as the source of truth.
Read enough code to identify where the change likely belongs. Prefer a small
number of clear phases over a large checklist. Mention files or modules only
when they are likely touch points.

Include verification that proves the change works. Call out unknowns only when
they could change the approach.

Prefer prose over lists in the plan narrative. Use bullets only when they make
phases, touch points, risks, or verification easier to scan.

## Done Means

The plan explains the implementation strategy, can be approved or revised
quickly, and does not invent requirements beyond the source of truth and
codebase evidence. It is ready to guide implementation while staying flexible
enough to change when the code disproves an assumption.
