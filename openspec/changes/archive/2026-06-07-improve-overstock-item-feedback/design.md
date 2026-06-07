## Context

The daily check form renders each compartment or shared-kit item inside the shared `CheckoffForm` client component. Quantity items already have live local state for the found count and know their configured `par_level`; checkbox and condition items also render from the same live state. Existing warning logic is primarily tied to carried-forward values and red treatment, while normal quantity items display par text even when the found count exactly matches par.

Issue #96 refines this into clearer live feedback: red for missing or understocked, amber for attention states, text-only for a one-item overstock, and no par/helper clutter for normal at-par items.

## Goals / Non-Goals

**Goals:**

- Classify each rendered item card from live form values so feedback updates immediately as crews tap quantity steppers, check boxes, or change condition status.
- Treat unchecked checkbox items as `Missing` with red pill, light red background, and red border.
- Treat quantity values below par as understocked with red visual treatment.
- Treat quantity values over par by exactly 1 as text-only overstock feedback.
- Treat quantity values over par by 2 or more as amber attention feedback.
- Treat condition values with non-OK status as amber attention feedback.
- Hide par/helper text for normal quantity items at par.

**Non-Goals:**

- Do not change database schema or saved checkoff data shape.
- Do not change auto-save or submit behavior.
- Do not add overstocked items to the unit restocking list unless separately requested.
- Do not alter QR routing, crew lock, or unit dashboard completion behavior.

## Decisions

1. Compute display feedback inside `CheckoffForm` from live `values`.

   Rationale: The form already has the current value, item type, and par level. Computing feedback locally keeps the behavior immediate and avoids extra persistence or server reads.

   Alternative considered: Add overstock classification to `restocking-list.ts`. That would make sense if overstocked items should appear in restocking workflows, but the requested behavior is visual feedback while checking.

2. Keep severity ordering explicit: red failure, amber attention, text-only minor attention, neutral.

   Rationale: Missing and understocked states require stronger treatment than overstock and non-OK condition states. Overstock by 1 should be visible but intentionally low-noise.

   Alternative considered: Make all overstock states amber. The user specifically preferred over-by-1 helper text without background or border changes.

3. Hide par pills for neutral at-par quantity items.

   Rationale: Par text is most useful when it explains an exception. Removing it from normal cards reduces clutter and makes exception states easier to scan.

   Alternative considered: Always show `Par X` but style it neutrally. This preserves existing information but works against the issue's goal of reducing normal-state clutter.

4. Preserve existing restocking list semantics.

   Rationale: Restocking currently means missing, below par, or condition issue. Overstock is an attention signal during checking, not necessarily a restocking task.

   Alternative considered: Include overstock in the restocking list. This would broaden the workflow and may require new labels/actions, so it is better handled as a separate change if desired.

## Risks / Trade-offs

- Users may expect overstocked items to appear in the restocking list after seeing them highlighted in the form. Mitigation: keep this proposal scoped to active check feedback and create a follow-up if restocking workflow should include overstock.
- Existing carried-forward warning behavior may overlap with live feedback. Mitigation: give live current-value severity priority for understocked, missing, overstocked, and non-OK condition states while keeping previous-value reference text intact.
- Amber condition treatment changes the perceived severity of `Low` and `Missing` condition statuses. Mitigation: this matches the user's direction that `Not OK` condition states should be amber, while checkbox missing and quantity below par remain red.
