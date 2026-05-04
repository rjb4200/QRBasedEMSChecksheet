## Context

Currently, there is no way to backup or restore truck (unit) layouts. If a unit's configuration is lost or needs to be duplicated to another unit, admins have no built-in mechanism to do this. Export/import functionality would provide simple backup and restore capabilities.

## Goals / Non-Goals

**Goals:**
- Export unit layout to JSON file with all compartment configurations
- Import layout from JSON file to restore or update a unit
- Include equipment items, par levels, subcategories, and ordering in export
- Make export/import accessible from admin units page

**Non-Goals:**
- Importing to different unit names (layout only, not unit metadata)
- Scheduled automatic backups
- Cloud backup integration

## Decisions

### 1. Export Format

**Decision:** Use JSON format for export file.

**Rationale:** JSON is readable, widely supported, and easy to parse. It handles the nested structure of compartments, items, and subcategories well.

**Export Structure:**
```json
{
  "version": "1.0",
  "exportedAt": "ISO timestamp",
  "unitName": "unit name from export",
  "compartments": [
    {
      "name": "compartment name",
      "position": 1,
      "subcategories": [
        {
          "name": "subcategory name",
          "position": 1
        }
      ],
      "items": [
        {
          "name": "item name",
          "par": 5,
          "position": 1,
          "subcategory": "subcategory name or null"
        }
      ]
    }
  ]
}
```

### 2. Import Behavior

**Decision:** Import adds new compartments/items or updates existing ones based on matching names.

**Rationale:** This allows both creating new layouts and updating existing ones. Items matched by name, compartments matched by name.

**Strategy:**
- If compartment exists, update it; if not, create new
- If item exists in compartment, update par/position/subcategory; if not, create new
- Remove items not in import file? No - import should only add/update, not delete

### 3. File Handling

**Decision:** Use browser-based file upload/download through the UI.

**Rationale:** No server-side file storage needed. Browser handles the file directly.

### 4. UI Placement

**Decision:** Add export button next to each unit on the admin units page. Add import button in a prominent location (e.g., top of units list or in a menu).

**Rationale:** Export is most useful per-unit. Import is typically done once when setting up a new unit.

## Risks / Trade-offs

- **Invalid File:** User could import malformed JSON. Mitigated by validating structure before import and showing clear error messages.
- **Version Compatibility:** Future format changes. Mitigated by including version in export file.
- **Data Loss on Import:** Import might overwrite existing configuration. Mitigated by allowing admin to confirm before import.

## Migration Plan

1. Create export API endpoint that generates JSON from unit's compartments
2. Create import API endpoint that parses JSON and updates/creates compartments
3. Add export button to admin units page (per unit)
4. Add import button to admin units page
5. Test export/import with various layouts
6. Deploy to production

## Open Questions

- Should export include daily_unit_items (checkoff data)? (No - export is for layout/configuration only)
- Should we allow exporting all units at once? (Not required - per-unit export is sufficient)