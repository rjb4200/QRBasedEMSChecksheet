## ADDED Requirements

### Requirement: Past records expose archived and status note snapshot fields
Past Checkoff Records SHALL expose daily ledger archived state and status note when those values exist.

#### Scenario: Historical ledger has archived flag or status note
- **WHEN** a daily ledger row for an archived date includes `archived` or `status_note`
- **THEN** archive views and exports SHALL expose those snapshot values

### Requirement: Archive views use daily service snapshots for historical fleet state
Archive views SHALL use `daily_unit_ledgers` as the source of historical unit service and archived state when ledger rows exist for the date.

#### Scenario: Ledger exists for historical date
- **WHEN** daily ledger rows exist for an archived date
- **THEN** archive views SHALL show units, unit status, archived flag, and status note from those ledger rows
- **AND** units archived after that date SHALL still appear according to the historical ledger
