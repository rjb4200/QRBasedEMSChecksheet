## Context

Each unit record card on the Records page renders a row with two action links: a "View" link (to `/admin/archives/[archiveId]`) or "No archive" placeholder, and a "Print" link (to `/admin/archives/print?date=...`). These are redundant with the "Print Daily Record" button already in the filter form. Removing them simplifies the cards.

## Decisions

**Remove both links.** The "Print" per-unit link duplicates the top-level "Print Daily Record" button. The "View" archive link is rarely used from the Records page — archive viewing is typically done from the fleet dashboard.

No design complexity — pure removal of a JSX block.
