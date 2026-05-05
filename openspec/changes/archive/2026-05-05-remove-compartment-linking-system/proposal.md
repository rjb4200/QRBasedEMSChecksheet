## Why

The compartment linking system has become an operational failure point: it adds setup confusion, complicates item management, and has not worked reliably enough to justify continued maintenance. The application should return to the simpler QR-based model where each compartment is independent and each checkoff affects only the scanned compartment.

## What Changes

- **BREAKING:** Remove compartment linking as an application feature.
- Remove admin UI controls, labels, forms, and helper text for linked compartments.
- Remove runtime reads and writes of `unit_compartments.linked_group` and any shared-compartment item behavior from unit configuration flows.
- Stop copying or preserving linked-compartment state during compartment import/copy workflows.
- Ensure crew checkoff routes, submissions, QR generation, QR printing, and fleet completion logic treat each compartment independently.
- Remove or update documentation and OpenSpec artifacts that describe linked-compartment behavior as supported.
- Add a database cleanup migration where safe, or otherwise leave legacy columns/tables ignored by the application until a later cleanup.

## Capabilities

### New Capabilities
- `independent-compartments`: Defines the system behavior that every unit compartment is configured, checked, completed, and printed independently with no linked-compartment side effects.

### Modified Capabilities
- None

## Impact

- Admin unit management: `src/app/admin/units/actions.ts`, `src/app/admin/units/[id]/page.tsx`
- Unit compartment queries and item management logic using `linked_group`, `shared_compartment_items`, and `shared_item_id`
- Supabase migrations and generated database types, especially `20260430140000_link_unit_compartments.sql` and later shared-item references if present
- Documentation: `ADMINGUIDE.md` and active OpenSpec changes that still propose linked-compartment work
- Verification: `npm run lint`, `npm run typecheck`, `npm run build`
