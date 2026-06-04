## ADDED Requirements

### Requirement: Admin action buttons use standard icon set
Admin interface action buttons for edit, delete, save, cancel, QR codes, and filter SHALL use the standard icon components from `src/components/icons.tsx` with accessible labels and tooltips.

#### Scenario: Edit actions use pencil icon
- **WHEN** an admin page renders an edit button
- **THEN** the button SHALL use `IconEdit` from the shared icons file

#### Scenario: Delete actions use trash icon
- **WHEN** an admin page renders a delete or remove button
- **THEN** the button SHALL use `IconTrash` from the shared icons file

#### Scenario: Save actions use floppy icon
- **WHEN** an admin page renders a save button
- **THEN** the button SHALL use `IconSave` from the shared icons file

#### Scenario: Cancel actions use X icon
- **WHEN** an admin page renders a cancel button
- **THEN** the button SHALL use `IconCancel` from the shared icons file

#### Scenario: Filter actions use filter icon
- **WHEN** an admin page renders a filter button
- **THEN** the button SHALL use `IconFilter` from the shared icons file

### Requirement: Remaining pages iconified
The kits list page, kit builder page, unit builder page, and system log page SHALL use the standard icon set for all applicable action buttons.

#### Scenario: Kits list uses icons for row actions
- **WHEN** the kits list page renders a kit card
- **THEN** the Edit Kit and Delete actions SHALL use icon buttons with tooltips

#### Scenario: Kit builder uses icons for per-item actions
- **WHEN** the kit builder page renders item rows and group rows
- **THEN** per-row Delete and Save actions SHALL use icon buttons

#### Scenario: Unit builder uses icons for per-item actions
- **WHEN** the unit builder page renders compartment, group, and item rows
- **THEN** per-row Save, Delete, and Remove actions SHALL use icon buttons

#### Scenario: System log uses icon for Filter and Reset
- **WHEN** the system log page renders the filter bar
- **THEN** the Filter and Reset buttons SHALL include standard filter and cancel icons
