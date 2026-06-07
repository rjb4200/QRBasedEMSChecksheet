## MODIFIED Requirements

### Requirement: Tag colors are deterministic based on tag text
Each tag SHALL be displayed with background, text, and border colors from a fixed palette, where the same tag text always maps to the same color treatment.

#### Scenario: Same tag, same color
- **WHEN** two issues share the same tag "equipment"
- **THEN** both SHALL display the tag badge in the same background, text, and border color treatment

## ADDED Requirements

### Requirement: Issue tags use standardized pill badge styling
Issue tag badges SHALL use the unified admin badge base styling while preserving deterministic tag colors.

#### Scenario: Issue list tag uses pill and border styling
- **WHEN** an issue tag appears on the admin issue list
- **THEN** the tag SHALL use `rounded-full px-2.5 py-0.5 text-xs font-bold border` plus deterministic background, text, and border color classes

#### Scenario: Issue detail tag uses pill and border styling
- **WHEN** an issue tag appears on the issue detail page
- **THEN** the tag SHALL use `rounded-full px-2.5 py-0.5 text-xs font-bold border` plus deterministic background, text, and border color classes

#### Scenario: Recent issues tag uses pill and border styling
- **WHEN** an issue tag appears in the recent issues component
- **THEN** the tag SHALL use `rounded-full px-2.5 py-0.5 text-xs font-bold border` plus deterministic background, text, and border color classes
