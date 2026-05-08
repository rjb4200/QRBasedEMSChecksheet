## Why

The checkoff form can prefill item values from a previous completed check, which reduces re-entry but can make carried-forward shortages or unchecked required items easy to miss. A small visual warning should make abnormal carried-forward values obvious without highlighting normal carried-forward data or changing the checkoff workflow.

## What Changes

- Add UI-only warning logic for carried-forward checkoff item values that need attention.
- Flag carried-forward quantity items when the value is missing/null or below par.
- Flag carried-forward checkbox items when unchecked or missing/null.
- Flag carried-forward condition items when the carried-forward status is not `OK` or is missing.
- Do not flag normal carried-forward values that meet par, checked boxes, or `OK` condition items.
- Do not show carried-forward warnings after an item has current-day entered/verified data.
- Use compact red labels/outlines consistent with existing operational badge styling, such as `Par 4`, `Missing`, and `Needs Check`.

## Capabilities

### New Capabilities
- `carried-forward-item-warnings`: Visual warnings for carried-forward checkoff item values that need attention.

### Modified Capabilities
- None.

## Impact

- **UI**: `CheckoffForm` item rendering and helper logic for carried-forward warning state.
- **Behavior**: Visual-only warnings on checkoff item screens; no data model, QR, submission, archive, Fleet Panel, or confirmation workflow changes.
- **Testing**: Quantity below/par/missing, checkbox checked/unchecked, condition OK/not-OK, and current-day data override cases.
