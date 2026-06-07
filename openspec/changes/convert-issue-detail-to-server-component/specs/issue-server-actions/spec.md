## ADDED Requirements

### Requirement: Server actions handle all issue mutations
The system SHALL provide server actions for creating, updating, and deleting issues, and for adding notes to issues. Each server action MUST validate input with Zod, MUST log the event via `logSystemEvent`, and MUST call `revalidatePath` or `redirect` after success.

#### Scenario: Create issue via server action
- **WHEN** an admin submits the create-issue form
- **THEN** the issue SHALL be created with the provided title, description, unit, and tags
- **AND** the event SHALL be logged to the system log
- **AND** the admin SHALL be redirected to the new issue's detail page

#### Scenario: Update issue via server action
- **WHEN** an admin submits the edit-issue form with updated fields
- **THEN** the issue SHALL be updated in the database
- **AND** the event SHALL be logged to the system log
- **AND** the detail page SHALL be revalidated to show updated data

#### Scenario: Delete issue via server action
- **WHEN** an admin confirms deletion of an issue
- **THEN** the issue SHALL be deleted from the database
- **AND** the event SHALL be logged to the system log
- **AND** the admin SHALL be redirected to the issues list

#### Scenario: Add note via server action
- **WHEN** an admin submits the add-note form on the issue detail page
- **THEN** the note SHALL be created in the database
- **AND** the event SHALL be logged to the system log
- **AND** the detail page SHALL be revalidated to show the new note

#### Scenario: Validation rejects invalid input
- **WHEN** an admin submits a form with missing required fields (e.g., empty title)
- **THEN** the server action SHALL reject the submission with an error
- **AND** no database mutation SHALL occur

### Requirement: Issue detail page queries a single issue by ID
The issue detail page at `/admin/issues/[id]` SHALL fetch only the requested issue from the database using a single-row query, not by fetching all issues and filtering client-side.

#### Scenario: Detail page fetches one issue
- **WHEN** an admin navigates to `/admin/issues/[id]`
- **THEN** the system SHALL query the database for the issue with the matching ID
- **AND** the query SHALL use `.eq("id", id).single()`

#### Scenario: Missing issue shows not-found state
- **WHEN** an admin navigates to `/admin/issues/nonexistent-id`
- **THEN** the page SHALL display an "Issue not found" message with a back link to the issues list

### Requirement: Issue detail page is rendered server-side
The issue detail page SHALL be a server component (no `"use client"` directive) that fetches data during server-side rendering, matching the pattern used by the units, kits, and archives detail pages.

#### Scenario: Server-side data fetching
- **WHEN** an admin navigates to `/admin/issues/[id]`
- **THEN** the issue data, notes, and units list SHALL be fetched on the server before the page HTML is sent to the client

#### Scenario: Server-rendered notes list
- **WHEN** an admin views an issue with notes
- **THEN** the notes SHALL be rendered in the initial HTML response, not loaded asynchronously after page load
