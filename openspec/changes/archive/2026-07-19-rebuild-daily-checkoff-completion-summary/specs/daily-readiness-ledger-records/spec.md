## ADDED Requirements

### Requirement: Records identify authoritative completion status
The Records page SHALL identify whether the selected date's completion result is live, finalized, or reconstructed and SHALL expose action-progress and fully complete-unit counts from the daily completion summary.

#### Scenario: Selected date has a finalized summary
- **WHEN** an administrator views a date with a finalized daily completion summary
- **THEN** the Records page SHALL display finalized action-progress and fully complete-unit counts

#### Scenario: Selected date has reconstructed history
- **WHEN** an administrator views a date whose summary was reconstructed from pre-cutover raw records
- **THEN** the Records page SHALL label the completion result as reconstructed
