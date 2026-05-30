## 1. Data Enrichment

- [x] 1.1 Update the recent-comments API query path to access matching crew rows for returned comments.
- [x] 1.2 Match crew rows by unit ID, shift date, and shift period.
- [x] 1.3 Add crew/provider names to returned comment objects only when non-blank names exist.

## 2. UI Rendering

- [x] 2.1 Extend the RecentComments row type to include optional crew/provider names.
- [x] 2.2 Render crew/provider names as compact tags on comment rows when present.
- [x] 2.3 Preserve existing unit, source, date/time, comment text, ordering, compact, and expanded behavior.
- [x] 2.4 Avoid rendering empty or placeholder crew tags when names are unavailable.

## 3. Verification

- [x] 3.1 Update recent-comments route tests for crew tag data enrichment.
- [x] 3.2 Add or update coverage for comments without matching crew names.
- [x] 3.3 Run relevant recent-comments tests.
- [x] 3.4 Run TypeScript typecheck.
