## ADDED Requirements

### Requirement: Admin can alphabetize unit checkoff targets
The unit builder SHALL provide a one-click action that rewrites the mixed ordering of a unit's compartments and assigned kits by visible target name using existing persisted `sort_order` fields.

#### Scenario: Alphabetize mixed compartments and kits
- **WHEN** an admin runs the alphabetize action for a unit
- **THEN** the system SHALL sort that unit's compartments and assigned kits together by visible name in case-insensitive A-Z order
- **AND** assigned kits SHALL NOT be grouped separately from compartments
- **AND** the system SHALL persist the resulting order to `unit_compartments.sort_order` and `unit_kits.sort_order`
- **AND** unit checkoff and admin unit builder displays SHALL continue to use the persisted sort order

#### Scenario: Preserve target internals while alphabetizing
- **WHEN** an admin runs the alphabetize action for a unit
- **THEN** the system SHALL NOT change equipment item ordering inside compartments
- **AND** the system SHALL NOT change kit item ordering inside assigned kits
- **AND** the system SHALL NOT change QR location notes, section comments, checkoff statuses, or restocking item data
