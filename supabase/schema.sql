-- =====================================================================
-- دفتر (Daftar) — قاعدة البيانات لإدارة شغل أي شركة (v3: الدعم والذكاء الاصطناعي)
-- شغّل هالملف مرة وحدة من Supabase → SQL Editor → New query → Run
-- =====================================================================
-- المبدأ: كل شركة ما بتشوف ولا بتعدّل إلا بياناتها.
-- الحماية مفروضة داخل قاعدة البيانات نفسها (Row Level Security)،
-- فحتى لو حدا عدّل كود الواجهة ما بيقدر يوصل لبيانات شركة ثانية.
-- الأدمن بيشوف إحصائيات وأسماء الشركات بس، مش أرقامهم ولا عمالهم.
-- كلمات السر ما بتنحفظ عندنا أبداً؛ Supabase بيخزنها مشفّرة (bcrypt).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------- الجداول ----------
create table if not exists public.companies (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(trim(name)) between 2 and 80),
  phone       text check (phone is null or char_length(phone) <= 30),
  -- نوع الشغل، اللغة، العملة، أيام العطلة، الدوام
  settings    jsonb not null default '{}'::jsonb check (jsonb_typeof(settings) = 'object' and pg_column_size(settings) < 4000),
  created_at  timestamptz not null default now()
);

-- كل مستخدم تابع لشركة وحدة بس
create table if not exists public.members (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  company_id  uuid not null references public.companies(id) on delete cascade,
  role        text not null default 'owner' check (role in ('owner','member')),
  created_at  timestamptz not null default now()
);
create index if not exists members_company_idx on public.members(company_id);

-- كل بيانات الدفتر: units (مشاريع/فروع/أقسام)، staff (موظفين/عمال)، attendance، payments (رواتب وسلف)، expenses، income
create table if not exists public.records (
  company_id  uuid not null references public.companies(id) on delete cascade,
  col         text not null check (col in ('units','staff','attendance','payments','expenses','income')),
  id          text not null check (char_length(id) between 1 and 120 and id ~ '^[A-Za-z0-9_\-]+$'),
  data        jsonb not null check (jsonb_typeof(data) = 'object' and pg_column_size(data) < 16000),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (company_id, col, id)
);
create index if not exists records_company_updated_idx on public.records(company_id, updated_at desc);

-- مين أدمن المنصة (بتضيف حالك يدوياً، شوف آخر الملف)
-- إذا كنت مشغّل نسخة قديمة من هالملف، هدول بيحدّثوها
alter table public.companies add column if not exists settings jsonb not null default '{}'::jsonb;
alter table public.records drop constraint if exists records_col_check;
alter table public.records add constraint records_col_check check (col in ('units','staff','attendance','payments','expenses','income'));
drop function if exists public.create_company(text, text);

create table if not exists public.platform_admins (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now()
);

-- سجل كل دخول وعملية أدمن (ما حدا بيقدر يعدّله أو يحذفه من الواجهة)
create table if not exists public.admin_audit (
  id         bigint generated always as identity primary key,
  user_id    uuid,
  action     text not null check (char_length(action) <= 60),
  detail     text check (detail is null or char_length(detail) <= 300),
  ip         text check (ip is null or char_length(ip) <= 64),
  ua         text check (ua is null or char_length(ua) <= 300),
  created_at timestamptz not null default now()
);
create index if not exists admin_audit_time_idx on public.admin_audit(created_at desc);
alter table public.admin_audit enable row level security;

-- ---------- دوال مساعدة ----------
create or replace function public.my_company()
returns uuid language sql stable security definer set search_path = public as $$
  select company_id from public.members where user_id = auth.uid()
$$;

-- الأدمن لازم يكون: (١) بجدول platform_admins، و(٢) داخل بالتحقق بخطوتين (aal2)،
-- و(٣) حسابه مش مربوط بأي شركة. أي شرط ناقص = مش أدمن، حتى لو كلمة السر صح.
create or replace function public.is_platform_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select auth.uid() is not null
     and exists (select 1 from public.platform_admins where user_id = auth.uid())
     and not exists (select 1 from public.members where user_id = auth.uid())
     and coalesce(auth.jwt()->>'aal','aal1') = 'aal2'
$$;

