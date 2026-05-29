## 1. Database Usage Helper

- [x] 1.1 Create `src/lib/database-usage.ts` with a `getDatabaseUsage()` helper
- [x] 1.2 Query `pg_database_size()` using the admin client
- [x] 1.3 Read `DATABASE_STORAGE_LIMIT_MB` from environment, defaulting to 500
- [x] 1.4 Compute usage percentage and return `{ sizeMB, limitMB, percentage }`
- [x] 2.1 Create `src/components/storage-warning-banner.tsx`
- [x] 2.2 Render a yellow warning banner at 90% usage
- [x] 2.3 Render a red critical warning banner at 95% usage
- [x] 2.4 Show current usage in the banner text
- [x] 2.5 Render nothing when below 90%
- [x] 3.1 Import the banner component into the Fleet Panel page
- [x] 3.2 Place the banner above the fleet matrix
- [x] 3.3 Ensure the banner is only visible to admin users
- [x] 4.1 Run `npm run lint`
- [x] 4.2 Run `npm run typecheck`
- [x] 4.3 Run `npm run build`
- [x] 4.4 Manual test: no banner at normal usage
- [x] 4.5 Manual test: yellow banner at 90% threshold
- [x] 4.6 Manual test: red banner at 95% threshold
