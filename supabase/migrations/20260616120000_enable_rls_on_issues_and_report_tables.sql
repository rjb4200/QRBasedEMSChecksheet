alter table public.issues enable row level security;
alter table public.issue_notes enable row level security;
alter table public.weekly_email_report_runs enable row level security;

drop policy if exists "admins can select issues" on public.issues;
drop policy if exists "admins can insert issues" on public.issues;
drop policy if exists "admins can update issues" on public.issues;
drop policy if exists "admins can delete issues" on public.issues;

create policy "admins can select issues" on public.issues for select using (public.is_admin());
create policy "admins can insert issues" on public.issues for insert with check (public.is_admin());
create policy "admins can update issues" on public.issues for update using (public.is_admin()) with check (public.is_admin());
create policy "admins can delete issues" on public.issues for delete using (public.is_admin());

drop policy if exists "admins can select issue_notes" on public.issue_notes;
drop policy if exists "admins can insert issue_notes" on public.issue_notes;
drop policy if exists "admins can update issue_notes" on public.issue_notes;
drop policy if exists "admins can delete issue_notes" on public.issue_notes;

create policy "admins can select issue_notes" on public.issue_notes for select using (public.is_admin());
create policy "admins can insert issue_notes" on public.issue_notes for insert with check (public.is_admin());
create policy "admins can update issue_notes" on public.issue_notes for update using (public.is_admin()) with check (public.is_admin());
create policy "admins can delete issue_notes" on public.issue_notes for delete using (public.is_admin());

drop policy if exists "admins can select weekly_email_report_runs" on public.weekly_email_report_runs;
drop policy if exists "admins can insert weekly_email_report_runs" on public.weekly_email_report_runs;
drop policy if exists "admins can update weekly_email_report_runs" on public.weekly_email_report_runs;
drop policy if exists "admins can delete weekly_email_report_runs" on public.weekly_email_report_runs;

create policy "admins can select weekly_email_report_runs" on public.weekly_email_report_runs for select using (public.is_admin());
create policy "admins can insert weekly_email_report_runs" on public.weekly_email_report_runs for insert with check (public.is_admin());
create policy "admins can update weekly_email_report_runs" on public.weekly_email_report_runs for update using (public.is_admin()) with check (public.is_admin());
create policy "admins can delete weekly_email_report_runs" on public.weekly_email_report_runs for delete using (public.is_admin());
