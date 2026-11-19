-- =====================================================================
-- دفتر v24: الإشعارات بتشتغل لحالها
--   1) إشعار ترحيب أول ما الشخص يفعّل الإشعارات (أول مرة بس)
--   2) إشعار لما فريق الدعم يرد على رسالته
--   3) كل يوم: الصبح (شو مستحق اليوم) والمسا (ملخص اليوم، أو تذكير إذا ما سجّل إشي)
-- آمن تشغيله أكثر من مرة. ما بيلمس أي بيانات موجودة.
-- =====================================================================

create extension if not exists pg_net;
create extension if not exists pg_cron;

-- إعدادات داخلية: ما حدا بيقدر يقرأها من التطبيق (بس السيرفر)
create table if not exists public.app_cfg (k text primary key, v text not null);
alter table public.app_cfg enable row level security;
revoke all on public.app_cfg from anon, authenticated;
insert into public.app_cfg(k, v) values ('cron_secret', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '')) on conflict (k) do nothing;
insert into public.app_cfg(k, v) values ('push_url', 'https://ujqrkwqvwsygjeqvwiqm.supabase.co/functions/v1/push') on conflict (k) do nothing;
insert into public.app_cfg(k, v) values ('anon_key', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqcXJrd3F2d3N5Z2plcXZ3aXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4MTQzNDYsImV4cCI6MjEwNzM5MDM0Nn0.54y3JG9iCgi-zTdyQDEcldlPo5rojolvWuD3HRmU2f4') on conflict (k) do update set v = excluded.v;

-- مين وصله إشعار الترحيب
create table if not exists public.push_welcome (user_id uuid primary key references auth.users(id) on delete cascade, at timestamptz not null default now());
alter table public.push_welcome enable row level security;
revoke all on public.push_welcome from anon, authenticated;

-- بيبعت طلب للـ Edge Function "push" من قاعدة البيانات نفسها (بدون ما ينتظر)
create or replace function public._push_call(p_body jsonb)
returns void language plpgsql security definer set search_path = public as $$
declare v_url text; v_sec text; v_key text;
begin
  select c.v into v_url from public.app_cfg c where c.k = 'push_url';
  select c.v into v_sec from public.app_cfg c where c.k = 'cron_secret';
  select c.v into v_key from public.app_cfg c where c.k = 'anon_key';
  if v_url is null or v_sec is null then return; end if;
  perform net.http_post(url := v_url, body := p_body,
    headers := jsonb_build_object('content-type', 'application/json', 'x-cron-secret', v_sec, 'authorization', 'Bearer ' || coalesce(v_key, ''), 'apikey', coalesce(v_key, '')),
    timeout_milliseconds := 20000);
exception when others then
  raise warning 'push call failed: %', sqlerrm;   -- الإشعار ما بيوقّف أي عملية
end $$;
revoke all on function public._push_call(jsonb) from public, anon, authenticated;

-- 1) الترحيب: أول اشتراك لهالشخص
create or replace function public._push_welcome_trg()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.push_welcome where user_id = new.user_id) then
    insert into public.push_welcome(user_id) values (new.user_id) on conflict do nothing;
    perform public._push_call(jsonb_build_object('mode', 'welcome', 'user', new.user_id));
  end if;
  return new;
end $$;
drop trigger if exists push_welcome_trg on public.push_subs;
create trigger push_welcome_trg after insert on public.push_subs for each row execute function public._push_welcome_trg();
revoke all on function public._push_welcome_trg() from public, anon, authenticated;

-- اللي فعّلوا الإشعارات قبل هالتحديث: ما بنرحّب فيهم مرة ثانية
insert into public.push_welcome(user_id) select distinct user_id from public.push_subs on conflict do nothing;

-- 2) رد الدعم: كل ما ينضاف رد من فريق الدعم على تذكرة لشخص مسجّل
create or replace function public._push_ticket_trg()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.user_id is not null
     and jsonb_array_length(new.messages) > jsonb_array_length(coalesce(old.messages, '[]'::jsonb))
     and (new.messages -> (jsonb_array_length(new.messages) - 1) ->> 'role') = 'support' then
    perform public._push_call(jsonb_build_object('mode', 'ticket', 'id', new.id));
  end if;
  return new;
end $$;
drop trigger if exists push_ticket_trg on public.support_tickets;
create trigger push_ticket_trg after update of messages on public.support_tickets for each row execute function public._push_ticket_trg();
revoke all on function public._push_ticket_trg() from public, anon, authenticated;

-- 3) كل يوم بتوقيت عمّان (UTC+3): الصبح 8:30 والمسا 8:30
select cron.unschedule(jobname) from cron.job where jobname in ('daftar-push-morning', 'daftar-push-evening');
select cron.schedule('daftar-push-morning', '30 5 * * *', $$select public._push_call('{"mode":"digest","slot":"morning"}'::jsonb)$$);
select cron.schedule('daftar-push-evening', '30 17 * * *', $$select public._push_call('{"mode":"digest","slot":"evening"}'::jsonb)$$);

notify pgrst, 'reload schema';
select 'v24 تمام' as done;
