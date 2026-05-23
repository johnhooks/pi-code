# WordPress Components Conventions

Conventions for using `@wordpress/components` in React code.

## Component Selection

Use `@wordpress/components` for WordPress-native UI primitives such as form
controls, modals, color pickers, icons, popovers, and SlotFill integrations.

When the same component exists in both `@wordpress/components` and a project UI
library, prefer the project UI library for application UI. Common overlaps
include buttons, notices, search controls, tab panels, and surface/card
containers.

## Imports and Styles

Import components directly from `@wordpress/components` and icons from
`@wordpress/icons`. Ensure the WordPress component stylesheet is loaded once in
the relevant app entry point; components render unstyled without it.

```typescript
import { Modal, TextControl } from "@wordpress/components";
import { shield } from "@wordpress/icons";
import "@wordpress/components/build-style/style.css";
```

## Form Controls

Use controlled form components with explicit `value` or `checked` state and an
`onChange` handler. Keep labels and help text close to the control so forms
remain accessible and understandable.

```tsx
<TextControl
  label={__("API Key", "example-plugin")}
  value={apiKey}
  onChange={setApiKey}
/>
```

## Layout Components

Experimental WordPress layout components such as `__experimentalVStack` and
`__experimentalHStack` are acceptable in internal applications when they improve
consistency. Avoid experimental components in distributed plugins and themes
unless the project has already committed to that API.

## Modals and Composition

Compose WordPress components rather than rebuilding equivalent behavior. For
modals, use the WordPress `Modal` behavior and layer project styling around it
when needed.

## SlotFill

Use SlotFill when UI needs to render into named extension points across
component boundaries. Keep fill names specific to the feature or surface they
extend.
