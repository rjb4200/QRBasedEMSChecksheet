## Why

The Equipment Catalog page currently loads all equipment items in an endless scroll, which causes performance lag when many items exist and makes the page harder to use. Adding client-side pagination with configurable page size will improve performance and provide a cleaner user experience.

## What Changes

- Replace endless scroll with a paginated equipment list
- Add a page size selector with options: 10, 25, 50, 100
- Default page size to 25 items per page
- Persist the selected page size using localStorage
- Add previous/next pagination controls
- Show the current page number and total pages
- Reset to page 1 when search/filter or page size changes
- Add an empty state when no items match the current search/filter
- Add a floating "Go to Top" button that appears after scrolling down
- Keep pagination fully client-side

## Capabilities

### New Capabilities

- `equipment-pagination`: Paged view for Equipment Catalog with configurable items per page and scroll-to-top behavior.

### Modified Capabilities

- None. This adds pagination behavior without changing equipment management functionality.

## Impact

- Modified: `src/app/admin/equipment/page.tsx` or the existing Equipment Catalog page component
- No database changes required
- No API changes required
- No new external libraries required
- Existing equipment create/edit/delete behavior should remain unchanged
- Existing search and filter behavior should remain unchanged