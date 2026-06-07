## Context

The issue detail page (`/admin/issues/[id]`) is currently a `"use client"` component that uses `useEffect` + `fetch()` to call API routes. Critically, `fetchIssue()` calls `GET /api/admin/issues` (the list endpoint) and does a client-side `.find()` to locate the matching issue. Every other admin detail page (units, kits, archives) is a server component that queries Supabase directly with `.eq("id", id).single()`.

The `src/app/api/admin/issues/[id]/route.ts` file exists but has no `GET` handler—only `PUT` and `DELETE`. The notes sub-resource at `[id]/notes/route.ts` correctly implements `GET` and `POST`.

There are no existing server actions for issues. All mutations currently go through `fetch()` calls to the API routes. There is no audit logging for issue mutations.

## Goals / Non-Goals

**Goals:**
- Rewrite the issue detail page as a server component matching the units/kits/archives pattern
- Create server actions for all issue mutations with Zod validation and audit logging
- Fetch only the single requested issue (not all issues) from Supabase
- Keep all existing user-facing behavior intact (status changes, notes, tags, delete)

**Non-Goals:**
- The issue list page (`/admin/issues`) stays as-is (it needs client-side filtering and would be a larger refactor)
- The existing API routes stay in place for backward compatibility (they are not removed)
- No changes to the database schema, RLS policies, or Supabase configuration

## Decisions

### 1. Form-based mutations vs. inline client-side editing

**Decision:** Use `<form action={serverAction}>` with a monolithic edit form rather than preserving the current inline-per-field pattern (status dropdown, tag chips, detail editing).

**Rationale:** The units and kits detail pages use a single edit form pattern. The current issue page's scattered `useState`-driven mini-editors (status dropdown with `onChange`, tag chips with add/remove buttons that save on each keystroke) are incompatible with server components since they require client-side state. Consolidating into a single edit form with a "Save Changes" button is simpler and consistent with existing patterns.

**Alternative considered:** Hybrid approach with `"use client"` islands for individual interactive elements. Rejected because it adds complexity and breaks from the established admin pattern.

**User impact:** Admins will need to click "Save Changes" instead of seeing instant inline updates. This is a slight UX tradeoff but aligns with how all other admin detail pages work.

### 2. Tags editing approach

**Decision:** Tags are edited as a comma-separated text input in the main edit form, rather than individual chip-based add/remove.

**Rationale:** The current chip-based tag editor requires client-side state and saves on each add/remove. Server actions don't support this pattern cleanly. The create-issue form already uses comma-separated input, so this is consistent.

### 3. Notes remain via server actions

**Decision:** Note addition uses a server action (`addIssueNote`) with `<form action>`. The notes list is rendered server-side from the initial data fetch.

**Rationale:** Notes are simple—a textarea + submit button. `<form action={addIssueNote}>` with a `<SubmitButton>` works perfectly for this and avoids the extra API roundtrip. After submission, `revalidatePath` refreshes the page with the new note.

### 4. Delete uses `DeleteConfirmButton`

**Decision:** Use the existing `DeleteConfirmButton` shared component wrapping a `deleteIssue` server action.

**Rationale:** This is the standard pattern used by units and kits. It provides the two-step confirmation UI and passes the issue ID as a hidden form input.

### 5. Data fetching uses parallel `Promise.all`

**Decision:** Fetch the issue, its notes, and the units list in a single `Promise.all` call.

**Rationale:** All three queries are independent and can run concurrently. This matches the pattern used by the units detail page. The units list is needed for the edit form's unit dropdown.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| **Loss of optimistic UI** — Status changes and tag edits now require a full form submission and page revalidation instead of instant inline updates | Acceptable tradeoff for consistency with other admin pages. The form submission is fast since it's a server action with no API hop. |
| **Form state loss on error** — If a server action fails, form values reset because the page re-renders | Server actions throw errors that bubble to the nearest error boundary. Default form values are populated from the database, so a re-render shows current state. |
| **Notes list refresh** — After adding a note, the entire page revalidates (not just the notes section) | Acceptable. Notes are lightweight and the data fetch is already optimized with `Promise.all`. |
| **Breaking the list page if `createIssue` action is adopted there** — The list page is `"use client"` and currently calls the API route | The `createIssue` server action returns a redirect, which doesn't work well in client components. The list page should keep its current approach for now. This is a non-goal. |
