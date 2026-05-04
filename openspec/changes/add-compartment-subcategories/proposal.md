## Why

Large compartments with many equipment items can be difficult to navigate and check off. Admin users need the ability to organize items into logical subcategories (e.g., "Vehicle Controls & Fluids", "Exterior Lights", "Electrical Systems") to ease the checkoff process. Currently, all items appear in a single flat list within each compartment.

## What Changes

- Add ability to create subcategories within compartments from the compartment editing page
- Subcategories display on the checkoff page with visual styling to group associated items
- Items can be assigned to subcategories
- Reordering functionality allows moving subcategories and moving items between subcategories
- Subcategories appear in the order defined by admin and this order is preserved in checkoffs, records, and printouts

## Capabilities

### New Capabilities

- `compartment-subcategories`: Ability to create, edit, and delete subcategories within compartments. Items are organized under subcategories with visual grouping on checkoff pages.

### Modified Capabilities

- `compartment-item-reorder`: Update existing reordering to support moving items between subcategories and reordering subcategories themselves.

## Impact

- New database table or columns for subcategories within compartments
- Updates to compartment editing page UI to add/manage subcategories
- Updates to checkoff page to display items grouped by subcategory with visual styling
- Updates to reordering functionality to handle subcategory movement and item-to-subcategory assignment