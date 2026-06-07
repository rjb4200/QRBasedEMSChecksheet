## ADDED Requirements

### Requirement: Admins can add notes to an issue
The system SHALL provide an `issue_notes` table and API that allows admins to add timestamped notes to any issue, forming a chronological conversation thread.

#### Scenario: Note added to issue
- **WHEN** an admin submits a note on an issue
- **THEN** a new row SHALL be created in `issue_notes` with the note text, the admin's username, and a timestamp
- **AND** the notes SHALL be displayed in chronological order (oldest first)

#### Scenario: Notes displayed with author and timestamp
- **WHEN** notes are displayed
- **THEN** each note SHALL show the author's username and a formatted timestamp

#### Scenario: Empty note rejected
- **WHEN** an admin submits a blank or whitespace-only note
- **THEN** the system SHALL reject the request

### Requirement: Notes are deleted when the issue is deleted
The system SHALL cascade-delete all notes when their parent issue is deleted.

#### Scenario: Cascade delete
- **WHEN** an issue with 3 notes is deleted
- **THEN** all 3 notes SHALL be deleted as well

### Requirement: Notes API requires admin authentication
The notes API SHALL require an admin session for both reading and creating notes.

#### Scenario: Unauthorized note request
- **WHEN** a non-admin requests notes
- **THEN** the system SHALL return 401

### Requirement: Issue notes queries are indexed for performance
The `issue_notes` table SHALL have a composite database index on `(issue_id, created_at)` to enable efficient lookups when fetching notes for a specific issue sorted by creation time.

#### Scenario: Indexed notes lookup
- **WHEN** the system queries notes for a specific issue ordered by `created_at`
- **THEN** the database SHALL use the composite index to avoid a full table scan

#### Scenario: Index creation is non-destructive
- **WHEN** the migration adding the index is applied
- **THEN** existing data and queries SHALL continue to function without interruption
