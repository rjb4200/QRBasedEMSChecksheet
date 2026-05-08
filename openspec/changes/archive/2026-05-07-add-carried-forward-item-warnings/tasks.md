## 1. Data Source Detection

- [x] 1.1 Inspect compartment and kit checkoff page loaders for current-day versus previous-check data flow
- [x] 1.2 Pass explicit carried-forward item data/source state into `CheckoffForm` when initial values come from previous data
- [x] 1.3 Ensure items with current-day saved data are not treated as carried forward

## 2. Warning Helpers

- [x] 2.1 Add helper logic to detect carried-forward quantity below-par, missing, and no-par cases
- [x] 2.2 Add helper logic to detect carried-forward checkbox unchecked or missing cases
- [x] 2.3 Add helper logic to detect carried-forward condition missing or non-`OK` cases
- [x] 2.4 Track locally edited item ids so warnings disappear after an item is changed in the current session

## 3. Checkoff Form UI

- [x] 3.1 Add compact `Par` label component with red warning state for below-par/missing quantity values
- [x] 3.2 Add compact `Needs Check` or `Missing` label component for checkbox and condition warnings
- [x] 3.3 Apply subtle red item/card styling only for missing, unchecked, or non-`OK` carried-forward values
- [x] 3.4 Keep normal carried-forward values visually unchanged

## 4. Scope Control

- [x] 4.1 Verify no database, QR, check submission, archive, Fleet Panel, analytics, or confirmation workflow changes are introduced
- [x] 4.2 Verify no warning appears for default values that are not carried forward
- [x] 4.3 Verify no warning appears for current-day entered or verified values

## 5. Verification

- [x] 5.1 Verify carried-forward quantity equal to par and above par render normally
- [x] 5.2 Verify carried-forward quantity below par uses red par label
- [x] 5.3 Verify carried-forward quantity missing/null uses red par or missing styling with optional subtle outline
- [x] 5.4 Verify carried-forward quantity without par does not show below-par warning
- [x] 5.5 Verify carried-forward checkbox checked renders normally and unchecked shows `Needs Check`
- [x] 5.6 Verify carried-forward condition `OK` renders normally and non-`OK` shows warning
- [x] 5.7 Run typecheck and lint
