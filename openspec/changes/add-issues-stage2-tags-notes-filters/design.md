## Context

The Stage 1 issues tracker has a minimal data model (title, description, unit, status, creator, timestamps) and a simple status-filtered card list. Stage 2 adds categorization (tags), conversation (notes), and discoverability (filters + sort) — all additive, no breaking changes.

## Goals / Non-Goals

**Goals:**
- Add `tags text[]` column to issues, displayed as colored badges on cards
- Create `issue_notes` table with create + list API, displayed inline on issue cards
- Add a filter bar (unit, tag, text search) and sort dropdown to the Issues page
- All filtering and sorting is client-side on loaded data (no server-side pagination needed)

**Non-Goals:**
- No tag management page (create/edit/delete tags) — tags are free-text
- No note editing or deletion (just create + read for now)
- No real-time updates or polling for notes
- No filtering by date range
- No saved filter presets

## Decisions

### Decision 1: `tags text[]` column, not a separate table

A PostgreSQL text array column stores tags directly on the issue row. No foreign keys, no junction tables, no joins.

**Rationale:** Tags are ad-hoc labels, not a curated taxonomy. The volume will be low (tens of issues, each with 1-3 tags). A text array avoids query complexity and keeps the data model simple. PostgreSQL's `@>` operator (contains) makes filtering efficient.

**Tag display:** Each tag is a small colored badge. Colors cycle through a fixed palette: red, blue, green, amber, purple, slate. Badge color is deterministic based on the tag string (hash → palette index).

### Decision 2: `issue_notes` as a separate table

```sql
CREATE TABLE issue_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  text text NOT NULL,
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
```

**Rationale:** Multiple notes per issue, each with its own author and timestamp. Cascade delete ensures notes are cleaned up when an issue is deleted. Simple append-only model — no editing or deleting individual notes.

### Decision 3: Client-side filtering + sorting

All issues are fetched once on page load. The filter bar and sort dropdown filter/sort in-memory. No API query parameters needed.

**Rationale:** Issue volume is expected to be low (tens, not hundreds). Fetching everything and filtering client-side is simpler and faster (no round trips). Can be moved to server-side when/if volume grows.

**Filter dimensions:**
- Unit dropdown: populated from `GET /api/admin/units-list`
- Tag dropdown: derived from all unique tags across loaded issues
- Text search: matches against title and description (case-insensitive includes)

**Sort options:**
- Newest first (default)
- Oldest first
- Recently updated
- Title A-Z

### Decision 4: Notes displayed inline on issue cards

Each issue card has an expandable "Notes" section. When collapsed, shows a count (e.g., "2 notes"). When expanded, shows all notes in chronological order with a textarea to add a new note.

**Rationale:** Keeps the list view compact while giving quick access to conversation history. Avoids a separate detail page or modal.

### Decision 5: Tag and notes are updated via the existing PUT endpoint

The existing `PUT /api/admin/issues/[id]` already accepts partial updates. Adding `tags` to the accepted body extends it without a new route. Notes use a dedicated `GET/POST /api/admin/issues/[id]/notes` route.

## Risks / Trade-offs

- **[Risk] Free-text tags lead to duplicates (e.g., "Equipment" vs "equipment")** → Mitigation: Tags are normalized to lowercase with trimmed whitespace on save. The tag filter dropdown shows distinct values, making duplicates visible.
- **[Risk] Issue cards become tall with notes + tags + description** → Mitigation: Notes are collapsed by default. Tags are compact inline badges. The page uses a generous max-width container.
- **[Trade-off] No pagination** → Fine for Stage 2. Issues are expected to be <100 at any time.
