-- =====================================================================
-- دفتر v10: إشعارات على التلفون (ملخص يومي + رسائل من الإدارة) — آمن تشغيله أكثر من مرة
-- الاشتراكات ما بتنقرأ من التطبيق مباشرة: بس عن طريق دوال محمية، والإرسال من السيرفر (Edge Function).
-- =====================================================================

create table if not exists public.push_subs (
  id         bigserial primary key,
  user_id    uuid not null references auth.users(id) on delete cascade,
  company_id uuid references public.companies(id) on delete cascade,
  endpoint   text not null unique,
  p256dh     text not null,
  auth       text not null,
  lang       text not null default 'ar',
  morning    boolean not null default true,
  evening    boolean not null default true,
  news       boolean not null default true,
  fails      int not null default 0,
  created_at timestamptz not null default now(),
  last_ok    timestamptz
);
create index if not exists push_subs_company_idx on public.push_subs(company_id);
create index if not exists push_subs_user_idx on public.push_subs(user_id);
alter table public.push_subs enable row level security;
revoke all on public.push_subs from anon, authenticated;

create table if not exists public.push_log (
  id      bigserial primary key,
  by_user uuid,
  title   text not null,
  body    text not null,
  url     text,
  target  text not null,
  sent    int not null default 0,
  failed  int not null default 0,
  at      timestamptz not null default now()
);
alter table public.push_log enable row level security;
revoke all on public.push_log from anon, authenticated;

-- push services we accept (browser vendors only)
create or replace function public._push_host_ok(p text)
returns boolean language sql immutable as $$
  select p ~ '^https://(fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|[a-z0-9.-]*\.push\.apple\.com|[a-z0-9.-]*\.notify\.windows\.com|web\.push\.apple\.com)/'
$$;

create or replace function public.push_subscribe(p_endpoint text, p_p256dh text, p_auth text, p_lang text default 'ar',
                                                  p_morning boolean default true, p_evening boolean default true, p_news boolean default true)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if p_endpoint is null or char_length(p_endpoint) > 800 or not public._push_host_ok(p_endpoint) then raise exception 'bad endpoint'; end if;
  if p_p256dh !~ '^[A-Za-z0-9_-]{80,100}$' or p_auth !~ '^[A-Za-z0-9_-]{16,32}$' then raise exception 'bad keys'; end if;
  if (select count(*) from public.push_subs where user_id = auth.uid() and endpoint <> p_endpoint) >= 10 then
    delete from public.push_subs where id = (select id from public.push_subs where user_id = auth.uid() order by created_at limit 1);
  end if;
  insert into public.push_subs(user_id, company_id, endpoint, p256dh, auth, lang, morning, evening, news)
  values (auth.uid(), public.my_company(), p_endpoint, p_p256dh, p_auth, case when p_lang = 'en' then 'en' else 'ar' end,
          coalesce(p_morning,true), coalesce(p_evening,true), coalesce(p_news,true))
  on conflict (endpoint) do update set user_id = excluded.user_id, company_id = excluded.company_id, p256dh = excluded.p256dh, auth = excluded.auth,
          lang = excluded.lang, morning = excluded.morning, evening = excluded.evening, news = excluded.news, fails = 0;
  return true;
end $$;

create or replace function public.push_unsubscribe(p_endpoint text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  delete from public.push_subs where user_id = auth.uid() and endpoint = p_endpoint;
  return found;
end $$;

create or replace function public.push_mine(p_endpoint text)
returns json language sql stable security definer set search_path = public as $$
  select row_to_json(x) from (select morning, evening, news, lang from public.push_subs where user_id = auth.uid() and endpoint = p_endpoint) x
$$;

-- admin: subscribers count + last broadcasts (needs a platform admin with 2-step sign-in)
create or replace function public.admin_push_info()
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'forbidden'; end if;
  return json_build_object(
    'subs', (select count(*) from public.push_subs),
    'users', (select count(distinct user_id) from public.push_subs),
    'log', (select coalesce(json_agg(l order by l.at desc), '[]'::json) from (select title, body, target, sent, failed, at from public.push_log order by at desc limit 30) l));
end $$;

revoke all on function public._push_host_ok(text) from public, anon, authenticated;
revoke all on function public.push_subscribe(text,text,text,text,boolean,boolean,boolean) from public, anon;
revoke all on function public.push_unsubscribe(text) from public, anon;
revoke all on function public.push_mine(text) from public, anon;
revoke all on function public.admin_push_info() from public, anon;
grant execute on function public.push_subscribe(text,text,text,text,boolean,boolean,boolean) to authenticated;
grant execute on function public.push_unsubscribe(text) to authenticated;
grant execute on function public.push_mine(text) to authenticated;
grant execute on function public.admin_push_info() to authenticated;
