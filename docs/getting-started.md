# Getting Started

pi-code works as a local Pi package. The extension detects the project type and
provides active conventions to pi-code skills when they run.

Project-specific details still belong in the repo. Keep architecture notes,
commands, test policy, release process, and maintainer preferences in
`AGENTS.md` or local skills.

## Skills

`/task` helps shape unclear work into a task draft. Use it when the problem,
desired outcome, or constraints are still being clarified. Task drafts focus on
what should change and why it matters, not step-by-step implementation.

`/plan` turns accepted work into a concise implementation plan. Use it when a
task, issue, ticket, or brief already exists and you want an approach before
editing code.

`/code` implements accepted work in phases. It finds the source of truth,
inspects enough code to plan, presents a plan, waits for approval, implements,
self-reviews, cleans up, verifies when practical, and reports back.

`/test` helps choose, run, or interpret tests and checks. It uses active testing
conventions but still looks for project-defined commands before running
anything.

`/docs` creates or updates documentation from project evidence. Use it for
README changes, architecture notes, workflows, setup instructions, and other
docs that should reflect the current implementation.

`/review` reviews the current diff against active conventions before a PR. It
focuses on actionable correctness, security, maintainability, and convention
findings.

## Typical Flow

Start with `/task` when the work is not clear enough to implement. The result is
a local task draft, usually in `.wip/tasks/`, that captures the problem and
desired outcome.

Use `/plan` when the work is accepted but the implementation approach is not
agreed on. The plan should be short enough to read quickly and should identify
likely seams, risks, and verification.

Use `/code` when you are ready to change code. Implementation should still plan
first and wait for approval before editing unless the visible conversation
already contains an approved plan.

Use `/test` to select or run verification. Prefer focused checks near the
changed behavior before broad suites unless the risk or project policy requires
more.

Use `/review` before opening a PR. The review should surface findings worth
acting on without dumping low-priority noise.

## Project Install

Install pi-code into a project with the CLI:

```bash
~/Projects/pi-code/pi-code install /path/to/project
```

This creates or updates the project's `.pi/settings.json` so Pi loads the local
pi-code package for that repo.

Use local project skills when a project needs custom skill behavior. The
extension provides reusable convention and workflow context; project-specific
instructions still belong in the project.
