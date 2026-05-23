## 1. Database Security

- [x] 1.1 Audit `admin_users` table for permissive RLS policies
- [x] 1.2 Create a Supabase migration removing `USING (true)` / `WITH CHECK (true)` policies from `admin_users`
- [x] 1.3 Verify RLS remains enabled after migration
- [x] 1.4 Confirm no broad public policies remain on `admin_users`
- [x] 1.5 Apply the migration to production database

## 2. API Route Protection

- [x] 2.1 Add admin session verification to `GET /api/admin-users`
- [x] 2.2 Add admin session verification to `POST /api/admin-users`
- [x] 2.3 Add admin session verification to `PUT /api/admin-users/[id]`
- [x] 2.4 Add admin session verification to `PATCH /api/admin-users/[id]`
- [x] 2.5 Add admin session verification to `DELETE /api/admin-users/[id]`
- [x] 2.6 Add admin session verification to `POST /api/admin-users/seed`

## 3. Workflow Preservation

- [x] 3.1 Verify admin login still works
- [x] 3.2 Verify Admin Users page still loads and functions
- [x] 3.3 Verify daily report recipient editing still works
- [x] 3.4 Verify crew checkoff, QR/NFC, records, and fleet panel are unchanged

## 4. Security Verification

- [x] 4.1 Verify unauthenticated `GET /api/admin-users` returns 401
- [x] 4.2 Verify unauthenticated `POST /api/admin-users` returns 401
- [x] 4.3 Verify unauthenticated `PUT /api/admin-users/[id]` returns 401
- [x] 4.4 Verify unauthenticated `DELETE /api/admin-users/[id]` returns 401
- [x] 4.5 Verify unauthenticated `POST /api/admin-users/seed` returns 401
- [x] 4.6 Check Supabase security advisor and confirm no permissive-access warning for `admin_users`
- [x] 4.7 Run `npm run lint`
- [x] 4.8 Run `npm run typecheck`
- [x] 4.9 Run `npm run build`
