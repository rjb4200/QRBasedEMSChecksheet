## ADDED Requirements

### Requirement: Dashboard loads without nested equipment catalog names
The unit dashboard initial query SHALL NOT include `equipment_catalog(name)` in nested `unit_compartment_items` or `kit_items` selects. Equipment catalog names SHALL be loaded via a separate flat query.

#### Scenario: Dashboard query structure
- **WHEN** the unit dashboard page loads
- **THEN** the units query SHALL select compartment and kit item IDs, par levels, and input types without equipment_catalog FK joins
- **AND** equipment catalog names SHALL be fetched in a separate query by collecting all equipment_id values from the items

#### Scenario: Restocking list still resolves item names
- **WHEN** the restocking list is computed after dashboard load
- **THEN** item names SHALL resolve from the separate equipment catalog name query
- **AND** the restocking list SHALL display the same item names as before

### Requirement: Checkoff form setup is prefetched after dashboard render
The unit dashboard SHALL prefetch full checkoff form setup data for each compartment and kit in the background after the main dashboard becomes usable.

#### Scenario: Prefetch runs after dashboard renders
- **WHEN** the unit dashboard has finished its initial render
- **THEN** the system SHALL begin fetching checkoff form setup data in batches of 2 concurrent requests
- **AND** the prefetch SHALL NOT block or visibly slow the dashboard
- **AND** targets with fresh cache entries SHALL be skipped

#### Scenario: Prefetch cancels on navigation
- **WHEN** the user navigates away from the dashboard during prefetch
- **THEN** pending prefetch requests SHALL be cancelled

### Requirement: Checkoff form setup is cached in localStorage
The system SHALL store prefetched checkoff form setup data in localStorage under scoped keys with a 10-minute TTL.

#### Scenario: Cache entry structure
- **WHEN** a checkoff form setup is cached
- **THEN** the cache key SHALL follow the format `qrCheckoff.formSetup:{unitId}:{targetType}:{targetId}`
- **AND** the cached value SHALL include `cachedAt`, `expiresAt`, and `data`
- **AND** the cache SHALL include only form setup data: item names, par levels, input types, grouping, and sort order

#### Scenario: Cache excludes official state
- **WHEN** checkoff form setup data is cached
- **THEN** the cache SHALL NOT include submitted check results, completion status, crew signatures, or restocking addressed state

### Requirement: Checkoff pages render from cache when available
When a compartment or kit checkoff page is opened, the system SHALL check for a valid cached form setup. If valid, the form SHALL render from cache immediately while refreshing from the server in the background.

#### Scenario: Cache hit on checkoff open
- **WHEN** a user opens a checkoff page by QR code or NFC tap
- **AND** a valid cached form setup exists for that target
- **THEN** the form SHALL render immediately using the cached data
- **AND** a server fetch SHALL run in the background to refresh the data

#### Scenario: Cache miss on checkoff open
- **WHEN** a user opens a checkoff page and no valid cache exists
- **THEN** the form SHALL load normally from the server
- **AND** the loaded setup data SHALL be cached for subsequent opens

#### Scenario: Background refresh patches stale data
- **WHEN** the background server fetch returns data that differs from the cached form setup
- **THEN** the form SHALL update in-place to reflect the server data
- **AND** no page reload or form reset SHALL occur
