## Context

The admin session uses two duration constants that must stay in sync:
- `SESSION_TTL_MS` in `admin-session.ts` — server-side HMAC payload expiry (milliseconds)
- `maxAge` in `actions.ts` — browser cookie max-age (seconds)

Both are currently 12 hours. They need to be updated together to 180 days.

## Goals / Non-Goals

**Goals:**
- Change `SESSION_TTL_MS` to `180 * 24 * 60 * 60 * 1000` (180 days in ms).
- Change `maxAge` to `180 * 24 * 60 * 60` (180 days in seconds).
- Preserve all existing cookie security attributes.

**Non-Goals:**
- Do not change the session cookie name, HMAC algorithm, or verification logic.
- Do not change the sign-out flow or password verification.
- Do not introduce refresh tokens or sliding expiration.

## Decisions

1. **Keep both duration values as simple constants.**

   Rationale: There are only two places. Extracting to a shared constant adds indirection without reducing duplication risk — the values are different units (ms vs seconds).

   Alternative considered: Import a shared constant. Over-engineering for a two-location change.

## Risks / Trade-offs

- A 180-day session means a compromised session cookie is valid for longer -> The cookie remains httpOnly, sameSite lax, and HMAC-signed. The existing security model is unchanged.
- Session secret rotation would invalidate all sessions -> This is existing behavior and unchanged by this extension.
