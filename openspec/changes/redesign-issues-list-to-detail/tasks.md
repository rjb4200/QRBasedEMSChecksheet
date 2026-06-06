## 1. Detail Page

- [x] 1.1 Create `src/app/admin/issues/[id]/page.tsx` as a client component fetching issue + notes via API
- [x] 1.2 Display issue metadata: title, description, unit badge, tags (colored badges with editing), status dropdown, creator, timestamp
- [x] 1.3 Display threaded notes chronologically with author + timestamp
- [x] 1.4 Add "Add Note" textarea with submit button calling `POST /api/admin/issues/[id]/notes`
- [x] 1.5 Add "← Back to Issues" navigation link
- [x] 1.6 Add tag editing (inline input + save)
- [x] 2.1 Redesign `src/app/admin/issues/page.tsx` as a table-style list with scannable rows
- [x] 2.2 Each row shows: title (bold), up to 2 tag badges, unit badge, status badge (colored), date
- [x] 2.3 Wrap each row in a Next.js Link navigating to `/admin/issues/[id]`
- [x] 2.4 Keep create form, status tabs, filter bar, and sort dropdown functional
- [x] 3.1 Run `npm run typecheck`
- [x] 3.2 Run `npm run build`
- [ ] 3.3 Manual test: create issue, click into detail, add notes, change status, navigate back
