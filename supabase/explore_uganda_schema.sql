-- Explore Uganda content platform schema.
-- Run this in Supabase SQL Editor after creating the project.

create extension if not exists pgcrypto;

do $$
begin
    create type public.user_role as enum ('admin', 'staff', 'tourist');
exception
    when duplicate_object then null;
end $$;

do $$
begin
    create type public.blog_status as enum ('draft', 'submitted', 'approved', 'rejected', 'published');
exception
    when duplicate_object then null;
end $$;

do $$
begin
    create type public.souvenir_status as enum ('draft', 'published', 'archived');
exception
    when duplicate_object then null;
end $$;

do $$
begin
    create type public.order_status as enum ('pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled', 'refunded');
exception
    when duplicate_object then null;
end $$;

do $$
begin
    create type public.payment_status as enum ('pending', 'successful', 'failed', 'cancelled', 'refunded');
exception
    when duplicate_object then null;
end $$;

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text,
    full_name text not null default '',
    role public.user_role not null default 'tourist',
    account_expires_at timestamptz,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table if exists public.profiles
    add column if not exists email text;

create table if not exists public.tourist_writer_details (
    profile_id uuid primary key references public.profiles(id) on delete cascade,
    display_name text not null default '',
    country text not null default '',
    short_bio text not null default '',
    profile_image_path text,
    instagram_url text,
    website_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table if not exists public.blog_posts (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    slug text unique,
    excerpt text,
    content text not null default '',
    cover_image_path text,
    author_id uuid references public.profiles(id) on delete set null,
    author_name text,
    status public.blog_status not null default 'draft',
    submitted_by uuid references public.profiles(id) on delete set null,
    submitted_at timestamptz,
    approved_by uuid references public.profiles(id) on delete set null,
    approved_at timestamptz,
    reviewed_by uuid references public.profiles(id) on delete set null,
    reviewed_at timestamptz,
    rejection_reason text,
    published_by uuid references public.profiles(id) on delete set null,
    published_at timestamptz,
    last_edited_by uuid references public.profiles(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table if exists public.blog_posts
    add column if not exists author_name text,
    add column if not exists submitted_by uuid references public.profiles(id) on delete set null,
    add column if not exists submitted_at timestamptz,
    add column if not exists approved_by uuid references public.profiles(id) on delete set null,
    add column if not exists approved_at timestamptz,
    add column if not exists published_by uuid references public.profiles(id) on delete set null,
    add column if not exists last_edited_by uuid references public.profiles(id) on delete set null;

create table if not exists public.souvenirs (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    slug text unique,
    description text not null default '',
    price numeric(12, 2) not null default 0,
    currency text not null default 'UGX',
    image_path text,
    stock_status text not null default 'in_stock',
    status public.souvenir_status not null default 'draft',
    created_by uuid references public.profiles(id) on delete set null,
    updated_by uuid references public.profiles(id) on delete set null,
    published_by uuid references public.profiles(id) on delete set null,
    published_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table if exists public.souvenirs
    add column if not exists published_by uuid references public.profiles(id) on delete set null,
    add column if not exists published_at timestamptz;

create table if not exists public.souvenir_orders (
    id uuid primary key default gen_random_uuid(),
    order_number text unique not null default ('EU-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
    customer_name text not null,
    customer_email text not null,
    customer_phone text,
    shipping_address jsonb not null default '{}'::jsonb,
    billing_address jsonb not null default '{}'::jsonb,
    display_currency text not null default 'UGX',
    currency text not null default 'UGX',
    subtotal numeric(12, 2) not null default 0,
    shipping_total numeric(12, 2) not null default 0,
    total numeric(12, 2) not null default 0,
    flutterwave_tx_ref text unique,
    flutterwave_transaction_id text,
    payment_status public.payment_status not null default 'pending',
    order_status public.order_status not null default 'pending',
    notes text,
    created_by uuid references public.profiles(id) on delete set null,
    updated_by uuid references public.profiles(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table if exists public.souvenir_orders
    add column if not exists order_number text,
    add column if not exists customer_phone text,
    add column if not exists shipping_address jsonb not null default '{}'::jsonb,
    add column if not exists billing_address jsonb not null default '{}'::jsonb,
    add column if not exists display_currency text not null default 'UGX',
    add column if not exists flutterwave_tx_ref text,
    add column if not exists flutterwave_transaction_id text,
    add column if not exists notes text,
    add column if not exists created_by uuid references public.profiles(id) on delete set null,
    add column if not exists updated_by uuid references public.profiles(id) on delete set null;

create table if not exists public.souvenir_order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references public.souvenir_orders(id) on delete cascade,
    souvenir_id uuid references public.souvenirs(id) on delete set null,
    item_name text not null,
    quantity integer not null default 1 check (quantity > 0),
    unit_price numeric(12, 2) not null default 0,
    currency text not null default 'UGX',
    line_total numeric(12, 2) generated always as (quantity * unit_price) stored,
    created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
    id bigint generated always as identity primary key,
    actor_id uuid references public.profiles(id) on delete set null,
    actor_name text,
    actor_role text,
    action text not null,
    entity_type text not null,
    entity_id uuid,
    entity_title text,
    note text,
    old_data jsonb,
    new_data jsonb,
    created_at timestamptz not null default now()
);

alter table if exists public.audit_logs
    add column if not exists entity_title text,
    add column if not exists actor_name text,
    add column if not exists actor_role text;

alter table if exists public.audit_logs
    drop constraint if exists audit_logs_actor_id_fkey,
    add constraint audit_logs_actor_id_fkey foreign key (actor_id) references public.profiles(id) on delete set null;

alter table if exists public.blog_posts
    alter column author_id drop not null,
    drop constraint if exists blog_posts_author_id_fkey,
    add constraint blog_posts_author_id_fkey foreign key (author_id) references public.profiles(id) on delete set null,
    drop constraint if exists blog_posts_submitted_by_fkey,
    add constraint blog_posts_submitted_by_fkey foreign key (submitted_by) references public.profiles(id) on delete set null,
    drop constraint if exists blog_posts_approved_by_fkey,
    add constraint blog_posts_approved_by_fkey foreign key (approved_by) references public.profiles(id) on delete set null,
    drop constraint if exists blog_posts_reviewed_by_fkey,
    add constraint blog_posts_reviewed_by_fkey foreign key (reviewed_by) references public.profiles(id) on delete set null,
    drop constraint if exists blog_posts_published_by_fkey,
    add constraint blog_posts_published_by_fkey foreign key (published_by) references public.profiles(id) on delete set null,
    drop constraint if exists blog_posts_last_edited_by_fkey,
    add constraint blog_posts_last_edited_by_fkey foreign key (last_edited_by) references public.profiles(id) on delete set null;

alter table if exists public.souvenirs
    drop constraint if exists souvenirs_created_by_fkey,
    add constraint souvenirs_created_by_fkey foreign key (created_by) references public.profiles(id) on delete set null,
    drop constraint if exists souvenirs_updated_by_fkey,
    add constraint souvenirs_updated_by_fkey foreign key (updated_by) references public.profiles(id) on delete set null,
    drop constraint if exists souvenirs_published_by_fkey,
    add constraint souvenirs_published_by_fkey foreign key (published_by) references public.profiles(id) on delete set null;

alter table if exists public.souvenir_orders
    drop constraint if exists souvenir_orders_created_by_fkey,
    add constraint souvenir_orders_created_by_fkey foreign key (created_by) references public.profiles(id) on delete set null,
    drop constraint if exists souvenir_orders_updated_by_fkey,
    add constraint souvenir_orders_updated_by_fkey foreign key (updated_by) references public.profiles(id) on delete set null;

update public.blog_posts
set author_name = coalesce(nullif(profiles.full_name, ''), blog_posts.author_id::text)
from public.profiles
where blog_posts.author_id = profiles.id
  and blog_posts.author_name is null;

create or replace function public.current_user_role()
returns public.user_role
language sql
security definer
set search_path = public
stable
as $$
    select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin_or_staff()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
    select exists (
        select 1
        from public.profiles
        where id = auth.uid()
          and role in ('admin', 'staff')
          and is_active = true
          and (account_expires_at is null or account_expires_at > now())
    );
$$;

create or replace function public.is_major_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
    select lower(coalesce(auth.jwt() ->> 'email', '')) = 'bigbeautifuluganda@gmail.com';
$$;

create or replace function public.is_active_tourist()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
    select exists (
        select 1
        from public.profiles
        where id = auth.uid()
          and role = 'tourist'
          and is_active = true
          and (account_expires_at is null or account_expires_at > now())
    );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create or replace function public.set_blog_post_actor_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if tg_op = 'INSERT' then
        if new.author_name is null and new.author_id is not null then
            select coalesce(nullif(full_name, ''), new.author_id::text)
            into new.author_name
            from public.profiles
            where id = new.author_id;
        end if;

        new.last_edited_by = auth.uid();

        if new.status = 'submitted' then
            new.submitted_by = coalesce(new.submitted_by, auth.uid());
            new.submitted_at = coalesce(new.submitted_at, now());
        end if;

        if new.status = 'approved' then
            new.approved_by = coalesce(new.approved_by, auth.uid());
            new.approved_at = coalesce(new.approved_at, now());
            new.reviewed_by = coalesce(new.reviewed_by, auth.uid());
            new.reviewed_at = coalesce(new.reviewed_at, now());
        end if;

        if new.status = 'rejected' then
            new.reviewed_by = coalesce(new.reviewed_by, auth.uid());
            new.reviewed_at = coalesce(new.reviewed_at, now());
        end if;

        if new.status = 'published' then
            new.approved_by = coalesce(new.approved_by, auth.uid());
            new.approved_at = coalesce(new.approved_at, now());
            new.reviewed_by = coalesce(new.reviewed_by, auth.uid());
            new.reviewed_at = coalesce(new.reviewed_at, now());
            new.published_by = coalesce(new.published_by, auth.uid());
            new.published_at = coalesce(new.published_at, now());
        end if;

        return new;
    end if;

    if new.author_name is null and new.author_id is not null then
        select coalesce(nullif(full_name, ''), new.author_id::text)
        into new.author_name
        from public.profiles
        where id = new.author_id;
    end if;

    new.last_edited_by = auth.uid();

    if old.status is distinct from new.status then
        if new.status = 'submitted' then
            new.submitted_by = auth.uid();
            new.submitted_at = now();
        elsif new.status = 'approved' then
            new.approved_by = auth.uid();
            new.approved_at = now();
            new.reviewed_by = auth.uid();
            new.reviewed_at = now();
        elsif new.status = 'rejected' then
            new.reviewed_by = auth.uid();
            new.reviewed_at = now();
        elsif new.status = 'published' then
            new.published_by = auth.uid();
            new.published_at = now();
            new.reviewed_by = coalesce(new.reviewed_by, auth.uid());
            new.reviewed_at = coalesce(new.reviewed_at, now());
            new.approved_by = coalesce(new.approved_by, auth.uid());
            new.approved_at = coalesce(new.approved_at, now());
        end if;
    end if;

    return new;
end;
$$;

create or replace function public.set_souvenir_actor_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if tg_op = 'INSERT' then
        new.created_by = coalesce(new.created_by, auth.uid());
        new.updated_by = coalesce(new.updated_by, auth.uid());

        if new.status = 'published' then
            new.published_by = coalesce(new.published_by, auth.uid());
            new.published_at = coalesce(new.published_at, now());
        end if;

        return new;
    end if;

    new.updated_by = auth.uid();

    if old.status is distinct from new.status and new.status = 'published' then
        new.published_by = auth.uid();
        new.published_at = now();
    end if;

    return new;
end;
$$;

create or replace function public.set_souvenir_order_actor_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    if tg_op = 'INSERT' then
        new.created_by = coalesce(new.created_by, auth.uid());
        new.updated_by = coalesce(new.updated_by, auth.uid());
        return new;
    end if;

    new.updated_by = auth.uid();
    return new;
end;
$$;

create or replace function public.audit_content_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    item_id uuid;
    item_title text;
    audit_action text;
    actor_name_snapshot text;
    actor_role_snapshot text;
begin
    select
        coalesce(nullif(full_name, ''), auth.uid()::text),
        role::text
    into actor_name_snapshot, actor_role_snapshot
    from public.profiles
    where id = auth.uid();

    actor_name_snapshot = coalesce(actor_name_snapshot, auth.uid()::text, 'system');
    actor_role_snapshot = coalesce(actor_role_snapshot, 'unknown');

    if tg_op = 'DELETE' then
        item_id = old.id;
        item_title = coalesce(
            to_jsonb(old) ->> 'title',
            to_jsonb(old) ->> 'name',
            to_jsonb(old) ->> 'full_name',
            item_id::text
        );
        audit_action = lower(tg_op);
    else
        item_id = new.id;
        item_title = coalesce(
            to_jsonb(new) ->> 'title',
            to_jsonb(new) ->> 'name',
            to_jsonb(new) ->> 'full_name',
            item_id::text
        );
        audit_action = lower(tg_op);
    end if;

    if tg_table_name = 'profiles' then
        if tg_op = 'INSERT' then
            audit_action = 'account_created';
        elsif tg_op = 'UPDATE' then
            audit_action = 'account_updated';
        elsif tg_op = 'DELETE' then
            audit_action = 'account_deleted';
        end if;
    elsif tg_table_name = 'blog_posts' then
        if tg_op = 'INSERT' then
            audit_action = 'blog_created';
        elsif tg_op = 'DELETE' then
            audit_action = 'blog_deleted';
        elsif tg_op = 'UPDATE' and old.status is distinct from new.status then
            audit_action = 'blog_' || new.status::text;
        else
            audit_action = 'blog_updated';
        end if;
    elsif tg_table_name = 'souvenirs' then
        if tg_op = 'INSERT' then
            audit_action = 'souvenir_created';
        elsif tg_op = 'DELETE' then
            audit_action = 'souvenir_deleted';
        elsif tg_op = 'UPDATE' and old.status is distinct from new.status then
            audit_action = 'souvenir_' || new.status::text;
        else
            audit_action = 'souvenir_updated';
        end if;
    elsif tg_table_name = 'souvenir_orders' then
        if tg_op = 'INSERT' then
            audit_action = 'order_created';
        elsif tg_op = 'DELETE' then
            audit_action = 'order_deleted';
        elsif tg_op = 'UPDATE' and old.order_status is distinct from new.order_status then
            audit_action = 'order_' || new.order_status::text;
        elsif tg_op = 'UPDATE' and old.payment_status is distinct from new.payment_status then
            audit_action = 'payment_' || new.payment_status::text;
        else
            audit_action = 'order_updated';
        end if;
    end if;

    insert into public.audit_logs (
        actor_id,
        actor_name,
        actor_role,
        action,
        entity_type,
        entity_id,
        entity_title,
        old_data,
        new_data
    )
    values (
        auth.uid(),
        actor_name_snapshot,
        actor_role_snapshot,
        audit_action,
        tg_table_name,
        item_id,
        item_title,
        case when tg_op in ('UPDATE', 'DELETE') then to_jsonb(old) else null end,
        case when tg_op in ('INSERT', 'UPDATE') then to_jsonb(new) else null end
    );

    if tg_op = 'DELETE' then
        return old;
    end if;

    return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists tourist_writer_details_touch_updated_at on public.tourist_writer_details;
create trigger tourist_writer_details_touch_updated_at
before update on public.tourist_writer_details
for each row execute function public.touch_updated_at();

drop trigger if exists blog_posts_touch_updated_at on public.blog_posts;
create trigger blog_posts_touch_updated_at
before update on public.blog_posts
for each row execute function public.touch_updated_at();

drop trigger if exists blog_posts_set_actor_fields on public.blog_posts;
create trigger blog_posts_set_actor_fields
before insert or update on public.blog_posts
for each row execute function public.set_blog_post_actor_fields();

drop trigger if exists blog_posts_audit_content_change on public.blog_posts;
create trigger blog_posts_audit_content_change
after insert or update or delete on public.blog_posts
for each row execute function public.audit_content_change();

drop trigger if exists souvenirs_touch_updated_at on public.souvenirs;
create trigger souvenirs_touch_updated_at
before update on public.souvenirs
for each row execute function public.touch_updated_at();

drop trigger if exists souvenirs_set_actor_fields on public.souvenirs;
create trigger souvenirs_set_actor_fields
before insert or update on public.souvenirs
for each row execute function public.set_souvenir_actor_fields();

drop trigger if exists souvenirs_audit_content_change on public.souvenirs;
create trigger souvenirs_audit_content_change
after insert or update or delete on public.souvenirs
for each row execute function public.audit_content_change();

drop trigger if exists souvenir_orders_touch_updated_at on public.souvenir_orders;
create trigger souvenir_orders_touch_updated_at
before update on public.souvenir_orders
for each row execute function public.touch_updated_at();

drop trigger if exists souvenir_orders_set_actor_fields on public.souvenir_orders;
create trigger souvenir_orders_set_actor_fields
before insert or update on public.souvenir_orders
for each row execute function public.set_souvenir_order_actor_fields();

drop trigger if exists souvenir_orders_audit_content_change on public.souvenir_orders;
create trigger souvenir_orders_audit_content_change
after insert or update or delete on public.souvenir_orders
for each row execute function public.audit_content_change();

drop trigger if exists profiles_audit_content_change on public.profiles;
create trigger profiles_audit_content_change
after insert or update or delete on public.profiles
for each row execute function public.audit_content_change();

alter table public.profiles enable row level security;
alter table public.tourist_writer_details enable row level security;
alter table public.blog_posts enable row level security;
alter table public.souvenirs enable row level security;
alter table public.souvenir_orders enable row level security;
alter table public.souvenir_order_items enable row level security;
alter table public.audit_logs enable row level security;

drop policy if exists "Profiles can view own profile" on public.profiles;
create policy "Profiles can view own profile"
on public.profiles for select
to authenticated
using (auth.uid() = id);

drop policy if exists "Staff can view all profiles" on public.profiles;
create policy "Staff can view all profiles"
on public.profiles for select
to authenticated
using (public.is_major_admin() or public.is_admin_or_staff());

drop policy if exists "Staff can manage profiles" on public.profiles;
drop policy if exists "Major admin manages admins and staff" on public.profiles;
drop policy if exists "Staff manage tourist profiles" on public.profiles;
create policy "Major admin manages admins and staff"
on public.profiles for update
to authenticated
using (public.is_major_admin())
with check (public.is_major_admin());

create policy "Staff manage tourist profiles"
on public.profiles for update
to authenticated
using (
    public.is_admin_or_staff()
    and role = 'tourist'
)
with check (
    public.is_admin_or_staff()
    and role = 'tourist'
);

drop policy if exists "Staff can create profiles" on public.profiles;
drop policy if exists "Major admin creates admins and staff" on public.profiles;
drop policy if exists "Staff create tourist profiles" on public.profiles;
create policy "Major admin creates admins and staff"
on public.profiles for insert
to authenticated
with check (public.is_major_admin());

create policy "Staff create tourist profiles"
on public.profiles for insert
to authenticated
with check (
    public.is_admin_or_staff()
    and role = 'tourist'
);

drop policy if exists "Staff can delete profiles" on public.profiles;
drop policy if exists "Major admin deletes admins and staff" on public.profiles;
drop policy if exists "Staff delete tourist profiles" on public.profiles;
create policy "Major admin deletes admins and staff"
on public.profiles for delete
to authenticated
using (public.is_major_admin());

create policy "Staff delete tourist profiles"
on public.profiles for delete
to authenticated
using (
    public.is_admin_or_staff()
    and role = 'tourist'
);

drop policy if exists "Tourists view own writer details" on public.tourist_writer_details;
create policy "Tourists view own writer details"
on public.tourist_writer_details for select
to authenticated
using (auth.uid() = profile_id);

drop policy if exists "Staff view all writer details" on public.tourist_writer_details;
create policy "Staff view all writer details"
on public.tourist_writer_details for select
to authenticated
using (public.is_admin_or_staff());

drop policy if exists "Active tourists create own writer details" on public.tourist_writer_details;
create policy "Active tourists create own writer details"
on public.tourist_writer_details for insert
to authenticated
with check (
    auth.uid() = profile_id
    and public.is_active_tourist()
);

drop policy if exists "Active tourists update own writer details" on public.tourist_writer_details;
create policy "Active tourists update own writer details"
on public.tourist_writer_details for update
to authenticated
using (
    auth.uid() = profile_id
    and public.is_active_tourist()
)
with check (
    auth.uid() = profile_id
    and public.is_active_tourist()
);

drop policy if exists "Published blog posts are public" on public.blog_posts;
create policy "Published blog posts are public"
on public.blog_posts for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Authors can view own blog posts" on public.blog_posts;
create policy "Authors can view own blog posts"
on public.blog_posts for select
to authenticated
using (auth.uid() = author_id);

drop policy if exists "Staff can view all blog posts" on public.blog_posts;
create policy "Staff can view all blog posts"
on public.blog_posts for select
to authenticated
using (public.is_admin_or_staff());

drop policy if exists "Active tourists can create blog drafts" on public.blog_posts;
create policy "Active tourists can create blog drafts"
on public.blog_posts for insert
to authenticated
with check (
    auth.uid() = author_id
    and public.is_active_tourist()
    and status in ('draft', 'submitted')
);

drop policy if exists "Authors can update own draft or submitted posts" on public.blog_posts;
drop policy if exists "Authors can update own draft or rejected posts" on public.blog_posts;
create policy "Authors can update own draft or rejected posts"
on public.blog_posts for update
to authenticated
using (
    auth.uid() = author_id
    and public.is_active_tourist()
    and status in ('draft', 'rejected')
)
with check (
    auth.uid() = author_id
    and public.is_active_tourist()
    and status in ('draft', 'submitted')
);

drop policy if exists "Staff can manage all blog posts" on public.blog_posts;
create policy "Staff can manage all blog posts"
on public.blog_posts for all
to authenticated
using (public.is_admin_or_staff())
with check (public.is_admin_or_staff());

drop policy if exists "Published souvenirs are public" on public.souvenirs;
create policy "Published souvenirs are public"
on public.souvenirs for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Staff can manage souvenirs" on public.souvenirs;
create policy "Staff can manage souvenirs"
on public.souvenirs for all
to authenticated
using (public.is_admin_or_staff())
with check (public.is_admin_or_staff());

drop policy if exists "Public can create souvenir orders" on public.souvenir_orders;
create policy "Public can create souvenir orders"
on public.souvenir_orders for insert
to anon, authenticated
with check (true);

drop policy if exists "Staff can view souvenir orders" on public.souvenir_orders;
create policy "Staff can view souvenir orders"
on public.souvenir_orders for select
to authenticated
using (public.is_admin_or_staff());

drop policy if exists "Staff can manage souvenir orders" on public.souvenir_orders;
create policy "Staff can manage souvenir orders"
on public.souvenir_orders for update
to authenticated
using (public.is_admin_or_staff())
with check (public.is_admin_or_staff());

drop policy if exists "Staff can delete souvenir orders" on public.souvenir_orders;
create policy "Staff can delete souvenir orders"
on public.souvenir_orders for delete
to authenticated
using (public.is_admin_or_staff());

drop policy if exists "Public can create souvenir order items" on public.souvenir_order_items;
create policy "Public can create souvenir order items"
on public.souvenir_order_items for insert
to anon, authenticated
with check (true);

drop policy if exists "Staff can view souvenir order items" on public.souvenir_order_items;
create policy "Staff can view souvenir order items"
on public.souvenir_order_items for select
to authenticated
using (public.is_admin_or_staff());

drop policy if exists "Staff can manage souvenir order items" on public.souvenir_order_items;
create policy "Staff can manage souvenir order items"
on public.souvenir_order_items for all
to authenticated
using (public.is_admin_or_staff())
with check (public.is_admin_or_staff());

drop policy if exists "Staff can view audit logs" on public.audit_logs;
create policy "Staff can view audit logs"
on public.audit_logs for select
to authenticated
using (public.is_admin_or_staff());

drop policy if exists "Authenticated users can create audit logs" on public.audit_logs;

drop policy if exists "System can create audit logs" on public.audit_logs;
create policy "System can create audit logs"
on public.audit_logs for insert
to authenticated
with check (auth.uid() = actor_id);

create or replace view public.audit_log_details
with (security_invoker = true) as
select
    audit_logs.id,
    audit_logs.created_at,
    audit_logs.action,
    audit_logs.entity_type,
    audit_logs.entity_id,
    audit_logs.entity_title,
    audit_logs.note,
    audit_logs.old_data,
    audit_logs.new_data,
    actor.id as actor_id,
    coalesce(audit_logs.actor_name, actor.full_name, audit_logs.actor_id::text) as actor_name,
    coalesce(audit_logs.actor_role, actor.role::text, 'unknown') as actor_role
from public.audit_logs
left join public.profiles actor on actor.id = audit_logs.actor_id;

create or replace view public.blog_post_accountability
with (security_invoker = true) as
select
    blog_posts.id,
    blog_posts.title,
    blog_posts.slug,
    blog_posts.status,
    blog_posts.created_at,
    blog_posts.updated_at,
    coalesce(author.full_name, blog_posts.author_name, blog_posts.author_id::text, 'Deleted account') as author_name,
    writer_details.display_name as author_display_name,
    writer_details.country as author_country,
    writer_details.short_bio as author_bio,
    writer_details.profile_image_path as author_profile_image_path,
    writer_details.instagram_url as author_instagram_url,
    writer_details.website_url as author_website_url,
    submitted_by.full_name as submitted_by_name,
    blog_posts.submitted_at,
    approved_by.full_name as approved_by_name,
    blog_posts.approved_at,
    reviewed_by.full_name as reviewed_by_name,
    blog_posts.reviewed_at,
    published_by.full_name as published_by_name,
    blog_posts.published_at,
    last_edited_by.full_name as last_edited_by_name
from public.blog_posts
left join public.profiles author on author.id = blog_posts.author_id
left join public.tourist_writer_details writer_details on writer_details.profile_id = blog_posts.author_id
left join public.profiles submitted_by on submitted_by.id = blog_posts.submitted_by
left join public.profiles approved_by on approved_by.id = blog_posts.approved_by
left join public.profiles reviewed_by on reviewed_by.id = blog_posts.reviewed_by
left join public.profiles published_by on published_by.id = blog_posts.published_by
left join public.profiles last_edited_by on last_edited_by.id = blog_posts.last_edited_by;

create or replace view public.souvenir_accountability
with (security_invoker = true) as
select
    souvenirs.id,
    souvenirs.name,
    souvenirs.slug,
    souvenirs.status,
    souvenirs.created_at,
    souvenirs.updated_at,
    created_by.full_name as created_by_name,
    updated_by.full_name as updated_by_name,
    published_by.full_name as published_by_name,
    souvenirs.published_at
from public.souvenirs
left join public.profiles created_by on created_by.id = souvenirs.created_by
left join public.profiles updated_by on updated_by.id = souvenirs.updated_by
left join public.profiles published_by on published_by.id = souvenirs.published_by;

create or replace view public.public_souvenirs
with (security_invoker = true) as
select
    id,
    name,
    slug,
    description,
    price,
    currency,
    image_path,
    stock_status,
    published_at,
    updated_at
from public.souvenirs
where status = 'published';

create or replace view public.souvenir_order_accountability
with (security_invoker = true) as
select
    orders.id,
    orders.order_number,
    orders.customer_name,
    orders.customer_email,
    orders.customer_phone,
    orders.display_currency,
    orders.currency,
    orders.subtotal,
    orders.shipping_total,
    orders.total,
    orders.flutterwave_tx_ref,
    orders.flutterwave_transaction_id,
    orders.payment_status,
    orders.order_status,
    orders.notes,
    orders.created_at,
    orders.updated_at,
    created_by.full_name as created_by_name,
    updated_by.full_name as updated_by_name
from public.souvenir_orders orders
left join public.profiles created_by on created_by.id = orders.created_by
left join public.profiles updated_by on updated_by.id = orders.updated_by;

create or replace function public.create_souvenir_order(order_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    order_record public.souvenir_orders%rowtype;
    item jsonb;
    item_name text;
    item_quantity integer;
    item_unit_price numeric(12, 2);
    item_currency text;
    shipping_payload jsonb;
    billing_payload jsonb;
    items_payload jsonb;
begin
    if order_payload is null then
        raise exception 'Order details are required.';
    end if;

    items_payload = coalesce(order_payload -> 'items', '[]'::jsonb);
    if jsonb_typeof(items_payload) <> 'array' or jsonb_array_length(items_payload) = 0 then
        raise exception 'At least one order item is required.';
    end if;

    if nullif(trim(order_payload ->> 'customer_name'), '') is null then
        raise exception 'Customer name is required.';
    end if;

    if nullif(trim(order_payload ->> 'customer_email'), '') is null then
        raise exception 'Customer email is required.';
    end if;

    shipping_payload = coalesce(order_payload -> 'shipping_address', '{}'::jsonb);
    billing_payload = coalesce(order_payload -> 'billing_address', shipping_payload, '{}'::jsonb);

    insert into public.souvenir_orders (
        customer_name,
        customer_email,
        customer_phone,
        shipping_address,
        billing_address,
        display_currency,
        currency,
        subtotal,
        shipping_total,
        total,
        flutterwave_tx_ref,
        payment_status,
        order_status,
        notes
    )
    values (
        trim(order_payload ->> 'customer_name'),
        trim(order_payload ->> 'customer_email'),
        nullif(trim(coalesce(order_payload ->> 'customer_phone', '')), ''),
        shipping_payload,
        billing_payload,
        coalesce(nullif(trim(order_payload ->> 'display_currency'), ''), 'UGX'),
        coalesce(nullif(trim(order_payload ->> 'currency'), ''), 'UGX'),
        coalesce((order_payload ->> 'subtotal')::numeric, 0),
        coalesce((order_payload ->> 'shipping_total')::numeric, 0),
        coalesce((order_payload ->> 'total')::numeric, coalesce((order_payload ->> 'subtotal')::numeric, 0)),
        nullif(trim(coalesce(order_payload ->> 'flutterwave_tx_ref', '')), ''),
        'pending',
        'pending',
        nullif(trim(coalesce(order_payload ->> 'notes', '')), '')
    )
    returning * into order_record;

    for item in select * from jsonb_array_elements(items_payload)
    loop
        item_name = nullif(trim(item ->> 'item_name'), '');
        item_quantity = greatest(coalesce((item ->> 'quantity')::integer, 1), 1);
        item_unit_price = coalesce((item ->> 'unit_price')::numeric, 0);
        item_currency = coalesce(nullif(trim(item ->> 'currency'), ''), order_record.currency);

        if item_name is null then
            raise exception 'Every order item needs a name.';
        end if;

        insert into public.souvenir_order_items (
            order_id,
            souvenir_id,
            item_name,
            quantity,
            unit_price,
            currency
        )
        values (
            order_record.id,
            nullif(item ->> 'souvenir_id', '')::uuid,
            item_name,
            item_quantity,
            item_unit_price,
            item_currency
        );
    end loop;

    return jsonb_build_object(
        'id', order_record.id,
        'order_number', order_record.order_number,
        'total', order_record.total,
        'currency', order_record.currency,
        'payment_status', order_record.payment_status,
        'order_status', order_record.order_status
    );
end;
$$;

grant execute on function public.create_souvenir_order(jsonb) to anon, authenticated;

create unique index if not exists profiles_email_unique_idx on public.profiles (lower(email)) where email is not null;
create index if not exists profiles_email_lower_idx on public.profiles (lower(email));
create index if not exists profiles_role_active_idx on public.profiles (role, is_active, account_expires_at);
create index if not exists tourist_writer_details_profile_id_idx on public.tourist_writer_details (profile_id);
create index if not exists blog_posts_author_status_idx on public.blog_posts (author_id, status, updated_at desc);
create index if not exists blog_posts_status_updated_idx on public.blog_posts (status, updated_at desc);
create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists souvenirs_status_updated_idx on public.souvenirs (status, updated_at desc);
create index if not exists souvenirs_slug_idx on public.souvenirs (slug);
create unique index if not exists souvenir_orders_order_number_unique_idx on public.souvenir_orders (order_number) where order_number is not null;
create unique index if not exists souvenir_orders_tx_ref_unique_idx on public.souvenir_orders (flutterwave_tx_ref) where flutterwave_tx_ref is not null;
create index if not exists souvenir_orders_status_created_idx on public.souvenir_orders (order_status, payment_status, created_at desc);
create index if not exists souvenir_orders_customer_email_idx on public.souvenir_orders (lower(customer_email));
create index if not exists souvenir_order_items_order_id_idx on public.souvenir_order_items (order_id);
create index if not exists audit_logs_entity_idx on public.audit_logs (entity_type, entity_id, created_at desc);
create index if not exists audit_logs_actor_idx on public.audit_logs (actor_id, created_at desc);

insert into storage.buckets (id, name, public)
values
    ('blog-images', 'blog-images', true),
    ('souvenir-images', 'souvenir-images', true),
    ('profile-images', 'profile-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public can view platform images" on storage.objects;
create policy "Public can view platform images"
on storage.objects for select
to anon, authenticated
using (bucket_id in ('blog-images', 'souvenir-images', 'profile-images'));

drop policy if exists "Active tourists upload blog and profile images" on storage.objects;
create policy "Active tourists upload blog and profile images"
on storage.objects for insert
to authenticated
with check (
    bucket_id in ('blog-images', 'profile-images')
    and public.is_active_tourist()
);

drop policy if exists "Staff manage platform images" on storage.objects;
create policy "Staff manage platform images"
on storage.objects for all
to authenticated
using (
    bucket_id in ('blog-images', 'souvenir-images', 'profile-images')
    and public.is_admin_or_staff()
)
with check (
    bucket_id in ('blog-images', 'souvenir-images', 'profile-images')
    and public.is_admin_or_staff()
);
