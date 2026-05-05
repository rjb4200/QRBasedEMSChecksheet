## 1. Daily Checkoff Dashboard UI

- [x] 1.1 Update `/units/[id]` target data so compartment and kit cards no longer require direct checkoff hrefs
- [x] 1.2 Replace target card `Link` elements with non-clickable status elements while preserving current visual status styling
- [x] 1.3 Remove hover/click affordances from target cards so they do not appear actionable
- [x] 1.4 Keep the existing Scan action available and visually prominent

## 2. Verification

- [x] 2.1 Verify compartment and kit status cards still show Not Started, In Progress, and Completed states
- [x] 2.2 Verify clicking or tapping a target card does not navigate to a checkoff form
- [x] 2.3 Verify the Scan action still navigates to `/scan`
- [x] 2.4 Verify direct `/checkoff/...` URLs remain reachable
- [x] 2.5 Run `npm run lint`
- [x] 2.6 Run `npm run typecheck`
