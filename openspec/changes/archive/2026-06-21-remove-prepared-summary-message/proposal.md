## Why

The "Prepared summary for EC..." cache hint banner that appears on the unit dashboard is unnecessary noise for the crew. The live server data renders immediately behind it, making the banner a distracting flash of stale information that adds no value to the checkoff workflow.

## What Changes

- Remove the `UnitSummaryCacheHint` component from the unit dashboard page
- Remove the component file `src/components/unit-summary-cache-hint.tsx`
- Remove the import of `UnitSummaryCacheHint` from the unit dashboard page
- Remove the JSX rendering of `<UnitSummaryCacheHint ... />` from the unit dashboard page

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `checkoff-cache-prefetch`: Remove the requirement that the unit page may render a cached summary before live refresh. The "Prepared summary for EC..." banner display requirement is being eliminated.

## Impact

- `src/components/unit-summary-cache-hint.tsx` — deleted
- `src/app/units/[id]/page.tsx` — remove import and JSX usage
- No API, database, or cache layer changes needed (the caching infrastructure remains in place for prefetch purposes)
