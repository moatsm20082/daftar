-- =====================================================================
-- دفتر v11: تشديد إضافي (آمن تشغيله أكثر من مرة)
-- =====================================================================

-- 1) بيانات الشركة: اسم ورقم وإعدادات بحجم معقول دايماً (حتى لو حدا تجاوز التطبيق)
create or replace function public.companies_guard()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.name is null or char_length(trim(new.name)) < 2 or char_length(new.name) > 80 then raise exception 'bad company name'; end if;
  if new.phone is not null and char_length(new.phone) > 30 then raise exception 'bad phone'; end if;
  if new.settings is null or jsonb_typeof(new.settings) <> 'object' then new.settings := '{}'::jsonb; end if;
  if pg_column_size(new.settings) > 8000 then raise exception 'settings too large'; end if;
  return new;
end $$;
drop trigger if exists companies_guard_trg on public.companies;
create trigger companies_guard_trg before insert or update on public.companies for each row execute function public.companies_guard();

-- 2) دوال التريغر ما إلها داعي تنادى من برّا
revoke all on function public.records_guard()    from public, anon, authenticated;
revoke all on function public.records_activity() from public, anon, authenticated;
revoke all on function public.members_guard()    from public, anon, authenticated;
revoke all on function public.companies_guard()  from public, anon, authenticated;

-- 3) سجل النشاط وسجل الإشعارات ما بيكبروا للأبد: بنخلي آخر 180 يوم
create or replace function public.trim_logs()
returns void language sql security definer set search_path = public as $$
  delete from public.record_activity where at < now() - interval '180 days';
  delete from public.push_log where at < now() - interval '365 days';
$$;
revoke all on function public.trim_logs() from public, anon, authenticated;
-- (بحاجة pg_cron) تنظيف أسبوعي ليلة الأحد
create extension if not exists pg_cron;
select cron.unschedule(jobname) from cron.job where jobname = 'daftar-trim-logs';
select cron.schedule('daftar-trim-logs', '30 2 * * 0', 'select public.trim_logs()');
