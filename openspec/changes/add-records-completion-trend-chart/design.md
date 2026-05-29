## Context

The Records page (`/admin/archives`) displays daily unit readiness records using `getDailyUnitRecords()` which already defaults to a 14-day window and returns pre-computed daily aggregates via the `groups` array. Each `DailyRecordGroup` contains `completedInServiceUnits` and `totalInServiceUnits` — the exact data needed for a trend chart. No additional queries or database changes are required.

No charting library exists in the project. The page is a Next.js server component, rendered entirely server-side with Tailwind CSS.

## Goals / Non-Goals

**Goals:**

- Render a vertical bar chart showing the last 14 days of check completion as a server component
- Each bar height proportional to completion percentage (0–100%)
- Color-coded: green (>85%), amber (70–85%), red (<70%)
- Show date label, percentage, and checked/in-service count below each bar
- Place chart directly under the page header, above filters
- Fleet-wide chart, unaffected by unit filter
- Handle zero in-service units gracefully (bar height 0, label "N/A")
- Reorganize Records page layout: "Showing N records" moves below unit cards, Clear Records section moves to bottom

**Non-Goals:**

- No charting library added
- No animations or interactive tooltips in v1
- No per-unit trend filtering
- No database writes, migrations, or API routes
- No changes to checkoff logic, unit status logic, or email behavior

## Decisions

### 1. Vertical CSS Bars (No Chart Library)

**Decision:** Each bar is a `<div>` with `height` set via inline `style={{ height: pct + "%" }}` inside a fixed-height container. Bar width is equal and calculated as fraction of container width (100% / 14 days).

**Rationale:** Zero dependencies. Tailwind handles colors and layout. The data is known at render time (server component), so heights are computed once. No hydration mismatch risk.

**Alternatives considered:**
- **recharts / chart.js** — Heavy dependencies, unnecessary for 14 static bars.
- **SVG** — More flexible but overkill for simple bars.
- **Canvas** — Requires client-side rendering, adds complexity.

### 2. Server Component (No Client JS)

**Decision:** The chart is a server component that fetches data inline via `getDailyUnitRecords({})`.

**Rationale:** The chart is purely presentational. The data is static for the page load. No interactivity needed. Server rendering means zero client-side JavaScript for the chart.

### 3. Color Bands

| % Range | Color | Tailwind Class |
|---|---|---|
| > 85% | Green | `bg-green-500` |
| 70–85% | Amber | `bg-amber-500` |
| < 70% | Red | `bg-red-500` |
| 0 or N/A | Gray | `bg-slate-200` |

### 4. Bar Layout

```
  ┌──────────────────────────────────────────────────────────┐
  │                    100% ┬                                │
  │                    ┌───┤                                 │
  │    ██    ██    ██  │███│  ██    ██    ██ ← bars          │
  │    ██    ██    ██  │███│  ██    ██    ██                 │
  │    ██    ██    ██  │███│  ██    ██    ██   height: pct%  │
  │    ██    ██    ██  │███│  ██    ██    ██                 │
  │    ██    ██    ██  └───┘  ██    ██    ██                 │
  │                     0% ┴                                 │
  │   5/16  5/17  5/18  5/19  5/20  5/21  ...               │
  │    88%   100%   75%   100%   88%   63%                   │
  │    7/8    8/8   6/8    6/6   7/8    5/8                  │
  └──────────────────────────────────────────────────────────┘
```

Each bar column is:
- Bar: `h-32` container, bar fill inside uses `flex flex-col justify-end` with the colored bar at calculated `height`
- Date label: abbreviated month/day format (e.g., "5/16")
- Count: smaller text "7/8"

### 5. Layout Reorder

Current order → New order:

```
Header                            Header
Filters                           📈 Trend Chart (NEW)
Export Package                    Filters
Clear Records                     Export Package
"Showing N" + CSV links           Summary cards
Summary cards                     Unit cards
Unit cards                        "Showing N" + CSV links
                                  Clear Records (MOVED)
```

### 6. Chart Title

"Last 14 Days Check Completion" — placed above the bars as a section header.

## Risks / Trade-offs

- **[Mobile readability]** — 14 bars on a small screen may be tight. **Mitigation:** Use `text-xs` for labels, allow horizontal scroll if needed, keep bar min-width at ~24px.
- **[Empty data]** — Days with no records show 0% with gray bar. **Mitigation:** Already handled by `totalInServiceUnits === 0` check.
- **[Layout shift]** — Adding chart at top changes the scroll position. **Mitigation:** Chart is compact (~200px tall), minimal shift.

## Open Questions

- Should the chart show the current day's shift date as the last bar, or only completed days up to yesterday? (Decision: last 14 days including today, matching `getDefaultArchiveRange`)
