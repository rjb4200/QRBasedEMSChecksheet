## Context

The current implementation includes a compartment linking feature centered on `unit_compartments.linked_group`. Admins can set a link group from the unit detail page, and `addUnitItem` expands one item add into multiple compartments that share the same link group within a unit. Importing a compartment also preserves `linked_group`, which can unexpectedly recreate links during layout reuse.

Current linkage touchpoints found in the codebase include:

- `src/app/admin/units/actions.ts`: `linkUnitCompartment`, `importUnitCompartment`, and `addUnitItem` read or write `linked_group`.
- `src/app/admin/units/[id]/page.tsx`: imports `linkUnitCompartment`, selects `linked_group`, displays `Linked: ...`, and renders the link group form.
- `supabase/migrations/20260430140000_link_unit_compartments.sql`: adds `unit_compartments.linked_group` and an index.
- Documentation and active OpenSpec changes still describe linked compartments as supported behavior.

The target model is simpler: unit compartments are standalone records, QR codes route to exactly one compartment, and checkoff status is based only on direct check records for that compartment.

## Goals / Non-Goals

**Goals:**

- Remove linked-compartment UI from admin pages.
- Remove runtime reads/writes of `linked_group` and any shared linked-compartment behavior.
- Ensure item management applies only to the selected compartment.
- Ensure import/copy flows do not preserve or create links.
- Remove documentation references that present linking as supported.
- Clean up database schema once code no longer depends on linking.

**Non-Goals:**

- Redesigning compartments, unit creation, unit import/copy, or equipment catalog behavior.
- Changing QR route shape or QR print behavior except to ensure no link annotations remain.
- Changing daily checkoff archive semantics beyond removing link side effects.
- Replacing linking with another shared-layout feature.

## Decisions

### 1. Remove runtime behavior before schema cleanup

**Decision:** First remove all application reads/writes of linking fields, then add a database cleanup migration.

**Rationale:** This keeps deployment safe. If the database still contains legacy columns for one deploy, the app will ignore them. Once no runtime dependency remains, schema cleanup is low risk.

**Alternative considered:** Drop database fields first. Rejected because stale generated types or runtime queries selecting `linked_group` would fail immediately.

### 2. Treat shared item linkage as linking-only unless proven otherwise

**Decision:** Remove or ignore shared-compartment item behavior tied to linked compartments. Item operations should use `unit_compartment_items` directly for the selected compartment.

**Rationale:** The desired system has independent compartment item lists. Any shared table or `shared_item_id` reference used only to synchronize linked compartments should not remain part of item-management logic.

**Alternative considered:** Keep shared item tables for future reuse. Rejected unless implementation proves they are used by a non-linking feature, because leaving them in active code preserves complexity.

### 3. Prefer deleting UI over disabling it

**Decision:** Remove link forms, labels, actions, helper text, and imports instead of hiding them behind conditions.

**Rationale:** Hiding keeps dead code and future confusion. The requirement is feature removal, not temporary disablement.

### 4. Update linked-compartment OpenSpec work as obsolete

**Decision:** Remove or archive active proposals that only add linked-compartment functionality after this removal is complete.

**Rationale:** Keeping pending changes like full link sync or linked count badges conflicts with the new direction.

## Risks / Trade-offs

- **Legacy data remains temporarily** -> Mitigate by ignoring it in application code before schema cleanup.
- **Generated Supabase types may reference removed fields** -> Mitigate by regenerating or manually updating types after migration if generated types exist in the repo.
- **Documentation drift** -> Mitigate by searching docs and OpenSpec changes for linked-compartment terms and updating/removing references.
- **Hidden code paths still read `linked_group`** -> Mitigate with repository-wide search for `linked_group`, `shared_compartment`, `shared_item_id`, `linkUnitCompartment`, and linked-compartment wording.

## Migration Plan

1. Remove admin UI and actions for linking.
2. Simplify item add/delete/update logic so each operation targets only one compartment.
3. Remove link preservation from unit or compartment copy/import flows.
4. Verify crew checkoff, QR generation, QR printing, and fleet completion logic have no linked-compartment dependency.
5. Update docs and obsolete OpenSpec references.
6. Add a Supabase migration to drop linking-only columns, indexes, constraints, and tables if no runtime dependency remains.
7. Run `npm run lint`, `npm run typecheck`, and `npm run build`.

## Open Questions

- Should the implementation physically drop `shared_compartment_items` and `unit_compartment_items.shared_item_id` immediately if present, or only stop using them in the first pass and drop them in a follow-up cleanup?
- Should active OpenSpec changes that depend on linking be archived as canceled/obsolete in the same implementation session or handled separately?
