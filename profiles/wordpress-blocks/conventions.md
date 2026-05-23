# WordPress Block Conventions

## Block Metadata

Define blocks with `block.json` metadata and register them from metadata on the
PHP side. Keep block names namespaced, declare assets through metadata when
practical, and use the metadata schema instead of duplicating registration
details in PHP and JavaScript.

Use block supports for standard editor capabilities such as spacing, color,
typography, alignment, and borders before creating custom controls. Treat
experimental supports as version-sensitive and follow the project's WordPress
version support policy.

## Editor Implementation

Use WordPress block editor primitives for editor behavior. Use block props for
wrapper attributes, inspector controls for settings, block controls for toolbar
actions, rich text controls for editable content, and inner blocks when the
block owns nested block content.

Keep editor state aligned with block attributes. Store durable content and
settings in attributes; keep transient UI state local to the editor component.

## Dynamic Rendering

Use a server-side render callback when output depends on live WordPress data,
permissions, current query context, or runtime environment. Static blocks should
save stable markup and avoid server rendering when the saved content is
sufficient.

In PHP render callbacks, use `get_block_wrapper_attributes()` for wrapper markup
and escape dynamic attributes and output for their context. Prefer WordPress
HTML APIs such as `WP_HTML_Tag_Processor` when modifying existing block markup
instead of fragile string replacements.

## Frontend Behavior

Load frontend scripts only when the block needs runtime behavior. Prefer block
metadata and script modules over global scripts when the project supports them.

Keep frontend behavior accessible without assuming the editor is present.
Preserve keyboard behavior, focus management, ARIA state, and server-rendered
fallback markup for interactive controls.

## Interactivity API

For interactive frontend blocks, prefer the WordPress Interactivity API when the
supported WordPress version includes the needed features. Declare interactivity
support in `block.json`, initialize server-provided state or context in PHP, and
use directives for DOM updates instead of manual DOM mutation.

Only declare client-side navigation compatibility when the block is designed for
it. Blocks that mutate the DOM outside the Interactivity API or depend on
untracked client-side setup should not claim client navigation compatibility.
