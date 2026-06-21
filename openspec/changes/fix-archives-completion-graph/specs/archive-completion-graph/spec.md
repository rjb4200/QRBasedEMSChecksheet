## ADDED Requirements

### Requirement: Archives completion graph uses Records completion grouping
The Archives completion graph SHALL use the same grouped Daily Readiness Records data and completion rule as the Records detail view.

#### Scenario: Near-complete unit counts in graph when above threshold
- **WHEN** a date has six in-service units, five units at 100% completion, and one unit with `completionPercentage > 95`
- **THEN** the Archives completion graph group for that date SHALL report `completedInServiceUnits` as `6`
- **AND** the graph group SHALL report `totalInServiceUnits` as `6`

#### Scenario: Graph avoids duplicate completion calculations
- **WHEN** the Archives page renders the completion trend chart
- **THEN** it SHALL use the grouped output from the Daily Readiness Records read model
- **AND** it SHALL NOT use a separate graph-only completion threshold or helper that can drift from Records detail grouping
