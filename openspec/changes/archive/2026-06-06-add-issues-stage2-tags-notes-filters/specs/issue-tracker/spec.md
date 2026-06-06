## ADDED Requirements

### Requirement: Issue tags are stored and displayed on issue cards
The Issues page SHALL display tag badges on issue cards and accept tag input when creating or editing issues.

#### Scenario: Tags displayed as colored badges
- **WHEN** an issue has tags ["equipment", "safety"]
- **THEN** the issue card SHALL display colored badges for each tag alongside the title

#### Scenario: Tags input on create form
- **WHEN** an admin creates an issue
- **THEN** the create form SHALL include an optional tag input

### Requirement: Issue cards show an expandable notes section
The Issues page SHALL display an expandable notes section on each issue card.

#### Scenario: Notes visible on issue card
- **WHEN** an admin expands the notes section on an issue with 2 notes
- **THEN** all notes SHALL be displayed with author and timestamp
- **AND** an "Add Note" textarea SHALL be shown at the bottom

### Requirement: Issue cards support keyword search
The Issues page SHALL filter displayed issues based on a text search input that matches against both title and description.

#### Scenario: Search matches title
- **WHEN** an admin searches for "pump"
- **THEN** issues with "pump" in the title SHALL be displayed

#### Scenario: Search matches description
- **WHEN** an admin searches for "broken"
- **THEN** issues with "broken" in the description SHALL be displayed
