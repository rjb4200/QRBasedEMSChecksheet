## ADDED Requirements

### Requirement: Admin action buttons use standard icon set
Admin interface action buttons for edit, delete, save, cancel, QR codes, and filter SHALL use the standard icon components from `src/components/icons.tsx` with accessible labels and tooltips.

#### Scenario: Row-level actions use icons
- **WHEN** an admin page renders repeated row-level action buttons
- **THEN** edit buttons SHALL use `IconEdit`, delete buttons SHALL use `IconTrash`, and save buttons SHALL use `IconSave` with red background styling
