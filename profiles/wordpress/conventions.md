# WordPress PHP Conventions

WordPress conventions for plugins and themes.

## Coding Standards

Use the project's PHPCS ruleset for PHP changes. Do not leave `FIXME` comments
in committed code.

## Naming

- **Functions**: `snake_case`, prefixed with plugin/theme slug:
  `{plugin_slug}_get_event()`
- **Classes**: `PascalCase` under the project's PSR-4 namespace:
  `PluginName\Tickets\Admin\Settings`
- **Hooks (actions)**: `{vendor_or_project}/{plugin_slug}/{action}` — e.g.
  `acme/tickets/event_created`
- **Hooks (filters)**: `{vendor_or_project}/{plugin_slug}/{what}` — e.g.
  `acme/tickets/ticket_price`
- **Constants**: `UPPER_SNAKE_CASE`, prefixed: `PLUGIN_NAME_TICKETS_VERSION`
- **File names**: `class-{name}.php` for legacy, `{PascalName}.php` for PSR-4
- **Database tables**: `{$wpdb->prefix}{plugin_slug}_{table_name}`

## Autoloading

Use Composer PSR-4 autoloading for modern PHP code. Keep the main plugin file
focused on bootstrapping and loading the autoloader.

## Hooks and Filters

Document hooks with `@since`, `@param`, and for filters `@return`. When the
release version is not known yet, use `@since TBD` and replace it before
release.

Do not create hooks speculatively. Add them when there is a concrete
extensibility need.

When integrating with optional plugins or themes, check that the dependency is
available before registering hooks or instantiating integration classes. Keep
integration code isolated so the plugin deactivates or the dependency disappears
without fatal errors.

## Database Access

Prefer WordPress APIs such as `WP_Query`, `get_posts()`, and post meta functions
for post data. Use direct SQL for custom tables only, and prepare every query
that includes variable input with `$wpdb->prepare()`.

Use `dbDelta()` for table creation in activation hooks.

## Sanitization and Escaping

Sanitize input, unslash request data before sanitizing, and escape output for
the output context.

Do not rely on sanitization as a substitute for output escaping.

## Nonces and Capabilities

Verify capabilities before privileged actions and verify nonces for form
submissions, AJAX, and other state-changing requests.

## REST API Endpoints

Register endpoints under a versioned namespace and always provide a real
`permission_callback`. Only use `__return_true` for public read-only data.

Validate and sanitize request arguments before using them.

## Changelog

Write changelog and release-facing messages for site owners, not implementers.
Describe the visible behavior or user benefit instead of internal class names,
methods, or tooling.

## Enqueuing Assets

Enqueue assets through WordPress hooks, declare dependencies, and version files.
Scope admin assets to the relevant screen.

## Deprecation and Compatibility

Use WordPress deprecation helpers such as `_deprecated_function()`,
`_deprecated_argument()`, and `_doing_it_wrong()` when replacing public APIs or
behavior. Include the version, a useful replacement when one exists, and a
message that helps extenders migrate.

## Distribution

For WordPress.org plugins, keep release archives focused on runtime files. Use
`.gitattributes` `export-ignore` rules for tests, CI, local tooling, source
files that are replaced by built assets, and AI-agent configuration that should
not ship to user sites.

## Error Handling

Use `WP_Error` for recoverable failures and check return values from WordPress
APIs before continuing.

Do not call `wp_die()` outside admin request handlers. In REST endpoints, return
`WP_Error` or `WP_REST_Response`.
