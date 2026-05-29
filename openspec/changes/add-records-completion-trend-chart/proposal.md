## Why

The Records page shows detailed daily checkoff data but lacks a quick visual trend of completion over time. Admins need to see at a glance whether daily checks are being completed consistently across the fleet. A compact 14-day vertical bar chart using CSS-only bars provides this visibility without adding any charting library dependency.

## What Changes

- Add a "Last 14 Days Check Completion" vertical bar chart component to the Records page, placed directly under the page header
- Each bar represents one day, colored by completion percentage (green ≥100%, amber 75–99%, red <75%)
- Shows date label, percentage, and checked/in-service count below each bar
- Reads from existing `getDailyUnitRecords({})` which already defaults to 14 days with pre-computed daily aggregates — no new queries needed
- Chart stays fleet-wide regardless of unit filter selection
- Records page layout reorganized: chart moves under headers, filters stay together, "Showing N records" moves below unit cards, Clear Records section moves to page bottom

## Capabilities

### New Capabilities

- `records-completion-trend`: Read-only vertical bar chart displaying daily check completion percentages for the last 14 rolling days using CSS bars, with color-coded completion bands and checked/in-service count labels

### Modified Capabilities

- `archive-history`: Records page layout reorganized — trend chart added under header, "Showing N records" label moved below unit cards, Clear Records section moved to page bottom

## Impact

- **New component**: `src/components/completion-trend-chart.tsx` — server component, reads from `getDailyUnitRecords`, renders pure HTML/CSS bars
- **Modified**: `src/app/admin/archives/page.tsx` — layout reorder (chart insertion, section repositioning)
- **No new dependencies** — CSS bars, no charting library
- **No database writes, no migrations, no new API routes**
