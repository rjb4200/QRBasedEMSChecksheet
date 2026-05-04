## Context

The fleet matrix component (`src/components/fleet-matrix.tsx`) displays unit cards with two action buttons: "View Checkoff" and (for admins) "Manage Unit". Currently these are stacked vertically. On desktop screens with wider cards, they can fit side by side.

## Goals / Non-Goals

**Goals:**
- Display buttons horizontally when card width permits
- Ensure buttons stack vertically on narrow screens (mobile)

**Non-Goals:**
- No changes to button styling or functionality
- No changes to non-admin view (single button)

## Decisions

### Implementation Approach

**Decision:** Use flexbox with `flex-wrap` and conditional width classes.

**Rationale:** 
- `flex-wrap` allows natural wrapping on narrow screens
- Tailwind's responsive prefixes (`md:`, `lg:`) can control when horizontal vs vertical layout triggers
- Simple CSS change, no JavaScript required

**Alternative considered:**
- Use CSS Grid - more complex than needed for two buttons
- Use media queries in CSS - less maintainable than Tailwind classes

## Implementation

Current code:
```tsx
<Link ...View Checkoff</Link>
{admin ? <Link ...>Manage Unit</Link> : null}
```

Change to:
```tsx
<div className="flex flex-wrap gap-2">
  <Link ...View Checkoff</Link>
  {admin ? <Link ...>Manage Unit</Link> : null}
</div>
```

## Risks / Trade-offs

- **Low Risk:** Simple CSS layout change
- **No significant trade-offs:** Improves visual efficiency on desktop without impacting mobile

## Migration Plan

1. Update fleet-matrix.tsx with flex container
2. Run typecheck, lint, build
3. Deploy