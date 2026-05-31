## MODIFIED Requirements

### Requirement: Log rows show expandable details
Each log row on the admin system log page SHALL be expandable to reveal message, before_data, after_data, and metadata content. The collapsed view SHALL display the result badge, area badge, timestamp, action name, and summary on a single responsive line without a separate target UUID column.

#### Scenario: Admin views collapsed log row
- **WHEN** the system log page renders a log row
- **THEN** the collapsed row SHALL show result, area, timestamp, action, and summary inline
- **AND** the row SHALL NOT display a raw target_type or UUID column
