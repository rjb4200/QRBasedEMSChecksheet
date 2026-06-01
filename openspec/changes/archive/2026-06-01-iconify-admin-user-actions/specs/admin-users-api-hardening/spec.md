## ADDED Requirements

### Requirement: Admin users page uses icon actions with destructive toggle
The admin users page SHALL use pencil and trash icons for Edit and Delete actions, with a destructive actions toggle that hides delete icons until enabled.

#### Scenario: Edit and Delete use icons
- **WHEN** the admin users page renders a user row
- **THEN** the Edit action SHALL be a pencil icon button
- **AND** the Delete action SHALL be a trash icon button

#### Scenario: Delete icons are hidden until toggle enabled
- **WHEN** the destructive actions toggle is off
- **THEN** trash icons SHALL be hidden on all user rows
- **AND** the delete modal SHALL NOT be accessible

#### Scenario: Toggle enabled shows delete icons
- **WHEN** the destructive actions toggle is enabled
- **THEN** trash icons SHALL appear on all user rows
- **AND** clicking a trash icon SHALL open the delete confirmation modal
