## Context

The project already has lightweight checkoff setup caching through `src/lib/checkoff-cache.ts`, `src/components/checkoff-prefetch.tsx`, and `/api/units/[id]/checkoff-setup/[targetType]/[targetId]`. The current behavior prefetches setup data from the unit dashboard and writes checkoff setup data when forms render, but it does not explicitly prioritize incomplete targets, does not include unit summary caching, and does not define shift-scoped guardrails for the QR/NFC workflow.

This change builds on that existing cache rather than replacing it. The main principle is that cached setup can improve perceived load speed, while live operational state must still come from the server and override any cached display.

## Goals / Non-Goals

**Goals:**
- Prefetch only current-unit/current-shift data during user-accessible QR/NFC checkoff workflows.
- Prefetch unchecked, incomplete, in-progress, and exception-prone targets before completed targets.
- Cache checkoff setup/layout data for about 10 minutes.
- Cache lightweight unit summaries for about 60 seconds after checkoff page open/submit.
- Let matching unit pages render cached summary immediately, then refresh from server.
- Pause/cancel background prefetch when the tab is hidden or the user navigates away.
- Fail silently without breaking normal page loads or submissions.

**Non-Goals:**
- Do not change checkoff submit/save logic.
- Do not change completion, exception, restock, archive/record, or crew signature behavior.
- Do not prefetch the whole fleet or other units.
- Do not treat cached status, submitted values, comments, crew, restock, or exceptions as official truth.
- Do not require users to enter checkoff pages from the unit page.

## Decisions

### Decision 1: Extend the existing cache helper

Use `src/lib/checkoff-cache.ts` for both existing setup cache and the new unit summary cache. Add separate key prefixes:
- `qrCheckoff.formSetup:{unitId}:{targetType}:{targetId}` with 10 minute TTL.
- `qrCheckoff.unitSummary:{unitId}:{shiftDate}:{shiftPeriod}` with 60 second TTL.

Rationale: This keeps QR/NFC prefetch logic in one client-cache module and leaves room for future Issue #36 reuse.

### Decision 2: Use API endpoints for background prefetch payloads

Continue using `/api/units/[id]/checkoff-setup/[targetType]/[targetId]` for setup payloads. Add a lightweight `/api/units/[id]/summary` endpoint or equivalent route that accepts `shiftDate` and `shiftPeriod` and returns only the unit dashboard summary fields needed for immediate display.

Rationale: Client components cannot call server-only database helpers directly. API endpoints make background fetches cancelable with `AbortController` and keep service-role queries server-side.

### Decision 3: Cache setup data but not live state

Setup cache can include target metadata, item names, par levels, input types, group labels, sort order, and QR target metadata. It must not include submitted values, completion status, exceptions, restock state, crew signatures, comments, or unit service status as source of truth.

Rationale: Setup/layout data changes infrequently and is safe to reuse briefly. Live checkoff status changes frequently and must be server-owned.

### Decision 4: Unit page controls prefetch priority

The server-rendered unit page already has current shift checks and target status. It should pass only eligible targets to the client prefetch component, ordered by priority: not started, in progress, incomplete, then known exception/failing candidates. Completed targets should not be prefetched first and may be skipped entirely for this version.

Rationale: The unit page has the authoritative current-shift context needed to choose likely next targets without extra client-side discovery.

### Decision 5: Prefetch is cooperative and cancelable

Run setup prefetch after the page is usable with concurrency 2. Use `AbortController`, skip fresh cache entries, pause while `document.hidden`, and abort on unmount/navigation. Unit summary prefetch after checkoff open/submit should also abort on unmount and fail silently.

Rationale: Prefetch should improve perceived speed only when it has spare browser/network capacity. It must not compete with the active page.

### Decision 6: Cached unit summary is an initial hint only

The unit page may show cached summary immediately through a small client enhancement, but the server-rendered unit page remains the official render. Any fresh server response replaces the cached summary.

Rationale: This reduces perceived back-navigation delay without making cached operational state authoritative.

## Risks / Trade-offs

- **Risk**: Prefetch adds network requests. -> **Mitigation**: Scope to one unit/shift, skip completed targets, use concurrency 2, and skip fresh cache.
- **Risk**: Cached summary could look stale. -> **Mitigation**: 60 second TTL and immediate server refresh override.
- **Risk**: API route shape can duplicate dashboard logic. -> **Mitigation**: Keep the summary endpoint lightweight and factor shared summary-building code only if duplication becomes meaningful.
- **Risk**: Browser storage is unavailable or full. -> **Mitigation**: Cache helper catches errors and normal page loads continue.

## Migration Plan

1. Extend cache helper with unit summary read/write and fresh setup helpers.
2. Add unit summary API endpoint.
3. Update unit page to pass prioritized current-shift targets to prefetch and optionally render cached summary hint.
4. Update checkoff pages/forms to prefetch unit summary after open and successful submit.
5. Verify normal submit, completion, exceptions, restock, crew lock, and comments remain server-driven.
6. Rollback: remove summary cache/API/client calls and restore previous prefetch behavior.
