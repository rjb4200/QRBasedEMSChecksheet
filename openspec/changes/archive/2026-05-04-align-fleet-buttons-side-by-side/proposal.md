## Why

The View Checkoff and Manage Unit buttons on fleet matrix cards are stacked vertically, taking up extra vertical space. On wide screens, these buttons can fit side by side, creating a more compact and efficient layout.

## What Changes

- Update the button container in `fleet-matrix.tsx` to use a horizontal flex layout
- Ensure buttons wrap to a new line on smaller screens where there isn't enough width

## Capabilities

### New Capabilities
- `fleet-button-alignment`: Layout adjustment for fleet matrix card buttons

### Modified Capabilities
- None

## Impact

- File: `src/components/fleet-matrix.tsx`
- No database changes
- No API changes