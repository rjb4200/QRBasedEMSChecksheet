## Context

The checkoff workflow is currently daily-focused. Crews work through compartment checks without any indication of monthly check requirements. Admins need a way to configure which day of the month each unit's monthly check falls on, and crews need to see a visible reminder when they're working on that day.

## Goals / Non-Goals

**Goals:**
- Admins can set/clear a monthly check day (1-31) per unit
- Crews see an amber banner on the unit check sheet and compartment pages when today is the unit's monthly check day
- Short-month handling (29-31 falls back to last day of month)
- Uses `America/New_York` timezone consistently

**Non-Goals:**
- No completion tracking, history, or overdue logic
- No email alerts, dashboard changes, or compliance reporting
- No separate monthly checklist or acknowledgment button

## Decisions

1. **Single nullable integer field** over a separate table
   - Rationale: One unit has one monthly check day. No need for a join table for a single value.

2. **Amber banner on checkoff pages** over a modal/toast
   - Rationale: Persistent but non-blocking. Crews see it while working but it doesn't interrupt their flow.

3. **Short-month fallback to last day** over skipping the month
   - Rationale: A unit configured for day 31 should never miss a reminder just because a month is short.

4. **`TIMEZONE` from environment** over hardcoded value
   - Rationale: The timezone is already configurable via Vercel env vars. Reading from `process.env.TIMEZONE` with `America/New_York` as default keeps it consistent with other timezone-dependent features.

## Date Logic

```ts
const TIMEZONE = process.env.TIMEZONE || "America/New_York";

function shouldShowMonthlyCheckReminder({
  monthlyCheckDay,
  now = new Date(),
}: {
  monthlyCheckDay: number | null
  now?: Date
}): boolean
```

The reminder shows when the effective monthly check day equals the current local day of the month in `TIMEZONE`.

## Risks / Trade-offs

- **[Risk] Double reminder on daily + monthly check day** → Mitigation: Banner is informational only, non-blocking
- **[Risk] 31st-day units in 28-day February** → Mitigation: Fallback to last day of month
