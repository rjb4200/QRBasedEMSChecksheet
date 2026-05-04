## Why

Admin users need the ability to backup and restore truck layouts (compartment configurations including equipment, par levels, subcategories, and ordering). This provides protection against data loss, enables transferring configurations between units, and supports disaster recovery. Currently, there is no way to export or import these configurations.

## What Changes

- Add export functionality to download a unit's complete truck layout as a JSON file
- The export includes: unit name, all compartments, equipment items with par levels, subcategories, and ordering
- Add import functionality to restore a truck layout from a JSON file
- Import can apply to a new unit or update an existing unit's layout
- Export/import buttons available on the admin units page

## Capabilities

### New Capabilities

- `truck-layout-export`: Ability to export a unit's complete truck layout to a JSON file for backup.
- `truck-layout-import`: Ability to import a truck layout from a JSON file to restore or update a unit.

## Impact

- New API endpoints for export and import operations
- New UI buttons on admin units page for export/import
- File handling for JSON import
- No database schema changes required