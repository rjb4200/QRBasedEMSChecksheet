## 1. Implementation

- [ ] 1.1 Add or reuse a display-name sorting helper for mixed compartment/kit target lists.
- [ ] 1.2 Update the unit checkoff page to sort combined compartments and kits alphabetically by display name.
- [ ] 1.3 Update the `/admin/units/[id]` unit builder page to use the same mixed alphabetical display order.
- [ ] 1.4 Preserve existing target routes, checkoff status mapping, QR location note display, restocking list input, and item ordering.

## 2. Verification

- [ ] 2.1 Verify the unit checkoff page shows compartments and kits mixed together in A-Z order.
- [ ] 2.2 Verify `/admin/units/[id]` shows compartments and kits mixed together in the same A-Z order.
- [ ] 2.3 Verify item order inside each compartment/kit is unchanged.
- [ ] 2.4 Verify type checking passes.
- [ ] 2.5 Run lint/build if feasible.