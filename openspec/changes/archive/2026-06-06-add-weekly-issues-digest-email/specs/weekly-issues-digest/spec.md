## ADDED Requirements

### Requirement: Weekly issues digest email is sent every Monday
The system SHALL send a weekly email digest listing all open and in_progress issues every Monday at 10 AM ET to admin users who have opted in.

#### Scenario: Digest sent on Monday
- **WHEN** the Vercel cron fires on Monday at the scheduled time
- **THEN** all open and in_progress issues SHALL be queried
- **AND** an HTML+text email SHALL be sent to all admins with `receives_weekly_issues_digest = true` and a valid email

#### Scenario: No active issues
- **WHEN** the cron fires and there are zero open or in_progress issues
- **THEN** the email SHALL still be sent with a message indicating "No active issues this week"

#### Scenario: Duplicate prevention
- **WHEN** the cron fires and a successful run already exists for that week
- **THEN** the email SHALL NOT be sent again

### Requirement: Digest email includes issue cards with metadata
Each issue card in the digest email SHALL display: title, unit name, status label, tags, creator name, creation date, note count, and the text of the most recent note if any.

#### Scenario: Issue card with notes
- **WHEN** an issue has 3 notes with the latest being "Replacement ordered"
- **THEN** the email SHALL show "3 notes" and display the latest note text

#### Scenario: Issue card without notes
- **WHEN** an issue has zero notes
- **THEN** the email SHALL show "No notes"

#### Scenario: Summary stats
- **WHEN** the digest is generated with 5 open and 3 in_progress issues
- **THEN** the email SHALL show summary counts at the top

### Requirement: Admin users can opt in or out of weekly digest
The system SHALL store a `receives_weekly_issues_digest` boolean per admin user, defaulting to true.

#### Scenario: Opted in
- **WHEN** an admin has `receives_weekly_issues_digest = true` and a valid email
- **THEN** they SHALL receive the weekly digest

#### Scenario: Opted out
- **WHEN** an admin has `receives_weekly_issues_digest = false`
- **THEN** they SHALL NOT receive the weekly digest

### Requirement: Test endpoint sends digest to a single email
The system SHALL provide a `POST /api/admin/test-weekly-report` endpoint that builds and sends the weekly digest to a specified email address.

#### Scenario: Admin sends test digest
- **WHEN** an admin posts a valid email to the test endpoint
- **THEN** the weekly digest SHALL be sent to that email only
- **AND** no run record SHALL be created
