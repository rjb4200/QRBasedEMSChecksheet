insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'compartment-photos',
  'compartment-photos',
  true,
  20971520,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "authenticated users can view compartment photos"
on storage.objects for select
using (bucket_id = 'compartment-photos' and auth.uid() is not null);

create policy "admins can upload compartment photos"
on storage.objects for insert
with check (bucket_id = 'compartment-photos' and public.is_admin());

create policy "admins can update compartment photos"
on storage.objects for update
using (bucket_id = 'compartment-photos' and public.is_admin())
with check (bucket_id = 'compartment-photos' and public.is_admin());

create policy "admins can delete compartment photos"
on storage.objects for delete
using (bucket_id = 'compartment-photos' and public.is_admin());
