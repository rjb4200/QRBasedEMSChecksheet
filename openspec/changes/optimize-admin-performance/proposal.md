## Why

After converting the issue detail page to a server component, the page still feels slower than it should. Investigation revealed five remaining bottlenecks: a missing database index on `issue_notes.issue_id` causing full table scans, no loading skeleton UI making the page feel blank during data fetch, `createAdminClient()` being re-instantiated 4-5 times per request, a full `units` table scan on every detail page load, and redundant admin session verification in both middleware and layout.

## What Changes

- **Database**: Add composite index on `issue_notes(issue_id, created_at)` and additional indexes on `issues(status)`, `issues(created_at)`, and `issues(unit_id)` to eliminate full table scans
- **Loading UX**: Add `loading.tsx` skeleton to the issue detail page and the admin layout so users see instant feedback instead of a blank screen during navigation
- **Client caching**: Wrap `createAdminClient()` in `React.cache()` to reuse the Supabase client within a single render pass, reducing redundant client instantiation
- **Data caching**: Wrap the units query in the issue detail page with `React.cache()` to avoid a full table scan on every load
- **Session verification**: Skip the redundant `verifyAdminSession()` call in the admin layout when the middleware has already verified the session

## Capabilities

### New Capabilities

- `admin-loading-states`: Loading skeleton UI components for admin pages, providing instant visual feedback during server-side data fetching
- `supabase-client-caching`: Per-request caching of the Supabase admin client via `React.cache()` to avoid redundant client instantiation across middleware, layout, page, and server actions

### Modified Capabilities

- `issue-notes`: Database index requirements for the `issue_notes` table to ensure efficient lookups by `issue_id`
- `issue-detail-page`: Loading state requirement and units query caching for the issue detail page
- `issue-tracker`: Database index requirements for the `issues` table (status, created_at, unit_id)

## Impact

- **Database**: New migration adding 4 indexes to `issues` and `issue_notes` tables
- **Library code**: `src/lib/supabase/server-admin.ts` — wrap `createAdminClient` with `React.cache()`
- **Layout**: `src/app/admin/layout.tsx` — skip redundant session verification
- **Pages**: `src/app/admin/issues/[id]/loading.tsx` (new), `src/app/admin/loading.tsx` (new)
- **Page logic**: `src/app/admin/issues/[id]/page.tsx` — cache units query
