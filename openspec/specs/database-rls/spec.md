## Requirements

### Requirement: Issues and report tables have RLS enabled

All admin-internal tables in the public schema SHALL have Row-Level Security enabled with policies restricting access to authenticated admin users only.

#### Scenario: issues table has RLS enabled with admin-only policies

- **WHEN** a user without an admin session queries `public.issues`
- **THEN** the query SHALL return zero rows
- **AND** any attempt to insert, update, or delete SHALL be rejected

#### Scenario: issue_notes table has RLS enabled with admin-only policies

- **WHEN** a user without an admin session queries `public.issue_notes`
- **THEN** the query SHALL return zero rows
- **AND** any attempt to insert, update, or delete SHALL be rejected

#### Scenario: weekly_email_report_runs table has RLS enabled with admin-only policies

- **WHEN** a user without an admin session queries `public.weekly_email_report_runs`
- **THEN** the query SHALL return zero rows
- **AND** any attempt to insert, update, or delete SHALL be rejected

#### Scenario: Service role bypasses RLS

- **WHEN** a server-side operation uses the service-role client
- **THEN** it SHALL continue to read and write all three tables without restriction
- **AND** no application behavior SHALL change
