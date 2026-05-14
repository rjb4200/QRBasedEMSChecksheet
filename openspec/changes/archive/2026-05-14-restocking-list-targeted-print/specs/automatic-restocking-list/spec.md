## MODIFIED Requirements

### Requirement: Restocking List includes Print and Copy actions when expanded
The Restocking List section SHALL include a Print button and a Copy-to-clipboard button, and both buttons SHALL be visible only when the section is expanded.

#### Scenario: Restocking List is collapsed
- **WHEN** the Restocking List is in its default collapsed state
- **THEN** Print and Copy buttons SHALL NOT be visible

#### Scenario: Restocking List is expanded
- **WHEN** the Restocking List is expanded
- **THEN** a Print button and a Copy button SHALL be visible near the top of the expanded content

#### Scenario: User clicks Print
- **WHEN** a user clicks the Print button inside the expanded Restocking List
- **THEN** a new window SHALL open containing only the restocking checklist content
- **AND** the browser print dialog SHALL open for that checklist window
- **AND** the full unit page SHALL NOT be printed

#### Scenario: User clicks Copy
- **WHEN** a user clicks the Copy button inside the expanded Restocking List
- **THEN** the Restocking List text SHALL be copied to the system clipboard
