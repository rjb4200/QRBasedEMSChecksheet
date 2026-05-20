## 1. Database Security

- [x] 1.1 Audit current `admin_users` table policies and identify the permissive `USING (true)` / `WITH CHECK (true)` policy to remove
- [x] 1.2 Create a Supabase migration that removes the permissive `admin_users` RLS policy while keeping RLS enabled
- [x] 1.3 Verify no broad public `admin_users` policies remain after the migration
- [x] 1.4 Check Supabase advisors and confirm the permissive-access warning is resolved or document any remaining follow-up

## 2. Bootstrap Admin Recovery

- [x] 2.1 Audit the current admin login flow and shared session creation helpers
- [x] 2.2 Add server-only support for `BOOTSTRAP_ADMIN_ENABLED`, `BOOTSTRAP_ADMIN_USER`, and `BOOTSTRAP_ADMIN_PASSWORD`
- [x] 2.3 Implement bootstrap credential validation in the admin login flow without exposing or logging the bootstrap password
- [x] 2.4 Reuse the existing admin session/cookie creation path for successful bootstrap recovery login
- [x] 2.5 Verify normal persisted `admin_users` login still works when bootstrap recovery is disabled
- [x] 2.6 Verify normal persisted `admin_users` login still works when bootstrap recovery is enabled

## 3. Admin User API Authorization

- [x] 3.1 Audit `src/app/api/admin-users/route.ts` for current auth gaps before list/create behavior
- [x] 3.2 Audit `src/app/api/admin-users/[id]/route.ts` for current auth gaps before update/delete behavior
- [x] 3.3 Add valid admin-session enforcement to `GET /api/admin-users`
- [x] 3.4 Add valid admin-session enforcement to `POST /api/admin-users`
- [x] 3.5 Add valid admin-session enforcement to `PATCH /api/admin-users/[id]`
- [x] 3.6 Add valid admin-session enforcement to `DELETE /api/admin-users/[id]`
- [x] 3.7 Verify the Admin Users page still works with the protected routes and preserved report-recipient settings

## 4. Documentation

- [x] 4.1 Update `ADMINGUIDE.md` with bootstrap admin lockout-recovery setup and usage guidance
- [x] 4.2 Document the recommendation to disable or rotate bootstrap credentials after recovery use

## 5. Verification

- [x] 5.1 Add automated tests where practical for bootstrap admin login and admin-user API auth checks
- [x] 5.2 Add manual verification notes for bootstrap disabled behavior
- [x] 5.3 Add manual verification notes for bootstrap enabled recovery login
- [x] 5.4 Add manual verification notes for normal admin login remaining unchanged
- [x] 5.5 Add manual verification notes for rejecting unauthenticated `admin-users` API access
- [x] 5.6 Run `npm run lint` and fix any issues
- [x] 5.7 Run `npm run typecheck` and fix any issues
- [x] 5.8 Run `npm run build` and verify no build errors
