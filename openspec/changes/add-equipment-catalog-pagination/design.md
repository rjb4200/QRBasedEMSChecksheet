## Context

The Equipment Catalog page currently displays all equipment items in one endless list. As the equipment catalog grows, this increases DOM size, causes visual clutter, and can create performance issues.

This change adds client-side pagination while keeping the existing data fetching, search/filter behavior, and equipment management workflows intact.

## Goals / Non-Goals

### Goals

- Replace endless scrolling with client-side pagination
- Add a page size selector
- Persist the selected page size across sessions
- Add previous/next pagination controls
- Show current page and total pages
- Reset pagination when search/filter or page size changes
- Add a clear empty state for zero results
- Add a floating "Go to Top" button
- Avoid changes to database, API, or equipment CRUD behavior

### Non-Goals

- Server-side pagination
- Database schema changes
- API changes
- Bulk equipment actions
- Changes to equipment creation, editing, or deletion
- Changes to existing search/filter logic
- New external libraries

## Decisions

### 1. Client-Side Pagination

Use client-side pagination with React state.

The existing equipment data should continue to be fetched the same way. Pagination should be applied after data is loaded and after any existing search/filter logic runs.

Expected data size is manageable client-side, so server-side pagination is unnecessary.

### 2. Page State

Add the following state to the Equipment Catalog page:

- `currentPage`
- `pageSize`

Default values:

- `currentPage = 1`
- `pageSize = 25`

Valid page size values:

- `10`
- `25`
- `50`
- `100`

If localStorage contains an invalid page size, fall back to `25`.

### 3. Page Size Persistence

Store the selected page size in localStorage.

Suggested localStorage key:

```ts
equipmentCatalogPageSize