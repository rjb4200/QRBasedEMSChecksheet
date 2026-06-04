## Context

The daily email body is generated in `buildDailyReportEmail()` which currently assembles three separate sections: unchecked units, exceptions (per-item), and section comments. The report data comes from `getDailyEmailReport()` which queries unit status, discrepancies, and section comments.

## Goals / Non-Goals

**Goals:**

- Add a `generalComments` field to the report data, sourced from `daily_unit_comments`.
- Add `exceptionCounts` as per-unit counts of discrepancies.
- Replace the three-section layout with per-unit HTML cards.
- Include a summary stats line at the top.
- Show complete units as compact green cards.

**Non-Goals:**

- Change the email sending mechanism or recipient logic.
- Change the PDF attachment.
- Remove the plain-text version of the email.

## Decisions

1. Per-unit card layout.

   Each unit gets an HTML card with status badge, checks count, progress bar, and comments. Complete units get a compact version. This replaces the linear checklist format with scannable visual blocks.

   Alternative: keep list format but collapse exceptions. Doesn't solve the core organization problem.

2. Inline HTML styling for email compatibility.

   Email clients strip external stylesheets, so all card styling uses inline `<div style="...">` attributes. Progress bars use nested divs with percentage widths. Badges use inline-padded spans with rounded corners.

   Alternative: use a dedicated email template library. Overkill for a single report format.

3. Green compact cards for complete units.

   Units at 100% completion with zero exceptions get a condensed borderless green card showing only the unit name and checkmark. This keeps the email short when most units are complete.

   Alternative: show all units in the same format. Longer email with less visual distinction.
