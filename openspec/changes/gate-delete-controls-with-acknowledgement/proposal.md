## Why

The DELETE Records section is intentionally destructive, but its controls are immediately interactive when the page loads. Requiring an explicit acknowledgement before enabling those controls adds a low-friction safety step that helps prevent accidental interaction with the data deletion workflow.

## What Changes

- Add a danger acknowledgement toggle to the DELETE Records section.
- Keep the warning header and acknowledgement toggle fully visible on page load.
- Grey out and disable the actionable DELETE controls until the acknowledgement is enabled.
- Enable the existing date inputs and Preview Records action only after acknowledgement.
- Keep the existing Preview Records, Export and DELETE, and slide-to-confirm gates unchanged after the section is unlocked.
- Reset the acknowledgement on page reload; do not persist it as a preference.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `data-rotation`: DELETE record controls require an explicit risk acknowledgement before interaction.

## Impact

- Affects the Records page DELETE section client-side interaction state and styling.
- No database schema changes expected.
- No API changes expected.
- No new dependency expected.
