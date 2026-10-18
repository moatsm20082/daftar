-- دفتر v8: المبيعات والمشتريات (آمن تشغيله أكثر من مرة)
-- بيضيف أنواع سجلات جديدة: العملاء والموردين، الأصناف، الفواتير، سندات القبض والصرف، الشيكات
alter table public.records drop constraint if exists records_col_check;
alter table public.records add constraint records_col_check
  check (col in ('units','staff','attendance','payments','expenses','income','shifts',
                 'parties','items','invoices','vouchers','cheques'));
