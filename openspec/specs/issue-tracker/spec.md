## ADDED Requirements

### Requirement: Issues table stores operational problems
The system SHALL provide an `issues` database table that stores persistent operational problems for long-term tracking with title, description, optional unit reference, status, and creator.

#### Scenario: Issue stored with all fields
- **WHEN** an admin creates an issue with title, description, and an optional unit
- **THEN** the system SHALL persist the issue with the creating admin's username, a timestamp, and status set to `open`

#### Scenario: Issue stored without unit
- **WHEN** an admin creates an issue without selecting a unit
- **THEN** the system SHALL persist the issue with a null unit reference

#### Scenario: Status defaults to open
- **WHEN** an issue is created
- **THEN** the status SHALL default to `open`

### Requirement: Issues page displays issues as scannable rows
The Issues page at `/admin/issues` SHALL display issues as a scannable table-style list with clickable rows navigating to the detail page, instead of expandable cards.

#### Scenario: Row shows key metadata
- **WHEN** an admin views the Issues list
- **THEN** each issue row SHALL display the title, up to 2 tag badges, unit badge (if assigned), status badge (colored), and created date

#### Scenario: Row click navigates to detail
- **WHEN** an admin clicks an issue row
- **THEN** they SHALL be navigated to `/admin/issues/[id]`

#### Scenario: Create form and filters remain on list page
- **WHEN** an admin views the Issues list
- **THEN** the collapsible create-issue form, status filter tabs, filter bar (search, unit, tag), and sort dropdown SHALL remain present and functional

#### Scenario: Filter by status
- **WHEN** an admin clicks a status filter tab
- **THEN** only issues with that status SHALL be displayed

#### Scenario: Non-admin access denied
- **WHEN** a non-admin user navigates to `/admin/issues`
- **THEN** they SHALL be redirected to the login page or denied page

### Requirement: Admin can create issues
The system SHALL allow admins to create new issues from the Issues page with a title, optional description, optional unit assignment, and optional tags.

#### Scenario: Create issue with minimum fields
- **WHEN** an admin submits a new issue with only a title
- **THEN** the issue SHALL be created with status `open` and appear in the issues list

#### Scenario: Create issue with unit assignment
- **WHEN** an admin creates an issue and selects a unit
- **THEN** the issue SHALL be associated with that unit

#### Scenario: Create issue with description
- **WHEN** an admin creates an issue with a title and description
- **THEN** the description SHALL be displayed on the issue

#### Scenario: Create form is collapsible
- **WHEN** an admin views the Issues page
- **THEN** the create form SHALL be hidden by default with a toggle button to expand it

#### Scenario: Tags input on create form
- **WHEN** an admin creates an issue
- **THEN** the create form SHALL include an optional tag input

### Requirement: Admin can change issue status
The system SHALL allow admins to change an issue's status between open, in_progress, and closed.

#### Scenario: Change status via dropdown
- **WHEN** an admin selects a new status from the dropdown
- **THEN** the issue's status SHALL immediately update

#### Scenario: Status changes persist across page reloads
- **WHEN** an admin changes an issue's status
- **AND** the page is reloaded
- **THEN** the issue SHALL retain the updated status

### Requirement: Issue links appear in top admin navigation
The system SHALL display an "Issues" link in the top admin navigation bar alongside Fleet, Records, and System Log.

#### Scenario: Issues link visible to admins
- **WHEN** an admin views any admin page
- **THEN** an "Issues" link SHALL be visible in the top navigation bar

#### Scenario: Issues link navigates correctly
- **WHEN** an admin clicks the "Issues" navigation link
- **THEN** they SHALL be taken to `/admin/issues`

### Requirement: Issue tags are stored and displayed on issue cards
The Issues page SHALL display tag badges on issues and accept tag input when creating or editing issues.

#### Scenario: Tags displayed as colored badges
- **WHEN** an issue has tags ["equipment", "safety"]
- **THEN** the issue SHALL display colored badges for each tag alongside the title

### Requirement: Issues support keyword search
The Issues page SHALL filter displayed issues based on a text search input that matches against both title and description.

#### Scenario: Search matches title
- **WHEN** an admin searches for "pump"
- **THEN** issues with "pump" in the title SHALL be displayed

#### Scenario: Search matches description
- **WHEN** an admin searches for "broken"
- **THEN** issues with "broken" in the description SHALL be displayed

### Requirement: Issues table has performance indexes
The `issues` table SHALL have database indexes on `status`, `created_at`, and `unit_id` columns to enable efficient filtering and sorting of the issues list.

#### Scenario: Status filtering uses index
- **WHEN** the system queries issues filtered by status
- **THEN** the database SHALL use the index on the `status` column to avoid a full table scan

#### Scenario: Date sorting uses index
- **WHEN** the system queries issues ordered by `created_at DESC`
- **THEN** the database SHALL use the index on the `created_at` column for efficient sorting

#### Scenario: Unit filtering uses index
- **WHEN** the system queries issues filtered by `unit_id`
- **THEN** the database SHALL use the index on the `unit_id` column to avoid a full table scan
