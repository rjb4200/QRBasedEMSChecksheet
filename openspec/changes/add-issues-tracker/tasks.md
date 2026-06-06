## 1. Database Migration

- [x] 1.1 Create migration creating the `issues` table with id, title, description, unit_id (FK, nullable), status, created_by, created_at, updated_at
- [x] 1.2 Apply migration
- [x] 2.1 Create `src/app/api/admin/issues/route.ts` with GET (list all issues) and POST (create issue, admin auth required)
- [x] 2.2 Create `src/app/api/admin/issues/[id]/route.ts` with PUT (update status/fields) and DELETE (remove issue, admin auth required)
- [x] 3.1 Create `src/app/admin/issues/page.tsx` with server component loading all issues
- [x] 3.2 Add collapsible create-issue form (title, description textarea, optional unit dropdown)
- [x] 3.3 Display issues grouped by status with color-coded badges (open=red, in_progress=amber, closed=green)
- [x] 3.4 Add status-change dropdown on each issue card
- [x] 3.5 Add status filter tabs/pills (All, Open, In Progress, Closed) with client-side filtering
- [x] 4.1 Add "Issues" link to TOP_LINKS in `src/components/admin-nav.tsx`
- [x] 5.1 Run `npm run typecheck`
- [x] 5.2 Run `npm run build`
- [ ] 5.3 Manual test: create an issue, change its status, verify persistence on reload
