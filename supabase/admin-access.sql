-- Cyberelay admin access and seller approval workflow.
-- Run this file once in the Supabase SQL Editor before deploying the matching app code.

do $$ begin
  create type public.user_role as enum ('seller', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.account_status as enum ('pending', 'approved', 'suspended');
exception when duplicate_object then null;
end $$;

alter table public.profiles
  add column if not exists role public.user_role not null default 'seller';

alter table public.profiles
  add column if not exists account_status public.account_status;

-- Preserve access for accounts created before approval was introduced.
update public.profiles
set account_status = 'approved'
where account_status is null;

alter table public.profiles
  alter column account_status set default 'pending',
  alter column account_status set not null;

create or replace function public.is_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.profiles
    where user_id = check_user_id
      and role = 'admin'
      and account_status = 'approved'
  );
$$;

create or replace function public.can_sell(check_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from public.profiles
    where user_id = check_user_id
      and account_status = 'approved'
      and role in ('seller', 'admin')
  );
$$;

revoke all on function public.is_admin(uuid) from public;
revoke all on function public.can_sell(uuid) from public;
grant execute on function public.is_admin(uuid) to authenticated;
grant execute on function public.can_sell(uuid) to authenticated;

drop policy if exists "Admin can view profiles" on public.profiles;
create policy "Admin can view profiles"
on public.profiles for select to authenticated
using (public.is_admin());

-- Prevent account holders from changing protected access fields through the API.
create or replace function public.protect_profile_access_fields()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is not null
     and (new.role, new.account_status, new.user_id)
      is distinct from (old.role, old.account_status, old.user_id)
     and not public.is_admin() then
    raise exception 'Only an administrator can change account access';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_access_fields on public.profiles;
create trigger protect_profile_access_fields
before update on public.profiles
for each row execute function public.protect_profile_access_fields();

create or replace function public.admin_list_users()
returns table (
  user_id uuid,
  email text,
  display_name text,
  role public.user_role,
  account_status public.account_status,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'Administrator access required';
  end if;

  return query
  select p.user_id, u.email::text, p.display_name, p.role,
         p.account_status, p.created_at, u.last_sign_in_at
  from public.profiles p
  join auth.users u on u.id = p.user_id
  order by p.created_at desc;
end;
$$;

create or replace function public.admin_set_account_status(
  target_user_id uuid,
  new_status public.account_status
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if not public.is_admin() then
    raise exception 'Administrator access required';
  end if;
  if target_user_id = auth.uid() then
    raise exception 'Administrators cannot change their own status';
  end if;

  update public.profiles
  set account_status = new_status, updated_at = now()
  where user_id = target_user_id;

  if not found then raise exception 'User not found'; end if;
end;
$$;

revoke all on function public.admin_list_users() from public;
revoke all on function public.admin_set_account_status(uuid, public.account_status) from public;
grant execute on function public.admin_list_users() to authenticated;
grant execute on function public.admin_set_account_status(uuid, public.account_status) to authenticated;

-- Seller writes now require an approved account. Ownership remains mandatory.
drop policy if exists "Seller can create own listings" on public.listings;
create policy "Seller can create own listings"
on public.listings for insert to authenticated
with check (auth.uid() = seller_id and public.can_sell());

drop policy if exists "Seller can update own listings" on public.listings;
create policy "Seller can update own listings"
on public.listings for update to authenticated
using (auth.uid() = seller_id and public.can_sell())
with check (auth.uid() = seller_id and public.can_sell());

drop policy if exists "Seller can add own listing images" on public.listing_images;
create policy "Seller can add own listing images"
on public.listing_images for insert to authenticated
with check (public.can_sell() and exists (
  select 1 from public.listings
  where listings.id = listing_images.listing_id
    and listings.seller_id = auth.uid()
));

drop policy if exists "Seller can update own listing images" on public.listing_images;
create policy "Seller can update own listing images"
on public.listing_images for update to authenticated
using (public.can_sell() and exists (
  select 1 from public.listings
  where listings.id = listing_images.listing_id
    and listings.seller_id = auth.uid()
))
with check (public.can_sell() and exists (
  select 1 from public.listings
  where listings.id = listing_images.listing_id
    and listings.seller_id = auth.uid()
));

drop policy if exists "Seller can delete own listing images" on public.listing_images;
create policy "Seller can delete own listing images"
on public.listing_images for delete to authenticated
using (public.can_sell() and exists (
  select 1 from public.listings
  where listings.id = listing_images.listing_id
    and listings.seller_id = auth.uid()
));

-- Apply the same approval gate to private Storage objects. Folder ownership and
-- listing ownership remain mandatory, so an approved seller still cannot reach
-- another seller's files.
drop policy if exists "cyberelay_listing_images_select" on storage.objects;
create policy "cyberelay_listing_images_select"
on storage.objects for select to authenticated
using (
  bucket_id = 'listing-images'
  and public.can_sell()
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1 from public.listings
    where listings.id::text = (storage.foldername(storage.objects.name))[2]
      and listings.seller_id = auth.uid()
  )
);

drop policy if exists "cyberelay_listing_images_insert" on storage.objects;
create policy "cyberelay_listing_images_insert"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'listing-images'
  and public.can_sell()
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1 from public.listings
    where listings.id::text = (storage.foldername(storage.objects.name))[2]
      and listings.seller_id = auth.uid()
  )
);

drop policy if exists "cyberelay_listing_images_update" on storage.objects;
create policy "cyberelay_listing_images_update"
on storage.objects for update to authenticated
using (
  bucket_id = 'listing-images'
  and public.can_sell()
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1 from public.listings
    where listings.id::text = (storage.foldername(storage.objects.name))[2]
      and listings.seller_id = auth.uid()
  )
)
with check (
  bucket_id = 'listing-images'
  and public.can_sell()
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1 from public.listings
    where listings.id::text = (storage.foldername(storage.objects.name))[2]
      and listings.seller_id = auth.uid()
  )
);

drop policy if exists "cyberelay_listing_images_delete" on storage.objects;
create policy "cyberelay_listing_images_delete"
on storage.objects for delete to authenticated
using (
  bucket_id = 'listing-images'
  and public.can_sell()
  and (storage.foldername(name))[1] = auth.uid()::text
  and exists (
    select 1 from public.listings
    where listings.id::text = (storage.foldername(storage.objects.name))[2]
      and listings.seller_id = auth.uid()
  )
);

-- Designate the first Cyberelay administrator.
update public.profiles p
set role = 'admin', account_status = 'approved', updated_at = now()
from auth.users u
where p.user_id = u.id
  and lower(u.email) = 'info@cyberelay.ca';

do $$
begin
  if not exists (
    select 1 from public.profiles p
    join auth.users u on u.id = p.user_id
    where lower(u.email) = 'info@cyberelay.ca'
      and p.role = 'admin'
      and p.account_status = 'approved'
  ) then
    raise exception 'info@cyberelay.ca must already be a registered Cyberelay account';
  end if;
end $$;
