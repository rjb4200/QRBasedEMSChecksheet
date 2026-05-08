## Context

The checkoff form currently receives `initialData` and `previousData`. When a current check has no saved item data, page loaders populate `initialData` from a recent completed check so crews do not re-enter everything. The form also displays previous values as lightweight metadata. This change adds visual warning state only when a prefilled value came from previous data and the value is abnormal.

The warning must not affect save, submit, check status, QR routing, archive behavior, Fleet Panel logic, or persisted data.

## Goals / Non-Goals

**Goals:**
- Detect whether a displayed item value is carried forward from prior check data.
- Flag carried-forward quantity values that are missing/null or below par.
- Flag carried-forward checkbox values that are unchecked or missing/null.
- Flag carried-forward condition values that are missing/null or have status other than `OK`.
- Avoid warning for normal carried-forward values and for values entered/verified today.
- Use compact red labels/outlines consistent with existing operational badge styling.

**Non-Goals:**
- No database changes.
- No new audit history or exception workflow.
- No required confirmation modal.
- No highlighting for every carried-forward value.
- No Fleet Panel, archive, QR, check submission, or analytics changes.

## Decisions

**Infer carry-forward status from current versus previous data.**

The existing page loaders already decide whether `initialData` comes from current check data or previous completed data. Implementation should pass an explicit `carriedForwardData` or equivalent flag/map into `CheckoffForm` so the UI knows which item values originated from prior data. Once a user changes an item in the current session, that item should no longer display the carried-forward warning.

Alternative considered: infer per item by comparing `initialData` and `previousData`. This can misidentify equal current-day values as carried-forward, so explicit source information is safer.

**Keep warning logic in small helper functions.**

Add small helpers such as `carriedForwardNeedsAttention` and `carriedForwardIsMissing` near the checkoff form or in a tiny local utility. This keeps the rule set readable and easy to test manually without introducing broad abstractions.

Alternative considered: reuse discrepancy/exception logic. That logic is designed for completed checks and reports, while this is a UI-only carried-forward state.

**Warn only abnormal carried-forward values.**

Quantity values meeting or exceeding par, checked checkboxes, and `OK` condition values should render normally. Below-par quantities should emphasize the par label. Missing values and unchecked checkboxes should get a stronger red item/card treatment plus short labels like `Missing` or `Needs Check`.

Alternative considered: label all carried-forward values. This was rejected because it creates alert fatigue and distracts crews from real problems.

## Risks / Trade-offs

- **Incorrect source detection**: If the form cannot distinguish previous data from current data, warnings may appear for verified values. Mitigation: pass explicit carried-forward source state from the page loaders.
- **Noisy UI**: Too much red styling can reduce usability. Mitigation: below-par quantity gets a red par label only; stronger outlines are reserved for missing/unchecked/not-OK states.
- **Condition value shape variations**: Condition values are stored as objects with status/value fields. Mitigation: treat non-object, missing, or non-`OK` status as attention only when carried forward.
- **User edits during session**: A warning should disappear once a crew changes the item. Mitigation: track touched item ids in local state and suppress carried-forward warnings for touched items.

## Migration Plan

1. Inspect current `CheckoffForm` data flow for current versus previous item data.
2. Pass explicit carried-forward item data/source state into `CheckoffForm` for compartment and kit checkoffs.
3. Add carried-forward warning helpers and compact label components.
4. Update quantity, checkbox, and condition item rendering to apply warning classes only when helpers return attention state.
5. Verify the acceptance scenarios manually and run typecheck/lint.

Rollback is a normal code revert because no schema or persisted data changes are involved.
