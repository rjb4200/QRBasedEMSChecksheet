## Context

The `StorageWarningBanner` component on the Fleet Panel only shows when usage exceeds 90%. There is no way for admins to see current storage usage at lower levels. The System Log page is an audit/monitoring page and is the right place for a persistent system health display. The data pipeline (`getDatabaseUsage()`) already exists.

## Goals / Non-Goals

**Goals:**
- Show database usage percentage, MB used/limit, and last-checked timestamp on the System Log page.
- Color-code the display based on usage thresholds.
- Reuse the existing `getDatabaseUsage()` helper.

**Non-Goals:**
- Do not add a separate status label or banner.
- Do not add export, delete, clear, or rotation behavior.
- Do not change the Fleet Panel storage warning banner.

## Decisions

### Decision 1: Server-side data fetch inline on the page

Call `getDatabaseUsage()` directly in the System Log server component and pass the result to the rendered card.

Rationale: The page is already a server component that fetches data. Adding one more server-side call is the smallest change. No API route needed.

### Decision 2: Place between page title and filter form

Render the usage card after the page description and before the filter form.

Rationale: This is a system health indicator, not a filter or a result. Placing it at the top makes it visible before the log content.

### Decision 3: Color thresholds match app design

| Range | Color |
|-------|-------|
| 0-79% | Normal (`text-slate-700`) |
| 80-89% | Caution (`text-amber-600`) |
| 90-94% | Warning (`text-orange-600`) |
| 95%+ | Critical (`text-red-700`) |

## Risks / Trade-offs

- **Risk**: `getDatabaseUsage()` could fail silently (returns zeros on error). -> **Mitigation**: Already handled — the helper catches errors and returns `{ sizeMB: 0, limitMB, percentage: 0 }`.
