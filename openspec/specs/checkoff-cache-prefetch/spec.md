## Purpose
Define background prefetch and device caching of checkoff form setup data so the unit dashboard loads lighter and QR/NFC checkoff pages open faster.

## Requirements

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
The unit dashboard SHALL prefetch full checkoff form setup data for current-unit/current-shift incomplete, in-progress, not-started, or exception-prone compartments and kits in the background after the main dashboard becomes usable.

#### Scenario: Prefetch runs after dashboard renders
- **WHEN** the unit dashboard has finished its initial render
- **THEN** the system SHALL begin fetching checkoff form setup data in batches of 2 concurrent requests
- **AND** the prefetch SHALL NOT block or visibly slow the dashboard
- **AND** targets with fresh cache entries SHALL be skipped

#### Scenario: Prefetch prioritizes likely next targets
- **WHEN** the unit dashboard identifies current-shift target status
- **THEN** setup prefetch SHALL prioritize not-started, in-progress, incomplete, and exception/failing targets before completed targets
- **AND** completed targets SHALL NOT be prefetched before incomplete current-unit targets

#### Scenario: Prefetch is scoped to current unit and shift
- **WHEN** setup prefetch runs from a unit dashboard
- **THEN** it SHALL fetch only targets for that unit and current shift
- **AND** it SHALL NOT prefetch other units or the fleet

#### Scenario: Prefetch cancels on navigation
- **WHEN** the user navigates away from the dashboard during prefetch
- **THEN** pending prefetch requests SHALL be cancelled

#### Scenario: Prefetch pauses while hidden
- **WHEN** the browser tab becomes hidden during setup prefetch
- **THEN** new background prefetch requests SHALL pause until the tab is visible again or the page unloads

### Requirement: Checkoff form setup is cached in localStorage
The system SHALL store prefetched checkoff form setup data in localStorage under scoped keys with a 10-minute TTL.

#### Scenario: Cache entry structure
- **WHEN** a checkoff form setup is cached
- **THEN** the cache key SHALL follow the format `qrCheckoff.formSetup:{unitId}:{targetType}:{targetId}`
- **AND** the cached value SHALL include `cachedAt`, `expiresAt`, and `data`
- **AND** the cache SHALL include only form setup data: target metadata, item names, par levels, input types, grouping, and sort order

#### Scenario: Cache excludes official state
- **WHEN** checkoff form setup data is cached
- **THEN** the cache SHALL NOT include submitted check results, completion status, exceptions, restock list, restock addressed state, crew signatures, comments, unit service status, or other live operational state

### Requirement: Checkoff pages cache form setup for subsequent opens
When a checkoff form renders, the system SHALL store its setup data in the device cache so subsequent opens of the same current-unit target benefit from prefetched data while live server data still applies.

#### Scenario: Cache miss on checkoff open
- **WHEN** a user opens a checkoff page and no valid cache exists
- **THEN** the form SHALL load normally from the server
- **AND** the loaded setup data SHALL be cached for subsequent opens

#### Scenario: Form caches its own setup data
- **WHEN** a checkoff form renders with its items and groups
- **THEN** the setup data (item names, par levels, input types, grouping, sort order) SHALL be written to the device cache
- **AND** no submitted check values SHALL be included in the cached data

#### Scenario: Cached setup never overrides live values
- **WHEN** a checkoff page opens with valid setup cache
- **THEN** cached setup MAY be used to render the form shell quickly
- **AND** submitted values, in-progress/completed status, exceptions, restock state, comments, and service status SHALL be fetched from the server and override cached display

### Requirement: Checkoff pages prefetch current-unit summary
Compartment and kit checkoff pages SHALL prefetch a fresh lightweight unit summary for the same unit/date/shift after the page opens and after a successful submit.

#### Scenario: Prefetch unit summary after checkoff page opens
- **WHEN** a user opens a compartment or kit checkoff page
- **THEN** the system SHALL load the checkoff page normally
- **AND** it SHALL fetch a fresh unit summary for the same unit/date/shift in the background
- **AND** the background fetch SHALL NOT block the checkoff page rendering

#### Scenario: Prefetch unit summary after submit
- **WHEN** a user successfully submits a compartment or kit checkoff
- **THEN** the system SHALL fetch a fresh unit summary for the same unit/date/shift in the background
- **AND** normal submit behavior SHALL remain unchanged

#### Scenario: Unit summary prefetch fails
- **WHEN** the unit summary prefetch request fails
- **THEN** the active checkoff page SHALL continue normally without user-facing error

### Requirement: Unit summary cache is short-lived and shift-scoped
The system SHALL cache prefetched unit summaries in localStorage under a current-unit/current-shift key with a default 60 second TTL.

#### Scenario: Unit summary cache key
- **WHEN** a unit summary is cached
- **THEN** the cache key SHALL follow the format `qrCheckoff.unitSummary:{unitId}:{shiftDate}:{shiftPeriod}`
- **AND** the cached value SHALL include `cachedAt`, `expiresAt`, and `data`

#### Scenario: Unit summary cache expires
- **WHEN** a cached unit summary is older than its TTL
- **THEN** the system SHALL ignore or remove that cached summary

#### Scenario: Unit summary cache is same-unit only
- **WHEN** a user works on EC1
- **THEN** the system SHALL NOT read or write EC2 unit summary cache entries for EC1 navigation

### Requirement: Unit page may render cached summary before live refresh
The unit page SHALL be allowed to show a valid cached summary for the matching unit/date/shift immediately, then refresh from the server and replace cached values with server values.

#### Scenario: Matching cached summary exists
- **WHEN** a user opens a unit page and a valid cached summary exists for the same unit/date/shift
- **THEN** the page MAY show cached summary information immediately
- **AND** the page SHALL refresh from the server and replace cached display with server data

#### Scenario: No matching cached summary exists
- **WHEN** a user opens a unit page without a valid matching cached summary
- **THEN** the unit page SHALL load normally from the server

#### Scenario: Server truth overrides cache
- **WHEN** live server data differs from cached summary data
- **THEN** the server data SHALL be shown as the official state

### Requirement: Live operational state remains server truth
The system SHALL NOT treat cached data as official truth for live operational state.

#### Scenario: Live state loads from server
- **WHEN** a unit or checkoff page loads
- **THEN** submitted values, completion/in-progress state, exceptions, restock list, restock addressed state, crew names/signatures, comments, and unit in-service/OOS status SHALL load from the server

#### Scenario: Cached setup exists with stale status
- **WHEN** cached setup or summary data conflicts with server status
- **THEN** server status SHALL override cached data

### Requirement: Background prefetch follows QR/NFC guardrails
Background prefetch SHALL be invisible, scoped, cancelable, and non-blocking for QR/NFC workflows.

#### Scenario: Prefetch starts after current page is usable
- **WHEN** a unit or checkoff page initially renders
- **THEN** background prefetch SHALL start only after the current page is usable

#### Scenario: Prefetch does not show large loading indicators
- **WHEN** background prefetch is running
- **THEN** the system SHALL NOT show large loading indicators or block navigation

#### Scenario: Prefetch stops on navigation
- **WHEN** the user navigates away during prefetch
- **THEN** pending background requests SHALL be aborted where possible
