## ADDED Requirements

### Requirement: Default Paginated View
The Equipment Catalog page SHALL display equipment items in a paginated view by default instead of endless scroll.

#### Scenario: Page loads with pagination
- **WHEN** the Equipment Catalog page loads
- **THEN** it SHALL display a limited number of items with pagination controls visible

### Requirement: Page Size Selection
The page SHALL provide a dropdown selector to choose how many items display per page.

#### Scenario: User can select page size
- **WHEN** a user clicks the page size dropdown
- **THEN** they SHALL see options: 10, 25, 50, 100 items per page
- **AND** selecting an option SHALL update the displayed items immediately

### Requirement: Pagination Controls
The page SHALL display pagination controls for navigating between pages.

#### Scenario: Navigation controls present
- **WHEN** there are multiple pages of equipment
- **THEN** the page SHALL show previous/next buttons
- **AND** the page SHALL display current page number and total pages

### Requirement: Go To Top Button
The page SHALL show a floating "Go to Top" button when the user scrolls down.

#### Scenario: Button appears on scroll
- **WHEN** the user scrolls down past the first viewport height
- **THEN** a floating button SHALL appear in the bottom-right corner
- **AND** clicking the button SHALL scroll smoothly to the top of the list

### Requirement: Go To Top Button Hidden at Top
The "Go to Top" button SHALL be hidden when the user is at the top of the page.

#### Scenario: Button hidden at top
- **WHEN** the user scrolls to the very top of the equipment list
- **THEN** the "Go to Top" button SHALL be hidden

### Requirement: Page Size Preference Persistence
The selected page size SHALL be saved to localStorage and restored on page reload.

#### Scenario: Preference persists across sessions
- **WHEN** a user selects a page size and reloads the page
- **THEN** the page SHALL display the previously selected number of items per page

### Requirement: Pagination Resets on Filter Change
When the user applies a search filter, pagination SHALL reset to page 1.

#### Scenario: Filter resets pagination
- **WHEN** a user is on page 2 or higher and applies a search filter
- **THEN** the displayed items SHALL reset to page 1