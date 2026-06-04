## ADDED Requirements

### Requirement: Delete actions use two-stage confirmation
All admin delete buttons SHALL use a two-stage confirmation pattern: clicking the trash icon reveals a cancel button and a "Delete?" confirmation button before submitting the form.

#### Scenario: Cancel hides confirmation
- **WHEN** an admin clicks the cancel button during delete confirmation
- **THEN** the confirmation buttons SHALL be hidden and the trash icon SHALL reappear

#### Scenario: Confirm submits the form
- **WHEN** an admin clicks the "Delete?" confirmation button
- **THEN** the delete form SHALL be submitted

### Requirement: Equipment catalog has destructive mode toggle
The equipment catalog page SHALL include a destructive mode toggle that gates the visibility of all delete icons, consistent with the units and users pages.

#### Scenario: Toggle off hides delete icons
- **WHEN** the destructive mode toggle is off on the equipment catalog page
- **THEN** no delete icons SHALL appear on any equipment row

#### Scenario: Toggle on shows delete icons
- **WHEN** the destructive mode toggle is enabled
- **THEN** delete icons SHALL appear on all equipment rows with two-stage confirmation
