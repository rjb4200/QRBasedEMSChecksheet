## ADDED Requirements

### Requirement: Unit checkoff targets display alphabetically

The unit checkoff page SHALL display assigned compartments and kits in one combined alphabetical list by their visible display name.

#### Scenario: Compartment and kit names are mixed alphabetically

- **GIVEN** a unit has compartments and assigned kits
- **WHEN** the user opens the unit checkoff page
- **THEN** compartment and kit cards SHALL be displayed together in A-Z order by visible name
- **AND** kits SHALL NOT be grouped separately from compartments

#### Scenario: Alphabetical order ignores capitalization

- **GIVEN** target names use different capitalization
- **WHEN** the unit checkoff page renders the target cards
- **THEN** the displayed order SHALL compare names case-insensitively

### Requirement: Admin unit builder targets display alphabetically

The `/admin/units/[id]` unit builder page SHALL display assigned compartments and kits in the same combined alphabetical order by visible display name.

#### Scenario: Admin editing order matches checkoff display order

- **GIVEN** a unit has compartments and assigned kits
- **WHEN** an admin opens `/admin/units/[id]`
- **THEN** compartment edit sections and assigned kit sections SHALL be displayed together in A-Z order by visible name
- **AND** the relative display rule SHALL match the unit checkoff page

### Requirement: Alphabetical display order preserves existing target behavior

Changing the displayed order SHALL NOT change target identity, target routes, checkoff status calculation, restocking data, QR location notes, section comments, or item ordering inside each target.

#### Scenario: Target behavior is unchanged after reordering

- **GIVEN** the unit target list is displayed alphabetically
- **WHEN** the user opens a compartment or kit from the unit checkoff page
- **THEN** the app SHALL navigate to the same target-specific checkoff route as before
- **AND** the target's status color SHALL continue to reflect its current checkoff status

#### Scenario: Nested item order remains unchanged

- **GIVEN** a compartment or kit contains ordered checkoff items
- **WHEN** the unit checkoff page or admin unit builder page renders in alphabetical target order
- **THEN** item order inside that compartment or kit SHALL remain governed by the existing item/group ordering logic