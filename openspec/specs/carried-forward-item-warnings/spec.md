## Requirements

### Requirement: Carried-forward warnings only apply to carried-forward values
The system SHALL show carried-forward item warnings only for item values populated from prior check data.

#### Scenario: Item has current-day data
- **WHEN** an item value was entered or verified during the current check
- **THEN** the item SHALL NOT show a carried-forward warning

#### Scenario: Item has normal default value
- **WHEN** an item value is not from prior check data
- **THEN** the item SHALL NOT show a carried-forward warning

### Requirement: Quantity carried-forward warnings identify below-par or missing values
The system SHALL visually flag carried-forward quantity items only when they are below par or missing.

#### Scenario: Quantity carried forward meets par
- **WHEN** a carried-forward quantity value is greater than or equal to its par level
- **THEN** the item SHALL render without a warning

#### Scenario: Quantity carried forward below par
- **WHEN** a carried-forward quantity value is below its par level
- **THEN** the par label SHALL use red warning styling
- **AND** the whole row SHALL NOT require strong warning styling solely because it is below par

#### Scenario: Quantity carried forward missing
- **WHEN** a carried-forward quantity value is missing or null
- **THEN** the item SHALL show red par or missing styling
- **AND** the item MAY use a subtle red row/card outline

#### Scenario: Quantity has no par level
- **WHEN** a carried-forward quantity item has no par level
- **THEN** the item SHALL NOT show a below-par warning
- **AND** the item SHALL only warn if the carried-forward value is missing or null

### Requirement: Checkbox carried-forward warnings identify unchecked values
The system SHALL visually flag carried-forward checkbox items only when they are unchecked or missing.

#### Scenario: Checkbox carried forward checked
- **WHEN** a carried-forward checkbox value is checked
- **THEN** the checkbox item SHALL render without a warning

#### Scenario: Checkbox carried forward unchecked
- **WHEN** a carried-forward checkbox value is unchecked
- **THEN** the checkbox item SHALL show red warning styling
- **AND** the item SHALL include a compact `Needs Check` label or equivalent

#### Scenario: Checkbox carried forward missing
- **WHEN** a carried-forward checkbox value is missing or null
- **THEN** the checkbox item SHALL show red warning styling
- **AND** the item SHALL include a compact `Needs Check` label or equivalent

### Requirement: Condition carried-forward warnings identify non-OK values
The system SHALL visually flag carried-forward condition items only when they are missing or not `OK`.

#### Scenario: Condition carried forward OK
- **WHEN** a carried-forward condition value has status `OK`
- **THEN** the condition item SHALL render without a warning

#### Scenario: Condition carried forward not OK
- **WHEN** a carried-forward condition value has a status other than `OK`
- **THEN** the condition item SHALL show red warning styling
- **AND** the item SHALL include a compact `Needs Check` label or equivalent

#### Scenario: Condition carried forward missing
- **WHEN** a carried-forward condition value is missing or null
- **THEN** the condition item SHALL show red warning styling
- **AND** the item SHALL include a compact `Missing` or `Needs Check` label

### Requirement: Warning styling remains compact and operational
The system SHALL use compact warning labels and subtle red styling that does not create alert fatigue.

#### Scenario: Warning is displayed
- **WHEN** an item needs carried-forward attention
- **THEN** the UI SHALL use short labels such as `Par 4`, `Missing`, or `Needs Check`
- **AND** the styling SHALL be visually consistent with existing compact operational badges

#### Scenario: Carried-forward value is normal
- **WHEN** a carried-forward item does not need attention
- **THEN** the UI SHALL NOT display a carried-forward warning label or red warning styling
