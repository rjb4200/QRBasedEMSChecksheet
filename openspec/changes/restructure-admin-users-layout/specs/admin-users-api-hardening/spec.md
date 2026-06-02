## MODIFIED Requirements

### Requirement: Admin users page uses icon actions with destructive toggle
The admin users page SHALL display the add-user form and existing users list inside a shared white rounded panel with red section labels, matching the panel and heading pattern used by the Fleet Panel and Units pages. The page SHALL use "Admin Dashboard" as the page heading and "User Management" and "Existing Users" as red section labels.

#### Scenario: Page layout matches units panel pattern
- **WHEN** the admin users page renders
- **THEN** the page SHALL display "Admin Dashboard" as a large heading
- **AND** the add-user form and existing users SHALL appear inside a shared white panel
- **AND** section headings SHALL use red text styling

#### Scenario: Edit form does not overflow
- **WHEN** an admin clicks Edit on a user row
- **THEN** the inline edit form SHALL wrap naturally without causing horizontal overflow
