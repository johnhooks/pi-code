# pi-code Development

Developers work across WordPress plugins, Laravel apps, WooCommerce stores,
React frontends, and other codebases with their own conventions. Those
conventions often live in tribal knowledge, codebases, and code review comments.
Developers learn what's expected by getting corrected in PRs, which is slow for
them and expensive for reviewers. AI coding tools make this worse when they do
not know the project's conventions.

pi-code fixes this by giving the AI agent reusable project-type convention
knowledge. It auto-detects the project type, loads the right conventions for
that stack, and gives developers skills for task framing, planning,
implementation, convention lookup, and pre-PR review. Project-specific
instructions still belong in that repo's `AGENTS.md` and local skills.

It works as a Pi package: a Pi extension injects conventions per turn, and
pi-code skills consume that injected context.

## Conversational Style

- Keep answers short and direct
- No emojis in commits, code, or skill files
- Technical prose only, no filler
- When writing conventions, focus on what and why, not step-by-step how

## Project Structure

- `src/pi-code.ts` — Pi extension source. Detects project type, injects
  conventions and workflows via `before_agent_start` hook.
- `profiles/` — Convention documents per project type. Each profile has a
  `conventions.md`.
- `profiles/registry.json` — Profile definitions with detection rules.
- `skills/` — SKILL.md files (YAML frontmatter + markdown body). Runtime skills
  consume extension-injected context.
- `workflows/` — Phase and mode expectations written as approach guidance, not
  personas.
- `scripts/detect-project-type.ts` — Standalone detection check for development.
- `.pi/skills/` — Development skills for working on pi-code itself (not
  distributed to users).

## Code Quality

- Read files in full before making broad changes or auditing behavior. Do not
  rely only on search snippets for wide-ranging edits.
- No `any` types unless absolutely necessary. Use Pi extension types from
  `@earendil-works/pi-coding-agent` instead of guessing.
- Check installed package type definitions when using external APIs.
- Do not use dynamic imports for types. Use top-level `import type` statements.
- Always ask before removing behavior that appears intentional.
- Let the runtime grow when it directly supports the workflow. Keep code
  organized, typed, tested, and purposeful.

## Conventions for This Project

- Skills use YAML frontmatter with `name` and `description` fields.
- Runtime skill names are short action names such as `task`, `plan`, `code`,
  `review`, `test`, and `docs`.
- Convention documents are plain markdown. Profiles are injected into agent
  context, so be aware of token cost and keep them compact and high-signal.
  Prefer concise prose; use code examples only when necessary to demonstrate a
  difficult concept or clarify an otherwise ambiguous pattern. Show the
  preferred pattern only; typically do not include incorrect examples or
  anti-patterns that may be repeated by agents.
- Do not add profile guidance for formatting or style rules that should be
  enforced by linting, formatting, or static analysis tools. pi-code profiles
  should focus on intent, architecture, safety, correctness, and maintainability
  that tools cannot reliably fix on their own.
- Put reusable project-type guidance in pi-code. Put repo-specific architecture,
  commands, test requirements, release process, and maintainer preferences in
  that project's `AGENTS.md` or local skills.
- Detection rules in `registry.json` use three forms: file existence, content
  match (`file:pattern`), and JSON key lookup (`file.json:key.path`).
- Runtime skills use extension-injected `<pi-code-context>` as their convention
  source.
- Workflow documents describe approach, boundaries, and evidence. Do not write
  them as personas or tell the model it is an expert.
- Custom skill behavior belongs in Pi project-local skills.

## Adding a New Profile

1. Create `profiles/{name}/conventions.md` with the conventions for that project
   type
2. Add an entry to `profiles/registry.json` with detection rules
3. Test detection: `pnpm run detect -- /path/to/project`
4. Run `/reload` inside Pi to pick up the new profile

## Workflow

pi-code supports task, plan, implement, and review phases. Tasking may come from
pi-code or from an external ticket, issue, brief, or developer instruction.
Implementation should plan first and stop for approval, then implement,
self-review, and do at least one cleanup pass before reporting back.

## Adding a New Skill

1. Create `skills/{skill-name}/SKILL.md` with YAML frontmatter (`name`,
   `description`) and markdown body
2. The skill name in the directory must match the `name` field in frontmatter
3. Runtime convention skills should use extension-injected `<pi-code-context>`
   as their convention source.
4. Run `/reload` inside Pi to pick up the new skill

## Commands

```bash
pi install "$PWD"                                      # Install this local checkout as a Pi package
pnpm run build                                            # Build the Pi extension to dist/
pnpm run detect -- /path/to/project                       # Test detection
pnpm run lint                                             # Lint, typecheck, and markdown formatting check
pnpm test                                                 # Run tests
```

- After TypeScript extension changes, run `pnpm run build`.
- After code changes, run `pnpm run lint`.
- If detection logic or tests changed, run `pnpm test`.
- If profile detection rules changed, run
  `pnpm run detect -- /path/to/real/project` against a representative project.
- If only markdown changed, `pnpm run lint:md` is sufficient unless the change
  affects injected behavior.
- Fix all lint, typecheck, formatting, and test failures before reporting
  completion.
- Do not run long-lived watch/dev commands unless explicitly asked.

## Git

- Never commit unless asked
- Use specific file paths with `git add`, never `git add -A` or `git add .`
- Keep commit messages focused on what changed and why
