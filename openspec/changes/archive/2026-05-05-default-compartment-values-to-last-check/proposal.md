## Why

Crews currently must manually adjust each compartment item from par values to match actual inventory during checkoffs. This creates extra work since most items remain consistent from day to day. Defaulting to the last completed check's values (within 7 days) will reduce data entry time and improve accuracy by starting from actual inventory rather than theoretical par levels.

## What Changes

- Change compartment check default values from par to last completed check values
- Look back up to 7 days for the most recent completed check per unit
- If no completed check exists within 7 days, fall back to par values
- The most recent completed check is defined as a check where the crew lock was engaged

## Capabilities

### New Capabilities

- `smart-default-values`: Default compartment values populated from the most recent completed check within 7 days, falling back to par when no recent check exists.

### Modified Capabilities

- None. This enhances the existing checkoff workflow without changing requirements.

## Impact

- Updates to checkoff page logic to query previous day's completed check
- Updates to unit data fetching to include last check values
- No database schema changes required
- No changes to print or records functionality