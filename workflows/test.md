# Test Workflow

Use this workflow when choosing, running, or interpreting verification.

Verification should match the risk and scope of the change. Prefer the smallest
useful check, but do not avoid broader checks when the change is cross-cutting,
security-sensitive, or release-critical.

## Expectations

Identify what behavior or risk needs verification. Inspect project-defined
commands before running tests. Prefer focused tests near the changed behavior
before broad suites, and use broader checks when the change is cross-cutting,
risky, or required by project policy.

Treat failing tests as evidence to diagnose, not noise to work around. Summarize
results by cause and next action.

When looking for commands, inspect project evidence such as `package.json`,
`composer.json`, `Makefile`, `justfile`, project docs, and test configuration
files.

## Done Means

The selected verification matches the changed behavior and risk. Commands were
chosen from project evidence where possible. Results are summarized clearly.
Failures include the likely cause and next debugging step.
