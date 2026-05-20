## Context

The Equipment Catalog page currently renders a large editable list that becomes harder to navigate as the catalog grows. The implemented solution keeps the existing server-rendered admin page model, but constrains the visible list using query-param-driven pagination and lightweight client controls.

## Goals / Non-Goals

### Goals

- Replace the long catalog list with paginated navigation
- Add a page size selector
- Persist the selected page size across the current browser session
- Add previous/next pagination controls
- Show current page, total pages, and visible range counts
- Reset pagination when search/filter or page size changes
- Add a clear empty state for zero results
- Add a floating "Back to top" button
- Avoid changes to database, API, or equipment CRUD behavior

### Non-Goals

- Full client-side pagination state
- Database schema changes
- API changes
- Bulk equipment actions
- Changes to equipment creation, editing, or deletion
- Changes to existing search/filter logic
- New external libraries

## Decisions

### 1. Query-Param Pagination

Use query params (`page`, `pageSize`, plus existing filters) as the canonical pagination state. The server component reads those values, calculates the filtered count, and fetches only the visible range unless `pageSize=all`.

### 2. Page Size Defaults And Options

Default to `50` items per page.

Valid page size values:

- `25`
- `50`
- `100`
- `all`

Invalid values fall back to `50`.

### 3. Session-Storage Persistence

Persist the selected page size in `sessionStorage` using the key `equipmentCatalogPageSize`.

When the page loads without a `pageSize` query param, the client control restores the stored value into the URL and resets paging back to page 1.

### 4. Lightweight Client Controls

Keep the main equipment page server-rendered. Use a small client helper for page-size selection and the Back to top button.

This keeps pagination state simple while avoiding broad refactors of the admin equipment page.
