-- =====================================================================
-- دفتر v20: «احكي مع دفتر» (المساعد الصوتي)
-- آمن تشغيله أكثر من مرة. ما بيلمس أي بيانات موجودة.
-- حد يومي لكل شركة عشان التكلفة ما تفلت: 30 أمر و 40 رد صوتي باليوم.
-- =====================================================================

create table if not exists public.voice_usage (
  company_id uuid not null references public.companies(id) on delete cascade,
  day        date not null,
  kind       text not null check (kind in ('ask','tts')),
  n          int  not null default 0,
  primary key (company_id, day, kind)
);
alter table public.voice_usage enable row level security;
revoke all on public.voice_usage from anon, authenticated;

-- بيحجز استعمال واحد (أو بيرفض إذا خلص الحد اليوم)
create or replace function public.voice_take(p_kind text default 'ask')
returns json language plpgsql security definer set search_path = public as $$
declare cid uuid; d date := (now() at time zone 'Asia/Amman')::date; lim int; used int;
begin
  if p_kind not in ('ask','tts') then return json_build_object('ok', false, 'err', 'bad'); end if;
  select company_id into cid from public.members where user_id = auth.uid();
  if cid is null then return json_build_object('ok', false, 'err', 'no_company'); end if;
  lim := case p_kind when 'ask' then 30 else 40 end;
  insert into public.voice_usage(company_id, day, kind, n) values (cid, d, p_kind, 0)
  on conflict (company_id, day, kind) do nothing;
  update public.voice_usage set n = n + 1
   where company_id = cid and day = d and kind = p_kind and n < lim
  returning n into used;
  if used is null then return json_build_object('ok', false, 'err', 'limit', 'left', 0); end if;
  delete from public.voice_usage where day < d - 60;   -- ما بنحتفظ بأكثر من شهرين
  return json_build_object('ok', true, 'left', lim - used);
end $$;
revoke all on function public.voice_take(text) from public, anon;
grant execute on function public.voice_take(text) to authenticated;
notify pgrst, 'reload schema';

select 'v20 تمام' as done;
