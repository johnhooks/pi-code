# JavaScript Conventions

## Readability and Control Flow

Prefer clear control flow over dense expressions. Do not use nested ternaries;
use `if` statements, early returns, or named helper functions when conditions
branch more than once.

Keep boolean conditions readable. Extract complex predicates into well-named
variables or functions when that makes intent clearer. Use early returns to make
common exits and guard clauses obvious.

## Functions and Data Flow

Keep functions focused on one responsibility and pass required values
explicitly. Avoid hidden dependencies through mutable module state unless the
state is part of a deliberate module-level cache or singleton.

Prefer immutable updates for arrays and objects when transforming data. Use
mutation only when it is local, obvious, and simpler than copying. When the
original array must be preserved, prefer immutable array methods such as
`toSorted()`, `toReversed()`, `toSpliced()`, and `with()` when the runtime
supports them; otherwise copy before using mutating methods.

Use `Set` and `Map` for repeated membership or lookup checks instead of scanning
arrays repeatedly. Keep simple one-off lookups simple; reach for indexed data
structures when the lookup happens inside loops, filters, renders, or repeated
operations.

## Async Code

Use `async`/`await` for asynchronous control flow unless promise chaining is
clearer for composition. Always return, await, or deliberately handle promises
so failures are not lost.

Run independent asynchronous work concurrently with `Promise.all()` instead of
awaiting each operation in sequence. Defer expensive asynchronous work until the
branch that needs it, and check cheap synchronous conditions before starting
unnecessary remote or I/O work.

Catch errors at a boundary that can recover, add context, or report the failure.
Avoid broad fallback behavior that hides defects.

## Modules

Avoid circular module dependencies. If two modules need each other, extract
shared types, constants, or helpers into a third module.

## Runtime Boundaries

Validate or normalize external input before using it in application logic. This
includes parsed JSON, environment variables, CLI arguments, request payloads,
storage data, and third-party responses.

Prefer small boundary adapters that convert loose external data into the shapes
the rest of the code expects. For browser storage, store only the fields needed,
version persisted keys or payloads when the schema may change, and handle
storage and JSON failures explicitly.
