## Context

The daily readiness records display a timestamp under "Check Status" for checked units. Currently `formatTimestamp()` renders the full locale string including date (e.g., "5/11/2026, 2:30:00 PM"). The operational date is already displayed prominently in the page header and near each unit card, making the date portion redundant.

## Goals / Non-Goals

**Goals:**
- Show only the time portion (e.g., "2:30:00 PM") under "Check Status" for checked units.
- Apply consistently to the screen Records page, printable daily record, and daily email PDF.

**Non-Goals:**
- Do not change other timestamp displays on the page (Started, Submitted columns etc.).
- Do not alter the underlying data or API.

## Decisions

1. **Create a `formatTimeOnly` helper alongside the existing `formatTimestamp`.**

   Rationale: The full `formatTimestamp` is used elsewhere on the page for Started/Submitted columns. A separate helper avoids unintended changes to those fields.

   Alternative considered: Change `formatTimestamp` globally. This would break other timestamp displays that benefit from the date context.

## Risks / Trade-offs

- No risks — purely cosmetic formatting change.
