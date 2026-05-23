# pi-code

pi-code is a Pi extension that gives Pi agents reusable project-type conventions
and workflow guidance so they can work inside real codebases with less repeated
correction.

Pi's official homepage is [pi.dev](https://pi.dev). Installation instructions
for Pi are maintained in the
[Pi GitHub repository](https://github.com/earendil-works/pi).

It is useful when teams want AI coding agents to understand shared conventions
for WordPress plugins, Laravel apps, WooCommerce stores, React frontends,
testing stacks, and other recurring project types without copying the same
instructions into every repo.

It does not replace a project's `AGENTS.md`. Keep repo-specific architecture,
commands, test requirements, release process, and maintainer preferences in the
project. Use pi-code for reusable conventions and task-to-PR workflow guidance.

## Install pi-code

Clone pi-code somewhere stable on your machine:

```bash
git clone git@github.com:johnhooks/pi-code.git ~/Projects/pi-code
cd ~/Projects/pi-code
pnpm install
pnpm run build
```

Install pi-code into a project as a local Pi package:

```bash
cd ~/Projects/pi-code
./pi-code install /path/to/project
```

From inside the target project:

```bash
~/Projects/pi-code/pi-code install .
```

This creates or updates `.pi/settings.json` in the project and adds the local
pi-code checkout as a Pi package. Pi will load pi-code's extension and skills
for that project.

After changing pi-code TypeScript code, run:

```bash
pnpm run build
```

Then reload Pi in the target project.

## Getting Started

See [docs/getting-started.md](docs/getting-started.md) for the available skills
and how the task, plan, implement, test, document, and review workflow is
intended to be used.

See [docs/why-pi.md](docs/why-pi.md) for why pi-code uses Pi as its harness.

## Known Gaps

pi-code depends on Pi and the available model providers. Some limitations are
outside pi-code itself:

- Claude usage through Pi requires Anthropic usage-based billing; Claude Code
  subscriptions do not currently work with third-party harnesses.
- OpenAI Codex works with third-party harness usage and is currently a viable
  path for Pi-based pi-code work.
- Pi does not include built-in web search. pi-code is currently local-first,
  though optional community extensions such as
  [pi-web-access](https://pi.dev/packages/pi-web-access) may be useful.
