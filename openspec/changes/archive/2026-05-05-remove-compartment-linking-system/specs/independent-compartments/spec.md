## ADDED Requirements

### Requirement: Compartments are independent
The system SHALL treat every unit compartment as an independent configuration and checkoff target.

#### Scenario: Configure one compartment
- **WHEN** an admin adds, removes, imports, or edits items for a compartment
- **THEN** the change SHALL apply only to that selected compartment

#### Scenario: No link management controls
- **WHEN** an admin opens unit or compartment management screens
- **THEN** the system SHALL NOT display controls, fields, labels, warnings, badges, or helper text for linked compartments

#### Scenario: Import compartment configuration
- **WHEN** an admin imports or copies a compartment configuration
- **THEN** the imported compartment SHALL be independent
- **AND** the system SHALL NOT preserve or create a compartment link

### Requirement: Checkoff submissions affect only the selected compartment
The system SHALL save crew checkoff results only for the unit compartment being checked.

#### Scenario: Submit compartment checkoff
- **WHEN** a crew member submits a checkoff for a scanned compartment
- **THEN** the system SHALL update only that compartment's check record for the active shift
- **AND** the system SHALL NOT create, update, complete, or infer records for any other compartment

#### Scenario: Load compartment checkoff form
- **WHEN** a crew member opens a QR-linked compartment checkoff page
- **THEN** the form SHALL load items configured directly on that compartment
- **AND** the form SHALL NOT merge or substitute items from any linked compartment or shared link group

### Requirement: Completion status is direct per compartment
The system SHALL calculate completion status from direct checkoff records for each compartment.

#### Scenario: One compartment completed
- **WHEN** one compartment has a completed checkoff record for the active shift
- **THEN** only that compartment SHALL count as completed
- **AND** no other compartment SHALL be considered complete because of that record

#### Scenario: Fleet readiness calculation
- **WHEN** the fleet dashboard calculates unit completion progress
- **THEN** each unit's completion SHALL be based only on that unit's own compartment records

### Requirement: QR codes map to single compartments
The system SHALL maintain one QR destination per unit compartment.

#### Scenario: Scan compartment QR code
- **WHEN** a user scans a QR code for a compartment
- **THEN** the system SHALL open that exact unit compartment's checkoff route
- **AND** the route SHALL NOT redirect, group, or annotate the compartment based on linking state

#### Scenario: Print QR codes
- **WHEN** an admin prints QR codes for a unit
- **THEN** each printed QR code SHALL represent one compartment
- **AND** the printout SHALL NOT group, hide, or label compartments based on linking state

### Requirement: Legacy linking data is ignored or removed
The system SHALL stop relying on legacy linked-compartment fields, tables, indexes, constraints, and helper logic.

#### Scenario: Runtime application behavior
- **WHEN** the application manages units, compartments, checkoffs, QR codes, or fleet status
- **THEN** it SHALL NOT read from or write to linked-compartment fields or tables

#### Scenario: Database cleanup
- **WHEN** runtime dependency on linking data has been removed
- **THEN** the system SHALL remove linking-only schema objects through migration where safe
- **AND** any remaining legacy fields SHALL be documented as ignored until a later cleanup
