## Context

The admin Equipment Catalog currently performs one query for all matching `equipment_catalog` rows and renders every row as an editable form. The page already supports name search and category filtering through URL search params, and the canonical `equipment-list-filtering` spec covers those behaviors.

The production catalog already contains hundreds of items. Rendering hundreds of editable rows at once creates unnecessary browser work and makes the page harder to scan. The implementation should reduce both query payload and rendered DOM size while preserving existing add, edit, and delete workflows.

## Goals / Non-Goals

**Goals:**
- Render a paged Equipment Catalog by default.
- Let admins choose 25, 50, 100, or All visible items.
- Keep search and category filters compatible with pagination.
- Preserve stable category/name sorting across pages.
- Persist page-size preference during the current browser session.
- Add an accessible back-to-top control for long catalog pages.

**Non-Goals:**
- Do not redesign the equipment editor forms.
- Do not change equipment create, edit, or delete server actions.
- Do not add new database tables or migrations.
- Do not add cross-user saved preferences unless a future request requires it.

## Decisions

### Decision 1: Use server/query-level pagination for normal page sizes

Use Supabase `range()` with `{ count: "exact" }` for page sizes 25, 50, and 100. This avoids fetching or rendering hidden rows and gives the UI enough information to display the current range and total count.

Alternative considered: client-side pagination after fetching all rows. This would reduce rendered DOM but would not reduce query payload, so it does not fully address large-catalog slowdown.

### Decision 2: Keep pagination state in URL search params

Use `page`, `pageSize`, `q`, and `category` search params for the server component. Filter/search form submissions reset to page 1. Pagination links preserve current filters and page size.

Rationale: This matches the existing admin page pattern, supports refresh/share, and avoids adding server actions for list navigation.

### Decision 3: Persist page size with session storage only

Add a small client component for the page-size selector that stores the selected page size in `sessionStorage` and updates the URL. On first visit without `pageSize`, it can apply the session preference.

Rationale: The user asked for current-session persistence. Session storage is lightweight and does not require schema changes or account preference plumbing.

### Decision 4: Treat "All" as explicit opt-in

The default page size will be 50. "All" will be available as an explicit option and should fetch/render the full matching result set only after the admin chooses it.

Rationale: This preserves an escape hatch for bulk scanning while preventing the current endless-list behavior by default.

### Decision 5: Back-to-top as a client-only progressive enhancement

Implement the back-to-top button as a small client component that appears after scrolling past a useful threshold and calls `scrollTo({ top: 0, behavior: "smooth" })`.

Rationale: Scroll position is a browser concern. Keeping it isolated avoids making the catalog page itself a client component.

## Risks / Trade-offs

- **Risk**: Exact count queries add small overhead. -> **Mitigation**: The equipment catalog is modestly sized and count is needed for page controls/range display.
- **Risk**: "All" can still be slower for very large catalogs. -> **Mitigation**: It is no longer the default and is clearly user-selected.
- **Risk**: Page number can become invalid after filters change or deletes reduce total pages. -> **Mitigation**: Clamp page calculations and reset filters/page-size changes to page 1.
- **Risk**: Session storage is unavailable in some locked-down browsers. -> **Mitigation**: URL params and default page size continue to work without persistence.

## Migration Plan

1. Update the Equipment Catalog server component query and rendering.
2. Add small client components for page-size persistence and back-to-top behavior.
3. Verify existing create/edit/delete flows still work.
4. Rollback: remove pagination UI/components and restore the prior full-list query.
