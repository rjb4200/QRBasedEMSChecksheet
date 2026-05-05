## Context

The app currently models checkoff targets as unit compartments only. A compartment has `unit_compartment_items`; a check record uses `compartment_checks.unit_id` and required `compartment_id`; fleet status, QR generation, crew unit pages, checkoff routes, print documents, records, analytics, and discrepancy reports all assume compartment-only targets.

The recently removed compartment linking system tried to synchronize separate compartment records. Shared kits should use a different architecture: a kit exists once, `unit_kits` assigns that kit to units, and each assignment gets independent checkoff state.

## Goals / Non-Goals

**Goals:**

- Add central kit management under `/admin/kits`.
- Store kits once and assign them to units by reference.
- Make assigned kits appear beside compartments for admins and crews.
- Keep assigned kit editing read-only on unit pages with direct links back to the kit editor.
- Give each unit kit assignment its own checkoff state and QR code.
- Include assigned kits in fleet status, printouts, records, alerts, and exception/discrepancy reports.
- Preserve historical kit check records after future kit edits by storing submitted values in check records.

**Non-Goals:**

- Reintroducing linked compartments or sync behavior.
- Making unit-assigned kits editable from unit pages.
- Duplicating kit item rows into each unit assignment.
- Removing normal compartments or changing the equipment catalog.

## Decisions

### 1. Use shared-reference tables

**Decision:** Add `kits`, `kit_items`, and `unit_kits`.

**Rationale:** The source of truth for a kit layout remains one kit definition. Assignments reference the kit instead of duplicating item rows, so changes to the kit definition are immediately visible everywhere the kit is assigned.

**Alternative considered:** Clone kit items into each unit assignment and synchronize changes. Rejected because that recreates the failed linking model.

### 2. Extend existing checkoff records with one target constraint

**Decision:** Extend `compartment_checks` with nullable `unit_kit_id`, make `compartment_id` nullable, and enforce that exactly one target is set.

```sql
alter table public.compartment_checks add column unit_kit_id uuid references public.unit_kits(id) on delete cascade;
alter table public.compartment_checks alter column compartment_id drop not null;
alter table public.compartment_checks add constraint compartment_checks_one_target check (
  (compartment_id is not null and unit_kit_id is null)
  or
  (compartment_id is null and unit_kit_id is not null)
);
```

**Rationale:** This is the least disruptive model for existing checkoff, archive, print, and analytics code. A check remains one row with `item_data`, status, timing, unit, shift, and checked-by metadata.

**Important:** The existing unique constraint on `(unit_id, compartment_id, shift_date, shift_period)` must be replaced with partial unique indexes or a broader uniqueness strategy that supports kit rows.

Recommended indexes:

```sql
create unique index compartment_checks_compartment_target_unique
  on public.compartment_checks (unit_id, compartment_id, shift_date, shift_period)
  where compartment_id is not null;

create unique index compartment_checks_kit_target_unique
  on public.compartment_checks (unit_id, unit_kit_id, shift_date, shift_period)
  where unit_kit_id is not null;
```

**Alternative considered:** Add a separate `kit_checks` table. Rejected for the first implementation because it would duplicate submission, archive, report, and print flows.

### 3. Introduce an internal ChecksheetTarget model

**Decision:** Normalize compartments and unit kit assignments into an internal target shape before rendering crew UI, QR output, and print documents.

```ts
type ChecksheetTarget =
  | { targetType: "compartment"; id: string; unitId: string; name: string; sortOrder: number; photoUrl?: string | null; items: CompartmentItem[] }
  | { targetType: "kit"; id: string; kitId: string; unitId: string; name: string; sortOrder: number; photoUrl?: string | null; items: KitItem[] };
```

**Rationale:** Crew and reporting surfaces can treat both as checkoff targets while keeping routing and storage explicit.

### 4. Add explicit kit checkoff routes

**Decision:** Add kit-specific checkoff routes instead of overloading the current compartment route.

Recommended first implementation:

- Existing: `/checkoff/{unitId}/{compartmentId}` remains for compartments.
- New: `/checkoff/{unitId}/kit/{unitKitId}` for assigned kits.

**Rationale:** This is explicit, preserves existing QR URLs, and keeps route params understandable. A more general `/units/{unitId}/checks/{targetType}/{targetId}` route can be considered later.

### 5. Unit page displays kits read-only

**Decision:** On unit admin pages, render assigned kits in the same ordered card list as compartments, using `sort_order` from `unit_compartments` and `unit_kits`. Kit cards use `<details>` collapsed by default and show read-only item lists plus an `Edit Kit` link.

**Rationale:** Admins can see the full unit layout without mistaking shared kit items for unit-specific compartment items.

### 6. Kit deletion is blocked while assigned

**Decision:** Deleting a kit fails if any `unit_kits` rows reference it.

**Rationale:** This prevents shared layouts from disappearing from active units and matches the `on delete restrict` assignment relationship.

## Risks / Trade-offs

- **Large surface area:** Kits affect admin UI, crew UI, QR, fleet status, archives, and reports -> Mitigate with phased implementation and validation after each layer.
- **Existing reports assume `compartment_id`:** Queries and CSV headers may need generalized target naming -> Mitigate by preserving compatible labels like "Compartment/Kit" internally while keeping UI wording simple.
- **Unique constraint migration risk:** Existing `compartment_checks` uniqueness must be migrated carefully -> Mitigate with explicit drop/recreate indexes and typecheck/build validation.
- **Historical layout drift:** Future kit edits change current layout but not old `item_data` -> Mitigate by using stored item IDs/values in check records and rendering historical data defensively when kit items change later.

## Migration Plan

1. Add `kits`, `kit_items`, and `unit_kits` tables with RLS policies matching existing admin/service patterns.
2. Extend `compartment_checks` to allow either compartment or unit kit assignment targets.
3. Add admin Kits navigation and kit CRUD actions/pages.
4. Add unit assignment/removal and kit-to-compartment clone flows.
5. Add kit checkoff route and shared target rendering helpers.
6. Update QR generation/print routes for kit assignment QR codes.
7. Update fleet status, records, checksheet documents, alerts, analytics, and discrepancy reports.
8. Run `npm run lint`, `npm run typecheck`, and `npm run build`.

## Open Questions

- Should kit photos use the existing `compartment-photos` bucket under a `kits/` prefix, or should a dedicated `kit-photos` bucket be created?
- Should archive/CSV labels say "Compartment" for both targets to preserve existing print wording, or change to "Target" / "Compartment or Kit"?
