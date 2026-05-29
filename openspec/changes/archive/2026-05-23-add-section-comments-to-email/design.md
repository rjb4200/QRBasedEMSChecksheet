## Context

The daily email report currently includes unchecked units and exceptions but not section comments. The section comments table (`daily_section_comments`) already exists and is populated during checkoff submissions. The Records page and print view already read and display them. This change adds the same data to the email report.

## Goals / Non-Goals

**Goals:**
- Add section comments to the daily email report for the report date.
- Group comments by unit for readability.
- Label each comment with the source compartment or kit name.
- Omit the section comments block when no comments exist.
- Preserve the existing email structure.

**Non-Goals:**
- Do not redesign the email report layout.
- Do not change comment entry, checkoff logic, Records, or print behavior.
- Do not add push notifications.

## Decisions

### Decision 1: Query section comments alongside existing report data

Add a `daily_section_comments` query to `getDailyEmailReport` and join the unit name. Group comments by unit in the email builder.

Rationale: The safest extension of the existing report pipeline. The existing queries already filter by `shift_date`, so adding section comments is one more parallel query.

### Decision 2: Group by unit in the email output

Render section comments grouped by unit with source-name labels.

Rationale: A flat list of comments without unit context would be hard to parse. Grouping by unit matches how the Records page presents the information.

## Risks / Trade-offs

- **Risk**: A day with many section comments could make the email long. -> **Mitigation**: The schema limits comments to one per source per shift and 2000 characters each. This is manageable.

## Migration Plan

1. Add section comment type and query to `daily-report.ts`.
2. Add section comment rendering to the email builder.
3. Run lint, typecheck, and build.
