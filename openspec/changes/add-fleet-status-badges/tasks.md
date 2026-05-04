## 1. Data Calculations

- [ ] 1.1 Add query to check if locked_at time is before 10:00 AM
- [ ] 1.2 Add query to check if checkoff is in progress (exists but not locked)
- [ ] 1.3 Add query to count current exceptions (items where count < par)
- [ ] 1.4 Add query to count new exceptions (compare against yesterday's locked check)
- [ ] 1.5 Add query to check if comments are present

## 2. UI Component

- [ ] 2.1 Create badge component with different color variants (green, blue, red, orange, purple)
- [ ] 2.2 Add badge section to fleet matrix unit card below progress bar
- [ ] 2.3 Style badge row to wrap if many badges active
- [ ] 2.4 Only display badge when condition is met (no empty badges)

## 3. Badge Logic Integration

- [ ] 3.1 Integrate "Done Before 10AM" badge logic
- [ ] 3.2 Integrate "In Progress" badge logic
- [ ] 3.3 Integrate "Current Exceptions" badge with count display
- [ ] 3.4 Integrate "New Exceptions" badge with count display
- [ ] 3.5 Integrate "Has Comments" badge logic

## 4. Validation and Testing

- [ ] 4.1 Run typecheck to verify no type errors
- [ ] 4.2 Run lint to verify no linting issues
- [ ] 4.3 Build the project to ensure everything compiles
- [ ] 4.4 Test "Done Before 10AM" badge shows for early completion
- [ ] 4.5 Test "In Progress" badge shows for uncompleted checks
- [ ] 4.6 Test "Current Exceptions" badge shows count
- [ ] 4.7 Test "New Exceptions" badge shows count
- [ ] 4.8 Test "Has Comments" badge shows when comments present
- [ ] 4.9 Verify badges don't show when conditions not met