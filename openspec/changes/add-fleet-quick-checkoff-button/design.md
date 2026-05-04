## Context

The admin fleet matrix page displays all units with their completion percentage and progress bar. Admin users currently need to click on the unit name to view details, then navigate to the checkoff page to see the current crew progress. This requires multiple clicks and page loads.

## Goals / Non-Goals

**Goals:**
- Add a visible button to each unit card on the fleet matrix
- Button navigates directly to the daily checkoff page (`/units/[id]`)
- Button is styled consistently with admin UI (red primary, white outlined)

**Non-Goals:**
- Adding any new data display on the fleet matrix itself
- Changing the fleet matrix layout or existing information
- Adding any functionality beyond navigation

## Decisions

### 1. Button Placement and Style

**Decision:** Add a "View Checkoff" button below the progress bar on each unit card.

**Rationale:** The progress bar area is already the focal point for status. Adding the button below keeps it accessible without cluttering the unit name or percentage display.

**Alternative Considered:** Adding a button in the unit card header. Rejected because it would compete with the unit name for attention.

### 2. Button Styling

**Decision:** Use the standard admin button styling (red background with white text).

**Rationale:** Consistency with other admin UI elements. The red primary color is already established in the admin interface.

**Alternative Considered:** Outline style only. Rejected because filled buttons are more visible and encourage action.

### 3. Link Destination

**Decision:** Navigate to `/units/{unitId}` which is the existing unit checkoff page.

**Rationale:** This page already displays crew names, lock status, and all compartment checkoff items with their completion status. No new page or route needed.

## Risks / Trade-offs

- **Visual Clutter:** Adding buttons to each unit card may make the fleet matrix feel busier. Mitigated by keeping the button compact and unobtrusive.
- **Mobile Experience:** Button may be small on mobile devices. Mitigated by using a touch-friendly button size (minimum 44px tap target).

## Migration Plan

1. Update fleet matrix component to add button to each unit card
2. Test button navigation works correctly
3. Verify no layout regressions on fleet page
4. Deploy to production

## Open Questions

- None. This is a straightforward UI enhancement with clear requirements.