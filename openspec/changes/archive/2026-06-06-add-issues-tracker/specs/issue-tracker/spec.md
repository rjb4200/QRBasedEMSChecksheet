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

### Requirement: Admin issues page displays all issues
The system SHALL provide an admin-only page at `/admin/issues` that displays all issues in a status-filterable list.

#### Scenario: Page loads with all issues
- **WHEN** an admin navigates to `/admin/issues`
- **THEN** all issues SHALL be displayed grouped by status sections with status badge colors

#### Scenario: Filter by status
- **WHEN** an admin clicks a status filter tab
- **THEN** only issues with that status SHALL be displayed

#### Scenario: Non-admin access denied
- **WHEN** a non-admin user navigates to `/admin/issues`
- **THEN** they SHALL be redirected to the login page or denied page

### Requirement: Admin can create issues
The system SHALL allow admins to create new issues from the Issues page with a title, optional description, and optional unit assignment.

#### Scenario: Create issue with minimum fields
- **WHEN** an admin submits a new issue with only a title
- **THEN** the issue SHALL be created with status `open` and appear in the issues list

#### Scenario: Create issue with unit assignment
- **WHEN** an admin creates an issue and selects a unit
- **THEN** the issue SHALL be associated with that unit

#### Scenario: Create issue with description
- **WHEN** an admin creates an issue with a title and description
- **THEN** the description SHALL be displayed on the issue card

#### Scenario: Create form is collapsible
- **WHEN** an admin views the Issues page
- **THEN** the create form SHALL be hidden by default with a toggle button to expand it

### Requirement: Admin can change issue status
The system SHALL allow admins to change an issue's status between open, in_progress, and closed from the issue card.

#### Scenario: Change status via dropdown
- **WHEN** an admin selects a new status from the issue card's dropdown
- **THEN** the issue's status SHALL immediately update and the issue SHALL move to the corresponding status section

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
