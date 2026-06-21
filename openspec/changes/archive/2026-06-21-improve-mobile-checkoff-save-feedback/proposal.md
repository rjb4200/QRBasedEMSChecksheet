## GitHub Issue

Fixes #79: Improve mobile checkoff save/submit feedback and offline failure handling.

## Root Cause

The checkoff form starts delayed autosaves after value changes, but autosave uses the same transition pending state as final submit and does not expose success, failure, last-saved, or offline status to crews. A failed autosave can therefore disappear silently on mobile devices with weak signal.

## Proposed Solution

- Track autosave status separately from final submit status.
- Show visible mobile-friendly save feedback for saving, saved, failed, and offline states.
- Record and display the last successful save time.
- Add a manual retry control when autosave fails.
- Keep final submit visually distinct and prevent submit while autosave is unresolved or failed.

## Scope

- Update the existing checkoff form component only.
- Preserve the existing `saveCheckData` and `submitCheckData` server actions.
- Preserve existing checkoff data shape and submit behavior.

## Non-Goals

- No database schema changes.
- No offline queue or local persistence layer.
- No changes to QR routing, checkoff target identity, or restock logic.

## Risk Assessment

- Regression risk: Low. The change is localized to client-side status handling and disables submit only while save state is clearly unresolved.
- Data risk: Low. Existing save and submit server actions remain authoritative.
- UX risk: Low. Adds feedback without changing item input controls.

## Verification Plan

- Run type checking.
- Run linting.
- Build the application if type/lint pass.
- Manually inspect the changed component logic for status transitions: value change, autosave success, autosave failure, offline detection, retry, and submit disabled state.

## Rollback Plan

Revert the checkoff form status UI/state changes and remove this OpenSpec change. Since no database or API changes are included, rollback is limited to code revert.
