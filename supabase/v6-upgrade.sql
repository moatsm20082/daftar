-- =====================================================================
-- دفتر v6 — ترقية قاعدة البيانات (آمن تشغيله أكثر من مرة)
-- Supabase → SQL Editor → New query → الصق الملف كامل → Run
-- بيضيف: ورديات السائقين، تخزين الفواتير والصور (خاص لكل شركة)، ودعوة أشخاص لنفس الشركة بكود.
-- =====================================================================

-- 1) نوع سجل جديد: shifts (ورديات السائقين)
delete from public.records where col = 'banktx';   -- ميزة رسائل البنك انشالت
alter table public.records drop constraint if exists records_col_check;
alter table public.records add constraint records_col_check
  check (col in ('units','staff','attendance','payments','expenses','income','shifts'));

-- 2) تخزين الفواتير والصور والملفات: مخزن خاص (مش عام)، كل شركة بمجلدها بس
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('files', 'files', false, 10485760, array[
  'image/jpeg','image/png','image/webp','application/pdf',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/msword','text/csv'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- مساحة كل شركة: لحد 3000 ملف و 1 جيجا
create or replace function public.files_room()
returns boolean language sql stable security definer set search_path = public, storage as $$
  select count(*) < 3000 and coalesce(sum((metadata->>'size')::bigint), 0) < 1073741824
  from storage.objects
  where bucket_id = 'files' and (storage.foldername(name))[1] = public.my_company()::text
$$;
revoke all on function public.files_room() from public, anon;
grant execute on function public.files_room() to authenticated;

-- اسم الملف لازم يكون بالشكل اللي التطبيق بيعمله: <الشركة>/<سنة-شهر>/<رقم عشوائي>.<امتداد>
create or replace function public.files_path_ok(p_name text)
returns boolean language sql immutable as $$
  select p_name ~ '^[0-9a-f-]{36}/[0-9]{4}-[0-9]{2}/[A-Za-z0-9_-]{8,80}\.(jpg|pdf|xlsx|xls|docx|doc|csv)$'
$$;

drop policy if exists files_read   on storage.objects;
drop policy if exists files_insert on storage.objects;
drop policy if exists files_delete on storage.objects;
create policy files_read on storage.objects for select to authenticated
  using (bucket_id = 'files' and (storage.foldername(name))[1] = public.my_company()::text);
create policy files_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'files' and (storage.foldername(name))[1] = public.my_company()::text
              and public.files_path_ok(name) and public.files_room());
create policy files_delete on storage.objects for delete to authenticated
  using (bucket_id = 'files' and (storage.foldername(name))[1] = public.my_company()::text);
-- ما في policy للتعديل: الملف ما بيتعدّل، بينحذف وبينرفع غيره

-- 3) بحث الأسعار انشال
drop table if exists public.price_cache cascade;
drop function if exists public.price_cache_trim() cascade;

-- 4) حماية إضافية
-- حد كتابة: 2000 سجل جديد بالساعة لكل شركة (بيوقف أي سكربت بيغرق القاعدة)
create or replace function public.records_guard()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    new.created_at := now();
    if (select count(*) from public.records where company_id = new.company_id) >= 50000 then
      raise exception 'record limit reached';
    end if;
    if (select count(*) from public.records where company_id = new.company_id and created_at > now() - interval '1 hour') >= 2000 then
      raise exception 'record limit reached (too fast)';
    end if;
  else
    new.company_id := old.company_id;
    new.created_at := old.created_at;
  end if;
  new.updated_at := now();
  return new;
end $$;
create index if not exists records_company_created_idx on public.records(company_id, created_at desc);

-- 4b) فريق الشركة: صاحب الشركة بيعمل كود دعوة، والشخص بيسجّل فيه وبينضم لنفس الشركة (مش صاحب)
create table if not exists public.company_invites (
  code        text primary key check (code ~ '^[A-Z2-9]{8}$'),
  company_id  uuid not null references public.companies(id) on delete cascade,
  created_by  uuid references auth.users(id) on delete set null,
  uses        int  not null default 0,
  max_uses    int  not null default 5 check (max_uses between 1 and 20),
  expires_at  timestamptz not null default now() + interval '7 days',
  created_at  timestamptz not null default now()
);
create index if not exists company_invites_company_idx on public.company_invites(company_id, created_at desc);
alter table public.company_invites enable row level security;
revoke all on public.company_invites from anon, authenticated;

