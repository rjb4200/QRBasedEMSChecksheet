## ADDED Requirements

### Requirement: Database guide documents schema and data lifecycle
The project SHALL include a `DATABASEGUIDE.md` file documenting every database table, its purpose, key columns, foreign key relationships, stored data, and the data lifecycle from daily checkoff through archival rotation.

#### Scenario: Guide covers all operational tables
- **WHEN** a developer or administrator reads DATABASEGUIDE.md
- **THEN** the guide SHALL describe each operational table and its role in the checkoff workflow

#### Scenario: Guide documents optimization strategies
- **WHEN** reading the guide
- **THEN** the guide SHALL document stored procedures, RLS policies, retention rules, and query optimization patterns
