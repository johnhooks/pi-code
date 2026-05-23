# WordPress Internationalization Conventions

## Text Domains

Register script translations for WordPress-enqueued JavaScript bundles that use
`@wordpress/i18n`.

## PHP Strings

Wrap user-facing strings in WordPress translation functions. Escape translated
output for the output context with helpers such as `esc_html__()`,
`esc_attr__()`, or by escaping the translated value at render time.

Use `_x()` when a short or ambiguous string needs context, such as a button
label, placeholder, noun, verb, or delimiter. Use `_n()` and `_nx()` for
count-dependent strings instead of manually branching on singular and plural
copy.

## JavaScript Strings

Import translation helpers from `@wordpress/i18n` for WordPress JavaScript. Use
`__()`, `_x()`, `_n()`, `_nx()`, and `sprintf()` for user-facing UI copy,
including notices, loading text, validation messages, button labels, headings,
alt text, and screen-reader text.

Use `createInterpolateElement()` when a translated JavaScript string needs
inline markup or React components. Keep the translated sentence intact and
interpolate named elements instead of splitting the sentence around markup.

## Placeholders and Translator Comments

Use placeholders instead of concatenating translated strings with dynamic
values. Prefer numbered placeholders when a string contains more than one value
so translators can reorder the sentence.

Add translator comments immediately before strings with placeholders, hidden
accessibility text, unusual context, or values that are not obvious from the
source string. Start comments with `translators:` and describe each placeholder
by position or name. Keep the comment directly adjacent to the translation
function call it describes, with no unrelated code or comments between them.

```php
$message = sprintf(
    /* translators: 1: Plugin name, 2: Error message. */
    __( '%1$s could not be activated. %2$s', 'plugin-text-domain' ),
    $plugin_name,
    $error_message,
);
```

```js
const message = sprintf(
  /* translators: %s: Number of selected items. */
  _n("%s item selected", "%s items selected", count, "plugin-text-domain"),
  count,
);
```

## What Not to Translate

Do not translate internal identifiers, slugs, option keys, cache keys, protocol
values, class names, hook names, or machine-readable API values.

Developer-only exception messages, debug output, and logs do not need
translation unless they are shown to site owners or administrators in the
WordPress UI.
