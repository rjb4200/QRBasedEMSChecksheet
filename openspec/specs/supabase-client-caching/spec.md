## ADDED Requirements

### Requirement: Admin Supabase client is cached per request
The admin Supabase client factory SHALL use `React.cache()` to deduplicate client instantiation within a single render pass, preventing redundant client creation when called from multiple components or functions during the same request.

#### Scenario: Multiple callers share the same client
- **WHEN** the admin client is created in middleware, layout, page, and server actions within a single request
- **THEN** all callers SHALL receive the same cached client instance

#### Scenario: Cache is per-request
- **WHEN** a new request arrives
- **THEN** a fresh client SHALL be created for that request
- **AND** the previous request's client SHALL NOT be reused

### Requirement: Frequently-read reference data is cached per request
Server components that fetch static reference data (such as the units list for dropdowns) SHALL cache the result using `React.cache()` to avoid redundant database queries within the same render pass.

#### Scenario: Units list cached per request
- **WHEN** multiple components or nested layouts need the units list within the same request
- **THEN** the database SHALL be queried only once for the units list
- **AND** subsequent calls SHALL return the cached result
