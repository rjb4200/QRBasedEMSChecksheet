## ADDED Requirements

### Requirement: Admin can export unit layout
The system SHALL allow admin users to export a unit's complete layout as a JSON file.

#### Scenario: Export unit layout
- **WHEN** an admin clicks the export button on a unit
- **THEN** a JSON file SHALL be downloaded containing the unit's full layout
- **AND** the file SHALL include all compartments, items, par levels, subcategories, and ordering

#### Scenario: Export includes correct data
- **WHEN** exporting a unit with multiple compartments, items, and subcategories
- **THEN** the exported JSON SHALL contain all compartment names and positions
- **AND** all equipment items with their par values and positions
- **AND** all subcategories with their names and positions
- **AND** item-to-subcategory assignments

#### Scenario: Export file is valid JSON
- **WHEN** an admin exports a unit layout
- **THEN** the downloaded file SHALL be valid, parseable JSON