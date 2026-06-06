## ADDED Requirements

### Requirement: Issues can be tagged with free-text labels
The system SHALL allow admins to add one or more free-text tags to an issue via a text array field, and SHALL display tags as colored badges on issues.

#### Scenario: Issue created with tags
- **WHEN** an admin creates an issue with tags ["equipment", "maintenance"]
- **THEN** the tags SHALL be stored as a lowercase text array on the issue
- **AND** the tags SHALL be displayed as colored badges on the issue

#### Scenario: Issue updated with tags
- **WHEN** an admin updates an issue's tags via the PUT endpoint
- **THEN** the new tags SHALL replace the existing tags entirely

#### Scenario: Issue with no tags
- **WHEN** an issue has an empty or null tags array
- **THEN** no tag badges SHALL be displayed

#### Scenario: Tags appear in escalation form
- **WHEN** an admin escalates a comment to an issue via the Fleet panel
- **THEN** the escalation form SHALL NOT pre-fill tags (tags are added on the Issues page)

### Requirement: Tag colors are deterministic based on tag text
Each tag SHALL be displayed with a background color from a fixed palette, where the same tag text always maps to the same color.

#### Scenario: Same tag, same color
- **WHEN** two issues share the same tag "equipment"
- **THEN** both SHALL display the tag badge in the same color

### Requirement: Tags are normalized on save
Tags SHALL be trimmed and lowercased on save to prevent case-sensitive duplicates.

#### Scenario: Tags normalized
- **WHEN** an admin submits tags "  Equipment  " and "SAFETY"
- **THEN** the stored tags SHALL be ["equipment", "safety"]
