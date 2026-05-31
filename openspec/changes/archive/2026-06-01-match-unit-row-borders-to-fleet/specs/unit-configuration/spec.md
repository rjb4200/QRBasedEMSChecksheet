## MODIFIED Requirements

### Requirement: Admin units page uses shared panel and red section labels
The admin units list page SHALL use "Unit Management" as the page heading and display the unit list inside a shared white rounded panel with the "Units" red label and destructive toggle positioned at the top of that panel. The "Create a New Unit" section heading SHALL use red text styling. Unit rows SHALL use the same `border-slate-200` card border as the Fleet Panel.

#### Scenario: Page renders with proper layout
- **WHEN** the admin units list page renders
- **THEN** the page heading SHALL display "Unit Management"
- **AND** the unit list SHALL appear inside a shared panel without an outer border
- **AND** each unit row SHALL have a `border-slate-200` border matching Fleet Panel cards
- **AND** the "Units" red label and destructive toggle SHALL be positioned at the top of the panel
- **AND** the "Create a New Unit" heading SHALL use red text
