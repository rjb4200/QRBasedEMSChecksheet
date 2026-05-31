## MODIFIED Requirements

### Requirement: Destructive actions require a global toggle
The admin units list page SHALL require an admin to enable a destructive actions toggle before any delete icon appears on unit rows. The toggle SHALL be positioned inside a shared white panel below the "Units" red label and above the unit list.

#### Scenario: Toggle is off by default
- **WHEN** the admin units list page loads
- **THEN** the destructive actions toggle SHALL be off inside the shared panel
- **AND** no delete icons SHALL appear on any unit row

### Requirement: Admin units page uses descriptive title and red section labels
The admin units list page SHALL use "Unit Management" as the page heading and red text styling for the "Units" and "Create a New Unit" section labels.

#### Scenario: Page renders with proper headings
- **WHEN** the admin units list page renders
- **THEN** the page heading SHALL display "Unit Management"
- **AND** the "Units" label inside the shared panel SHALL use red text styling
- **AND** the "Create a New Unit" label SHALL use red text styling
