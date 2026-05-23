# Debugging Mode

Use this mode when the task is a bug, regression, failing test, or unexpected
runtime behavior.

Debugging should explain the cause, not only make the symptom disappear.

## Expectations

Reproduce or characterize the failure before changing code when practical. State
the current hypothesis and what evidence supports it. Read the relevant code
path, not only search results.

Prefer narrow fixes that address the demonstrated cause. Avoid broad rewrites
unless the evidence shows the current structure prevents a safe fix. Add or
update tests that would have caught the issue when practical.

## Done Means

The cause is explained with code or runtime evidence. The fix targets the cause
rather than a symptom. Verification shows the failure is resolved. Remaining
uncertainty is stated clearly.
