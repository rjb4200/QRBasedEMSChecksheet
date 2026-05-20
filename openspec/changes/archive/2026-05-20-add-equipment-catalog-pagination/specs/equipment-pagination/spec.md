## ADDED Requirements

### Requirement: Default Paginated View
The Equipment Catalog page SHALL display equipment items in a paginated view by default instead of endless scroll.

- The default page size SHALL be 50 items per page.
- The initial page SHALL be page 1.
- Pagination SHALL preserve the existing equipment item sort order.

#### Scenario: Page loads with pagination
- **WHEN** the Equipment Catalog page loads
- **THEN** it SHALL display a limited number of items based on the current page size
- **AND** pagination controls SHALL be visible
- **AND** the total number of pages SHALL reflect the full dataset

---

### Requirement: Page Size Selection
The page SHALL provide a dropdown selector to choose how many items display per page.

- Valid page size options SHALL be: 25, 50, 100, and all
- The selected page size SHALL persist within the current browser session using sessionStorage
- If sessionStorage has no value or an invalid value, the page SHALL default to 50

#### Scenario: User can select page size
- **WHEN** a user clicks the page size dropdown
- **THEN** they SHALL see options: 25, 50, 100, and all

#### Scenario: Page size updates results
- **WHEN** a user selects a page size
- **THEN** the displayed items SHALL update immediately
- **AND** the current page SHALL reset to page 1

---

### Requirement: Pagination Controls
The page SHALL display pagination controls for navigating between pages.

- The page SHALL display previous and next buttons
- The page SHALL display current page number and total pages
- The "Previous" button SHALL be disabled on page 1
- The "Next" button SHALL be disabled on the last page

#### Scenario: Navigation controls present
- **WHEN** there are multiple pages of equipment
- **THEN** the page SHALL show previous/next buttons
- **AND** display the current page and total pages

#### Scenario: Navigate between pages
- **WHEN** a user clicks next or previous
- **THEN** the current page SHALL update
- **AND** the displayed items SHALL update accordingly

---

### Requirement: Pagination Data Behavior
Pagination SHALL operate on the correct dataset.

- Filtering and search SHALL be applied before pagination
- Pagination SHALL apply only to the filtered result set
- The visible result range SHALL reflect the paginated filtered dataset

#### Scenario: Filter resets pagination
- **WHEN** a user is on page 2 or higher and applies a search filter
- **THEN** the current page SHALL reset to page 1
- **AND** pagination SHALL reflect the filtered results

#### Scenario: Page reflects filtered dataset
- **WHEN** a filter is applied
- **THEN** the total pages and items SHALL reflect only the filtered results

---

### Requirement: Empty State Handling
The page SHALL handle cases where no items match the current filter.

#### Scenario: No results found
- **WHEN** no equipment items match the current search or filter
- **THEN** the page SHALL display a no-results empty state message
- **AND** pagination controls SHALL be hidden or disabled

---

### Requirement: Go To Top Button
The page SHALL provide a floating "Go to Top" button.

- The button SHALL be positioned in the bottom-right corner
- The button SHALL appear after the user scrolls well below the top of the page
- Clicking the button SHALL scroll smoothly to the top

#### Scenario: Button appears on scroll
- **WHEN** the user scrolls down past the first viewport height
- **THEN** a floating button SHALL appear

#### Scenario: Button scrolls to top
- **WHEN** the user clicks the button
- **THEN** the page SHALL scroll smoothly to the top

#### Scenario: Button hidden at top
- **WHEN** the user is at the top of the page
- **THEN** the button SHALL be hidden

---

### Requirement: Non-Regression Constraints
The implementation SHALL NOT modify existing functionality outside pagination.

- Equipment creation, editing, and deletion SHALL remain unchanged
- Search and filtering logic SHALL remain unchanged
- Database and API behavior SHALL remain unchanged
- Existing UI structure SHALL remain unchanged except for pagination additions

---

### Requirement: Implementation Constraints
The implementation SHALL follow these constraints to reduce complexity.

- Pagination SHALL be controlled by URL query params on the existing Equipment Catalog page
- The existing Equipment Catalog page and its helper controls SHALL be modified directly
- No new external libraries SHALL be introduced
- Existing equipment CRUD behavior and filtering behavior SHALL remain unchanged
