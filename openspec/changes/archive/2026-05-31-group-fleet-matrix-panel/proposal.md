## Why

The Fleet Panel's title, unit card grid, and daily checksheet print bar are three visually separate elements floating on the page background. Wrapping them in a shared background panel ties them together as one cohesive fleet operations section.

## What Changes

- Wrap the Fleet Matrix title, unit cards, and print daily check sheets section in a single rounded white panel.
- Unit cards retain their individual white backgrounds within the shared panel.

## Capabilities

### Modified Capabilities

- `fleet-dashboard`: Fleet Matrix title, unit cards, and print bar share a visual panel container.

## Impact

- Affects `src/app/admin/page.tsx`.
