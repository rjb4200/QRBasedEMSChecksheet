## ADDED Requirements

### Requirement: Admin users page includes a test email button
The admin users page SHALL include a "Send Test Email" button and a dropdown to select a recipient admin user for testing the daily email report.

#### Scenario: Admin selects a user and sends test email
- **WHEN** an admin selects a user from the dropdown and clicks "Send Test Email"
- **THEN** the daily email report SHALL be generated and sent to the selected user's email
- **AND** a success or error message SHALL be displayed

#### Scenario: Test email endpoint requires admin authentication
- **WHEN** the test email endpoint is called without a valid admin session
- **THEN** the endpoint SHALL return 401
