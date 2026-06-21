## Context

Unit checkoff targets are represented by two tables: `unit_compartments` for unit-owned compartments and `unit_kits` for kit assignments. Both tables already have `sort_order` columns, and the unit checkoff page, admin unit builder, QR labels, and historical/archive views rely on those persisted weights when displaying mixed unit targets.

The initial issue request asked for mixed A-Z display order. The selected product direction is different: keep persisted `sort_order` as the source of truth and add a one-click admin action that rewrites those weights into mixed alphabetical order.

## Goals / Non-Goals

**Goals:**

- Add a unit builder action that sorts compartments and assigned kits together by visible name.
- Persist the resulting order into existing `sort_order` columns.
- Continue using existing sort-order rendering paths after the action runs.
- Keep manual ordering possible after alphabetizing by using weighted values with gaps.

**Non-Goals:**

- Do not add a database schema change or migration.
- Do not replace existing `sort_order` rendering with an automatic display-only alphabetical sort.
- Do not change item or group ordering inside compartments or kits.
- Do not change global kit management order on the Kits admin pages.

## Decisions

- Persist the A-Z order rather than sorting only at render time.
  - Rationale: This preserves the current weighted ordering system as the single source of truth and keeps downstream views aligned without duplicating sort logic.
  - Alternative considered: Display-only sorting on the unit checkoff and builder pages. Rejected because it would make stored sort weights misleading and leave other sort-order-driven views inconsistent.

- Sort one mixed target list by visible name, case-insensitively.
  - Rationale: Crews and admins scan by the names displayed on cards/sections, not by database type or old weights.
  - Alternative considered: Sort compartments and kits separately. Rejected because the issue explicitly wants kits mixed with compartments.

- Rewrite weights in increments of 10.
  - Rationale: Gapped weights preserve room for later manual insertions without immediately renumbering every target.
  - Alternative considered: Use contiguous weights of 1, 2, 3. Rejected because it is less friendly to manual adjustment.

## Risks / Trade-offs

- Running the action overwrites any existing custom mixed order -> The action is explicit and admin-triggered, not automatic.
- Newly added targets after alphabetizing may not automatically land alphabetically -> Admins can rerun the action when they want to normalize ordering again.
- Partial update failure could leave some weights changed and others unchanged -> The implementation should throw on any failed update so the admin sees an error rather than silent success.
