# Daily Check Work Completion Trend Specification

## Purpose

Define the fleet-wide historical measure of required Daily Readiness work completed by crews.

## Requirements

### Requirement: Records page displays a 14-day Daily Check Work Completion trend
The Records page SHALL display a fleet-wide `Daily Check Work Completion` trend for the latest 14 operational dates after the page header. The trend SHALL be independent of the Records page unit filter.

#### Scenario: Admin views the Records page
- **WHEN** an admin views the Records page
- **THEN** the page SHALL display one daily result for each of the latest 14 operational dates
- **AND** the displayed trend SHALL remain fleet-wide when an admin selects a unit filter

### Requirement: Trend measures completed required work
For each date with daily ledger coverage, the trend SHALL calculate required work as the sum of each in-service ledger row's saved target count plus one required crew entry. The trend SHALL calculate completed work as completed unique check targets plus locked crew entries with nonblank provider names for those same in-service units.

#### Scenario: Day has partially completed required work
- **WHEN** in-service ledger rows require 58 actions and crews complete 51 of those actions
- **THEN** the daily result SHALL show 51 completed of 58 required actions
- **AND** the daily completion percentage SHALL be 88%

#### Scenario: Crew lock contributes completed work
- **WHEN** an in-service unit has a locked crew entry with nonblank provider names
- **THEN** the trend SHALL count that crew entry as one completed action for that unit

### Requirement: Trend excludes work not required for the date
The trend SHALL exclude a unit from both required and completed work when its daily ledger row for that date is not marked `in_service`.

#### Scenario: Unit was out of service for the date
- **WHEN** a unit's daily ledger row is marked out of service
- **THEN** its saved target count and its completed check or crew rows SHALL NOT contribute to that day's result

### Requirement: Trend distinguishes unavailable, zero, and not-applicable days
The trend SHALL distinguish unavailable ledger coverage from documented zero completion and from a day with no required work.

#### Scenario: Ledger coverage is unavailable
- **WHEN** a date has no daily ledger rows
- **THEN** the trend SHALL label that date as unavailable
- **AND** the trend SHALL NOT represent the date as 0% completion

#### Scenario: Required work was not completed
- **WHEN** a date has in-service ledger rows but no completed required actions
- **THEN** the trend SHALL display 0 completed of the required action count and 0% completion

#### Scenario: No work was required
- **WHEN** a date has daily ledger coverage but no in-service units
- **THEN** the trend SHALL label that date as not applicable
- **AND** the trend SHALL NOT calculate a completion percentage

### Requirement: Trend presents completion as action counts and percentage
The trend SHALL visibly present each available daily result as completed required actions over total required actions and a completion percentage. The presentation SHALL be server-rendered and usable on narrow screens without a client-side charting dependency.

#### Scenario: Administrator reviews a daily result
- **WHEN** a date has required work
- **THEN** its trend result SHALL display the completion percentage and `completed/required` action count
- **AND** the result SHALL not be labeled as completed units or in-service units
