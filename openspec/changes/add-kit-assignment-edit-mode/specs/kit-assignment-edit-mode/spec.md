## ADDED Requirements

### Requirement: Kit page supports edit-mode unit assignment
The Admin Kits page SHALL allow admins to toggle an edit mode for managing unit assignments per kit, staging changes without autosaving.

#### Scenario: Default read-only view
- **WHEN** the kits page loads
- **THEN** assigned units SHALL display as a read-only text list
- **AND** an "Edit Assignments" button SHALL be visible

#### Scenario: Edit mode shows checkboxes
- **WHEN** an admin clicks "Edit Assignments" on a kit card
- **THEN** all active units SHALL appear with checkboxes
- **AND** assigned units SHALL be checked with distinct styling
- **AND** unassigned units SHALL be unchecked with lighter styling

#### Scenario: Checkbox changes are staged only
- **WHEN** an admin checks or unchecks a unit in edit mode
- **THEN** the change SHALL be added to a pending additions or removals list
- **AND** no server request SHALL be made

#### Scenario: Pending changes displayed
- **WHEN** pending additions or removals exist
- **THEN** a summary of pending adds and removes SHALL be displayed

#### Scenario: Apply saves and exits edit mode
- **WHEN** an admin clicks "Apply Changes" and confirms
- **THEN** staged additions and removals SHALL be applied to the server
- **AND** edit mode SHALL turn off
- **AND** the assigned units list SHALL update

#### Scenario: Cancel discards and exits edit mode
- **WHEN** an admin clicks "Cancel" in edit mode
- **THEN** all pending changes SHALL be discarded
- **AND** edit mode SHALL turn off
- **AND** checkboxes SHALL return to the previous state

#### Scenario: Apply requires confirmation
- **WHEN** an admin clicks "Apply Changes"
- **THEN** a confirmation SHALL appear listing units to add and remove
- **AND** changes SHALL apply only after confirmation
