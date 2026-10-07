-- ============================================================================
-- CHAMPION NEXUS — INITIAL SCHEMA MIGRATION
-- Apply with: supabase db push   (or paste into the Supabase SQL editor)
-- ============================================================================

create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ----------------------------------------------------------------------------
-- 1. admin_profiles — maps a Supabase Auth user to an authorized admin role.
--    There is NO public sign-up path. Rows are created manually (see README).
-- ----------------------------------------------------------------------------
create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2. services
-- ----------------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  short_description text not null,
  description text not null, -- sanitized HTML or markdown
  icon text, -- lucide-react icon name
  featured boolean not null default false,
  published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists services_published_idx on public.services (published, display_order);
create index if not exists services_slug_idx on public.services (slug);

-- ----------------------------------------------------------------------------
-- 3. blog_posts
-- ----------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text not null default '',
  content jsonb not null default '{}'::jsonb, -- Tiptap JSON document
  featured_image text,
  featured_image_alt text,
  category text not null default 'General',
  tags text[] not null default '{}',
  author text not null default 'Champion Nexus Team',
  seo_title text,
  meta_description text,
  canonical_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists blog_posts_published_idx on public.blog_posts (published, published_at desc);
create index if not exists blog_posts_slug_idx on public.blog_posts (slug);
create index if not exists blog_posts_category_idx on public.blog_posts (category);

-- ----------------------------------------------------------------------------
-- 4. team_members
-- ----------------------------------------------------------------------------
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  role text not null,
  skills text[] not null default '{}',
  biography text,
  image_url text,
  image_alt text,
  display_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists team_members_published_idx on public.team_members (published, display_order);

-- ----------------------------------------------------------------------------
-- 5. testimonials
-- ----------------------------------------------------------------------------
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  company text,
  position text,
  message text not null,
  avatar_url text,
  rating smallint check (rating between 1 and 5),
  published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists testimonials_published_idx on public.testimonials (published, display_order);

-- ----------------------------------------------------------------------------
-- 6. contact_submissions — never publicly readable.
-- ----------------------------------------------------------------------------
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  website text,
  phone text,
  service text not null,
  budget text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'in_progress', 'resolved')),
  email_sent boolean not null default false,
  email_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists contact_submissions_status_idx on public.contact_submissions (status, created_at desc);

-- ----------------------------------------------------------------------------
-- updated_at trigger helper
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

do $$
declare
  t text;
begin
  foreach t in array array['services','blog_posts','team_members','testimonials','contact_submissions']
  loop
    execute format(
      'drop trigger if exists set_updated_at on public.%I; create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at();',
      t, t
    );
  end loop;
end $$;

-- ============================================================================
-- ROW LEVEL SECURITY
-- Default-deny: every table has RLS enabled, and only narrow policies below
-- grant access. Public (anon) role can only READ published rows. Only an
-- authenticated user present in admin_profiles can write, or read drafts.
-- ============================================================================

alter table public.admin_profiles enable row level security;
alter table public.services enable row level security;
alter table public.blog_posts enable row level security;
alter table public.team_members enable row level security;
alter table public.testimonials enable row level security;
alter table public.contact_submissions enable row level security;

-- Helper: is the current auth.uid() an admin?
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.admin_profiles where id = auth.uid()
  );
$$ language sql stable security definer set search_path = public;

-- admin_profiles: an admin can read their own row; no public access at all.
create policy "admin can read own profile" on public.admin_profiles
  for select using (id = auth.uid());

-- services: public can read published; admins can do everything.
create policy "public read published services" on public.services
  for select using (published = true);
create policy "admin full access services" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

-- blog_posts: public can read published only; admins can do everything
-- (including reading/editing drafts).
create policy "public read published posts" on public.blog_posts
  for select using (published = true);
create policy "admin full access posts" on public.blog_posts
  for all using (public.is_admin()) with check (public.is_admin());

-- team_members: public can read published; admins full access.
create policy "public read published team" on public.team_members
  for select using (published = true);
create policy "admin full access team" on public.team_members
  for all using (public.is_admin()) with check (public.is_admin());

-- testimonials: public can read published; admins full access.
create policy "public read published testimonials" on public.testimonials
  for select using (published = true);
create policy "admin full access testimonials" on public.testimonials
  for all using (public.is_admin()) with check (public.is_admin());

-- contact_submissions: NO public read. Anyone (anon) may INSERT a new
-- submission (that's how the contact form works), but only admins may
-- select/update/delete.
create policy "anyone can submit contact form" on public.contact_submissions
  for insert with check (true);
create policy "admin full read/write contacts" on public.contact_submissions
  for select using (public.is_admin());
create policy "admin update contacts" on public.contact_submissions
  for update using (public.is_admin()) with check (public.is_admin());
create policy "admin delete contacts" on public.contact_submissions
  for delete using (public.is_admin());

-- ============================================================================
-- STORAGE BUCKETS (run once; safe to re-run)
-- ============================================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('blog-images', 'blog-images', true, 5242880, array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('team-images', 'team-images', true, 3145728, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- Public can view (read) files in both buckets (needed to render images on
-- the public site). Only admins can upload/update/delete.
create policy "public read blog images" on storage.objects
  for select using (bucket_id = 'blog-images');
create policy "admin write blog images" on storage.objects
  for insert with check (bucket_id = 'blog-images' and public.is_admin());
create policy "admin update blog images" on storage.objects
  for update using (bucket_id = 'blog-images' and public.is_admin());
create policy "admin delete blog images" on storage.objects
  for delete using (bucket_id = 'blog-images' and public.is_admin());

create policy "public read team images" on storage.objects
  for select using (bucket_id = 'team-images');
create policy "admin write team images" on storage.objects
  for insert with check (bucket_id = 'team-images' and public.is_admin());
create policy "admin update team images" on storage.objects
  for update using (bucket_id = 'team-images' and public.is_admin());
create policy "admin delete team images" on storage.objects
  for delete using (bucket_id = 'team-images' and public.is_admin());
