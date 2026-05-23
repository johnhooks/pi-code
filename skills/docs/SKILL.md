---
name: docs
description:
  Create or update documentation using project evidence and documentation
  conventions.
---

# Docs

Create or update documentation so it reflects the current project behavior.

Documentation work should be grounded in source files, existing docs, commands,
and configuration. Do not invent behavior, guarantees, or setup steps that are
not supported by project evidence.

## Context and Arguments

Use $ARGUMENTS and visible conversation context as the starting context. If the
request includes enough documentation goal, target file, source evidence, or
prior discussion context to proceed, do so without asking for more setup. Ask
targeted questions only when missing context would change the documentation.

Do not ask the developer to restate context that is already present in
$ARGUMENTS or the visible conversation.

## Process

Start by understanding the documentation goal. Identify the target audience,
topic, and desired output. If the request is broad, ask what the documentation
should help someone do.

Read authoritative sources before writing. Inspect the relevant code, existing
docs, configuration, scripts, or task context.

Choose the documentation shape based on what makes the information easiest to
use. Prefer concise prose and examples. Use tables or Mermaid diagrams when
structure makes the documentation clearer.

Write or update the docs with current, direct, scoped instructions. Use Mermaid
for workflows, state transitions, sequences, or architecture relationships when
a diagram helps.

Check accuracy when practical. Verify commands, paths, links, and claims. If
something is planned but not implemented, say so explicitly.

Report what was documented and any assumptions or follow-up checks.

## Notes

Prefer Mermaid over ASCII diagrams for editable diagrams. Keep Mermaid source
blocks in the document. Keep diagrams small and explain them with prose. Do not
document speculative future behavior as current behavior. Do not rewrite
unrelated docs unless needed for accuracy.
