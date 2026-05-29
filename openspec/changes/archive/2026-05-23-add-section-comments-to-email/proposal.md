## Why

Section comments from compartment and kit checkoffs are now visible on the Records page, the printed daily record, but not in the daily email report. Supervisors reviewing the daily report should be able to see what was documented for each compartment or kit on the selected date without needing to separately open Records.

## What Changes

- Add section comments to the daily email report for the report date.
- Group section comments by unit in the email.
- Label each comment with its source compartment or kit name.
- Hide the section comments block when no section comments exist.
- Preserve existing email report content, layout, and attachment behavior.

## Capabilities

### New Capabilities
- `email-section-comments`: The daily email report includes historical section comments from compartment and kit checkoffs, grouped by unit.

### Modified Capabilities
- `email-alerts`: The daily email report content now includes section comments alongside unchecked units and exceptions.

## Impact

- **Data pipeline**: Update `src/lib/daily-report.ts` to query `daily_section_comments` for the report date.
- **Email builder**: Update `src/lib/email/daily-report.ts` to render section comments grouped by unit.
- **Behavior**: No changes to checkoff, Records page, print layout, comment entry, or attachment behavior.
