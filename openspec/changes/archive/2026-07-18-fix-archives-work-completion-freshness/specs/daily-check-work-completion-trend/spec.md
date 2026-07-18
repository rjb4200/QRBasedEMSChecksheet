## MODIFIED Requirements

### Requirement: Trend measures completed required work
For each date with daily ledger coverage, the trend SHALL calculate required work as the sum of each in-service ledger row's saved target count plus one required crew entry. The trend SHALL calculate completed work as completed unique check targets plus locked crew entries with nonblank provider names for those same in-service units. The trend SHALL use fresh request-time ledger, check, and crew data and SHALL NOT display a cached early-day aggregate.

#### Scenario: Day has partially completed required work
- **WHEN** in-service ledger rows require 58 actions and crews complete 51 of those actions
- **THEN** the daily result SHALL show 51 completed of 58 required actions
- **AND** the daily completion percentage SHALL be 88%

#### Scenario: Crew lock contributes completed work
- **WHEN** an in-service unit has a locked crew entry with nonblank provider names
- **THEN** the trend SHALL count that crew entry as one completed action for that unit

#### Scenario: Completed checks are added after an earlier page visit
- **WHEN** completed check targets or locked crew entries are saved after an admin has previously viewed the Records page
- **THEN** a subsequent Records page request SHALL include those completed actions in the trend
- **AND** the trend SHALL NOT retain the earlier action count
