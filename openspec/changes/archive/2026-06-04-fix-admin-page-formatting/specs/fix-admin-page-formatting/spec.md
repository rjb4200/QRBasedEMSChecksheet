## Requirements

### Requirement: Admin pages use consistent container width
All admin pages SHALL use `max-w-7xl` as the primary content container width.

#### Scenario: Detail pages use full width
- **WHEN** an admin opens a unit detail, kit detail, archive detail, or analytics page
- **THEN** the page content SHALL use the same `max-w-7xl` container as the Fleet Panel

### Requirement: Admin labels are removed from page headers
Admin pages SHALL NOT display a standalone "Admin" red text label at the top of the page.

#### Scenario: Page shows title without admin label
- **WHEN** an admin opens any admin page
- **THEN** the page header SHALL show the page title without a standalone "Admin" red text label
