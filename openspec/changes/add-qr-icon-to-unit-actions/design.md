## Context

The shared icons file at `src/components/icons.tsx` was recently extracted during the iconifying of Edit/Delete actions. Adding a QR code icon to the same file keeps the pattern consistent.

## Goals / Non-Goals

**Goals:**

- Add an `IconQr` SVG to `src/components/icons.tsx`.
- Replace the "QR Codes" text link with the icon link.

**Non-Goals:**

- Change QR code functionality or routing.

## Decisions

1. Use a simple QR-style SVG icon matching the existing 24x24 stroke style.

   Two filled squares and a partial third square make a recognizable QR code silhouette at small sizes, consistent with the pencil/trash icon visual weight.

   Alternative: use a grid/dots pattern. Visually busier at small sizes.

## Risks / Trade-offs

- QR icon alone may be less obvious -> use an accessible label and title attribute, matching the pattern already established for Edit/Delete icons.
