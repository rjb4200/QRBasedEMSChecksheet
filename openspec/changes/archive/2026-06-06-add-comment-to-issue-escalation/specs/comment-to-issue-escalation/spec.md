## ADDED Requirements

### Requirement: Recent Comments widget shows "Create Issue" button per comment
The Fleet panel's Recent Comments widget SHALL display a "Create Issue" button on each comment card for authenticated admin users.

#### Scenario: Button visible on comment card
- **WHEN** an admin views the Recent Comments widget with comments loaded
- **THEN** each comment card SHALL display a "Create Issue" button

#### Scenario: No button when no comments
- **WHEN** the Recent Comments widget displays an empty state ("No recent comments")
- **THEN** no "Create Issue" button SHALL be shown

### Requirement: Clicking "Create Issue" opens inline escalation form
Clicking the "Create Issue" button on a comment card SHALL replace the card content with a pre-filled issue creation form.

#### Scenario: Form opens with pre-filled data
- **WHEN** an admin clicks "Create Issue" on a comment from "Engine 1" with source "General" and the comment text "IV pump is broken"
- **THEN** the card SHALL expand to show a form with:
  - Title pre-filled as "Engine 1 — General"
  - Description pre-filled with the comment text
  - Unit dropdown pre-selected to the comment's unit
- **AND** a "Create" submit button and "Cancel" link SHALL be shown

#### Scenario: Only one escalation form open at a time
- **WHEN** an admin clicks "Create Issue" on one comment card
- **AND** another card already has an open escalation form
- **THEN** the previously open form SHALL close and the new form SHALL open

### Requirement: Submitting escalation form creates an issue
Submitting the escalation form SHALL call the `POST /api/admin/issues` endpoint to create a new issue and collapse the form on success.

#### Scenario: Successful issue creation
- **WHEN** an admin submits the escalation form
- **THEN** a new issue SHALL be created with the form's title, description, and unit
- **AND** the issue status SHALL be "open"
- **AND** the creator SHALL be the submitting admin
- **AND** the form SHALL collapse back to the normal comment card

#### Scenario: Failed issue creation
- **WHEN** the issue creation API returns an error
- **THEN** the form SHALL remain open
- **AND** an error message SHALL be displayed

### Requirement: Cancelling escalation returns to comment view
The "Cancel" button on the escalation form SHALL collapse the form and restore the normal comment card view without creating an issue.

#### Scenario: Cancel restores comment card
- **WHEN** an admin clicks "Cancel" on an open escalation form
- **THEN** the form SHALL collapse
- **AND** the comment card SHALL display normally with the "Create Issue" button visible again
