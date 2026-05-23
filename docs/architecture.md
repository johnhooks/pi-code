# Architecture

pi-code is a local Pi package that provides reusable project-type convention
context and development workflows. It complements, but does not replace,
project-local `AGENTS.md` files and local skills.

See [Why Pi](why-pi.md) for why pi-code uses Pi as its harness, and see
[Influences](influences.md) for related projects that informed pi-code's
profile, workflow, and context-injection model.

## Runtime Shape

pi-code is a Pi package. Pi loads the built extension from `dist/`, while
skills, profiles, and workflows remain markdown assets in this repo.

Pi still loads the current project's `AGENTS.md` and local skills. The extension
should hold reusable guidance that applies across projects; repo-specific
architecture, commands, test requirements, and maintainer preferences belong in
the project itself.

The runtime can grow as needed to support the workflow. Keep it organized,
typed, tested, and clear about which behavior belongs in code versus markdown
assets.

## Context Layers

Context is separated into three markdown layers:

- **Profiles** describe reusable conventions for a detected project type, such
  as JavaScript, TypeScript, React, PHP, WordPress, Laravel, Codeception, or WP
  Browser.
- **Workflows** describe how to approach a phase of work, such as tasking,
  planning, implementation, testing, documentation, or review. Mode workflows
  refine a phase for a specific risk or follow-up pass.
- **Skills** are Pi slash-command entry points, such as `/task`, `/plan`,
  `/code`, `/review`, `/test`, and `/docs`. They define the user-facing command
  behavior and output expectations.

The split keeps skills from becoming large duplicated instruction files. A skill
answers what a command does. A workflow answers what good work looks like for
that phase. A profile answers which project-type conventions apply.

The extension wires these layers together at runtime. When a pi-code skill is
invoked, the extension injects the workflow docs registered for that skill and
active profile conventions as hidden context messages. Mode workflows, such as
refactoring, debugging, code review, or code cleanup, can be layered on top
based on prompt hints or runtime workflow state without creating separate skills
for every combination.

Some skills also have programmatic runtime support under `src/skills/`. For
example, `src/skills/code.ts` orchestrates post-implementation review and
cleanup passes for `/code`, while `skills/code/SKILL.md` remains the user-facing
skill description.

## Project Install

The `pi-code install` CLI command links a local pi-code checkout into a project
by creating or updating `.pi/settings.json`. It preserves existing settings and
appends the pi-code package source to `packages` when missing. This is
project-scoped Pi package configuration, equivalent to using Pi's local package
install behavior for that repo.

## Context Injection Cache

The extension avoids repeatedly injecting identical context during the same
conversation. Convention context and workflow context are keyed by working
directory and content hash. If the same content has already been injected for
that project, pi-code skips it on later turns.

Tasking is the exception. `/task` workflow context is injected every time
because tasking is conversational and the draft may be actively changing.

When Pi compacts the conversation, pi-code clears this cache. After compaction,
previously injected hidden context may no longer be present in full, so pi-code
allows the context to be injected again.

## Workflow Model

The workflow supports task-to-PR development that keeps planning close to the
codebase while allowing the durable task source to live elsewhere, such as an
issue tracker.

### Task

Tasking starts with a local draft in `.wip/tasks/`. The draft is refined with
the developer while the agent can inspect the codebase and ground the task in
what actually exists.

The task captures what should change and why it matters. It should not become an
implementation checklist. Once the task is clear, it can be moved into the
team's durable issue tracker.

### Plan

Planning starts from either an external issue, ticket, or a local
`.wip/tasks/*.md` draft. The planner reads the task source, inspects the
codebase, and writes a local implementation plan in `.wip/plans/`.

The plan describes how the work should be approached: likely touch points,
sequence, risks, and verification. The plan is reviewed and refined before
implementation. Whether `.wip/plans/` is committed is a project decision.

### Implement

Implementation starts from the accepted task source and the local plan when one
exists. The `/code` skill handles the initial plan-first implementation pass.
After implementation edits are complete, runtime orchestration starts follow-up
review and cleanup passes before the final report.

The review pass loads `workflows/modes/code-review.md`, reviews the diff against
the task, active conventions, and local style, and blocks file edits during that
pass. The cleanup pass loads `workflows/modes/code-cleanup.md`, applies scoped
cleanup based on the review, and handles final verification and reporting.

The plan guides implementation but is not sacred. If the code disproves an
assumption, the implementation should change course and report the deviation.

### Review

Review evaluates the final diff against the task source, local plan when
available, active conventions, and risk. The goal is to reduce human reviewer
load by surfacing actionable blocking issues, warnings, and suggestions without
dumping low-priority noise.

### Source of Truth

- `.wip/tasks/` — local task drafts while shaping work.
- Issue tracker — durable accepted task source after tasking is complete.
- `.wip/plans/` — local implementation plans.
- Code diff — implementation result.

`.wip/` contains work-in-progress artifacts. Projects decide whether those files
should be committed.

## Correctness Strategy

Correctness should come from focused tests, typechecking, and linting:

- Put reusable logic in small modules under `src/`
- Test detection and dependency resolution with `node --test`
- Typecheck with `tsgo --noEmit`
- Keep extension code split into focused modules and avoid unnecessary
  duplication
- Use Biome for TypeScript formatting and linting
- Use Prettier for markdown formatting

When runtime behavior grows more complex, add tests before adding more
abstraction.

## When This Might Change

If pi-code grows into multiple independently published packages, a monorepo may
become useful. For now, pi-code remains a single package with a built Pi
extension.
