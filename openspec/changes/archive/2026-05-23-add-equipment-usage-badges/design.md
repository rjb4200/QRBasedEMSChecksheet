## Context

The Equipment Catalog currently shows a numeric usage count per item via a simple count from `unit_compartment_items` and `kit_items`. This issue extends that to show named badges — unit and compartment/kit names — providing admins with immediate visibility into exactly where each catalog item is assigned.

## Goals / Non-Goals

**Goals:**
- Show named usage badges on each catalog row using `{unitName} / {targetName}` format.
- Resolve names through the existing foreign key relationships.
- Handle overflow with a `+N more` indicator.
- Keep unused items visually distinct.
- Preserve existing read-only row editing, icon actions, and pagination.

**Non-Goals:**
- Do not change equipment assignment behavior.
- Do not change checkoff, Records, email, or crew-facing behavior.
- Do not redesign the catalog row layout.

## Decisions

### Decision 1: Replace the count badge with named badges

Replace the single numeric badge with named badges showing unit and compartment/kit names.

Rationale: The count badge already proves the data is available. Named badges are the natural next step for the usability goal of this issue.

### Decision 2: Resolve names server-side

Query `unit_compartments` and `units` for compartment usage, and `kits` plus `unit_kits` → `units` for kit usage. Build a map of usage details per equipment ID.

Rationale: Doing name resolution server-side on the catalog page keeps the data fetching pattern consistent with how the catalog page already works.

### Decision 3: Show first few badges with overflow

For items with many usages, show the first 3-4 badges followed by a `+N more` text. For unused items, show a distinct `Unused` badge.

Rationale: Items used on every unit could have dozens of references. Showing all would break the row layout. A compact overflow pattern keeps the catalog scannable.

## Risks / Trade-offs

- **Risk**: Name resolution queries could be expensive on large catalogs. -> **Mitigation**: Use a single joined subquery or precompute the usage map in memory from flat fetches.
- **Risk**: Badges could crowd the row on small screens. -> **Mitigation**: Use overflow and compact badge styling.

## Migration Plan

1. Update the equipment catalog page query to resolve usage names.
2. Update `EditableCatalogRow` to render named badges with overflow.
3. Run lint, typecheck, and build.
