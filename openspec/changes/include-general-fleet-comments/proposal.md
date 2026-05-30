## Why

Fleet Panel Recent Comments currently shows only compartment/kit section comments from `daily_section_comments`, so general unit comments are missing from the operational comment feed. Including both sources gives supervisors a complete recent comment view without requiring them to open individual unit pages.

## What Changes

- Include general unit comments from `daily_unit_comments` in Fleet Panel Recent Comments.
- Continue including compartment/kit comments from `daily_section_comments`.
- Merge both sources into one newest-first comment list for compact and expanded modes.
- Label general comments with a clear source such as `General` so they are distinct from compartment/kit comments.
- Preserve compact latest-3 behavior, expanded last-10-days behavior, crew tags, row fields, and expanded 50-result cap.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `fleet-recent-comments`: Recent Comments will include both general unit comments and compartment/kit section comments in a unified newest-first feed.

## Impact

- Affects the Fleet Recent Comments API/query and normalization logic.
- Affects route tests for comment source merging and ordering.
- No database schema changes expected.
- No new dependency expected.
