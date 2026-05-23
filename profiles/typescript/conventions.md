# TypeScript Conventions

## Type Safety

Prefer specific types that describe the actual data shape. Use `unknown` at
untyped boundaries, then narrow with runtime checks before use. Type exported
functions, public methods, object shapes, and callback contracts so callers get
useful guarantees.

Use union types, discriminated unions, generics, and small interfaces when they
model real states or reusable contracts. Do not hide uncertainty with broad
types such as `object`, `Function`, or unconstrained `Record<string, unknown>`
when a narrower shape is known.

Prefer precise callback and action types over broad function props. Name
function signatures around domain intent and data flow so callers know what can
be passed and what the function is allowed to return.

## External APIs

Check installed package type definitions when using external APIs instead of
guessing method names, event shapes, or option objects. Prefer the library's
exported types over duplicating them locally.

## Boundaries and Narrowing

Use small type guards or schema validation when a value crosses from `unknown`
into domain code. Prefer type guards when simple assertions would be too naive,
especially for nested objects, discriminated unions, arrays, tool inputs, and
third-party payloads. After narrowing, prefer precise domain types over
repeatedly checking loose values.

## Modeling States

Represent impossible or unsupported states explicitly. Exhaustive `switch`
statements over discriminated unions should fail at compile time when a new
variant is added.
