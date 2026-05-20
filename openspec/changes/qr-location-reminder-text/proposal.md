## Why

Crews may know which compartment or kit needs checking but forget where the physical QR/NFC tag is located, especially on reserve units, uncommon compartments, or after apparatus layout changes. Optional expandable reminder text helps crews find the tag without cluttering the clean unit dashboard.

## What Changes

- Add optional QR location reminder text for unit compartments.
- Add optional QR location reminder text for unit-assigned kits, stored on the assignment so the same kit can have different locations on different units.
- Allow admins to edit reminder text from Admin -> Units -> Edit Unit.
- Show reminder text on the unit dashboard only inside an expanded inline section.
- Reuse the existing disclosure/expand-collapse interaction style already used elsewhere in the app.
- Do not show any reminder UI when the field is empty.
- Keep checkoff, QR/NFC navigation, completion logic, records/archive behavior, and existing unit dashboard layout fundamentally unchanged.

## Capabilities

### New Capabilities
- `qr-location-reminders`: Optional QR/NFC physical-location reminder text for unit compartments and assigned kits, editable by admins and shown subtly on unit dashboards.

### Modified Capabilities
<!-- None. -->

## Impact

- **Database**: Add nullable `qr_location_note` columns to `unit_compartments` and `unit_kits`.
- **Admin UI/actions**: Update Admin -> Units -> Edit Unit to read and save reminder text for compartments and assigned kits.
- **Unit dashboard UI**: Add collapsed inline reminder disclosure for targets with reminder text.
- **Behavior**: No changes to checkoff submission, completion, records/archive, or QR/NFC routing.
