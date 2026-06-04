## Why

Admin pages used inconsistent maximum widths: Fleet Panel and System Log used `max-w-7xl`, but Archives, Equipment, Users, and Docs used narrower widths. Standardizing to `max-w-7xl` ensures consistent page alignment across the admin interface.

## What Changes

- Update all admin `section` and `div` container elements to use `max-w-7xl`.
- Affected pages: Archives list, Equipment catalog, Admin guide viewer (already done: Users, Fleet Panel, System Log, Kits list).

## Capabilities

### Modified Capabilities

- `fleet-dashboard`: Page width standard `max-w-7xl` is adopted across admin pages originating from the Fleet Panel standard.

## Impact

- Affects `archives/page.tsx`, `equipment/page.tsx`, `docs/page.tsx`.
