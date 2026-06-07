## ADDED Requirements

### Requirement: Issue notes queries are indexed for performance
The `issue_notes` table SHALL have a composite database index on `(issue_id, created_at)` to enable efficient lookups when fetching notes for a specific issue sorted by creation time.

#### Scenario: Indexed notes lookup
- **WHEN** the system queries notes for a specific issue ordered by `created_at`
- **THEN** the database SHALL use the composite index to avoid a full table scan

#### Scenario: Index creation is non-destructive
- **WHEN** the migration adding the index is applied
- **THEN** existing data and queries SHALL continue to function without interruption
