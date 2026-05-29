## 1. API Route

- [x] 1.1 Create `/api/admin/recent-comments` endpoint
- [x] 1.2 Query `daily_section_comments` for the last 7 rolling days joined with unit names
- [x] 1.3 Order results by `created_at DESC` and limit to 50
- [x] 1.4 Require valid admin session before returning data
- [x] 2.1 Create a `RecentComments` client component with a collapsed `<details>` section
- [x] 2.2 Lazy-load comments via `fetch()` only when the section is expanded
- [x] 2.3 Show a loading spinner while comments are loading
- [x] 2.4 Display each comment with unit name, source name, relative date, and comment text
- [x] 2.5 Show an empty state when no comments exist
- [x] 2.6 Include a Records link for deeper review
- [x] 3.1 Add the `RecentComments` component to the Fleet Panel between the print bar and Exceptions section
- [x] 4.1 Run `npm run lint`
- [x] 4.2 Run `npm run typecheck`
- [x] 4.3 Run `npm run build`
- [ ] 4.4 Manual test: section collapsed by default, no data loaded
- [ ] 4.5 Manual test: expand shows comments with loading state
- [ ] 4.6 Manual test: empty state when no comments
- [ ] 4.7 Manual test: Fleet Panel load speed unaffected
