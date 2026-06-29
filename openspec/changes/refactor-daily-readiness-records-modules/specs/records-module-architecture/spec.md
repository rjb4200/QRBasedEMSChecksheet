## ADDED Requirements

### Requirement: Records module facade remains stable
The Daily Readiness records module SHALL preserve the existing public `@/lib/archive-records` exports used by Records pages, export routes, PDF generation, chart components, and tests while the implementation is split into focused records modules.

#### Scenario: Existing consumers import records APIs
- **WHEN** existing application code imports public Daily Readiness record functions or types from `@/lib/archive-records`
- **THEN** those imports SHALL continue to resolve without requiring consumer rewrites as part of the refactor

### Requirement: Pure record calculations are isolated from database access
Daily Readiness record construction and grouping logic SHALL be importable and testable without creating a Supabase client or executing database queries.

#### Scenario: Pure builder tests run
- **WHEN** tests import Daily Readiness record builder or grouping functions
- **THEN** the tests SHALL be able to execute those functions using in-memory fixture rows without database access

### Requirement: Query code is separated from output formatting
Daily Readiness Supabase query orchestration SHALL be kept separate from CSV/export formatting and grouping/chart helper code.

#### Scenario: CSV export uses built records
- **WHEN** records are converted to CSV
- **THEN** CSV formatting SHALL operate on `DailyUnitRecord` values rather than directly constructing Supabase queries

### Requirement: Refactor preserves records behavior
The records modularization SHALL preserve existing Daily Readiness record behavior for ledger-backed records, fallback records, grouped completion summaries, CSV output fields, restocking lists, print/PDF consumers, and archive metadata unless a specific bug fix is explicitly scoped and tested.

#### Scenario: Existing records tests pass after extraction
- **WHEN** the records modules are split from `archive-records.ts`
- **THEN** existing Daily Readiness records tests SHALL continue to pass without changing their expected business behavior

### Requirement: Trend chart investigation is isolated
The refactor SHALL allow the `Last 14 Days Check Completion` chart path to be investigated independently from records page card rendering and CSV/export behavior.

#### Scenario: Trend bug is not safely isolated
- **WHEN** the broken trend chart root cause is not isolated during the refactor
- **THEN** the refactor SHALL preserve existing chart behavior and leave the chart fix as follow-up work

#### Scenario: Trend bug is safely isolated
- **WHEN** the broken trend chart root cause is isolated to records trend helper code and can be fixed without broad business-rule changes
- **THEN** the fix SHALL be covered by focused tests and SHALL NOT change unrelated Records page, CSV/export, restocking, or print/PDF behavior
