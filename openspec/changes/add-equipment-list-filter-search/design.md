## Context

When adding equipment items to a compartment, admin users currently see a flat list of all available equipment from the EC5 catalog. This list can be quite long, making it difficult to find specific items without scrolling extensively.

## Goals / Non-Goals

**Goals:**
- Add category filter dropdown to filter equipment by type
- Add search input to filter equipment by name
- Implement real-time filtering as user types or selects
- Allow combining category filter with search text

**Non-Goals:**
- Adding new equipment categories (use existing categories from catalog)
- Server-side filtering (client-side is sufficient for local catalog)

## Decisions

### 1. Filter UI Placement

**Decision:** Place category dropdown and search input at the top of the equipment list, above the scrollable list.

**Rationale:** This is a standard pattern - filters at top, results below. Both controls should be visible without scrolling.

### 2. Filter Behavior

**Decision:** Use AND logic between category filter and search text. Results must match both selected category AND contain the search text.

**Rationale:** This provides the most precise filtering. User can narrow down to a specific category and then search within it.

### 3. Search Implementation

**Decision:** Case-insensitive partial match on equipment name.

**Rationale:** Users should be able to type "pump" and find "Water Pump", "Air Pump", etc. Case-insensitivity prevents missed matches.

### 4. Empty State

**Decision:** Show "No results" message when filter/search yields no matches.

**Rationale:** Clear feedback that the filter is working but no items match. Include a "Clear filters" option to reset.

## Risks / Trade-offs

- **Performance:** Client-side filtering is fast for lists up to several hundred items. The EC5 catalog is not large, so this approach works well.
- **Filter Reset:** Users may want to quickly clear filters. Mitigated by adding a clear button next to each filter.

## Migration Plan

1. Update equipment selection component UI
2. Add category dropdown with available categories
3. Add search input field
4. Implement filter logic combining category and search
5. Test with various filter combinations
6. Deploy to production

## Open Questions

- Should the category list include "All" option? (Yes - default to show all, allow filtering down)
- How to handle equipment with no category? (Show under "Uncategorized" or include in "All")