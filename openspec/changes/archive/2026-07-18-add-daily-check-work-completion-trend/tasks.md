## 1. Historical Work Aggregation

- [x] 1.1 Add a focused server-side aggregation for the latest 14 operational dates using daily ledgers as required-work snapshots.
- [x] 1.2 Count unique completed check targets and valid locked crew entries only for ledger rows marked in service.
- [x] 1.3 Represent available, zero-completion, not-applicable, and unavailable days explicitly and cap completed work at required work.

## 2. Records Page Presentation

- [x] 2.1 Add a server-rendered Daily Check Work Completion trend section to the Records page after the removal change is applied.
- [x] 2.2 Display percentage and completed/required action counts for available days, with distinct unavailable and not-applicable states.
- [x] 2.3 Ensure the 14-day presentation remains fleet-wide and usable on narrow screens without a charting dependency.

## 3. Verification

- [x] 3.1 Add aggregation tests for full, partial, zero, unavailable, all-out-of-service, and out-of-service-with-recorded-work dates.
- [x] 3.2 Add presentation tests for action-count labels and unavailable/not-applicable states.
- [ ] 3.3 Run focused tests, typecheck, lint, and manually compare representative historical dates against Daily Readiness records.
