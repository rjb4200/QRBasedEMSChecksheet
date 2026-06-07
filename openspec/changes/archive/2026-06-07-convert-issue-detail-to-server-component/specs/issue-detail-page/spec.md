## MODIFIED Requirements

### Requirement: Issue detail page shows full issue information
The system SHALL provide a dedicated detail page at `/admin/issues/[id]` that displays an issue's full title, description, unit, tags, status, creator, and timestamp. The page SHALL be a server component that fetches issue data during server-side rendering.

#### Scenario: Detail page loads with issue data
- **WHEN** an admin navigates to `/admin/issues/[id]`
- **THEN** the page SHALL display the issue's title, description, unit badge, tags as colored badges, status badge, creator name, and formatted timestamp

#### Scenario: Back navigation returns to list
- **WHEN** an admin clicks "← Back to Issues"
- **THEN** they SHALL be navigated to `/admin/issues`

### Requirement: Detail page shows threaded notes chronologically
The detail page SHALL display all notes for the issue in chronological order (oldest first), with each note showing author, timestamp, and text. Notes SHALL be fetched during server-side rendering alongside issue data.

#### Scenario: Notes displayed in chronological order
- **WHEN** an issue has 3 notes created at 10:00, 10:30, and 11:00
- **THEN** the notes SHALL be displayed in that order (oldest first)

#### Scenario: No notes yet
- **WHEN** an issue has zero notes
- **THEN** the detail page SHALL display "No notes yet" or equivalent empty state

### Requirement: Detail page allows adding notes inline
The detail page SHALL provide a textarea and submit button within a form for admins to add notes to the issue. The form SHALL submit to a server action that persists the note and revalidates the page.

#### Scenario: Note added successfully
- **WHEN** an admin types a note and submits the form
- **THEN** the note SHALL appear in the notes list after page revalidation
- **AND** the textarea SHALL be cleared

### Requirement: Detail page allows changing issue status
The detail page SHALL provide a status dropdown within the issue edit form that, when submitted alongside other changes, updates the issue's status.

#### Scenario: Status changed on detail page
- **WHEN** an admin selects a new status from the dropdown and submits the edit form
- **THEN** the issue's status SHALL be updated after form submission

### Requirement: Detail page allows editing tags
The detail page SHALL allow admins to edit tags via a comma-separated text input in the edit form. Tags SHALL be displayed as colored badges for read-only viewing, and editable as a text field during editing.

#### Scenario: Tags edited on detail page
- **WHEN** an admin edits the tags text field and submits the edit form
- **THEN** the tags SHALL be updated on the issue record and reflected in the badge display

### Requirement: Detail page allows editing issue details
The detail page SHALL provide an edit form that allows admins to modify the issue's title, description, status, unit assignment, and tags in a single submission.

#### Scenario: Edit form updates issue
- **WHEN** an admin modifies fields in the edit form and clicks save
- **THEN** all modified fields SHALL be persisted to the database
- **AND** the page SHALL display the updated values

### Requirement: Detail page allows deleting issues
The detail page SHALL provide a delete mechanism with confirmation that removes the issue and redirects to the issues list.

#### Scenario: Issue deleted with confirmation
- **WHEN** an admin clicks delete and confirms the action
- **THEN** the issue SHALL be removed from the database
- **AND** the admin SHALL be redirected to `/admin/issues`

#### Scenario: Delete confirmation is two-step
- **WHEN** an admin clicks the delete button
- **THEN** a confirmation UI SHALL appear before the deletion is executed
