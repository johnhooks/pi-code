---
name: test
description:
  Choose, run, or interpret tests and checks using the active project
  conventions.
---

# Test

Choose and run the appropriate test and check commands for the current task, or
interpret results from commands the developer already ran.

Testing commands are often project-specific. Use active conventions for
framework guidance, then inspect the local project for the actual commands
before running anything.

## Context and Arguments

Use $ARGUMENTS and visible conversation context as the starting context. If the
request includes enough task, diff, failure, command, or prior discussion
context to choose or interpret verification, proceed without asking for more
setup. Ask targeted questions only when missing context would change the test
choice or make running a command unsafe.

Do not ask the developer to restate context that is already present in
$ARGUMENTS or the visible conversation.

## Process

Start by identifying what code or behavior needs verification. If a task, plan,
or diff is available, use it to scope the test selection.

Load the testing context from active conventions and workflow guidance. Pay
special attention to testing profiles such as Codeception, WP Browser, Laravel,
WordPress, and frontend profiles when active.

Inspect local command sources before running tests. Prefer project-defined
wrappers from `package.json`, `composer.json`, `Makefile`, `justfile`, project
docs, or test configuration files such as `codeception.yml`, `phpunit.xml`,
`playwright.config.*`, and `vitest.config.*`.

Choose the smallest useful verification. Prefer focused tests for the changed
behavior first, then broader checks when risk or project policy requires them.

Run the selected commands by default once you have identified a safe, focused
verification path. Recommend commands without running only when the developer
explicitly asks for recommendations, the command is unclear, the command is
likely expensive or destructive, required services or credentials are missing,
or the environment cannot run it. In those cases, explain the blocker or risk
and ask before proceeding when useful.

Interpret results by cause and next action. Do not paste large logs unless the
details matter.

## Output

When reporting tests, include what was verified, the command or commands, why
they were the right scope, the result, and the next action for failures. When
you only recommend commands, state why they were not run.

## Notes

Do not assume generic framework commands when the project defines wrappers.
Prefer project wrappers over raw tool commands when wrappers exist. Avoid
long-running full suites unless the task risk justifies them or the developer
asks. If no test command is available, say what was checked and what manual
verification is needed.
