## MODIFIED Requirements

### Requirement: Trend chart reads existing data without new queries
The trend chart SHALL use a dedicated lightweight data function that directly computes daily completion aggregates from the database, rather than sharing the heavyweight `getDailyUnitRecords` function used by the records list.

#### Scenario: Chart fetches its own data
- **WHEN** the Records page loads
- **THEN** the trend chart SHALL call a focused data function that queries only `daily_unit_ledgers`, `compartment_checks`, and `daily_unit_crews` for the 14-day range
- **AND** the records list SHALL continue using `getDailyUnitRecords` independently

#### Scenario: Chart data matches the strict completion rule
- **WHEN** the chart data is computed
- **THEN** completed units SHALL be those where `(completed_compartments + crew_locked_bonus) / (total_compartments + 1) * 100 > 95`
- **AND** the chart SHALL not show 0 completed units when completed checks exist in the database
