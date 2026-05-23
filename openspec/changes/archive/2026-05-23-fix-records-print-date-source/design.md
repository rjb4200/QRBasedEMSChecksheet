## Context

The Records page renders `selectedDate` on the server from query params and then uses that value to build a static Print link. That means the Records form can visually show a newly selected date while the Print link still points at the old server-rendered date until Filter is submitted and the page reloads. The print route already accepts `date` and `unitId` query parameters correctly.

## Goals / Non-Goals

**Goals:**
- Ensure the Print action uses the current Records form values immediately.
- Preserve both `date` and `unitId` in the print URL.
- Keep the print route logic and print layout unchanged.

**Non-Goals:**
- Do not redesign the Records page.
- Do not change archive calculations or daily ledger behavior.
- Do not change checkoff submission or print styling.

## Decisions

### Decision 1: Use a GET form submit for Print

The preferred implementation is to make the Print action submit the same Records filter form to `/admin/archives/print` using `GET`, so the browser includes the current `date` and `unitId` input values.

Rationale: This avoids extra client state, matches existing HTML form behavior, and guarantees the URL reflects the current visible form values at click time.

### Decision 2: Keep the print route as-is

`/admin/archives/print` already reads `date` and `unitId` from query params. No archive data logic changes are needed beyond continuing to trust those inputs.

Rationale: The bug is in the Records page link generation, not in the print route data loading.

## Risks / Trade-offs

- **Risk**: Multiple actions from one form can become awkward in server-rendered markup. -> **Mitigation**: Use standard HTML form targets/actions or a small client helper only if GET form submission is impractical.
- **Risk**: Unit filter could be accidentally dropped from the print URL. -> **Mitigation**: Ensure the form includes the same `unitId` input for both Filter and Print actions.

## Migration Plan

1. Update the Records page form so Print submits current `date` and `unitId` values to `/admin/archives/print`.
2. Verify print output matches the selected Records form date without requiring Filter first.
3. Verify unit filter is preserved.
4. Run lint, typecheck, and build.
