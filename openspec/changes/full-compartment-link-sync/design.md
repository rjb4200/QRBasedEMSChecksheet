## Context

The existing compartment linking feature provides a way to associate compartments, but it does not fully synchronize configuration changes. When an admin updates one compartment's equipment list, par levels, subcategories, or ordering, those changes should propagate to all other compartments with the same link name. This allows standardizing equipment layouts across the fleet.

## Goals / Non-Goals

**Goals:**
- Add link_name field to compartments for matching
- Sync par level changes to all linked compartments
- Sync subcategory changes (add/edit/delete) to all linked compartments
- Sync equipment items (add/edit/delete) to all linked compartments
- Sync equipment ordering to all linked compartments
- NOT sync checkoff status (each unit must be checked separately)
- Use trimmed link_name for matching (ignore leading/trailing spaces)

**Non-Goals:**
- Automatic creation of linked compartments
- Bulk operations across linked compartments
- Real-time sync (trigger-based, not websocket)

## Decisions

### 1. Link Name Matching

**Decision:** Use TRIM() on link_name when matching compartments. Empty or null link_name means not linked.

**Rationale:** This allows users to add spaces for readability without affecting matching. Two compartments "O2 Bag " and " O2 Bag" should link.

### 2. Sync Trigger Points

**Decision:** Trigger sync on these operations:
- Adding a new equipment item
- Removing an equipment item
- Updating item par value
- Adding/editing/deleting subcategories
- Reordering items within compartment
- Reordering subcategories

**Implementation:** After each operation, find all compartments with matching TRIM(link_name) and apply the same change.

### 3. Sync Strategy - Items

**Decision:** Use item name as the unique identifier for sync. If item name exists in target, update it. If not, add it. If item removed from source, remove from targets.

**Rationale:** This handles cases where compartments might have been edited independently. The "source of truth" is the compartment being edited.

**Alternative Considered:** Use item ID for matching. Rejected because different units have different item IDs, and we want to sync content, not IDs.

### 4. Sync Strategy - Subcategories

**Decision:** Use subcategory name as the unique identifier for sync.

**Rationale:** Same reasoning as items - name-based matching allows cross-unit sync without ID dependencies.

### 5. Checkoff Status Exclusion

**Decision:** Explicitly exclude daily_unit_items from sync. Only sync compartment_items (the configuration), not daily checkoff data.

**Rationale:** Each unit must complete their own checkoff daily. Sync would undermine this requirement.

## Risks / Trade-offs

- **Race Conditions:** Multiple admins editing linked compartments simultaneously. Mitigated by last-write-wins approach.
- **Data Loss:** Syncing could overwrite independent changes made to linked compartments. Mitigated by clear UI indication that compartments are linked.
- **Performance:** Syncing to many linked compartments could be slow. Mitigated by async/background processing if needed.

## Migration Plan

1. Add link_name column to compartments table
2. Update compartment editing UI to add link_name input
3. Implement sync trigger functions for each operation type
4. Update UI to show linked compartment indicator
5. Test with multiple linked compartments
6. Deploy to production

## Open Questions

- Should there be a maximum number of linked compartments? (Recommend: No hard limit, practical fleet size of ~10)
- How to handle circular references? (Not possible - compartments link by name, not to specific other compartments)
- What happens if I unlink a compartment? (It retains its current configuration as its new standalone config)