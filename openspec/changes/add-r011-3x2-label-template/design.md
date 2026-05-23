## Context

The QR codes page already supports two label-sheet formats: Spartan S004 3x3 and Avery 94237 3x2 rotated. Template-specific logic currently lives in `page.tsx` and `print-button.tsx`, with separate position functions, capacity constants, and grid renderers. R011 adds another rotated 3x2 format but with different sheet geometry and a larger 10-label capacity.

## Goals / Non-Goals

**Goals:**
- Add a third selectable QR label template for R011 rotated 3x2 sheets.
- Use the provided physical geometry exactly: 3x2 labels, 0.25in top margin, 0.75in left margin, 4in horizontal pitch, 2in vertical pitch, 2 columns, 5 rows.
- Cap selected physical labels at 10 for the R011 format.
- Preserve the existing Spartan and Avery template behavior.

**Non-Goals:**
- Do not change QR target generation or URL formats.
- Do not redesign the overall QR codes page.
- Do not refactor the entire template system unless needed for minimal support of R011.

## Decisions

### Decision 1: Treat R011 as a third explicit template

Expose R011 as a separate format choice instead of overloading the Avery format.

Rationale: R011 is physically distinct even though it is also a rotated 3x2 sheet. Keeping it explicit avoids geometry ambiguity and makes troubleshooting print alignment easier.

### Decision 2: Reuse rotated label rendering where possible

The R011 format will reuse the rotated-content pattern used by the Avery template, while supplying its own label capacity and position calculation.

Rationale: The label content orientation is the same class of behavior, so the main distinction is geometry rather than content structure.

### Decision 3: Keep fixed-position geometry in code

Implement R011 with hardcoded sheet geometry values and a dedicated position helper.

Rationale: The existing system already uses explicit physical positions for print accuracy. Matching that pattern minimizes risk and keeps print alignment deterministic.

## Risks / Trade-offs

- **Risk**: Small margin or pitch mistakes will waste physical labels. -> **Mitigation**: Encode the provided geometry exactly and verify against a printed calibration sheet.
- **Risk**: Another template increases branching in the current QR print code. -> **Mitigation**: Keep the new path small and template-specific rather than broadly refactoring the label system in the same change.
- **Risk**: Users may confuse Avery 94237 and R011 because both are rotated 3x2. -> **Mitigation**: Give each format a distinct selector label and selection-limit message.

## Migration Plan

1. Add the R011 selector option and query-param handling.
2. Add R011 label capacity constant and position helper.
3. Reuse or extend the rotated label grid to support R011 geometry.
4. Validate selector behavior, capacity limit, and printed alignment.
5. Run lint, typecheck, and build.
