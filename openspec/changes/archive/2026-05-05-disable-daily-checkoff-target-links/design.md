## Context

The crew Daily Checkoff unit dashboard at `/units/[id]` shows each compartment and assigned kit as a status card. Those cards currently use direct links to `/checkoff/...`, so a crew can open checkoff forms from the dashboard without scanning the QR code located at the compartment or kit.

The desired behavior is a UI-level restriction only. The system should encourage honest workflow by making the Scan action the visible launcher, without attempting to prevent direct URL entry, bookmarks, browser history, or shared QR URLs.

## Goals / Non-Goals

**Goals:**

- Make Daily Checkoff compartment and kit status cards non-clickable.
- Keep status visibility unchanged for Not Started, In Progress, and Completed targets.
- Keep the Scan button as the obvious way to open QR-based checkoffs.
- Preserve direct checkoff routes so QR codes, bookmarks, and manually entered URLs continue to work.

**Non-Goals:**

- Do not add scan-session validation.
- Do not add route-level access control for `/checkoff/...` pages.
- Do not change QR generation, QR print pages, or QR URL shape.
- Do not change checkoff completion, locking, crew name, archive, or reporting logic.

## Decisions

- Replace target card `Link` elements with non-interactive elements such as `div`/`article` while preserving the current visual status styling.
- Remove direct `href` values from the target objects if they are no longer used by the dashboard rendering.
- Keep the `/scan` link in the sticky dashboard header as the intended checkoff entry point.
- Do not block direct checkoff URLs because the requirement is to make cheating harder, not to implement enforcement that could complicate normal QR and browser behavior.

## Risks / Trade-offs

- Some crews may have used dashboard links as a convenience shortcut -> The Scan button remains prominent, and direct QR URLs remain functional.
- Non-clickable cards could look clickable if hover/transition styles remain -> Remove link-specific hover affordances and use accessible status semantics.
- This does not prevent deliberate bookmark-based shortcuts -> Accepted trade-off because route-level enforcement is out of scope.
