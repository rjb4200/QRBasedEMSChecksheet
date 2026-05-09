## ADDED Requirements

### Requirement: Filter equipment by category
The system SHALL allow users to filter the equipment list by category using a dropdown selector.

#### Scenario: Filter by category
- **WHEN** a user selects a category from the dropdown
- **THEN** only equipment items belonging to that category SHALL be displayed

#### Scenario: Show all categories
- **WHEN** a user selects "All" or clears the category filter
- **THEN** all equipment items SHALL be displayed

### Requirement: Search equipment by name
The system SHALL allow users to search for equipment by typing in a search input field.

#### Scenario: Search with partial match
- **WHEN** a user types text in the search field
- **THEN** equipment items containing that text in their name SHALL be displayed
- **AND** the search SHALL be case-insensitive

#### Scenario: Search no results
- **WHEN** a user searches for text that matches no equipment names
- **THEN** a "No results" message SHALL be displayed

### Requirement: Combined filter and search
The system SHALL allow using both category filter and search text together.

#### Scenario: Filter and search combined
- **WHEN** a user selects a category and enters search text
- **THEN** only equipment items matching BOTH the selected category AND the search text SHALL be displayed

### Requirement: Clear filters
The system SHALL provide a way to clear filters and reset the view.

#### Scenario: Clear filters
- **WHEN** a user clicks the clear/reset button
- **THEN** the category dropdown SHALL reset to "All"
- **AND** the search input SHALL be cleared
- **AND** all equipment items SHALL be displayed