-- =====================================================================
-- دفتر v19: تحدّي الدعوات «ادعِ صاحبك واربح»
-- آمن تشغيله أكثر من مرة. ما بيحذف ولا بيغيّر أي بيانات موجودة (بيضيف عمودين بس).
-- - كل شركة إلها كود دعوة (6 حروف وأرقام).
-- - الشركة الجديدة بتنحسب لصاحب الكود (من الرابط، أو بتكتب الكود خلال أول 14 يوم).
-- - الدعوة «محسوبة» بس إذا الشركة الجديدة أكّدت إيميلها وسجّلت 3 حركات على الأقل.
-- =====================================================================

alter table public.companies add column if not exists ref_code text;
alter table public.companies add column if not exists referred_by uuid references public.companies(id) on delete set null;

create or replace function public._gen_ref_code()
returns text language plpgsql set search_path = public as $$
declare c text; abc text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
begin
  loop
    c := '';
    for i in 1..6 loop c := c || substr(abc, 1 + floor(random() * length(abc))::int, 1); end loop;
    exit when not exists (select 1 from public.companies where ref_code = c);
  end loop;
  return c;
end $$;
revoke all on function public._gen_ref_code() from public, anon, authenticated;

-- كود لكل شركة موجودة (وحدة وحدة عشان ما يتكرر)
do $$ declare r record; begin
  for r in select id from public.companies where ref_code is null loop
    update public.companies set ref_code = public._gen_ref_code() where id = r.id;
  end loop;
end $$;
create unique index if not exists companies_ref_code_key on public.companies(ref_code);
create index if not exists companies_referred_by_idx on public.companies(referred_by) where referred_by is not null;

-- الكود ومين دلّك ما بيتغيّروا من التطبيق مباشرة، بس من خلال الدوال تحت
create or replace function public.companies_ref_guard()
returns trigger language plpgsql set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    new.referred_by := null;
    if new.ref_code is null then new.ref_code := public._gen_ref_code(); end if;
    return new;
  end if;
  if current_user in ('authenticated','anon') then
    new.ref_code := old.ref_code;
    new.referred_by := old.referred_by;
  end if;
  return new;
end $$;
drop trigger if exists companies_ref_guard_trg on public.companies;
create trigger companies_ref_guard_trg before insert or update on public.companies for each row execute function public.companies_ref_guard();
revoke all on function public.companies_ref_guard() from public, anon, authenticated;

-- مدة التحدي والجوائز (بتتغيّر من هون بس)
create table if not exists public.invite_contest (
  id        int primary key default 1 check (id = 1),
  starts_at timestamptz not null,
  ends_at   timestamptz not null,
  prize1    text,
  prize2    text
);
alter table public.invite_contest enable row level security;
revoke all on public.invite_contest from anon, authenticated;
insert into public.invite_contest(id, starts_at, ends_at, prize1, prize2)
values (1, '2026-11-15 00:00+03', '2026-12-01 00:00+03', 'موقع إلكتروني لشغلك مجاناً', '100 دينار')
on conflict (id) do nothing;

-- الدعوة محسوبة؟ (إيميل مأكّد + 3 حركات على الأقل غير الفروع)
create or replace function public._ref_valid(p_company uuid)
returns boolean language sql stable security definer set search_path = public, auth as $$
  select exists (select 1 from public.members m join auth.users u on u.id = m.user_id
                  where m.company_id = p_company and u.email_confirmed_at is not null)
     and (select count(*) from public.records r where r.company_id = p_company and r.col <> 'units') >= 3
$$;
revoke all on function public._ref_valid(uuid) from public, anon, authenticated;

