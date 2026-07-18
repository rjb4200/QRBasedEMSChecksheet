## Context

`/admin/archives` renders its selected-date label inside `RecordsCardsSection`, while `RecordsSummarySection` renders independently above the trend chart. The readiness counts therefore appear apart from the unit cards that they summarize.

The page already uses independent Suspense boundaries to stage filters, summary data, trend data, unit cards, and tools. The change is presentation-only: the selected date, active unit filter, records query, and summary calculation remain unchanged.

## Goals / Non-Goals

**Goals:**
- Render the selected date, readiness summary, and unit cards as one ordered Records content region.
- Keep the readiness summary scoped to the same selected date and unit filter as the unit cards.
- Preserve progressive rendering and the existing summary loading state.

**Non-Goals:**
- Change readiness status definitions, counts, exception calculations, filters, exports, printing, or the completion trend chart.
- Alter the unit-card content or visual design of the status summary.

## Decisions

### Keep the existing summary component and data source

`RecordsSummarySection` will retain its current record query and count calculation. It will be rendered after the selected-date label and before the card grid, passing through the same `selectedDate` and `unitId` values as the cards.

This avoids duplicating aggregate logic in the cards component. Computing a second summary while rendering cards would create an additional implementation path that could diverge from the existing status totals.

### Preserve an independent loading boundary for the summary

The summary will continue to use `SummarySkeleton` through a nested Suspense boundary at its new location. The cards can therefore load independently when the summary query is delayed.

Wrapping the entire date, summary, and card region in one boundary was considered, but would unnecessarily delay cards until aggregate counts resolve.

### Leave the trend chart in its current relative position

The trend remains a separate section after the filter. This change only relocates the date-specific summary to the date-specific unit records area.

## Risks / Trade-offs

- [Nested section spacing may change] -> Verify desktop and mobile rendering so the date, summary, and card grid retain consistent spacing.
- [Summary and cards issue equivalent cached queries] -> Retain the existing React cache key and data source; no new data queries are introduced by this layout change.
