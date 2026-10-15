"use strict";
/* =====================================================================
   Daftar v3 — work ledger for any business.
   Staff, attendance, payroll, expenses, income, profit, recurring dues,
   AI support with human handoff. Arabic + English. Supabase backend.
   ===================================================================== */
const C = window.APP_CONFIG || {};

const L = {
  appName:[C.APP_NAME_AR||"دفتر", C.APP_NAME_EN||"Daftar"],
  f1:["الفريق والدوام والإضافي","Team, attendance & overtime"], f2:["رواتب يومية وأسبوعية وشهرية مع السلف","Daily, weekly & monthly payroll with advances"],
  f3:["المصاريف والدخل لكل مشروع وفرع","Expenses & income per project or branch"], f4:["الربح والخسارة بلحظتها","Live profit & loss"], f5:["مساعد ذكي بيحل مشاكلك فوراً","An AI assistant that fixes things for you"], tagline:["إدارة شغل شركتك، بمكان واحد","Run your business from one place"],
  loading:["جارٍ الفتح…","Loading…"], loadingBook:["جارٍ تحميل البيانات…","Loading your data…"], otherLang:["English","العربية"],
  showPw:["إظهار","Show"], hidePw:["إخفاء","Hide"], agree:["بإنشاء الحساب بتوافق على","By creating an account you agree to the"], privacy:["سياسة الخصوصية","Privacy policy"],
  haveAccountQ:["عندك حساب؟","Have an account?"], noAccountQ:["جديد على دفتر؟","New to Daftar?"], signupShort:["سجّل شركتك مجاناً","Create a free account"],
  checkMail:["تفقّد إيميلك","Check your email"], checkMailSub:["بعتنا رابط على {e}. افتحه من نفس الجهاز.","We sent a link to {e}. Open it on this device."],
  tip1:["الإيميل بيوصل عادةً خلال دقيقة أو دقيقتين.","It usually arrives within a minute or two."], tip2:["إذا ما لقيته، تفقّد مجلد الـ Spam أو Promotions.","Not there? Check Spam or Promotions."], tip3:["الرابط بيشتغل مرة وحدة، ولمدة ساعة.","The link works once, for one hour."],
  resend:["ابعته كمان مرة","Send it again"], resent:["انبعت من جديد","Sent again"],
  obTitle:["شو مجال شغلك؟","What kind of business is it?"], obSub:["بنرتّبلك الكلمات والتصنيفات حسب شغلك. بتقدر تغيّره بعدين.","We'll tailor the words and categories to your work. You can change this later."], obGo:["يلا نبلش","Let's start"],
  obStart:["٣ خطوات وبتبلش","Three steps to get going"], obStartSub:["بتاخد أقل من دقيقتين.","Takes less than two minutes."],
  ob1:["افتح أول {unit}","Create your first {unit}"], ob2:["ضيف ال{staffs}","Add your {staffs}"], ob3:["سجّل أول دوام أو مصروف","Record your first attendance or expense"], doIt:["يلا","Start"],
  tabToday:["اليوم","Today"], export:["تصدير Excel","Export to Excel"], exportAll:["تصدير كل الفلوس (Excel)","Export all money (Excel)"], exportPayroll:["تصدير الرواتب (Excel)","Export payroll (Excel)"], exported:["انحفظ الملف","File saved"],
  searchPh:["ابحث بالاسم أو النوع أو المبلغ…","Search by name, category or amount…"], waStatement:["ابعت الكشف واتساب","Send statement on WhatsApp"],
  waHead:["كشف حساب: {x}","Statement: {x}"], waDays:["داوم {n} {days} × {r}","{n} {days} × {r}"], colDesc:["الوصف","Description"], colAmount:["المبلغ","Amount"], printReport:["طباعة / PDF","Print / PDF"],
  delAcct:["حذف حساب الشركة","Delete business account"], delForever:["احذف نهائياً","Delete forever"], delWarn:["رح تنحذف كل بيانات الشركة: المجلدات والفريق والفلوس والمحادثات. ما في رجعة.","All of this business's data will be deleted: folders, team, money and conversations. This can't be undone."],
  delType:["للتأكيد اكتب اسم الشركة: {x}","To confirm, type the business name: {x}"], delMismatch:["الاسم مش مطابق.","The name doesn't match."], delDone:["انحذف الحساب.","Account deleted."],
  staffPhone:["رقم تلفونه (للواتساب)","Phone (for WhatsApp)"], colType:["النوع","Type"], colWhat:["على شو / مين","Category / person"], colDays:["أيام الدوام","Days worked"], colAbsent:["أيام الغياب","Days absent"], colBase:["الأساسي","Base"], colOt:["الإضافي","Overtime"],
  // nav
  navHome:["الرئيسية","Home"], navUnits:["ال{units}","{Units}"], navTeam:["الفريق","Team"], navMoney:["الفلوس","Money"], navSupport:["الدعم","Support"],
  // auth
  login:["تسجيل الدخول","Sign in"], loginSub:["أهلاً فيك من جديد","Welcome back"],
  email:["الإيميل","Email"], password:["كلمة السر","Password"], enter:["دخول","Sign in"],
  forgotQ:["نسيت كلمة السر؟","Forgot your password?"], noAccount:["ما عندك حساب؟ سجّل شركتك مجاناً","No account? Register your business free"],
  signup:["سجّل شركتك","Register your business"], signupSub:["مجاناً، وبياناتك ما حدا بيشوفها غيرك.","Free. Your data is visible only to you."],
  companyName:["اسم الشركة","Business name"], bizType:["شو مجال شغلك؟","What's your line of business?"], currency:["العملة","Currency"],
  phoneCo:["رقم التلفون","Phone number"], pw8:["كلمة السر (٨ أحرف أو أكثر)","Password (8+ characters)"], pwAgain:["أعد كلمة السر","Repeat password"],
  create:["إنشاء الحساب","Create account"], haveAccount:["عندك حساب؟ سجّل دخول","Have an account? Sign in"],
  forgot:["نسيت كلمة السر","Forgot password"], forgotSub:["اكتب إيميل الشركة وبنبعتلك رابط تحط فيه كلمة سر جديدة.","Enter your email and we'll send you a link to set a new password."],
  sendLink:["ابعتلي الرابط","Send me the link"], backLogin:["رجوع لتسجيل الدخول","Back to sign in"],
  newPw:["كلمة سر جديدة","New password"], newPwSub:["اختار كلمة سر جديدة لحساب شركتك.","Choose a new password for your account."], savePw:["احفظ كلمة السر","Save password"],
  lastStep:["آخر خطوة: اسم شركتك ومجال شغلها.","Last step: your business name and type."], cont:["كمّل","Continue"], logout:["تسجيل خروج","Sign out"],
  helpLogin:["محتاج مساعدة؟","Need help?"],
  eFill:["اكتب الإيميل وكلمة السر.","Enter your email and password."], eName:["اكتب اسم الشركة.","Enter your business name."], eEmail:["الإيميل مش صحيح.","That email doesn't look right."],
  ePw8:["كلمة السر لازم تكون ٨ أحرف أو أكثر.","Password must be at least 8 characters."], ePwMatch:["كلمتين السر مش متطابقات.","Passwords don't match."],
  eBadLogin:["الإيميل أو كلمة السر غلط.","Wrong email or password."], eConfirm:["لازم تأكد إيميلك أول. تفقّد صندوق الوارد (وكمان الـ Spam).","Please confirm your email first. Check your inbox (and spam)."],
  eExists:["هالإيميل مسجّل من قبل. جرّب تسجيل الدخول أو \"نسيت كلمة السر\".","This email is already registered. Sign in or use \"Forgot password\"."],
  eRate:["محاولات كثير. استنى شوي وجرّب.","Too many attempts. Wait a bit and try again."], eWeak:["كلمة السر ضعيفة. استعمل ٨ أحرف أو أكثر، فيها أرقام وحروف.","Weak password. Use 8+ characters with letters and numbers."],
  eGeneric:["صار خطأ. تأكد من النت وجرّب كمان مرة.","Something went wrong. Check your connection and try again."],
  signedUp:["تم إنشاء الحساب. بعتنالك إيميل تأكيد، اضغط على الرابط اللي فيه وبعدها سجّل دخول.","Account created. We sent you a confirmation email — open the link, then sign in."],
  resetSent:["إذا الإيميل مسجّل عنا، رح يوصلك رابط تغيير كلمة السر خلال دقائق. تفقّد الـ Spam كمان.","If that email is registered, a reset link will arrive in a few minutes. Check spam too."],
  pwChanged:["تغيّرت كلمة السر.","Password changed."], eCreateCo:["ما قدرنا ننشئ الشركة. جرّب كمان مرة.","Couldn't create the business. Try again."],
  configMissing:["الإعدادات ناقصة","Setup incomplete"], configMissingSub:["حط رابط Supabase والمفتاح العام بملف config.js.","Add your Supabase URL and public key in config.js."],
  eRls:["ما عندك صلاحية على هالبيانات.","You don't have access to this data."], eLimit:["وصلت للحد الأعلى من السجلات. احكي مع الدعم.","Record limit reached. Contact support."],
  eSession:["انتهت الجلسة. سجّل دخول من جديد.","Session expired. Please sign in again."], eSave:["ما انحفظ. تأكد من النت وجرّب كمان مرة.","Not saved. Check your connection and try again."],
  eLoad:["ما قدرنا نجيب البيانات. حدّث الصفحة.","Couldn't load your data. Refresh the page."], signInFirst:["سجّل دخول أول.","Please sign in first."],
  // dashboard
  hello:["أهلاً، {x}","Hello, {x}"], thisMonth:["هالشهر","This month"], income:["الدخل","Income"], expenses:["المصاريف","Expenses"], salaries:["الرواتب","Salaries"],
  profit:["الربح","Profit"], loss:["خسارة","Loss"], last6:["الربح آخر ٦ شهور","Profit, last 6 months"], attention:["بدها انتباهك","Needs your attention"], allGood:["كل شي تمام. ما في إشي متأخر.","All good. Nothing is overdue."],
  dueMonth:["{label} هالشهر","{label} this month"], paid:["مدفوع","Paid"], late_:["متأخر","Overdue"], dueOn:["مستحق يوم {d}","Due on the {d}"], partPaid:["انقبض {a} من {b}","{a} of {b} received"],
  aOver80:["{u}: صرفت {p}% من الميزانية","{u}: {p}% of budget spent"], aOwed:["عليك {x} رواتب للفريق هال{p}","{x} in pay still owed this {p}"], aUnmarked:["{u}: ما انسجّل دوام اليوم","{u}: today's attendance not marked"],
  aClient:["{u}: باقي على {c} {x}","{u}: {c} still owes {x}"],
  activeUnits:["ال{units} الشغّالة","Active {units}"], finishedUnits:["ال{units} اللي خلصت","Finished {units}"],
  openFolder:["افتح","Open"], costSoFar:["كلّفنا لهلأ","Cost so far"], cost:["الكلفة","Cost"],
  noUnits:["ما في {units} لهلأ","No {units} yet"], noUnitsSub:["ابدأ بأول {unit}: اضغط \"+ {unit} جديد\".","Start with your first {unit}: tap \"+ New {unit}\"."], newUnit:["+ {unit} جديد","+ New {unit}"],
  // unit
  back:["رجوع","Back"], edit:["تعديل","Edit"], today:["اليوم","Today"], backToday:["رجوع لليوم","Back to today"], markWho:["سجّل مين داوم","Mark who came in"],
  prevDay:["اليوم اللي قبل","Previous day"], nextDay:["اليوم اللي بعده","Next day"],
  weekendDay:["اليوم عطلة. إذا حدا اشتغل، سجّله عادي.","Today is a day off. If someone worked, record it as usual."],
  oweToday:["عليك اليوم لل{staffs}","You owe {staffs} today"], oweDay:["علينا لل{staffs} هاليوم","Owed to {staffs} this day"],
  cameOf:["داوم {a} من {b}","{a} of {b} came in"], absentDed:["غاب {n} وانخصم يومه","{n} absent, day deducted"],
  todayMoney:["فلوس اليوم","Today's money"], dayMoney:["فلوس هاليوم","This day's money"], spent:["صرفنا","Spent"], received:["قبضنا","Received"],
  noMoneyToday:["دفعت إشي أو قبضت إشي اليوم؟ سجّله من هون.","Paid or received anything today? Record it here."],
  addExp:["+ مصروف","+ Expense"], addInc:["+ دخل","+ Income"], expense:["مصروف","Expense"], incomeOne:["دخل","Income"],
  noStaff:["ما في {staffs} هون","No {staffs} here yet"], noStaffSub:["ضيف ال{staffs} اللي شغالين هون، وكل يوم بتعلّم مين داوم.","Add the {staffs} working here, then mark attendance each day."],
  addStaff:["+ ضيف {staff}","+ Add {staff}"], allCame:["الكل داوم","Everyone came in"], allMarked:["انسجّل: الكل داوم","Saved: everyone came in"],
  came:["داوم","Came in"], absent:["غاب","Absent"], notMarked:["لسا ما انسجّل","Not marked yet"],
  fromTo:["من {a} لـ {b}","{a} – {b}"], changeTimes:["الساعات","Hours"], earnsToday:["بيستحق اليوم","Earned today"],
  absentNote:["انخصم يومه ({x})","Day deducted ({x})"], late:["تأخر {x}","Late {x}"], early:["روّح بكير {x}","Left early {x}"], ot:["إضافي {x}","Overtime {x}"],
  dailyIs:["يوميته {x}","Daily {x}"], perWeek:["بالأسبوع","/week"], perMonth:["بالشهر","/month"], perDay:["باليوم","/day"],
  addAdvance:["سلفة","Advance"], tookAdv:["سلفة {x}","Advance {x}"], tookSal:["من الراتب {x}","Paid {x}"],
  tabAccount:["الرواتب","Payroll"], tabMoney:["الفلوس","Money"], tabSummary:["الخلاصة","Summary"],
  clientIs:["{label}: {x}","{label}: {x}"],
  // payroll
  week:["أسبوع","Week"], month:["شهر","Month"], periodFromTo:["{a} – {b}","{a} – {b}"],
  earnedAll:["مجموع اللي استحقوه","Total earned"], tookAll:["انصرفلهم (سلف ودفعات)","Already paid / advanced"], leftAll:["باقي علينا","Still owed"],
  workedDays:["داوم {n} {days} × {r}","{n} {days} × {r}"], dayW:["يوم","day"], daysW:["أيام","days"],
  otLine:["وقت إضافي {x}","Overtime {x}"], paidLine:["دفعة من الراتب · {d}","Salary payment · {d}"], advLine:["سلفة · {d}","Advance · {d}"],
  leftFor:["باقي له","Still owed"], overpaid:["أخد زيادة","Overpaid"], payRest:["ادفع الباقي ({x})","Pay the rest ({x})"], settled:["انحاسب","Settled"],
  absentN:["غاب {n}","Absent {n}"], noStaffShort:["ما في {staffs} لهلأ.","No {staffs} yet."],
  // money
  allExpenses:["المصاريف","Expenses"], allIncome:["الدخل","Income"], noExpenses:["ما في مصاريف بهالفترة.","No expenses in this period."], noIncome:["ما في دخل بهالفترة.","No income in this period."],
  fAll:["الكل","All"], fExp:["مصاريف","Expenses"], fInc:["دخل","Income"], fPay:["رواتب وسلف","Pay & advances"], noTx:["ما في حركات بهالشهر.","No transactions this month."],
  net:["الصافي","Net"],
  // team
  teamSub:["كل ال{staffs} بكل ال{units}","All {staffs} across {units}"], noTeam:["ما في {staffs} لهلأ. فوت على {unit} وضيفهم من هناك.","No {staffs} yet. Open a {unit} and add them there."],
  thisPeriod:["هال{p}","This {p}"], weekW:["أسبوع","week"], monthW:["شهر","month"],
  // summary
  expMat:["المصاريف","Expenses"], labor:["رواتب ال{staffs}","{staffs} pay"], totalCost:["كلّفنا","Total cost"], totalCostSoFar:["كلّفنا لهلأ","Total cost so far"],
  incomeAll:["الدخل","Income"], netSoFar:["الربح لهلأ","Profit so far"], budgetLeft:["باقي من {b}","Left of {b}"],
  budgetWarn:["انتبه: صرفت {p}% من {b}","Heads up: {p}% of {b} spent"], budgetHint:["إذا عندك {b}، حطها من \"تعديل\".","Add the {b} via \"Edit\"."],
  clientOwes:["باقي على {c}","{c} still owes"], byCat:["المصاريف حسب النوع","Expenses by category"], closeUnit:["خلص؟ سكّر المجلد","Finished? Close this folder"], reopen:["إعادة فتح","Reopen"],
  sure:["متأكد؟ اضغط كمان مرة","Sure? Tap again"], closed:["تسكّر المجلد. الحساب محفوظ.","Folder closed. Everything is saved."],
  recurStatus:["{label}","{label}"], recurDueDay:["كل شهر يوم {d}","Every month on the {d}"],
  // sheets
  save:["حفظ","Save"], cancel:["إلغاء","Cancel"], del:["حذف","Delete"], more:["تفاصيل إضافية","More details"], close:["سكّر","Close"],
  unitName:["اسم ال{unit}","{unit} name"], where:["الموقع","Location"], openFolderBtn:["إنشاء","Create"],
  delUnit:["حذف ال{unit}","Delete {unit}"], folderOpened:["انعمل. ضيف ال{staffs}.","Created. Now add your {staffs}."], eUnitName:["اكتب الاسم.","Enter a name."],
  phoneOpt:["تلفون (مش ضروري)","Phone (optional)"], recurAmount:["المبلغ الشهري","Monthly amount"], recurDay:["يوم الاستحقاق بالشهر","Due day of month"],
  staffName:["الاسم","Name"], role:["الوظيفة (مش ضروري)","Role (optional)"], payType:["راتبه","Pay"], daily:["يومية","Daily"], weekly:["أسبوعي","Weekly"], monthly:["شهري","Monthly"], howMuch:["كم؟","Amount"],
  rateHintDay:["يوميته {x}","Daily rate {x}"], rateHintWeek:["يعني يوميته {x} (÷ {d} أيام شغل)، واللي بيغيبه بينخصم","Daily rate {x} (÷ {d} work days); absent days are deducted"],
  rateHintMonth:["يعني يوميته تقريباً {x} (÷ أيام الشغل بالشهر)، واللي بيغيبه بينخصم","About {x} per day (÷ work days in the month); absent days are deducted"], typeAmount:["اكتب المبلغ","Enter the amount"],
  moveHere:["أو انقل حدا من مكان ثاني لهون","Or move someone here from elsewhere"], otRate:["أجرة ساعة الإضافي","Overtime hourly rate"], otHint:["إذا فاضية: اليومية ÷ {h} ساعات","If empty: daily ÷ {h} hours"],
  worksAt:["شغال بـ","Works at"], removeStaff:["شيل من القائمة","Remove from list"], addStaffBtn:["ضيف","Add"], eStaffName:["اكتب الاسم.","Enter a name."], eRate:["اكتب الراتب.","Enter the pay amount."],
  added:["انضاف {x}","{x} added"], moved:["انتقل {x} لهون","{x} moved here"],
  hoursOf:["ساعات {x} · {d}","{x}'s hours · {d}"], arrived:["إمتى وصل؟","Arrived at"], left:["إمتى روّح؟","Left at"], onTime:["عالوقت","on time"],
  exactIn:["ساعة الوصول بالضبط","Exact arrival time"], exactOut:["ساعة الروحة بالضبط","Exact leaving time"], earns:["بيستحق {x}","Earns {x}"],
  advFor:["سلفة لـ {x}","Advance for {x}"], paidTo:["دفعة من الراتب لـ {x}","Salary payment to {x}"], editPayment:["تعديل دفعة {x}","Edit payment · {x}"],
  howMuchTook:["كم أخد؟","How much?"], whatIsIt:["شو هي؟","Type"], advance:["سلفة","Advance"], fromSalary:["من الراتب","Salary"], date:["التاريخ","Date"], note:["ملاحظة","Note"],
  savedPay:["انسجّل: {x}، {k} {a}","Saved: {x} — {k} {a}"], record:["سجّل","Save"],
  newExp:["مصروف جديد","New expense"], editExp:["تعديل المصروف","Edit expense"], howMuchPaid:["كم دفعت؟","How much did you pay?"], onWhat:["على شو؟","For what?"],
  desc:["وصف (مش ضروري)","Description (optional)"], shop:["المحل / المورّد","Supplier"], savedExp:["انسجّل: {c} {a}","Saved: {c} {a}"], forUnit:["على أي {unit}؟","Which {unit}?"],
  newInc:["دخل جديد","New income"], editInc:["تعديل الدخل","Edit income"], howMuchGot:["كم قبضت؟","How much did you receive?"], fromWhat:["من شو؟","Source"], savedInc:["انسجّل دخل {a}","Income saved: {a}"],
  eAmount:["اكتب المبلغ.","Enter the amount."], eUnitPick:["اختار ال{unit}.","Choose the {unit}."], whatAdd:["شو بدك تسجّل؟","What do you want to record?"],
  // account / settings
  account:["حساب الشركة","Business account"], changePw:["تغيير كلمة السر","Change password"], settings:["إعدادات الشركة","Business settings"],
  language:["اللغة","Language"], weekend:["أيام العطلة","Days off"], shiftIn:["بداية الدوام","Shift start"], shiftOut:["نهاية الدوام","Shift end"],
  payPeriod:["الحساب عادةً","Usual pay period"], settingsSaved:["انحفظت الإعدادات","Settings saved"], onlyOwner:["بس صاحب الحساب بيقدر يغيّر الإعدادات.","Only the account owner can change settings."],
  // support
  supTitle:["مساعد دفتر","Daftar Assistant"], supSub:["بيجاوبك وبيحل المشكلة فوراً","Answers and fixes things instantly"],
  supHello:["أهلاً! أنا مساعد دفتر. احكيلي شو المشكلة أو شو بدك تعمل، وأنا بساعدك أو بعمله عنك.","Hi! I'm the Daftar assistant. Tell me what's wrong or what you need, and I'll help or do it for you."],
  supHelloAnon:["أهلاً! إذا عندك مشكلة بالتسجيل أو الدخول أو نسيت كلمة السر، احكيلي.","Hi! If you have trouble signing up, signing in, or forgot your password, tell me."],
  supPh:["اكتب سؤالك أو مشكلتك…","Type your question or problem…"], send:["ابعت","Send"], thinking:["عم بفكر…","Thinking…"],
  sugg1:["كيف بسجّل سلفة؟","How do I record an advance?"], sugg2:["كم باقي علينا رواتب هالأسبوع؟","How much pay do we still owe this week?"], sugg3:["في مصروف مكرر؟","Is there a duplicate expense?"],
  sugg1a:["نسيت كلمة السر","I forgot my password"], sugg2a:["ما وصلني إيميل التأكيد","I didn't get the confirmation email"],
  apply:["نفّذ","Apply"], applied:["تم ✓","Done ✓"], applyFail:["ما زبط التنفيذ","Couldn't apply this"],
  human:["كلّم فريق الدعم","Talk to the support team"], myTickets:["محادثاتي مع الفريق","My conversations with the team"], aiChat:["المساعد","Assistant"],
  humanSent:["وصلت رسالتك لفريق الدعم. الرد رح يطلعلك هون بقسم \"محادثاتي مع الفريق\".","Your message reached the support team. Their reply will appear here under \"My conversations\"."],
  humanForm:["اترك رسالة لفريق الدعم","Leave a message for the support team"], yourName:["اسمك","Your name"], contactField:["رقم تلفونك أو إيميلك عشان نرجعلك","Your phone or email so we can reach you"],
  yourMsg:["شو المشكلة؟","What's the problem?"], sendTeam:["ابعت للفريق","Send to the team"], humanSentAnon:["وصلت رسالتك. فريق الدعم رح يتواصل معك قريب.","Message received. The support team will contact you soon."],
  eContact:["اكتب رقم تلفون أو إيميل.","Enter a phone number or email."], eTooMany:["بعتت رسائل كثير. استنى شوي.","Too many messages. Please wait a bit."],
  aiLimit:["وصلت للحد اليومي للمساعد. اضغط \"كلّم فريق الدعم\".","Daily assistant limit reached. Tap \"Talk to the support team\"."],
  aiOff:["المساعد مش مفعّل لهلأ. اضغط \"كلّم فريق الدعم\".","The assistant isn't enabled yet. Tap \"Talk to the support team\"."],
  aiErr:["ما قدرت أجاوب هلأ. جرّب كمان مرة أو كلّم فريق الدعم.","I couldn't answer right now. Try again or talk to the support team."],
  noTickets:["ما في محادثات مع الفريق لهلأ.","No conversations with the team yet."], tStatus_open:["مفتوحة","Open"], tStatus_answered:["انرد عليها","Answered"], tStatus_closed:["مسكّرة","Closed"],
  replyPh:["اكتب ردك…","Write a reply…"], you:["إنت","You"], team:["فريق الدعم","Support team"], assistant:["المساعد","Assistant"], newReply:["في رد جديد من الدعم","New reply from support"],
  clearChat:["محادثة جديدة","New chat"],
};
let LANG = (()=>{ try{ const s = localStorage.getItem("lang"); if(s==="ar"||s==="en") return s; }catch(e){} return /^ar/i.test(navigator.language||"") ? "ar" : (C.DEFAULT_LANG||"ar"); })();
const t = (k, v) => { const e = L[k]; let s = e ? e[LANG==="en"?1:0] : k; if(v) for(const x in v) s = s.split("{"+x+"}").join(v[x]); return s; };

