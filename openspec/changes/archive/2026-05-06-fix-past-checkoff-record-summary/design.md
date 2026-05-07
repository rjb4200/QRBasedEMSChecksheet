## Context

`daily_unit_ledgers` is intended to snapshot the fleet at shift reset: unit id, unit name, unit status, and target count for the closed date. Past Checkoff Records reads ledgers first and builds one unit-day record per ledger row. If no ledgers exist for a date, the page currently has no records to summarize and displays `0/0`.

The live database has `compartment_checks` rows for 2026-05-05 and 2026-05-06, but `daily_unit_ledgers` and `shift_archives` are empty. The `shift-reset` Edge Function is the only writer found for ledgers and archives. It is active, but recent logs show no activity, so it likely has not run successfully. The function also counts only `unit_compartments`, not `unit_kits`, and does not include the crew-name target that fleet status uses.

## Goals / Non-Goals

**Goals:**
- Use saved ledger rows when available.
- Reconstruct useful Past Checkoff Records from current units and actual check rows when ledgers are missing.
- Count in-service units as complete when `completionPercentage > 95`.
- Align historical total/completed target calculations with fleet status: compartments + assigned kits + crew-name lock target.
- Update shift reset so future ledgers/archives are populated with the right target totals.

**Non-Goals:**
- Do not delete or replace `daily_unit_ledgers`.
- Do not rewrite historical unit status where no saved ledger exists beyond best-effort fallback.
- Do not change checkoff submission behavior.

## Decisions

**Ledgers remain authoritative.**

When ledgers exist for a day, Past Checkoff Records should use them because they are the intended historical snapshot. This prevents future unit deletions, additions, or status changes from rewriting old denominators.

**Fallback to inferred records only when ledgers are absent.**

When no ledger rows exist for a date, derive records from available in-service units and/or units with checks for that date. This fixes current blank history without pretending the fallback is as authoritative as a saved reset snapshot.

**Completion threshold is `>95%`.**

The daily group summary numerator should count in-service records with `completionPercentage > 95`, not only `100%` or `archiveStatus === "completed"`.

**Target count includes crew completion.**

Historical calculations should use compartments + unit kits + 1 crew-name target, matching fleet behavior. A unit with all check targets complete but no locked crew names should not be treated as fully complete.

## Risks / Trade-offs

- **Fallback historical status may be imperfect** -> Prefer saved ledgers when present and clearly keep fallback limited to missing-ledger days.
- **Current units table may exclude deleted units** -> Fallback can include units with check rows even if they are no longer active, but status may be unknown without a ledger.
- **Shift-reset scheduling may still fail** -> Verify deployment/auth/scheduling separately so future ledgers and archives are actually produced.
- **Threshold confusion** -> Surface `>95%` consistently in records summary and documentation/specs.

## Migration Plan

1. Update archive record grouping and summary logic.
2. Add missing-ledger fallback record construction.
3. Update shift-reset target totals to include unit kits and crew-name target.
4. Verify with current 2026-05-05 and 2026-05-06 check data.
