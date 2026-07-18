## MODIFIED Requirements

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
