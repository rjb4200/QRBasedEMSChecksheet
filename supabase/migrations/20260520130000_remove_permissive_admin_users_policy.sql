alter table public.admin_users enable row level security;

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'admin_users'
      and (
        coalesce(qual, '') = 'true'
        or coalesce(with_check, '') = 'true'
      )
  loop
    execute format('drop policy if exists %I on public.admin_users', policy_record.policyname);
  end loop;
end $$;
