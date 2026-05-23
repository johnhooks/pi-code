# PHP Conventions

General PHP conventions for project code. Project-type profiles (wordpress,
laravel) build on these.

## Legacy Codebases

Some codebases predate current conventions. When working in older areas, match
the local style enough that the change is maintainable in context, while moving
toward current conventions where practical.

- Follow the existing architecture, naming, and file organization for the code
  you are touching unless the task explicitly includes modernization.
- Apply current conventions for safety and correctness even in legacy code:
  input validation, output escaping, authorization checks, and explicit error
  handling.
- Do not rewrite unrelated legacy code just to satisfy modern conventions. Keep
  modernization scoped to the changed behavior.
- Prefer small incremental improvements over broad refactors. If a larger
  cleanup is needed, call it out separately.

## Type Safety

Every PHP file starts with `declare(strict_types=1)`. Type all parameters,
return types, and class properties.

- Use `===` and strict comparison throughout. Pass `true` as the third argument
  to `in_array()` and `array_search()`.
- Use union types (`string|int`) when multiple types are genuinely valid.
- Use actual type declarations on properties, not just `@var` annotations.
- Use PHPDoc for type information PHP cannot express directly, such as array
  shapes, generics, and iterable key/value types. Do not add docblocks that only
  repeat native type declarations.

## Names, Classes, and Closures

Use descriptive names for variables, methods, and booleans so the code explains
intent without comments. Prefer names such as `isEligibleForDiscount()` over
ambiguous shortcuts.

Declare classes `final` unless they are intentionally extended. Use `readonly`
classes when every property is readonly and the project runs on PHP 8.2 or
newer.

Use constructor property promotion when it makes dependencies or value objects
clearer without hiding setup logic.

Use `static` closures whenever the closure does not need `$this`. This makes
accidental object capture explicit and keeps callbacks easier to reason about.

## Control Flow and Error Handling

Prefer guard clauses and early returns when they make failure paths explicit and
keep the main path easy to scan. Avoid nesting conditionals when a clear exit or
small helper communicates the intent better.

Catch specific exceptions and preserve context when logging or wrapping
failures.

```php
try {
    $processor->process($orderId);
} catch (PaymentFailedException $e) {
    $logger->error('Payment failed.', ['order_id' => $orderId, 'exception' => $e]);

    throw new OrderProcessingException('Unable to process payment.', previous: $e);
}
```

- Log before returning defaults. If a catch block returns a fallback value, log
  why.
- Wrap unexpected exceptions in domain-specific exceptions with the original as
  `previous`.

## Dependency Injection

Inject dependencies through constructors or method parameters. Domain logic
depends on interfaces, not concrete infrastructure.

Avoid hidden global dependencies in domain code. Framework-specific shortcuts
belong in framework-specific profiles.
