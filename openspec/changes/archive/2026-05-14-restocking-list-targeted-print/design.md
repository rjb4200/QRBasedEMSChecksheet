## Context

The `RestockingListSection` component has a Print button that currently invokes `window.print()`, printing the entire parent document. The goal is to print only the restocking checklist content.

## Goals / Non-Goals

**Goals:**
- Print only the restocking checklist (grouped deficiency items) when the Print button is clicked.
- Include a title, unit/date context if available, and the grouped items in the print output.
- Keep the Print button behavior client-side with no server round trip.

**Non-Goals:**
- Do not change the Copy button behavior.
- Do not change the expand/collapse toggle behavior.
- Do not add printer-specific CSS to the main page.

## Decisions

1. **Open a new `window` with generated HTML and call `.print()` on it.**

   Rationale: `window.open()` with `document.write()` creates a clean, isolated print surface. After print, the window can be closed automatically. This avoids any interference with the main page layout and requires no new dependencies.

   Alternative considered: Use a hidden iframe with print-only CSS. More complex to manage, and the iframe would still need to be populated with content. The new-window approach is simpler and well-supported.

2. **Pass unit name and date as optional props for the print header.**

   Rationale: A print checklist is more useful when it includes identifying information. Making this optional keeps the component usable in contexts where the info isn't available.

   Alternative considered: Hardcode a generic title. Less useful operationally.

## Risks / Trade-offs

- Popup blockers may interfere with `window.open()` -> The print action is triggered by a direct user click, which browsers allow even with popup blockers.
- New window styling is basic -> Acceptable for a checklist printout; print media handles most formatting.
