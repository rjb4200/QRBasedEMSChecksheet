## 1. Graph Data Path

- [x] 1.1 Update the Archives page to feed the completion chart from `getDailyUnitRecords({}).groups`.
- [x] 1.2 Remove the unused duplicate `getTrendGroups()` helper from `archive-records`.

## 2. Regression Coverage

- [x] 2.1 Add a regression test for the issue #117 case with five 100% units and one 96% unit returning `6/6`.

## 3. Verification

- [x] 3.1 Validate the OpenSpec change.
- [x] 3.2 Run focused archive-records tests.
- [x] 3.3 Run TypeScript and lint checks (lint: 14 pre-existing unrelated errors).
