## Why

OOS (Out of Service) units are not expected to receive daily checkoffs, but on the fleet matrix there is no strong at-a-glance indication that crews should not attempt to check off these units. There is also no simple current-state display of when a unit went OOS or which admin set it OOS, which makes status review harder without digging through logs.

## What Changes

- Apply distinct visual styling to OOS unit cards on the fleet matrix (e.g., dimmed/grayed appearance or muted colors)
- The styling should communicate "do not check off" or "not in service"
- Combine with existing OOS badge for clear status communication
- Show when the unit was set OOS and which admin set it OOS
- Persist OOS metadata on the unit so the fleet matrix can display current OOS state directly without depending on log lookups
- The combined visual and metadata change makes it immediately obvious to admin and supervisors that these units are not active and explains why they are being skipped

## Capabilities

### New Capabilities

- `oos-expectation-indicator`: Fleet matrix OOS unit cards visually indicate no checkoff is expected and show current OOS metadata such as timestamp and admin actor.

### Modified Capabilities

- None. This is a UI enhancement that doesn't change core requirements.

## Impact

- Updates to fleet matrix unit card component for OOS styling and metadata display
- Adds persistent OOS metadata fields on units for current-state display
- Updates unit status change flow to record and clear OOS metadata
- Complements existing OOS badge and system activity log features
