## Why

Archive record detail pages currently show placeholder metadata such as "Not recorded" and "No status note" when historical timing or snapshot fields are empty. This adds visual clutter and makes otherwise valid historical records appear incomplete.

## What Changes

- Hide empty archive metadata fields instead of rendering placeholder-heavy rows.
- Keep meaningful operational archive fields visible, including shift, operational date, archived/submitted timestamp, completion count, completion percentage, unit comments, and check data.
- Rename the detail-page submitted timestamp label to "Archived At" when it represents archive creation time.
- Preserve all existing archive data and historical check rendering.

## Capabilities

### New Capabilities

### Modified Capabilities
- `past-checkoff-record-summary`: Archive detail pages should render only meaningful metadata and hide empty timing/snapshot/user fields.

## Impact

- `src/app/admin/archives/...` or Records archive detail page components that render archive metadata.
- No database schema changes.
- No checkoff submission, archive generation, or historical data changes.
