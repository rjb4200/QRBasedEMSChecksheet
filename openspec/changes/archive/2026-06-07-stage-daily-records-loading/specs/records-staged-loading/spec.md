## ADDED Requirements

### Requirement: Daily Records page renders a fast shell before heavy sections
The Daily Readiness Records page SHALL render its header and filter form without waiting for trend chart data, detailed unit record cards, or Clear Records availability.

#### Scenario: Shell renders before heavy records
- **WHEN** an admin navigates to `/admin/archives`
- **THEN** the page SHALL render the title, subtitle, and filter controls as soon as their lightweight data is available
- **AND** slower sections SHALL show section-level skeletons instead of blocking the full page

### Requirement: Daily Records sections load independently
The Daily Readiness Records page SHALL load summary counts, trend chart, unit detail cards, and export/maintenance tools in independently suspended sections.

#### Scenario: Trend chart does not block record cards
- **WHEN** the trend chart query is slower than the selected-day records query
- **THEN** the selected-day records section SHALL be able to render while the chart section still shows its skeleton

#### Scenario: Record cards do not block tools
- **WHEN** Clear Records availability is slower than unit record details
- **THEN** the unit record cards SHALL be able to render while tools still show their skeleton

### Requirement: Summary and detail use the same completion rules
Any staged or lightweight summary counts SHALL use the same official Records completion rules as the detailed unit record cards.

#### Scenario: Summary matches cards
- **WHEN** summary counts and unit record cards have both loaded for the same selected date and unit filter
- **THEN** the counts of checked, incomplete, not started, not required, and exceptions SHALL match the detailed card data

### Requirement: Section skeletons communicate staged loading
Each independently loading Records section SHALL show a section-specific skeleton that matches the final section layout.

#### Scenario: Records section skeletons match structure
- **WHEN** summary, chart, record cards, or tools are loading
- **THEN** each section SHALL show a skeleton matching its final card shape, spacing, and approximate height

### Requirement: Exports and print remain explicit actions
Staged loading SHALL NOT preload CSV, PDF, print package, or full export data during normal Records page render.

#### Scenario: Export data is deferred
- **WHEN** an admin opens `/admin/archives`
- **THEN** export and print payloads SHALL NOT be generated until the admin submits an export or print action
