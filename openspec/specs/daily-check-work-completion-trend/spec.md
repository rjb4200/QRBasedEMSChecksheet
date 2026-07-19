# Daily Check Work Completion Trend Specification

## Purpose

Define the fleet-wide historical measure of required Daily Readiness work completed by crews.

## Requirements

### Requirement: Records page displays a 9-day Daily Check Work Completion trend
The Records page SHALL display a fleet-wide `Daily Check Work Completion` trend for the latest nine operational dates after the page header. The trend SHALL be independent of the Records page unit filter and SHALL appear beside the Shift Average chart on extra-large screens and above it on narrower screens.

#### Scenario: Admin views the Records page on an extra-large screen
- **WHEN** an admin views the Records page on an extra-large screen
- **THEN** the page SHALL display one daily result for each of the latest nine operational dates beside the Shift Average chart
- **AND** the displayed trend SHALL remain fleet-wide when an admin selects a unit filter

#### Scenario: Admin views the Records page on a narrow screen
- **WHEN** an admin views the Records page below the extra-large breakpoint
- **THEN** the Daily Check Work Completion trend SHALL appear above the Shift Average chart
- **AND** both charts SHALL remain usable without compressed labels or bars

### Requirement: Trend measures completed required work
The trend SHALL read required actions, completed actions, required units, fully complete units, and summary state from the authoritative daily completion summary. The trend SHALL NOT reconstruct completion by aggregating operational ledger, check, and crew tables during page rendering.

#### Scenario: Finalized day is displayed
- **WHEN** an administrator views a finalized operational day
- **THEN** the trend SHALL display its authoritative completed/required action count and percentage
- **AND** the trend SHALL display its fully complete/required unit count

#### Scenario: Reconstructed legacy day is displayed
- **WHEN** an administrator views a reconstructed pre-cutover day
- **THEN** the trend SHALL display the reconstructed action count
- **AND** the trend SHALL identify the result as reconstructed

#### Scenario: Live day changes
- **WHEN** a check or crew confirmation is saved for the live operational day
- **THEN** a subsequent Records page request SHALL display the database-maintained updated summary

### Requirement: Trend excludes work not required for the date
The trend SHALL use the authoritative summary's required and completed action counts, which exclude actions that were not required for the date.

#### Scenario: Unit was out of service for the date
- **WHEN** a unit was out of service when the operational day's required-action manifest was created
- **THEN** its actions SHALL NOT contribute to that day's authoritative summary

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
