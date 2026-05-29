-- Migration file for get_database_size function
-- Already applied via supabase_apply_migration
create or replace function public.get_database_size() returns bigint language sql security definer as $$ select pg_database_size(current_database()); $$;
