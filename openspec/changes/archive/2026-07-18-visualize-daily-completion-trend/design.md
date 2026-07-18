## Context

The Records page renders fourteen daily completion summaries in a horizontally scrollable grid. Each card currently shows a date, percentage, completed/required action count, and unit/state text. The summary data model already provides the percentage inputs, so this change is presentation-only.

## Goals / Non-Goals

**Goals:**
- Make completion trends visually scannable with a consistent vertical bar for each operational day.
- Use green to communicate completed work and a neutral remainder to communicate unfinished work.
- Retain date and percentage labels, unavailable-state handling, server rendering, and narrow-screen horizontal scrolling.

**Non-Goals:**
- Change summary calculations, daily manifests, completion state, or Records data access.
- Add a charting dependency or client-side visualization state.
- Display action counts, completed-unit counts, or the `live` state in each day card.

## Decisions

- Render the chart with semantic HTML and Tailwind classes rather than SVG or a charting library. This keeps the existing server-rendered component dependency-free and matches the small fixed data set.
- Use a fixed-height column with a bottom-aligned green fill whose height equals the rounded completion percentage. A fixed visual scale makes day-to-day differences comparable.
- Keep percentage below or alongside the bar and date as the card label. Removing action/unit text creates visual space while the percentage remains an unambiguous value.
- Render unavailable days with an empty neutral bar and unavailable label rather than representing them as zero completion. This preserves the existing distinction between missing data and 0%.

## Risks / Trade-offs

- [Color alone may be insufficient for accessibility] → Preserve textual percentage and unavailable labels.
- [Very low percentages can be difficult to see] → Give a nonzero completed percentage a minimum visible fill height without changing the displayed percentage.
- [Reconstructed state becomes less prominent] → Preserve it in accessible text or a compact non-card-level indicator if required by the existing trend specification.
