## Why

When crews scan a QR code and start their daily checkoff with previous day's data already populated, they need immediate visual indication of which items are different from par. This allows crews to quickly focus on exceptions and speed up the checkoff process. Currently, there is no visual flag to highlight items that deviate from par values.

## What Changes

- Add colored badges/labels to compartment check lines showing par exception status
- Yellow badge for items above par (showing the par value)
- Red badge for items below par or missing (showing the par value)
- Badge displays the normal par count alongside the exception indicator
- Only show badges on items that differ from par based on imported previous check data

## Capabilities

### New Capabilities

- `par-exception-badges`: Visual indicators on compartment check lines that flag items differing from par values based on imported data.

### Modified Capabilities

- None. This enhances the existing checkoff workflow without changing requirements.

## Impact

- Updates to compartment item component to display exception badges
- Logic to compare current values against par values
- Styling for yellow (above par) and red (below par/missing) badges
- No database changes required