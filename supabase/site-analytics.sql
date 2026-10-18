-- =====================================================================
-- إحصائيات موقع التنزيل (مجهولة الهوية)
-- بنسجّل: زيارة، ضغطة تثبيت، تثبيت، فتح التطبيق المثبّت، تشغيل الفيديو، فتح التطبيق.
-- ما بنسجّل IP ولا إيميل ولا أي معلومة شخصية: بس رقم عشوائي للجهاز، ونوع الجهاز والمتصفح، ومن وين إجا.
-- آمن تشغيله أكثر من مرة.
-- =====================================================================
create table if not exists public.site_events (
  id       bigint generated always as identity primary key,
  at       timestamptz not null default now(),
  vid      text not null,
  type     text not null,
  os       text not null default 'other',
  browser  text not null default 'other',
  ref      text not null default 'direct',
  page     text not null default 'get'
);
create index if not exists site_events_at  on public.site_events (at);
create index if not exists site_events_vid on public.site_events (vid, at);
alter table public.site_events enable row level security;
revoke all on public.site_events from anon, authenticated;

create or replace function public.log_site_event(p_type text, p_vid text, p_os text, p_browser text, p_ref text, p_page text)
returns boolean language plpgsql security definer set search_path = public as $$
declare v_vid text := lower(coalesce(p_vid,''));
begin
  if p_type not in ('visit','install_click','installed','app_open_installed','video_play','open_app','store_click','copy_link') then return false; end if;
  if v_vid !~ '^[a-z0-9]{8,40}$' then return false; end if;
  -- حدود ضد الإغراق: 60 حدث بالساعة لكل جهاز، و3000 كل 10 دقائق للكل
  if (select count(*) from public.site_events where vid = v_vid and at > now() - interval '1 hour') >= 60
     or (select count(*) from public.site_events where at > now() - interval '10 minutes') >= 3000 then return false; end if;
  -- التثبيت وفتح التطبيق المثبّت بينحسبوا مرة وحدة لكل جهاز
  if p_type in ('installed','app_open_installed') and exists (select 1 from public.site_events where vid = v_vid and type = p_type) then return true; end if;
  insert into public.site_events(vid, type, os, browser, ref, page) values (
    v_vid, p_type,
    case when p_os in ('android','ios','windows','mac','linux') then p_os else 'other' end,
    case when p_browser in ('chrome','safari','edge','firefox','samsung','instagram','facebook','tiktok','snapchat','whatsapp','other') then p_browser else 'other' end,
    left(regexp_replace(lower(coalesce(nullif(p_ref,''),'direct')), '[^a-z0-9.\-]', '', 'g'), 60),
    case when p_page in ('get','app') then p_page else 'get' end);
  return true;
end $$;

create or replace function public.admin_site_stats(p_days int default 30)
returns json language plpgsql volatile security definer set search_path = public, auth as $$
declare d int := least(greatest(coalesce(p_days,30),1),365); since timestamptz;
begin
  if not public.is_platform_admin() then raise exception 'forbidden'; end if;
  since := date_trunc('day', now()) - make_interval(days => d - 1);
  return json_build_object(
    'days', d,
    'visitors',      (select count(distinct vid) from site_events where type='visit' and at >= since),
    'visits',        (select count(*) from site_events where type='visit' and at >= since),
    'today',         (select count(distinct vid) from site_events where type='visit' and at >= date_trunc('day', now())),
    'install_clicks',(select count(distinct vid) from site_events where type in ('install_click','store_click') and at >= since),
    'installs',      (select count(distinct vid) from site_events where type in ('installed','app_open_installed') and at >= since),
    'video_plays',   (select count(*) from site_events where type='video_play' and at >= since),
    'open_app',      (select count(distinct vid) from site_events where type='open_app' and at >= since),
    'signups',       (select count(*) from companies where created_at >= since),
    'all_time',      json_build_object(
                       'visitors', (select count(distinct vid) from site_events where type='visit'),
                       'installs', (select count(distinct vid) from site_events where type in ('installed','app_open_installed')),
                       'signups',  (select count(*) from companies)),
    'by_day', (select coalesce(json_agg(x order by x.day), '[]'::json) from (
                 select to_char(g.day,'YYYY-MM-DD') as day,
                   (select count(distinct vid) from site_events e where e.type='visit' and e.at >= g.day and e.at < g.day + interval '1 day') as visitors,
                   (select count(distinct vid) from site_events e where e.type in ('installed','app_open_installed') and e.at >= g.day and e.at < g.day + interval '1 day') as installs,
                   (select count(*) from companies c where c.created_at >= g.day and c.created_at < g.day + interval '1 day') as signups
                 from generate_series(since, date_trunc('day', now()), interval '1 day') as g(day)) x),
    'by_os', (select coalesce(json_agg(x order by x.visitors desc), '[]'::json) from (
                 select os, count(distinct vid) as visitors,
                   count(distinct vid) filter (where type in ('installed','app_open_installed')) as installs
                 from site_events where at >= since group by os) x),
    'by_ref', (select coalesce(json_agg(x order by x.visitors desc), '[]'::json) from (
                 select ref, count(distinct vid) as visitors from site_events where type='visit' and at >= since group by ref order by 2 desc limit 8) x),
    'by_browser', (select coalesce(json_agg(x order by x.visitors desc), '[]'::json) from (
                 select browser, count(distinct vid) as visitors from site_events where type='visit' and at >= since group by browser order by 2 desc limit 8) x)
  );
end $$;

revoke all on function public.log_site_event(text,text,text,text,text,text) from public;
grant execute on function public.log_site_event(text,text,text,text,text,text) to anon, authenticated;
revoke all on function public.admin_site_stats(int) from public, anon;
grant execute on function public.admin_site_stats(int) to authenticated;