Object.assign(L, {
  // admin
  adminTitle:["لوحة الإدارة","Admin dashboard"], backBook:["رجوع","Back"], aStats:["إحصائيات","Statistics"], aTickets:["تذاكر الدعم","Support tickets"],
  aCompanies:["الشركات المسجلة","Registered businesses"], aNew7:["سجّلوا آخر ٧ أيام","Joined last 7 days"],
  aNew30:["سجّلوا آخر ٣٠ يوم","Joined last 30 days"], aActive7:["شغّالين آخر ٧ أيام","Active last 7 days"], aUnits:["كل المجلدات","All folders"], aStaff:["كل الموظفين","All staff"],
  aByType:["الشركات حسب المجال","Businesses by sector"], aByMonth:["التسجيلات بالشهر","Sign-ups per month"], aSearch:["ابحث عن شركة (اسم، إيميل، تلفون)","Search businesses (name, email, phone)"],
  aPrivacy:["بتشوف معلومات التواصل والإحصائيات بس. أرقام الشركات وموظفيها ومصاريفها وكلمات السر ما بتوصلك.","You see contact info and statistics only. Businesses' figures, staff, expenses and passwords are never visible to you."],
  aJoined:["سجّل {d}","Joined {d}"], aLast:["آخر نشاط {x}","Last active {x}"], aCounts:["{u} مجلدات · {s} موظفين","{u} folders · {s} staff"], aSendReset:["ابعتله رابط تغيير كلمة السر","Send password reset link"],
  aSent:["انبعت رابط تغيير كلمة السر لـ {x}","Reset link sent to {x}"], aSentBtn:["انبعت ✓","Sent ✓"], aFail:["ما انبعت. جرّب بعد شوي.","Not sent. Try again shortly."], aNone:["ما في نتائج.","No results."],
  aNoAccess:["ما عندك صلاحية لوحة الإدارة.","You don't have admin access."], never:["ولا مرة","never"], todayW:["اليوم","today"], yesterday:["مبارح","yesterday"], daysAgo:["قبل {n} يوم","{n} days ago"],
  aReply:["رد","Reply"], aReplyClose:["رد وسكّر","Reply & close"], aCloseOnly:["سكّر التذكرة","Close ticket"], aNoTickets:["ما في تذاكر.","No tickets."], aPublic:["زائر (مش مسجّل)","Visitor (not signed in)"],
  aReplied:["انبعت الرد","Reply sent"],
});
/* ===== business sectors =====
   unit/staff: [[ar singular, ar plural],[en singular, en plural]]
   client: label of the counterparty on each folder; budget: label of the folder's money target;
   contract: income on the folder counts against the budget (shows what the client still owes);
   recur: a monthly amount on each folder (rent, retainer, subscription) tracked as paid / due / overdue. */
