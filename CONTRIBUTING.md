# Contributing to pi-code

pi-code is intended to be edited locally while you work on other projects. When
a convention, workflow, or skill creates friction in another repo, update this
pi-code checkout, rebuild if needed, then reload Pi so the project picks up the
change.

## Project Structure

Runtime skills live in `skills/` and are packaged for users. When pi-code is
installed as a global or project package, Pi loads those skills from the package
configuration. Development-only skills live in `.pi/skills/` and help maintain
pi-code itself without duplicating the packaged runtime skills.

Convention profiles live under `profiles/`. Each profile has a `conventions.md`
file and a corresponding detection entry in `profiles/registry.json`.

Workflow guidance lives under `workflows/` and is injected by the pi-code
extension.

## Common Contribution Flow

For a new profile, add `profiles/{name}/conventions.md`, update
`profiles/registry.json`, then verify detection against a representative
project.

For TypeScript extension changes, inspect the relevant source in `src/`, make
focused edits, run the build, and reload Pi before testing the behavior
interactively.

For skill or workflow changes, update `skills/` or `workflows/`, then reload Pi
so the current session uses the latest files.

## Verification

A pre-commit hook checks staged TypeScript, JavaScript, JSON, and Markdown files
with Biome and Prettier.

Run broader checks before opening a PR: after TypeScript extension changes, run
`pnpm run build`; after code changes, run `pnpm run lint`; if detection logic or
tests changed, run `pnpm test`.
