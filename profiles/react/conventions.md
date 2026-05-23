# React Conventions

## Components

Write components as focused functions with explicit props. Keep rendering logic
close to the component, and extract child components when branching, repeated
markup, or local state makes the parent hard to scan.

Define component types at module scope, not inside other components. Pass needed
values through props or context instead of creating nested component definitions
that remount on every parent render.

## Component APIs

Use composition over configuration when a component needs flexible content.
Prefer `children`, slots, and small wrapper components over large option objects
that try to describe UI.

Avoid growing components through many boolean props that create hidden mode
combinations. When variants have different structure or behavior, create
explicit variant components that compose shared pieces.

## Props and State

Keep props minimal and named for the consumer's intent. Derive values during
render when they can be computed from props or state instead of storing
duplicate state.

Keep state as local as practical. Lift state only when multiple components need
to coordinate, and prefer a reducer when several state transitions belong to the
same workflow.

Use functional state updates when the next value depends on the previous value.
This avoids stale closures and keeps callbacks from depending on state only to
compute the next state.

## Effects

Use effects for synchronization with systems outside React, such as
subscriptions, timers, browser APIs, network requests, or imperative widgets. Do
not use effects for values that can be derived during render.

Put side effects caused by a specific user interaction in that event handler
instead of modeling the interaction as state plus an effect. Keep effect
dependencies accurate and narrow by depending on the specific primitive values
or derived booleans the effect uses rather than broad objects.

## Events and Forms

Use controlled inputs when React state is the source of truth. Keep form updates
explicit and validate or normalize values at the boundary before passing them
into application logic.

Name event handlers by user intent, such as `onSave` or `onSelectPlan`, when
passing them between components. Use DOM event names only for handlers attached
directly to DOM elements.

## Performance

Use memoization to preserve behavior or avoid measured work, not as a default.
Prefer simpler components and stable data flow before adding `memo`, `useMemo`,
or `useCallback`.

Treat props and state as immutable. Avoid mutating arrays or objects received
from props, context, or state; copy first or use immutable collection methods
when deriving sorted, reversed, spliced, or replaced values.
