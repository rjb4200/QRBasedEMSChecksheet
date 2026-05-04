## Context

The Equipment Catalog page in the admin panel displays all equipment items in a single list with infinite scroll. As the equipment catalog grows, this causes performance degradation and a cluttered UI. Users need a more manageable way to view and navigate through equipment items.

## Goals / Non-Goals

**Goals:**
- Replace infinite scroll with pagination controls
- Allow users to select page size (10, 25, 50, 100)
- Add scroll-to-top button for long pages
- Persist page size preference
- Improve page performance by limiting DOM nodes

**Non-Goals:**
- Server-side pagination (current data set is manageable client-side)
- Bulk selection or actions
- Changing the equipment add/edit modal functionality
- Search/filter changes (existing filter should still work)

## Decisions

### 1. Client-Side Pagination Approach

**Decision:** Use client-side pagination with React state.

**Rationale:**
- Equipment catalog size is small enough for client-side pagination
- Simpler implementation than server-side
- Faster page transitions (no additional API calls)
- Maintains existing data fetching pattern

**Alternative Considered:** Server-side pagination with offset/limit
- Would require API changes
- Overkill for expected equipment count (~100-200 items)

### 2. Page Size Options

**Decision:** Offer 10, 25, 50, 100 as page size options.

**Rationale:**
- 10: Good for detailed review
- 25: Balanced default
- 50: For users who want more visibility
- 100: For power users with large monitors
- These are standard pagination sizes that work well

### 3. UI Layout

**Decision:** Place pagination controls at bottom of the equipment list, with page size selector above the list.

**Rationale:**
- Familiar pattern (Google, e-commerce)
- Keeps controls visible without taking vertical space from equipment
- Page size selector at top allows setting before browsing

### 4. Go to Top Button

**Decision:** Floating button fixed to bottom-right corner, appears after scrolling past first viewport.

**Rationale:**
- Standard pattern users expect
- Position doesn't interfere with content
- Only shows when needed to reduce visual clutter

## Risks / Trade-offs

- **User Disorientation:** Users may lose scroll position when changing page. Mitigated by clear page indicators.
- **Preference Storage:** localStorage may be cleared. Mitigated by defaulting to sensible 25.
- **Search/Filter Interaction:** Pagination must work with existing search/filter. Mitigated by resetting to page 1 when filter changes.

## Migration Plan

1. Modify Equipment Catalog page component
2. Add pagination state management
3. Add page size selector UI
4. Add pagination controls UI
5. Add scroll-to-top button
6. Test with various equipment counts
7. Verify existing search/filter still works

## Open Questions

- Should page preference be per-session or persisted? (Persisted in localStorage for convenience)