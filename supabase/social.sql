-- =====================================================================
-- BEKNAZAURUS — лайки и комментарии
-- Supabase → SQL Editor → вставить файл → Run. Можно запускать повторно.
-- target — что лайкают/комментируют: 'story:sezim', 'travel:aksy', 'work:qaibar'
-- =====================================================================

-- ---------- Лайки ----------
create table if not exists public.likes (
  user_id    uuid not null references auth.users(id) on delete cascade,
  target     text not null check (char_length(target) between 3 and 120),
  created_at timestamptz not null default now(),
  primary key (user_id, target)
);
create index if not exists likes_target_idx on public.likes (target);
alter table public.likes enable row level security;
drop policy if exists "likes: anyone can read" on public.likes;
create policy "likes: anyone can read" on public.likes for select using (true);
drop policy if exists "likes: like as yourself" on public.likes;
create policy "likes: like as yourself" on public.likes for insert with check (user_id = auth.uid());
drop policy if exists "likes: unlike your own" on public.likes;
create policy "likes: unlike your own" on public.likes for delete using (user_id = auth.uid());

-- ---------- Комментарии ----------
create table if not exists public.comments (
  id          uuid primary key default gen_random_uuid(),
  target      text not null check (char_length(target) between 3 and 120),
  user_id     uuid references auth.users(id) on delete cascade,
  author_name text,
  body        text not null check (char_length(btrim(body)) between 1 and 2000),
  hidden      boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists comments_target_idx on public.comments (target, created_at);

-- имя автора берётся из профиля; не больше 5 комментариев в минуту от одного человека
create or replace function public.prepare_comment() returns trigger
language plpgsql security definer set search_path = public as $$
declare recent int;
begin
  new.user_id := auth.uid();
  new.hidden := false;
  new.body := btrim(new.body);
  select coalesce(nullif(p.name, ''), split_part(p.email, '@', 1)) into new.author_name
    from public.profiles p where p.id = auth.uid();
  select count(*) into recent from public.comments
    where user_id = auth.uid() and created_at > now() - interval '1 minute';
  if recent >= 5 then raise exception 'Слишком много комментариев подряд. Попробуйте через минуту.'; end if;
  return new;
end $$;
drop trigger if exists comments_prepare on public.comments;
create trigger comments_prepare before insert on public.comments
  for each row execute function public.prepare_comment();

alter table public.comments enable row level security;
drop policy if exists "comments: read visible" on public.comments;
create policy "comments: read visible" on public.comments for select using (not hidden or user_id = auth.uid() or public.is_admin());
drop policy if exists "comments: write as yourself" on public.comments;
create policy "comments: write as yourself" on public.comments for insert with check (auth.uid() is not null);
drop policy if exists "comments: delete own or admin" on public.comments;
create policy "comments: delete own or admin" on public.comments for delete using (user_id = auth.uid() or public.is_admin());
drop policy if exists "comments: admin moderates" on public.comments;
create policy "comments: admin moderates" on public.comments for update using (public.is_admin());
