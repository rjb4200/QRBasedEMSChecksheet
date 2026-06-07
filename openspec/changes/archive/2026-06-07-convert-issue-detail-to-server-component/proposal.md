## Why

The issue detail page (`/admin/issues/[id]`) is noticeably slower than every other admin detail page because it fetches ALL issues from the list endpoint and filters client-side, instead of querying a single issue by ID. It's also the only detail page using the `"use client"` pattern with `useEffect` + `fetch()` while all other admin detail pages (units, kits, archives) are server components that query Supabase directly.

## What Changes

- Rewrite `src/app/admin/issues/[id]/page.tsx` as a server component that queries Supabase directly with `.eq("id", id).single()`, matching the pattern used by units, kits, and archives detail pages
- Create `src/app/admin/issues/actions.ts` with server actions (`updateIssue`, `deleteIssue`, `addIssueNote`, `createIssue`) replacing the client-side `fetch()` calls to API routes
- The existing API routes (`/api/admin/issues/[id]` and `/api/admin/issues/[id]/notes`) can remain for backward compatibility but are no longer called by the detail page
- Add audit logging via `logSystemEvent` for all issue mutations (currently missing from the API routes)

## Capabilities

### New Capabilities

- `issue-server-actions`: Server actions module providing `createIssue`, `updateIssue`, `deleteIssue`, and `addIssueNote` with Zod validation and audit logging

### Modified Capabilities

- `issue-detail-page`: The detail page moves from client-side `fetch()` to server-side Supabase queries. Mutations move from API-route calls to server action form submissions. Behavioral requirements are unchanged, but spec text referencing specific API routes will be updated.

## Impact

- **Affected code**: `src/app/admin/issues/[id]/page.tsx` (rewrite), `src/app/admin/issues/actions.ts` (new), `src/app/admin/issues/page.tsx` (may use new `createIssue` action for consistency)
- **Unaffected**: `src/app/api/admin/issues/route.ts`, `src/app/api/admin/issues/[id]/route.ts`, `src/app/api/admin/issues/[id]/notes/route.ts` (keep for backward compatibility)
- **Performance**: Detail page goes from fetching all issues + client-side find to a single `.eq("id", id).single()` query
- **Consistency**: Aligns the issue detail page with the established server-component + server-actions pattern used by units, kits, and archives
