## Context

Currently, equipment items in compartments are displayed in the order they were added. There is no way to reorder them from the units page. Admin must use a separate equipment management interface to change item order, which is inconvenient and breaks context.

## Goals / Non-Goals

**Goals:**
- Add drag-and-drop reordering to equipment list within compartments
- Add up/down arrow buttons for simple reordering
- Save the new order to the database
- Display items in new order across all views (checkoff, records, printouts)

**Non-Goals:**
- Bulk reordering of multiple compartments at once
- Automatic reordering based on usage patterns

## Decisions

### 1. Reorder UI Implementation

**Decision:** Use both drag-and-drop and arrow buttons for reordering.

**Rationale:** Arrow buttons are simpler and work well on mobile. Drag-and-drop provides better UX for desktop users. Both options ensure accessibility.

**Alternative Considered:** Drag-and-drop only. Rejected because it's difficult to use on mobile devices.

### 2. Database Storage

**Decision:** Add a `position` integer column to the compartment_items table.

**Rationale:** Storing position as an integer allows efficient sorting and easy updates. When an item is moved, update its position and shift other items as needed.

### 3. Update Strategy

**Decision:** When an item is moved, recalculate positions for all items in that compartment.

**Rationale:** This ensures consistent ordering and handles edge cases like moving to first/last position.

## Risks / Trade-offs

- **Performance:** Reordering many items requires updating multiple rows. Mitigated by using batch updates.
- **Position Conflicts:** Concurrent reordering could cause conflicts. Mitigated by using database transactions.
- **Migration:** Existing items need position values. Mitigated by setting default position based on existing order (ID or creation order).

## Migration Plan

1. Add position column to compartment_items table
2. Populate position values for existing items
3. Update item fetch queries to order by position
4. Add reordering UI component
5. Add API endpoint to save new order
6. Deploy and test

## Open Questions

- Should reordering be restricted to admin only? (Yes, crews check off items but don't manage equipment)
- Should there be a maximum position? (No, positions are dynamic)