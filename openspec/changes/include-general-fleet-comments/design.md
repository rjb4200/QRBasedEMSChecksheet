## Context

Fleet Panel Recent Comments currently reads from `daily_section_comments`, which represents compartment and kit-specific notes. General unit/day comments are stored separately in `daily_unit_comments` and are visible elsewhere, but they are absent from the Fleet Panel Recent Comments feed.

The recent-comments endpoint already normalizes section comments and enriches them with unit and crew data. This change extends that normalization so both comment sources can be merged into one feed.

## Goals / Non-Goals

**Goals:**

- Include general unit comments from `daily_unit_comments` in Fleet Recent Comments.
- Continue including compartment/kit comments from `daily_section_comments`.
- Merge both comment sources by creation time, newest first.
- Preserve compact latest-3 behavior and expanded last-10-days behavior.
- Label general comments distinctly from compartment/kit source comments.

**Non-Goals:**

- Add comment editing, filtering, or source toggles.
- Change how unit comments or section comments are saved.
- Add database schema changes.
- Change Records page comment behavior.

## Decisions

1. Normalize both comment sources into one API response shape.

   Section comments already return `sourceName`; general comments should use a synthetic source name such as `General`. Keeping one response shape lets the existing UI render both sources without branching by table.

   Alternative considered: render separate General and Section subsections. That adds visual complexity and makes newest-first ordering across all comments less clear.

2. Apply compact and expanded limits after merging sources.

   Compact mode should show the three newest comments overall, not three section comments plus three general comments. Expanded mode should show at most 50 newest comments overall across the last 10 days.

   Alternative considered: query each source with its final limit. That can bias the feed and hide newer comments from one source if the other source fills its limit first.

3. Preserve crew enrichment for both sources.

   Both tables include unit/date/shift identifiers, so crew tags can continue to be matched by `unit_id`, `shift_date`, and `shift_period` after normalization.

   Alternative considered: crew tags only for section comments. That would make general comments less useful and inconsistent.

## Risks / Trade-offs

- More endpoint query work -> keep both source queries bounded by mode and apply the final limit after merging.
- Source rows may have different timestamp columns or missing IDs -> normalize defensively and use source-prefixed IDs if necessary.
- General comments could crowd out section comments in compact mode -> this is intentional because compact mode is newest-first across all recent comments.
