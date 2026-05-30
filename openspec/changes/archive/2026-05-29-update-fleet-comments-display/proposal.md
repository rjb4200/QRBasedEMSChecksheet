## Why

The Fleet Panel Recent Comments section currently hides all comments until expanded, which makes recent notes easy to miss during quick dashboard checks. Showing the three newest comments in compact mode keeps the most important context visible while expanded mode can provide a broader 10-day review window.

## What Changes

- Show the three most recent comments in the Fleet Panel Recent Comments section while compact/collapsed.
- Load and display comments from the last 10 rolling days when the section is expanded.
- Keep comments ordered newest first.
- Update empty-state wording to reflect the 10-day expanded range.
- Preserve the section's existing placement between the print bar and Exceptions section.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `fleet-recent-comments`: Recent Comments compact and expanded display behavior changes from fully collapsed/lazy 7-day display to a 3-comment compact preview and 10-day expanded view.

## Impact

- Affects Fleet Panel Recent Comments data loading and rendering.
- May require adjusting the recent-comments API/query limit or date window.
- No database schema changes expected.
- No new dependency expected.
