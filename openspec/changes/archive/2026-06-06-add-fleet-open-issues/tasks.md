## 1. RecentIssues Component

- [x] 1.1 Create `src/components/recent-issues.tsx` as a client component fetching open+in_progress issues
- [x] 1.2 Display up to 3 issues with title, first tag, unit badge, status badge, linked to detail page
- [x] 1.3 Show "No open issues" when empty, with link to Issues page
- [x] 2.1 Add `RecentIssues` component to `src/app/admin/page.tsx` below the Fleet Matrix section
- [x] 2.2 Change exception range from 7 days to 4 days (6 → 3 days back)
- [x] 2.3 Default exceptions to collapsed (empty expandedDates set)
- [x] 3.1 Run `npm run typecheck`
- [x] 3.2 Run `npm run build`
- [x] 3.3 Manual test: verify open issues appear on Fleet, exceptions are collapsed with 4-day range
