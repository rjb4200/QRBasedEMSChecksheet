# Shift Completion Averages Specification

## Purpose

Define fleet-wide completion averages grouped by operational shift.

## Requirements

### Requirement: Records page displays rotating shift completion averages
The Records page SHALL display a `30 Day Average` chart for 1st Shift, 2nd Shift, and 3rd Shift using the latest thirty operational dates. Each shift result SHALL equal the sum of completed actions divided by the sum of required actions for dates assigned to that shift, excluding dates with no required actions. The chart SHALL NOT display a separate operational-days subtitle. For each shift, the chart SHALL overlay the percentage on its vertical completion bar, use a `h-48` visual area, and use a rounded treatment visually consistent with the containing card. The chart SHALL display a crown beside every available shift whose percentage equals the highest available percentage in the chart. The chart SHALL display no crown when all shifts are unavailable.

#### Scenario: Shift has completed work over assigned dates
- **WHEN** 1st Shift's assigned dates in the thirty-day window total 720 completed actions out of 900 required actions
- **THEN** the 30 Day Average chart SHALL display 1st Shift at `80%` on its completion bar

#### Scenario: Multiple shifts tie for the highest percentage
- **WHEN** 1st Shift and 3rd Shift both have the highest available percentage in the thirty-day window
- **THEN** the chart SHALL display a crown beside both 1st Shift and 3rd Shift

#### Scenario: Shift has no required work
- **WHEN** a shift has no assigned dates with required actions in the thirty-day window
- **THEN** the 30 Day Average chart SHALL display that shift as unavailable
- **AND** the chart SHALL NOT represent the shift as 0% completion
- **AND** the chart SHALL NOT display a crown beside that shift

#### Scenario: All shifts are unavailable
- **WHEN** no shift has assigned dates with required actions in the thirty-day window
- **THEN** the chart SHALL NOT display a crown

### Requirement: Shift assignments honor the operational calendar
The chart SHALL use a date's `shift_calendar.shift_name` when present and SHALL use the configured rotating shift assignment only when the calendar has no matching date.

#### Scenario: Calendar overrides the configured rotation
- **WHEN** an operational date has a shift-calendar assignment that differs from the configured rotation
- **THEN** that date's actions SHALL contribute to the calendar-assigned shift's average
