-- =====================================================================
-- دفتر v9: المخزون، المحاسبة العامة، الإجازات، صلاحيات الفريق، سجل النشاط (آمن تشغيله أكثر من مرة)
-- =====================================================================

-- 1) أنواع السجلات الجديدة
alter table public.records drop constraint if exists records_col_check;
alter table public.records add constraint records_col_check
  check (col in ('units','staff','attendance','payments','expenses','income','shifts',
                 'parties','items','invoices','vouchers','cheques',
                 'stores','stockmoves','journals','accounts','leaves'));

-- 2) أدوار الفريق: صاحب، عضو (كل شي)، مدير، محاسب، كاشير، مشاهدة
alter table public.members drop constraint if exists members_role_check;
alter table public.members add constraint members_role_check check (role in ('owner','member','manager','accountant','cashier','viewer'));

create or replace function public.my_role()
returns text language sql stable security definer set search_path = public as $$
  select role from public.members where user_id = auth.uid()
$$;
create or replace function public.can_write(p_col text)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('owner','member','manager','accountant')
                       or (role = 'cashier' and p_col in ('invoices','vouchers','parties','items','cheques'))
                   from public.members where user_id = auth.uid()), false)
$$;
create or replace function public.can_delete()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('owner','member','manager','accountant') from public.members where user_id = auth.uid()), false)
$$;
revoke all on function public.my_role()        from public, anon;
revoke all on function public.can_write(text)  from public, anon;
revoke all on function public.can_delete()     from public, anon;
grant execute on function public.my_role()       to authenticated;
grant execute on function public.can_write(text) to authenticated;
grant execute on function public.can_delete()    to authenticated;

drop policy if exists records_insert on public.records;
drop policy if exists records_update on public.records;
drop policy if exists records_delete on public.records;
create policy records_insert on public.records for insert to authenticated
  with check (company_id = public.my_company() and public.can_write(col));
create policy records_update on public.records for update to authenticated
  using (company_id = public.my_company() and public.can_write(col))
  with check (company_id = public.my_company() and public.can_write(col));
create policy records_delete on public.records for delete to authenticated
  using (company_id = public.my_company() and public.can_delete());

-- صاحب الشركة بيغيّر دور أي حدا معه (مش حاله)
create or replace function public.set_member_role(p_user uuid, p_role text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not public._is_owner() then raise exception 'only owner'; end if;
  if p_role not in ('manager','accountant','cashier','viewer') then raise exception 'bad role'; end if;
  update public.members set role = p_role where user_id = p_user and company_id = public.my_company() and role <> 'owner';
  return found;
end $$;
create or replace function public.remove_member(p_user uuid)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not public._is_owner() then raise exception 'only owner'; end if;
  delete from public.members where user_id = p_user and company_id = public.my_company() and role <> 'owner';
  return found;
end $$;
revoke all on function public.set_member_role(uuid, text) from public, anon;
grant execute on function public.set_member_role(uuid, text) to authenticated;

-- 3) سجل النشاط: مين أضاف أو عدّل أو حذف شو ومتى (بدون نسخ البيانات نفسها)
create table if not exists public.record_activity (
  id         bigserial primary key,
  company_id uuid not null references public.companies(id) on delete cascade,
  user_id    uuid,
  col        text not null,
  rec_id     text not null,
  op         text not null,
  at         timestamptz not null default now()
);
create index if not exists record_activity_company_idx on public.record_activity(company_id, at desc);
alter table public.record_activity enable row level security;
revoke all on public.record_activity from anon, authenticated;

create or replace function public.records_activity()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'DELETE' then
    insert into public.record_activity(company_id, user_id, col, rec_id, op) values (old.company_id, auth.uid(), old.col, old.id, tg_op);
    return old;
  end if;
  insert into public.record_activity(company_id, user_id, col, rec_id, op) values (new.company_id, auth.uid(), new.col, new.id, tg_op);
  return new;
end $$;
drop trigger if exists records_activity_trg on public.records;
create trigger records_activity_trg after insert or update or delete on public.records for each row execute function public.records_activity();

create or replace function public.company_activity(p_limit int default 200)
returns json language plpgsql stable security definer set search_path = public, auth as $$
begin
  if not public._is_owner() then raise exception 'only owner'; end if;
  return (select coalesce(json_agg(x order by x.at desc), '[]'::json) from (
    select a.at, a.op, a.col, a.rec_id, u.email from public.record_activity a left join auth.users u on u.id = a.user_id
     where a.company_id = public.my_company() order by a.at desc limit least(greatest(p_limit,1),500)) x);
end $$;
revoke all on function public.company_activity(int) from public, anon;
grant execute on function public.company_activity(int) to authenticated;
