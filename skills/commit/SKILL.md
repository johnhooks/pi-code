---
name: commit
description: Create a conventional commit focused on functional changes.
---

# Commit

Create a conventional commit that summarizes the functional change clearly and
briefly.

Running this skill is an explicit request to commit. Use $ARGUMENTS and visible
conversation context as optional guidance. When guidance is absent, inspect the
repo to identify what changed and what the commit message should say.

Inspect the working tree, confirm what is staged, and run `git commit` with an
appropriate message. Ask a targeted question only when the intended change or
commit boundary is ambiguous.

## Writing Guidance

Focus on what changed and why it matters to the product or developer workflow,
not on implementation trivia.

Do not state that the code was tested. Testing is assumed and should be visible
in the PR, checks, or review context.

## Commit Shape

Follow conventional commit style: `type(scope): concise summary`. Use the
smallest accurate type, such as `feat`, `fix`, `docs`, `refactor`, `test`,
`chore`, or `build`. Include a scope only when it adds useful context.

Keep the commit title 50 characters or less.

Use a commit body when the change needs more context. Keep it concise and
focused on what changed and why. Wrap body lines at 80 characters. Do not add a
list for a small or single-purpose change.

## Process

Identify the user-visible, maintainer-visible, or workflow-visible behavior that
changed from the diff, staged files, recent context, and nearby code when
needed. Group related implementation details under those functional outcomes.
Omit unrelated cleanup unless it affects the behavior being described.

If the working tree includes multiple unrelated changes, ask whether the
developer wants one combined commit or separate commits. Do not stage unrelated
files. Use explicit file paths when staging files.
