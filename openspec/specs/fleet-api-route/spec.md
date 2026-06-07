## Purpose
The fleet status API provides a lightweight, read-only endpoint for the client-side FleetMatrix component to poll for current unit checkoff status without triggering a full page re-render.

## Requirements

### Requirement: Fleet status API returns aggregated unit data
The system SHALL provide a `GET /api/fleet-status` endpoint that returns aggregated fleet checkoff data as JSON for the current shift.

#### Scenario: Successful fleet status request
- **WHEN** an authenticated admin or supervisor requests `GET /api/fleet-status`
- **THEN** the response SHALL return a JSON array of `FleetUnit` objects with `id`, `name`, `unit_kind`, `status`, `total`, `completed`, `inProgress`, `percentage`, `completedAt`, `exceptionCount`, `hasComments`, `crewComplete`, `oosAt`, `oosByName`, `statusNote`, and `archived` fields
- **AND** the response status SHALL be 200

#### Scenario: Unauthenticated request is rejected
- **WHEN** an unauthenticated client requests `GET /api/fleet-status`
- **THEN** the response status SHALL be 401

#### Scenario: Fleet status data matches current shift
- **WHEN** the fleet status API is called
- **THEN** all check and crew data returned SHALL be scoped to the current shift date and period as determined by `getCurrentShift()`
- **AND** the response SHALL NOT contain data from previous or future shifts

### Requirement: Fleet status API does not mutate database state
The fleet status API SHALL be a read-only operation that does not write to any database table.

#### Scenario: Fleet status request produces no side effects
- **WHEN** `GET /api/fleet-status` is called
- **THEN** no rows in `daily_unit_ledgers` SHALL be inserted, updated, or deleted
- **AND** no rows in any other table SHALL be modified

### Requirement: Fleet status API uses optimized in-memory aggregation
The fleet status API SHALL aggregate check data using a single-pass Map grouping instead of repeated per-unit filtering.

#### Scenario: Aggregation completes in a single pass
- **WHEN** the fleet status API processes check rows
- **THEN** each check row SHALL be visited exactly once during grouping
- **AND** exception counts SHALL be computed during the same pass
