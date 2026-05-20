## Context

Admin sign-in currently depends on persisted `admin_users` records, and the admin-user management APIs already use service-role database access. That combination creates two security gaps: a total admin lockout has no controlled recovery path, and permissive `admin_users` RLS or unauthenticated service-role routes could expose privileged account management. This change touches authentication, API authorization, database policy hardening, Supabase advisor posture, and admin documentation.

## Goals / Non-Goals

**Goals:**
- Add an optional bootstrap admin recovery login controlled entirely by server-only environment variables.
- Reuse the existing admin session/cookie format so downstream admin authorization remains unchanged after sign-in.
- Remove permissive `admin_users` RLS access while keeping the table usable through server-side service-role code.
- Require a valid admin session before any `admin-users` API route performs reads or writes.
- Preserve existing Admin Users page behavior, report-recipient settings, and all non-admin workflows.
- Document lockout recovery clearly in `ADMINGUIDE.md`.

**Non-Goals:**
- Do not replace normal `admin_users` login as the primary sign-in path.
- Do not expose bootstrap credentials to the client or browser runtime.
- Do not broaden public access to `admin_users` through new RLS policies.
- Do not change public crew checkoff, QR/NFC routing, fleet operations, records, or daily email generation behavior.

## Decisions

### Decision 1: Bootstrap login reuses existing admin session creation

The bootstrap path will validate `BOOTSTRAP_ADMIN_ENABLED`, `BOOTSTRAP_ADMIN_USER`, and `BOOTSTRAP_ADMIN_PASSWORD` on the server during admin login, and on success it will create the same session cookie shape as normal admin login.

Rationale: This avoids branching all downstream admin authorization paths and ensures the Admin Users page and protected APIs continue to rely on one session model.

Alternative considered: separate bootstrap-only session marker. Rejected because it would require conditional logic across every admin route and API.

### Decision 2: Bootstrap secrets remain server-only env vars

Bootstrap credentials will only be read from non-`NEXT_PUBLIC` environment variables in server code. They will never be logged, serialized, returned in responses, or rendered into client bundles.

Rationale: Recovery credentials are high-impact secrets and must not leak through browser-exposed config.

### Decision 3: `admin_users` access is service-role only plus app-level session checks

The permissive `USING (true)` / `WITH CHECK (true)` RLS policy will be removed via migration while keeping RLS enabled. Admin-user management will continue through service-role server code, but only after the route verifies a valid admin session.

Rationale: This keeps database access narrow and makes application authorization explicit at the API boundary.

Alternative considered: adding narrower authenticated RLS policies. Rejected because current callers already use service-role access and the preferred model is server-side-only access.

### Decision 4: API hardening happens at each admin-users route boundary

`src/app/api/admin-users/route.ts` and `src/app/api/admin-users/[id]/route.ts` will verify admin session presence before executing any list/create/update/delete behavior.

Rationale: These routes are direct service-role entry points and must enforce authorization even if called outside the Admin Users page UI.

### Decision 5: Verification includes security and recovery scenarios

Implementation must cover bootstrap disabled, bootstrap enabled, normal admin login, rejected unauthenticated API access, and confirmation that the Supabase advisor warning about permissive access is resolved.

Rationale: This change is security-sensitive and needs both positive and negative-path verification.

## Risks / Trade-offs

- **Risk**: Bootstrap credentials could accidentally become the default admin path. -> **Mitigation**: Keep bootstrap disabled unless explicitly enabled and preserve normal admin login precedence/behavior.
- **Risk**: Removing permissive RLS could break code paths that rely on non-service-role access. -> **Mitigation**: Audit all `admin_users` access points before implementation and keep server-side service-role callers intact.
- **Risk**: Lockout recovery guidance could encourage leaving bootstrap enabled indefinitely. -> **Mitigation**: Document bootstrap as a recovery mechanism and instruct admins to disable or rotate it after use.
- **Risk**: API hardening could unintentionally break the Admin Users page. -> **Mitigation**: Reuse the same admin session validation already trusted by the admin app shell and verify page behavior end-to-end.

## Migration Plan

1. Add a Supabase migration that removes the permissive `admin_users` RLS policy and leaves RLS enabled.
2. Update server-side admin auth flow to optionally accept bootstrap credentials and create the standard admin session.
3. Add admin-session enforcement to `admin-users` API routes before any service-role database action.
4. Update `ADMINGUIDE.md` with lockout-recovery/bootstrap guidance.
5. Run lint/typecheck/build and verify bootstrap-on, bootstrap-off, normal login, and unauthorized API rejection.
6. Rollback: restore the previous login code and, if necessary, reintroduce the removed policy with a follow-up security review.
