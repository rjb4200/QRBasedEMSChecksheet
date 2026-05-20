## 1. Fleet Matrix Updates

- [x] 1.1 Add persistent OOS metadata fields to the `units` table
- [x] 1.2 Update the unit status action to set OOS metadata when status becomes `out_of_service`
- [x] 1.3 Update the unit status action to clear OOS metadata when status returns to `in_service`
- [x] 1.4 Update fleet matrix unit card to check `status === "out_of_service"`
- [x] 1.5 Apply dimmed/reduced opacity styling to OOS unit cards
- [x] 1.6 Display OOS timestamp and admin attribution on OOS unit cards
- [x] 1.7 Ensure active units retain normal full opacity styling and no OOS metadata display
- [x] 1.8 Verify OOS badge is displayed alongside dimmed styling and metadata

## 2. Validation and Testing

- [x] 2.1 Test setting a unit OOS stores timestamp and admin attribution
- [x] 2.2 Test returning a unit to service clears OOS metadata
- [x] 2.3 Test OOS units display with dimmed styling and metadata
- [x] 2.4 Test active units display with normal styling and no OOS metadata
- [x] 2.5 Verify visual combination of dimmed styling, OOS badge, and metadata
- [x] 2.6 Run typecheck to verify no type errors
- [x] 2.7 Run lint to verify no linting issues
- [x] 2.8 Build the project to ensure everything compiles
