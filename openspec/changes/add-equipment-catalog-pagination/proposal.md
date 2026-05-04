## Why

The Equipment Catalog page currently loads all equipment items in an endless scroll, which causes performance lag when many items exist and makes the page look cluttered. Adding pagination with configurable page size will improve performance and provide a cleaner user experience.

## What Changes

- Replace endless scroll with paginated view showing configurable number of items per page
- Add page size selector dropdown (options: 10, 25, 50, 100 items per page)
- Add pagination controls (previous/next buttons, page numbers)
- Add floating "Go to Top" button that appears when user scrolls down
- Persist user's page size preference in localStorage

## Capabilities

### New Capabilities

- `equipment-pagination`: Paged view for Equipment Catalog with configurable items per page and scroll-to-top button.

### Modified Capabilities

- None. This adds a new capability without modifying existing functionality.

## Impact

- Modified: `src/app/admin/equipment/page.tsx` (or Equipment Catalog page)
- No database changes required
- Improves performance and UX for equipment management