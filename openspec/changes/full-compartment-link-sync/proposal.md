## Why

The current compartment linking feature does not fully sync all configuration changes across linked compartments. To standardize equipment layouts across the fleet (e.g., all "O2 Bag" compartments should have identical contents regardless of which unit they belong to), changes to one linked compartment should propagate to all other compartments with the same link name. This includes par levels, subcategories, equipment items, and ordering - but NOT checkoff status, which must remain independent per unit.

## What Changes

- Add link_name field to compartments table (with leading/trailing space trimming for matching)
- Implement full configuration sync when a linked compartment is changed
- Sync includes: par levels, subcategories, adding/removing equipment, equipment ordering
- Each linked compartment maintains its own checkoff status (not synced)
- Trigger sync on any compartment configuration change
- Handle new items, removed items, and modified items across all linked compartments

## Capabilities

### New Capabilities

- `compartment-link-sync`: Full bidirectional sync of compartment configuration across all compartments with matching link names.

### Modified Capabilities

- None. This enhances existing linking without changing core requirements.

## Impact

- Updates to compartment data model to store link_name
- New sync logic triggered on compartment configuration changes
- Updates to item management to sync across linked compartments
- Updates to subcategory management to sync across linked compartments
- Updates to reordering to sync across linked compartments