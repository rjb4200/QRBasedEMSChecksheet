# Proposal: Fleet Quick Checkoff Button

## Why
Currently, admins and supervisors experience "multi-click fatigue" when checking crew progress. To monitor a unit's live checkoff status, they must navigate through multiple screens. This update reduces the path from three clicks to one.

## What Changes

### Component
- **File:** `src/components/fleet-matrix.tsx`
- **Feature:** A "View Checkoff" button on each unit card that links directly to the live checkoff page

### Button Behavior
- **Navigation:** Links to `/units/{unitId}` using Next.js client-side routing
- **Styling:** State-aware based on unit progress:
  - In-progress units: Solid neutral fill (prominent)
  - Completed/Not started: Outlined ghost style (subtle)
- **Accessibility:** 44px minimum height, text label (not icon)

### Interaction
- Uses Next.js `<Link>` with prefetch for instantaneous transitions
- No additional API calls or data fetching required

## Impact

- **Performance:** Optimized navigation via Next.js prefetching
- **UX:** Single-click access to live checkoff status from fleet view
- **Accessibility:** Meets mobile tap target requirements (44px minimum)

## Dependencies
- Uses existing `unit.id`, `unit.inProgress` fields from FleetMatrix component
- No database changes required
- No new dependencies