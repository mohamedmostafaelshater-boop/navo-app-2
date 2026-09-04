-- شغّل الكود ده مرة واحدة من Supabase → SQL Editor → New query → Run

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  country text not null default 'EG',
  plan text,               -- null = لسه في التجربة المجانية أو مش مشترك
  subscription_status text default 'trial', -- trial | active | cancelled
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

drop policy if exists "المستخدم يشوف بياناته بس" on public.profiles;
create policy "المستخدم يشوف بياناته بس"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "المستخدم يعدل بياناته بس" on public.profiles;
create policy "المستخدم يعدل بياناته بس"
  on public.profiles for update
  using (auth.uid() = id);

-- ينشئ صف profile تلقائيًا لما يتسجل مستخدم جديد
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, country)
  values (new.id, 'EG')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
