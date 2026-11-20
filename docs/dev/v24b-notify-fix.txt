-- =====================================================================
-- دفتر v24b: تصليح الإشعارات بعد v24 (آمن تشغيله أكثر من مرة)
--   - إذا الإشعارات القديمة (v15) شغّالة: رد الدعم بيوصل منها، فبنشيل النسخة المكررة من v24
--   - إذا في جدول قديم بيبعت الملخص اليومي: بنشيل جدول v24 عشان ما يوصل مرتين
--   - الترحيب ما بيروح لأجهزة الإدارة
-- =====================================================================

-- 1) رد الدعم: لا تكرار
do $$ begin
  if exists (select 1 from pg_proc where proname = '_push_claim') then
    drop trigger if exists push_ticket_trg on public.support_tickets;
    raise notice 'reply alerts: the old queue (v15) handles them, v24 copy removed';
  end if;
end $$;

-- 2) الملخص اليومي: جدول واحد بس
do $$ declare n int; begin
  select count(*) into n from cron.job
   where command ilike '%digest%' and jobname not in ('daftar-push-morning', 'daftar-push-evening');
  if n > 0 then
    perform cron.unschedule(jobname) from cron.job where jobname in ('daftar-push-morning', 'daftar-push-evening');
    raise notice 'daily digest: an older schedule exists (% jobs), v24 schedule removed', n;
  end if;
end $$;

-- 3) الترحيب: للزباين بس، مش لأجهزة الإدارة
create or replace function public._push_welcome_trg()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if coalesce((to_jsonb(new)->>'admin')::boolean, false) then return new; end if;
  if not exists (select 1 from public.push_welcome where user_id = new.user_id) then
    insert into public.push_welcome(user_id) values (new.user_id) on conflict do nothing;
    perform public._push_call(jsonb_build_object('mode', 'welcome', 'user', new.user_id));
  end if;
  return new;
end $$;
revoke all on function public._push_welcome_trg() from public, anon, authenticated;

-- شو الجداول اللي شغّالة هلأ (للتأكد)
select jobname, schedule, left(command, 90) as command from cron.job order by jobname;
