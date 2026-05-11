## Context

The QR codes page (`/admin/units/{id}/qr`) currently prints as a generic 3-column grid with expand/collapse sections. It produces full-page PDFs with QR codes at 1.67", URLs, "Code:" labels, and unit names at standard body font sizes. This doesn't align with the Spartan Industrial S004 label sheet (6 labels per sheet, each 3" × 3").

## Goals / Non-Goals

**Goals:**
- "Print / Save as PDF" produces output that aligns with the S004 3"×3" label layout
- QR code is ~2.4" for reliable scanning through lamination
- Text is small (10-11px) but readable for identifying compartments on the apparatus
- Remove redundant "Code:" text and URL from print output
- Individual "Print This QR" is unchanged

**Non-Goals:**
- Change the on-screen display layout
- Change database, API, or backend logic
- Support other label template sizes (future concern)
- Generate PDF server-side (browser print is sufficient)

## Decisions

1. **`@media print` overrides on existing page** over a separate print page
   - Rationale: Simpler code, fewer routes, one source of truth for QR data
   - Downside: CSS complexity within a single component

2. **Remove "Code:" and URL from print**
   - Rationale: QR encodes the URL, making printed text redundant. Freeing space allows a larger QR.

3. **2-column print grid** over 3-column
   - Rationale: S004 is 2 labels wide × 3 tall. 3-column would not align.

4. **Individual print unchanged**
   - Rationale: Separate `window.open()` with its own hardcoded HTML/CSS — not affected by page-level print styles

## Label Sizing

Each label cell at print time:

```
3.00" total height
├─ 0.10"  top padding
├─ 2.25"  QR code image
├─ 0.10"  gap
├─ 0.18"  unit name    (12px bold)
├─ 0.07"  gap
├─ 0.20"  compartment  (12px)
└─ 0.10"  bottom padding
```

Grid: 2 columns × 3 rows, each cell 3" × 3" (`w-[288px] h-[288px]` or `style="width:3in;height:3in"`).

## Risks / Trade-offs

- **[Risk] Printer margins may clip outer labels** → Mitigation: `@page { margin: 0.25in }` and test with target printer
- **[Risk] Browser scaling differences** → Mitigation: Use `size: letter` and disable browser print scaling via CSS
- **[Risk] 10px text is too small** → Rendered moot: 2.25" QR leaves room for 12px text
- **[Risk] QR at 2.25" might be too small for lamination** → Previously-discussed alternative if scanning fails: bump to 2.4" at cost of smaller text
- **[Risk] QR at 2.4" might be too large for some print drivers** → Mitigation: Test first, fall back to 2.2" if clipped

## Open Questions

- What printer make/model will be used? (affects printable margin assumptions)
- Is 10px text still comfortable when viewed on the apparatus at arm's length?
