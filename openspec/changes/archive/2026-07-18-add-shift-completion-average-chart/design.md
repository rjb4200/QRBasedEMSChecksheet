## Context

Daily checkoff data is recorded once per operational date using the `daily` period. Each date is assigned to 1st, 2nd, or 3rd Shift by `shift_calendar`; the three names represent rotating daily ownership, not three intraday checkoff periods. The Records page currently renders only recent fleet-wide completion summaries.

## Goals / Non-Goals

**Goals:**
- Show nine recent Daily Completion bars beside a three-bar Shift Average chart on extra-large screens.
- Calculate each shift's 30-day percentage from its total completed and required actions.
- Use recorded shift-calendar assignments and preserve useful behavior on narrow screens.

**Non-Goals:**
- Introduce intraday 1st/2nd/3rd checkoff periods or alter `shift_period`.
- Change daily completion manifest, summary, or excusal calculations.
- Persist another aggregate table or add a charting dependency.

## Decisions

- Query the latest thirty daily summaries and their matching `shift_calendar` rows in the existing server-side Records read path. This keeps the chart authoritative without a migration.
- Group each date by the calendar's `shift_name`; use `getShiftNameForDate` only if no calendar row is present. Calendar records represent deliberate schedule overrides.
- Calculate action-weighted completion as `sum(completed_actions) / sum(required_actions)` for every assigned date with required actions. This reflects actual workload rather than giving a light-work day equal weight.
- Render the dashboard as a two-column grid at the extra-large breakpoint, with the nine-day chart receiving the larger column. Stack it below that breakpoint to avoid compressed labels and bars.

## Risks / Trade-offs

- [The label may be interpreted as three intraday periods] → Describe the chart as rotating shift averages and use the existing 1st/2nd/3rd names consistently.
- [Missing calendar records can change historical grouping] → Use the stable configured rotation only as an explicit fallback.
- [A shift may have no required work in the window] → Render that bar as unavailable rather than 0%.