-- الشركة ما بتقدر تغيّر company_id ولا تاريخ الإنشاء؛ updated_at بيتحدّث لحاله
create or replace function public.records_guard()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    new.created_at := now();
    -- حد أعلى للسجلات لكل شركة لمنع إساءة الاستخدام
    if (select count(*) from public.records where company_id = new.company_id) >= 50000 then
      raise exception 'record limit reached';
    end if;
  else
    new.company_id := old.company_id;
    new.created_at := old.created_at;
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists records_guard_trg on public.records;
create trigger records_guard_trg before insert or update on public.records
  for each row execute function public.records_guard();

-- ---------- إنشاء شركة عند أول دخول ----------
create or replace function public.create_company(p_name text, p_phone text default null, p_settings jsonb default '{}'::jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare cid uuid;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if exists (select 1 from public.members where user_id = auth.uid()) then
    return (select company_id from public.members where user_id = auth.uid());
  end if;
  if p_name is null or char_length(trim(p_name)) < 2 then raise exception 'company name required'; end if;
  if p_settings is null or jsonb_typeof(p_settings) <> 'object' or pg_column_size(p_settings) >= 4000 then p_settings := '{}'::jsonb; end if;
  insert into public.companies(name, phone, settings)
    values (left(trim(p_name), 80), nullif(left(trim(coalesce(p_phone,'')), 30), ''), p_settings)
    returning id into cid;
  insert into public.members(user_id, company_id, role) values (auth.uid(), cid, 'owner');
  return cid;
end $$;


create or replace function public._admin_log(p_action text, p_detail text default null)
returns void language plpgsql security definer set search_path = public as $$
declare h json;
begin
  begin h := current_setting('request.headers', true)::json; exception when others then h := null; end;
  insert into public.admin_audit(user_id, action, detail, ip, ua)
  values (auth.uid(), left(p_action,60), left(p_detail,300),
          left(coalesce(h->>'cf-connecting-ip', split_part(coalesce(h->>'x-forwarded-for',''), ',', 1)), 64),
          left(h->>'user-agent', 300));
end $$;

-- بتستعملها لوحة الإدارة بعد الدخول: هل الحساب أدمن؟ وهل خلّص التحقق بخطوتين؟
-- (ما بتكشف إشي لحساب عادي: بترجع false/false)
create or replace function public.admin_whoami()
returns json language plpgsql security definer set search_path = public as $$
declare listed boolean; ok boolean;
begin
  listed := auth.uid() is not null and exists (select 1 from public.platform_admins where user_id = auth.uid())
            and not exists (select 1 from public.members where user_id = auth.uid());
  ok := listed and coalesce(auth.jwt()->>'aal','aal1') = 'aal2';
  if ok then perform public._admin_log('session', null); end if;
  return json_build_object('listed', listed, 'mfa', ok);
end $$;

create or replace function public.admin_audit_list()
returns json language plpgsql stable security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'forbidden'; end if;
  return (select coalesce(json_agg(t order by t.created_at desc), '[]'::json) from (
    select action, detail, ip, ua, created_at from public.admin_audit order by created_at desc limit 200) t);
end $$;

-- الأدمن ما بيقدر يربط حاله بشركة، وصاحب شركة ما بيصير أدمن بالغلط
create or replace function public.members_guard()
returns trigger language plpgsql set search_path = public as $$
begin
  if exists (select 1 from public.platform_admins where user_id = new.user_id) then raise exception 'admin accounts cannot join a company'; end if;
  return new;
end $$;
drop trigger if exists members_guard_trg on public.members;
create trigger members_guard_trg before insert on public.members for each row execute function public.members_guard();

create or replace function public.admin_note(p_action text, p_detail text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'forbidden'; end if;
  if p_action not in ('send_reset','login','logout','idle_logout') then raise exception 'bad action'; end if;
  perform public._admin_log(p_action, p_detail); return true;
end $$;

-- ---------- لوحة الأدمن: إحصائيات بدون أي أرقام مالية ----------
create or replace function public.admin_stats()
returns json language plpgsql volatile security definer set search_path = public, auth as $$
begin
  if not public.is_platform_admin() then raise exception 'forbidden'; end if;
  perform public._admin_log('view_stats', null);
  return json_build_object(
    'companies',  (select count(*) from public.companies),
    'new_7d',     (select count(*) from public.companies where created_at > now() - interval '7 days'),
    'new_30d',    (select count(*) from public.companies where created_at > now() - interval '30 days'),
    'active_7d',  (select count(distinct company_id) from public.records where updated_at > now() - interval '7 days'),
    'units',      (select count(*) from public.records where col = 'units'),
    'staff',      (select count(*) from public.records where col = 'staff'),
    'by_type',    (select coalesce(json_agg(t order by t.count desc), '[]'::json) from (
                     select coalesce(settings->>'type','other') as type, count(*) as count
                     from public.companies group by 1) t),
    'by_month',   (select coalesce(json_agg(t order by t.month), '[]'::json) from (
                     select to_char(date_trunc('month', created_at), 'YYYY-MM') as month, count(*) as count
                     from public.companies group by 1) t),
    'list',       (select coalesce(json_agg(t order by t.created_at desc), '[]'::json) from (
                     select c.id, c.name, c.phone, c.created_at, u.email, u.last_sign_in_at,
                       coalesce(c.settings->>'type','other') as type, c.settings->>'country' as country,
                       (select count(*) from public.records r where r.company_id = c.id and r.col = 'units') as units,
                       (select count(*) from public.records r where r.company_id = c.id and r.col = 'staff') as staff,
                       (select max(updated_at) from public.records r where r.company_id = c.id) as last_activity
                     from public.companies c
                     left join public.members m on m.company_id = c.id and m.role = 'owner'
                     left join auth.users u on u.id = m.user_id) t)
  );
end $$;

-- ---------- الحماية: Row Level Security ----------
alter table public.companies       enable row level security;
alter table public.members         enable row level security;
alter table public.records         enable row level security;
alter table public.platform_admins enable row level security;

drop policy if exists companies_read   on public.companies;
drop policy if exists companies_update on public.companies;
drop policy if exists members_read     on public.members;
drop policy if exists records_select   on public.records;
drop policy if exists records_insert   on public.records;
drop policy if exists records_update   on public.records;
drop policy if exists records_delete   on public.records;

create policy companies_read on public.companies for select to authenticated
  using (id = public.my_company());
create policy companies_update on public.companies for update to authenticated
  using (id = public.my_company() and exists (select 1 from public.members where user_id = auth.uid() and role = 'owner'))
  with check (id = public.my_company());

create policy members_read on public.members for select to authenticated
  using (user_id = auth.uid());

create policy records_select on public.records for select to authenticated using (company_id = public.my_company());
create policy records_insert on public.records for insert to authenticated with check (company_id = public.my_company());
create policy records_update on public.records for update to authenticated using (company_id = public.my_company()) with check (company_id = public.my_company());
create policy records_delete on public.records for delete to authenticated using (company_id = public.my_company());
-- platform_admins: ما في ولا policy → ما حدا بيقدر يقرأه أو يعدّله من الواجهة

-- ---------- حذف الحساب (مطلوب للمتاجر) ----------
-- بس صاحب الحساب، وبعد ما يكتب اسم الشركة بالضبط. بيحذف الشركة وكل بياناتها وحساب الدخول.
create or replace function public.delete_my_account(p_confirm text)
returns boolean language plpgsql security definer set search_path = public, auth as $$
declare cid uuid; cname text;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  select m.company_id, c.name into cid, cname from public.members m join public.companies c on c.id = m.company_id
   where m.user_id = auth.uid() and m.role = 'owner';
  if cid is null then raise exception 'not owner'; end if;
  if p_confirm is distinct from cname then raise exception 'confirmation mismatch'; end if;
  delete from public.support_tickets where company_id = cid or user_id = auth.uid();
  delete from public.companies where id = cid;            -- records + members بينحذفوا معها (cascade)
  delete from auth.users where id = auth.uid();
  return true;
end $$;

-- ---------- الصلاحيات ----------
revoke all on public.companies, public.members, public.records, public.platform_admins from anon, authenticated;
grant select, update (name, phone, settings) on public.companies to authenticated;
grant select on public.members to authenticated;
grant select, insert, update, delete on public.records to authenticated;

revoke all on function public.create_company(text, text, jsonb) from public, anon;
revoke all on function public.admin_stats()              from public, anon;
revoke all on function public.my_company()               from public, anon;
revoke all on function public.is_platform_admin()        from public, anon;
revoke all on public.admin_audit from anon, authenticated;
revoke all on function public._admin_log(text, text)      from public, anon, authenticated;
revoke all on function public.admin_whoami()              from public, anon;
revoke all on function public.admin_audit_list()          from public, anon;
revoke all on function public.admin_note(text, text)      from public, anon;
grant execute on function public.admin_whoami()           to authenticated;
revoke all on function public.delete_my_account(text)     from public, anon;
grant execute on function public.delete_my_account(text)  to authenticated;
grant execute on function public.admin_audit_list()       to authenticated;
grant execute on function public.admin_note(text, text)   to authenticated;
grant execute on function public.create_company(text, text, jsonb) to authenticated;
grant execute on function public.admin_stats()              to authenticated;
grant execute on function public.my_company()               to authenticated;
grant execute on function public.is_platform_admin()        to authenticated;

-- =====================================================================
-- الدعم: تذاكر الدعم البشري + حدود استعمال الذكاء الاصطناعي
-- =====================================================================
create table if not exists public.support_tickets (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid references public.companies(id) on delete cascade,
  user_id     uuid references auth.users(id) on delete cascade,
  name        text check (name is null or char_length(name) <= 80),
  contact     text check (contact is null or char_length(contact) <= 120),
  subject     text check (subject is null or char_length(subject) <= 160),
  status      text not null default 'open' check (status in ('open','answered','closed')),
  messages    jsonb not null default '[]'::jsonb check (jsonb_typeof(messages) = 'array' and pg_column_size(messages) < 60000),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists tickets_user_idx on public.support_tickets(user_id, updated_at desc);
create index if not exists tickets_status_idx on public.support_tickets(status, updated_at desc);
alter table public.support_tickets enable row level security;
drop policy if exists tickets_own_read on public.support_tickets;
create policy tickets_own_read on public.support_tickets for select to authenticated using (user_id = auth.uid());
revoke all on public.support_tickets from anon, authenticated;
grant select on public.support_tickets to authenticated;

-- رسالة واحدة: نص مقصوص + دور + وقت
create or replace function public._msg(p_role text, p_text text)
returns jsonb language sql immutable as $$
  select jsonb_build_object('role', p_role, 'text', left(coalesce(p_text,''), 4000), 'at', now())
$$;

-- فتح تذكرة من مستخدم مسجّل (بتنقل محادثته مع المساعد)
create or replace function public.open_ticket(p_subject text, p_messages jsonb)
returns uuid language plpgsql security definer set search_path = public as $$
declare tid uuid; msgs jsonb := '[]'::jsonb; m jsonb; n int := 0;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if (select count(*) from public.support_tickets where user_id = auth.uid() and created_at > now() - interval '1 hour') >= 5 then
    raise exception 'too many tickets';
  end if;
  if jsonb_typeof(p_messages) = 'array' then
    for m in select * from jsonb_array_elements(p_messages) loop
      exit when n >= 30;
      if m->>'role' in ('user','ai') then msgs := msgs || jsonb_build_array(public._msg(m->>'role', m->>'text')); n := n + 1; end if;
    end loop;
  end if;
  insert into public.support_tickets(company_id, user_id, contact, subject, messages)
    values (public.my_company(), auth.uid(), (select email from auth.users where id = auth.uid()), left(coalesce(p_subject,''),160), msgs)
    returning id into tid;
  return tid;
end $$;

-- تذكرة من شخص مش مسجّل دخول (مثلاً نسي كلمة السر)
create or replace function public.open_public_ticket(p_name text, p_contact text, p_message text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if coalesce(char_length(trim(p_contact)),0) < 5 or coalesce(char_length(trim(p_message)),0) < 3 then raise exception 'missing fields'; end if;
  if (select count(*) from public.support_tickets where user_id is null and contact = left(trim(p_contact),120) and created_at > now() - interval '1 hour') >= 2
     or (select count(*) from public.support_tickets where user_id is null and created_at > now() - interval '10 minutes') >= 30 then
    raise exception 'too many tickets';
  end if;
  insert into public.support_tickets(name, contact, subject, messages)
    values (left(trim(coalesce(p_name,'')),80), left(trim(p_contact),120), left(trim(p_message),160), jsonb_build_array(public._msg('user', p_message)));
  return true;
end $$;

-- المستخدم بيضيف رسالة على تذكرته
create or replace function public.ticket_reply(p_id uuid, p_text text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if coalesce(char_length(trim(p_text)),0) = 0 then return false; end if;
  update public.support_tickets
     set messages = case when jsonb_array_length(messages) >= 60 then messages else messages || jsonb_build_array(public._msg('user', p_text)) end,
         status = 'open', updated_at = now()
   where id = p_id and user_id = auth.uid();
  return found;
end $$;

-- الأدمن: قائمة التذاكر والرد عليها
create or replace function public.admin_tickets(p_status text default null)
returns json language plpgsql volatile security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'forbidden'; end if;
  perform public._admin_log('view_tickets', p_status);
  return (select coalesce(json_agg(t order by t.updated_at desc), '[]'::json) from (
    select s.id, s.status, s.subject, s.name, s.contact, s.messages, s.created_at, s.updated_at, c.name as company
    from public.support_tickets s left join public.companies c on c.id = s.company_id
    where p_status is null or s.status = p_status
    order by s.updated_at desc limit 200) t);
end $$;
create or replace function public.admin_reply(p_id uuid, p_text text, p_close boolean default false)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not public.is_platform_admin() then raise exception 'forbidden'; end if;
  perform public._admin_log(case when p_close then 'reply_close' else 'reply' end, p_id::text);
  update public.support_tickets
     set messages = case when coalesce(char_length(trim(p_text)),0) > 0 then messages || jsonb_build_array(public._msg('support', p_text)) else messages end,
         status = case when p_close then 'closed' else 'answered' end, updated_at = now()
   where id = p_id;
  return found;
end $$;

-- حدود استعمال الذكاء الاصطناعي (بس الـ Edge Function بتقدر تستدعيها)
create table if not exists public.ai_usage (
  key   text not null check (char_length(key) <= 100),
  day   date not null default current_date,
  count int  not null default 0,
  primary key (key, day)
);
alter table public.ai_usage enable row level security;
revoke all on public.ai_usage from anon, authenticated;
create or replace function public.bump_ai_usage(p_key text, p_limit int)
returns boolean language plpgsql security definer set search_path = public as $$
declare c int;
begin
  insert into public.ai_usage(key, day, count) values (left(p_key,100), current_date, 1)
    on conflict (key, day) do update set count = public.ai_usage.count + 1
    returning count into c;
  delete from public.ai_usage where day < current_date - 30;
  return c <= p_limit;
end $$;

revoke all on function public._msg(text, text)                      from public, anon, authenticated;
revoke all on function public.open_ticket(text, jsonb)               from public, anon;
revoke all on function public.open_public_ticket(text, text, text)   from public;
revoke all on function public.ticket_reply(uuid, text)               from public, anon;
revoke all on function public.admin_tickets(text)                    from public, anon;
revoke all on function public.admin_reply(uuid, text, boolean)       from public, anon;
revoke all on function public.bump_ai_usage(text, int)               from public, anon, authenticated;
grant execute on function public.open_ticket(text, jsonb)             to authenticated;
grant execute on function public.open_public_ticket(text, text, text) to anon, authenticated;
grant execute on function public.ticket_reply(uuid, text)             to authenticated;
grant execute on function public.admin_tickets(text)                  to authenticated;
grant execute on function public.admin_reply(uuid, text, boolean)     to authenticated;
do $$ begin grant execute on function public.bump_ai_usage(text, int) to service_role; exception when undefined_object then null; end $$;

-- ---------- التحديث المباشر بين الأجهزة ----------
do $$ begin
  alter publication supabase_realtime add table public.records;
exception when duplicate_object then null; end $$;

-- =====================================================================
-- حساب الأدمن: اعمله من Supabase → Authentication → Users → Add user
-- (إيميل خاص مش مستعمل بأي شركة + كلمة سر قوية)، وبعدها شغّل مرة وحدة:
--   insert into public.platform_admins(user_id)
--   select id from auth.users where email = 'admin-email@example.com';
-- وأول دخول للوحة الإدارة رح يطلب منك تفعّل التحقق بخطوتين (Google Authenticator).
-- =====================================================================

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
