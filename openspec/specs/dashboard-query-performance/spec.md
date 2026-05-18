## Purpose
Define composite database indexes for unit dashboard and restocking list queries to ensure consistent query performance as operational data accumulates.

## Requirements

### Requirement: Unit dashboard tables have composite shift-scoped indexes
The system SHALL maintain composite B-tree indexes on `(unit_id, shift_date, shift_period)` for the `daily_unit_crews`, `daily_unit_comments`, `daily_section_comments`, `daily_restock_items`, and `daily_manual_restock_items` tables.

#### Scenario: Dashboard queries use indexes
- **WHEN** the unit dashboard or restocking polling queries filter by `unit_id`, `shift_date`, and `shift_period`
- **THEN** each query SHALL use the corresponding composite index
- **AND** query plans SHALL avoid sequential scans on these tables for shift-scoped lookups

#### Scenario: Indexes are idempotent
- **WHEN** the migration that creates these indexes is applied more than once
- **THEN** the system SHALL NOT produce duplicate-index errors
- **AND** existing indexes SHALL remain unchanged

### Requirement: Index creation does not alter existing query results
The addition of composite indexes SHALL NOT change the results, ordering, or behavior of any existing application query.

#### Scenario: Dashboard renders identically
- **WHEN** the indexes are applied
- **THEN** the unit dashboard page SHALL render the same data in the same order
- **AND** the restocking list, crew lock, comments, and section comments SHALL appear unchanged

#### Scenario: Polling continues unchanged
- **WHEN** the restocking list polling runs after index creation
- **THEN** addressed state updates SHALL propagate at the same interval
- **AND** no polling errors SHALL be introduced
