## Context

The Fleet Panel currently shows unit cards, a daily checksheet print action, and an Exceptions section with date-grouped discrepancies. It does not show recent section comments. Adding a collapsed Recent Comments section between the print bar and the Exceptions section gives supervisors a compact way to scan recent notes without opening Records.

## Goals / Non-Goals

**Goals:**
- Add a collapsed-by-default Recent Comments section to the Fleet Panel.
- Lazy-load comments via a dedicated API route only when the section is expanded.
- Query `daily_section_comments` for the last 7 rolling days.
- Order comments newest first.
- Limit results to 50.
- Show a loading state and empty state.

**Non-Goals:**
- Do not load comments during initial Fleet Panel render.
- Do not change checkoff, Records, email, or notification behavior.
- Do not add search/filter/export in this phase.

## Decisions

### Decision 1: Dedicated API route instead of server-component query

Create a new `/api/admin/recent-comments` endpoint that queries `daily_section_comments` and joins unit names. The Fleet Panel remains a fast server component and the comments fetch happens asynchronously in the browser only when the section is expanded.

Rationale: This avoids blocking the Fleet Panel render with a potentially expensive secondary query and keeps the feature entirely optional for users who don't expand it.

### Decision 2: Client-side `<details>` with lazy fetch

Use a native `<details>` element for the collapsible section. When the `toggle` event fires and the section opens, trigger a `fetch()` to the API route. Show a loading spinner while waiting.

Rationale: This matches the Exceptions section's existing disclosure pattern and requires no additional state management library.

### Decision 3: Placement between print bar and Exceptions

Insert the Recent Comments section after the daily checksheet print / admin guide bar and before the Exceptions section.

Rationale: This groups it logically — the print bar is a single action row, the comments section is a compact summary, and the detailed Exceptions section comes last.

## Risks / Trade-offs

- **Risk**: The API route could be called without an admin session. -> **Mitigation**: Add admin session verification to the route.
- **Risk**: 7 days of comments could return a large dataset. -> **Mitigation**: Limit to 50 results and order by recency.

## Migration Plan

1. Create the API route.
2. Create the client component.
3. Add the component to the Fleet Panel.
4. Run lint, typecheck, and build.
