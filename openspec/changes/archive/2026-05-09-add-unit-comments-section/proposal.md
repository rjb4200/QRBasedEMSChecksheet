## Why

Crews need a way to communicate important information to supervisors and document additional details during checkoffs. Currently, there is no mechanism for crews to add notes or comments to their daily checkoffs, which limits their ability to relay critical information about equipment conditions, issues, or observations.

## What Changes

- Add a comments field to each unit's daily checkoff
- Display comments section at the bottom of the unit page, above "Past exceptions" and "Previous shift" sections
- Comments only appear in viewing modes, records, and printouts when content is present
- If comments are left blank, the section does not appear on the finished check sheet
- Comments are included in daily ledger snapshots for historical record-keeping

## Capabilities

### New Capabilities

- `unit-comments`: A text field allowing crews to add notes/commentary to their daily checkoff. Appears on unit viewing, records view, and printouts only when populated.

### Modified Capabilities

- None. This is a net new feature that does not change existing requirements.

## Impact

- New database column in `daily_units` table for comments storage
- Updates to unit detail page UI to display comments section
- Updates to records/history view to show comments when present
- Updates to print document generation to include comments when populated
- No changes to public checkoff flow or admin authentication