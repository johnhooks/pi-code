# Codeception Testing Conventions

Conventions for writing Codeception tests (v5.0.12) in Laravel projects.

## Test Types

Use the right test type for the job:

- **Unit** (`tests/Unit/`) — Isolated class/method tests. Extend
  `\Codeception\Test\Unit`. Actor: `UnitTester`.
- **Functional** (`tests/Functional/`) — API endpoints, controllers, Laravel
  features without a browser. Use Cest format. Actor: `FunctionalTester`.
- **Integration** (`tests/Integration/`) — Complex workflows, external service
  integrations. Actor: `IntegrationTester`.

## Test Formats

### Cest Format (Functional/Integration)

```php
class SiteCest {
    public function _before(FunctionalTester $I): void {
        $this->site = $I->havePostAuthSite();
        $I->logInUser($this->site->user->username);
        $I->haveHttpHeader('Accept', 'application/json');
    }

    public function tryToCreateSite(FunctionalTester $I): void {
        $I->sendPost('/api/sites', ['name' => 'Test Site']);
        $I->seeResponseCodeIs(201);
    }
}
```

### Unit Format

```php
class SomeTest extends \Codeception\Test\Unit {
    protected UnitTester $tester;

    public function testSomething(): void {
        // Use $this->tester or PHPUnit assertions
    }
}
```

## Creating Test Records

### Single Records — `$I->have()`

```php
$user = $I->have(User::class);
$site = $I->have(Site::class, [
    'user_id' => $user->id,
    'type'    => SiteType::Pro,
]);

// In unit tests:
$user = $this->tester->have(User::class);
```

### Multiple Identical Records — `$I->haveMultiple()`

```php
$sites = $I->haveMultiple(Site::class, 2, [
    'user_id' => $user->id,
    'type'    => SiteType::Pro,
]);
```

### Multiple Records with Varying Data — `Factory::sequence()`

```php
$sites = Site::factory()->count(2)->sequence(
    ['type' => SiteType::Pro],
    ['type' => SiteType::Basic],
)->create([
    'user_id' => $user->id,
]);
```

### Linked Records Pattern

Create parent records first, then link children via `sequence()`:

```php
$sites = $I->haveMultiple(Site::class, 2, ['user_id' => $this->user->id]);

SiteMonitor::factory()->count(2)->sequence(
    ['id' => $sites[0]->id],
    ['id' => $sites[1]->id],
)->create(['summary_update_timestamp' => $staleTimestamp]);
```

## HTTP/REST Testing

```php
// Setup
$I->haveHttpHeader('Accept', 'application/json');
$I->amBearerAuthenticated($token);

// Requests
$I->sendGet('/api/resource');
$I->sendPost('/api/resource', ['name' => 'Test']);
$I->sendPatch('/api/resource/1', ['name' => 'Updated']);
$I->sendDelete('/api/resource/1');

// Response assertions
$I->seeResponseCodeIs(200);
$I->seeResponseIsJson();
$I->seeResponseContainsJson(['key' => 'value']);

// Grabbing data
$json = $I->grabJsonResponse();
$value = $I->grabDataFromResponseByJsonPath('$.data.id');
```

## Database Assertions

```php
$I->seeRecord(Model::class, ['field' => 'value']);
$I->dontSeeRecord(Model::class, ['field' => 'value']);
$I->seeInDatabase('table', ['column' => 'value']);
$I->seeNumRecords(5, 'table', ['type' => 'test']);
$record = $I->grabRecord(Model::class, ['id' => 1]);
```

## Queue and Job Testing

```php
$I->dontFakeJob(SomeJob::class);       // Let specific job run
$I->seeJobQueued(SomeJob::class);
$I->seeJobQueued(SomeJob::class, function ($job) {
    return $job->property === 'expected';
});
$I->dontSeeJobQueued(SomeJob::class);
$I->runQueuedJob(SomeJob::class, 1);
$I->seeListenerQueued(SomeListener::class);
```

## Lifecycle Hooks

### Cest

```php
public function _before(FunctionalTester $I) {}  // Before each test
public function _after(FunctionalTester $I) {}   // After each test
public function _failed(FunctionalTester $I) {}  // On failure
```

### Unit

```php
protected function _before() { parent::_before(); /* setup */ }
protected function _after()  { /* cleanup */ parent::_after(); }
```

## Attributes

```php
use Codeception\Attribute\Group;
use Codeception\Attribute\Depends;
use Codeception\Attribute\DataProvider;
use Codeception\Attribute\Examples;

#[Group('api')]
#[Depends('testCreateUser')]
#[DataProvider('userProvider')]
#[Examples(['user1', 'pass1'])]
```

## CLI Commands

```bash
php vendor/bin/codecept run --no-ansi                  # All tests
php vendor/bin/codecept run Unit --no-ansi             # Suite
php vendor/bin/codecept run Unit:UserTest --no-ansi    # Specific test
php vendor/bin/codecept run Functional Sites/ --no-ansi # Directory
php vendor/bin/codecept build --no-ansi                 # Regenerate actors
```

## Naming Conventions

- Test methods in Cest format: prefix with `tryTo` (e.g., `tryToCreateResource`)
- Test methods in Unit format: prefix with `test` (e.g., `testCalculatesTotal`)
- Test class names: suffix with `Cest` or `Test` matching the format
- One behavior per test method — keep tests focused
