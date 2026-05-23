# WP Browser Testing Conventions

Conventions for WordPress plugin tests using `lucatume/wp-browser` with
Codeception.

## Test Suites

Use WP Browser suites based on what is under test. Integration tests use
`WPLoader` and extend a project test case based on
`lucatume\WPBrowser\TestCase\WPTestCase`. End-to-end tests use Cest classes with
the generated actor and WP Browser modules such as `WPDb`, `WPBrowser`, and
`WPFilesystem`.

Keep suite configuration in `tests/{Suite}.suite.yml` and read
environment-specific values from the test env file rather than hardcoding
database, URL, or WordPress paths.

## Integration Tests

Use integration tests for WordPress-loaded PHP behavior: plugin boot, hooks,
services, containers, options, post/meta APIs, and code that needs WordPress
functions but not browser navigation.

Integration test classes should be `final`, named for the behavior under test,
and extend the project's shared `TestCase` so plugin setup, service container
reset, logging, and fixtures are consistent.

## End-to-End Tests

Use end-to-end Cest tests for behavior that depends on HTTP requests, admin
navigation, generated files, browser-visible responses, or WordPress state
across requests.

Set up and tear down plugin state in `_before()` and `_after()` when the test
changes global WordPress state, cache files, generated drop-ins, rewrite
behavior, or active plugins.

## Actor Helpers

Put repeated WordPress testing operations in suite helpers so tests read as
behavior instead of setup mechanics. Helpers are a good place for plugin
activation, database fixtures, filesystem assertions, response header access,
and custom cache or WordPress state assertions.

Prefer actor methods such as `$I->havePostInDatabase()`,
`$I->haveOptionInDatabase()`, `$I->amOnPage()`, and project-specific helper
methods over hand-rolled database setup in test bodies.

## Fixtures and Test Data

Create WordPress records through WP Browser modules and factories where
available. Keep fixture files under `tests/_data` and load them through shared
helper methods or the project `TestCase`.

Tests should create the data they assert against and avoid depending on
persistent local state beyond the suite dump and configured test environment.

## Assertions

Use actor assertions for browser, database, filesystem, and HTTP response
behavior. Use PHPUnit assertions for domain-level values, object state, and
comparisons that are clearer outside the actor API.

Keep tests focused on one behavior even when the setup requires several
WordPress records or requests.
