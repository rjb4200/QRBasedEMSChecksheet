## Context

The total check target for each unit is `compartments + assigned kits + 1` where the `+1` is the crew-name lock target. The Fleet Panel, Records page, PDF, and unit page progress bar all include this crew target. However, the shift-reset Edge Function that creates archive rows computes totals without the crew target, and the "Previous shift" section on unit pages displays raw archive values.

## Goals / Non-Goals

**Goals:**
- Make the "Previous shift" display on unit pages consistent with other views by including the crew target.
- Ensure the shift-reset archive's `completion_percentage` accounts for the crew target.

**Non-Goals:**
- Do not change how the Fleet Panel or Records page compute totals (they already include the crew target).

## Decisions

1. **Update shift-reset to include crew-name completion in archive totals.**

   Rationale: The shift-reset currently computes `total_compartments` as compartments + kits only. Adding the crew target makes the archive data consistent with all other views.

   Alternative considered: Add +1 at display time in the "Previous shift" section only. This would fix the unit page but leave the archive data inconsistent with all other consumers.

## Risks / Trade-offs

- Existing archived data for past shifts already has the old (no-crew) totals. Historical records will remain with the old totals unless backfilled.
