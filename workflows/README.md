# Workflows

Workflow documents describe how to approach common phases of development. They
are not personas. They define the expectations, boundaries, and evidence that
make agent output useful to a developer.

Conventions answer what patterns a project expects. Workflows answer how the
work should be approached.

## Phases

- `task.md` — clarify unclear work and capture what should change and why.
- `plan.md` — turn accepted work into a concise implementation approach.
- `code.md` — plan first, implement in focused passes, then complete review,
  cleanup, and verification responsibilities.
- `review.md` — review changed code against the task, conventions, and risk.
- `writing.md` — shared concise prose guidance for tasks, plans, reviews, docs,
  and conventions.

## Modes

Modes refine the workflow when the task type changes the quality bar.

- `modes/refactoring.md` — preserve behavior while moving, renaming, or
  restructuring code.
- `modes/debugging.md` — diagnose with evidence before changing code.
- `modes/documentation.md` — keep prose accurate to the implementation.
- `modes/security.md` — prioritize exploitability, authorization, data exposure,
  and safe failure.
