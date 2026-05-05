## Context

The application currently organizes EC4 layout data as compartments, shared kits, and item rows. `unit_compartment_items` already has nullable `subcategory` and `subcategory_sort_order` fields, but this is a lightweight text grouping and does not support first-class admin-managed groups, group deletion semantics, or preserved relationships during copy/clone workflows. Kits do not currently have an equivalent grouping structure.

## Goals / Non-Goals

**Goals:**
- Add first-class visual groups for compartment items and kit items.
- Keep groups optional so existing ungrouped data continues to work.
- Use native `<details>` sections for stable collapsible rendering.
- Preserve existing checkoff payloads, QR behavior, completion counts, and archive logic.
- Preserve group relationships when copying/importing/cloning layouts.

**Non-Goals:**
- Groups are not checkoff targets.
- Groups do not have QR codes, completion status, or check records.
- Groups do not affect fleet totals, reporting totals, discrepancy logic, or archive data shape.
- This change does not introduce drag-and-drop sorting unless already consistent with the existing UI style.

## Decisions

- Use separate group tables: `unit_compartment_item_groups` for compartments and `kit_item_groups` for kits. This avoids polymorphic references and keeps foreign keys simple.
- Add nullable `group_id` columns to `unit_compartment_items` and `kit_items` with `ON DELETE SET NULL`. Deleting a group ungroups items without deleting equipment assignments.
- Keep existing `sort_order` fields on item rows. Group order is controlled by group `sort_order`; item order remains item `sort_order` within each group.
- Render order is groups by `sort_order`, then grouped items by `sort_order`, then ungrouped items by `sort_order`.
- Crew checkoff groups default open. Admin page default can be open or collapsed, but must remain consistent and visually clear.
- Historical check records remain item-ID keyed and do not store group data.
- Copy/clone workflows must remap group IDs between source and destination parents before inserting copied items.

## Risks / Trade-offs

- Group UI can make already large admin pages more complex. Mitigation: wrap the existing item controls with grouping controls rather than rewriting item editing.
- Existing `subcategory` fields overlap conceptually with groups. Mitigation: group tables become the durable grouping model; existing subcategory data may be migrated into groups where practical or left as legacy display metadata during implementation.
- Copy/clone workflows can accidentally point copied items at source group IDs. Mitigation: build explicit old-to-new group maps for each copied parent.
- Empty groups may clutter crew checkoff. Mitigation: hide empty groups in crew UI and keep them visible/manageable in admin UI.
- Sorting collisions are possible. Mitigation: fallback ordering uses `created_at` then `id`.

## Migration Plan

1. Add compartment and kit group tables with RLS/admin policies consistent with existing layout tables.
2. Add nullable `group_id` columns and indexes to item tables.
3. Optionally backfill groups from existing `subcategory` values where useful, assigning item `group_id` while preserving old fields.
4. Update admin and checkoff queries to load groups and item group references in the same page-level query.
5. Update copy/import/clone actions to duplicate groups and remap item references.

## Open Questions

- Should existing `subcategory` values be backfilled into real groups automatically during migration, or should they remain legacy metadata until manually organized?
- Should admin group sections default open or collapsed?
