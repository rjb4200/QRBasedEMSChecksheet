## Why

Currently, to reorder equipment items within a compartment, admin must navigate to a separate equipment management page. This creates unnecessary steps and breaks the workflow context. Admin should be able to reorder equipment directly from the unit's compartment view on the units page.

## What Changes

- Add drag-and-drop reordering functionality to equipment items within compartments
- Add up/down arrow buttons for each item to change position
- Persist the new order to the database
- Display equipment in the new order on checkoff pages, records, and printouts
- Allow reordering from both the units page and admin unit editing

## Capabilities

### New Capabilities

- `compartment-item-reorder`: Ability to reorder equipment items within a compartment directly from the units page using drag-and-drop or arrow buttons.

### Modified Capabilities

- None. This is a UI enhancement that doesn't change requirements.

## Impact

- Updates to compartment item component to support reordering UI
- New API endpoint to save item order
- Updates to item fetching to order by position field
- Database may need position column on compartment_items table