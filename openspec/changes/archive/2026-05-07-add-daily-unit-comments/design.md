## Context

The application already has a `daily_unit_comments` table with one row per unit, shift date, and shift period. Current read paths also already query this table for Fleet Panel comment badges and printed/PDF check sheet comments. What is missing is the editable checksheet experience and a complete contract for trimming, clearing, hiding blanks, and surfacing saved comments consistently in records and exports.

Daily unit comments are operational notes for one unit's daily checksheet. They are not compartment comments, permanent unit notes, admin-only annotations, or maintenance records.

## Goals / Non-Goals

**Goals:**
- Add a `Daily Unit Comments` editor at the bottom of each unit checksheet.
- Save comments by `unit_id`, `shift_date`, and `shift_period`.
- Trim whitespace before saving and do not persist whitespace-only comments.
- Support multiline comments with a bounded length.
- Clear/delete comments so blank comments disappear everywhere except the editable field.
- Display saved comments in Fleet Panel badge state, records, CSV exports, printed checksheets, and daily PDF/email reports.
- Preserve historical comments for the date they were saved.

**Non-Goals:**
- No compartment-level or item-level comments.
- No permanent unit notes.
- No maintenance, alerting, analytics, admin note workflow, or comment history/audit log.
- No broad redesign of Fleet Panel, checkoff pages, records, or print layouts.
- No change to QR scanning, checkoff completion, crew lock, unit status, or archive summary logic.

## Decisions

**Use the existing `daily_unit_comments` table.**

The table already matches the desired model: unit, shift date, shift period, comment, timestamps, and uniqueness by daily unit. Implementation should reuse it rather than adding another table. If a max-length check is required, add a small migration only for that constraint.

Alternative considered: store comments on `units`, `compartment_checks`, or `daily_unit_ledgers`. Those options either make comments permanent, tie them to the wrong target, or mix operational notes into ledger snapshots.

**Treat blank saves as clears.**

The save action should trim text. If the trimmed value is empty, delete the existing row or otherwise ensure downstream reads see no saved comment. This makes blank comments naturally hidden from Fleet Panel, records, print, and reports.

Alternative considered: save empty rows. Existing read paths can filter blanks, but empty rows add noise and create avoidable ambiguity.

**Use current shift helpers for checksheet edits.**

Comment saves from live checksheets should use the same current operational date and shift period as checkoff data so comments align with daily records and the 06:00 rollover.

Alternative considered: client-provided dates. This is unnecessary for the live checksheet and more error-prone.

**Keep display compact.**

Fleet Panel should show only a compact `Comments` badge/icon. Printed and records surfaces should render the comment text only when nonblank. The editable textarea is the only place blank state should be visible.

Alternative considered: add a large Fleet Panel button or always render blank comment sections. This was rejected as clutter.

## Risks / Trade-offs

- **Existing table policy mismatch**: Current policies may not allow public checksheet saves if comments are edited outside admin context. Mitigation: inspect current write path and add narrowly scoped action/policy updates only if needed.
- **Overlong comments affecting print layout**: Multiline comments can consume space. Mitigation: enforce a bounded max length and render compactly.
- **Historical display gap**: Existing archives preserve unit check data separately from comments. Mitigation: query `daily_unit_comments` by date/unit for records and print outputs; do not rely on current unit status.
- **Duplicate active OpenSpec overlap**: An older `add-unit-comments-section` change exists. Mitigation: implement this clearer daily-unit scoped change and archive it when complete; do not mix unrelated tasks.

## Migration Plan

1. Inspect current checksheet pages and actions for unit-level save points.
2. Reuse `daily_unit_comments`; add a max-length database constraint only if not enforceable sufficiently in application validation.
3. Add a server action to upsert/delete comments for the current shift.
4. Add comment textarea and save/clear UI at the bottom of each unit checksheet page.
5. Align records, CSV, print, PDF, and Fleet Panel read paths so saved comments show and blanks hide.
6. Run typecheck and lint.

Rollback is a normal code revert; only a small optional check constraint migration may need reversal if added.
