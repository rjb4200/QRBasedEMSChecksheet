## 1. Cache Helper Extensions

- [x] 1.1 Extend `src/lib/checkoff-cache.ts` with unit summary cache types and helpers
- [x] 1.2 Add `qrCheckoff.unitSummary:{unitId}:{shiftDate}:{shiftPeriod}` key generation
- [x] 1.3 Add 60 second TTL for unit summary cache entries
- [x] 1.4 Add helper to check whether form setup cache is fresh before prefetching
- [x] 1.5 Ensure setup cache writes include only safe setup/layout fields
- [x] 1.6 Ensure cache helpers silently handle unavailable/full localStorage

## 2. Unit Summary API

- [x] 2.1 Create lightweight unit summary API endpoint for current unit/date/shift
- [x] 2.2 Include only display summary data needed for fast unit page feedback
- [x] 2.3 Exclude submitted item values, exceptions, restock addressed state, crew signatures, comments, and service status as cache source-of-truth fields
- [x] 2.4 Validate endpoint scopes requests to the requested unit and provided current shift

## 3. Unit Page Prefetch

- [x] 3.1 Update unit dashboard target list to pass current-shift status to prefetch client
- [x] 3.2 Filter setup prefetch to current-unit incomplete, in-progress, not-started, or exception/failing targets
- [x] 3.3 Prioritize not-started, in-progress, incomplete, and exception/failing targets before completed targets
- [x] 3.4 Keep setup prefetch concurrency at 2
- [x] 3.5 Skip setup prefetch requests when a fresh setup cache exists
- [x] 3.6 Pause new setup prefetch requests while `document.hidden` is true
- [x] 3.7 Abort pending setup prefetch requests on navigation/unmount

## 4. Checkoff Page Unit Summary Prefetch

- [x] 4.1 Add client component or hook to prefetch unit summary after compartment checkoff page opens
- [x] 4.2 Add client component or hook to prefetch unit summary after kit checkoff page opens
- [x] 4.3 Trigger unit summary prefetch after successful compartment submit
- [x] 4.4 Trigger unit summary prefetch after successful kit submit
- [x] 4.5 Store unit summary cache under current unit/date/shift key
- [x] 4.6 Abort unit summary prefetch on unmount/navigation
- [x] 4.7 Ensure unit summary prefetch failures degrade silently

## 5. Cached Unit Summary Display

- [x] 5.1 Add unit page client enhancement that reads matching unit summary cache on load
- [x] 5.2 Render cached unit summary only when unitId, shiftDate, and shiftPeriod match
- [x] 5.3 Refresh from server immediately and replace cached summary with live server data
- [x] 5.4 Ensure server-rendered unit status, check status, restock, crew, comments, and exceptions remain official truth

## 6. Verification

- [x] 6.1 Run `npm run lint` and fix any issues
- [x] 6.2 Run `npm run typecheck` and fix any issues
- [x] 6.3 Run `npm run build` and verify no build errors
- [ ] 6.4 Manual test: open EC1 compartment by QR/NFC and confirm unit summary prefetch runs
- [ ] 6.5 Manual test: submit a compartment/kit and confirm same-unit summary cache refreshes
- [ ] 6.6 Manual test: navigate back to EC1 unit page and confirm cached summary appears quickly then server refresh applies
- [ ] 6.7 Manual test: open EC1 unit page with unchecked targets and confirm only EC1 setup prefetch runs
- [ ] 6.8 Manual test: open another EC1 QR/NFC target and confirm cached setup can render quickly while live data applies
- [ ] 6.9 Manual test: confirm completed/in-progress status, exceptions, restock list, comments, crew signatures, and unit service status remain accurate from server
- [ ] 6.10 Manual test: confirm EC2/other units are not prefetched while working EC1
- [ ] 6.11 Manual test: confirm prefetch pauses/stops when tab is hidden or user navigates away
