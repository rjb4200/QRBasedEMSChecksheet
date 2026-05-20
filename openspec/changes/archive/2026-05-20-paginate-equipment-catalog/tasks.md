## 1. Equipment Query Pagination

- [x] 1.1 Update `src/app/admin/equipment/page.tsx` search params to accept `page` and `pageSize`
- [x] 1.2 Define supported page-size options: 25, 50, 100, and All
- [x] 1.3 Apply server-side Supabase `range()` pagination for numeric page sizes
- [x] 1.4 Request exact count for matching rows and compute total pages/current range
- [x] 1.5 Preserve stable ordering by category then name across pages
- [x] 1.6 Clamp invalid page numbers and handle empty result pages after filters/deletes

## 2. Pagination and Page Size UI

- [x] 2.1 Add range/total summary such as `Showing 1-50 of 312`
- [x] 2.2 Add accessible previous/next pagination controls
- [x] 2.3 Preserve search, category, and page size in pagination links
- [x] 2.4 Reset to page 1 when search or category filters are submitted
- [x] 2.5 Add page-size selector with 25, 50, 100, and All options
- [x] 2.6 Persist page-size selection in session storage for the current browser session
- [x] 2.7 Apply stored page-size preference when the page loads without an explicit pageSize param

## 3. Back-To-Top Control

- [x] 3.1 Create a small client component for the Equipment Catalog back-to-top button
- [x] 3.2 Show the button only after scrolling past a useful threshold
- [x] 3.3 Smoothly scroll to the top of the catalog when activated
- [x] 3.4 Ensure the control is accessible and usable on desktop and mobile layouts

## 4. Workflow Preservation

- [x] 4.1 Keep existing equipment create form behavior unchanged
- [x] 4.2 Keep existing equipment edit form behavior unchanged
- [x] 4.3 Keep existing equipment delete behavior unchanged
- [x] 4.4 Ensure add/edit/delete revalidation still refreshes the paginated catalog correctly

## 5. Verification

- [x] 5.1 Run `npm run lint` and fix any issues
- [x] 5.2 Run `npm run typecheck` and fix any issues
- [x] 5.3 Run `npm run build` and verify no build errors
- [x] 5.4 Manual test: default Equipment Catalog renders a paged list instead of the full list
- [x] 5.5 Manual test: page-size selector changes visible row count and persists for the session
- [x] 5.6 Manual test: next/previous pagination works with search and category filters
- [x] 5.7 Manual test: sorting remains stable across pages
- [x] 5.8 Manual test: All option displays all matching rows only after explicit selection
- [x] 5.9 Manual test: back-to-top appears after scrolling and works on desktop/mobile
- [x] 5.10 Manual test: create, edit, and delete equipment still work from paginated pages
