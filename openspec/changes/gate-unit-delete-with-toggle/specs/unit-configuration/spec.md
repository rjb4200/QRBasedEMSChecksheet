## ADDED Requirements

### Requirement: Destructive actions require a global toggle
The admin units list page SHALL require an admin to enable a destructive actions toggle before any delete icon appears on unit rows.

#### Scenario: Toggle is off by default
- **WHEN** the admin units list page loads
- **THEN** the destructive actions toggle SHALL be off
- **AND** no delete icons SHALL appear on any unit row

#### Scenario: Admin enables destructive actions
- **WHEN** the admin enables the destructive actions toggle
- **THEN** delete icons SHALL appear on all unit rows

#### Scenario: Admin disables destructive actions
- **WHEN** the admin disables the toggle after enabling it
- **THEN** delete icons SHALL disappear from all unit rows

### Requirement: Unit delete requires two-step per-row confirmation
The admin units list page SHALL require a two-step confirmation before submitting a unit delete form: clicking the delete icon reveals a confirm and cancel action, and only the confirm action submits the form.

#### Scenario: Admin clicks delete icon
- **WHEN** the admin clicks a unit's delete icon
- **THEN** the icon SHALL be replaced by a red "Delete?" button and a cancel button

#### Scenario: Admin confirms delete
- **WHEN** the admin clicks the "Delete?" confirmation button
- **THEN** the delete form SHALL be submitted

#### Scenario: Admin cancels delete
- **WHEN** the admin clicks the cancel button after revealing the delete confirmation
- **THEN** the confirmation buttons SHALL be hidden and the delete icon SHALL reappear

### Requirement: Create unit form is positioned below the unit list
The admin units list page SHALL display the Create unit form below the unit list.

#### Scenario: Create form position
- **WHEN** the admin units list page renders
- **THEN** the Create unit form SHALL appear after the unit list
