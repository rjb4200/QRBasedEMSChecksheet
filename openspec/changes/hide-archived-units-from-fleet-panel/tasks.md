## 1. Locate Fleet Panel Data Flow

- [x] 1.1 Find the Fleet Panel component and the data/service function that returns unit card status
- [x] 1.2 Identify how effective unit status and archived state are derived from `daily_unit_ledgers` versus `units`

## 2. Implement Archived Unit Filtering

- [x] 2.1 Filter archived units before Fleet Panel card data is returned or rendered
- [x] 2.2 Ensure active non-archived units continue to display
- [x] 2.3 Ensure out-of-service non-archived units continue to display
- [x] 2.4 Ensure ledger archived state is honored when today's ledger snapshot exists
- [x] 2.5 Ensure current unit archived/status fields are used when today's ledger snapshot is missing

## 3. Verify Behavior

- [x] 3.1 Run the relevant lint/build command for the project
- [x] 3.2 Manually verify the Fleet Panel does not show archived units
- [x] 3.3 Manually verify active and out-of-service units still appear with existing badges
