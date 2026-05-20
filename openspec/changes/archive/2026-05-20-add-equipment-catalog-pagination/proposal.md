## Why

The Equipment Catalog page becomes harder to scan as the catalog grows, and loading a long edit list at once makes navigation clumsy. Adding paged navigation with persistent page-size selection improves usability while keeping equipment management on the same page.

## What Changes

- Replace the long equipment list with a paginated equipment catalog view
- Add a page size selector with options: 25, 50, 100, and all
- Default page size to 50 items per page
- Persist the selected page size using browser session storage and reflect it in the URL
- Add previous/next pagination controls
- Show the current page number and total pages
- Show the current visible range and total item count
- Reset to page 1 when search/filter or page size changes
- Add an empty state when no items match the current search/filter
- Add a floating "Back to top" button that appears after scrolling down
- Keep existing equipment CRUD behavior and search/filter behavior intact

## Capabilities

### New Capabilities

- `equipment-pagination`: Paged Equipment Catalog view with persistent page-size selection, previous/next navigation, and back-to-top behavior.

### Modified Capabilities

- None. This adds pagination behavior without changing equipment management functionality.

## Impact

- Modified: `src/app/admin/equipment/page.tsx`
- Modified: `src/app/admin/equipment/equipment-catalog-controls.tsx`
- No database changes required
- No API changes required
- No new external libraries required
- Existing equipment create/edit/delete behavior should remain unchanged
- Existing search and filter behavior should remain unchanged
