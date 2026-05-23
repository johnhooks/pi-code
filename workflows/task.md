# Task Workflow

Use this workflow when the work is not yet clearly defined.

A task captures what should change and why it matters. It should not read like
an implementation checklist. Implementation details belong in a plan unless they
are part of the requirement or constrain the solution.

Local task drafts live in `.wip/tasks/` when a file is useful. They are
work-in-progress artifacts that may be pushed to an issue tracker, revised, or
discarded.

Good task output makes the problem, desired outcome, and constraints clear
enough that another developer or agent can plan the work later.

## Expectations

Start from the developer's description, ticket, issue, or observed product gap.
Clarify the current problem before proposing a solution, and separate product
intent from implementation approach. Capture constraints that affect the work,
such as compatibility, migrations, performance, dependencies, or required tests.
Ask targeted questions when the desired outcome is ambiguous.

Prefer prose over lists when drafting task content. Use bullets only when they
make concrete requirements, constraints, or distinct cases easier to scan.

## Done Means

The task has a clear problem statement, a proposed solution that describes the
desired outcome, and requirements that are concrete enough to scope the work.
Unresolved ambiguity is called out instead of hidden.
