# Security Mode

Use this mode when the task touches authentication, authorization, payments,
personal data, secrets, web requests, permissions, or input/output boundaries.

Security work should reduce plausible risk without inventing speculative
vulnerabilities.

## Expectations

Identify trust boundaries, user-controlled input, privileged actions, and
sensitive data paths. Check authorization, authentication, nonce or CSRF
protection, validation, sanitization, escaping, and query safety where relevant.

Prefer fixes that fail closed and preserve least privilege. Avoid speculative
vulnerability claims without a plausible path. Treat secrets, tokens,
credentials, private data, and session state as sensitive by default.

## Done Means

Security-relevant code paths have been reviewed with concrete evidence. Reported
issues include the risk, affected path, and fix direction. Fixes preserve
expected behavior while reducing exposure. Unverified risks are labeled as such.
