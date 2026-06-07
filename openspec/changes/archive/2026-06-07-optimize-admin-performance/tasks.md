## 1. Database Indexes

- [x] 1.1 Create migration `supabase/migrations/20260607160000_add_issue_indexes.sql` with composite index on `issue_notes(issue_id, created_at)` and indexes on `issues(status)`, `issues(created_at DESC)`, `issues(unit_id)`
- [x] 1.2 Apply the migration via Supabase

## 2. Supabase Client Caching

- [x] 2.1 Wrap `createAdminClient()` in `src/lib/supabase/server-admin.ts` with `React.cache()` to deduplicate client instantiation per request
- [x] 2.2 Export a `cachedUnits()` function from a shared location (or inline in the issue detail page) using `React.cache()` wrapping `supabase.from("units").select("id, name").order("name")`

## 3. Loading Skeletons

- [x] 3.1 Create `src/app/admin/issues/[id]/loading.tsx` with a skeleton matching the issue detail page structure (back link, header card placeholder, edit form card placeholder, notes section placeholder)
- [x] 3.2 Create `src/app/admin/loading.tsx` with a generic admin loading skeleton (nav bar, content area with card placeholders)

## 4. Page Updates

- [x] 4.1 Update `src/app/admin/issues/[id]/page.tsx` to use the cached units query instead of the inline `supabase.from("units")` call
- [x] 4.2 Update `src/app/admin/layout.tsx` to skip redundant `verifyAdminSession()` when the middleware already verified the session (read cookie directly without re-verifying)

## 5. Verify

- [x] 5.1 Run `npm run typecheck` and `npm run lint` to verify no errors
- [x] 5.2 Manual smoke test: navigate to issue detail page, verify loading skeleton appears, verify page loads with data, verify notes and units load correctly
