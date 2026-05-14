## Why

The admin authentication session currently expires after 12 hours, forcing administrators to re-enter credentials daily. On shared workstations and mobile devices this creates repeated interruptions during routine tasks like printing QR labels, reviewing records, and managing fleet readiness.

## What Changes

- Extend the admin session cookie maxAge from 12 hours to 180 days.
- Extend the HMAC session payload TTL from 12 hours to 180 days so the server-side validation matches the cookie lifetime.
- Preserve explicit logout behavior — clicking Sign Out still clears the cookie and ends the session immediately.
- Preserve all existing cookie security attributes (httpOnly, sameSite, secure).

## Capabilities

### New Capabilities

### Modified Capabilities
- Admin authentication: Session duration extended from 12 hours to 180 days.

## Impact

- `src/lib/auth/admin-session.ts` `SESSION_TTL_MS` constant.
- `src/lib/auth/actions.ts` cookie `maxAge` value.
- No database changes, no new dependencies.
