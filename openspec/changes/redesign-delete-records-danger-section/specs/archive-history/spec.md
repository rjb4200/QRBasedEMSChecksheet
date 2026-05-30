## ADDED Requirements

### Requirement: Data deletion section uses danger zone visual treatment
The data deletion section SHALL display a red danger banner header with a warning icon and permanent subtext to clearly distinguish it from other page content.

#### Scenario: Danger banner always visible
- **WHEN** an admin views the Records page
- **THEN** the deletion section SHALL display a red banner with "⚠️ DANGER ZONE — Data Destruction" as its header
- **AND** a subtext SHALL read "These actions permanently delete operational records. Exported records cannot be recovered after deletion."

#### Scenario: Section has distinct red-tinted styling
- **WHEN** the Records page renders
- **THEN** the deletion section SHALL use a red-tinted border and background visually distinct from other white page cards

### Requirement: Terminology uses DELETE instead of Clear
The deletion section SHALL use all-caps "DELETE" terminology instead of "Clear" in all labels, buttons, and status text.

#### Scenario: Labels and buttons use DELETE
- **WHEN** an admin interacts with the deletion section
- **THEN** labels SHALL read "DELETE RECORDS From", "Export and DELETE", and "DELETE another range"
- **AND** all internal references to "clear" SHALL be replaced with "DELETE"
