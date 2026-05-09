# Tasks: Add Unit Display Order

## Database

- [ ] Add `sort_order` field to `units` table.
- [ ] Add migration/backfill for existing units.
- [ ] Verify stable ordering after migration.

## Shared ordering logic

- [ ] Create shared unit ordering helper/query logic.
- [ ] Standardize fallback ordering behavior.
- [ ] Add tests for duplicate/null order values.

## Admin UI

- [ ] Add editable unit order field/control in admin unit management.
- [ ] Add validation and save behavior.
- [ ] Verify mobile and desktop usability.

## Operational views

- [ ] Apply ordering to Fleet panel.
- [ ] Apply ordering to user unit selection/checkoff-start views.
- [ ] Apply ordering to unit check sheet navigation/lists.
- [ ] Apply ordering to dashboard/status summaries grouped by unit.

## Print/PDF/email

- [ ] Apply ordering to `/admin/checksheets/print`.
- [ ] Apply ordering to daily emailed checksheet PDFs.
- [ ] Apply ordering to daily email summary body sections.
- [ ] Apply ordering to export-generated PDFs.

## Records/exports

- [ ] Apply ordering to records/archive views.
- [ ] Apply ordering to CSV/export outputs.
- [ ] Preserve ordering in truck layout export/import workflows.

## Equipment Catalog

- [ ] Apply ordering to unit usage badge displays.

## Documentation

- [ ] Update OpenSpec/design docs.
- [ ] Update ADMINGUIDE.md if present.
- [ ] Document ordering behavior for future developers.

## Validation

- [ ] Verify consistent ordering across all operational views.
- [ ] Verify archived/OOS visibility rules remain unchanged.
- [ ] Verify null and duplicate order values behave correctly.
