---
name: review
description:
  Pre-PR review checking your code against conventions for the active project
  type.
---

# Review

Review the current diff against the active project conventions before opening a
pull request.

The review should reduce human load. Be actionable, not exhaustive in the first
response. Keep lower-priority details available in context so the developer can
ask for more.

## Context and Arguments

Use $ARGUMENTS and visible conversation context as the starting context. If the
request or current repository state is clear enough to review, proceed without
asking for more setup. Ask targeted questions only when missing context would
make the review misleading.

Do not ask the developer to restate context that is already present in
$ARGUMENTS or the visible conversation.

## Loading Conventions

Use the extension-injected context. Look for a `<pi-code-context>` block in this
turn's context and use those conventions as the authoritative source.

## Steps

Load conventions before reviewing. Get the diff with `git diff main...HEAD`. If
there is no `main` branch, try `master`. If neither exists, use
`git diff HEAD~1`. If there are unstaged changes, also run `git diff` and
include those.

Review changed code against the loaded conventions. Respect legacy context. If
the surrounding code predates current conventions, prefer findings that improve
safety, correctness, or maintainability. Do not require broad style or
architecture rewrites when the changed code intentionally matches nearby legacy
patterns.

Focus on high-impact issues first, such as security and data integrity problems,
missing sanitization or escaping, missing validation or authorization, nonce and
prepared-query issues, runtime failures, convention violations that create
maintenance friction, and organization choices that make the change harder to
work with.

Prioritize findings before reporting. Lead with the issues the developer should
address first. Keep additional lower-priority findings in mind, but do not dump
everything into the first response.

Report a concise review. Each finding should include the file and line,
severity, issue, and intended fix direction. Quote the relevant convention when
it clarifies the finding, but do not paste large convention sections.

If there are additional lower-priority findings, say so briefly at the end and
invite the developer to ask for more detail or the next batch. End with a clear
verdict: `FAIL`, `PASS with warnings`, or `PASS`.

## Notes

Only flag code that was changed in the diff. Prefer findings the author would
likely fix if they understood them. Do not overwhelm the developer with a full
review document when a focused first pass is more useful. Be ready to provide
deeper explanation, convention quotes, or additional findings when the developer
asks. Do not invent additional rules beyond what the conventions document.
