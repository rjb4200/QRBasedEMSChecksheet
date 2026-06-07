## ADDED Requirements

### Requirement: Issue detail page has a loading skeleton
The issue detail page route SHALL include a `loading.tsx` file that renders a skeleton UI matching the page structure while the server component fetches data.

#### Scenario: Skeleton matches page layout
- **WHEN** the loading state renders
- **THEN** it SHALL display placeholder elements corresponding to the issue header, edit form, and notes section

#### Scenario: Loading state appears during navigation
- **WHEN** an admin navigates to `/admin/issues/[id]`
- **THEN** the loading skeleton SHALL appear before the page content loads

### Requirement: Units dropdown data is cached per request
The units list used for the issue edit form's unit dropdown SHALL be fetched using a `React.cache()`-wrapped function to avoid a full table scan on every detail page load.

#### Scenario: Units cached within a request
- **WHEN** the issue detail page needs the units list for the dropdown
- **THEN** the system SHALL use a cached query that returns the same result if called multiple times within the same render pass
