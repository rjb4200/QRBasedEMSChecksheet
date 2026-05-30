## Context

The Fleet Panel already includes a Recent Comments section between the daily checksheet print bar and Exceptions. Existing behavior is collapsed-by-default and lazy-loads comments from the last 7 days only after expansion. The requested behavior changes the section from a purely hidden lazy-load panel into a compact preview that exposes the three newest comments immediately, while expanded mode shows a broader 10-day history.

## Goals / Non-Goals

**Goals:**

- Show the three most recent comments in compact mode.
- Show comments from the last 10 rolling days in expanded mode.
- Keep comments ordered newest first in both modes.
- Preserve the existing comment row content: unit, source, date/time, and text.
- Keep the Fleet Panel responsive by limiting compact data to three rows.

**Non-Goals:**

- Add comment editing, deleting, filtering, or acknowledgement.
- Change where comments are stored.
- Change the Fleet Panel Exceptions behavior.
- Add a new frontend dependency.

## Decisions

1. Compact mode should fetch only the three newest comments.

   Compact mode is meant as a quick operational preview, so fetching a small bounded result is preferable to loading the full expanded dataset up front.

   Alternative considered: fetch all 10 days on initial page load and hide most rows until expanded. That would make expansion instant but increases initial Fleet Panel work for content the user may not need.

2. Expanded mode should use a 10-day rolling date window.

   The current 7-day window is too short for the desired review behavior. A 10-day window gives broader context while still keeping the query bounded.

   Alternative considered: show a fixed count such as 50 regardless of date. That could miss older days in sparse periods or include too many comments from a single busy day.

3. Empty states should reflect the active mode.

   Compact mode should indicate when there are no recent comments to preview. Expanded mode should mention the last 10 days so the user understands the search window.

   Alternative considered: keep the existing "No comments in the last 7 days" message. That would be inaccurate after the range changes.

## Risks / Trade-offs

- Initial Fleet Panel load may become slightly heavier because compact comments are no longer fully lazy-loaded -> limit compact query to three comments and keep expanded data separate.
- Duplicate querying may occur when expanding after compact preview -> acceptable for simplicity, or implementation may reuse compact rows while fetching the full 10-day list.
- Users may expect compact rows to represent all comments -> label or structure the section so compact mode reads as a preview of the newest comments.
