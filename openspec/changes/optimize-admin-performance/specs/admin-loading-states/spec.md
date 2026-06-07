## ADDED Requirements

### Requirement: Admin pages show loading skeletons during data fetch
The system SHALL provide loading skeleton UI components that display immediately during server-side data fetching, preventing blank-screen waits on admin pages.

#### Scenario: Loading skeleton shown during issue detail page load
- **WHEN** an admin navigates to `/admin/issues/[id]`
- **THEN** a loading skeleton SHALL appear immediately while the server component fetches data
- **AND** the skeleton SHALL visually match the page structure (header bar, content cards, notes placeholder)

#### Scenario: Loading skeleton replaced by content
- **WHEN** the server component finishes fetching data
- **THEN** the loading skeleton SHALL be replaced by the fully rendered page
- **AND** the transition SHALL be seamless with no layout shift

#### Scenario: Generic admin loading state
- **WHEN** an admin navigates to any admin page with a `loading.tsx` defined
- **THEN** the system SHALL display a loading indicator matching the admin UI style
