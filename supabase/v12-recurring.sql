-- =====================================================================
-- دفتر v12: نوع سجل جديد «recurring» للمصاريف والفواتير المتكررة كل شهر
-- (آمن تشغيله أكثر من مرة)
-- =====================================================================
alter table public.records drop constraint if exists records_col_check;
alter table public.records add constraint records_col_check
  check (col in ('units','staff','attendance','payments','expenses','income','shifts',
                 'parties','items','invoices','vouchers','cheques',
                 'stores','stockmoves','journals','accounts','leaves','recurring'));
