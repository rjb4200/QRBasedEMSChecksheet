## 1. Fleet Ordering

- [x] 1.1 Add a natural, deterministic unit-name ordering step to the completed Fleet Matrix aggregation result.
- [x] 1.2 Preserve ledger-derived status, archive, and note data while applying the final display order.

## 2. Status Cache Invalidation

- [x] 2.1 Expose a focused cache invalidation function from the fleet aggregation module.
- [x] 2.2 Clear the fleet cache after a successful unit service-status and daily-ledger update.

## 3. Regression Coverage

- [x] 3.1 Add Fleet Matrix aggregation coverage for partial ledger data in which EC4 changes service status while EC1-EC7 remain naturally ordered.
- [x] 3.2 Add coverage that validates numeric-aware ordering for names such as EC2 and EC10.
- [x] 3.3 Add action coverage confirming a successful service-status change invalidates cached fleet data.

## 4. Verification

- [x] 4.1 Run the affected unit-action and fleet aggregation tests.
- [x] 4.2 Run the project's typecheck and lint checks.
