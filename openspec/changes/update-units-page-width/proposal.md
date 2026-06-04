## Why

The admin units page uses `max-w-6xl` while the rest of the admin pages now use `max-w-7xl` as the standard. Updating the units page to match ensures consistent page alignment.

## What Changes

- Change the container `max-w-6xl` to `max-w-7xl` on `/admin/units`.

## Capabilities

### Modified Capabilities

- `fleet-dashboard`: Admin units page uses the standard `max-w-7xl` page width.

## Impact

- Affects `src/app/admin/units/page.tsx`.
