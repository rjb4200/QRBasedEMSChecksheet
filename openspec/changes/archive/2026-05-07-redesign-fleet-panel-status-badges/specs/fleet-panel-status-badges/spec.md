## ADDED Requirements

### Requirement: Fleet cards display exactly one primary operational badge
The Fleet Panel SHALL display exactly one primary operational status badge for each unit card.

#### Scenario: Unit is out of service
- **WHEN** a unit status is `out_of_service`
- **THEN** the unit card SHALL display an `Out of Service` primary badge
- **AND** no other primary status badge SHALL be displayed for that card

#### Scenario: Unit is complete
- **WHEN** all required check targets and crew requirements are complete
- **THEN** the unit card SHALL display a completion time badge instead of a generic `Complete` badge
- **AND** no other primary status badge SHALL be displayed for that card

#### Scenario: Unit is in progress
- **WHEN** at least one required check target has started and the unit is not complete
- **THEN** the unit card SHALL display an `In Progress` primary badge
- **AND** the `View Checkoff` action SHALL NOT be styled as the in-progress indicator

#### Scenario: Unit is not started
- **WHEN** no required check target has started and the unit is not complete
- **THEN** the unit card SHALL display a `Not Started` primary badge

### Requirement: Completion badge shows operational completion time
The Fleet Panel SHALL show a compact local-time badge for completed units.

#### Scenario: Completed unit has final completion timestamp
- **WHEN** a unit is complete
- **THEN** the completion badge SHALL display the latest timestamp among required completed components in local department time
- **AND** the badge text SHALL use compact time format such as `08:45`

### Requirement: Fleet cards display secondary badges only when applicable
The Fleet Panel SHALL display secondary operational badges only when the corresponding condition exists.

#### Scenario: Unit has exceptions
- **WHEN** a unit has one or more current-shift exception entries
- **THEN** the unit card SHALL display an exception count badge such as `Exceptions: 2`

#### Scenario: Unit has no exceptions
- **WHEN** a unit has zero current-shift exception entries
- **THEN** the unit card SHALL NOT display an exception badge

#### Scenario: Unit has a saved comment
- **WHEN** a nonblank saved daily unit comment exists for the current shift
- **THEN** the unit card SHALL display a `Comments` badge

#### Scenario: Unit has no saved comment
- **WHEN** no saved daily unit comment exists or the saved comment is blank
- **THEN** the unit card SHALL NOT display a comment badge

#### Scenario: Crew section is missing
- **WHEN** required crew information is not locked or completed
- **THEN** the unit card SHALL display a `Crew Missing` badge

### Requirement: Fleet Panel removes admin management action noise
The Fleet Panel SHALL remove the `Manage Unit` action from unit cards.

#### Scenario: Admin views Fleet Panel
- **WHEN** an admin user views Fleet Panel cards
- **THEN** the cards SHALL still display `View Checkoff`
- **AND** the cards SHALL NOT display `Manage Unit`

### Requirement: Operational badges are compact and accessible
Operational badges SHALL be visually compact, readable, and accessible without relying only on color.

#### Scenario: Badge row renders on mobile
- **WHEN** Fleet Panel cards render on a narrow viewport
- **THEN** badges SHALL wrap without horizontal scrolling

#### Scenario: Badge communicates state to assistive technology
- **WHEN** a badge communicates a status such as completion time, exceptions, or missing crew
- **THEN** the badge SHALL include readable text or an accessible label that describes the state

### Requirement: Fleet status data includes badge fields
The fleet status computation SHALL provide badge-related data without per-unit database queries.

#### Scenario: Fleet status is loaded
- **WHEN** the Fleet Panel loads current-shift fleet status
- **THEN** each unit result SHALL include completion time, exception count, comment presence, and crew completion state fields
- **AND** these fields SHALL be computed from bulk current-shift data queries
