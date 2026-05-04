## Context

The fleet matrix displays units with completion percentage but lacks detailed status information. Admin users need to quickly see if checks were done early, are in progress, have exceptions, or include crew comments.

## Goals / Non-Goals

**Goals:**
- Display "Done Before 10AM" badge for units locked before 10:00
- Display "In Progress" badge for units with uncompleted checks
- Display "Current Exceptions" badge with count for units below par
- Display "New Exceptions" badge with count for exceptions not in yesterday's check
- Display "Has Comments" badge when crew comments are present

**Non-Goals:**
- Changing the existing completion percentage display
- Adding notifications or alerts for any status

## Decisions

### 1. Badge Styling

**Decision:** Use small pill-shaped badges with distinct colors:
- Done Before 10AM: Green
- In Progress: Blue
- Current Exceptions: Red with count number
- New Exceptions: Orange/yellow with count number
- Has Comments: Purple

**Rationale:** Each color has semantic meaning - green for success, blue for in-progress, red for issues, orange for warnings, purple for notes. The pill shape is compact and readable.

### 2. Badge Placement

**Decision:** Display badges in a row below the progress bar on each unit card.

**Rationale:** This keeps the badges visible without obscuring the unit name or completion percentage. The row wraps if there are many active badges.

### 3. Data Calculations

**Decision:** Calculate each badge status as follows:
- Done Before 10AM: Check locked_at time < 10:00 AM
- In Progress: Check exists but locked_at is null
- Current Exceptions: Count items where count < par (from today's check)
- New Exceptions: Compare against yesterday's locked check, count items below par that weren't below par yesterday
- Has Comments: Check if daily_units.comments is not null/empty

### 4. Counting Display

**Decision:** Only show count numbers on Current Exceptions and New Exceptions badges. Other badges are simple indicators.

**Rationale:** Exception counts provide actionable information. Other badges are binary indicators.

## Risks / Trade-offs

- **Performance:** Calculating exception counts and new exceptions requires additional queries. Mitigated by efficient DB queries with proper filtering.
- **Empty States:** Badges for units with no issues should not display. Mitigated by only showing badges when conditions are met.

## Migration Plan

1. Update fleet unit card component to add badges section
2. Add data fetching for badge status calculations
3. Implement badge rendering with appropriate styling
4. Test each badge type with different scenarios
5. Deploy to production

## Open Questions

- Should badges appear for archived/OOS units? (Recommend: No, only active units)
- What time zone for "before 10AM"? (Use server/local time - consistent with crew usage)