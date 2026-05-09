## Why

Archived units currently appear in the Fleet Panel, which adds noise and can make inactive apparatus look like current operational work. The Fleet Panel should focus only on units that are operationally relevant today: active units and out-of-service units.

## What Changes

- Filter Fleet Panel unit cards so archived units are not displayed.
- Keep active units visible in the Fleet Panel.
- Keep out-of-service units visible in the Fleet Panel so crews can see units that are unavailable.
- Apply the same visibility rule whether the Fleet Panel uses today's daily unit ledger snapshot or falls back to current unit status.

## Capabilities

### New Capabilities

- None

### Modified Capabilities

- `fleet-panel-status-badges`: Fleet Panel unit visibility must exclude archived units while preserving active and out-of-service units.

## Impact

- Fleet Panel unit query or status computation will need to filter archived units before rendering cards.
- Existing Fleet Panel badge behavior should remain unchanged for visible active and out-of-service units.
- No database schema changes or new dependencies are expected.
