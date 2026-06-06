## ADDED Requirements

### Requirement: Fleet dashboard shows open issues summary
The Fleet dashboard SHALL display a summary card showing the 3 most recent open or in-progress issues, with title, tags, unit, status, and links to the detail page.

#### Scenario: Issues visible on Fleet dashboard
- **WHEN** an admin views the Fleet dashboard and issues exist with status open or in_progress
- **THEN** an "Open Issues" card SHALL appear showing up to 3 recent issues with title, tags, unit badge, and status badge

#### Scenario: No active issues
- **WHEN** no open or in_progress issues exist
- **THEN** an "Open Issues" card SHALL appear stating "No open issues" with a link to the Issues page

#### Scenario: View all link
- **WHEN** the Open Issues card is displayed
- **THEN** a "View all" link SHALL navigate to `/admin/issues`

### Requirement: Exceptions default to 4 days and collapsed
The Exceptions section on the Fleet dashboard SHALL default to a 4-day range and SHALL start collapsed.

#### Scenario: Exceptions collapsed by default
- **WHEN** an admin first loads the Fleet dashboard
- **THEN** the Exceptions section SHALL be collapsed showing only the section header

#### Scenario: 4-day default range
- **WHEN** the Fleet dashboard loads without date parameters
- **THEN** the Exceptions section SHALL show discrepancies from the last 4 days
