## MODIFIED Requirements

### Requirement: Filter equipment by category
The system SHALL allow users to filter the equipment list by category using a dropdown selector, and filtered results SHALL remain paginated using the selected page size.

#### Scenario: Filter by category
- **WHEN** a user selects a category from the dropdown
- **THEN** only equipment items belonging to that category SHALL be displayed
- **AND** the displayed results SHALL start on the first page of filtered results

#### Scenario: Show all categories
- **WHEN** a user selects "All" or clears the category filter
- **THEN** all equipment items SHALL be eligible for display
- **AND** the displayed results SHALL remain limited by the selected page size unless "All" page size is selected

### Requirement: Search equipment by name
The system SHALL allow users to search for equipment by typing in a search input field, and search results SHALL remain paginated using the selected page size.

#### Scenario: Search with partial match
- **WHEN** a user types text in the search field
- **THEN** equipment items containing that text in their name SHALL be eligible for display
- **AND** the search SHALL be case-insensitive
- **AND** the displayed results SHALL start on the first page of search results

#### Scenario: Search no results
- **WHEN** a user searches for text that matches no equipment names
- **THEN** a "No results" message SHALL be displayed

### Requirement: Combined filter and search
The system SHALL allow using both category filter and search text together, and combined results SHALL remain paginated using the selected page size.

#### Scenario: Filter and search combined
- **WHEN** a user selects a category and enters search text
- **THEN** only equipment items matching BOTH the selected category AND the search text SHALL be eligible for display
- **AND** the displayed results SHALL start on the first page of combined results

### Requirement: Clear filters
The system SHALL provide a way to clear filters and reset the view.

#### Scenario: Clear filters
- **WHEN** a user clicks the clear/reset button
- **THEN** the category dropdown SHALL reset to "All"
- **AND** the search input SHALL be cleared
- **AND** all equipment items SHALL be eligible for display
- **AND** the displayed results SHALL start on the first page

## ADDED Requirements

### Requirement: Equipment catalog uses paged results by default
The system SHALL display the admin Equipment Catalog as paged results by default instead of rendering the full catalog list.

#### Scenario: Default catalog load
- **WHEN** an admin opens the Equipment Catalog without selecting a page size
- **THEN** the system SHALL display only the default page of equipment items
- **AND** the system SHALL NOT render every matching catalog item at once

#### Scenario: Stable ordering across pages
- **WHEN** an admin moves between Equipment Catalog pages
- **THEN** items SHALL remain sorted consistently by category and name

### Requirement: Admin can choose equipment page size
The system SHALL allow admins to choose how many Equipment Catalog items are displayed per page.

#### Scenario: Select page size
- **WHEN** an admin selects a page size such as 25, 50, or 100
- **THEN** the Equipment Catalog SHALL display no more than that many matching items on the current page
- **AND** pagination SHALL restart at page 1

#### Scenario: Select all page size
- **WHEN** an admin selects "All"
- **THEN** the Equipment Catalog SHALL display all matching items
- **AND** the selection SHALL be an explicit opt-in rather than the default behavior

#### Scenario: Page size persists during session
- **WHEN** an admin chooses a page size
- **THEN** that page-size preference SHALL persist for the current browser session

### Requirement: Equipment catalog pagination controls are available
The system SHALL provide accessible pagination controls for navigating Equipment Catalog result pages.

#### Scenario: Navigate to next page
- **WHEN** an admin clicks the next-page control
- **THEN** the Equipment Catalog SHALL display the next page of matching items
- **AND** current search, category, and page-size selections SHALL be preserved

#### Scenario: Navigate to previous page
- **WHEN** an admin clicks the previous-page control
- **THEN** the Equipment Catalog SHALL display the previous page of matching items
- **AND** current search, category, and page-size selections SHALL be preserved

#### Scenario: Show current range and total
- **WHEN** matching equipment items are displayed
- **THEN** the system SHALL show the current visible range and total matching count

### Requirement: Back-to-top control appears on long Equipment Catalog pages
The system SHALL provide a back-to-top control on the Equipment Catalog that appears only after the admin scrolls far enough for it to be useful.

#### Scenario: Back-to-top appears after scrolling
- **WHEN** an admin scrolls down beyond the configured threshold on the Equipment Catalog page
- **THEN** the back-to-top control SHALL become visible

#### Scenario: Back-to-top returns to catalog top
- **WHEN** an admin activates the back-to-top control
- **THEN** the page SHALL smoothly scroll back to the top of the Equipment Catalog

#### Scenario: Back-to-top works on mobile
- **WHEN** an admin uses the Equipment Catalog on a mobile layout
- **THEN** the back-to-top control SHALL remain accessible and usable

### Requirement: Equipment edit workflows remain unchanged
The system SHALL preserve existing Equipment Catalog create, edit, and delete workflows while adding pagination.

#### Scenario: Create equipment while paginated
- **WHEN** an admin creates a new equipment item from the paginated Equipment Catalog
- **THEN** the item SHALL be saved using the existing create workflow

#### Scenario: Edit equipment while paginated
- **WHEN** an admin edits an equipment item on a paginated result page
- **THEN** the item SHALL be saved using the existing edit workflow

#### Scenario: Delete equipment while paginated
- **WHEN** an admin deletes an equipment item on a paginated result page
- **THEN** the item SHALL be deleted using the existing delete workflow
