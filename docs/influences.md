# Influences

pi-code is informed by related work on reusable AI coding context, but it is not
a fork or direct port. We want to keep the useful patterns while fitting how
personal developers work: compact conventions, small workflow skills, local
project evidence, and concise output.

## Vercel Agent Skills

[Vercel Agent Skills](https://github.com/vercel-labs/agent-skills) shows how
focused skills can package high-signal guidance with clear activation rules and
progressive disclosure. We use it as a source of profile ideas, especially for
React, JavaScript, and TypeScript conventions.

We do not install a large set of narrowly scoped skills by default. Too many
skills can make agents over-select workflows or over-optimize small changes. We
distill reusable guidance into injected project-type profiles instead.

## Laravel Boost

[Laravel Boost](https://github.com/laravel/boost) shows how framework-maintainer
guidance can be generated from the actual Laravel application and package
versions in use. We use it as inspiration for Laravel-native conventions such as
following the existing app structure, using framework generators, preserving
migration column attributes, and relying on focused tests.

We leave behind Boost-specific runtime behavior, MCP tooling, command templates,
and version-specific Laravel instructions that only apply when the target app
has that exact Laravel version or project structure.

## Spatie Guidelines Skills

[Spatie Guidelines Skills](https://github.com/spatie/guidelines-skills) shows
how a team's coding preferences can be packaged as agent skills with concise
activation rules and deeper references. We use it as inspiration for general PHP
and Laravel profile guidance around type information, readable control flow,
validation boundaries, factories, and user-facing changelog language.

We leave behind formatting and style rules that should be enforced by linting,
formatting, or static analysis tools, along with Spatie-specific preferences
that conflict with personal conventions.

## WordPress Projects

[Automattic WordPress ActivityPub](https://github.com/Automattic/wordpress-activitypub)'s
`.agents/skills` show how project-specific WordPress guidance can cover
integrations, release archives, changelogs, testing, and protocol or domain
behavior. WordPress core, Gutenberg, and representative plugin codebases also
informed the WordPress block and internationalization guidance across PHP and
JavaScript.

We use these projects as inspiration for WordPress profile guidance around
optional integrations, deprecation helpers, release-facing changelog language,
runtime-focused archives, block metadata, block editor primitives, dynamic
rendering, Interactivity API boundaries, text domains, translation helpers,
pluralization, placeholders, translator comments, and `@wordpress/i18n`.

We leave behind ActivityPub-specific architecture, project commands, branch and
PR process, release mechanics, plugin-specific helper APIs, and repo-specific
text domains. Those belong in the target repository's `AGENTS.md` or local
skills.

## RDF

[RDF](https://github.com/rfxn/rdf) shows a governance-driven model with reusable
profiles, workflow modes, convention inheritance, evidence-based review, and
adapter delivery across agent runtimes.

We take inspiration from that separation between what the codebase is and how
the agent should work, but intentionally stay lighter. RDF fits high-risk
production systems with extensive governance and quality gates. Our focus is
helping personal agents follow shared coding expectations without turning every
task into a formal release pipeline.

## pi-code Direction

We favor intentional context injection over broad skill installation. The
extension detects project types, loads compact conventions, and layers workflow
guidance when pi-code skills are used. Project-specific architecture, commands,
tests, release process, and maintainer preferences still belong in the target
repo's `AGENTS.md` or local skills.
