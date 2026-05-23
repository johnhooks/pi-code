# Laravel PHP Conventions

Laravel conventions for application code, emphasizing domain-oriented
organization, reusable jobs, typed domain values, and framework-aware
integration points.

## File Organization

Organize application code around domains instead of Laravel's default type-first
structure when adding business logic. `app/Services/{Domain}` is the preferred
home for domain-oriented services, integrations, value objects, and supporting
classes that belong together.

Keep Laravel auto-discovered or framework-registered classes in the locations
Laravel expects, such as events, listeners, and other classes wired by framework
conventions. Domain behavior should still live with the relevant service
namespace instead of being organized only by Laravel type.

Use Laravel generators for framework artifacts when adding controllers, models,
migrations, jobs, requests, commands, and tests. Generated files start from the
framework's current structure and reduce drift from Laravel conventions.

Follow the application's existing Laravel structure. Do not migrate an older
Laravel layout to a newer streamlined structure unless the task explicitly asks
for that modernization.

## Events and Listeners

Name events for what happened, not for the listener or side effect that first
needs them. Treat events as multipurpose signals that may gain additional
listeners over time, including events emitted from model lifecycle hooks.

Name listeners as `{Action}On{Event}` so the class explains both the work
performed and the event that triggers it, such as
`RefreshUserPurchaseInfoOnLogin` or `VerifySiteTypeCountOnUserQuotasRefreshed`.

## Jobs

Use jobs for queued work and for reusable units of application work. A job does
not have to be asynchronous; when the caller needs the result in the current
execution flow, run the job synchronously instead of dispatching it to the
queue.

Prefer inline synchronous execution with `dispatch_sync()` when composing jobs
inside another job, listener, or request flow that must complete before
continuing. Dispatch to the queue when the work can happen later, should retry
independently, or should not block the current request.

## Routes and Controllers

Prefer named routes and `route()` when generating application links. Keep URL
paths readable, resource-oriented, and consistent with the existing route naming
style.

Prefer thin controllers that validate input, coordinate the relevant service or
job, and return a response. Small amounts of request-specific orchestration are
acceptable when extracting them would make the code harder to follow.

Move workflows to a domain service or reusable job when the logic is shared, has
side effects, needs queueing or retry behavior, or starts to obscure the
controller's request/response responsibility.

## Form Requests

Prefer Form Requests for reusable or non-trivial validation. Inline
`$request->validate()` is acceptable for simple request-specific validation.

Use array validation rule notation for non-trivial rules so custom rules,
conditional rules, and enum rules remain easy to extend.

## Enums

Use PHP backed enums for constrained domain values such as statuses, types, sort
fields, filter operators, and external webhook states. Validate request values
with `Rule::enum()` and convert validated scalar input into enum instances
before branching on it.

Cast Eloquent attributes to enum classes when the column represents a domain
enum. This keeps model code and resources working with typed values instead of
raw strings.

Enums may own small mapping logic that belongs to the value itself, such as
converting a connection type to a route path, determining a required embed for a
sort field, or mapping an API status to internal behavior. Keep that logic
cohesive and avoid scattering `match` statements for the same enum across
controllers and jobs.

## Eloquent Models

Define relationships, casts, and fillable or guarded attributes explicitly.

Avoid putting business logic in models. Models handle data shape, relationships,
casts, scopes, and model lifecycle events. Use model events to emit domain
events when other parts of the application need to react to model changes.

### Query Scopes

Use scopes for reusable query conditions.

### Eager Loading

Eager load relationships when you know you will access them. Avoid N+1 queries.

## Services and Jobs

For business logic that spans multiple models or has side effects, use domain
services and reusable jobs. Prefer jobs for discrete workflows that may need
queueing, retry behavior, or reuse from controllers, listeners, commands, or
other jobs.

Wrap multi-step writes in `DB::transaction()`.

## Migrations

Migrations should be reversible. Always implement `down()`.

Do not modify existing migrations that have been run in production. Create a new
migration to alter the table.

When changing an existing column, include the existing column attributes in the
new migration so Laravel does not drop them unintentionally.

## API Resources

Use API Resources to control JSON output shape.

Use `whenLoaded()` to conditionally include relationships.

## Configuration

Use config files and environment variables. Never hardcode credentials or
environment-specific values.

Do not call `env()` outside of config files. It returns `null` when config is
cached.

Read configuration in service providers and pass it into services through
constructor arguments. Application services should receive resolved
configuration values through dependency injection instead of calling `config()`
throughout domain logic.

## Testing

Use feature tests for HTTP endpoints, unit tests for services, and focused tests
for reusable jobs.

Use factories for test data. Check for useful factory states before manually
assembling model attributes. Do not seed the database manually in tests.
