## ADDED Requirements

### Requirement: Crew members sign off at end of checkoff
At the end of a full unit checkoff, each crew member SHALL sign off using their authenticated identity.

#### Scenario: Crew member signs off
- **WHEN** all compartments are completed and a crew member taps "Sign Off"
- **THEN** their authenticated identity is recorded as a signature for that shift

### Requirement: Sign-off requires authentication
Only authenticated users can sign off on a checkoff. Sign-off SHALL use the user's authenticated email identity, not free-text entry.

#### Scenario: Sign-off uses authenticated identity
- **WHEN** user signs off on a checkoff
- **THEN** their authenticated name and email are recorded as the signature

### Requirement: Multiple crew members can sign off
The system SHALL allow multiple crew members (up to the unit's crew size) to sign off on the same shift's checkoff.

#### Scenario: Second crew member signs off
- **WHEN** a second crew member signs off on the same unit's checkoff
- **THEN** both signatures are recorded for that shift

### Requirement: Sign-off is visible in archive
Personnel signatures for each shift SHALL be displayed in the archive viewer.

#### Scenario: View signatures in archive
- **WHEN** admin views an archived shift
- **THEN** all crew member signatures for that shift are displayed
