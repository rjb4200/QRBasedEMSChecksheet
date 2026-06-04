## Why

Several admin pages use narrower `max-w-6xl` or `max-w-5xl` containers while the Fleet Panel and other admin pages use `max-w-7xl`. This creates inconsistent page widths across the admin area. Additionally, some pages still show a redundant "Admin" red label at the top that adds visual noise without providing useful context.

## What Changes

- Standardize admin page containers to `max-w-7xl` where they currently use narrower values.
- Remove the "Admin" red text label from admin page headers.
- Preserve all existing content, rendering, and behavior.

## Capabilities

### New Capabilities
- (none — this is a formatting cleanup)

### Modified Capabilities
- `fleet-dashboard`: Admin pages are now consistently formatted with the same container width.

## Impact

- **Pages updated**: `admin/units/[id]`, `admin/kits/[id]`, `admin/units/[id]/qr`, `admin/archives/[id]`, `admin/checksheets/print`, `admin/archives/print`, `admin/analytics`, `admin/system-log`, `admin/equipment`, `admin/archives`
- **Behavior**: No route or data changes.
