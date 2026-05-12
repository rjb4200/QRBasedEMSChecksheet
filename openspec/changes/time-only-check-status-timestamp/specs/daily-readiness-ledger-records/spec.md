## ADDED Requirements

### Requirement: Check status timestamp shows time only
The system SHALL display only the time portion of the submission timestamp under the Check Status column for checked units, omitting the date which is already present in the page header.

#### Scenario: Checked unit with submission time
- **WHEN** a unit is in checked status and has a submission timestamp
- **THEN** the Check Status display SHALL show only the time (e.g., "2:30:00 PM") without the date

#### Scenario: Checked unit without submission time
- **WHEN** a unit is in checked status but has no submission timestamp
- **THEN** the Check Status display SHALL show "Not recorded"
