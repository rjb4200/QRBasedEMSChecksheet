## ADDED Requirements

### Requirement: Admin pages show loading skeletons during data fetch
The system SHALL provide loading skeleton UI components that display immediately during server-side data fetching, preventing blank-screen waits on admin pages. Each major admin page SHALL have a page-specific `loading.tsx` skeleton that structurally mirrors the page's layout using matching card shapes, spacing, column grids, and approximate section sizes.

#### Scenario: Loading skeleton shown during issue detail page load
- **WHEN** an admin navigates to `/admin/issues/[id]`
- **THEN** a loading skeleton SHALL appear immediately while the server component fetches data
- **AND** the skeleton SHALL visually match the page structure (header bar, content cards, notes placeholder)

#### Scenario: Loading skeleton replaced by content
- **WHEN** the server component finishes fetching data
- **THEN** the loading skeleton SHALL be replaced by the fully rendered page
- **AND** the transition SHALL be seamless with no layout shift

### Requirement: Archives page has a page-specific loading skeleton
The Daily Readiness Records page at `/admin/archives` SHALL have a loading skeleton that includes placeholder sections for: title and subtitle, a chart block, a 4-field filter bar, a 2-column grid of record cards, a 5-column summary stats row, and an export bar.

#### Scenario: Archives skeleton matches page structure
- **WHEN** an admin navigates to `/admin/archives`
- **THEN** the skeleton SHALL display placeholders matching the chart, filter, record cards, summary stats, and export bar sections

### Requirement: Fleet dashboard has a page-specific loading skeleton
The Fleet Panel at `/admin` SHALL have a loading skeleton that includes placeholder sections for: title and subtitle, a fleet matrix card, a recent issues section, a comments section, and an exceptions section.

#### Scenario: Fleet dashboard skeleton matches page structure
- **WHEN** an admin navigates to `/admin`
- **THEN** the skeleton SHALL display placeholders matching the title, fleet matrix, issues, comments, and exceptions sections

### Requirement: Equipment catalog has a page-specific loading skeleton
The Equipment Catalog at `/admin/equipment` SHALL have a loading skeleton that includes placeholder sections for: title and subtitle, a filter bar, an add-item form, a pagination bar, and catalog item rows.

#### Scenario: Equipment skeleton matches page structure
- **WHEN** an admin navigates to `/admin/equipment`
- **THEN** the skeleton SHALL display placeholders matching the filter bar, add form, pagination bar, and item rows

### Requirement: Unit builder has a page-specific loading skeleton
The Unit Builder at `/admin/units/[id]` SHALL have a loading skeleton that includes placeholder sections for: a header block with title and action buttons, compartment creation forms, kit assignment forms, and compartment/kit section cards.

#### Scenario: Unit builder skeleton matches page structure
- **WHEN** an admin navigates to `/admin/units/[id]`
- **THEN** the skeleton SHALL display placeholders matching the header, forms, and compartment/kit cards

### Requirement: Kit builder has a page-specific loading skeleton
The Kit Builder at `/admin/kits/[id]` SHALL have a loading skeleton that includes placeholder sections for: a header block, a two-column layout (update form and assigned units sidebar), and an equipment section.

#### Scenario: Kit builder skeleton matches page structure
- **WHEN** an admin navigates to `/admin/kits/[id]`
- **THEN** the skeleton SHALL display placeholders matching the header, two-column layout, and equipment section

### Requirement: System log has a page-specific loading skeleton
The System Log at `/admin/system-log` SHALL have a loading skeleton that includes placeholder sections for: title and subtitle, a database usage card, a 6-field filter bar, a pagination bar, and expandable log row cards.

#### Scenario: System log skeleton matches page structure
- **WHEN** an admin navigates to `/admin/system-log`
- **THEN** the skeleton SHALL display placeholders matching the usage card, filter bar, pagination, and log rows

### Requirement: Unit and kit list pages have loading skeletons
The Units list at `/admin/units` and Kits list at `/admin/kits` SHALL have loading skeletons that include placeholder sections for header, create forms, and a grid of unit/kit cards.

#### Scenario: Units list skeleton matches page structure
- **WHEN** an admin navigates to `/admin/units`
- **THEN** the skeleton SHALL display placeholders for title, unit cards, and the create form

#### Scenario: Kits list skeleton matches page structure
- **WHEN** an admin navigates to `/admin/kits`
- **THEN** the skeleton SHALL display placeholders for title, create forms, and kit cards

### Requirement: Analytics and archive detail pages have loading skeletons
The Provider Analytics at `/admin/analytics` and Archive Detail at `/admin/archives/[id]` SHALL have loading skeletons that structurally match their respective page layouts.

#### Scenario: Analytics skeleton matches page structure
- **WHEN** an admin navigates to `/admin/analytics`
- **THEN** the skeleton SHALL display placeholders matching the filter form and provider stats grid

#### Scenario: Archive detail skeleton matches page structure
- **WHEN** an admin navigates to `/admin/archives/[id]`
- **THEN** the skeleton SHALL display placeholders matching the breadcrumb, metadata grid, and content cards

### Requirement: All admin loading skeletons use consistent visual styling
All admin loading skeletons SHALL use the same Tailwind classes as the real admin pages (`rounded-3xl`, `bg-white`, `p-4`/`p-6`, `shadow-sm`), the same `animate-pulse` effect, the same `bg-slate-200`/`bg-slate-100` placeholder colors, and the same `max-w-*` container widths as their corresponding pages.

#### Scenario: Skeleton visual consistency
- **WHEN** comparing any admin loading skeleton to its corresponding page
- **THEN** the skeleton SHALL use matching card radii, spacing, colors, and max-width containers
- **AND** all skeletons SHALL use the same subtle pulse animation
