## ADDED Requirements

### Requirement: Admin units list uses consistent icon actions
The admin units list page SHALL use pencil and trash icons for Edit and Delete actions, matching the icon set used on the equipment catalog page.

#### Scenario: Edit action uses pencil icon
- **WHEN** the admin units list page renders a unit row
- **THEN** the Edit action SHALL be a pencil icon button with an accessible label

#### Scenario: Delete action uses trash icon
- **WHEN** the admin units list page renders a unit row
- **THEN** the Delete action SHALL be a trash icon button with an accessible label

### Requirement: OOS toggle is leftmost in unit action row
The admin units list page SHALL position the OOS status toggle as the leftmost action button so that its variable text width does not shift other action buttons.

#### Scenario: OOS toggle is the first action
- **WHEN** the admin units list page renders a unit row
- **THEN** the OOS toggle button SHALL appear before the Edit, QR Codes, and Delete actions
