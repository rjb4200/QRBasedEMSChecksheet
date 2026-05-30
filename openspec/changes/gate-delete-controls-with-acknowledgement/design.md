## Context

The Records page DELETE section already uses danger styling, date availability guidance, preview counts, export-before-delete, and slide-to-confirm before records are removed. The remaining usability concern is that the date inputs and Preview Records action are immediately available on page load, which makes accidental interaction with the destructive workflow too easy.

This change adds a lightweight acknowledgement gate before the actionable controls. The acknowledgement is not a replacement for preview/export/slide-to-confirm; it is an initial unlock step that makes intent explicit before the user can operate the DELETE form.

## Goals / Non-Goals

**Goals:**

- Require an explicit risk acknowledgement before the DELETE date controls and Preview Records button can be used.
- Visually grey out the locked DELETE controls while keeping the warning and acknowledgement readable.
- Keep the acknowledgement local to the current page session and reset it on page reload.
- Preserve all existing delete validation and confirmation gates.

**Non-Goals:**

- Persist the acknowledgement as a user preference.
- Add another final confirmation step after export.
- Change the server-side delete API or authorization model.
- Replace the existing slide-to-confirm control.

## Decisions

1. Use a local client-side toggle to unlock controls.

   The acknowledgement only controls whether the user can interact with the section UI. The actual destructive action remains protected by the existing server-side validation, export requirement, and slide-to-confirm flow.

   Alternative considered: persist acknowledgement per admin user. That would reduce friction after the first use, but it weakens the safety intent and adds storage complexity for little benefit.

2. Disable actionable controls, not the warning content.

   The warning header and toggle remain fully visible. The date range controls, Preview Records button, and follow-on action area are dimmed and disabled until acknowledgement.

   Alternative considered: grey out the entire section. That would also make the warning harder to read, which is the opposite of the intent.

3. Treat the toggle as an unlock, not a delete confirmation.

   Wording should emphasize "Unlock DELETE controls" and "I understand deleted records cannot be recovered." The final deletion still requires the existing export and slide action.

   Alternative considered: require typing a phrase before unlocking. That is heavier than necessary because this is an early workflow gate, not the final destructive confirmation.

## Risks / Trade-offs

- Users may think toggling immediately deletes records -> label the toggle as unlocking controls only and keep final deletion behind the existing slide gate.
- Disabled controls may obscure data availability guidance -> keep availability text readable, or dim only inputs/buttons rather than all supporting text.
- Client-side gating can be bypassed -> keep all current server-side validations unchanged because this is a UX safety feature, not a security boundary.
