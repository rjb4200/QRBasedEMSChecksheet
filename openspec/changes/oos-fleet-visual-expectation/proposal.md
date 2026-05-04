## Why

OOS (Out of Service) units are not expected to receive daily checkoffs, but on the fleet matrix, there is no clear visual indication that crews should not attempt to check off these units. This causes confusion and potentially wasted effort. A distinct visual style on the fleet matrix will make it immediately clear that OOS units are not expected to receive checkoffs.

## What Changes

- Apply distinct visual styling to OOS unit cards on the fleet matrix (e.g., dimmed/grayed appearance, strikethrough, or muted colors)
- The styling should communicate "do not check off" or "not in service"
- Combine with existing OOS badge for clear status communication
- The visual change makes it immediately obvious to admin and supervisors that these units are not active

## Capabilities

### New Capabilities

- `oos-expectation-indicator`: Visual styling on fleet matrix OOS unit cards that clearly indicates these units will not receive checkoffs.

### Modified Capabilities

- None. This is a UI enhancement that doesn't change core requirements.

## Impact

- Updates to fleet matrix unit card component for OOS styling
- No database changes required (uses existing oos_at column)
- Complements existing OOS badge feature