## 1. Session Duration

- [x] 1.1 Update `SESSION_TTL_MS` in `src/lib/auth/admin-session.ts` from 12 hours to 180 days.
- [x] 1.2 Update cookie `maxAge` in `src/lib/auth/actions.ts` from 12 hours to 180 days.

## 2. Verification

- [x] 2.1 Run `npm run typecheck` and `npm run lint`.
- [x] 2.2 Verify both TTL constants match (data payload in ms, cookie in seconds).
- [x] 2.3 Verify sign-out still clears the cookie immediately.
