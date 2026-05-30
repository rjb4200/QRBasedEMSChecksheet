## 1. Data Merging

- [x] 1.1 Update the recent-comments API to query `daily_unit_comments` in addition to `daily_section_comments`.
- [x] 1.2 Normalize general unit comments and section comments into one shared response shape.
- [x] 1.3 Label general unit comments with source name `General`.
- [x] 1.4 Merge both comment sources newest-first and apply compact/expanded limits after merging.
- [x] 1.5 Preserve crew tag enrichment for both general and section comments.

## 2. UI Behavior

- [x] 2.1 Ensure compact mode displays the three newest merged comments across both sources.
- [x] 2.2 Ensure expanded mode displays last-10-days merged comments capped at 50.
- [x] 2.3 Preserve existing row rendering for unit, source, date/time, comment text, and optional crew tag.
- [x] 2.4 Update empty-state behavior to reflect no comments across either source.

## 3. Verification

- [x] 3.1 Update route tests for merged general and section comments.
- [x] 3.2 Add coverage for newest-first ordering across both sources.
- [x] 3.3 Add coverage for compact limit applied after merging.
- [x] 3.4 Run relevant recent-comments tests.
- [x] 3.5 Run TypeScript typecheck.
