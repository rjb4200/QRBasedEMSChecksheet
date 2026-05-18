## ADDED Requirements

### Requirement: Previous exceptions load asynchronously after dashboard render
The unit dashboard SHALL automatically check for previous-shift exceptions in the background after the main dashboard becomes usable, without blocking the initial page render.

#### Scenario: Dashboard loads and panel appears
- **WHEN** a user opens a unit dashboard
- **THEN** the dashboard SHALL render primary status cards, Restocking List, and crew lock immediately
- **AND** a Previous Exceptions panel SHALL appear showing "Checking previous exceptions..."

#### Scenario: Previous exceptions are found
- **WHEN** the background fetch completes and the previous shift had exceptions
- **THEN** the panel SHALL display the exception count
- **AND** the panel SHALL list the item names and their source compartments or kits

#### Scenario: No previous exceptions exist
- **WHEN** the background fetch completes and the previous shift had no exceptions or no archive exists
- **THEN** the panel SHALL display "No previous exceptions found"

#### Scenario: Archive unavailable falls back to par levels
- **WHEN** no prior shift archive exists for the unit
- **THEN** the API route SHALL compute potential exceptions from the unit's equipment items and their configured par levels
- **AND** any quantity item with par_level greater than zero or any checkbox item SHALL be flagged as a potential exception

#### Scenario: Background fetch fails
- **WHEN** the background fetch fails due to a network or server error
- **THEN** the panel SHALL render nothing
- **AND** the dashboard SHALL remain fully usable with no error state shown

#### Scenario: Dashboard is usable during fetch
- **WHEN** the previous exceptions fetch is in progress
- **THEN** the user SHALL be able to navigate to compartments, start checkoffs, and interact with the Restocking List
- **AND** the page SHALL NOT reload, flicker, or reset state when the fetch completes

### Requirement: Previous exceptions fetch uses a dedicated API route
The system SHALL provide a dedicated API route for fetching previous-shift exceptions without coupling to the initial dashboard page load.

#### Scenario: API route returns exceptions
- **WHEN** `GET /api/units/[id]/previous-exceptions` is called for a unit with a prior-shift archive that has exceptions
- **THEN** the response SHALL include the exception count and a list of item names grouped by source

#### Scenario: API route returns empty
- **WHEN** `GET /api/units/[id]/previous-exceptions` is called for a unit with no prior-shift archive or no exceptions
- **THEN** the response SHALL return an empty result with zero exceptions

### Requirement: Previous exceptions panel updates independently
The previous exceptions panel SHALL update only its own content and SHALL NOT trigger a full page reload, layout shift, or dashboard state reset.

#### Scenario: Panel completes after user interaction
- **WHEN** the previous exceptions fetch completes while a user has expanded the Restocking List
- **THEN** the Restocking List SHALL remain expanded
- **AND** no other section SHALL collapse or reset
