## 1. Fleet Status Data

- [x] 1.1 Extend fleet status types with `completedAt`, `exceptionCount`, `hasComments`, and `crewComplete`
- [x] 1.2 Fetch current-shift check rows with timestamps and item data needed for completion and exception calculations
- [x] 1.3 Compute completion status and latest completion timestamp from required check targets and crew completion
- [x] 1.4 Aggregate exception counts by unit without per-unit database queries
- [x] 1.5 Detect saved nonblank daily unit comments for the current shift

## 2. Comment Data Support

- [x] 2.1 Confirm whether a daily unit comment table already exists in schema or remote database
- [x] 2.2 Add a minimal `daily_unit_comments` migration only if no existing comment storage is available
- [x] 2.3 Ensure comment presence checks ignore blank or whitespace-only comments

## 3. Fleet Matrix UI

- [x] 3.1 Add compact reusable badge rendering in `src/components/fleet-matrix.tsx`
- [x] 3.2 Render exactly one primary badge using priority: out of service, completed time, in progress, not started
- [x] 3.3 Render exception, comments, and crew missing secondary badges only when applicable
- [x] 3.4 Remove in-progress styling from `View Checkoff`
- [x] 3.5 Remove the `Manage Unit` button from Fleet Panel cards
- [x] 3.6 Keep badge rows mobile-wrapping and accessible with readable text or aria labels

## 4. Verification

- [x] 4.1 Verify completed units show local completion time instead of `Complete`
- [x] 4.2 Verify in-progress units use an amber badge and not button styling
- [x] 4.3 Verify out-of-service and not-started units show the correct primary badges
- [x] 4.4 Verify exception counts and comment badges appear only when applicable
- [x] 4.5 Run typecheck and lint
