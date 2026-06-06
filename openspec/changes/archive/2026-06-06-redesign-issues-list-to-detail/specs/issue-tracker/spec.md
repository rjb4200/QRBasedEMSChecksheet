## MODIFIED Requirements

### Requirement: Issues page displays issues as scannable rows
The Issues page at `/admin/issues` SHALL display issues as a scannable table-style list with clickable rows navigating to the detail page, instead of expandable cards.

#### Scenario: Row shows key metadata
- **WHEN** an admin views the Issues list
- **THEN** each issue row SHALL display the title, up to 2 tag badges, unit badge (if assigned), status badge (colored), and created date

#### Scenario: Row click navigates to detail
- **WHEN** an admin clicks an issue row
- **THEN** they SHALL be navigated to `/admin/issues/[id]`

#### Scenario: Create form and filters remain on list page
- **WHEN** an admin views the Issues list
- **THEN** the collapsible create-issue form, status filter tabs, filter bar (search, unit, tag), and sort dropdown SHALL remain present and functional
