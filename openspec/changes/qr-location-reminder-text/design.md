## Context

The unit dashboard currently renders each compartment/kit as a compact status card with no inline location assistance. The admin unit editor already lists compartments and assigned kits, and uses `details`/`summary` disclosure UI in several places. Shared kits are reused across units, but their physical QR/NFC label locations are unit-specific, so kit reminders must live on `unit_kits`, not `kits`.

## Goals / Non-Goals

**Goals:**
- Store optional QR location reminder text for each unit compartment.
- Store optional QR location reminder text for each unit-kit assignment.
- Let admins edit reminder text from Admin -> Units -> Edit Unit.
- Show reminders only inside collapsed-by-default expandable content on the unit dashboard.
- Keep the unit dashboard visually clean when reminders are absent.

**Non-Goals:**
- Do not add images or upload flows.
- Do not add modals, banners, or permanent visible helper labels.
- Do not change checkoff forms, submission, completion, records/archive, or QR/NFC routing.
- Do not store kit reminder text on the shared `kits` table.

## Decisions

### Decision 1: Add nullable text columns on unit-specific tables

Add `qr_location_note text null` to `public.unit_compartments` and `public.unit_kits`.

Rationale: Compartments are already unit-scoped. Kit reminders must be assignment-scoped because the same shared kit can be mounted in different physical places on different units.

### Decision 2: Use server actions for reminder saves

Add focused server actions for updating compartment and assigned-kit QR location notes. Trim whitespace and persist empty input as `null`.

Rationale: This keeps the edit behavior consistent with existing admin unit actions and avoids broad update forms that could accidentally modify unrelated layout fields.

### Decision 3: Reuse disclosure UI on the unit dashboard

Render a small `details`/`summary` disclosure only for targets with non-empty reminder text. Use subtle styling and place the expanded reminder near the bottom of the target card.

Rationale: Existing app patterns already use disclosure controls. Rendering no control for empty notes preserves the current clean layout.

### Decision 4: Keep reminder data out of checkoff logic

Read reminder text only for unit dashboard and admin edit views. Do not pass it into checkoff form setup, completion, restock, archive, or QR redirect logic.

Rationale: Reminder text is navigational/wayfinding help and must not affect operational checkoff state.

## Risks / Trade-offs

- **Risk**: Added text fields could clutter the admin unit edit page. -> **Mitigation**: Keep fields compact, optional, and located within each existing compartment/kit section.
- **Risk**: Crews may expect reminders everywhere QR links appear. -> **Mitigation**: First version scopes display to the unit dashboard only, matching the request.
- **Risk**: Empty strings may render blank reminder boxes. -> **Mitigation**: Trim text and store empty values as `null`; render disclosure only for truthy trimmed notes.

## Migration Plan

1. Add migration for nullable `qr_location_note` columns on `unit_compartments` and `unit_kits`.
2. Update admin unit queries/forms/actions to edit reminder text.
3. Update unit dashboard query/cards to read and display reminder text with disclosure UI.
4. Run lint/typecheck/build and manual checks.
5. Rollback: drop the columns and remove the admin/dashboard UI/actions.
