## ADDED Requirements

### Requirement: Templates store reusable compartment layouts
The system SHALL support creating and managing templates that contain a set of compartments with items, par levels, and grid positions.

#### Scenario: View templates list
- **WHEN** admin opens the template management page
- **THEN** all templates are displayed with their name and compartment count

### Requirement: Admin can create a new template from scratch
The admin interface SHALL allow creating a new template with compartments and items defined manually.

#### Scenario: Create template from scratch
- **WHEN** admin creates a new template and adds compartments and items
- **THEN** the template is saved and available for unit creation

### Requirement: Admin can create a template by copying an existing unit
The admin interface SHALL allow creating a new template by copying the compartment layout from an existing unit.

#### Scenario: Create template from unit
- **WHEN** admin creates a template from an existing unit
- **THEN** a new template is created with all compartments and items copied from the unit

### Requirement: Admin can edit templates
The admin interface SHALL allow editing template compartments, items, par levels, and grid positions.

#### Scenario: Edit template compartment
- **WHEN** admin modifies a compartment in a template
- **THEN** the changes are saved to the template

### Requirement: Admin can delete templates
The admin interface SHALL allow deleting templates that are not referenced by any active process.

#### Scenario: Delete template
- **WHEN** admin deletes a template
- **THEN** the template is removed from the system

### Requirement: Templates do not affect existing units after copy
When a unit is created from a template, subsequent changes to the template SHALL NOT affect the unit.

#### Scenario: Template change after unit creation
- **WHEN** admin modifies a template after units were created from it
- **THEN** existing units retain their original compartment configurations

### Requirement: Templates display compartment count and item count
Each template SHALL display the total number of compartments and items it contains.

#### Scenario: Template summary displayed
- **WHEN** admin views the templates list
- **THEN** each template shows its name, compartment count, and total item count
