
## `tasks.md`

```md
## 1. Add Pagination State

- [ ] 1.1 Open the existing Equipment Catalog page component
- [ ] 1.2 Add `currentPage` state with default value `1`
- [ ] 1.3 Add `pageSize` state with default value `25`
- [ ] 1.4 Define valid page size options: `10`, `25`, `50`, `100`
- [ ] 1.5 Do not change existing data fetching logic

## 2. Add Page Size Persistence

- [ ] 2.1 On component mount, read saved page size from localStorage
- [ ] 2.2 Use localStorage key `equipmentCatalogPageSize`
- [ ] 2.3 Validate saved value against `10`, `25`, `50`, `100`
- [ ] 2.4 If saved value is valid, set `pageSize` to saved value
- [ ] 2.5 If saved value is missing or invalid, use `25`
- [ ] 2.6 When user changes page size, save the new value to localStorage
- [ ] 2.7 When user changes page size, reset `currentPage` to `1`

## 3. Apply Filtering Before Pagination

- [ ] 3.1 Keep existing search/filter logic unchanged
- [ ] 3.2 Store the result of existing search/filter logic as `filteredItems`
- [ ] 3.3 Apply pagination to `filteredItems`, not the full unfiltered list
- [ ] 3.4 Ensure search/filter changes reset `currentPage` to `1`

## 4. Calculate Pagination Values

- [ ] 4.1 Calculate `totalItems` from `filteredItems.length`
- [ ] 4.2 Calculate `totalPages` using `Math.ceil(totalItems / pageSize)`
- [ ] 4.3 Calculate `startIndex` using `(currentPage - 1) * pageSize`
- [ ] 4.4 Calculate `endIndex` using `startIndex + pageSize`
- [ ] 4.5 Create `paginatedItems` using `filteredItems.slice(startIndex, endIndex)`
- [ ] 4.6 Replace full list rendering with `paginatedItems`

## 5. Add Page Size Selector

- [ ] 5.1 Add dropdown above the equipment list
- [ ] 5.2 Dropdown options shall be 10, 25, 50, 100
- [ ] 5.3 Current selected value shall match `pageSize`
- [ ] 5.4 On change, update `pageSize`
- [ ] 5.5 On change, save value to localStorage
- [ ] 5.6 On change, reset `currentPage` to `1`
- [ ] 5.7 Do not add new external libraries

## 6. Add Pagination Controls

- [ ] 6.1 Add controls below the equipment list
- [ ] 6.2 Add Previous button
- [ ] 6.3 Add Next button
- [ ] 6.4 Add text showing current page and total pages, such as `Page 1 of 5`
- [ ] 6.5 Disable Previous button when `currentPage === 1`
- [ ] 6.6 Disable Next button when `currentPage >= totalPages`
- [ ] 6.7 Previous button shall decrement `currentPage` by 1
- [ ] 6.8 Next button shall increment `currentPage` by 1
- [ ] 6.9 Hide or disable controls when there are zero filtered items

## 7. Add Empty State

- [ ] 7.1 Detect when `filteredItems.length === 0`
- [ ] 7.2 Display `No equipment items found`
- [ ] 7.3 Do not render equipment item cards/rows when there are zero filtered items
- [ ] 7.4 Hide or disable pagination controls when there are zero filtered items

## 8. Add Go To Top Button

- [ ] 8.1 Add state to track whether Go to Top button is visible
- [ ] 8.2 Add scroll listener in `useEffect`
- [ ] 8.3 Show button when `window.scrollY > window.innerHeight`
- [ ] 8.4 Hide button when `window.scrollY <= window.innerHeight`
- [ ] 8.5 Clean up scroll listener on unmount
- [ ] 8.6 Position button fixed in bottom-right corner
- [ ] 8.7 On click, call `window.scrollTo({ top: 0, behavior: "smooth" })`
- [ ] 8.8 Style button to match existing admin UI

## 9. Preserve Existing Behavior

- [ ] 9.1 Do not change equipment creation behavior
- [ ] 9.2 Do not change equipment editing behavior
- [ ] 9.3 Do not change equipment deletion behavior
- [ ] 9.4 Do not change database code
- [ ] 9.5 Do not change API routes
- [ ] 9.6 Do not change authentication or permissions
- [ ] 9.7 Do not change existing modal behavior
- [ ] 9.8 Do not introduce new dependencies

## 10. Test and Validate

- [ ] 10.1 Test initial load defaults to page 1 and 25 items per page
- [ ] 10.2 Test page size options 10, 25, 50, 100
- [ ] 10.3 Test page size persists after reload
- [ ] 10.4 Test invalid localStorage value falls back to 25
- [ ] 10.5 Test Previous button disabled on first page
- [ ] 10.6 Test Next button disabled on last page
- [ ] 10.7 Test clicking Previous and Next updates displayed items
- [ ] 10.8 Test search/filter resets to page 1
- [ ] 10.9 Test pagination applies to filtered results
- [ ] 10.10 Test empty state displays when no results match
- [ ] 10.11 Test Go to Top button appears after scrolling down
- [ ] 10.12 Test Go to Top button hides at top
- [ ] 10.13 Test Go to Top button scrolls smoothly to top
- [ ] 10.14 Run lint
- [ ] 10.15 Run typecheck