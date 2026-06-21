## 1. Design

- [ ] 1.1 Decide backup storage destination and retention policy.
- [ ] 1.2 Define required environment variables for database dump access, backup storage, and scripted backup token.
- [ ] 1.3 Define backup metadata/audit table shape.
- [ ] 1.4 Define restore safety model, including whether production restore is supported in-app or documented as a manual runbook only.

## 2. Backup implementation

- [ ] 2.1 Add admin-only backup status page, likely `/admin/backups`.
- [ ] 2.2 Display last successful backup timestamp, status, destination/type, and file metadata when available.
- [ ] 2.3 Show stale-backup banner when no successful backup exists or last successful backup is older than 14 days.
- [ ] 2.4 Add admin-only manual "Create Backup Now" action.
- [ ] 2.5 Execute backup server-side without exposing database credentials to the browser.
- [ ] 2.6 Store backup files in a private/encrypted destination outside the production database.
- [ ] 2.7 Record successful and failed backup attempts in backup metadata/audit storage.

## 3. Scripted automation

- [ ] 3.1 Add a scriptable backup trigger endpoint or command suitable for cron/bash automation.
- [ ] 3.2 Require a dedicated backup token or equivalent server-side secret for scripted access.
- [ ] 3.3 Reject scripted backup requests with missing or invalid credentials.
- [ ] 3.4 Provide an example bash script or documented curl command for automated backups.

## 4. Restore/recovery workflow

- [ ] 4.1 Add restore documentation/runbook that prefers restoring to a new/staging project first.
- [ ] 4.2 If in-app restore controls are added, restrict them to admins only.
- [ ] 4.3 Require backup selection, typed confirmation, final confirmation, and clear destructive-operation warnings before restore.
- [ ] 4.4 Audit restore attempts with timestamp, actor, selected backup, result, and error summary when applicable.
- [ ] 4.5 Ensure restore controls cannot be triggered by normal admin navigation or accidental clicks.

## 5. Verification

- [ ] 5.1 Verify non-admin users cannot access backup or restore routes/actions.
- [ ] 5.2 Verify stale-backup banner appears when expected and is hidden when a recent successful backup exists.
- [ ] 5.3 Verify manual admin backup creates a backup and records metadata.
- [ ] 5.4 Verify failed backup records failure metadata.
- [ ] 5.5 Verify scripted backup rejects invalid token and accepts valid token.
- [ ] 5.6 Verify backup files are private and not browser/public accessible.
- [ ] 5.7 Verify restore workflow requires all confirmations.
- [ ] 5.8 Run type checking.
- [ ] 5.9 Run lint/build if feasible.