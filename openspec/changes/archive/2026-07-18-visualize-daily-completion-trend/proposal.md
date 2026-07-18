## Why

The Records completion trend is operationally accurate but visually dense: each day repeats action, unit, and state text. A compact vertical bar chart will make day-to-day completion patterns readable at a glance while preserving the percentage users need to interpret the result.

## What Changes

- Replace each day card's action-count and unit/state text with a fixed-height vertical completion bar.
- Use green for completed work and a neutral slate remainder for incomplete work.
- Retain the date and percentage for every available day.
- Preserve distinct unavailable and reconstructed/finalized states without reintroducing dense per-card status text.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `daily-check-work-completion-trend`: Change the Records trend presentation from action-count cards to a vertical percentage bar chart.

## Impact

- Updates `src/components/daily-work-completion-trend.tsx` and its presentation tests.
- Does not alter the database completion summary, scheduler, or Records read model.
- Resolves the visual follow-up associated with GitHub issue #117.
