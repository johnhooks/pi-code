# pi-code Pi Workspace

This directory contains pi-code's development-time Pi configuration.

pi-code is intentionally meta: we use Pi to build a Pi extension that teaches Pi
and other agents how to work inside convention-heavy codebases. The local
`.pi/skills/` files are not distributed to users; they help us develop pi-code
itself.

## Development Skills

- `dev-profile` — create or refine convention profiles in `profiles/`
- `dev-explore` — inspect real projects and identify conventions worth promoting
- `dev-skill` — create or refine pi-code skills

These skills are for authoring pi-code's context library. Runtime user-facing
skills live in `skills/` and are packaged for installation.

When pi-code is installed as a global or project package, Pi loads the runtime
skills from the package's `pi.skills` entry in `package.json`. This workspace
therefore keeps only development-only skills under `.pi/skills/` to avoid
loading duplicate runtime skills while working on pi-code itself.

## Package Boundary

The installable package is defined by `package.json` and includes the built Pi
extension, runtime skills, and profiles. The `.pi/` directory is project-local
development tooling and should not be treated as user-facing product context.
