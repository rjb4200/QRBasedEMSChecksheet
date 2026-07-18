## Context

The Records page currently renders `Last 14 Days Check Completion` through a dedicated server component and `getTrendGroups` data helper. The helper independently reconstructs unit completion from ledger, check, and crew rows, creating a second definition of completion beside the Daily Readiness record model. The chart is known to be inaccurate and will be replaced by a separately designed work-completion metric.

## Goals / Non-Goals

**Goals:**

- Remove all active application code that exclusively supports the retired chart.
- Remove active OpenSpec requirements that require the chart or its investigation.
- Preserve Daily Readiness records and the rest of the `/admin/archives` interface.

**Non-Goals:**

- Build a replacement completion metric or visualization.
- Alter daily ledger, archive, crew, or checkoff data.
- Change selected-date records, exports, printing, or clear-records behavior.

## Decisions

### Remove the entire chart path

The page section, suspense fallback, component, trend helper, focused tests, and public helper export will be removed together.

Rationale: none of these elements have consumers outside the retired chart path. Retaining a partially unused aggregation helper would preserve an ambiguous completion definition and make a later replacement more likely to inherit it.

Alternative considered: hide the component while preserving the helper. Rejected because this leaves unneeded behavior and tests that imply the old metric remains supported.

### Retire active requirements without rewriting archive history

The active `records-completion-trend` capability will be removed. The active `archive-history` and `records-module-architecture` requirements will remove chart-specific language. Archived OpenSpec change artifacts will remain unchanged.

Rationale: active specifications define current obligations; archived changes document why previous work occurred and must remain auditable.

## Risks / Trade-offs

- [Administrators temporarily lose a multi-day visual signal] -> The inaccurate signal is removed before a replacement is proposed; selected-date readiness summaries remain available.
- [Unintended records-page regression during layout cleanup] -> Limit page edits to chart-specific imports, section, and skeleton; verify filter, summaries, cards, exports, printing, and clear-records controls still render.
- [Stale references remain] -> Search code and active specifications for the component name, helper name, and chart title after removal.
