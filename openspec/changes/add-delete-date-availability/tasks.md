## 1. Availability Lookup

- [x] 1.1 Add a server-side helper that returns oldest and newest eligible operational record dates across data-rotation tables.
- [x] 1.2 Ensure the lookup excludes today's shift date and returns an empty state when no eligible records exist.
- [x] 1.3 Add tests for oldest/newest date calculation, today's exclusion, and no-data behavior.

## 2. Default Range Selection

- [x] 2.1 Compute default DELETE from/to dates from availability, capping the range at 60 days.
- [x] 2.2 Pass availability and computed defaults from the Records page into the DELETE Records section.
- [x] 2.3 Preserve existing validation so preview and delete still reject invalid or today-inclusive ranges.

## 3. DELETE Section UI

- [x] 3.1 Display eligible deletion date availability below or near the DELETE date inputs.
- [x] 3.2 Show a clear no-eligible-records message when no historical records can be deleted.
- [x] 3.3 Keep exact per-table counts hidden until the admin clicks Preview Records.

## 4. Verification

- [x] 4.1 Run relevant unit tests for data rotation and Records page behavior.
- [x] 4.2 Run TypeScript typecheck.
- [x] 4.3 Manually verify the DELETE section defaults to the oldest eligible range and never includes today.
