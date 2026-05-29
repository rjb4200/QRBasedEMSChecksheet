## 1. Data Pipeline

- [x] 1.1 Query `unit_compartment_items` joined through `unit_compartments` to `units` for compartment usage names
- [x] 1.2 Query `kit_items` joined through `kits` and `unit_kits` to `units` for kit usage names
- [x] 1.3 Build a usage details map per equipment ID with unit name and target name
- [x] 1.4 Pass usage details into the catalog page data
- [x] 2.1 Update `EditableCatalogRow` to render named badge tags instead of a single count badge
- [x] 2.2 Show the first 3 usage badges with a `+N more` indicator for overflow
- [x] 2.3 Keep unused items visually distinct from used items
- [x] 2.4 Preserve the existing read-only row editing, icon actions, and category/type/par fields
- [x] 3.1 Run `npm run lint`
- [x] 3.2 Run `npm run typecheck`
- [x] 3.3 Run `npm run build`
- [ ] 3.4 Manual test: named badges appear for used items
- [ ] 3.5 Manual test: Unused badge appears for unused items
- [ ] 3.6 Manual test: +N more appears for heavily used items
- [ ] 3.7 Manual test: existing edit/save/cancel/delete still works