create or replace function public._is_owner()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.members where user_id = auth.uid() and role = 'owner')
$$;

-- صاحب الشركة بس: كود 8 حروف (بدون 0 و O و 1 و I عشان ما ينغلط فيهم)، صالح 7 أيام ولـ 5 أشخاص
create or replace function public.create_invite()
returns json language plpgsql security definer set search_path = public as $$
declare cid uuid := public.my_company(); abc text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; c text; b bytea; i int;
begin
  if cid is null or not public._is_owner() then raise exception 'only owner'; end if;
  if (select count(*) from public.company_invites where company_id = cid and created_at > now() - interval '1 day') >= 20 then raise exception 'too many invites'; end if;
  loop
    b := gen_random_bytes(8); c := '';
    for i in 0..7 loop c := c || substr(abc, (get_byte(b, i) % 32) + 1, 1); end loop;
    exit when not exists (select 1 from public.company_invites where code = c);
  end loop;
  insert into public.company_invites(code, company_id, created_by) values (c, cid, auth.uid());
  return json_build_object('code', c, 'expires_at', now() + interval '7 days', 'max_uses', 5);
end $$;

-- أي حساب جديد ما إله شركة بيقدر ينضم بالكود
create or replace function public.join_company(p_code text)
returns uuid language plpgsql security definer set search_path = public as $$
declare inv public.company_invites; v text := upper(regexp_replace(coalesce(p_code,''), '[^A-Za-z0-9]', '', 'g'));
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if exists (select 1 from public.members where user_id = auth.uid()) then raise exception 'already in a company'; end if;
  select * into inv from public.company_invites where code = v for update;
  if inv.code is null or inv.expires_at < now() or inv.uses >= inv.max_uses then raise exception 'invalid invite'; end if;
  insert into public.members(user_id, company_id, role) values (auth.uid(), inv.company_id, 'member');
  update public.company_invites set uses = uses + 1 where code = v;
  return inv.company_id;
end $$;

-- صاحب الشركة بيشوف مين معه، وبيقدر يشيل أي شخص (مش حاله)
create or replace function public.company_members()
returns json language plpgsql stable security definer set search_path = public, auth as $$
begin
  if not public._is_owner() then raise exception 'only owner'; end if;
  return (select coalesce(json_agg(x order by x.role desc, x.created_at), '[]'::json) from (
    select m.user_id, m.role, m.created_at, u.email, u.last_sign_in_at
    from public.members m join auth.users u on u.id = m.user_id where m.company_id = public.my_company()) x);
end $$;
create or replace function public.remove_member(p_user uuid)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not public._is_owner() then raise exception 'only owner'; end if;
  delete from public.members where user_id = p_user and company_id = public.my_company() and role = 'member';
  return found;
end $$;
revoke all on function public._is_owner()          from public, anon;
revoke all on function public.create_invite()      from public, anon;
revoke all on function public.join_company(text)   from public, anon;
revoke all on function public.company_members()    from public, anon;
revoke all on function public.remove_member(uuid)  from public, anon;
grant execute on function public._is_owner()         to authenticated;
grant execute on function public.create_invite()     to authenticated;
grant execute on function public.join_company(text)  to authenticated;
grant execute on function public.company_members()   to authenticated;
grant execute on function public.remove_member(uuid) to authenticated;

-- الإحصائيات بلوحة الأدمن: كم شركة بتستعمل الميزات الجديدة (أعداد بس، بدون أرقام مالية)
create or replace function public.admin_feature_stats()
returns json language plpgsql stable security definer set search_path = public, storage as $$
begin
  if not public.is_platform_admin() then raise exception 'forbidden'; end if;
  return json_build_object(
    'team_members',    (select count(*) from public.members where role = 'member'),
    'invites_used',    (select coalesce(sum(uses),0) from public.company_invites),
    'driver_companies',(select count(distinct company_id) from public.records where col = 'units' and data->>'kind' = 'driver'),
    'trips',           (select count(*) from public.records where col = 'income' and (data->>'trip')::boolean is true),
    'files',           (select count(*) from storage.objects where bucket_id = 'files'),
    'files_mb',        (select round(coalesce(sum((metadata->>'size')::bigint),0) / 1048576.0, 1) from storage.objects where bucket_id = 'files')
  );
end $$;
revoke all on function public.admin_feature_stats() from public, anon;
grant execute on function public.admin_feature_stats() to authenticated;
