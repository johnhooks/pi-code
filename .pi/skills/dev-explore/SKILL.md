---
name: dev-explore
description:
  Explore a project codebase to discover conventions worth promoting in a
  pi-code profile.
---

# Dev Explore

Explore a project codebase to find conventions worth promoting. Not everything
in a codebase is a convention. The goal is to separate intentional patterns from
accidents, legacy, and things the team would rather move away from.

## Process

1. **Get the target.** $ARGUMENTS should include a path to a project and
   optionally a focus area (e.g., `~/Projects/sync-saas stores` or
   `~/Projects/kadence-blocks testing`). If not provided, ask the developer what
   to explore and what they're interested in.

2. **Start with intent.** Before diving into code, look for signals of what the
   team considers important:
   - Documentation (README, docs/, AGENTS.md, CLAUDE.md, wiki links)
   - Linter and static analysis config (phpstan.neon, .eslintrc, php-cs-fixer
     config)
   - CI pipelines that enforce standards
   - Code review templates or checklists

   These tell you what the team actively enforces, not just what happens to
   exist.

3. **Explore the code.** Look at the codebase for repeated patterns, but filter
   for quality:
   - **Is it consistent?** A pattern that appears in 2 out of 20 files is not a
     convention. Look for things that repeat reliably.
   - **Is it recent?** Older code may reflect outdated practices. Prioritize
     patterns in newer files and recent commits.
   - **Is it enforced?** Patterns backed by linters, tests, or CI carry more
     weight than informal habits.
   - **Would we recommend it to a new developer?** If the answer is "no, but
     that's how it works for now," it's not a convention to promote.

4. **Discuss with the developer.** Present what you found and ask which patterns
   they want to promote. For each one, discuss:
   - Is this how we want new code written?
   - Is this specific to this project, or should it apply broadly?
   - Does this belong in an existing profile or a new one?

   Let the developer drive what makes the cut. Your job is to surface candidates
   with evidence, not to decide.

5. **Summarize the keepers.** For each convention worth promoting, provide:
   - A short description of the pattern
   - A concrete code example (generalized from the project, not copied verbatim)
   - Which profile it belongs to

## What Makes a Good Convention

- **Teachable**: A new developer could follow it after reading one paragraph and
  one example.
- **Enforceable**: You could review code against it and say "this follows the
  convention" or "this doesn't."
- **Justified**: There's a real reason for it, not just preference. It prevents
  bugs, improves performance, or enables tooling.
- **Stable**: The team isn't actively debating whether to change it.

## What to Skip

- Patterns that only exist because of legacy constraints
- Workarounds for framework bugs or version limitations
- Patterns the team is actively migrating away from
- Style preferences already handled by a formatter (indentation, bracket
  placement, etc.)
- Anything where the honest answer is "we should probably change this"
