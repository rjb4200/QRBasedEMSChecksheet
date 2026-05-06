## Context

The crew checkoff form renders every item with a shared card wrapper. Quantity items currently place the equipment name and the minus/count/plus controls in the same `flex items-start justify-between` row. On narrow phones, long equipment names reduce the available space for controls and can cause cramped wrapping or overflow.

## Goals / Non-Goals

**Goals:**

- Make quantity rows mobile-first and readable on narrow phones.
- Let long equipment names wrap at normal readable size.
- Move quantity controls below the name/metadata on mobile.
- Keep quantity controls large enough for fast field use.
- Preserve checkbox and condition item behavior.

**Non-Goals:**

- Do not change item values, save behavior, submit behavior, or payload shape.
- Do not add database or API changes.
- Do not redesign the entire checkoff page or grouped section layout.
- Do not replace the existing minus/count/plus interaction with a native number input unless explicitly requested later.

## Decisions

- Render quantity item cards with a responsive grid/flex layout that stacks on mobile and can align horizontally at `sm` and above when space allows.
- Add `min-w-0` and `break-words` to the item text container/name so long names wrap instead of forcing horizontal overflow.
- Keep checkbox and condition controls in their current positions, with shared text wrapping applied only where safe.
- Preserve the existing current-count display and +/- buttons, including read-only disabled behavior.

## Risks / Trade-offs

- Quantity rows will use more vertical space on phones -> acceptable because readability and tap accuracy are more important in field checkoff.
- Some long unbroken names may still wrap awkwardly -> mitigate with `break-words`; consider `overflow-wrap:anywhere` only if needed after testing.
- Desktop layout may shift slightly -> keep responsive `sm` behavior to restore horizontal alignment where space exists.
