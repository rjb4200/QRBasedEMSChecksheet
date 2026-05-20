## Why

QR/NFC checkoff workflows usually stay within one unit for the current date/shift, but the app currently treats each unit page and checkoff page as isolated loads. Unit-scoped prefetching can make the next likely EC1/Medic/etc. page feel faster without changing database-driven status, submissions, exceptions, or restock truth.

## What Changes

- Extend existing checkoff setup caching to be explicitly unit-scoped and target-prioritized.
- From the unit page, prefetch only current-unit unchecked, incomplete, in-progress, or failing compartment/kit setup payloads after the page is usable.
- From compartment/kit checkoff pages, prefetch a fresh lightweight unit summary for the same unit/date/shift after opening and after successful submit.
- Add a short-lived unit summary cache with a default 60 second TTL.
- Allow the unit page to render from a matching cached summary immediately, then refresh live server data and override cached display.
- Keep submitted values, completion state, exceptions, restock state, crew names/signatures, comments, and unit service status server-truth only.
- Respect background prefetch guardrails: current unit only, current shift only, small concurrency, no blocking render, pause/cancel on hidden tab/navigation, silent failure.

## Capabilities

### New Capabilities
<!-- None. -->

### Modified Capabilities
- `checkoff-cache-prefetch`: Existing checkoff setup prefetching becomes unit/shift-scoped, prioritizes likely next targets, adds short-lived unit summary prefetch/cache, and formalizes live-state cache boundaries.

## Impact

- **Client cache**: Extend `src/lib/checkoff-cache.ts` for unit summary caching and stricter setup cache helpers.
- **Unit page**: Update `src/app/units/[id]/page.tsx` and related client components to consume cached unit summary and prefetch only relevant targets.
- **Checkoff pages/forms**: Trigger same-unit summary prefetch after opening and successful submit from compartment/kit checkoff pages.
- **API/data**: Add or reuse lightweight API endpoints for unit summary and checkoff setup payloads.
- **Behavior**: No changes to checkoff submission logic, completion logic, restock logic, archives/records, or crew signature behavior.
