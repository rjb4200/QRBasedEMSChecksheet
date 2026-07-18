## Context

The Records page presents three rolling shift completion averages in a compact card. It currently labels the card `Shift Average`, repeats the thirty-day scope in a subtitle, renders a seven-rem bar area, and places percentages beneath the bars. No shared crown icon exists in the application.

## Goals / Non-Goals

**Goals:**
- Make the thirty-day comparison legible at a glance.
- Elevate the percentage to the primary value associated with each shift.
- Visually identify every highest-performing available shift, including ties.
- Preserve the existing unavailable state and rolling-data calculation.

**Non-Goals:**
- Change the thirty-operational-day window, shift assignment logic, rounding, or data source.
- Rank shifts by raw completed-action count or introduce a historical leaderboard.
- Add a third-party icon or charting dependency.

## Decisions

### Determine leaders from available percentages only

Find the maximum non-null percentage among the three supplied averages and mark every average equal to that maximum as a leader. If no percentage is available, no shift receives a crown.

Rationale: this respects the existing distinction between unavailable and 0%, and accurately recognizes a shared highest result.

Alternative considered: choose the first shift at the maximum. Rejected because it hides tied performance and conflicts with the agreed behavior.

### Keep the chart self-contained and use an inline crown

Render the crown adjacent to the shift name in the chart component with an accessible text alternative. Use an inline SVG rather than introducing a dependency or a broad shared icon change.

Rationale: the indicator is used in one location and does not warrant a new icon library or an unrelated shared-component expansion.

### Overlay percentages on the bars

Use `30 Day Average` as the only scope heading. Within each shift column, show its name and optional crown, then a `h-48` vertical bar with its percentage centered in a high-contrast foreground badge. Use `rounded-2xl` on the bar and its fill to visually echo the `rounded-3xl` card without making the narrow bars pill-shaped. Keep unavailable text beneath the empty bar.

Rationale: the numeric comparison remains immediately associated with the bar while the taller bars improve proportional comparison without changing the mobile three-column layout.

## Risks / Trade-offs

- [A tie crown is mistaken for a single winner] -> Crown every shift matching the maximum and avoid singular winner wording.
- [An unavailable shift is treated as a 0% leader] -> Exclude null percentages before determining the maximum.
- [Taller bars make the Records header take more space on small screens] -> Retain the existing three-column layout and use a moderate, fixed `h-48` height.
- [Large corner radii make low-completion bars resemble pills] -> Use `rounded-2xl` rather than the card's `rounded-3xl` radius.
