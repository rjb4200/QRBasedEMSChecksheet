## Why

The equipment catalog when adding items to compartments is currently a long, unfiltered list. Admin users must scroll through all items to find the one they need, which is time-consuming and inefficient. Adding category filtering and text search will allow admin to quickly locate equipment items.

## What Changes

- Add category filter dropdown to the equipment selection list
- Add search input field to filter equipment by name
- Filter results update in real-time as user types or selects category
- Both filter and search can be combined for precise results

## Capabilities

### New Capabilities

- `equipment-list-filtering`: Ability to filter equipment list by category and search by name when adding items to compartments.

### Modified Capabilities

- None. This is a UI enhancement that doesn't change core requirements.

## Impact

- Updates to equipment selection component UI
- Client-side filtering (no backend changes needed as equipment catalog is already loaded)
- No database changes required