## ADDED Requirements

### Requirement: Checkoff item cards display live exception feedback
The checkoff form SHALL classify each item card from the current live form value and display visual feedback for missing, understocked, overstocked, and non-OK condition states while the crew member is checking the compartment or shared kit.

#### Scenario: Unchecked checkbox displays missing feedback
- **WHEN** a crew member leaves a checkbox item unchecked
- **THEN** the item card displays a `Missing` indicator with red visual treatment including a light red background and red border

#### Scenario: Quantity below par displays understocked feedback
- **WHEN** a crew member enters a quantity lower than the item's par level
- **THEN** the item card displays understocked feedback with red visual treatment including a light red background and red border

#### Scenario: Quantity at par is visually neutral
- **WHEN** a crew member enters a quantity exactly equal to the item's par level
- **THEN** the item card remains visually neutral and does not display par or helper text

#### Scenario: Quantity over par by one displays text-only feedback
- **WHEN** a crew member enters a quantity exactly one greater than the item's par level
- **THEN** the item card displays helper text in the format `Overstocked: +1` without applying amber background or amber border treatment

#### Scenario: Quantity over par by two or more displays amber feedback
- **WHEN** a crew member enters a quantity at least two greater than the item's par level
- **THEN** the item card displays helper text in the format `Overstocked: +X` and uses amber attention treatment with a pale amber background or border accent

#### Scenario: Non-OK condition displays amber feedback
- **WHEN** a crew member selects a condition status other than `OK`
- **THEN** the item card uses amber attention treatment rather than red failure treatment

#### Scenario: Feedback updates as values change
- **WHEN** a crew member changes a quantity, checkbox, or condition value while the form is open
- **THEN** the item card feedback updates immediately without requiring navigation, submit, or a separate detail view
