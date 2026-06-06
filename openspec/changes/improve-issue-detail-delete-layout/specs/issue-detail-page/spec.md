## ADDED Requirements

### Requirement: Admin can delete an issue from the detail page
The system SHALL provide a delete button on the issue detail page that, after confirmation, deletes the issue and all associated notes via cascade delete.

#### Scenario: Delete with confirmation
- **WHEN** an admin clicks "Delete" on an issue detail page
- **THEN** a confirmation step SHALL appear ("Delete? Confirm / Cancel")
- **AND** clicking "Confirm" SHALL delete the issue and its notes
- **AND** the admin SHALL be navigated to `/admin/issues`

#### Scenario: Cancel delete
- **WHEN** an admin clicks "Delete" then "Cancel"
- **THEN** the issue SHALL NOT be deleted
- **AND** the confirmation SHALL disappear

### Requirement: Issue detail page uses a structured header-body-discussion layout
The issue detail page SHALL be organized into three visually distinct sections: a header area with metadata and actions, a content body with the description, and a discussion section with threaded notes.

#### Scenario: Header section shows metadata and actions
- **WHEN** an admin views an issue detail page
- **THEN** the header section SHALL display the title, edit and delete action buttons, status badge, unit name, creator, timestamp, and tags

#### Scenario: Content section shows description
- **WHEN** an admin views an issue with a description
- **THEN** the description SHALL appear in a labeled content section

#### Scenario: Discussion section shows notes
- **WHEN** an admin views an issue with notes
- **THEN** the notes SHALL appear in a labeled discussion section with an "Add note" input at the bottom

### Requirement: Status dropdown remains accessible on the detail page
The status dropdown SHALL remain available on the detail page, positioned within the header section.

#### Scenario: Status changed from detail page
- **WHEN** an admin changes the status from the dropdown
- **THEN** the issue status SHALL update and the badge SHALL reflect the new status
