## ADDED Requirements

### Requirement: Operational day has an immutable required-action manifest
For each operational day, the system SHALL create a manifest containing every required compartment, kit, and crew-confirmation action for each in-service unit. The manifest SHALL preserve the unit, target identity, target type, and requirement disposition for the day.

#### Scenario: Day initialization snapshots required actions
- **WHEN** an operational day is initialized
- **THEN** the system SHALL create one required action for every snapshot compartment and kit target of each in-service unit
- **AND** the system SHALL create one required crew-confirmation action for each in-service unit

#### Scenario: Day initialization is retried
- **WHEN** day initialization is invoked more than once for the same operational day
- **THEN** the manifest SHALL contain no duplicate actions
- **AND** the existing required-action set SHALL remain unchanged

### Requirement: Completion summary is database maintained
The system SHALL maintain one daily completion summary from that day's manifest and saved completion evidence. The summary SHALL include required actions, completed actions, required units, fully complete units, and summary state.

#### Scenario: Check completion updates the summary
- **WHEN** a required check target is saved as completed
- **THEN** the day's completed action count SHALL include that target
- **AND** the summary SHALL be updated without requiring a Records page request

#### Scenario: Crew confirmation updates the summary
- **WHEN** a required crew entry is locked with nonblank provider names
- **THEN** the day's completed action count SHALL include that crew action
- **AND** the summary SHALL be updated without requiring a Records page request

### Requirement: Mid-day exceptions are explicit and auditable
The system SHALL NOT silently remove a required action because a unit's current service status changes after day initialization. A supervisor SHALL be able to excuse remaining actions with a reason, actor, and timestamp.

#### Scenario: Unit becomes unavailable after day initialization
- **WHEN** a unit is marked out of service after its actions were required in the manifest
- **THEN** its actions SHALL remain required until a supervisor explicitly excuses them

#### Scenario: Supervisor excuses remaining actions
- **WHEN** a supervisor records an excusal reason for a unit's remaining required actions
- **THEN** the affected actions SHALL be marked excused with the actor and timestamp
- **AND** the day's required action count SHALL exclude those excused actions

### Requirement: Historical summary states are transparent
The system SHALL distinguish live, finalized, and reconstructed completion summaries.

#### Scenario: Post-cutover day is finalized
- **WHEN** a post-cutover operational day closes
- **THEN** its completion summary SHALL be marked finalized
- **AND** later unit or target configuration changes SHALL NOT alter its required or completed counts

#### Scenario: Legacy history is backfilled
- **WHEN** pre-cutover raw records are used to create a completion summary
- **THEN** the summary SHALL be marked reconstructed
- **AND** the interface SHALL NOT present it as a finalized manifest-backed result
