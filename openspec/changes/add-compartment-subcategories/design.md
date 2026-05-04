## Context

Compartments currently contain a flat list of equipment items. For large compartments with many items (e.g., Engine compartment with 20+ items), this creates a long, unwieldy list that is difficult to navigate during checkoff. Subcategories provide logical grouping to improve usability.

## Goals / Non-Goals

**Goals:**
- Allow admin to create subcategories within a compartment
- Display subcategories on checkoff page with visual styling (e.g., section headers, borders, or dividers)
- Allow assigning items to subcategories
- Support reordering subcategories and moving items between subcategories
- Persist subcategory order across checkoffs, records, and printouts

**Non-Goals:**
- Automatic subcategory creation based on item names
- Nested subcategories (only one level)
- Subcategories for compartments with few items (optional - not enforced)

## Decisions

### 1. Database Structure

**Decision:** Add a `subcategory` column to the existing `compartment_items` table, with an optional `subcategory_order` for items within subcategories.

**Rationale:** This is simpler than a separate table and keeps all item data together. Items without a subcategory value go into the "default" ungrouped section.

**Alternative Considered:** Separate subcategories table with foreign key. Rejected because it adds complexity for a straightforward grouping need.

### 2. Subcategory Order

**Decision:** Use a position-based system similar to items. Subcategories have their own position, and items within subcategories have positions.

**Rationale:** This allows fine-grained control over ordering of both subcategories and items within them.

### 3. Visual Styling on Checkoff Page

**Decision:** Display subcategories as collapsible section headers with a distinct background color and clear visual separation between subcategories.

**Rationale:** Section headers make it easy to scan and find the right group. Collapsible allows hiding/showing groups for long lists.

### 4. Reordering

**Decision:** Extend the existing item reordering to handle:
- Reordering subcategories relative to each other
- Moving items between subcategories (including to "no subcategory")
- Items without subcategory appear in an "Uncategorized" or default section

**Implementation:** Use drag-and-drop or up/down arrows, with a subcategory selector when moving items.

## Risks / Trade-offs

- **Migration:** Existing items need default (null) subcategory value. Mitigated by treating null as "uncategorized" default group.
- **Display:** Subcategories without items should not display. Mitigated by filtering empty subcategories.
- **Reordering Complexity:** Moving items between subcategories requires UI that clearly shows subcategory options. Mitigated by adding a dropdown or drag target.

## Migration Plan

1. Add subcategory column to compartment_items table
2. Update compartment editing UI to add subcategory management
3. Update checkoff page to display grouped items
4. Extend reordering to support subcategories
5. Test with existing compartments (items default to uncategorized)
6. Deploy to production

## Open Questions

- Should there be a limit on number of subcategories per compartment? (Recommend: No hard limit, practical limit of ~10)
- Should subcategories be required for new items? (Recommend: No, items can be added without subcategory and assigned later)