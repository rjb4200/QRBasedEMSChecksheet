# Design Document: Fleet Matrix Quick Access

## Context
Admin users need to monitor unit checkoffs efficiently. The current workflow requires navigating through unit details to reach the live checkoff status, causing unnecessary latency.

## Goals
- Add a "View Checkoff" button to each unit card.
- Implement **State-Aware Styling** for better visual hierarchy.
- Ensure the interface remains "performance-first" with zero layout shift.

## Implementation Details

### File: src/components/fleet-matrix.tsx
The `FleetMatrix` component renders unit cards in the fleet view. We will add a new button inside each card.

### Button Placement
Located below the existing "Manage Unit" button in the admin view, or as a primary action for the user view.

### Visual Style

**In-Progress Units:**
- Solid neutral background (e.g., `bg-slate-700`) with white text
- Indicates active work requiring attention

**Completed/Not Started:**
- Outlined "ghost" style (`border border-slate-300 text-slate-600`)
- Reduces visual noise while remaining clearly clickable

### Link Destination
- Direct navigation to `/units/{unitId}` using Next.js `<Link>` with `prefetch={true}`

### Accessibility
- Minimum 44px height for tap targets
- Text label "View Checkoff" (not icon only)

## Component Structure (Target)

```tsx
<article key={unit.id} className="rounded-3xl bg-white p-5 shadow-sm">
  {/* ... existing header content ... */}
  
  {/* Progress bar */}
  <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-200">
    <div className="h-full rounded-full bg-red-700" style={{ width: `${unit.percentage}%` }} />
  </div>
  
  <p className="mt-3 font-bold">{unit.completed} of {unit.total} checks completed</p>
  <p className="text-sm text-slate-600">{unit.inProgress} in progress</p>
  
  {/* New View Checkoff Button */}
  <Link 
    href={`/units/${unit.id}`}
    prefetch={true}
    className={`mt-4 inline-flex min-h-[44px] items-center justify-center rounded-2xl px-4 py-2 font-bold ${
      unit.inProgress > 0 
        ? "bg-slate-700 text-white" 
        : "border border-slate-300 text-slate-600"
    }`}
  >
    View Checkoff
  </Link>
  
  {/* Admin-only Manage Unit button */}
  {admin ? <Link ...>Manage Unit</Link> : null}
</article>
```

## Validation
- TypeScript compiles without errors
- ESLint passes
- Build succeeds
- Button navigates to correct `/units/{id}` URL
- Button visible on all unit states (Not started, In progress, Completed)
- Mobile view maintains card height

## Risks
- **Button Fatigue:** Mitigated by using neutral palette that only draws attention to active units.
- **Mobile Tap Targets:** Maintain 44px minimum height.