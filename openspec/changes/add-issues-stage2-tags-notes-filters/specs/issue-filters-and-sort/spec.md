## ADDED Requirements

### Requirement: Issues page provides a filter bar
The system SHALL display a filter bar above the issue list with dropdowns for unit, tag, and a free-text search input, all applying client-side filtering.

#### Scenario: Filter by unit
- **WHEN** an admin selects a unit from the unit dropdown
- **THEN** only issues associated with that unit SHALL be displayed

#### Scenario: Filter by tag
- **WHEN** an admin selects a tag from the tag dropdown
- **THEN** only issues containing that tag SHALL be displayed

#### Scenario: Text search
- **WHEN** an admin types in the search input
- **THEN** only issues whose title or description contains the search text (case-insensitive) SHALL be displayed

#### Scenario: Combined filters
- **WHEN** an admin applies a unit filter, a tag filter, and a search query simultaneously
- **THEN** only issues matching ALL criteria SHALL be displayed

#### Scenario: Clear filters
- **WHEN** the search input is empty, unit dropdown is on "All units", and tag dropdown is on "All tags"
- **THEN** all issues matching the current status tab SHALL be displayed

### Requirement: Tag dropdown is dynamically populated
The tag filter dropdown SHALL contain all unique tags from the currently loaded issues.

#### Scenario: Tag dropdown shows available tags
- **WHEN** issues have tags ["equipment", "safety", "maintenance"]
- **THEN** the tag dropdown SHALL list "equipment", "maintenance", "safety" as options

### Requirement: Issues page provides sort options
The system SHALL provide a sort dropdown with options for newest first, oldest first, recently updated, and title A-Z.

#### Scenario: Default sort is newest first
- **WHEN** the Issues page loads
- **THEN** issues SHALL be sorted by `created_at` descending

#### Scenario: Sort by oldest first
- **WHEN** an admin selects "Oldest first"
- **THEN** issues SHALL be sorted by `created_at` ascending

#### Scenario: Sort by recently updated
- **WHEN** an admin selects "Recently updated"
- **THEN** issues SHALL be sorted by `updated_at` descending

#### Scenario: Sort by title
- **WHEN** an admin selects "Title A-Z"
- **THEN** issues SHALL be sorted alphabetically by title (case-insensitive)

### Requirement: Filters and sort work together with status tabs
The filter bar and sort dropdown SHALL operate within the current status tab selection.

#### Scenario: Combined filter, sort, and status
- **WHEN** an admin is on the "Active" tab, has a tag filter applied, and has "Oldest first" sort selected
- **THEN** only active issues with that tag SHALL be displayed, sorted oldest first
