## ADDED Requirements

### Requirement: Issues table has performance indexes
The `issues` table SHALL have database indexes on `status`, `created_at`, and `unit_id` columns to enable efficient filtering and sorting of the issues list.

#### Scenario: Status filtering uses index
- **WHEN** the system queries issues filtered by status
- **THEN** the database SHALL use the index on the `status` column to avoid a full table scan

#### Scenario: Date sorting uses index
- **WHEN** the system queries issues ordered by `created_at DESC`
- **THEN** the database SHALL use the index on the `created_at` column for efficient sorting

#### Scenario: Unit filtering uses index
- **WHEN** the system queries issues filtered by `unit_id`
- **THEN** the database SHALL use the index on the `unit_id` column to avoid a full table scan
