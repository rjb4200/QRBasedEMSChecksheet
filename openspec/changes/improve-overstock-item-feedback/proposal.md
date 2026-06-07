## Why

Daily check quantity cards currently do not clearly distinguish overstocked items from normal counts, and normal at-par items still show par-related text that adds visual noise. Crews need exception states to stand out while checking a compartment without confusing attention items with true missing or understocked failures.

## What Changes

- Add live quantity feedback for overstocked and understocked daily check items.
- Treat unchecked checkbox items as missing/below-par failures with red visual treatment.
- Use red card treatment for missing and understocked states, including a red pill/helper and light red card background with red border.
- Use amber card treatment for condition items that are not OK and for quantity items over par by 2 or more.
- Show `Overstocked: +X` helper text for overstocked quantity items.
- Show text-only `Overstocked: +1` feedback for quantity items over par by exactly 1, without amber card background or border.
- Hide par/helper text for normal quantity items that are exactly at par.
- Keep normal completed items visually neutral.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `compartment-checkoff`: Daily check item cards will provide clearer live visual feedback for missing, understocked, overstocked, and non-OK condition states.

## Impact

- Affects the daily checkoff form item-card rendering for compartments and shared kits because both use the shared `CheckoffForm` component.
- No database schema, API, authentication, or notification changes expected.
- No change expected to restocking list generation unless implementation reveals a shared helper should be refactored for display-only state classification.
