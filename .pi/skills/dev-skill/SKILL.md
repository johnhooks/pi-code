---
name: dev-skill
description: Create or refine a pi-code skill.
---

# Dev Skill

Help the developer create or update a skill in `skills/`.

## Process

1. **Understand the skill.** If $ARGUMENTS describes the skill, use it as a
   starting point. Otherwise ask the developer what the skill should do.

2. **Check existing skills.** Read the current skills in `skills/` to understand
   the patterns and avoid overlap.

3. **Draft the SKILL.md.** Create the skill following the project conventions:
   - YAML frontmatter with `name` and `description` fields
   - Runtime skill names are short action names such as `task`, `plan`, `code`,
     `review`, `test`, and `docs`
   - Directory name matches the `name` field
   - Runtime convention skills should use extension-injected `<pi-code-context>`
     as their convention source.

4. **Create the directory and file.** Write `skills/{skill-name}/SKILL.md`.

5. **Report the file path** and summarize what the skill does.

## Style Reference

Skills are instructions for the agent, not code. They describe a process the
agent should follow when invoked. Read existing skills in `skills/` for tone and
structure.
