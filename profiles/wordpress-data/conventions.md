# WordPress Data Conventions

Conventions for using `@wordpress/data` state management in project code.

## Store Structure

Always split store components into separate files:

```
store/
├── index.ts        # createReduxStore + register
├── actions.ts      # Action creators and thunks
├── reducer.ts      # Reducer(s) + initial state
├── selectors.ts    # Selectors + memoized selectors
├── resolvers.ts    # Auto-fetching resolvers
├── constants.ts    # STORE_NAME
└── types.ts        # State, Action, Thunk types
```

### Store Registration

```typescript
// index.ts
import { register, createReduxStore } from "@wordpress/data";
import * as actions from "./actions";
import { STORE_NAME } from "./constants";
import reducer, { initializeDefaultState } from "./reducer";
import * as resolvers from "./resolvers";
import * as selectors from "./selectors";

export const store = createReduxStore(STORE_NAME, {
  actions,
  reducer,
  selectors,
  resolvers,
  initialState: initializeDefaultState(),
});

register(store);
```

## React Hooks — Always Use Hooks in Components

Use `useSelect` and `useDispatch` in React components. Never call `select()` or
`dispatch()` directly inside components — it bypasses React's rendering
lifecycle.

```tsx
// Reading data
const items = useSelect((select) => select(itemStore).getItems(), []);

// Multiple values
const { items, count } = useSelect((select) => ({
  items: select(itemStore).getItems(),
  count: select(itemStore).getItemCount(),
}));

// With dependencies
const filtered = useSelect(
  (select) => select(itemStore).getFilteredItems(filterType),
  [filterType],
);

// Dispatching
const { saveItem, deleteItem } = useDispatch(itemStore);
```

**Never use legacy HOCs** (`withSelect`, `withDispatch`, `withRegistry`) in new
code.

## Actions

### Prefer Async/Await Thunks

```typescript
// actions.ts
export const saveEditedItem =
  (itemId: number): ItemsThunk =>
  async ({ dispatch, select, registry }) => {
    dispatch({ type: "SAVE_EDITS_START" });

    const edits = select.getItemEdits(itemId);

    try {
      const item = await apiFetch<Item>({
        path: "/wp/v2/items",
        method: "PUT",
        data: edits,
      });
      dispatch({ type: "SAVE_EDITS_FINISHED", item });
      return item;
    } catch (error) {
      const errors = await toErrorMap(error);
      dispatch({ type: "SAVE_EDITS_FAILED", itemId, errors });
    }
  };
```

**Never use generator actions in new code.** Only touch generators when
modifying existing legacy code.

### Inline Actions

Dispatch action objects inline within thunks. Only create separate action
creators for actions used outside the module.

```typescript
// GOOD: inline dispatch
dispatch({ type: "SAVE_EDITS_START" });

// Only if needed externally:
export function resetConnection(siteId: number) {
  return { type: "RESET_CONNECTION", siteId };
}
```

### Cross-Store Operations

Access other stores through the `registry` thunk argument:

```typescript
async ({ dispatch, select, registry }) => {
  const canEdit = registry.select(widgetStore).canEdit();
  // ...
  registry.dispatch(widgetStore).receiveItem(item);
};
```

## Selectors

### Selector Stability is Critical

Selectors must return stable references. Unstable selectors cause unnecessary
React re-renders on every state change.

```typescript
// SAFE — direct state reference
export function getItems(state: State) {
  return state.items;
}

// SAFE — primitive value
export function getItemCount(state: State) {
  return state.items.length;
}

// SAFE — find() returns existing reference
export function getItemById(state: State, id: number) {
  return state.items.find((item) => item.id === id);
}

// UNSAFE — filter() creates new array every call
export function getActiveItems(state: State) {
  return state.items.filter((item) => item.active); // new array!
}
```

### Memoize Derived Data with `createSelector`

Any selector that creates new objects or arrays must use `createSelector`:

```typescript
import { createSelector } from "@wordpress/data";

export const getActiveItems = createSelector(
  (state: State) => state.items.filter((item) => item.active),
  (state: State) => [state.items],
);

export const getFilteredItems = createSelector(
  (state: State, filterType: string) =>
    state.items.filter((item) => item.type === filterType),
  (state: State, filterType: string) => [state.items, filterType],
);
```

Dependencies array must include all values that affect selector output.

### Cross-Store Selectors

```typescript
import { createRegistrySelector } from "@wordpress/data";

export const getItemsWithWidget = createRegistrySelector(
  (select) => (state: State) => {
    return state.items.map((item) => ({
      ...item,
      widget: select(widgetStore).getWidget(item.id),
    }));
  },
);
```

## Resolvers

### Resolver Names Must Match Selector Names

This is how `@wordpress/data` connects them automatically:

```typescript
// selectors.ts
export function getItems(state: State) { ... }

// resolvers.ts — same name
export const getItems =
    (query: ItemListQuery): ItemsThunk =>
    async ({ dispatch }) => {
        const path = addQueryArgs('/wp/v2/items', query);
        const items = await apiFetch<Item[]>({ path });
        dispatch.receiveItemsQuery(path, items);
        return items;
    };
```

**Never use generator resolvers in new code.**

### Error Handling Pattern

```typescript
export const getItems =
  (query: ItemListQuery): ItemsThunk =>
  async ({ dispatch }) => {
    const queryId = addQueryArgs("/wp/v2/items", query);
    dispatch({ type: "FETCH_ITEMS_START", queryId });

    try {
      const items = await apiFetch<Item[]>({ path: queryId });
      dispatch({ type: "FETCH_ITEMS_FINISHED", queryId, items });
    } catch (error) {
      const errors = await toErrorMap(error);
      dispatch({ type: "FETCH_ITEMS_FAILED", queryId, errors });
    }
  };
```

## Reducers

Use `combineReducers` to split complex state:

```typescript
import { combineReducers } from '@wordpress/data';

function items(state: ItemsState, action: Action) { ... }
function itemEdits(state: EditsState, action: Action) { ... }

export default combineReducers({ items, itemEdits });
```

## TypeScript

Define types in `types.ts`:

```typescript
import {
  StoreDescriptor,
  ReduxStoreConfig,
} from "@wordpress/data/build-types/redux-store";
import { Thunk } from "@utils/data/types";

interface State {
  items: { byId: Record<string, Item>; queries: Record<string, number[]> };
  itemEdits: {
    byId: Record<string, ItemEdits>;
    pendingById: Record<string, boolean>;
    errors: Record<string, ErrorMap>;
  };
}

export type Action =
  | { type: "RECEIVE_ITEMS_QUERY"; items: Item[]; queryId: string }
  | { type: "RECEIVE_ITEM"; item: Item }
  | { type: "SAVE_EDITED_ITEM_START"; itemId: number }
  | { type: "SAVE_EDITED_ITEM_FINISHED"; item: Item }
  | { type: "SAVE_EDITED_ITEM_FAILED"; itemId: number; errors: ErrorMap };

export type ItemsThunk = Thunk<
  Action,
  StoreDescriptor<ReduxStoreConfig<State, typeof actions, typeof selectors>>
>;
```

## Invalidating Resolutions

```typescript
dispatch.invalidateResolution("getItemById", [id]);
dispatch.invalidateResolutionForStore();
```