const P = {
  contracting:{ name:["مقاولات وبناء","Construction & contracting"], icon:"crane", pay:"week",
    unit:[["مشروع","مشاريع"],["project","projects"]], staff:[["عامل","عمال"],["worker","workers"]],
    client:["صاحب المشروع","Client"], budget:["قيمة المقاولة","Contract value"], contract:true, recur:null,
    exp:[["حديد","Steel"],["إسمنت","Cement"],["باطون جاهز","Ready-mix concrete"],["بلوك وطوب","Blocks & bricks"],["رمل وحصمة","Sand & gravel"],["خشب وطوبار","Timber & formwork"],["أجار جرافة","Excavator rent"],["أجار معدات","Equipment rent"],["لحام","Welding"],["كهرباء","Electrical"],["سباكة","Plumbing"],["دهان وتشطيب","Paint & finishing"],["مقاول باطن","Subcontractor"],["ديزل وبنزين","Fuel"],["نقل","Transport"],["رخص ورسوم","Permits & fees"],["أخرى","Other"]],
    inc:[["دفعة من صاحب المشروع","Client payment"],["دفعة مقدمة","Down payment"],["أعمال إضافية","Variation works"],["أخرى","Other"]] },
  realestate:{ name:["عقارات وإدارة أملاك","Real estate & property"], icon:"building", pay:"month",
    unit:[["عقار","عقارات"],["property","properties"]], staff:[["موظف","موظفين"],["staff member","staff"]],
    client:["المستأجر","Tenant"], budget:null, contract:false, recur:{label:["الإيجار","Rent"], cat:"إيجار"},
    exp:[["صيانة","Maintenance"],["فواتير كهرباء ومي","Utilities"],["ضرائب ورسوم","Taxes & fees"],["تنظيف وحراسة","Cleaning & security"],["تأمين","Insurance"],["عمولات","Commissions"],["تجديدات","Renovation"],["تسويق","Marketing"],["أخرى","Other"]],
    inc:[["إيجار","Rent"],["تأمين مسترد","Deposit"],["عمولة بيع","Sale commission"],["بيع","Sale"],["رسوم خدمات","Service charges"],["أخرى","Other"]] },
  agency:{ name:["شركة ويب وتصميم","Web & design agency"], icon:"code", pay:"month",
    unit:[["مشروع","مشاريع"],["project","projects"]], staff:[["موظف","موظفين"],["team member","team"]],
    client:["العميل","Client"], budget:["قيمة العقد","Contract value"], contract:true, recur:{label:["الاشتراك الشهري","Monthly retainer"], cat:"اشتراك شهري"},
    exp:[["استضافة وسيرفرات","Hosting & servers"],["دومينات","Domains"],["اشتراكات وبرامج","Software & subscriptions"],["فريلانسر","Freelancers"],["صور وخطوط ورخص","Assets & licences"],["إعلانات","Ads"],["أجهزة","Hardware"],["إيجار المكتب","Office rent"],["إنترنت","Internet"],["أخرى","Other"]],
    inc:[["دفعة من العميل","Client payment"],["اشتراك شهري","Monthly retainer"],["استضافة وصيانة","Hosting & maintenance"],["أخرى","Other"]] },
  tech:{ name:["تكنولوجيا وبرمجيات","Tech & software"], icon:"chip", pay:"month",
    unit:[["منتج","منتجات"],["product","products"]], staff:[["موظف","موظفين"],["team member","team"]],
    client:null, budget:["الميزانية","Budget"], contract:false, recur:{label:["الاشتراكات الشهرية","Monthly subscriptions"], cat:"اشتراكات"},
    exp:[["سيرفرات وكلاود","Cloud & servers"],["أدوات وبرامج","Tools & software"],["APIs وخدمات","APIs & services"],["تسويق وإعلانات","Marketing & ads"],["أجهزة","Hardware"],["رخص وقانوني","Licences & legal"],["فريلانسر","Contractors"],["إيجار المكتب","Office rent"],["أخرى","Other"]],
    inc:[["اشتراكات","Subscriptions"],["مبيعات رخص","Licence sales"],["مشاريع خاصة","Custom projects"],["استثمار وتمويل","Investment & funding"],["أخرى","Other"]] },
  gamedev:{ name:["تطوير ألعاب","Game development"], icon:"gamepad", pay:"month",
    unit:[["لعبة","ألعاب"],["game","games"]], staff:[["عضو فريق","الفريق"],["team member","team"]],
    client:["الناشر","Publisher"], budget:["ميزانية التطوير","Development budget"], contract:false, recur:null,
    exp:[["أصول وجرافيك","Art & assets"],["صوت وموسيقى","Audio & music"],["رخص المحرك","Engine licences"],["أدوات وبرامج","Tools & software"],["فريلانسر","Freelancers"],["تسويق وإعلانات","Marketing & ads"],["رسوم المتاجر","Store fees"],["معارض وفعاليات","Events & expos"],["أجهزة واختبار","Devices & QA"],["أخرى","Other"]],
    inc:[["مبيعات","Sales"],["دفعة من الناشر","Publisher advance"],["مشتريات داخل اللعبة","In-game purchases"],["إعلانات","Ad revenue"],["منح ودعم","Grants"],["أخرى","Other"]] },
  marketing:{ name:["تسويق وإعلان","Marketing & advertising"], icon:"megaphone", pay:"month",
    unit:[["حملة","حملات"],["campaign","campaigns"]], staff:[["موظف","موظفين"],["team member","team"]],
    client:["العميل","Client"], budget:["قيمة العقد","Contract value"], contract:true, recur:{label:["الاشتراك الشهري","Monthly retainer"], cat:"اشتراك شهري"},
    exp:[["إعلانات ممولة","Paid ads"],["تصوير ومونتاج","Photo & video"],["مؤثرين","Influencers"],["طباعة","Printing"],["برامج وأدوات","Tools"],["فريلانسر","Freelancers"],["أخرى","Other"]],
    inc:[["دفعة من العميل","Client payment"],["اشتراك شهري","Monthly retainer"],["عمولة","Commission"],["أخرى","Other"]] },
  clinic:{ name:["عيادة وطبي","Clinic & medical"], icon:"cross", pay:"month",
    unit:[["فرع","فروع"],["branch","branches"]], staff:[["موظف","موظفين"],["staff member","staff"]],
    client:null, budget:null, contract:false, recur:null,
    exp:[["أدوية","Medicines"],["مستلزمات طبية","Medical supplies"],["أجهزة","Equipment"],["مختبر","Lab"],["إيجار","Rent"],["كهرباء ومي","Utilities"],["تعقيم وتنظيف","Sterilisation & cleaning"],["تسويق","Marketing"],["صيانة","Maintenance"],["أخرى","Other"]],
    inc:[["كشفيات","Consultations"],["إجراءات وعمليات","Procedures"],["تأمين","Insurance claims"],["فحوصات","Tests"],["أخرى","Other"]] },
  restaurant:{ name:["مطعم وكافيه","Restaurant & café"], icon:"cup", pay:"month",
    unit:[["فرع","فروع"],["branch","branches"]], staff:[["موظف","موظفين"],["staff member","staff"]],
    client:null, budget:null, contract:false, recur:null,
    exp:[["مواد غذائية","Food supplies"],["مشروبات","Beverages"],["غاز","Gas"],["تغليف","Packaging"],["إيجار","Rent"],["كهرباء ومي","Utilities"],["عمولة التوصيل","Delivery apps fees"],["صيانة","Maintenance"],["تسويق","Marketing"],["أخرى","Other"]],
    inc:[["مبيعات الصالة","Dine-in sales"],["طلبات توصيل","Delivery orders"],["حجوزات ومناسبات","Catering & events"],["أخرى","Other"]] },
  retail:{ name:["محل وتجارة","Shop & retail"], icon:"bag", pay:"month",
    unit:[["فرع","فروع"],["branch","branches"]], staff:[["موظف","موظفين"],["staff member","staff"]],
    client:null, budget:null, contract:false, recur:null,
    exp:[["بضاعة","Stock"],["إيجار","Rent"],["كهرباء ومي","Utilities"],["نقل وشحن","Shipping"],["تغليف","Packaging"],["تسويق","Marketing"],["أخرى","Other"]],
    inc:[["مبيعات","Sales"],["أونلاين","Online sales"],["جملة","Wholesale"],["أخرى","Other"]] },
  education:{ name:["تعليم وتدريب","Education & training"], icon:"book", pay:"month",
    unit:[["دورة","دورات"],["course","courses"]], staff:[["مدرّب","مدرّبين"],["instructor","instructors"]],
    client:null, budget:null, contract:false, recur:{label:["الرسوم الشهرية","Monthly fees"], cat:"رسوم"},
    exp:[["إيجار القاعة","Venue rent"],["مواد ومطبوعات","Materials"],["برامج ومنصات","Platforms"],["تسويق","Marketing"],["شهادات","Certificates"],["أخرى","Other"]],
    inc:[["رسوم","Fees"],["تسجيل","Registration"],["رعاية","Sponsorship"],["أخرى","Other"]] },
  logistics:{ name:["نقل وتوصيل","Transport & delivery"], icon:"truck", pay:"month",
    unit:[["مركبة","مركبات"],["vehicle","vehicles"]], staff:[["سائق","سائقين"],["driver","drivers"]],
    client:null, budget:null, contract:false, recur:null,
    exp:[["ديزل وبنزين","Fuel"],["صيانة","Maintenance"],["إطارات","Tyres"],["تأمين وترخيص","Insurance & licensing"],["مخالفات","Fines"],["قطع غيار","Spare parts"],["أخرى","Other"]],
    inc:[["أجور نقل","Freight"],["توصيل","Deliveries"],["أجار المركبة","Vehicle rental"],["أخرى","Other"]] },
  manufacturing:{ name:["مصنع وورشة","Factory & workshop"], icon:"gear", pay:"week",
    unit:[["طلبية","طلبيات"],["order","orders"]], staff:[["عامل","عمال"],["worker","workers"]],
    client:["الزبون","Customer"], budget:["قيمة الطلبية","Order value"], contract:true, recur:null,
    exp:[["مواد خام","Raw materials"],["كهرباء","Electricity"],["صيانة الآلات","Machine maintenance"],["قطع غيار","Spare parts"],["تغليف","Packaging"],["نقل","Transport"],["أخرى","Other"]],
    inc:[["دفعة من الزبون","Customer payment"],["دفعة مقدمة","Down payment"],["أخرى","Other"]] },
  salon:{ name:["صالون وتجميل","Salon & beauty"], icon:"sparkle", pay:"month",
    unit:[["فرع","فروع"],["branch","branches"]], staff:[["موظف","موظفين"],["staff member","staff"]],
    client:null, budget:null, contract:false, recur:null,
    exp:[["مواد ومستحضرات","Products & supplies"],["إيجار","Rent"],["كهرباء ومي","Utilities"],["أدوات","Tools"],["تسويق","Marketing"],["أخرى","Other"]],
    inc:[["خدمات","Services"],["مبيعات منتجات","Product sales"],["باقات واشتراكات","Packages"],["أخرى","Other"]] },
  events:{ name:["تنظيم فعاليات","Events"], icon:"calendar", pay:"day",
    unit:[["فعالية","فعاليات"],["event","events"]], staff:[["موظف","موظفين"],["staff member","staff"]],
    client:["العميل","Client"], budget:["قيمة العقد","Contract value"], contract:true, recur:null,
    exp:[["قاعة ومكان","Venue"],["ديكور","Decor"],["صوت وإضاءة","Sound & lighting"],["ضيافة","Catering"],["تصوير","Photography"],["طباعة","Printing"],["نقل","Transport"],["أخرى","Other"]],
    inc:[["دفعة من العميل","Client payment"],["رعاية","Sponsorship"],["تذاكر","Tickets"],["أخرى","Other"]] },
  consulting:{ name:["استشارات ومحاماة ومحاسبة","Consulting, legal & accounting"], icon:"briefcase", pay:"month",
    unit:[["ملف","ملفات"],["case","cases"]], staff:[["موظف","موظفين"],["staff member","staff"]],
    client:["العميل","Client"], budget:["الأتعاب المتفق عليها","Agreed fees"], contract:true, recur:{label:["الاشتراك الشهري","Monthly retainer"], cat:"اشتراك شهري"},
    exp:[["رسوم حكومية ومحاكم","Government & court fees"],["مواصلات","Travel"],["برامج","Software"],["إيجار المكتب","Office rent"],["طباعة وقرطاسية","Printing & stationery"],["أخرى","Other"]],
    inc:[["أتعاب","Fees"],["اشتراك شهري","Monthly retainer"],["أخرى","Other"]] },
  agriculture:{ name:["زراعة ومزارع","Agriculture & farms"], icon:"leaf", pay:"day",
    unit:[["مزرعة","مزارع"],["farm","farms"]], staff:[["عامل","عمال"],["worker","workers"]],
    client:null, budget:["ميزانية الموسم","Season budget"], contract:false, recur:null,
    exp:[["بذور وأشتال","Seeds & seedlings"],["أسمدة","Fertiliser"],["مبيدات","Pesticides"],["مي وري","Water & irrigation"],["ديزل","Fuel"],["أعلاف","Feed"],["صيانة","Maintenance"],["أخرى","Other"]],
    inc:[["بيع محصول","Crop sales"],["بيع مواشي","Livestock sales"],["أخرى","Other"]] },
  other:{ name:["مجال ثاني","Other business"], icon:"grid", pay:"month",
    unit:[["قسم","أقسام"],["department","departments"]], staff:[["موظف","موظفين"],["staff member","staff"]],
    client:["العميل","Client"], budget:["الميزانية","Budget"], contract:false, recur:null,
    exp:[["مواد","Materials"],["إيجار","Rent"],["كهرباء ومي","Utilities"],["نقل","Transport"],["تسويق","Marketing"],["معدات","Equipment"],["أخرى","Other"]],
    inc:[["مبيعات وخدمات","Sales & services"],["دفعة من عميل","Client payment"],["أخرى","Other"]] }
};
const TYPES = Object.keys(P);
const CUR = {JOD:["دينار","JOD"],SAR:["ريال","SAR"],AED:["درهم","AED"],KWD:["دينار كويتي","KWD"],QAR:["ريال قطري","QAR"],BHD:["دينار بحريني","BHD"],OMR:["ريال عماني","OMR"],EGP:["جنيه","EGP"],IQD:["دينار عراقي","IQD"],LBP:["ليرة","LBP"],SYP:["ليرة سورية","SYP"],ILS:["شيكل","ILS"],MAD:["درهم مغربي","MAD"],TND:["دينار تونسي","TND"],DZD:["دينار جزائري","DZD"],LYD:["دينار ليبي","LYD"],SDG:["جنيه سوداني","SDG"],YER:["ريال يمني","YER"],USD:["دولار","USD"],EUR:["يورو","EUR"],GBP:["جنيه إسترليني","GBP"],TRY:["ليرة تركية","TRY"],CAD:["دولار كندي","CAD"],AUD:["دولار أسترالي","AUD"]};
const DAYS = {ar:["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"], en:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]};
const DAYS_SHORT = {ar:["أحد","إثنين","ثلاثاء","أربعاء","خميس","جمعة","سبت"], en:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]};
const MONTHS = {ar:["كانون ٢","شباط","آذار","نيسان","أيار","حزيران","تموز","آب","أيلول","تشرين ١","تشرين ٢","كانون ١"], en:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]};
const COLS = ["units","staff","attendance","payments","expenses","income"];

