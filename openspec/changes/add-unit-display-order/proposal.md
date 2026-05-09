# Add Unit Display Order

## Summary

Add configurable unit display ordering so admins can control the order units appear throughout operational, admin, print, email, export, and reporting views.

## Motivation

Units currently appear in a fixed/default order, usually name-based or query-defined. This does not always match the department's preferred operational order. The app should provide one shared unit order source so Fleet panel views, checkoff flows, printouts, emailed PDFs, records, exports, and admin lists stay consistent.

## Scope

### In scope

- Add a numeric unit ordering field, such as `display_weight` or `sort_order`, to the `units` table.
- Backfill existing units with stable default values.
- Allow admins to edit unit order from the unit management/admin panel.
- Apply the configured order anywhere units are shown in user-facing or admin-facing unit lists.
- Update print, PDF, email, export, archive, and report views to use the same order source.
- Preserve existing visibility/filtering rules for archived, deleted, and OOS units.
- Update documentation/specs for the new behavior.

### Out of scope

- Changing unit status or archive behavior.
- Changing compartment or equipment ordering, except where unit-level order affects parent grouping.
- Replacing existing sort behavior for non-unit lists unless those lists are grouped by unit.

## Desired behavior

Admins can set a numeric order/weight for each unit. Lower values appear first. Blank or equal values fall back to a stable secondary order, normally unit name.

The configured order should apply consistently to:

- Fleet panel.
- Admin unit management list.
- User unit selection/checkoff start views.
- Unit check sheet navigation or unit lists.
- `/admin/checksheets/print`.
- Daily emailed checksheet PDF attachments.
- Daily report email body sections, including unchecked units and exceptions.
- Records/archive views when records are grouped or listed by unit.
- CSV/PDF/export outputs that contain multiple units.
- Dashboard/status summaries grouped by unit.
- Truck layout export/import preview and exported layout metadata.
- Equipment Catalog usage badges when multiple unit usages are shown.
- Any API response used to populate frontend unit lists.

## Acceptance criteria

- Admin can set or change each unit's display order.
- Units with lower order values appear before higher order values.
- Units with equal or blank order values fall back to stable name ordering.
- The same order is used by Fleet panel, admin unit list, user unit selection, checkoff pages, printouts, daily email body, daily email PDF, records/archive views, exports, and unit-grouped dashboard/status summaries.
- Database migration safely backfills existing units with sensible order values.
- Archived/deleted/OOS visibility rules remain unchanged; only ordering changes.
- Import/export of truck layouts preserves unit ordering.
- OpenSpec/design documentation is updated.

## Related issue

- GitHub Issue #3: Add unit display weight/order controls for Fleet panel and printouts
