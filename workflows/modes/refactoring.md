# Refactoring Mode

Use this mode when the task moves, renames, extracts, inlines, or restructures
code without intended behavior changes.

Refactoring should preserve behavior. Any behavior change should be called out
and approved as product work, not hidden inside cleanup.

## Expectations

Identify affected files, symbols, imports, and callers before editing. Establish
the current behavior or test baseline when practical. Move, rename, extract, or
inline code mechanically.

Keep public inputs, outputs, side effects, and compatibility unchanged. Search
for old names, paths, or imports after the change. Treat missed references as
defects, even when tests pass.

## Done Means

Behavior is preserved. References to old names or paths have been checked. Tests
or verification show the new structure still works. The diff does not include
unrelated feature or cleanup work.
