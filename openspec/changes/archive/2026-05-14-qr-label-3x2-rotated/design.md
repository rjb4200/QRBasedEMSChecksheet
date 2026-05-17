## Context

The current QR print view at `/admin/units/[id]/qr` generates a grid of QR cards suitable for general printing. For label stock (3" × 2" labels, 10 per letter sheet), a rotated 90-degree layout fits more content in the label's physical dimensions.

## Goals / Non-Goals

**Goals:**
- Add a dedicated 3" × 2" rotated label print layout.
- Layout: 5 rows × 2 columns, each cell 3" × 2" with 90-degree rotated content.
- Each label: QR code filling a ~2" × 2" area, with unit name, compartment/kit name, and short URL in the remaining strip.
- When the label is held upright after peeling: QR at top, name below.
- Print scale: 100%, no browser scaling.
- Preserve existing QR print layout.

**Non-Goals:**
- Do not replace the existing QR print layout.
- Do not change QR code generation.
- Do not add a label designer UI.

## Decisions

1. **Use a `format` query parameter on the existing QR page.**

   Rationale: Keeps QR printing in one place. `?format=3x2-rotated` switches the print grid to the label layout.

   Alternative considered: Separate route. Unnecessary fragmentation.

2. **Rotate the entire label content container, not just the QR image.**

   Rationale: The CSS `transform: rotate(90deg)` applied to a 2" wide × 3" tall content container fits the physical 3" × 2" label. The QR code fills a 2" × 2" square at the top of the rotated space, with unit name, compartment/kit name, and short URL in the remaining 1" × 2" strip to the right. When the label is peeled off and held upright, the QR is at the top with the name underneath.

3. **QR code size: approximately 2" × 2".**

   Rationale: Fills nearly the full width of the rotated content area for maximum scan reliability. The remaining 1" strip provides just enough room for the compartment/kit name and short URL text. When the label is turned upright after peeling, the layout reads naturally: large QR on top, name below.

## Risks / Trade-offs

- Label alignment varies by printer -> Recommend printing at 100% scale with headers/footers off.
- Very long compartment names may wrap or clip -> Use `overflow-wrap: anywhere` and allow slight text reduction.
