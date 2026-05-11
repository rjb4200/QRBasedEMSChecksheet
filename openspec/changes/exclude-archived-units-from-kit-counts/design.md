## Context

The Kits page at `/admin/kits` displays kit definitions with attachment counts and unit lists. Currently it joins `unit_kits` unconditionally, counting all units including archived ones.

## Goals / Non-Goals

**Goals:**
- Kit attachment counts show only active (non-archived) units
- Attached unit lists hide archived units
- Historical `unit_kits` rows preserved

**Non-Goals:**
- No data migration or deletion
- No archive toggle UI
- No changes to kit assignment or unit archiving

## Decisions

1. **Apply `units.deleted_at IS NULL` filter to the Supabase query** over post-query JS filtering
   - Rationale: More efficient — the database does the filtering, not the app server. Also keeps count correct.

2. **Single query change** over separate count query
   - Rationale: The existing page already joins kits with unit_kits and units. Just need to add the `deleted_at` filter.

## Query Change

Current:
```sql
kits with unit_kits(id, units(name))
```

Target: filter `units` to only rows where `deleted_at IS NULL`

## Risks / Trade-offs

- **[Risk] No visible indicator of archived units** → Mitigation: Out of scope for now; future enhancement could show a separate "archived" count
