## Requirements

### Requirement: Fleet status results cached per shift with TTL
The `getFleetStatus` function SHALL maintain a module-level cache that stores the computed fleet data keyed by the current shift, returning cached results for subsequent calls within the same shift and TTL window.

#### Scenario: Cache hit within same shift
- **WHEN** `getFleetStatus` is called and the shift key matches the cached entry's shift key
- **AND** the cached entry's TTL has not expired
- **THEN** the system SHALL return the cached `FleetUnit[]` array
- **AND** the system SHALL NOT execute any database queries

#### Scenario: Cache miss on different shift
- **WHEN** `getFleetStatus` is called and the shift key differs from the cached entry's shift key
- **THEN** the system SHALL execute the full aggregation pipeline
- **AND** the system SHALL cache the new result with the new shift key

#### Scenario: Cache miss on expired TTL
- **WHEN** `getFleetStatus` is called and the cached entry's TTL has expired
- **THEN** the system SHALL execute the full aggregation pipeline
- **AND** the system SHALL replace the cache entry with fresh data and a new TTL

#### Scenario: No cached entry exists
- **WHEN** `getFleetStatus` is called and no cache entry is present
- **THEN** the system SHALL execute the full aggregation pipeline
- **AND** the system SHALL populate the cache with the result

### Requirement: Cache TTL is 60 seconds
The module-level cache SHALL have a TTL of 60 seconds from the time the cache entry was created.

#### Scenario: Cache valid within 60 seconds
- **WHEN** a cache entry was created at time T
- **THEN** calls to `getFleetStatus` before T + 60 seconds SHALL use the cached data if the shift key matches

#### Scenario: Cache expired after 60 seconds
- **WHEN** a cache entry was created at time T
- **THEN** calls to `getFleetStatus` after T + 60 seconds SHALL trigger a fresh aggregation even if the shift key matches

### Requirement: Cache key includes shift date and period
The cache key SHALL be composed of the current shift's `shiftDate` and `shiftPeriod` so that the cache naturally invalidates when the operational date changes.

#### Scenario: Shift boundary invalidates cache
- **WHEN** the operational date changes (e.g., from 2026-06-07 to 2026-06-08 at 6 AM Eastern)
- **THEN** the next call to `getFleetStatus` SHALL produce a different shift key
- **AND** the previous shift's cached data SHALL NOT be returned for the new shift

### Requirement: Cache does not affect result correctness
The presence of the cache SHALL NOT change the shape or content of the returned `FleetUnit[]` data. A cache hit SHALL return identical data to what a fresh aggregation would produce at the time the cache was populated.

#### Scenario: Cached result matches fresh result
- **WHEN** a cache hit occurs
- **THEN** the returned `FleetUnit[]` array SHALL be structurally identical to the array that was cached
- **AND** the FleetMatrix component SHALL render identically whether data came from cache or from a fresh aggregation