-- شو بيشوف المستخدم: كوده، كم دعا، كم محسوب، ترتيبه، ومين دلّه
create or replace function public.my_invite()
returns json language plpgsql volatile security definer set search_path = public, auth as $$
declare cid uuid; me public.companies; k public.invite_contest; inv int := 0; val int := 0; rk int; parts int := 0; ref_name text;
begin
  select company_id into cid from public.members where user_id = auth.uid();
  if cid is null then return null; end if;
  select * into me from public.companies where id = cid;
  select * into k from public.invite_contest where id = 1;
  if me.ref_code is null then
    update public.companies set ref_code = public._gen_ref_code() where id = cid returning * into me;
  end if;
  select name into ref_name from public.companies where id = me.referred_by;
  if k.id is not null then
    with s as (
      select c.referred_by as rid, count(*) as n, count(*) filter (where public._ref_valid(c.id)) as v
        from public.companies c
       where c.referred_by is not null and c.created_at >= k.starts_at and c.created_at < k.ends_at
       group by c.referred_by)
    select coalesce(max(n) filter (where rid = cid), 0), coalesce(max(v) filter (where rid = cid), 0), count(*) filter (where v > 0)
      into inv, val, parts from s;
    if val > 0 then
      with s as (
        select c.referred_by as rid, count(*) filter (where public._ref_valid(c.id)) as v
          from public.companies c
         where c.referred_by is not null and c.created_at >= k.starts_at and c.created_at < k.ends_at
         group by c.referred_by)
      select 1 + count(*) into rk from s where v > val;
    end if;
  end if;
  return json_build_object(
    'code', me.ref_code, 'invited', inv, 'valid', val, 'rank', rk, 'participants', parts,
    'referrer', ref_name,
    'can_claim', me.referred_by is null and me.created_at > now() - interval '14 days',
    'starts', k.starts_at, 'ends', k.ends_at, 'prize1', k.prize1, 'prize2', k.prize2,
    'active', k.id is not null and now() >= k.starts_at and now() < k.ends_at);
end $$;

-- المستخدم الجديد بيكتب كود صاحبه (مرة وحدة، خلال أول 14 يوم)
create or replace function public.claim_referrer(p_code text)
returns json language plpgsql security definer set search_path = public as $$
declare cid uuid; me public.companies; r public.companies; c text := upper(regexp_replace(coalesce(p_code,''), '[^A-Za-z0-9]', '', 'g'));
begin
  select company_id into cid from public.members where user_id = auth.uid();
  if cid is null then return json_build_object('ok', false, 'err', 'no_company'); end if;
  select * into me from public.companies where id = cid;
  if me.referred_by is not null then return json_build_object('ok', false, 'err', 'already'); end if;
  if me.created_at < now() - interval '14 days' then return json_build_object('ok', false, 'err', 'too_late'); end if;
  if char_length(c) <> 6 then return json_build_object('ok', false, 'err', 'not_found'); end if;
  select * into r from public.companies where ref_code = c;
  if r.id is null or r.created_at >= me.created_at then return json_build_object('ok', false, 'err', 'not_found'); end if;
  if r.id = cid or r.referred_by = cid then return json_build_object('ok', false, 'err', 'self'); end if;
  update public.companies set referred_by = r.id where id = cid;
  return json_build_object('ok', true, 'name', r.name);
end $$;

-- للإدارة: لوحة المتصدّرين ومين دعوا
create or replace function public.admin_invite_board()
returns json language plpgsql stable security definer set search_path = public, auth as $$
declare k public.invite_contest;
begin
  if not public.is_platform_admin() then raise exception 'forbidden'; end if;
  select * into k from public.invite_contest where id = 1;
  return json_build_object(
    'starts', k.starts_at, 'ends', k.ends_at, 'prize1', k.prize1, 'prize2', k.prize2,
    'board', coalesce((
      select json_agg(x order by x.valid desc, x.invited desc) from (
        select p.id, p.name, p.ref_code,
               (select u.email from public.members m join auth.users u on u.id = m.user_id
                 where m.company_id = p.id order by (m.role = 'owner') desc limit 1) as email,
               count(c.id) as invited,
               count(c.id) filter (where public._ref_valid(c.id)) as valid,
               json_agg(json_build_object('name', c.name, 'at', c.created_at, 'valid', public._ref_valid(c.id)) order by c.created_at) as invitees
          from public.companies c join public.companies p on p.id = c.referred_by
         where c.created_at >= k.starts_at and c.created_at < k.ends_at
         group by p.id, p.name, p.ref_code
         order by 5 desc, 4 desc
         limit 50) x), '[]'::json));
end $$;

revoke all on function public.my_invite() from public, anon;
revoke all on function public.claim_referrer(text) from public, anon;
revoke all on function public.admin_invite_board() from public, anon;
grant execute on function public.my_invite() to authenticated;
grant execute on function public.claim_referrer(text) to authenticated;
grant execute on function public.admin_invite_board() to authenticated;
notify pgrst, 'reload schema';

select 'v19 تمام' as done;
