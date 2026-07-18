## MODIFIED Requirements

### Requirement: Trend presents completion as a vertical percentage chart
The trend SHALL visibly present each available daily result as a fixed-height vertical bar whose green completed portion represents the completion percentage and whose neutral remainder represents incomplete required work. The trend SHALL display the date and completion percentage for each day, SHALL NOT display per-day completed/required action counts, completed-unit counts, or the `live` state text, and SHALL remain server-rendered and usable on narrow screens without a client-side charting dependency.

#### Scenario: Administrator reviews a daily result
- **WHEN** a date has required work and 58% completion
- **THEN** its result SHALL display a green completed bar representing 58% of the fixed chart height
- **AND** the result SHALL display the date and `58%`
- **AND** the result SHALL NOT display action-count, unit-count, or `live` text

#### Scenario: Completion is zero
- **WHEN** a date has required work and no completed actions
- **THEN** its result SHALL display no green completed portion
- **AND** the result SHALL display `0%`

#### Scenario: Ledger coverage is unavailable
- **WHEN** a date has no completion summary
- **THEN** its result SHALL use an unavailable visual state
- **AND** the result SHALL NOT represent the date as 0% completion
