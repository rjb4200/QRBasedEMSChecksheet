## 1. Pagination Query Parameters

- [x] 1.1 Add search params for `page` and `pageSize` to the equipment catalog page
- [x] 1.2 Parse and validate page numbers server-side
- [x] 1.3 Parse and validate page-size values server-side
- [x] 1.4 Support page sizes `25`, `50`, `100`, and `all`
- [x] 1.5 Keep existing search and category filtering behavior intact

## 2. Server-Rendered Pagination

- [x] 2.1 Keep filtering applied before pagination
- [x] 2.2 Count the filtered dataset to calculate total pages
- [x] 2.3 Fetch only the visible page range when page size is numeric
- [x] 2.4 Treat `all` as a single-page unpaginated view
- [x] 2.5 Preserve existing category/name sort order
- [x] 2.6 Render the paginated equipment list from the server query results

## 3. Pagination UI

- [x] 3.1 Add a page-size selector to the equipment catalog controls
- [x] 3.2 Add previous and next page navigation controls
- [x] 3.3 Show current page and total pages
- [x] 3.4 Disable or visually mute Previous on the first page
- [x] 3.5 Disable or visually mute Next on the last page
- [x] 3.6 Show the current visible result range and total item count
- [x] 3.7 Reset back to page 1 when page size changes
- [x] 3.8 Reset back to page 1 when filters change

## 4. Page Size Persistence

- [x] 4.1 Persist page size in browser session storage
- [x] 4.2 Use `equipmentCatalogPageSize` as the storage key
- [x] 4.3 Restore stored page size into the URL when no `pageSize` query param is present
- [x] 4.4 Ignore missing stored values and fall back to the default page size

## 5. Empty State And Back To Top

- [x] 5.1 Show an empty state when no filtered equipment items are returned
- [x] 5.2 Keep pagination controls non-interactive when there are no additional pages
- [x] 5.3 Add a floating Back to top button in the lower-right corner
- [x] 5.4 Show the Back to top button after the user scrolls down
- [x] 5.5 Smooth-scroll back to the top when clicked

## 6. Non-Regression And Verification

- [x] 6.1 Preserve equipment creation behavior
- [x] 6.2 Preserve equipment editing behavior
- [x] 6.3 Preserve equipment deletion behavior
- [x] 6.4 Avoid database schema changes
- [x] 6.5 Avoid API changes for equipment catalog management
- [x] 6.6 Avoid new pagination libraries
- [x] 6.7 Run `npm run lint`
- [x] 6.8 Run `npm run typecheck`
