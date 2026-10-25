-- =====================================================================
-- BEKNAZAURUS — база данных (Supabase / PostgreSQL)
-- Как применить: Supabase → SQL Editor → New query → вставить весь файл → Run.
-- Файл можно запускать повторно: он ничего не удаляет.
-- =====================================================================

-- ---------- Профили пользователей и роли ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  name        text,
  role        text not null default 'user' check (role in ('user','admin')),
  created_at  timestamptz not null default now()
);

-- профиль создаётся автоматически при регистрации
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', ''))
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- проверка «текущий пользователь — администратор»
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- пользователь не может сам себе выдать роль admin
create or replace function public.protect_role() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- через сайт роль может менять только администратор; команды из SQL Editor (auth.uid() пусто) разрешены
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
  end if;
  return new;
end $$;
drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role before update on public.profiles
  for each row execute function public.protect_role();

-- ---------- Контент сайта: статьи/истории, путешествия, работы, услуги ----------
-- collection: 'stories' | 'travel' | 'works' | 'services' | 'settings'
create table if not exists public.items (
  id          uuid primary key default gen_random_uuid(),
  collection  text not null,
  slug        text not null,
  status      text not null default 'draft' check (status in ('draft','published','soon','hidden')),
  sort        int  not null default 0,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id),
  unique (collection, slug)
);
create index if not exists items_collection_idx on public.items (collection, status, sort);

create or replace function public.touch_item() returns trigger language plpgsql as $$
begin new.updated_at := now(); new.updated_by := auth.uid(); return new; end $$;
drop trigger if exists items_touch on public.items;
create trigger items_touch before insert or update on public.items
  for each row execute function public.touch_item();

-- ---------- Заказы и оплаты ----------
create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references auth.users(id) on delete set null,
  kind         text not null check (kind in ('travel','service','donation')),
  item_slug    text,
  title        text not null,
  amount       numeric(12,2) not null check (amount > 0),
  currency     text not null default 'KGS',
  status       text not null default 'pending' check (status in ('pending','paid','failed','cancelled','refunded')),
  contact_name text,
  contact      text,
  note         text,
  payment_id   text,
  paid_at      timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists orders_user_idx on public.orders (user_id, created_at desc);

-- статус оплаты меняет только сервер (функция FreedomPay) или администратор
create or replace function public.protect_order() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.role() = 'service_role' or public.is_admin() then return new; end if;
  if new.status is distinct from old.status and not (old.status = 'pending' and new.status = 'cancelled') then
    new.status := old.status;
  end if;
  new.amount := old.amount; new.payment_id := old.payment_id; new.paid_at := old.paid_at;
  return new;
end $$;
drop trigger if exists orders_protect on public.orders;
create trigger orders_protect before update on public.orders
  for each row execute function public.protect_order();

-- ---------- Сообщения из форм (контакты, заявки, партнёрство) ----------
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  form       text not null,
  data       jsonb not null default '{}'::jsonb,
  user_id    uuid references auth.users(id) on delete set null,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- Права доступа (Row Level Security)
-- Гости и пользователи — только чтение опубликованного.
-- Пользователи — свои заказы и свой профиль.
-- Администратор — всё.
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.items    enable row level security;
alter table public.orders   enable row level security;
alter table public.messages enable row level security;

drop policy if exists "profiles: read own or admin" on public.profiles;
create policy "profiles: read own or admin" on public.profiles for select using (id = auth.uid() or public.is_admin());
drop policy if exists "profiles: update own or admin" on public.profiles;
create policy "profiles: update own or admin" on public.profiles for update using (id = auth.uid() or public.is_admin());

drop policy if exists "items: public read" on public.items;
create policy "items: public read" on public.items for select using (status in ('published','soon') or public.is_admin());
drop policy if exists "items: admin write" on public.items;
create policy "items: admin write" on public.items for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "orders: read own or admin" on public.orders;
create policy "orders: read own or admin" on public.orders for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "orders: create own" on public.orders;
create policy "orders: create own" on public.orders for insert with check (user_id = auth.uid() and status = 'pending');
drop policy if exists "orders: update own or admin" on public.orders;
create policy "orders: update own or admin" on public.orders for update using (user_id = auth.uid() or public.is_admin());

drop policy if exists "messages: anyone can send" on public.messages;
create policy "messages: anyone can send" on public.messages for insert with check (true);
drop policy if exists "messages: admin read" on public.messages;
create policy "messages: admin read" on public.messages for select using (public.is_admin());
drop policy if exists "messages: admin update" on public.messages;
create policy "messages: admin update" on public.messages for update using (public.is_admin());
drop policy if exists "messages: admin delete" on public.messages;
create policy "messages: admin delete" on public.messages for delete using (public.is_admin());

-- ---------- Хранилище фото для статей ----------
insert into storage.buckets (id, name, public) values ('media', 'media', true)
  on conflict (id) do nothing;
drop policy if exists "media: public read" on storage.objects;
create policy "media: public read" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media: admin upload" on storage.objects;
create policy "media: admin upload" on storage.objects for insert with check (bucket_id = 'media' and public.is_admin());
drop policy if exists "media: admin update" on storage.objects;
create policy "media: admin update" on storage.objects for update using (bucket_id = 'media' and public.is_admin());
drop policy if exists "media: admin delete" on storage.objects;
create policy "media: admin delete" on storage.objects for delete using (bucket_id = 'media' and public.is_admin());

-- =====================================================================
-- ПОСЛЕ РЕГИСТРАЦИИ НА САЙТЕ сделайте себя администратором
-- (замените email на свой и выполните одну эту строку):
--   update public.profiles set role = 'admin' where email = 'ваш@email.com';
-- =====================================================================
