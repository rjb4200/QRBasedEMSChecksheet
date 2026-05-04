## 1. Add Pagination State Management

- [ ] 1.1 Add page number state variable to Equipment Catalog page component
- [ ] 1.2 Add page size state variable with default of 25
- [ ] 1.3 Add total items count from fetched equipment data
- [ ] 1.4 Calculate total pages based on page size and total items

## 2. Implement Page Size Selector

- [ ] 2.1 Create page size dropdown component with options (10, 25, 50, 100)
- [ ] 2.2 Add localStorage integration to save/load preference
- [ ] 2.3 Style dropdown using Tailwind to match admin UI (red primary theme)
- [ ] 2.4 Place selector above the equipment list

## 3. Implement Pagination Controls

- [ ] 3.1 Create previous/next button components
- [ ] 3.2 Add page number display (e.g., "Page 1 of 5")
- [ ] 3.3 Disable previous button on first page
- [ ] 3.4 Disable next button on last page
- [ ] 3.5 Add click handlers to update page number

## 4. Slice Equipment Data for Current Page

- [ ] 4.1 Calculate start and end indices based on page number and page size
- [ ] 4.2 Use array slice to get current page items
- [ ] 4.3 Replace full list render with sliced list

## 5. Add Go To Top Button

- [ ] 5.1 Create floating button component positioned bottom-right
- [ ] 5.2 Add scroll detection using useEffect and scroll event listener
- [ ] 5.3 Show button only when scrollY > viewport height
- [ ] 5.4 Add smooth scroll to top on click
- [ ] 5.5 Style with red primary color to match admin theme

## 6. Handle Filter/Search Interaction

- [ ] 6.1 Add effect to reset page to 1 when search filter changes
- [ ] 6.2 Ensure filtered results respect current page size

## 7. Test and Validate

- [ ] 7.1 Test pagination with different page sizes
- [ ] 7.2 Verify go-to-top button visibility conditions
- [ ] 7.3 Test localStorage persistence
- [ ] 7.4 Run lint and typecheck
- [ ] 7.5 Verify existing search/filter still works with pagination