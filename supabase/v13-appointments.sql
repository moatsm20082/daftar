-- =====================================================================
-- دفتر v13: المواعيد (نوع سجل جديد)، والكاشير/الاستقبال بيقدر يحجز مواعيد
-- (آمن تشغيله أكثر من مرة)
-- =====================================================================
alter table public.records drop constraint if exists records_col_check;
alter table public.records add constraint records_col_check
  check (col in ('units','staff','attendance','payments','expenses','income','shifts',
                 'parties','items','invoices','vouchers','cheques',
                 'stores','stockmoves','journals','accounts','leaves','recurring','appointments'));

create or replace function public.can_write(p_col text)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role in ('owner','member','manager','accountant')
                       or (role = 'cashier' and p_col in ('invoices','vouchers','parties','items','cheques','appointments'))
                   from public.members where user_id = auth.uid()), false)
$$;
revoke all on function public.can_write(text) from public, anon;
grant execute on function public.can_write(text) to authenticated;
