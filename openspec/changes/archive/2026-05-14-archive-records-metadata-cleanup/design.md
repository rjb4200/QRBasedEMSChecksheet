## Context

Archive record detail pages are intended for operational review of historical unit checkoffs. Some archive records, especially older records, do not include optional timing, checked-by, or ledger status-note metadata. The current UI renders placeholder values for those missing fields, which adds clutter without adding operational value.

## Goals / Non-Goals

**Goals:**
- Render archive detail metadata only when it contains meaningful data.
- Keep core operational record information visible regardless of optional metadata availability.
- Use clearer timestamp labeling when the displayed timestamp is the archive creation time.
- Preserve existing archive data and historical check data.

**Non-Goals:**
- Do not change archive table structure or stored data.
- Do not change checkoff submission, shift reset, or archive creation behavior.
- Do not redesign the entire Records or archive interface.
- Do not change print, CSV, or email/PDF output unless the same detail component is reused there.

## Decisions

1. **Hide optional metadata rows rather than replacing placeholder text.**

   Rationale: Empty optional values like missing start time, duration, checked-by user, or status note do not help operational review. Omitting them creates a cleaner record while preserving all available data.

   Alternative considered: Keep labels and replace placeholder text with blanks. This still consumes space and leaves visually incomplete rows.

2. **Treat shift, operational date, archived/submitted timestamp, completion totals, comments, and check data as operational content.**

   Rationale: These fields define the historical record and should remain visible even when optional metadata is absent.

   Alternative considered: Make all metadata conditional. That risks hiding required context and making records harder to interpret.

3. **Label archive creation timestamps as "Archived At" on archive detail pages.**

   Rationale: If the value comes from archive creation rather than an explicit crew submit event, the label should describe what the user is seeing.

   Alternative considered: Continue using "Submitted". That can imply a crew action that may not have occurred for archived historical rows.

## Risks / Trade-offs

- Optional fields become less discoverable when absent -> The page still shows all core record details and preserves data for records where optional metadata exists.
- Some users may expect "Submitted" wording -> The clearer "Archived At" label better matches archive behavior and avoids misleading interpretation.
- A shared metadata component could affect more than archive detail pages -> Scope the implementation to archive detail rendering paths unless shared behavior is explicitly intended.