/* ===== icons (inline, stroke = currentColor) ===== */
const ICON = {
  home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  folder:'<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2h8.5A1.5 1.5 0 0 1 21 8.5v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z"/>',
  users:'<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.4"/><path d="M15.6 14.2A4.5 4.5 0 0 1 21 18.6"/>',
  wallet:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 14.5h2"/>',
  chat:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>', check:'<path d="m5 12.5 4.5 4.5L19 7.5"/>', x:'<path d="M6 6l12 12M18 6 6 18"/>',
  chevS:'<path d="m9 6 6 6-6 6"/>', chevE:'<path d="m15 6-6 6 6 6"/>', clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M4.2 5.2l2.1 2.1M17.7 16.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 18.8l2.1-2.1M17.7 7.3l2.1-2.1"/>',
  send:'<path d="M4 12 20 4l-6 16-3-7z"/>', bolt:'<path d="M13 3 5 13h6l-1 8 8-10h-6z"/>', alert:'<path d="M12 4 2.5 20h19z"/><path d="M12 10v4M12 17h.01"/>',
  crane:'<path d="M5 21V5h8l6 4M5 5l8 4h6M13 9v4M11 13h4v3h-4zM3 21h6"/>', building:'<path d="M4 21V4h10v17M14 9h6v12M7 8h2M7 12h2M7 16h2M17 13h1M17 17h1M2 21h20"/>',
  code:'<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>', chip:'<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3"/>',
  gamepad:'<path d="M7 9h10a4 4 0 0 1 3.9 4.8l-.7 3.2a2 2 0 0 1-3.4 1L15 16H9l-1.8 2a2 2 0 0 1-3.4-1l-.7-3.2A4 4 0 0 1 7 9z"/><path d="M8 11.5v3M6.5 13h3M15.5 12.5h.01M17.5 14h.01"/>',
  megaphone:'<path d="M3 10v4h4l7 4V6L7 10z"/><path d="M17 9.5a3.5 3.5 0 0 1 0 5"/>', cross:'<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z"/>',
  cup:'<path d="M4 8h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3v2M12 3v2"/>', bag:'<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7h7"/>', truck:'<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
  sparkle:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>', calendar:'<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  briefcase:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5h6v2M3 13h18"/>', leaf:'<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19c3-4 6-6 10-8"/>',
  grid:'<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
  globe:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"/>',
  logout:'<path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10"/>', key:'<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l2 2"/>', shield:'<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z"/>',
};
const icon = (k, cls="") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[k]||ICON.grid}</svg>`;
const MARK = '<svg class="mark" viewBox="270 300 540 470" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="44"><path d="M330 520 V750 H540 A210 210 0 0 0 540 330 H500"/><path d="M408 560 V672 H540 A132 132 0 0 0 540 408 H540"/></g><path d="M292 412 L362 482 L486 358" stroke="currentColor" stroke-width="44" fill="none"/></svg>';

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt = n => (Math.round((n||0)*100)/100).toLocaleString("en-US",{maximumFractionDigits:2});

Object.assign(L, {
  aSite:["الموقع والتنزيل","Site & installs"], sVisitors:["زوّار","Visitors"], sToday:["زوّار اليوم","Visitors today"], sInstallClicks:["ضغطوا تنزيل","Tapped install"],
  sInstalls:["نزّلوا التطبيق","Installed the app"], sSignups:["سجّلوا شركة","Signed up"], sVideo:["شغّلوا الفيديو","Video plays"], sOpenApp:["فتحوا التطبيق من الموقع","Opened the app"],
  sFunnel:["من الزيارة للتسجيل","From visit to sign-up"], sByDay:["كل يوم","Per day"], sByOs:["حسب الجهاز","By device"], sByRef:["من وين إجو","Where they came from"],
  sByBrowser:["المتصفح","Browser"], sAllTime:["من البداية: {v} زائر · {i} تثبيت · {s} شركة","All time: {v} visitors · {i} installs · {s} sign-ups"],
  sDays:["آخر {d} يوم","Last {d} days"], sNote:["الأرقام مجهولة: رقم عشوائي لكل جهاز، بدون IP أو أسماء. التثبيت على الآيفون بينحسب أول ما يفتحوا التطبيق من الأيقونة.","Anonymous: a random id per device, no IPs or names. iPhone installs count when the app is first opened from the home-screen icon."],
  sNoData:["لسا ما في زيارات. انشر رابط الموقع وارجع.","No visits yet. Share the site link and check back."], sVis:["زوّار","visitors"], sInst:["تثبيت","installs"]
});
/* =====================================================================
   Daftar — admin console (separate from the public app).
   Access needs ALL of: an account listed in platform_admins, not linked to
   any company, signed in with a second factor (TOTP). The database enforces
   this on every admin call; this page only guides the sign-in.
   ===================================================================== */
if(window.top !== window.self){ document.documentElement.innerHTML = ""; throw new Error("framed"); }
Object.assign(L, {
  cTitle:["لوحة الإدارة","Admin console"], cSub:["دخول خاص بالإدارة","Restricted access"],
  cLogin:["دخول الإدارة","Admin sign-in"], cWrong:["البيانات غلط أو الحساب ما إله صلاحية.","Wrong details, or this account has no access."],
  cMfaTitle:["التحقق بخطوتين","Two-step verification"], cMfaSub:["افتح تطبيق المصادقة (Google Authenticator أو Authy) واكتب الرمز المكوّن من ٦ أرقام.","Open your authenticator app (Google Authenticator or Authy) and enter the 6-digit code."],
  cEnrollTitle:["فعّل التحقق بخطوتين","Turn on two-step verification"], cEnrollSub:["هاد إلزامي لحساب الإدارة. امسح الرمز بتطبيق المصادقة، وبعدها اكتب الرمز اللي بيطلعلك.","Required for admin accounts. Scan this with your authenticator app, then enter the code it shows."],
  cSecret:["أو اكتب هالمفتاح يدوياً:","Or enter this key manually:"], cCode:["الرمز (٦ أرقام)","Code (6 digits)"], cVerify:["تحقق","Verify"],
  cBadCode:["الرمز غلط. جرّب الرمز الجديد.","Wrong code. Try the current one."], cLocked:["محاولات كثير. استنى دقيقة.","Too many attempts. Wait a minute."],
  cIdle:["انتهت الجلسة لأنك ما استعملت اللوحة ١٥ دقيقة.","Signed out after 15 minutes of inactivity."], cMax:["انتهت مدة الجلسة. سجّل دخول من جديد.","Session expired. Please sign in again."],
  cAudit:["سجل الأمان","Security log"], cAuditSub:["كل دخول وكل عملية بلوحة الإدارة، آخر ٢٠٠","Every admin sign-in and action, latest 200"],
  act_session:["فتح جلسة","Session opened"], act_login:["تسجيل دخول","Signed in"], act_logout:["تسجيل خروج","Signed out"], act_idle_logout:["خروج تلقائي","Auto sign-out"],
  act_view_stats:["فتح الإحصائيات","Viewed statistics"], act_view_tickets:["فتح التذاكر","Viewed tickets"], act_reply:["رد على تذكرة","Replied to ticket"], act_reply_close:["رد وسكّر تذكرة","Replied & closed ticket"], act_send_reset:["بعت رابط تغيير كلمة سر","Sent password reset"],
  cRefresh:["تحديث","Refresh"],
});

const CS = { screen:"loading", msg:"", msgType:"err", tab:"stats", stats:null, tickets:null, ticketId:null, ticketFilter:"open", q:"", audit:null, factorId:null, qr:null, secret:null, fails:0, lockUntil:0 };
let sb = null;
const app = document.getElementById("app");
const IDLE_MS = 15*60*1000, MAX_MS = 8*60*60*1000;
const esc2 = esc;
const ago = x => { if(!x) return t("never"); const d = Math.floor((Date.now()-new Date(x).getTime())/86400000); return d<=0?t("todayW"):d===1?t("yesterday"):t("daysAgo",{n:`<span class="num">${d}</span>`}); };
const when = x => { const d = new Date(x); return `<span class="num">${d.toLocaleDateString("en-GB")} ${d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</span>`; };
function toast(m){ const el = document.getElementById("toast"); el.textContent = m; el.hidden = false; clearTimeout(toast._t); toast._t = setTimeout(()=>el.hidden=true, 3200); }
function armed(el, label){ if(el.dataset.armed==="1") return true; el.dataset.orig = el.textContent; el.dataset.armed = "1"; el.classList.add("armed"); el.textContent = label;
  setTimeout(()=>{ if(el.isConnected && el.dataset.armed==="1"){ el.dataset.armed = ""; el.classList.remove("armed"); el.textContent = el.dataset.orig; } }, 4000); return false; }
function applyDir(){ document.documentElement.lang = LANG; document.documentElement.dir = LANG==="en" ? "ltr" : "rtl"; document.title = t("cTitle"); }

/* ---------- screens ---------- */
function shellAuth(title, sub, inner){
  return `<div class="auth" style="min-height:100vh;justify-content:center"><div class="auth-top"><div class="tb-brand">${MARK}<b>${t("cTitle")}</b></div><button class="btn ghost sm" data-act="lang">${icon("globe")}${t("otherLang")}</button></div>
    <div class="panel auth-card"><div class="who">${icon("shield","big")}<div class="col"><h1 class="atitle">${title}</h1><span class="sub">${sub}</span></div></div>
    ${CS.msg?`<div class="msg ${CS.msgType}" role="status">${esc(CS.msg)}</div>`:""}${inner}</div></div>`;
}
function render(){
  applyDir();
  if(CS.screen==="loading"){ app.innerHTML = `<div class="splash">${MARK}<b>${t("cTitle")}</b></div>`; return; }
  if(CS.screen==="config"){ app.innerHTML = `<div class="auth"><div class="panel empty"><b>${t("configMissing")}</b><span>${t("configMissingSub")}</span></div></div>`; return; }
  if(CS.screen==="login"){ app.innerHTML = shellAuth(t("cLogin"), t("cSub"), `<form id="loginForm" class="aform" novalidate autocomplete="off">
      <div class="field"><label for="email">${t("email")}</label><input id="email" name="email" type="email" dir="ltr" autocomplete="username" required></div>
      <div class="field"><label for="password">${t("password")}</label><input id="password" name="password" type="password" dir="ltr" autocomplete="current-password" required></div>
      <button class="btn primary big" type="submit">${t("enter")}</button></form>`); return; }
  if(CS.screen==="enroll"){ app.innerHTML = shellAuth(t("cEnrollTitle"), t("cEnrollSub"), `<div style="display:flex;justify-content:center;background:#fff;border-radius:12px;padding:12px"><img src="${esc(CS.qr)}" alt="QR" width="200" height="200"></div>
      <span class="hint">${t("cSecret")} <b class="ltr sel">${esc(CS.secret)}</b></span>${codeForm()}`); return; }
  if(CS.screen==="mfa"){ app.innerHTML = shellAuth(t("cMfaTitle"), t("cMfaSub"), codeForm()); setTimeout(()=>{ const i = document.getElementById("code"); if(i) i.focus(); }, 50); return; }
  app.innerHTML = dashboard();
}
const codeForm = () => `<form id="codeForm" class="aform" novalidate autocomplete="off"><div class="field bigamt"><label for="code">${t("cCode")}</label><input id="code" name="code" inputmode="numeric" pattern="[0-9]*" maxlength="6" autocomplete="one-time-code" dir="ltr" required></div>
  <button class="btn primary big" type="submit">${t("cVerify")}</button><button class="linkbtn" type="button" data-act="logout">${t("logout")}</button></form>`;

function dashboard(){
  let h = `<div class="admin"><div class="topbar static"><div class="tb-brand">${MARK}<b>${t("cTitle")}</b></div><div class="tbtns"><button class="iconbtn" data-act="refresh" aria-label="${t("cRefresh")}">${icon("bolt")}</button><button class="btn ghost sm" data-act="lang">${icon("globe")}${t("otherLang")}</button><button class="btn sm" data-act="logout">${icon("logout")}${t("logout")}</button></div></div><div class="wrap">`;
  h += `<div class="seg" role="group"><button data-act="tab" data-id="stats" aria-pressed="${CS.tab==="stats"}">${t("aStats")}</button><button data-act="tab" data-id="tickets" aria-pressed="${CS.tab==="tickets"}">${t("aTickets")}${(CS.tickets||[]).some(x=>x.status==="open")?'<i class="dot"></i>':""}</button><button data-act="tab" data-id="site" aria-pressed="${CS.tab==="site"}">${t("aSite")}</button><button data-act="tab" data-id="audit" aria-pressed="${CS.tab==="audit"}">${t("cAudit")}</button></div>`;
  h += CS.tab==="tickets" ? ticketsView() : CS.tab==="audit" ? auditView() : CS.tab==="site" ? siteView() : statsView();
  return h + `</div></div>`;
}
function statsView(){
  const a = CS.stats; if(!a) return `<div class="panel empty"><b>${t("loading")}</b></div>`;
  let h = "";
  const tiles = [["aCompanies",a.companies],["aNew7",a.new_7d],["aNew30",a.new_30d],["aActive7",a.active_7d],["aUnits",a.units],["aStaff",a.staff]];
  h += `<div class="kpis">${tiles.map(([l,v],i)=>`<div class="kpi ${i===0?"hero":""}"><span class="label">${t(l)}</span><b class="num">${fmt(v||0)}</b></div>`).join("")}</div>`;
  const bt = a.by_type||[], bmx = Math.max(1,...bt.map(x=>x.count));
  if(bt.length) h += `<div class="panel"><span class="label">${t("aByType")}</span>${bt.map(x=>`<div class="cat"><span>${icon((P[x.type]||P.other).icon)} ${esc((P[x.type]||P.other).name[LANG==="en"?1:0])}</span><b class="num">${x.count}</b><div class="bar"><span style="width:${x.count/bmx*100}%"></span></div></div>`).join("")}</div>`;
  const bm = (a.by_month||[]).slice(-12), mx = Math.max(1,...bm.map(x=>x.count));
  if(bm.length) h += `<div class="panel"><span class="label">${t("aByMonth")}</span><div class="trend">${bm.map(x=>`<div class="tcol"><span class="num v">${x.count}</span><div class="tbar"><i style="height:${Math.max(4,x.count/mx*100)}%"></i></div><span class="m num">${esc(String(x.month).slice(5))}/${esc(String(x.month).slice(2,4))}</span></div>`).join("")}</div></div>`;
  const q = CS.q.toLowerCase();
  const list = (a.list||[]).filter(c=>!q || String(c.name||"").toLowerCase().includes(q) || String(c.email||"").toLowerCase().includes(q) || String(c.phone||"").includes(q));
  h += `<div class="panel"><div class="field"><label for="adminQ">${t("aSearch")}</label><input id="adminQ" value="${esc(CS.q)}" autocomplete="off"></div>
    <div class="alert info">${icon("shield")}<span>${t("aPrivacy")}</span></div>
    <div class="list">${list.map(c=>`<div class="crow"><div class="who"><span class="avatar">${esc(String(c.name||"?").trim().slice(0,2))}</span><div class="m"><b>${esc(c.name)}</b><span class="sub ltr">${esc(c.email||"")}</span>
      <span class="sub">${esc((P[c.type]||P.other).name[LANG==="en"?1:0])} · ${c.phone?`<span class="num">${esc(c.phone)}</span> · `:""}${t("aJoined",{d:esc(String(c.created_at).slice(0,10))})} · ${t("aLast",{x:ago(c.last_activity)})} · ${t("aCounts",{u:`<span class="num">${Number(c.units)||0}</span>`,s:`<span class="num">${Number(c.staff)||0}</span>`})}</span></div></div>
      ${c.email?`<button class="btn sm" data-act="reset" data-id="${esc(c.email)}">${icon("key")}${t("aSendReset")}</button>`:""}</div>`).join("") || `<span class="hint">${t("aNone")}</span>`}</div></div>`;
  return h;
}
function siteView(){
  const a = CS.site; const days = CS.siteDays || 30;
  let h = `<div class="seg" role="group">${[7,30,90].map(d=>`<button data-act="sdays" data-id="${d}" aria-pressed="${days===d}">${t("sDays",{d})}</button>`).join("")}</div>`;
  if(!a) return h + `<div class="panel empty"><b>${t("loading")}</b></div>`;
  const tiles = [["sVisitors",a.visitors],["sToday",a.today],["sInstalls",a.installs],["sSignups",a.signups],["sInstallClicks",a.install_clicks],["sVideo",a.video_plays],["sOpenApp",a.open_app]];
  h += `<div class="kpis">${tiles.map(([l,v],i)=>`<div class="kpi ${i===0?"hero":""}"><span class="label">${t(l)}</span><b class="num">${fmt(v||0)}</b></div>`).join("")}</div>`;
  const at = a.all_time||{};
  h += `<div class="alert info">${icon("shield")}<span>${t("sAllTime",{v:fmt(at.visitors||0),i:fmt(at.installs||0),s:fmt(at.signups||0)})}<br>${t("sNote")}</span></div>`;
  if(!a.visitors && !a.installs) return h + `<div class="panel empty">${icon("globe","big")}<span>${t("sNoData")}</span></div>`;
  const steps = [["sVisitors",a.visitors],["sInstallClicks",a.install_clicks],["sInstalls",a.installs],["sSignups",a.signups]], top = Math.max(1,a.visitors||0);
  h += `<div class="panel"><span class="label">${t("sFunnel")}</span>${steps.map(([l,v])=>`<div class="cat"><span>${t(l)}</span><b class="num">${fmt(v||0)} <span class="sub">· ${Math.round((v||0)/top*100)}%</span></b><div class="bar"><span style="width:${Math.min(100,(v||0)/top*100)}%"></span></div></div>`).join("")}</div>`;
  const bd = a.by_day||[], mx = Math.max(1,...bd.map(x=>x.visitors));
  const step = bd.length>45 ? 14 : bd.length>14 ? 7 : 1, dense = bd.length>14;
  h += `<div class="panel"><span class="label">${t("sByDay")} <span class="sub">— <span style="color:var(--brand)">■</span> ${t("sVis")} · <span style="color:var(--good)">■</span> ${t("sInst")}</span></span><div class="trend site">${bd.map((x,i)=>`<div class="tcol" title="${esc(x.day)} · ${x.visitors} / ${x.installs}"><span class="num v">${dense?"":(x.visitors||"")}</span><div class="tbar"><i style="height:${Math.max(2,x.visitors/mx*100)}%"></i><i class="g" style="height:${x.installs?Math.max(3,x.installs/mx*100):0}%"></i></div><span class="m num">${(bd.length-1-i)%step===0?esc(String(x.day).slice(8))+"/"+esc(String(x.day).slice(5,7)):""}</span></div>`).join("")}</div></div>`;
  const osN = {android:"Android",ios:"iPhone",windows:"Windows",mac:"Mac",linux:"Linux",other:"—"};
  const list = (arr,key,lab,extra) => { const m = Math.max(1,...arr.map(x=>x.visitors)); return arr.map(x=>`<div class="cat"><span class="ltr">${esc(lab(x[key]))}</span><b class="num">${fmt(x.visitors)}${extra?extra(x):""}</b><div class="bar"><span style="width:${x.visitors/m*100}%"></span></div></div>`).join("") || `<span class="hint">—</span>`; };
  h += `<div class="panel"><span class="label">${t("sByOs")}</span>${list(a.by_os||[],"os",k=>osN[k]||k,x=>` <span class="sub">· ${fmt(x.installs)} ${t("sInst")}</span>`)}</div>`;
  h += `<div class="panel"><span class="label">${t("sByRef")}</span>${list(a.by_ref||[],"ref",k=>k==="direct"?(LANG==="en"?"Direct / link":"مباشر / رابط"):k)}</div>`;
  h += `<div class="panel"><span class="label">${t("sByBrowser")}</span>${list(a.by_browser||[],"browser",k=>k)}</div>`;
  const F = CS.features;
  if(F) h += `<div class="panel"><span class="label">${LANG==="en"?"New features in use":"استعمال الميزات الجديدة"}</span><div class="kv">${[
    [LANG==="en"?"Team members (invited)":"أعضاء فرق (بالدعوة)", F.team_members], [LANG==="en"?"Invites used":"دعوات انستعملت", F.invites_used],
    [LANG==="en"?"Taxi / delivery accounts":"حسابات تكسي وتوصيل", F.driver_companies], [LANG==="en"?"Trips logged":"طلعات مسجّلة", F.trips],
    [LANG==="en"?"Attached files":"ملفات مرفقة", F.files], [LANG==="en"?"Storage (MB)":"التخزين (ميغا)", F.files_mb]
  ].map(([l,v])=>`<div><span>${l}</span><b class="num">${fmt(v||0)}</b></div>`).join("")}</div></div>`;
  return h;
}
function ticketsView(){
  const list = CS.tickets;
  let h = `<div class="seg four" role="group">${[["open","tStatus_open"],["answered","tStatus_answered"],["closed","tStatus_closed"],["all","fAll"]].map(([k,l])=>`<button data-act="tfilter" data-id="${k}" aria-pressed="${CS.ticketFilter===k}">${t(l)}</button>`).join("")}</div>`;
  if(!list) return h + `<div class="panel empty">${t("loading")}</div>`;
  const tk = CS.ticketId && list.find(x=>x.id===CS.ticketId);
  if(tk) return h + `<div class="panel"><button class="linkbtn self-start" data-act="tback">${icon(LANG==="en"?"chevE":"chevS")}${t("back")}</button>
    <div class="whead"><div class="col"><b>${esc(tk.company||t("aPublic"))}</b><span class="sub">${esc(tk.name||"")} ${tk.contact?`· <span class="ltr sel">${esc(tk.contact)}</span>`:""}</span></div><span class="pill ${tk.status==="answered"?"good":tk.status==="closed"?"":"warn"}">${t("tStatus_"+tk.status)}</span></div>
    <div class="msgs flat">${(tk.messages||[]).map(m=>`<div class="bubble ${m.role==="support"?"me":m.role==="ai"?"ai":"team"}"><span class="who-l">${m.role==="support"?t("team"):m.role==="ai"?t("assistant"):esc(tk.name||tk.company||t("you"))}</span>${esc(m.text||"").replace(/\n/g,"<br>")}</div>`).join("")}</div>
    <form id="replyForm" class="aform"><textarea id="replyText" rows="3" maxlength="4000" placeholder="${esc(t("replyPh"))}"></textarea>
    <div class="two"><button class="btn primary" type="submit" data-close="0">${t("aReply")}</button><button class="btn" type="submit" data-close="1">${t("aReplyClose")}</button></div></form></div>`;
  if(!list.length) return h + `<div class="panel empty">${icon("chat","big")}<span>${t("aNoTickets")}</span></div>`;
  return h + `<div class="panel"><div class="list">${list.map(x=>`<button class="row" data-act="topen" data-id="${esc(x.id)}"><div class="m"><b>${esc(x.subject||"—")}</b><span class="sub">${esc(x.company||t("aPublic"))} · ${ago(x.updated_at)}</span></div><span class="pill ${x.status==="answered"?"good":x.status==="closed"?"":"warn"}">${t("tStatus_"+x.status)}</span></button>`).join("")}</div></div>`;
}
function auditView(){
  const a = CS.audit; if(!a) return `<div class="panel empty">${t("loading")}</div>`;
  return `<div class="panel"><span class="label">${t("cAuditSub")}</span><div class="list">${a.map(x=>`<div class="row"><span class="tx-ic pay">${icon(x.action.includes("login")||x.action==="session"?"key":x.action.includes("reply")?"chat":"shield")}</span><div class="m"><b>${esc(t("act_"+x.action)||x.action)}${x.detail?` · <span class="ltr">${esc(x.detail)}</span>`:""}</b><span class="sub">${when(x.created_at)} · <span class="ltr">${esc(x.ip||"?")}</span> · ${esc(String(x.ua||"").slice(0,60))}</span></div></div>`).join("") || `<span class="hint">—</span>`}</div></div>`;
}

/* ---------- data ---------- */
async function loadStats(){ const { data, error } = await sb.rpc("admin_stats"); if(error) return guardFail(); CS.stats = data; render(); }
async function loadSite(){ const { data, error } = await sb.rpc("admin_site_stats", {p_days: CS.siteDays || 30}); if(error) return guardFail(); CS.site = data;
  const f = await sb.rpc("admin_feature_stats"); CS.features = f.error ? null : f.data; render(); }
async function loadTickets(){ const { data, error } = await sb.rpc("admin_tickets", {p_status: CS.ticketFilter==="all" ? null : CS.ticketFilter}); if(error) return guardFail(); CS.tickets = data || []; render(); }
async function loadAudit(){ const { data, error } = await sb.rpc("admin_audit_list"); if(error) return guardFail(); CS.audit = data || []; render(); }
async function guardFail(){ await hardLogout(); CS.msg = t("cWrong"); render(); }

/* ---------- sign-in ---------- */
async function afterPassword(){
  const { data:who, error } = await sb.rpc("admin_whoami");
  if(error || !who || !who.listed){ await hardLogout(); CS.msg = t("cWrong"); CS.msgType = "err"; render(); return; }
  if(who.mfa) return enterDashboard();
  const { data:f } = await sb.auth.mfa.listFactors();
  const verified = (f && f.totp || []).filter(x=>x.status==="verified");
  if(verified.length){ CS.factorId = verified[0].id; CS.screen = "mfa"; CS.msg = ""; render(); return; }
  // stale unverified factors block a new enrollment
  for(const x of (f && f.all || []).filter(x=>x.status!=="verified")) await sb.auth.mfa.unenroll({factorId:x.id});
  const { data:en, error:e2 } = await sb.auth.mfa.enroll({factorType:"totp", friendlyName:"Daftar admin "+new Date().toISOString().slice(0,10)});
  if(e2){ CS.msg = t("eGeneric"); render(); return; }
  CS.factorId = en.id; CS.qr = en.totp.qr_code; CS.secret = en.totp.secret; CS.screen = "enroll"; CS.msg = ""; render();
}
async function enterDashboard(){
  const { data:who } = await sb.rpc("admin_whoami");
  if(!who || !who.mfa){ await hardLogout(); CS.msg = t("cWrong"); render(); return; }
  try{ if(!sessionStorage.getItem("adminStart")) sessionStorage.setItem("adminStart", String(Date.now())); }catch(e){}
  sb.rpc("admin_note", {p_action:"login", p_detail:null});
  CS.screen = "app"; CS.qr = CS.secret = null; CS.msg = ""; render(); loadStats(); loadTickets(); touch();
}
async function hardLogout(note){
  if(note && sb){ try{ await sb.rpc("admin_note", {p_action:note, p_detail:null}); }catch(e){} }
  try{ await sb.auth.signOut(); }catch(e){}
  try{ sessionStorage.clear(); }catch(e){}
  Object.assign(CS, {screen:"login", stats:null, tickets:null, audit:null, ticketId:null, factorId:null, qr:null, secret:null});
}
let idleT = null;
function touch(){ if(CS.screen!=="app") return; clearTimeout(idleT); idleT = setTimeout(async()=>{ await hardLogout("idle_logout"); CS.msg = t("cIdle"); CS.msgType = "ok"; render(); }, IDLE_MS);
  let st = 0; try{ st = Number(sessionStorage.getItem("adminStart"))||0; }catch(e){}
  if(st && Date.now()-st > MAX_MS){ hardLogout("logout").then(()=>{ CS.msg = t("cMax"); render(); }); } }
["click","keydown","pointermove","touchstart"].forEach(ev=>document.addEventListener(ev, ()=>{ if(CS.screen==="app") touch(); }, {passive:true}));

document.addEventListener("submit", async e=>{
  const f = e.target; e.preventDefault();
  const btn = f.querySelector('[type="submit"]'); if(btn) btn.disabled = true;
  try{
    if(f.id==="loginForm"){
      const email = f.email.value.trim(), password = f.password.value;
      const { error } = await sb.auth.signInWithPassword({email, password});
      f.password.value = "";
      if(error){ CS.msg = /too many|rate/i.test(error.message||"") ? t("eRate") : t("cWrong"); CS.msgType = "err"; render(); return; }
      await afterPassword();
    }
    if(f.id==="codeForm"){
      if(Date.now() < CS.lockUntil){ CS.msg = t("cLocked"); render(); return; }
      const code = String(f.code.value||"").replace(/\D/g,"");
      if(code.length!==6){ CS.msg = t("cBadCode"); render(); return; }
      const { error } = await sb.auth.mfa.challengeAndVerify({factorId:CS.factorId, code});
      if(error){ CS.fails++; if(CS.fails>=5){ CS.lockUntil = Date.now()+60000; CS.fails = 0; } CS.msg = CS.lockUntil>Date.now() ? t("cLocked") : t("cBadCode"); CS.msgType = "err"; render(); return; }
      CS.fails = 0; await enterDashboard();
    }
    if(f.id==="replyForm"){
      const close = e.submitter && e.submitter.dataset.close==="1", txt = document.getElementById("replyText").value.trim();
      if(!txt && !close) return;
      const { error } = await sb.rpc("admin_reply", {p_id:CS.ticketId, p_text:txt, p_close:close});
      if(error) return guardFail(); toast(t("aReplied")); await loadTickets();
    }
  } finally { if(btn && btn.isConnected) btn.disabled = false; }
});
document.addEventListener("input", e=>{ if(e.target.id==="adminQ"){ CS.q = e.target.value; const pos = e.target.selectionStart; render(); const el = document.getElementById("adminQ"); if(el){ el.focus(); try{ el.setSelectionRange(pos,pos); }catch(_){} } } });
const ACT = {
  lang: () => { LANG = LANG==="en" ? "ar" : "en"; try{ localStorage.setItem("lang", LANG); }catch(e){} render(); },
  logout: async () => { await hardLogout(CS.screen==="app" ? "logout" : null); CS.msg = ""; render(); },
  tab: id => { CS.tab = id; CS.ticketId = null; render(); if(id==="audit") loadAudit(); if(id==="tickets") loadTickets(); if(id==="site") loadSite(); },
  sdays: d => { CS.siteDays = +d; CS.site = null; render(); loadSite(); },
  refresh: () => { if(CS.tab==="audit") loadAudit(); else if(CS.tab==="tickets") loadTickets(); else if(CS.tab==="site") loadSite(); else loadStats(); },
  tfilter: id => { CS.ticketFilter = id; CS.ticketId = null; CS.tickets = null; render(); loadTickets(); },
  topen: id => { CS.ticketId = id; render(); }, tback: () => { CS.ticketId = null; render(); },
  reset: async (email, el) => {
    if(!armed(el, t("sure"))) return; el.disabled = true;
    const { error } = await sb.auth.resetPasswordForEmail(email, {redirectTo: C.APP_URL || undefined});
    if(!error) sb.rpc("admin_note", {p_action:"send_reset", p_detail:email});
    toast(error ? t("aFail") : t("aSent",{x:email})); el.textContent = error ? el.dataset.orig : t("aSentBtn"); if(error) el.disabled = false;
  }
};
document.addEventListener("click", e=>{ const el = e.target.closest("[data-act]"); if(!el) return; const f = ACT[el.dataset.act]; if(f){ e.preventDefault(); f(el.dataset.id, el); } });

/* ---------- start ---------- */
(async ()=>{
  applyDir();
  if(!C.SUPABASE_URL || !C.SUPABASE_ANON_KEY || /YOUR-/.test(C.SUPABASE_URL+C.SUPABASE_ANON_KEY)){ CS.screen = "config"; render(); return; }
  // separate, tab-only session: closing the tab signs the admin out
  sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY, {auth:{storageKey:"daftar-admin", storage:window.sessionStorage, persistSession:true, autoRefreshToken:true, detectSessionInUrl:false}});
  const { data:{ session } } = await sb.auth.getSession();
  if(session) await afterPassword(); else { CS.screen = "login"; render(); }
})();
