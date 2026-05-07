## Why

The Fleet Panel currently mixes operational status with button styling, progress text, and admin actions, making it harder to scan during morning operations. Status should be communicated through compact operational badges that prioritize completion state, exceptions, comments, and missing crew information.

## What Changes

- Replace the blue in-progress `View Checkoff` button treatment with a separate status badge.
- Add a primary operational badge per unit: `Out of Service`, completion time, `In Progress`, or `Not Started`.
- Add secondary badges for exception counts, saved comments, and missing crew information.
- Display completion time for fully complete units instead of a generic `Complete` label.
- Remove the `Manage Unit` action from Fleet Panel cards while keeping `View Checkoff`.
- Keep cards compact, scannable, mobile-friendly, and visually aligned with the existing Fleet Panel layout.

## Capabilities

### New Capabilities
- `fleet-panel-status-badges`: Operational Fleet Panel badge system for unit completion state, exceptions, comments, and crew requirements.

### Modified Capabilities

## Impact

- **Code**: `src/lib/fleet.ts`, `src/components/fleet-matrix.tsx`, and any supporting query/types needed for comments and exceptions.
- **Data**: No schema changes expected. Existing `compartment_checks`, `daily_unit_crews`, and daily comment data should be reused.
- **Behavior**: Fleet Panel cards become dashboard-oriented; admin unit management remains available through admin unit pages.
- **UX**: Operational status moves out of button styling into badges; blue remains available for navigation/actions, not status.
