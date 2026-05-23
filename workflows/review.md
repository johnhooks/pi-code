# Review Workflow

Use this workflow before opening a pull request or when the developer asks for a
convention-aware review.

A review should reduce human load. It should identify issues worth acting on,
not list every possible improvement. Findings should be grounded in the diff,
the task, active conventions, and concrete code evidence.

## Expectations

Review only changed code unless surrounding context is needed to understand the
risk. Prioritize correctness, security, data integrity, maintainability, and
convention issues that create review friction.

Respect legacy context when the change intentionally matches nearby code. Prefer
specific file and line findings over broad commentary. Explain why the issue
matters just enough for the developer to act. Avoid dumping low-priority
findings into the first response.

Prefer prose for the review summary. Use structured findings only when there are
concrete issues to report.

## Done Means

Blocking issues are clearly separated from warnings and suggestions. Each
finding has a location, severity, issue, and intended fix direction. False
positives have been considered before reporting severe findings. The final
verdict is clear: fail, pass with warnings, or pass.
