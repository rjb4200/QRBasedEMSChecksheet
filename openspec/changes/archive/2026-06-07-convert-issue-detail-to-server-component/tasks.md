## 1. Create Server Actions

- [x] 1.1 Create `src/app/admin/issues/actions.ts` with `"use server"` directive and all imports (`createAdminClient`, `revalidatePath`, `redirect`, `z`, `getCurrentAdminLogActor`, `logSystemEvent`)
- [x] 1.2 Implement `createIssue` action with Zod validation (title, description, unitId, tags), Supabase insert, audit logging, and redirect to new issue
- [x] 1.3 Implement `updateIssue` action with Zod validation (id, title, description, status, unitId, tags), before-state capture, Supabase update, audit logging, and revalidatePath
- [x] 1.4 Implement `deleteIssue` action with Zod validation (id), before-state capture, Supabase delete, audit logging, redirect to list
- [x] 1.5 Implement `addIssueNote` action with Zod validation (issueId, text), Supabase insert, audit logging, and revalidatePath
- [x] 1.6 Add `normalizeTags` helper function matching the logic from the existing API route

## 2. Rewrite Issue Detail Page as Server Component

- [x] 2.1 Rewrite `src/app/admin/issues/[id]/page.tsx` — remove `"use client"` directive, make the component `async`, await `params` for the id
- [x] 2.2 Fetch the single issue via `supabase.from("issues").select(...).eq("id", id).single()` in a `Promise.all` with notes and units queries
- [x] 2.3 Render the issue header (title, status badge, unit name, creator, timestamp) using server-fetched data
- [x] 2.4 Render tags as read-only colored badges using the existing `tagColor` function
- [x] 2.5 Render the description section if present
- [x] 2.6 Build the edit form with fields: title, description, status dropdown, unit dropdown (populated from fetched units), tags comma-separated input, hidden id field
- [x] 2.7 Wire the edit form to `updateIssue` server action with `<SubmitButton>` for pending state
- [x] 2.8 Render the notes list from server-fetched notes data, with empty state for zero notes
- [x] 2.9 Add the add-note form wired to `addIssueNote` server action with hidden issueId field and `<SubmitButton>`
- [x] 2.10 Add the delete section using `<DeleteConfirmButton>` wired to `deleteIssue` server action

## 3. Polish and Verify

- [x] 3.1 Ensure the "Back to Issues" link and page styling match the current page
- [x] 3.2 Verify all status badge colors, tag badge colors, and date formatting match current behavior
- [x] 3.3 Run `npm run lint` and `npm run typecheck` to verify no TypeScript or linting errors
- [x] 3.4 Manual smoke test: navigate to an issue detail page, verify data loads, edit and save, add a note, change status, delete an issue
- [x] 3.5 Verify audit log entries appear in the system log for all mutations
