## Why

When a unit is marked as OOS (Out of Service) or archived, admin users and supervisors need immediate visual recognition of this status. Currently, there is no clear visual indicator on the fleet panel or unit pages to show these statuses, making it difficult to quickly identify which units are active versus inactive.

## What Changes

- Add "OOS" badge with orange styling to fleet panel unit cards for OOS units
- Add "ARCHIVED" badge with grey styling to fleet panel unit cards for archived units
- Add corresponding badges to unit detail pages showing OOS or archived status
- Use distinct colors for each status to provide clear visual differentiation

## Capabilities

### New Capabilities

- `status-visual-badges`: Visual badges displaying OOS and archived status on fleet panel and unit pages.

### Modified Capabilities

- None. This is a UI enhancement that doesn't change core requirements.

## Impact

- Updates to fleet panel unit card component to display status badges
- Updates to unit detail page to display status badges
- No database changes required (uses existing archived_at and oos_at columns)