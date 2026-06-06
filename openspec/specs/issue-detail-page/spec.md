## ADDED Requirements

### Requirement: Issue detail page shows full issue information
The system SHALL provide a dedicated detail page at `/admin/issues/[id]` that displays an issue's full title, description, unit, tags, status, creator, and timestamp.

#### Scenario: Detail page loads with issue data
- **WHEN** an admin navigates to `/admin/issues/[id]`
- **THEN** the page SHALL display the issue's title, description, unit badge, tags as colored badges, status badge, creator name, and formatted timestamp

#### Scenario: Back navigation returns to list
- **WHEN** an admin clicks "← Back to Issues"
- **THEN** they SHALL be navigated to `/admin/issues`

### Requirement: Detail page shows threaded notes chronologically
The detail page SHALL display all notes for the issue in chronological order (oldest first), with each note showing author, timestamp, and text.

#### Scenario: Notes displayed in chronological order
- **WHEN** an issue has 3 notes created at 10:00, 10:30, and 11:00
- **THEN** the notes SHALL be displayed in that order (oldest first)

#### Scenario: No notes yet
- **WHEN** an issue has zero notes
- **THEN** the detail page SHALL display "No notes yet" or equivalent empty state

### Requirement: Detail page allows adding notes inline
The detail page SHALL provide a textarea and "Add Note" button for admins to add notes to the issue via the existing notes API.

#### Scenario: Note added successfully
- **WHEN** an admin types a note and clicks "Add Note"
- **THEN** the note SHALL appear in the notes list immediately
- **AND** the textarea SHALL clear

### Requirement: Detail page allows changing issue status
The detail page SHALL provide a status dropdown that updates the issue's status via the existing PUT API.

#### Scenario: Status changed on detail page
- **WHEN** an admin selects a new status from the dropdown
- **THEN** the issue's status SHALL update immediately

### Requirement: Detail page allows editing tags
The detail page SHALL allow admins to edit tags via the existing PUT API, displayed as colored badges with an edit control.

#### Scenario: Tags edited on detail page
- **WHEN** an admin edits the tags and saves
- **THEN** the tags SHALL be updated on the issue record and reflected in the badge display
