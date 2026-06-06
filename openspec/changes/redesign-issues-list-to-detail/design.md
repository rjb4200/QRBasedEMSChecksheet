## Context

The issues system has tags, notes, filters, and sort — all crammed into expandable sections within individual cards on a single page. This layout works for a few issues but breaks down as note threads grow and cards become unwieldy. A GitHub-style list/detail split gives each view its own purpose: scan on the list, work on the detail.

## Goals / Non-Goals

**Goals:**
- Design the list page as a clean table with title, tags, unit badge, status badge, and date per row
- Detail page shows full description, threaded notes, tag editing, and status dropdown
- Back-navigation between list and detail preserves the last filter/sort state (optional, nice-to-have)
- All existing API endpoints are reused — no new routes

**Non-Goals:**
- No editing title/description inline on the detail page (can be added later)
- No real-time updates on the detail page
- No markdown rendering
- No "assigned to" or due dates

## Decisions

### Decision 1: Detail page is a client component fetching via API

The detail page loads the issue via `fetch("/api/admin/issues")` filtered by ID (or uses the list data passed via query params). Notes are loaded via `GET /api/admin/issues/[id]/notes`.

**Rationale:** A server component would need to call `createAdminClient()` directly, which breaks the pattern of all admin pages using the cookie-based session via API. Keeping the detail page as a client component that fetches from existing APIs is consistent.

### Decision 2: List page uses Next.js Link navigation to detail

Each row is wrapped in a `<Link href={/admin/issues/${id}}>`. The entire row is clickable. The existing filter/sort/search controls remain on the list page.

**Rationale:** Standard Next.js navigation. No state to pass between pages — the detail page fetches fresh data.

### Decision 3: Detail page layout

```
┌──────────────────────────────────────────────────┐
│  ← Back to Issues                                 │
│                                                   │
│  [Issue Title]                        [Status ▾]  │
│  Unit Name · Created by · Timestamp                │
│                                                   │
│  ┌─ Tags ──────────────────────────────────────┐  │
│  │  [equipment] [maintenance]  [edit tags]     │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  Description                                      │
│  Full description text...                          │
│                                                   │
│  ─── Notes (3) ─────────────────────────────────  │
│                                                   │
│  ┌─────────────────────────────────────────────┐  │
│  │ Author · Timestamp                           │  │
│  │ Note text...                                 │  │
│  └─────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────┐  │
│  │ Author · Timestamp                           │  │
│  │ Note text...                                 │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  ┌───────────────────────────────────────────────┐│
│  │ Add a note...                        [Add Note]││
│  └───────────────────────────────────────────────┘│
└──────────────────────────────────────────────────┘
```

### Decision 4: List page table-row layout

Each row shows: title (bold), tags (badges, max 2), unit (badge if set), status (colored badge), date. The row is a Link wrapping the entire tr/div.

Sort/filter controls stay between the create form and the table.

## Risks / Trade-offs

- **[Risk] Navigating loses filter state** → Minor inconvenience. Can be addressed later with URL search params.
- **[Risk] Detail page may feel empty if description is short + no notes** → Acceptable. The detail page always shows the description and always shows the "Add Note" area.
- **[Trade-off] No real-time note updates** → Notes must be manually refreshed or re-fetched. Acceptable for a small admin team.
