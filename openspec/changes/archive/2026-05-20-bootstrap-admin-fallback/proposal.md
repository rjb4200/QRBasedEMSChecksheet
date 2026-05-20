## Why

If all normal admin accounts become inaccessible, the app currently lacks a controlled recovery path for administrative access. At the same time, the `admin_users` table and service-role admin APIs need tighter protections so recovery access does not rely on permissive database policies or unauthenticated endpoints.

## What Changes

- Add an optional server-side bootstrap admin login path controlled by `BOOTSTRAP_ADMIN_ENABLED`, `BOOTSTRAP_ADMIN_USER`, and `BOOTSTRAP_ADMIN_PASSWORD`.
- Make bootstrap credentials server-only and allow them to create the same admin session/cookie used by normal admin login.
- Remove the permissive `admin_users` RLS policy and keep `admin_users` accessible only through server-side service-role code.
- Require a valid admin session for all `admin-users` API routes before listing, creating, updating, or deleting admin users.
- Preserve normal admin login, Admin Users page behavior, daily report recipient settings, public checkoff flows, QR/NFC routes, fleet panel, records, and daily email behavior.
- Update `ADMINGUIDE.md` with bootstrap admin lockout-recovery guidance.
- Add verification coverage or manual verification notes for bootstrap disabled, bootstrap enabled, normal login, blocked unauthenticated API access, and Supabase advisor cleanup.

## Capabilities

### New Capabilities
- `admin-user-api-authorization`: Admin user management APIs require a valid admin session even when they use service-role database access.
- `bootstrap-admin-recovery`: Optional bootstrap admin credentials provide a recovery admin sign-in path without exposing secrets to the client.

### Modified Capabilities
- `admin-auth`: Admin authentication requirements now include bootstrap recovery login behavior while preserving the existing long-lived admin session model.
- `in-app-documentation-guides`: The admin guide content now includes lockout-recovery guidance for bootstrap admin usage.

## Impact

- **Environment/config**: Add server-only bootstrap admin environment variables.
- **Authentication**: Update admin login flow and session creation logic.
- **Database**: Add a migration to remove permissive `admin_users` RLS access.
- **API security**: Harden `src/app/api/admin-users/route.ts` and `src/app/api/admin-users/[id]/route.ts` behind admin-session checks.
- **Documentation**: Update `ADMINGUIDE.md`.
- **Verification**: Add tests and/or manual verification notes for recovery login and locked-down API access.
