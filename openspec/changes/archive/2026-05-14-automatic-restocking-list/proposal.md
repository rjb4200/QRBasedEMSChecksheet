## Why

Crews can currently see deficient items only inside individual compartment or kit check rows, which makes restocking larger units slower and easier to miss. The system already detects exceptions, so it should present those deficiencies as one operational Restocking List without creating a separate inventory workflow.

## What Changes

- Add an automatically generated Restocking List below Unit Comments on unit checksheet pages.
- Derive restocking entries from existing exception rules for quantity, checkbox, and condition item values.
- Include assigned kit exceptions alongside compartment exceptions and label each entry by source section.
- Hide the Restocking List when no exceptions exist.
- Include the Restocking List in printed checksheets, PDF exports, emailed daily reports, and historical archive/records displays when exceptions exist.
- Preserve historical reproducibility by deriving archived lists from saved check data rather than a new restocking table.

## Capabilities

### New Capabilities
- `automatic-restocking-list`: Consolidated unit deficiency summary generated from existing check data and exception logic.

### Modified Capabilities
- `daily-unit-comments`: Unit checksheets display Restocking List below Unit Comments without depending on comment presence.
- `past-checkoff-record-summary`: Historical records and archive outputs expose reproducible Restocking Lists when archived exception data exists.
- `checksheet-pdf-api`: PDF checksheet output includes Restocking List sections when unit exceptions exist.

## Impact

- Unit checksheet page rendering and current-shift exception aggregation.
- Checkoff form client behavior for dynamic exception updates while values change.
- Shared exception/restocking utility for current, print, PDF/email, and archived contexts.
- Printed checksheets, PDF generation, and daily email report rendering.
- No database schema changes and no separate persistent restocking records.
