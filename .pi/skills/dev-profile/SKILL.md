---
name: dev-profile
description:
  Create or refine a pi-code convention profile from source documentation.
---

# Dev Profile

Help the developer create or update a convention profile in `profiles/`.

## Process

1. **Identify the source.** If $ARGUMENTS names a file or directory, read it.
   Otherwise ask the developer what documentation or knowledge they want to turn
   into a profile.

2. **Check for an existing profile.** Look in `profiles/` to see if a profile
   already exists for this topic. If it does, read the current `conventions.md`
   and understand what's there.

3. **Read the registry.** Read `profiles/registry.json` to understand the
   current profiles and their detection rules.

4. **Draft or update the conventions.md.** Distill the source material into a
   convention document following the project style:
   - Focus on what to do, not anti-patterns
   - Be aware of token cost because profiles are injected into agent context
   - Keep profiles compact and high-signal
   - Prefer concise prose over examples
   - Use code examples only when necessary to demonstrate a difficult concept or
     clarify an otherwise ambiguous pattern
   - Show the preferred pattern only; typically do not include incorrect
     examples or anti-patterns that may be repeated by agents
   - Keep it concise. Each section should be a few sentences, with at most one
     necessary code example
   - Do not add formatting or style rules that should be enforced by linting,
     formatting, or static analysis tools. Profiles should focus on intent,
     architecture, safety, correctness, and maintainability that tools cannot
     reliably fix on their own.
   - Use plain markdown with `##` sections
   - Open with a one-line description of what the profile covers

5. **Update the registry.** If this is a new profile, add it to
   `profiles/registry.json` with appropriate detection rules and `requires`
   dependencies. Detection rules use three forms:
   - File existence: `"codeception.yml"`
   - Content match: `"style.css:Theme Name:"`
   - JSON key lookup: `"composer.json:require.laravel/framework"`

6. **Test detection.** Run `pnpm run detect -- /path/to/project` against a real
   project to verify the rules match.

7. **Report what was created.** Show the developer the file paths and a summary
   of what the profile covers.

## Style Reference

Read the existing profiles in `profiles/` for tone and structure. The `php`
profile is the base — other profiles should not repeat what it already covers.
Use `"requires": ["php"]` in the registry for PHP-based profiles.
