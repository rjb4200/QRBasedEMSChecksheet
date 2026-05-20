# Bootstrap Admin Fallback Verification

## Notes

- No automated test runner is currently configured in this repository.
- Verification for this change is tracked with the manual scenarios below plus lint, typecheck, and build.

## Manual Checks

### Bootstrap disabled

1. Leave `BOOTSTRAP_ADMIN_ENABLED` unset or set it to `false`.
2. Attempt login with `BOOTSTRAP_ADMIN_USER` / `BOOTSTRAP_ADMIN_PASSWORD` values.
3. Confirm login fails.
4. Confirm normal persisted admin login still succeeds.

### Bootstrap enabled

1. Set `BOOTSTRAP_ADMIN_ENABLED=true` with server-only bootstrap credentials.
2. Sign in through `/login` using the bootstrap credentials.
3. Confirm the app reaches `/admin` and the normal admin cookie/session is established.
4. Confirm Admin Users page loads.

### Normal admin login unchanged

1. With bootstrap disabled, sign in using an existing `admin_users` account.
2. Confirm `/admin`, Admin Users, report-recipient settings, records, and fleet pages work normally.
3. Repeat with bootstrap enabled and confirm persisted admin login still works.

### Unauthenticated API access blocked

1. Remove the admin cookie or use a private browser session.
2. Call `GET /api/admin-users`.
3. Call `POST /api/admin-users`.
4. Call `PUT` or `PATCH /api/admin-users/[id]`.
5. Call `DELETE /api/admin-users/[id]`.
6. Confirm each request returns `401 Unauthorized`.

### Supabase advisor follow-up

1. Review Supabase security advisors after the migration is applied.
2. Confirm there is no `admin_users` permissive `USING (true)` / `WITH CHECK (true)` warning.
3. Note that `admin_users` may still report `RLS Enabled No Policy`, which is expected for a service-role-only table.
