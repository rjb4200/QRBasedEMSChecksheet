## Why

Section comments submitted during compartment and kit checkoffs are visible on the crew unit dashboard but cannot be reviewed later from the admin Records page. Adding section comments to the Records page makes them part of the historical daily record so admins can see what was reported about specific compartments and kits on any given day.

## What Changes

- Load `daily_section_comments` for the selected date and unit in the Records page data pipeline.
- Add section comments to the Records read model and display them under each unit record.
- Label each comment with its source compartment or kit name.
- Keep unit-level comments separate from section comments.
- Hide the section comments block when no section comments exist.
- Preserve existing Records filtering, CSV export, and print behavior.

## Capabilities

### New Capabilities
- `records-section-comments`: The Records page displays historical section comments from compartment and kit checkoffs for the selected date and unit.

### Modified Capabilities
- `archive-history`: The Records page read model and display now include section comments alongside unit-level comments.

## Impact

- **Records page data pipeline**: Update `src/lib/archive-records.ts` to query `daily_section_comments`.
- **Records page UI**: Update `src/app/admin/archives/page.tsx` to render section comments.
- **Behavior**: No changes to checkoff, comment entry, archive logic, email reports, or print layout.
