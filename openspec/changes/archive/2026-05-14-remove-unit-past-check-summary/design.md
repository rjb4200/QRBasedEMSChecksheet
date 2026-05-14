## Context

The unit checkoff page currently renders current-shift status, crew lock, section status cards, comments, section comments, and Restocking List content. It also renders older previous-shift helper cards for past exceptions and previous shift completion state. Those legacy cards often show empty-state text and now compete with more actionable current-shift information.

## Goals / Non-Goals

**Goals:**
- Remove the "Exceptions for past check" card from the unit checkoff page.
- Remove the "Previous shift" card from the unit checkoff page.
- Remove page-level previous-shift queries and helper logic that are only used by those cards.
- Keep current checkoff progress, crew lock, comments, section comments, and Restocking List content visible.

**Non-Goals:**
- Do not change Records/archive pages.
- Do not change print, PDF, or daily email reports.
- Do not change shift archive generation or stored historical data.
- Do not change exception or restocking calculation logic elsewhere.

## Decisions

1. **Remove the sections entirely rather than hiding only empty states.**

   Rationale: The user goal is to reclaim page space because the sections are not useful enough even when they render. Hiding only empty states would leave the old content competing with comments/restocking on some shifts.

   Alternative considered: Conditional rendering only when previous-shift data exists. This still preserves a low-value feature and keeps extra code/queries around.

2. **Scope the change to `src/app/units/[id]/page.tsx`.**

   Rationale: Historical review still belongs in Records/archive surfaces. Removing the unit-page summary should not affect actual historical data or supervisor records.

   Alternative considered: Remove previous exception logic globally. That risks changing archive/records behavior outside the requested page cleanup.

## Risks / Trade-offs

- Crews lose a quick previous-shift glance on the unit page -> Historical detail remains available in Records/archive views, while current unit action items stay prominent.
- Removing helper logic could accidentally affect current status cards -> Limit edits to previous-shift data/query/helper usage and verify current page sections still render.
