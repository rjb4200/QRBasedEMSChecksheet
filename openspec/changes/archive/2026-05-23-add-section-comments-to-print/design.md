## Context

Section comments are now loaded as part of the Records page data pipeline and displayed on-screen. The print view uses the same `getDailyUnitRecords` / `getLedgerBackedDailyUnitRecordsForDate` pipeline, so `record.sectionComments` is already available at render time. The print view renders a compact landscape table; the cleanest way to add section comments without disrupting the layout is to append them inside the existing Comments column cell.

## Goals / Non-Goals

**Goals:**
- Add section comments to the printed Records view.
- Keep the existing 7-column landscape table structure.
- Label each section comment by source compartment or kit name.
- Hide section comments when none exist.

**Non-Goals:**
- Do not add new columns to the print table.
- Do not restructure the print layout or page breaks.
- Do not change section comment entry, checkoff logic, or email behavior.

## Decisions

### Decision 1: Append section comments to the Comments column

Append section comments after the unit-level comment in the existing Comments `<td>` cell, using a compact prefix format.

Rationale: This avoids adding an 8th column (which would require redistributing column widths and risks breaking the landscape layout), requires no table restructuring, and keeps the print view compact. The on-screen Records page already separates section comments visually; this decision is print-only.

### Decision 2: Render section comments as labeled lines within the cell

Each section comment renders as a new line with the source name prefix.

Rationale: This makes individual comments scannable and preserves their association with specific compartments or kits.

## Risks / Trade-offs

- **Risk**: The Comments column could become tall for units with many section comments. -> **Mitigation**: The `daily_section_comments` table has a 2000-character limit and only one comment per source per shift, so this column should remain manageable.

## Migration Plan

1. Append section comments to the Comments column in the print view.
2. Verify print output with section comments present and absent.
3. Run lint, typecheck, and build.
