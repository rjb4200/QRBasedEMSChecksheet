## 1. Chart Component

- [x] 1.1 Create `src/components/completion-trend-chart.tsx` server component that accepts `groups: DailyRecordGroup[]` and renders vertical CSS bars
- [x] 1.2 Compute bar heights as percentages from group data, handling zero in-service units
- [x] 1.3 Apply color bands: green (>85%), amber (70-85%), red (<70%), gray (0 or N/A)
- [x] 1.4 Display date (abbreviated "M/D") and "X/Y" count below each bar
- [x] 1.5 Add "Last 14 Days Check Completion" section title above the chart

## 2. Records Page Layout Reorder

- [x] 2.1 Move Clear Records section to bottom of page (after unit cards and "Showing N records")
- [x] 2.2 Move "Showing N records" label and CSV export links below unit record cards
- [x] 2.3 Insert trend chart component between page header and filter form
- [x] 2.4 Verify all existing controls (Filter, Print, Simple CSV, Detailed CSV, Export Package) remain functional

## 3. Testing

- [x] 3.1 Add unit test for chart data computation verifying correct percentage from groups
- [x] 3.2 Add unit test for color band logic (green/amber/red/gray thresholds)
- [x] 3.3 Add unit test verifying zero in-service units returns 0% with gray color
- [x] 3.4 Add unit test verifying the chart stays fleet-wide regardless of unit filter
