## Why

The Equipment Catalog currently renders the full matching list at once, which can become laggy and visually cluttered as the catalog grows. A paged default view will make the page cleaner, reduce rendering work, and help admins navigate large equipment lists more predictably.

## What Changes

- Update the admin Equipment Catalog to use pagination by default instead of rendering every matching item.
- Add a page-size selector with options such as 25, 50, 100, and All when safe.
- Preserve search and category filtering while paging through results.
- Keep sorting stable across pages by category then item name.
- Show total count and current visible range, such as "Showing 1-50 of 312".
- Persist page-size preference during the current browser session.
- Add an accessible back-to-top button that appears after scrolling and smoothly returns to the top of the catalog.
- Keep existing equipment create, edit, and delete workflows unchanged.

## Capabilities

### New Capabilities
<!-- None. -->

### Modified Capabilities
- `equipment-list-filtering`: Equipment list search/filter behavior will include paged results, selectable page size, stable sorting, and back-to-top navigation.

## Impact

- **UI**: `src/app/admin/equipment/page.tsx` and likely a small client component for page-size persistence/back-to-top behavior.
- **Data access**: Equipment catalog query should use server/query-level pagination for normal page sizes and only fetch all rows when the "All" option is explicitly selected and considered safe.
- **Routing/state**: URL search params will include page and page-size state so pagination works with search and category filters.
- **Workflows**: Existing add/edit/delete actions remain unchanged.
