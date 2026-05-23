# pi-code Goals

pi-code helps developers use AI without letting AI overwhelm the work.

The goal is not to make agents produce more text, bigger plans, or louder
reviews. The goal is to make AI useful inside real codebases by giving it the
right context, the right boundaries, and the right level of output for a human
developer to act on.

## Problem

AI tools can generate a massive amount of text and code. That volume has a cost.

Developers and reviewers can only read so much in a day before the signal gets
lost. Long AI-generated plans often become too dense to read. Large
implementation passes can make review harder instead of easier. Review comments
can explain so much background that the actual issue is buried.

When this happens, the AI is no longer reducing load. It is moving the load from
writing code to reading, validating, and correcting AI output.

## What pi-code Should Do

We want agents to do what developers need, not what the agent assumes is
helpful.

That means:

- Load reusable project-type conventions so agents do not need repeated
  correction.
- Keep injected context compact and relevant to the work at hand.
- Prefer concise planning that humans will actually read.
- Separate what and why from how.
- Treat implementation as an iterative process, not a one-shot execution of a
  perfect plan.
- Require implementation work to plan first, stop for human approval, then
  self-review and clean up before presenting results.
- Keep reviews focused on issues worth human attention.
- Respect legacy code by matching local style while applying current safety and
  correctness expectations where practical.

## Context Should Be Useful, Not Exhaustive

pi-code profiles are injected into agent context, so they should be compact and
high-signal. A profile should teach the agent reusable conventions that affect
code quality across similar projects, not document every framework feature or
repo-specific process.

Repo-specific instructions belong in the project's `AGENTS.md` or local skills.
pi-code should reduce repeated boilerplate across projects, not replace local
project context.

Some topics need examples because agents otherwise default to stale or harmful
patterns. Codeception and `@wordpress/data` are examples where concise code
snippets are worth the token cost. Other profiles should prefer prose unless an
example clarifies a difficult pattern.

Contextual profiles should only appear when relevant. A project may contain
frontend dependencies, but that does not mean every PHP task needs React or
WordPress data-store guidance.

## Planning Should Be Readable

pi-code separates task planning from implementation planning.

A task file describes what should change and why it matters. It is the product
and problem framing. It should avoid step-by-step implementation detail unless a
technical decision is part of the requirement.

An implementation plan describes how the agent intends to approach the code. It
should be concise enough to read in a couple of minutes. It should identify the
likely seams, sequence, risks, and verification without pretending the first
plan will survive contact with the code unchanged.

The first code pass is part of planning. It validates the plan, reveals wrong
assumptions, and creates the next round of decisions.

Implementation should not start silently. The agent should present a concise
plan, wait for approval, implement in focused passes, review its own diff, and
do at least one cleanup pass before handing the work back.

## Review Should Reduce Load

pi-code review should focus on findings the author would likely fix if they
understood them.

Review output should be specific and actionable, but not exhaustive for its own
sake. The goal is to help the human reviewer and implementer see the important
issues quickly.

A good review explains why an issue matters just enough to act on it. It should
not bury the finding in framework background, speculative edge cases, or long
restatements of conventions.

## Success Looks Like

pi-code is working when:

- Developers spend less time teaching agents project conventions.
- Agents produce smaller, more relevant plans.
- Review comments are easier to scan and act on.
- Context loaded into the model matches the code being touched.
- Legacy code changes feel native to the surrounding codebase.
- The human remains in control of direction and scope.

The result should feel like a well-onboarded teammate who knows when to be
brief.
