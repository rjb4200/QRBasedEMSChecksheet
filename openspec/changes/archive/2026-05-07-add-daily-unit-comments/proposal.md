## Why

Unit crews need a place to save daily unit-level notes that are not tied to a single compartment or kit. The data table and several read paths already exist, but the checksheet still needs a clear editable comment section and the behavior should be specified end-to-end so blank comments stay hidden while saved comments appear in operational, records, print, and report surfaces.

## What Changes

- Add an optional `Daily Unit Comments` section at the bottom of each unit checksheet.
- Save comments per unit, shift date, and shift period using `daily_unit_comments`.
- Trim whitespace, reject whitespace-only comments, support multiline text, and enforce a reasonable max length.
- Allow clearing/deleting a saved comment so it disappears from downstream surfaces.
- Show a compact Fleet Panel comment badge only when a saved nonblank comment exists for today’s shift.
- Show saved comments in printed checksheets, archive/records views, CSV exports, and daily PDF/email report layouts when present.
- Keep blank comments hidden everywhere except the editable checksheet field.
- Preserve historical comments for the date they were saved, even if unit status changes later.

## Capabilities

### New Capabilities
- `daily-unit-comments`: Optional unit-level daily comments saved per unit, shift date, and shift period.

### Modified Capabilities
- `fleet-panel-status-badges`: Fleet cards expose a compact comment badge only when today's unit comment exists.
- `past-checkoff-record-summary`: Historical records, printed checksheets, CSV exports, and report outputs expose saved unit comments and hide blank comments.

## Impact

- **Database**: Uses existing `daily_unit_comments`; implementation should only add a migration if constraints/policies need tightening for max length or write behavior.
- **UI**: Unit checksheet pages get an optional comment text area and save/clear behavior.
- **Server actions**: Add or update unit comment save/delete action using current shift context.
- **Fleet/records/print/reporting**: Existing read paths may need completion or alignment to ensure blank comments are hidden and saved comments appear consistently.
- **Out of Scope**: No compartment-level comments, permanent unit notes, admin notes module, workflow changes, alerting, analytics, or broad UI redesign.
