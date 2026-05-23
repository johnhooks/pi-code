# Why Pi

pi-code uses Pi because we want to get closer to the agent harness instead of
only writing prompts around it.

That is the interesting part for us. Pi makes the harness local, programmable,
and inspectable. We can see how skills are expanded, how extension hooks run,
how tools and tool results affect later turns, and where context should come
from. Instead of treating the coding agent as a fixed product, we can treat it
as something we can shape.

We do not know yet if this is the best way to work. Part of pi-code is
discovering that together. Some ideas will be useful, some will probably be too
much, and some will need to move between prompts, profiles, workflows, runtime
code, or project-local instructions. Pi gives us a place to try those ideas.

## Why that matters

AI is a tool. We want to master it, not be carried along by it.

For pi-code, that means learning how to guide agents toward the work developers
actually need: smaller plans, better context, focused implementation, useful
reviews, and less repeated correction. It also means keeping the human in
control of direction, scope, and judgment.

Pi helps because pi-code can control when conventions are injected, which
profiles are active, how workflow guidance is layered in, and what happens after
an implementation pass. A WordPress project can have block-editor, components,
and data-store guidance available without forcing every unrelated PHP task to
carry all of that context.

## Building the tool with the tool

pi-code is developed inside Pi. When a skill, workflow, convention, or extension
behavior feels awkward, we can use pi-code to inspect, plan, change, review, and
improve itself.

That feedback loop is valuable. It exposes the real seams of an agent harness:
context injection, skill boundaries, follow-up turns, review noise, local
configuration, and verification. The answers become code, tests, and docs
instead of prompt folklore.

## The goal

The goal is not a louder agent. The goal is a more controllable one.

Pi gives pi-code enough access to experiment with context, workflow, and tools
while staying local and understandable. That makes it a practical foundation for
learning how teams can adapt AI coding assistants instead of only prompting
around their limits.
