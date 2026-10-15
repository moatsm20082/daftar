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
  f3:["المصاريف والدخل لكل مشروع وفرع","Expenses & income per project or branch"], f4:["الربح والخسارة بلحظتها","Live profit & loss"], tagline:["إدارة شغل شركتك، بمكان واحد","Run your business from one place"],
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
  supTitle:["دعم دفتر","Daftar support"], send:["ابعت","Send"], thinking:["عم بفكر…","Thinking…"], myTickets:["محادثاتي مع الفريق","My conversations with the team"],
  humanSent:["وصلت رسالتك ✓ الرد بيطلعلك هون.","Message sent ✓ The reply will show up here."],
  humanForm:["اترك رسالة لفريق الدعم","Leave a message for the support team"], yourName:["اسمك","Your name"], contactField:["رقم تلفونك أو إيميلك عشان نرجعلك","Your phone or email so we can reach you"],
  yourMsg:["شو المشكلة؟","What's the problem?"], sendTeam:["ابعت للفريق","Send to the team"], humanSentAnon:["وصلت رسالتك. فريق الدعم رح يتواصل معك قريب.","Message received. The support team will contact you soon."],
  eContact:["اكتب رقم تلفون أو إيميل.","Enter a phone number or email."], eTooMany:["بعتت رسائل كثير. استنى شوي.","Too many messages. Please wait a bit."],
  noTickets:["ما في محادثات مع الفريق لهلأ.","No conversations with the team yet."], tStatus_open:["مفتوحة","Open"], tStatus_answered:["انرد عليها","Answered"], tStatus_closed:["مسكّرة","Closed"],
  replyPh:["اكتب ردك…","Write a reply…"], you:["إنت","You"], team:["فريق الدعم","Support team"], assistant:["المساعد","Assistant"], newReply:["في رد جديد من الدعم","New reply from support"],
};

Object.assign(L, {
  codeTitle:["اكتب رمز التأكيد","Enter the code"], codeSub:["بعتنالك رمز على {e}. اكتبه هون، بدون ما تطلع من التطبيق.","We emailed a code to {e}. Type it here, without leaving the app."],
  codeLabel:["الرمز","Code"], codeGo:["تأكيد","Confirm"], codeBad:["الرمز غلط أو انتهى. جرّب مرة ثانية أو اطلب رمز جديد.","Wrong or expired code. Try again or ask for a new one."],
  codeShort:["الرمز لازم يكون أرقام بس (6 أو أكثر).","The code is digits only (6 or more)."], sendCode:["ابعتلي رمز","Send me a code"],
  codeTip:["الإيميل بيوصل خلال دقيقة. إذا ما لقيته، شوف مجلد الـ Spam.","It arrives within a minute. Not there? Check Spam."],
  gateTitle:["دفتر بيشتغل كتطبيق","Daftar runs as an app"], gateSub:["نزّله على شاشتك ببلاش وبدقيقة، وبيفتح مثل أي تطبيق.","Add it to your home screen in a minute, free. It opens like any app."],
  gateInstall:["ثبّت دفتر الآن","Install Daftar now"], gateHow:["شوف طريقة التنزيل بالفيديو","Watch how to install"], gateWeb:["كمّل من المتصفح","Continue in the browser"],
  gateIos1:["اضغط زر المشاركة تحت (مربع وسهم لفوق).","Tap the Share button (square with an arrow)."], gateIos2:["اختار \"إضافة إلى الشاشة الرئيسية\".","Choose \"Add to Home Screen\"."], gateIos3:["اضغط \"إضافة\"، وافتح دفتر من الأيقونة.","Tap \"Add\", then open Daftar from the icon."],
  gateSafari:["على الآيفون لازم تفتح هالصفحة من Safari.","On iPhone, open this page in Safari."],
  gateAnd1:["اضغط \"ثبّت دفتر الآن\"، أو من القائمة ⋮ اختار \"تثبيت التطبيق\".","Tap \"Install Daftar now\", or ⋮ → \"Install app\"."], gateAnd2:["افتح دفتر من الأيقونة على شاشتك.","Open Daftar from the icon on your screen."],
  gateInApp:["إنت فاتح من داخل تطبيق ثاني. افتح الصفحة بـ Chrome أو Safari عشان تقدر تنزّله.","You're inside another app. Open this page in Chrome or Safari to install."],
  codeLink:["وصلك رابط بدل رمز؟ اضغطه من الإيميل، وبعدها ارجع هون وادخل بإيميلك وكلمة السر.","Got a link instead of a code? Tap it in the email, then come back and sign in."],
  pwDoneBrowser:["تغيّرت كلمة السر ✓ ارجع لتطبيق دفتر وادخل بكلمة السر الجديدة.","Password changed ✓ Go back to the Daftar app and sign in with it."],
  gateDone:["تمام ✓ ارجع لتطبيق دفتر على شاشتك وكمّل من هناك.","Done ✓ Go back to the Daftar app on your home screen."],
});
/* ===== v6: per-folder types, attachments, bank SMS, taxi & delivery, prices ===== */
Object.assign(L, {
  unitKind:["نوع الشغل بهالملف","Kind of work in this folder"], unitKindHint:["كل ملف إله بنود مصاريف تناسبه. مشروع ويب ما بيطلعله إسمنت وحديد.","Each folder gets categories that fit it — a web project won't show cement and steel."],
  manageCats:["بنود المصاريف والدخل","Expense & income categories"], catsOf:["بنود {x}","Categories · {x}"], addCat:["ضيف البند","Add category"], newCat:["بند جديد","New category"],
  newCatPhExp:["مثلاً: كاميرات مراقبة","e.g. CCTV cameras"], newCatPhInc:["مثلاً: دفعة صيانة","e.g. Maintenance payment"],
  catsHint:["هاي البنود بتطلع بس لهالملف. شيل اللي ما بتحتاجه وزيد اللي بتحتاجه.","These show only for this folder. Remove what you don't need, add what you do."],
  catReset:["رجّع البنود الأصلية","Restore the default categories"], eCatName:["اكتب اسم البند","Type a category name"], eCatDup:["هالبند موجود","That category already exists"],
  eCatLast:["لازم يضل بند واحد على الأقل","Keep at least one category"], catAdded:["انضاف البند: {x}","Added: {x}"], addCatHere:["بند مش موجود؟ ضيفه","Missing a category? Add it"], add:["ضيف","Add"],
  time:["الساعة","Time"], payBy:["دفعت","Paid by"], gotBy:["وصلت","Received by"], cash:["كاش","Cash"], card:["بطاقة","Card"], transfer:["تحويل / كليك","Transfer / CliQ"], cheque:["شيك","Cheque"], invNo:["رقم الفاتورة","Invoice no."],
  otMult:["أجر ساعة الإضافي","Overtime hour pay"], ot125:["125% (قانون العمل الأردني)","125% (Jordan labour law)"], otMultHint:["قانون العمل الأردني (المادة 59): الإضافي لا يقل عن 125% من أجر الساعة، و150% بأيام العطل. بيأثر على الدوام الجديد بس.","Jordan's labour law (art. 59): overtime is at least 125% of the hourly wage, 150% on rest days. Applies to new attendance only."],
  attTitle:["الفواتير والصور","Invoices & photos"], attCamera:["صوّر الفاتورة","Snap the invoice"], attFile:["أرفق ملف","Attach a file"],
  attHint:["صور، PDF، Excel أو Word. الصور بتتصغّر لحالها، والملفات ما بيشوفها غير شركتك.","Photos, PDF, Excel or Word. Photos are shrunk automatically; only your company can see the files."],
  attMax:["بتقدر ترفق {n} ملفات بالأكثر","You can attach up to {n} files"], attType:["نوع الملف مش مدعوم. صور، PDF، Excel أو Word بس.","Unsupported file. Photos, PDF, Excel or Word only."],
  attBig:["الملف كبير كتير (الحد 10 ميغا)","File too large (10 MB max)"], attImgFail:["ما قدرنا نقرأ الصورة. جرّب تصوّرها مرة ثانية.","Couldn't read that photo. Try again."],
  attUpFail:["ما انرفع الملف. تأكد من النت وجرّب مرة ثانية.","Upload failed. Check your connection and try again."], attQuota:["وصلت حد التخزين لشركتك","Your company's storage limit is reached"],
  attOpenFail:["ما قدرنا نفتح الملف","Couldn't open the file"], attOpen:["افتح بحجمه الكامل","Open full size"],
  tabShift:["الوردية","Shift"], tabStaffDay:["السائقين","Drivers"], newTrip:["طلعة جديدة","New trip"], drvTrip:["طلعة","trip"],
  drvKeepToday:["اللي ضايلك اليوم","What you keep today"], drvKeepDay:["اللي ضايلك بهاليوم","What you kept that day"], drvTripsN:["{n} طلعات","{n} trips"], km:["كم","km"],
  drvShift:["الوردية","Shift"], drvNoShift:["الوردية ما بلّشت","Shift not started"], drvStarted:["بلّشت {x}","Started {x}"], drvEnded:["خلصت {x}","ended {x}"], odo:["العداد","Odometer"],
  drvStart:["ابدأ الوردية","Start shift"], drvEnd:["سكّر الوردية","End shift"], drvDone:["الوردية خلصت","Shift done"], drvEditShift:["عدّل الوردية","Edit shift"],
  drvStartAt:["بلّشت الساعة","Started at"], drvEndAt:["خلصت الساعة","Ended at"], odoStart:["قراءة العداد بالبداية","Odometer at start"], odoEnd:["قراءة العداد بالنهاية","Odometer at end"],
  odoHint:["اختياري: بتعرف قدّيش بتربح بكل كيلو.","Optional: shows what you make per km."], odoFrom:["بلّشت على {x}","Started at {x}"], odoBad:["قراءة النهاية أقل من البداية","End reading is below the start"],
  drvAddTrip:["سجّل طلعة","Log a trip"], drvBreak:["حساب اليوم","Today's numbers"], drvFares:["الأجرة","Fares"], drvTips:["إكراميات","Tips"], drvComm:["عمولة التطبيقات","Apps' commission"],
  drvOtherInc:["دخل ثاني","Other income"], drvSpend:["مصاريف","Expenses"], drvFuel:["منها بنزين","fuel"], drvNet:["الصافي","Net"],
  drvPerTrip:["بالطلعة","Per trip"], drvPerHour:["بالساعة","Per hour"], drvPerKm:["بالكيلو","Per km"], drvHours:["ساعات الشغل","Hours"],
  drvCashApps:["الكاش والتطبيقات","Cash & apps"], drvCashIn:["كاش بإيدك","Cash in hand"], drvOwedApps:["عمولة عليك للتطبيقات (من الكاش)","You owe the apps (on cash trips)"], drvAppsOwe:["التطبيقات بتدينلك (طلعات البطاقة)","Apps owe you (card trips)"],
  drvCashHint:["بطلعات الكاش العمولة بتضل معك وبتنخصم من رصيدك بالتطبيق، وبطلعات البطاقة التطبيق بيحوّلك الصافي.","On cash trips you hold the commission and the app deducts it; on card trips the app pays you the net."],
  drvByApp:["حسب التطبيق","By app"], drvLog:["طلعات ومصاريف اليوم","Today's trips & expenses"], drvNoTrips:["لسا ما في طلعات اليوم","No trips yet today"], drvAddFuel:["بنزين","Fuel"],
  drvApp:["التطبيق","App"], drvTipX:["إكرامية {x}","tip {x}"], drvCommX:["عمولة {x}","fee {x}"], drvNoCar:["افتح ملف سيارة أول","Open a car folder first"], drvEditTrip:["عدّل الطلعة","Edit trip"],
  drvFare:["الأجرة","Fare"], drvPaidHow:["الدفع","Paid"], drvCardApp:["بطاقة / تطبيق","Card / in app"], drvTip:["إكرامية","Tip"], drvTripKm:["مسافة الطلعة (كم)","Trip distance (km)"], drvWhere:["من وين لوين","From → to"],
  drvSaved:["انسجلت الطلعة: {x}","Trip saved: {x}"], drvMonth:["حساب الشهر","This month"],
  commFor:["عمولة {x} %","{x} commission %"], commHint:["حط نسبة العمولة اللي بياخدها كل تطبيق، وبنحسبلك الصافي لحاله.","Set each app's commission %, and we work out your net."], amount:["المبلغ","Amount"],
  prEx1:["آيفون 16 برو 256 جيجا جديد","iPhone 16 Pro 256GB new"], prEx2:["سعر طن الحديد اليوم بعمّان","Steel price per ton in Amman today"], prEx3:["لابتوب للشغل تحت 500 دينار","Work laptop under 500 JOD"], prEx4:["كرتونة ورق A4","Box of A4 paper"],
});
/* ===== v6.1: human support, quick actions, team invites, sharing ===== */
Object.assign(L, {
  supSubHuman:["ناس حقيقيين بيردّوا عليك","Real people reply to you"], newMsg:["رسالة جديدة","New message"],
  supAsk:["شو بتحتاج؟","What do you need?"], supAskSub:["اختار موضوع أو اكتب سؤالك، وبنرد عليك هون.","Pick a topic or type your question; we'll reply here."],
  sq1:["كيف أبلّش؟","How do I start?"], sq1Text:["مرحبا، بدي أعرف من وين أبلّش وكيف أرتّب شركتي على دفتر.","Hi, how should I set up my business on Daftar?"],
  sq2:["مشكلة بالحساب","A calculation looks wrong"], sq2Text:["مرحبا، في رقم مش مزبوط عندي بـ: ","Hi, a number looks wrong in: "],
  sq3:["اقتراح ميزة","Suggest a feature"], sq3Text:["عندي اقتراح: ","My suggestion: "],
  sq4:["إضافة أشخاص لشركتي","Add people to my company"], sq4Text:["كيف أضيف حدا يشتغل معي على نفس الحساب؟","How do I add someone to my company account?"],
  supReplyTime:["عادةً بنرد خلال ساعات، وبيطلعلك تنبيه أول ما نرد.","We usually reply within hours; you'll see a dot when we do."],
  qTripSub:["أجرة الطلعة بكبستين","Log a fare in two taps"], qAtt:["الدوام","Attendance"], qAttSub:["مين إجا ومين غاب اليوم","Who came in today"],
  qExpSub:["فاتورة، مواد، بنزين…","Invoice, materials, fuel…"], qIncSub:["دفعة من زبون","A client payment"], qAdvSub:["لعامل أو موظف","To a worker"],
  qWhichUnit:["على أي ملف؟","Which folder?"], qWho:["لمين السلفة؟","Advance for whom?"], qSearchName:["ابحث بالاسم","Search by name"],
  joinTitle:["انضم لشركتك","Join your company"], joinSub:["رح تنضم للشركة اللي بعتتلك الكود {c}. اعمل حساب بإيميلك.","You'll join the company that sent code {c}. Create an account with your email."],
  noInviteNew:["ما عندي كود، بدي أفتح شركة جديدة","No code, I'm starting a new company"], haveCode:["عندك كود دعوة من شركتك؟","Got an invite code from your company?"],
  codeEnterSub:["اكتب الكود اللي بعتلك ياه صاحب الشركة (8 حروف).","Enter the code your company owner sent you (8 characters)."],
  inviteCode:["كود الدعوة","Invite code"], orJoin:["أو انضم لشركة موجودة","or join an existing company"], joinBtn:["انضم بالكود","Join with code"],
  eCode:["الكود 8 حروف وأرقام","The code is 8 letters and digits"], eCodeBad:["الكود غلط أو انتهى. اطلب كود جديد من صاحب الشركة.","Wrong or expired code. Ask the owner for a new one."],
  gateKeepCode:["احفظ كود الدعوة: {c} — رح تكتبه بعد ما تنزّل التطبيق.","Keep your invite code: {c} — you'll enter it after installing."],
  teamAccess:["فريق الشركة على دفتر","Team access"], shareApp:["عرّف صاحب شغل على دفتر","Tell a business owner"], shareBtn:["ابعته","Share"],
  copied:["انتسخ","Copied"], copyFail:["ما قدرنا ننسخ، انسخه يدوي","Couldn't copy; copy it by hand"],
  teamIntro:["ضيف رئيس ورشة، محاسب أو شريك يسجّل معك على نفس الحساب: الدوام والمصاريف بينزلوا عندك لحظتها.","Add a foreman, accountant or partner to the same account: their entries show up for you instantly."],
  roleOwner:["صاحب الشركة","Owner"], roleMember:["عضو بالفريق","Team member"], remove:["شيل","Remove"], memberRemoved:["انشال من الشركة","Removed from the company"],
  addPerson:["ضيف شخص","Add a person"], teamRules:["العضو بيسجّل ويعدّل الدوام والفلوس، بس ما بيقدر يغيّر إعدادات الشركة ولا يحذفها ولا يضيف ناس.","Members can log and edit attendance and money, but can't change settings, delete the company or add people."],
  inviteValid:["صالح 7 أيام ولـ 5 أشخاص","Valid 7 days, for up to 5 people"], sendWa:["ابعته واتساب","Send on WhatsApp"], copyLink:["انسخ الرابط","Copy link"],
  inviteMsg:["أهلاً 👋 ضفتك على حساب {co} على تطبيق دفتر، عشان نسجّل الدوام والمصاريف مع بعض.\n\n1) افتح الرابط ونزّل التطبيق: {link}\n2) اعمل حساب واكتب كود الدعوة: {code}","Hi 👋 I added you to {co} on Daftar so we can log attendance and expenses together.\n\n1) Open and install: {link}\n2) Sign up and enter invite code: {code}"],
  shareMsg:["لقيت تطبيق اسمه دفتر 👌 بيحسب رواتب العمال والسلف والإضافي، وبيعرّفك قدّيش كلّف كل مشروع. ببلاش وعربي.","Found an app called Daftar 👌 It handles payroll, advances and overtime, and shows what each project cost. Free, in Arabic."],
  sentWith:["أُرسلت من تطبيق دفتر · daftarapp.co","Sent with Daftar · daftarapp.co"], madeWith:["صُنع بدفتر · daftarapp.co","Made with Daftar · daftarapp.co"],
  growTeamT:["خلّي الفريق يسجّل معك","Let your team log with you"], growTeamS:["رئيس الورشة بيسجّل الدوام من موقعه، وإنت بتشوفه لحظتها.","Your foreman logs attendance on site; you see it instantly."],
  growShareT:["بتعرف حدا لسا بيحسب عالورقة؟","Know someone still doing it on paper?"], growShareS:["ابعتله دفتر برسالة، ببلاش.","Send them Daftar, it's free."],
});
Object.assign(L, {
  cstSend:["ابعت كشف الحساب لـ {x} على الواتساب","Send the statement to {x} on WhatsApp"], client:["العميل","the client"],
  cstHead:["كشف حساب: {x}","Statement: {x}"], cstTo:["إلى: {x}","To: {x}"], cstPaid:["الدفعات:","Payments:"], cstTotalPaid:["المدفوع","Paid so far"], cstLeft:["الباقي","Still due"],
  demoT:["أول مرة؟ شوفه شغّال بثانية","First time? See it working in a second"], demoS:["بنعبّيلك ملف مثال فيه عمال ودوام ومصاريف، وبتمسحه بكبسة.","We'll fill an example folder with staff, attendance and expenses — delete it in one tap."],
  demoBtn:["جرّب بمثال","Try an example"], demoOn:["هاي بيانات مثال. جرّب فيها براحتك، ولما تخلص امسحها.","This is example data. Play with it, then remove it."], demoClear:["امسح المثال","Remove example"],
  demoUnit:["مثال: {x}","Example: {x}"], demoClient:["أبو خالد","Mr. Khaled"], demoP1:["أبو أحمد","Ahmad"], demoP2:["محمد","Mohammad"], demoP3:["سامر","Samer"],
  demoDone:["هاد ملف مثال. كبّس على أي إشي وجرّب.","Here's an example folder. Tap around and try."], demoGone:["انمسح المثال","Example removed"],
});
let LANG = (()=>{ try{ const s = localStorage.getItem("lang"); if(s==="ar"||s==="en") return s; }catch(e){} return /^ar/i.test(navigator.language||"") ? "ar" : (C.DEFAULT_LANG||"ar"); })();
const t = (k, v) => { const e = L[k]; let s = e ? e[LANG==="en"?1:0] : k; if(v) for(const x in v) s = s.split("{"+x+"}").join(v[x]); return s; };
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
  driver:{ name:["تكسي وتوصيل (سائق)","Taxi & delivery driver"], icon:"car", pay:"day", driver:true,
    unit:[["سيارة","سيارات"],["car","cars"]], staff:[["سائق","سائقين"],["driver","drivers"]],
    client:null, budget:null, contract:false, recur:null,
    exp:[["بنزين","Fuel"],["غيار زيت","Oil change"],["صيانة","Maintenance"],["إطارات","Tyres"],["غسيل","Car wash"],["عمولة التطبيق","App commission"],["رصيد وإنترنت","Phone & data"],["قسط السيارة","Car instalment"],["تأمين وترخيص","Insurance & licensing"],["مخالفات","Fines"],["أكل وشرب بالطريق","Food on shift"],["أخرى","Other"]],
    inc:[["كريم","Careem"],["أوبر","Uber"],["جيني","Jeeny"],["طلبات","Talabat"],["زبون مباشر","Direct customer"],["توصيل طلبات","Deliveries"],["إكرامية","Tip"],["أخرى","Other"]],
    platforms:[["كريم","Careem"],["أوبر","Uber"],["جيني","Jeeny"],["طلبات","Talabat"],["زبون مباشر","Direct customer"],["توصيل طلبات","Deliveries"]] },
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
const COLS = ["units","staff","attendance","payments","expenses","income","shifts"];

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
  car:'<path d="M5 16V11l2-5h10l2 5v5"/><path d="M3 16h18v3H3zM5 11h14"/><circle cx="7.5" cy="13.5" r=".8"/><circle cx="16.5" cy="13.5" r=".8"/>',
  clip:'<path d="M8 12.5 14.5 6a3 3 0 0 1 4.2 4.2l-7.4 7.4a5 5 0 0 1-7-7L11 3.9"/>', camera:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  bank:'<path d="M3 9 12 4l9 5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>', search:'<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>', tag:'<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
  file:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>', route:'<circle cx="6" cy="18" r="2.5"/><circle cx="18" cy="6" r="2.5"/><path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5"/>', link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  logout:'<path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10"/>', key:'<circle cx="8" cy="15" r="4"/><path d="m11 12 8-8M16 7l2 2"/>', shield:'<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z"/>',
};
const icon = (k, cls="") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICON[k]||ICON.grid}</svg>`;
const MARK = '<svg class="mark" viewBox="270 300 540 470" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="44"><path d="M330 520 V750 H540 A210 210 0 0 0 540 330 H500"/><path d="M408 560 V672 H540 A132 132 0 0 0 540 408 H540"/></g><path d="M292 412 L362 482 L486 358" stroke="currentColor" stroke-width="44" fill="none"/></svg>';
/* ===== state ===== */
const S = {units:[],staff:[],attendance:[],payments:[],expenses:[],income:[],shifts:[],
  view:"home", uid:null, tab:"account", date:null, period:"week", pstart:null, ready:false,
  mmonth:null, mfilter:"all",
  screen:"loading", authMsg:"", authMsgType:"",
  chat:{open:false, mode:"ai", msgs:[], busy:false, tickets:null, tid:null, unread:false}};
let sb = null, CID = null, USER = null, COMPANY = null, ROLE = null;
const app = document.getElementById("app");

/* ===== helpers ===== */
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const toEn = s => String(s ?? "").replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)).replace(/[٫،,]/g, ".");
const num = v => { const n = parseFloat(toEn(v)); return isFinite(n) ? n : 0; };
const fmt = n => (Math.round((n||0)*100)/100).toLocaleString("en-US",{maximumFractionDigits:2});
const sum = (a,f) => a.reduce((x,y)=>x+(f?f(y):y),0);
const iso = d => new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10);
const today = () => iso(new Date());
const parseD = s => { const [y,m,d] = String(s).split("-").map(Number); return new Date(y,(m||1)-1,d||1); };
const addDays = (s,n) => { const d = parseD(s); d.setDate(d.getDate()+n); return iso(d); };
const validDate = s => /^\d{4}-\d{2}-\d{2}$/.test(String(s||"")) && !isNaN(parseD(s));
const dow = s => parseD(s).getDay();
const dayName = s => DAYS[LANG][dow(s)];
const dmy = s => { const d = parseD(s); return `<span class="num">${d.getDate()}/${d.getMonth()+1}</span>`; };
const fdate = s => s ? `${dayName(s)} ${dmy(s)}` : "";
const monthName = s => { const d = parseD(s); return `${MONTHS[LANG][d.getMonth()]} <span class="num">${d.getFullYear()}</span>`; };
const mins = x => { if(!x || !/^\d{1,2}:\d{2}$/.test(x)) return null; const [h,m] = x.split(":").map(Number); return h*60+(m||0); };
const t12 = x => { if(!x) return ""; let [h,m] = x.split(":").map(Number); const ap = h>=12 ? (LANG==="en"?"PM":"م") : (LANG==="en"?"AM":"ص"); h = h%12 || 12; return `<span class="num">${h}${m?":"+String(m).padStart(2,"0"):""}</span> ${ap}`; };
const hrsTxt = h => { if(!h) return ""; const m = Math.round(h*60), H = Math.floor(m/60), M = m%60;
  if(LANG==="en") return [H?`${H}h`:"", M?`${M}m`:""].filter(Boolean).join(" ");
  return (H ? (H===1?"ساعة":H===2?"ساعتين":`<span class="num">${H}</span> ساعات`) : "") + (H&&M?" و":"") + (M?`<span class="num">${M}</span> دقيقة`:""); };
const strip = o => { const c = {...o}; delete c.id; return c; };
const byDateDesc = (a,b) => (b.date||"").localeCompare(a.date||"") || (b.createdAt||0)-(a.createdAt||0);
function lsGet(k,d){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch(e){ return d; } }
function lsSet(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
const initials = s => String(s||"?").trim().split(/\s+/).slice(0,2).map(w=>w[0]).join("");

/* ===== company settings ===== */
const ST = () => { const s = (COMPANY && COMPANY.settings) || {};
  return { type: P[s.type] ? s.type : "other", currency: CUR[s.currency] ? s.currency : (C.DEFAULT_CURRENCY||"JOD"),
    weekend: Array.isArray(s.weekend) ? s.weekend.map(Number).filter(d=>d>=0&&d<=6) : [5],
    shiftIn: s.shiftIn || "08:00", shiftOut: s.shiftOut || "17:00", payPeriod: s.payPeriod==="month"||s.payPeriod==="week" ? s.payPeriod : null,
    otMult: [1,1.25,1.5].includes(Number(s.otMult)) ? Number(s.otMult) : 1 }; };
const PRE = () => P[ST().type];
const LI = () => LANG==="en" ? 1 : 0;
const term = (k, plural) => { const p = PRE()[k][LI()]; return plural ? p[1] : p[0]; };
const cap = s => LANG==="en" ? s.charAt(0).toUpperCase()+s.slice(1) : s;
const tv = (k, v={}) => t(k, {unit:term("unit"), units:term("unit",true), Units:cap(term("unit",true)), staff:term("staff"), staffs:term("staff",true), ...v});
const cat = pair => pair[LI()];
/* every preset category of every business type, so a folder of another type still shows translated names */
const ALLCATS = (()=>{ const m = new Map(); TYPES.forEach(k=>[...P[k].exp, ...P[k].inc].forEach(p=>{ if(!m.has(p[0])) m.set(p[0],p); if(!m.has(p[1])) m.set(p[1],p); })); return m; })();
const catLabel = v => { const f = ALLCATS.get(v); return f ? cat(f) : String(v||""); };
/* each folder can be its own kind of work (a web project inside a contracting company), with its own list of categories */
const unitKind = u => (u && P[u.kind]) ? u.kind : ST().type;
const KP = u => P[unitKind(u)];
const catKey = c => String(c||"").replace(/\s+/g," ").trim().slice(0,40);
function unitCats(u, kind){
  const base = KP(u)[kind], own = u && u[kind==="exp"?"expCats":"incCats"];
  if(!Array.isArray(own) || !own.length) return base;
  const list = own.map(catKey).filter(Boolean).map(k=>ALLCATS.get(k) || [k,k]);
  return list.length ? list : base;
}
const curName = () => CUR[ST().currency][LI()];
const money = n => `<span class="money">${fmt(n)}</span><span class="cur">${esc(curName())}</span>`;
const moneyTxt = n => `${fmt(n)} ${curName()}`;
const isOff = d => ST().weekend.includes(dow(d));
const workDaysWeek = () => Math.max(1, 7 - ST().weekend.length);
function workDaysMonth(d){ const x = parseD(d), y = x.getFullYear(), m = x.getMonth(), n = new Date(y,m+1,0).getDate(); let c = 0;
  for(let i=1;i<=n;i++) if(!ST().weekend.includes(new Date(y,m,i).getDay())) c++; return Math.max(1,c); }
function weekStartOf(d){ const w = ST().weekend; let start = 6;
  if(w.length) for(let i=0;i<7;i++){ if(!w.includes(i) && w.includes((i+6)%7)){ start = i; break; } }
  let x = d; for(let i=0;i<7 && dow(x)!==start;i++) x = addDays(x,-1); return x; }
const monthStartOf = d => String(d).slice(0,8)+"01";
const monthEnd = d => { const x = parseD(d); return iso(new Date(x.getFullYear(), x.getMonth()+1, 0)); };
const addMonths = (d,n) => { const x = parseD(d); return iso(new Date(x.getFullYear(), x.getMonth()+n, 1)); };
const periodEnd = () => S.period==="month" ? monthEnd(S.pstart) : addDays(S.pstart,6);
const periodStartFor = d => S.period==="month" ? monthStartOf(d) : weekStartOf(d);
function lastWorkDay(a,b){ let x = b; for(let i=0;i<7 && isOff(x) && x>a;i++) x = addDays(x,-1); return x; }

/* ===== money rules ===== */
const dayRate = (s, d) => { if(!s) return 0; const r = num(s.rate);
  return s.rateType==="day" ? r : s.rateType==="month" ? r/workDaysMonth(d||today()) : r/workDaysWeek(); };
const shiftHours = () => { const a = mins(ST().shiftIn), b = mins(ST().shiftOut); return Math.max(1, ((b<a?b+1440:b)-a)/60); };
const otRate = (s, d) => num(s && s.otRate) || dayRate(s,d)/shiftHours()*ST().otMult;
function timeCalc(tin, tout){
  const a = mins(tin), b0 = mins(tout); if(a==null||b0==null) return {ot:0,late:0,early:0};
  const b = b0<a ? b0+1440 : b0, s0 = mins(ST().shiftIn), e0 = mins(ST().shiftOut), h = m => Math.round(m/6)/10;
  return {ot:h(Math.max(0,b-Math.max(a,e0))), late:h(Math.max(0,a-s0)), early:h(Math.max(0,e0-b))};
}
const came = a => a && a.status==="present";
function dayPay(a){
  if(!came(a)) return {day:0, ot:0, otH:0, total:0};
  const s = staffById(a.staffId);
  const dr = a.dayRate!=null ? num(a.dayRate) : dayRate(s,a.date);
  const or = a.otRate!=null ? num(a.otRate) : otRate(s,a.date);
  const x = timeCalc(a.in||ST().shiftIn, a.out||ST().shiftOut);
  return {day:dr, ot:x.ot*or, otH:x.ot, total:dr+x.ot*or};
}
const unitById = id => S.units.find(u=>u.id===id);
const staffById = id => S.staff.find(s=>s.id===id);
const attOf = (sid,d) => S.attendance.find(a=>a.staffId===sid && a.date===d);
const activeUnits = () => S.units.filter(u=>u.status!=="closed").sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
const unitStaff = uid => S.staff.filter(s=>s.active!==false && s.unitId===uid).sort((a,b)=>(a.createdAt||0)-(b.createdAt||0));
const inRange = (d,a,b) => d>=a && d<=b;
/* a trip's app commission: % of the fare (tips are the driver's), set per platform on the car's folder */
function commOf(x){ if(!x || !x.trip) return 0; const u = unitById(x.unitId), pct = u && u.comm ? num(u.comm[x.category]) : 0;
  return pct>0 ? Math.max(0, num(x.amount)-num(x.tip))*Math.min(60,pct)/100 : 0; }
function unitTotals(uid, a, b){
  const f = x => x.unitId===uid && (!a || inRange(x.date,a,b));
  const incs = S.income.filter(f), comm = sum(incs, commOf);
  const exp = sum(S.expenses.filter(f), x=>num(x.amount)) + comm, inc = sum(incs, x=>num(x.amount));
  const lab = sum(S.attendance.filter(f), x=>dayPay(x).total);
  return {exp, inc, lab, comm, cost:exp+lab, profit:inc-exp-lab};
}
function companyTotals(a,b){
  const f = x => inRange(x.date,a,b);
  const incs = S.income.filter(f), comm = sum(incs, commOf);
  const exp = sum(S.expenses.filter(f), x=>num(x.amount)) + comm, inc = sum(incs, x=>num(x.amount)), lab = sum(S.attendance.filter(f), x=>dayPay(x).total);
  return {exp, inc, lab, comm, profit:inc-exp-lab};
}
/* one driver's day (or any range) on one car */
function driverDay(uid, a, b){
  b = b || a;
  const f = x => x.unitId===uid && inRange(x.date,a,b);
  const trips = S.income.filter(x=>f(x) && x.trip), other = S.income.filter(x=>f(x) && !x.trip), ex = S.expenses.filter(f);
  const gross = sum(trips, x=>num(x.amount)-num(x.tip)), tips = sum(trips, x=>num(x.tip)), comm = sum(trips, commOf);
  const cash = sum(trips.filter(x=>x.payBy==="cash"), x=>num(x.amount)), card = sum(trips.filter(x=>x.payBy!=="cash"), x=>num(x.amount));
  const commOnCash = sum(trips.filter(x=>x.payBy==="cash"), commOf), commOnCard = sum(trips.filter(x=>x.payBy!=="cash"), commOf);
  const otherInc = sum(other, x=>num(x.amount)), spend = sum(ex, x=>num(x.amount)), fuel = sum(ex.filter(x=>x.category==="بنزين"), x=>num(x.amount));
  const sh = S.shifts.filter(f), km = sum(sh, x=>Math.max(0, num(x.endKm)-num(x.startKm))) + sum(trips, x=>num(x.km)) * (sh.some(x=>num(x.endKm)>0)?0:1);
  const hours = sum(sh, x=>{ const s0 = mins(x.startTime), e0 = mins(x.endTime); return s0!=null && e0!=null ? ((e0<s0?e0+1440:e0)-s0)/60 : 0; });
  const net = gross + tips + otherInc - comm - spend;
  const byPl = {}; trips.forEach(x=>{ const k = x.category; byPl[k] = byPl[k] || {n:0, amt:0, comm:0}; byPl[k].n++; byPl[k].amt += num(x.amount); byPl[k].comm += commOf(x); });
  return {trips, n:trips.length, gross, tips, comm, cash, card, owedToApps:commOnCash, appsOweYou:card-commOnCard, otherInc, spend, fuel, km, hours, net, byPl,
    perKm: km ? net/km : 0, perHour: hours ? net/hours : 0, perTrip: trips.length ? (gross+tips)/trips.length : 0};
}
function account(s, a, b){
  const att = S.attendance.filter(x=>x.staffId===s.id && inRange(x.date,a,b));
  const worked = att.filter(came), absentN = att.filter(x=>x.status==="absent").length;
  const pays = worked.map(dayPay);
  const days = worked.length, base = sum(pays,p=>p.day), ot = sum(pays,p=>p.ot), otH = sum(pays,p=>p.otH);
  const lateH = sum(worked,x=>timeCalc(x.in,x.out).late);
  const pp = S.payments.filter(p=>p.staffId===s.id && inRange(p.date,a,b)).sort((x,y)=>(x.date||"").localeCompare(y.date||""));
  const adv = sum(pp.filter(p=>p.kind!=="salary"),p=>num(p.amount)), paid = sum(pp.filter(p=>p.kind==="salary"),p=>num(p.amount));
  const earned = base+ot;
  return {days, absentN, base, ot, otH, lateH, earned, adv, paid, pp, remaining:earned-adv-paid};
}
/* recurring monthly dues (rent, retainers, subscriptions) */
function recurState(u, monthDate){
  const R = KP(u).recur; if(!R || !num(u.recurAmount)) return null;
  const ms = monthStartOf(monthDate||today()), me = monthEnd(ms), amount = num(u.recurAmount), day = Math.min(28, Math.max(1, Number(u.recurDay)||1));
  const got = sum(S.income.filter(x=>x.unitId===u.id && x.category===R.cat && inRange(x.date,ms,me)), x=>num(x.amount));
  const dueDate = ms.slice(0,8)+String(day).padStart(2,"0");
  const state = got >= amount-0.005 ? "paid" : (today() > dueDate && today().slice(0,7)===ms.slice(0,7)) || today() > me ? "late" : "due";
  return {amount, got, day, state, label:R.label[LI()]};
}

/* ===== storage (Supabase) ===== */
let toastT;
function toast(m){ const el = document.getElementById("toast"); el.textContent = m; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(()=>el.hidden=true, 3200); }
function errMsg(e){ const m = String((e && (e.message || e.error_description)) || "");
  if(/row-level security|permission denied/i.test(m)) return t("eRls");
  if(/record limit/i.test(m)) return t("eLimit");
  if(/JWT|session/i.test(m)) return t("eSession");
  return t("eSave"); }
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())+Math.random().toString(36).slice(2)).replace(/[^A-Za-z0-9_-]/g,"");
function applyLocal(col, id, data){ const arr = S[col]; if(!arr) return;
  const i = arr.findIndex(x=>x.id===id);
  if(data===null){ if(i>=0) arr.splice(i,1); } else if(i>=0) arr[i] = {...data, id}; else arr.push({...data, id}); }
async function save(col,id,data,quiet){
  if(!sb || !CID){ toast(t("signInFirst")); return false; }
  id = id || newId();
  const { error } = await sb.from("records").upsert({company_id:CID, col, id, data}, {onConflict:"company_id,col,id"});
  if(error){ toast(errMsg(error)); return false; }
  applyLocal(col,id,data); if(!quiet) render(); return true;
}
async function remove(col,id){
  const { error } = await sb.from("records").delete().eq("company_id",CID).eq("col",col).eq("id",id);
  if(error){ toast(errMsg(error)); return false; }
  applyLocal(col,id,null); render(); return true;
}
async function createDoc(col,data){ const id = newId(); return (await save(col,id,data)) ? id : null; }
async function loadAll(){
  const fresh = {}; COLS.forEach(c=>fresh[c]=[]);
  for(let from=0;;from+=1000){
    const { data, error } = await sb.from("records").select("col,id,data").eq("company_id",CID).range(from, from+999);
    if(error){ toast(t("eLoad")); return false; }
    data.forEach(r=>{ if(fresh[r.col]) fresh[r.col].push({...r.data, id:r.id}); });
    if(data.length<1000) break;
  }
  COLS.forEach(c=>S[c]=fresh[c]); S.ready = true; return true;
}
let channel = null, refreshT = null;
const overlaysClosed = () => document.getElementById("sheet").hidden && !S.chat.open;
function subscribe(){
  if(channel) sb.removeChannel(channel);
  const onRow = p => { const r = p.new; if(!r || r.company_id!==CID) return; applyLocal(r.col, r.id, r.data); if(overlaysClosed()) render(); };
  channel = sb.channel("rec-"+CID)
    .on("postgres_changes", {event:"INSERT", schema:"public", table:"records", filter:"company_id=eq."+CID}, onRow)
    .on("postgres_changes", {event:"UPDATE", schema:"public", table:"records", filter:"company_id=eq."+CID}, onRow)
    .subscribe();
  clearInterval(refreshT);
  refreshT = setInterval(()=>{ if(!document.hidden && CID){ if(overlaysClosed()) loadAll().then(render); checkTickets(); } }, 90000);
}
document.addEventListener("visibilitychange", ()=>{ if(!document.hidden && CID && overlaysClosed()) loadAll().then(render); });
/* ===== render ===== */
function setLang(l){ LANG = l==="en" ? "en" : "ar"; try{ localStorage.setItem("lang", LANG); }catch(e){} applyDir(); render(); if(S.chat.open) renderChat(); }
function applyDir(){ document.documentElement.lang = LANG; document.documentElement.dir = LANG==="en" ? "ltr" : "rtl"; document.title = t("appName");
  document.getElementById("sheetCancel").textContent = t("cancel"); }
function render(){
  applyDir();
  const fab = document.getElementById("fab");
  if(S.screen!=="app"){ fab.hidden = true; app.innerHTML = authView(); return; }
  const inUnit = S.view==="unit" && unitById(S.uid);
  if(S.view==="unit" && !inUnit) S.view = "units";
  fab.hidden = !S.ready || !activeUnits().length || (inUnit && unitById(S.uid).status==="closed");
  fab.setAttribute("aria-label", t("whatAdd"));
  const body = !S.ready ? `<div class="panel empty"><b>${t("loadingBook")}</b></div>` :
    S.view==="unit" ? viewUnit() : S.view==="units" ? viewUnits() : S.view==="team" ? viewTeam() : S.view==="money" ? viewMoney() : viewHome();
  app.innerHTML = shell(body);
}
function navItems(){
  return [["home","home",t("navHome")],["units","folder",tv("navUnits")],["team","users",t("navTeam")],["money","wallet",t("navMoney")]];
}
function shell(body){
  const cur = S.view==="unit" ? "units" : S.view;
  const items = navItems().map(([k,ic,l])=>`<button class="nav-i ${cur===k?"on":""}" data-act="go" data-id="${k}" ${cur===k?'aria-current="page"':""}>${icon(ic)}<span>${esc(l)}</span></button>`).join("");
  const sup = `<button class="nav-i" data-act="support">${icon("chat")}<span>${t("navSupport")}</span>${S.chat.unread?'<i class="dot"></i>':""}</button>`;
  return `<div class="shell">
    <aside class="side"><div class="side-brand">${MARK}<div><b>${esc(t("appName"))}</b><span>${esc(COMPANY&&COMPANY.name||"")}</span></div></div>
      <nav class="side-nav" aria-label="${t("navHome")}">${items}${sup}</nav>
      <div class="side-foot"><button class="btn ghost sm" data-act="lang">${icon("globe")}${t("otherLang")}</button><button class="btn ghost sm" data-act="account">${icon("gear")}${t("account")}</button></div></aside>
    <main class="main"><header class="topbar"><div class="tb-brand">${MARK}<b>${esc(COMPANY&&COMPANY.name||t("appName"))}</b></div>
      <div class="tbtns"><button class="iconbtn" data-act="lang" aria-label="${t("language")}">${icon("globe")}</button><button class="iconbtn" data-act="support" aria-label="${t("navSupport")}">${icon("chat")}${S.chat.unread?'<i class="dot"></i>':""}</button><button class="iconbtn" data-act="account" aria-label="${t("account")}">${icon("gear")}</button></div></header>
      <div class="wrap">${body}</div></main>
    <nav class="bottom-nav" aria-label="${t("navHome")}">${items}${sup}</nav></div>`;
}
const pageHead = (title, sub, actions="") => `<div class="phead"><div class="col"><h1>${title}</h1>${sub?`<span class="sub">${sub}</span>`:""}</div>${actions}</div>`;

/* ----- home / dashboard ----- */
function viewHome(){
  const ms = monthStartOf(today()), m = companyTotals(ms, monthEnd(ms));
  let h = pageHead(t("hello",{x:esc(COMPANY&&COMPANY.name||"")}), `${esc(PRE().name[LI()])} · ${monthName(ms)}`);
  const hasUnit = S.units.length>0, hasStaff = S.staff.length>0, hasAtt = S.attendance.length>0, hasMoney = S.expenses.length+S.income.length>0;
  if(!(hasUnit && hasStaff && (hasAtt||hasMoney))){
    const steps = [[hasUnit, tv("ob1"), "newUnit"], [hasStaff, tv("ob2"), hasUnit?"openFirst":"newUnit"], [hasAtt||hasMoney, tv("ob3"), hasUnit?"openFirst":"newUnit"]];
    return h + (hasUnit ? "" : `<div class="panel demo-cta"><div class="col"><b>${t("demoT")}</b><span class="sub">${t("demoS")}</span></div><button class="btn primary" data-act="demoLoad">${icon("bolt")}${t("demoBtn")}</button></div>`)
      + `<div class="panel start"><b class="start-t">${t("obStart")}</b><span class="sub">${t("obStartSub")}</span>
      <ol class="steps">${steps.map(([done,txt,act],i)=>`<li class="${done?"done":""}"><span class="step-n">${done?icon("check"):`<span class="num">${i+1}</span>`}</span><span class="step-t">${txt}</span>${done?"":`<button class="btn sm ${steps.findIndex(x=>!x[0])===i?"primary":""}" data-act="${act}">${t("doIt")}</button>`}</li>`).join("")}</ol></div>`
      + (hasUnit ? `<div class="qgrid home-q">${quickTiles()}</div><div class="folders">${activeUnits().slice(0,4).map(folder).join("")}</div>` : "");
  }
  if(hasDemo()) h += `<div class="alert info demo-bar">${icon("bolt")}<span>${t("demoOn")}</span><button class="btn sm" data-act="demoClear">${t("demoClear")}</button></div>`;
  h += `<div class="qgrid home-q">${quickTiles()}</div>`;
  h += `<div class="kpis">
    <div class="kpi"><span class="label">${t("income")}</span><b class="pos">${money(m.inc)}</b></div>
    <div class="kpi"><span class="label">${t("expenses")}</span><b>${money(m.exp)}</b></div>
    <div class="kpi"><span class="label">${t("salaries")}</span><b>${money(m.lab)}</b></div>
    <div class="kpi hero ${m.profit<0?"neg":""}"><span class="label">${m.profit<0?t("loss"):t("profit")} · ${t("thisMonth")}</span><b>${money(Math.abs(m.profit))}</b></div></div>`;
  // trend
  const months = [...Array(6)].map((_,i)=>addMonths(ms,i-5));
  const vals = months.map(x=>companyTotals(x, monthEnd(x)).profit), mx = Math.max(1,...vals.map(Math.abs));
  h += `<div class="panel"><span class="label">${t("last6")}</span><div class="trend">${months.map((x,i)=>`<div class="tcol"><span class="num v ${vals[i]<0?"negv":""}">${fmt(vals[i])}</span><div class="tbar"><i class="${vals[i]<0?"neg":""}" style="height:${Math.max(3,Math.abs(vals[i])/mx*100)}%"></i></div><span class="m">${MONTHS[LANG][parseD(x).getMonth()]}</span></div>`).join("")}</div></div>`;
  // attention
  const items = [];
  activeUnits().forEach(u=>{
    const x = unitTotals(u.id), b = num(u.budget), r = recurState(u);
    if(b && x.cost/b>=0.8) items.push(["warn","alert",t("aOver80",{u:esc(u.name),p:`<span class="num">${Math.round(x.cost/b*100)}</span>`})]);
    if(r && r.state==="late") items.push(["bad","clock",`${esc(u.name)}: ${esc(r.label)} — ${t("late_")} (${t("partPaid",{a:fmt(r.got),b:moneyTxt(r.amount)})})`]);
    if(KP(u).contract && b && b-x.inc>0.005 && u.client) items.push(["info","wallet",t("aClient",{u:esc(u.name),c:esc(u.client),x:money(b-x.inc)})]);
    if(!isOff(today()) && unitStaff(u.id).length && !unitStaff(u.id).some(s=>attOf(s.id,today()))) items.push(["info","users",t("aUnmarked",{u:esc(u.name)})]);
  });
  const ps = periodStartFor(today()), pe = S.period==="month" ? monthEnd(ps) : addDays(ps,6);
  const owed = sum(S.staff.filter(s=>s.active!==false), s=>Math.max(0,account(s,ps,pe).remaining));
  if(owed>0.005) items.push(["info","users",t("aOwed",{x:money(owed),p:S.period==="month"?t("monthW"):t("weekW")})]);
  h += `<div class="panel"><span class="label">${t("attention")}</span>${items.length?`<div class="alerts">${items.slice(0,8).map(([k,ic,txt])=>`<div class="alert ${k}">${icon(ic)}<span>${txt}</span></div>`).join("")}</div>`:`<div class="alert good">${icon("check")}<span>${t("allGood")}</span></div>`}</div>`;
  // recurring dues
  { const rs = activeUnits().map(u=>[u,recurState(u)]).filter(x=>x[1]);
    if(rs.length) h += `<div class="panel"><span class="label">${t("dueMonth",{label:esc(rs[0][1].label)})}</span><div class="list">${rs.map(([u,r])=>`<button class="row" data-act="openUnit" data-id="${esc(u.id)}"><div class="m"><b>${esc(u.name)}</b><span class="sub">${u.client?esc(u.client)+" · ":""}${t("partPaid",{a:fmt(r.got),b:moneyTxt(r.amount)})}</span></div><span class="pill ${r.state==="paid"?"good":r.state==="late"?"bad":"warn"}">${r.state==="paid"?t("paid"):r.state==="late"?t("late_"):t("dueOn",{d:`<span class="num">${r.day}</span>`})}</span></button>`).join("")}</div></div>`; }
  h += `<div class="sec-head"><b>${esc(tv("activeUnits"))}</b><button class="btn primary sm" data-act="newUnit">${icon("plus")}${esc(tv("newUnit").replace(/^\+\s*/,""))}</button></div>`;
  const act = activeUnits();
  h += act.length ? `<div class="folders">${act.slice(0,6).map(folder).join("")}</div>` : `<div class="panel empty"><b>${tv("noUnits")}</b><span>${tv("noUnitsSub")}</span></div>`;
  if(ROLE==="owner" && S.staff.length>=2) h += `<div class="panel grow"><div class="col"><b>${t("growTeamT")}</b><span class="sub">${t("growTeamS")}</span></div><button class="btn sm" data-act="team">${icon("users")}${t("addPerson")}</button></div>`;
  h += `<div class="panel grow"><div class="col"><b>${t("growShareT")}</b><span class="sub">${t("growShareS")}</span></div><button class="btn sm" data-act="shareApp">${icon("send")}${t("shareBtn")}</button></div>`;
  return h;
}
function viewUnits(){
  const act = activeUnits(), done = S.units.filter(u=>u.status==="closed").sort((a,b)=>(b.closedAt||"").localeCompare(a.closedAt||""));
  let h = pageHead(esc(cap(term("unit",true))), "", `<button class="btn primary" data-act="newUnit">${icon("plus")}${esc(tv("newUnit").replace(/^\+\s*/,""))}</button>`);
  if(!act.length && !done.length) return h + `<div class="panel empty">${icon("folder","big")}<b>${tv("noUnits")}</b><span>${tv("noUnitsSub")}</span></div>`;
  if(act.length) h += `<div class="folders">${act.map(folder).join("")}</div>`;
  if(done.length) h += `<details class="panel"><summary>${esc(tv("finishedUnits"))} (<span class="num">${done.length}</span>)</summary><div class="folders">${done.map(folder).join("")}</div></details>`;
  return h;
}
function folder(u){
  const x = unitTotals(u.id), n = unitStaff(u.id).length, r = recurState(u), b = num(u.budget);
  const pct = b ? Math.min(100, Math.round(x.cost/b*100)) : 0;
  return `<button class="folder ${u.status==="closed"?"closed":""}" data-act="openUnit" data-id="${esc(u.id)}">
    <div class="f-top"><span class="f-ic">${icon(KP(u).icon)}</span><div class="col"><h3>${esc(u.name)}</h3><span class="sub">${[u.client,u.location].filter(Boolean).map(esc).join(" · ")||"&nbsp;"}</span></div>
    ${r?`<span class="pill ${r.state==="paid"?"good":r.state==="late"?"bad":"warn"}">${r.state==="paid"?t("paid"):r.state==="late"?t("late_"):esc(r.label)}</span>`:""}</div>
    <div class="f-stats"><div><span class="label">${u.status==="closed"?t("cost"):t("costSoFar")}</span><b>${money(x.cost)}</b></div>
      <div><span class="label">${x.profit<0?t("loss"):t("profit")}</span><b class="${x.profit<0?"negv":x.inc?"pos":""}">${money(Math.abs(x.profit))}</b></div>
      <div><span class="label">${esc(cap(term("staff",true)))}</span><b class="num">${n}</b></div></div>
    ${b?`<div class="meter"><i class="${pct>=100?"over":pct>=80?"warn":""}" style="width:${pct}%"></i></div>`:""}</button>`;
}

/* ----- one unit ----- */
function viewUnit(){
  const u = unitById(S.uid);
  const meta = [unitKind(u)!==ST().type ? esc(KP(u).name[LI()]) : "", u.client ? `${esc(KP(u).client?KP(u).client[LI()]:"")}: ${esc(u.client)}` : "", u.location ? esc(u.location) : ""].filter(Boolean).join(" · ");
  let h = `<button class="back" data-act="go" data-id="units">${icon(LANG==="en"?"chevE":"chevS")}${esc(cap(term("unit",true)))}</button>
  ${pageHead(esc(u.name), meta, `<button class="btn ghost sm" data-act="editUnit">${icon("gear")}${t("edit")}</button>`)}`;
  const drv = !!KP(u).driver, hasStaff = unitStaff(u.id).length>0;
  const tabs = drv ? [["today",t("tabShift")],["money",t("tabMoney")],["summary",t("tabSummary")],...(hasStaff?[["team",t("tabStaffDay")],["account",t("tabAccount")]]:[])]
    : [["today",t("tabToday")],["account",t("tabAccount")],["money",t("tabMoney")],["summary",t("tabSummary")]];
  if(!tabs.some(x=>x[0]===S.tab)) S.tab = "today";
  h += `<div class="tabs ${tabs.length>4?"five":""}" role="tablist">${tabs.map(([k,l])=>`<button role="tab" data-act="tab" data-id="${k}" aria-selected="${S.tab===k}">${esc(l)}</button>`).join("")}</div>`;
  return h + (S.tab==="money" ? tabMoney(u) : S.tab==="summary" ? tabSummary(u) : S.tab==="account" ? tabAccount(unitStaff(u.id)) : S.tab==="team" ? tabToday(u) : drv ? tabShift(u) : tabToday(u));
}
function tabToday(u){
  const ss = unitStaff(u.id), d = S.date, isToday = d===today();
  const recs = ss.map(s=>[s, attOf(s.id,d)]);
  const present = recs.filter(([s,a])=>came(a) && a.unitId===u.id);
  const absentN = recs.filter(([s,a])=>a && a.status==="absent").length;
  const owe = sum(present,([s,a])=>dayPay(a).total), marked = recs.filter(([s,a])=>a).length;
  const prev = LANG==="en" ? "chevE" : "chevS", next = LANG==="en" ? "chevS" : "chevE";
  let h = `<div class="daybar"><button class="iconbtn" data-act="day" data-id="-1" aria-label="${t("prevDay")}">${icon(prev)}</button>
    <div class="d"><b>${isToday?t("today")+" · ":""}${fdate(d)}</b>${isToday?"":`<button class="linkbtn" data-act="day" data-id="0">${t("backToday")}</button>`}</div>
    <button class="iconbtn" data-act="day" data-id="1" aria-label="${t("nextDay")}">${icon(next)}</button></div>`;
  if(isOff(d)) h += `<div class="alert warn">${icon("calendar")}<span>${t("weekendDay")}</span></div>`;
  h += `<div class="owe">${MARK}<span class="label">${isToday?tv("oweToday"):tv("oweDay")}</span><b>${money(owe)}</b>
    <span class="sub">${t("cameOf",{a:`<span class="num">${present.length}</span>`,b:`<span class="num">${ss.length}</span>`})}${absentN?" · "+t("absentDed",{n:`<span class="num">${absentN}</span>`}):""}</span></div>`;
  if(!ss.length){
    h += `<div class="panel empty">${icon("users","big")}<b>${tv("noStaff")}</b><span>${tv("noStaffSub")}</span><button class="btn primary" data-act="addStaff">${tv("addStaff")}</button></div>`;
  } else {
    h += `<div class="sec-head"><b>${esc(cap(term("staff",true)))} <span class="sub num">${present.length}/${ss.length}</span></b>${marked<ss.length && !isOff(d)?`<button class="btn primary sm" data-act="allCame">${icon("check")}${t("allCame")}</button>`:""}</div>`;
    h += `<div class="cards">${recs.map(([s,a])=>staffCard(s,a)).join("")}</div>`;
    h += `<button class="btn dashed" data-act="addStaff">${icon("plus")}${tv("addStaff").replace(/^\+\s*/,"")}</button>`;
  }
  const exT = S.expenses.filter(x=>x.unitId===u.id && x.date===d), inT = S.income.filter(x=>x.unitId===u.id && x.date===d);
  h += `<div class="panel"><div class="whead"><b>${isToday?t("todayMoney"):t("dayMoney")}</b>${exT.length||inT.length?`<span class="sub">${t("spent")} ${money(sum(exT,x=>num(x.amount)))}${inT.length?` · ${t("received")} <span class="pos">${money(sum(inT,x=>num(x.amount)))}</span>`:""}</span>`:""}</div>
    ${exT.length||inT.length?`<div class="list">${[...exT.map(x=>["exp",x]),...inT.map(x=>["inc",x])].map(([k,x])=>txRow(k,x,false)).join("")}</div>`:`<span class="hint">${t("noMoneyToday")}</span>`}
    ${u.status!=="closed"?`<div class="two"><button class="btn" data-act="newExp">${icon("minus")}${t("expense")}</button><button class="btn" data-act="newInc">${icon("plus")}${t("incomeOne")}</button></div>`:""}</div>`;
  return h;
}
function staffCard(s,a){
  const st = a ? (came(a) ? "present" : "absent") : "";
  const tp = S.payments.filter(x=>x.staffId===s.id && x.date===S.date);
  const dr = dayRate(s, S.date);
  let body = "";
  if(st==="present"){
    const pay = dayPay(a), x = timeCalc(a.in||ST().shiftIn, a.out||ST().shiftOut);
    body = `<div class="wline"><span class="sub">${icon("clock")}${t("fromTo",{a:t12(a.in||ST().shiftIn),b:t12(a.out||ST().shiftOut)})}</span><b class="pos">${money(pay.total)}</b></div>
      ${x.late||x.ot||x.early?`<div class="chips-row">${x.late?`<span class="pill warn">${t("late",{x:hrsTxt(x.late)})}</span>`:""}${x.early?`<span class="pill warn">${t("early",{x:hrsTxt(x.early)})}</span>`:""}${x.ot?`<span class="pill good">${t("ot",{x:hrsTxt(x.ot)})} +${fmt(pay.ot)}</span>`:""}</div>`:""}`;
  } else if(st==="absent") body = `<div class="wline"><span class="negv strong">${t("absentNote",{x:money(dr)})}</span></div>`;
  return `<div class="wcard ${st}">
    <div class="whead"><div class="who"><span class="avatar">${esc(initials(s.name))}</span><div class="col"><b>${esc(s.name)}</b><span class="sub">${s.role?esc(s.role)+" · ":""}${t("dailyIs",{x:money(dr)})}</span></div></div>
      <button class="iconbtn sm" data-act="editStaff" data-id="${esc(s.id)}" aria-label="${t("edit")}">${icon("gear")}</button></div>
    <div class="yesno"><button class="y ${st==="present"?"on":""}" data-act="mark" data-id="${esc(s.id)}" data-s="present" aria-pressed="${st==="present"}">${icon("check")}${t("came")}</button><button class="n ${st==="absent"?"on":""}" data-act="mark" data-id="${esc(s.id)}" data-s="absent" aria-pressed="${st==="absent"}">${icon("x")}${t("absent")}</button></div>
    ${body}
    <div class="wfoot"><button class="btn sm" data-act="advance" data-id="${esc(s.id)}">${icon("plus")}${t("addAdvance")}</button>${st==="present"?`<button class="btn sm ghost" data-act="times" data-id="${esc(s.id)}">${icon("clock")}${t("changeTimes")}</button>`:""}
      ${tp.map(x=>`<button class="pill ${x.kind==="salary"?"good":"warn"} btnlike" data-act="editPay" data-id="${esc(x.id)}">${x.kind==="salary"?t("tookSal",{x:money(num(x.amount))}):t("tookAdv",{x:money(num(x.amount))})}</button>`).join("")}</div>
  </div>`;
}
function periodBar(){
  const prev = LANG==="en" ? "chevE" : "chevS", next = LANG==="en" ? "chevS" : "chevE", a = S.pstart, b = periodEnd();
  return `<div class="seg two-seg" role="group"><button data-act="period" data-id="week" aria-pressed="${S.period==="week"}">${t("week")}</button><button data-act="period" data-id="month" aria-pressed="${S.period==="month"}">${t("month")}</button></div>
  <div class="daybar"><button class="iconbtn" data-act="pnav" data-id="-1">${icon(prev)}</button><div class="d"><b>${S.period==="month"?monthName(a):t("periodFromTo",{a:fdate(a),b:fdate(lastWorkDay(a,b))})}</b></div><button class="iconbtn" data-act="pnav" data-id="1">${icon(next)}</button></div>`;
}
function accountCard(s,k){
  const lines = [[t("workedDays",{n:`<span class="num">${k.days}</span>`,days:k.days===1?t("dayW"):t("daysW"),r:fmt(k.days?k.base/k.days:dayRate(s,S.pstart))}), k.base, ""]];
  if(k.ot) lines.push([t("otLine",{x:hrsTxt(k.otH)}), k.ot, "+"]);
  k.pp.forEach(x=>lines.push([x.kind==="salary"?t("paidLine",{d:fdate(x.date)}):t("advLine",{d:fdate(x.date)}), num(x.amount), "-", x.id]));
  const r = k.remaining, u = unitById(s.unitId);
  return `<div class="panel"><div class="whead"><div class="who"><span class="avatar">${esc(initials(s.name))}</span><div class="col"><b>${esc(s.name)}</b><span class="sub">${S.view==="team"&&u?esc(u.name)+" · ":""}${k.absentN?t("absentN",{n:`<span class="num">${k.absentN}</span>`})+" · ":""}${k.lateH?t("late",{x:hrsTxt(k.lateH)}):""}</span></div></div></div>
    <div class="kv">${lines.map(([l,v,sg,id])=>`<div ${id?`data-act="editPay" data-id="${esc(id)}" class="clickable"`:""}><span>${l}</span><b class="${sg==="-"?"negv":sg==="+"?"pos":""}">${sg==="-"?"− ":sg==="+"?"+ ":""}${money(v)}</b></div>`).join("")}</div>
    <div class="total"><span class="label">${r<-0.005?t("overpaid"):t("leftFor")}</span><b class="${r>0.005?"due":r<-0.005?"negv":"pos"}">${money(Math.abs(r))}</b></div>
    <div class="two">${r>0.005?`<button class="btn primary" data-act="payRest" data-id="${esc(s.id)}">${t("payRest",{x:fmt(r)})}</button>`:k.earned>0?`<span class="pill good self-start">${icon("check")}${t("settled")}</span>`:"<span></span>"}<button class="btn" data-act="shareWa" data-id="${esc(s.id)}">${icon("send")}${t("waStatement")}</button></div></div>`;
}
function tabAccount(ss){
  let h = periodBar();
  if(!ss.length) return h + `<div class="panel empty"><span>${tv("noStaffShort")}</span></div>`;
  const all = ss.map(s=>[s, account(s,S.pstart,periodEnd())]);
  h += `<div class="panel"><div class="kv"><div><span>${t("earnedAll")}</span><b>${money(sum(all,x=>x[1].earned))}</b></div><div><span>${t("tookAll")}</span><b>${money(sum(all,x=>x[1].adv+x[1].paid))}</b></div></div>
    <div class="total"><span class="label">${t("leftAll")}</span><b class="due">${money(sum(all,x=>Math.max(0,x[1].remaining)))}</b></div></div>`;
  return h + all.map(([s,k])=>accountCard(s,k)).join("") + `<button class="btn ghost" data-act="exportPayroll">${icon("wallet")}${t("exportPayroll")}</button>`;
}
function txRow(k,x,showUnit,showDate=showUnit){
  if(k==="inc" && x.trip && !showUnit) return tripRow(x);
  const u = showUnit && unitById(x.unitId), act = k==="exp"?"editExp":k==="inc"?"editInc":"editPay";
  const title = k==="pay" ? `${esc((staffById(x.staffId)||{}).name||"")} · ${x.kind==="salary"?t("fromSalary"):t("advance")}` : esc(catLabel(x.category)) + (x.trip ? ` · ${t("drvTrip")}` : "");
  const sub = [k!=="pay"&&(x.item||x.note)?esc(x.item||x.note):"", x.supplier?esc(x.supplier):"", u?esc(u.name):"", showDate?fdate(x.date):"", x.time?t12(x.time):"", x.payBy&&x.payBy!=="cash"?esc(t(x.payBy)):"", Array.isArray(x.files)&&x.files.length?`${icon("clip")}<span class="num">${x.files.length}</span>`:""].filter(Boolean).join(" · ");
  return `<button class="row" data-act="${act}" data-id="${esc(x.id)}"><span class="tx-ic ${k}">${icon(k==="inc"?"plus":k==="pay"?"users":"minus")}</span><div class="m"><b>${title}</b>${sub?`<span class="sub">${sub}</span>`:""}</div><b class="${k==="inc"?"pos":""}">${k==="inc"?"+":"−"} ${money(num(x.amount))}</b></button>`;
}
function tabMoney(u){
  const ex = S.expenses.filter(x=>x.unitId===u.id).sort(byDateDesc), inc = S.income.filter(x=>x.unitId===u.id).sort(byDateDesc);
  return `<div class="two"><button class="btn" data-act="newExp">${icon("minus")}${t("expense")}</button><button class="btn" data-act="newInc">${icon("plus")}${t("incomeOne")}</button></div>
  <div class="panel"><div class="total flat"><span class="label">${t("allExpenses")}</span><b>${money(sum(ex,x=>num(x.amount)))}</b></div>
    ${ex.length?`<div class="list">${ex.map(x=>txRow("exp",x,false,true)).join("")}</div>`:`<span class="hint">${t("noExpenses")}</span>`}</div>
  <div class="panel"><div class="total flat"><span class="label">${t("allIncome")}</span><b class="pos">${money(sum(inc,x=>num(x.amount)))}</b></div>
    ${inc.length?`<div class="list">${inc.map(x=>txRow("inc",x,false,true)).join("")}</div>`:`<span class="hint">${t("noIncome")}</span>`}</div>`;
}
function tabSummary(u){
  const x = unitTotals(u.id), budget = num(u.budget), closed = u.status==="closed", B = KP(u).budget, Bl = B ? B[LI()] : t("budgetLeft");
  const cats = {}; if(x.comm) cats[t("drvComm")] = x.comm; S.expenses.filter(e=>e.unitId===u.id).forEach(e=>{ const k = catLabel(e.category); cats[k]=(cats[k]||0)+num(e.amount); });
  const ck = Object.keys(cats).sort((a,b)=>cats[b]-cats[a]), mx = Math.max(1,...Object.values(cats));
  const pct = budget ? Math.round(x.cost/budget*100) : 0, r = recurState(u);
  let h = (KP(u).driver ? driverMonth(u) : "") + `<div class="panel"><div class="kv"><div><span>${t("expMat")}</span><b>${money(x.exp-x.comm)}</b></div>${x.comm?`<div><span>${t("drvComm")}</span><b>${money(x.comm)}</b></div>`:""}<div><span>${tv("labor")}</span><b>${money(x.lab)}</b></div></div>
    <div class="total"><span class="label">${closed?t("totalCost"):t("totalCostSoFar")}</span><b>${money(x.cost)}</b></div>
    <div class="kv"><div><span>${t("incomeAll")}</span><b class="pos">${money(x.inc)}</b></div></div>
    <div class="total"><span class="label">${x.profit<0?t("loss"):(closed?t("profit"):t("netSoFar"))}</span><b class="${x.profit<0?"negv":"pos"}">${money(Math.abs(x.profit))}</b></div></div>`;
  if(B) h += `<div class="panel"><span class="label">${esc(B[LI()])}</span>${budget?`<div class="kv"><div><span>${esc(B[LI()])}</span><b>${money(budget)}</b></div>
      <div><span>${t("budgetLeft",{b:esc(Bl)})}</span><b class="${budget-x.cost<0?"negv":""}">${money(budget-x.cost)}</b></div>
      ${KP(u).contract?`<div><span>${t("clientOwes",{c:esc(u.client||(KP(u).client?KP(u).client[LI()]:""))})}</span><b class="due">${money(Math.max(0,budget-x.inc))}</b></div>`:""}</div>
      <div class="meter"><i style="width:${Math.min(100,pct)}%" class="${pct>=100?"over":pct>=80?"warn":""}"></i></div>${pct>=80?`<div class="alert warn">${icon("alert")}<span>${t("budgetWarn",{p:`<span class="num">${pct}</span>`,b:esc(Bl)})}</span></div>`:""}`
      :`<span class="hint">${t("budgetHint",{b:esc(Bl)})}</span>`}</div>`;
  if(r) h += `<div class="panel"><span class="label">${esc(r.label)} · ${monthName(today())}</span><div class="kv"><div><span>${t("recurDueDay",{d:`<span class="num">${r.day}</span>`})}</span><b>${money(r.amount)}</b></div><div><span>${t("received")}</span><b class="pos">${money(r.got)}</b></div></div>
    <span class="pill ${r.state==="paid"?"good":r.state==="late"?"bad":"warn"} self-start">${r.state==="paid"?t("paid"):r.state==="late"?t("late_"):t("dueOn",{d:`<span class="num">${r.day}</span>`})}</span></div>`;
  if(ck.length) h += `<div class="panel"><span class="label">${t("byCat")}</span>${ck.map(k=>`<div class="cat"><span>${esc(k)}</span><b>${money(cats[k])}</b><div class="bar"><span style="width:${cats[k]/mx*100}%"></span></div></div>`).join("")}</div>`;
  if(u.client || S.income.some(i=>i.unitId===u.id)) h += `<button class="btn" data-act="shareClient" data-id="${esc(u.id)}">${icon("send")}${t("cstSend",{x:esc(u.client||(KP(u).client?KP(u).client[LI()]:t("client")))})}</button>`;
  h += `<div class="two"><button class="btn" data-act="printReport">${icon("book")}${t("printReport")}</button>${closed ? `<button class="btn" data-act="reopen">${t("reopen")}</button>` : `<button class="btn danger" data-act="closeUnit">${t("closeUnit")}</button>`}</div>`;
  h += `<div class="print-only print-foot">${esc(COMPANY&&COMPANY.name||"")} · ${esc(u.name)} · ${fdate(today())} · ${t("madeWith")}</div>`;
  return h;
}

/* ----- team ----- */
function viewTeam(){
  const ss = S.staff.filter(s=>s.active!==false).sort((a,b)=>String(a.name).localeCompare(String(b.name)));
  let h = pageHead(t("navTeam"), tv("teamSub"));
  if(!ss.length) return h + `<div class="panel empty">${icon("users","big")}<span>${tv("noTeam")}</span></div>`;
  h += periodBar();
  const all = ss.map(s=>[s, account(s,S.pstart,periodEnd())]);
  h += `<div class="kpis three"><div class="kpi"><span class="label">${t("earnedAll")}</span><b>${money(sum(all,x=>x[1].earned))}</b></div><div class="kpi"><span class="label">${t("tookAll")}</span><b>${money(sum(all,x=>x[1].adv+x[1].paid))}</b></div><div class="kpi hero"><span class="label">${t("leftAll")}</span><b>${money(sum(all,x=>Math.max(0,x[1].remaining)))}</b></div></div>`;
  return h + all.map(([s,k])=>accountCard(s,k)).join("");
}

/* ----- money ----- */
function viewMoney(){
  if(!S.mmonth) S.mmonth = monthStartOf(today());
  const q = (S.mq||"").trim().toLowerCase();
  const a = S.mmonth, b = monthEnd(a), f = S.mfilter, prev = LANG==="en" ? "chevE" : "chevS", next = LANG==="en" ? "chevS" : "chevE";
  const m = companyTotals(a,b);
  const ex = S.expenses.filter(x=>inRange(x.date,a,b)).map(x=>["exp",x]), inc = S.income.filter(x=>inRange(x.date,a,b)).map(x=>["inc",x]), pay = S.payments.filter(x=>inRange(x.date,a,b)).map(x=>["pay",x]);
  const matches = ([k,x]) => !q || [catLabel(x.category||""), x.item, x.note, x.supplier, x.invNo, (staffById(x.staffId)||{}).name, (unitById(x.unitId)||{}).name, String(x.amount)].some(v=>String(v||"").toLowerCase().includes(q));
  const list = (f==="exp"?ex:f==="inc"?inc:f==="pay"?pay:[...ex,...inc,...pay]).filter(matches).sort((x,y)=>byDateDesc(x[1],y[1]));
  let h = pageHead(t("navMoney"), "", `<div class="hbtns"><button class="btn" data-act="newExp">${icon("minus")}${t("expense")}</button><button class="btn primary" data-act="newInc">${icon("plus")}${t("incomeOne")}</button></div>`);
  h += `<div class="daybar"><button class="iconbtn" data-act="mnav" data-id="-1">${icon(prev)}</button><div class="d"><b>${monthName(a)}</b></div><button class="iconbtn" data-act="mnav" data-id="1">${icon(next)}</button></div>`;
  h += `<div class="kpis"><div class="kpi"><span class="label">${t("income")}</span><b class="pos">${money(m.inc)}</b></div><div class="kpi"><span class="label">${t("expenses")}</span><b>${money(m.exp)}</b></div><div class="kpi"><span class="label">${t("salaries")}</span><b>${money(m.lab)}</b></div><div class="kpi hero ${m.profit<0?"neg":""}"><span class="label">${m.profit<0?t("loss"):t("profit")}</span><b>${money(Math.abs(m.profit))}</b></div></div>`;
  h += `<div class="seg four" role="group">${[["all",t("fAll")],["exp",t("fExp")],["inc",t("fInc")],["pay",t("fPay")]].map(([k,l])=>`<button data-act="mfilter" data-id="${k}" aria-pressed="${f===k}">${l}</button>`).join("")}</div>`;
  h += `<div class="panel"><div class="searchrow"><input id="mq" type="search" placeholder="${esc(t("searchPh"))}" value="${esc(S.mq||"")}" autocomplete="off"><button class="btn sm" data-act="exportMonth">${icon("wallet")}${t("export")}</button></div>
    ${list.length?`<div class="list">${list.map(([k,x])=>txRow(k,x,true)).join("")}</div>`:`<span class="hint">${t("noTx")}</span>`}</div>`;
  return h;
}
/* ===== taxi & delivery: a driver's shift, trip by trip =====
   A "car" folder. Each trip is an income record {trip:true, category:<platform>, payBy:cash|card, tip, km, time}.
   A shift {startTime, endTime, startKm, endKm} per car per day gives km and hours, so the driver sees
   what he really keeps: per trip, per hour, per km — after fuel and the apps' commission.
   Cash trips: the driver holds the app's commission (he owes it). Card/app trips: the app owes him. */
const shiftOf = (uid, d) => S.shifts.find(x=>x.unitId===uid && x.date===d);
const nowHM = () => { const d = new Date(); return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0"); };
function tabShift(u){
  const d = S.date, isToday = d===today(), x = driverDay(u.id, d), sh = shiftOf(u.id, d);
  const prev = LANG==="en" ? "chevE" : "chevS", next = LANG==="en" ? "chevS" : "chevE";
  let h = `<div class="daybar"><button class="iconbtn" data-act="day" data-id="-1" aria-label="${t("prevDay")}">${icon(prev)}</button>
    <div class="d"><b>${isToday?t("today")+" · ":""}${fdate(d)}</b>${isToday?"":`<button class="linkbtn" data-act="day" data-id="0">${t("backToday")}</button>`}</div>
    <button class="iconbtn" data-act="day" data-id="1" aria-label="${t("nextDay")}">${icon(next)}</button></div>`;
  // the big number: what you keep today
  h += `<div class="owe drv">${MARK}<span class="label">${isToday?t("drvKeepToday"):t("drvKeepDay")}</span><b class="${x.net<0?"negv":""}">${money(x.net)}</b>
    <span class="sub">${t("drvTripsN",{n:`<span class="num">${x.n}</span>`})}${x.hours?` · ${hrsTxt(x.hours)}`:""}${x.km?` · <span class="num">${fmt(x.km)}</span> ${t("km")}`:""}</span></div>`;
  // shift
  const kmRun = sh && num(sh.endKm) && num(sh.startKm) ? num(sh.endKm)-num(sh.startKm) : 0;
  const shiftLine = !sh || !sh.startTime ? t("drvNoShift") : [t("drvStarted",{x:t12(sh.startTime)}) + (sh.endTime ? " · "+t("drvEnded",{x:t12(sh.endTime)}) : ""),
    sh.startKm ? `${t("odo")}: <span class="num" dir="ltr">${fmt(num(sh.startKm))}${sh.endKm?" → "+fmt(num(sh.endKm)):""}</span>${kmRun?` (<span class="num">${fmt(kmRun)}</span> ${t("km")})`:""}` : ""].filter(Boolean).join("<br>");
  h += `<div class="panel"><div class="whead"><b>${icon("clock")}${t("drvShift")}</b><span class="sub">${shiftLine}</span></div>
    <div class="two">${!sh||!sh.startTime ? `<button class="btn primary" data-act="shiftStart">${icon("bolt")}${t("drvStart")}</button>` : !sh.endTime ? `<button class="btn" data-act="shiftEnd">${icon("check")}${t("drvEnd")}</button>` : `<span class="pill good self-start">${icon("check")}${t("drvDone")}</span>`}
    <button class="btn ghost" data-act="shiftEdit">${icon("gear")}${t("drvEditShift")}</button></div></div>`;
  // add a trip: one big button + platform shortcuts
  const pls = KP(u).platforms || [];
  h += `<div class="panel"><div class="whead"><b>${t("drvAddTrip")}</b></div><button class="btn primary big" data-act="newTrip">${icon("route")}${t("newTrip")}</button>
    <div class="chips-row">${pls.slice(0,6).map(p=>`<button class="chip-btn" data-act="tripOn" data-id="${esc(p[0])}">${esc(cat(p))}</button>`).join("")}</div></div>`;
  // numbers
  if(x.n || x.spend){
    h += `<div class="panel"><span class="label">${t("drvBreak")}</span><div class="kv">
      <div><span>${t("drvFares")}</span><b>${money(x.gross)}</b></div>
      ${x.tips?`<div><span>${t("drvTips")}</span><b class="pos">+ ${money(x.tips)}</b></div>`:""}
      ${x.comm?`<div><span>${t("drvComm")}</span><b class="negv">− ${money(x.comm)}</b></div>`:""}
      ${x.otherInc?`<div><span>${t("drvOtherInc")}</span><b class="pos">+ ${money(x.otherInc)}</b></div>`:""}
      <div><span>${t("drvSpend")}${x.fuel?` (${t("drvFuel")} ${fmt(x.fuel)})`:""}</span><b class="negv">− ${money(x.spend)}</b></div></div>
      <div class="total"><span class="label">${t("drvNet")}</span><b class="${x.net<0?"negv":"pos"}">${money(x.net)}</b></div>
      <div class="kpis three mini"><div class="kpi"><span class="label">${t("drvPerTrip")}</span><b>${money(x.perTrip)}</b></div><div class="kpi"><span class="label">${t("drvPerHour")}</span><b>${x.hours?money(x.perHour):"—"}</b></div><div class="kpi"><span class="label">${t("drvPerKm")}</span><b>${x.km?money(x.perKm):"—"}</b></div></div></div>`;
    if(x.comm) h += `<div class="panel"><span class="label">${t("drvCashApps")}</span><div class="kv">
      <div><span>${t("drvCashIn")}</span><b>${money(x.cash)}</b></div><div><span>${t("drvOwedApps")}</span><b class="negv">${money(x.owedToApps)}</b></div>
      <div><span>${t("drvAppsOwe")}</span><b class="pos">${money(Math.max(0,x.appsOweYou))}</b></div></div><span class="hint">${t("drvCashHint")}</span></div>`;
    const pk = Object.keys(x.byPl);
    if(pk.length>1) h += `<div class="panel"><span class="label">${t("drvByApp")}</span>${pk.sort((a,b)=>x.byPl[b].amt-x.byPl[a].amt).map(k=>`<div class="cat"><span>${esc(catLabel(k))} · <span class="num">${x.byPl[k].n}</span></span><b>${money(x.byPl[k].amt)}</b><div class="bar"><span style="width:${x.byPl[k].amt/Math.max(1,...pk.map(q=>x.byPl[q].amt))*100}%"></span></div></div>`).join("")}</div>`;
  }
  // today's list: trips + expenses
  const ex = S.expenses.filter(e=>e.unitId===u.id && e.date===d), other = S.income.filter(i=>i.unitId===u.id && i.date===d && !i.trip);
  const rows = [...x.trips.map(r=>["trip",r]), ...other.map(r=>["inc",r]), ...ex.map(r=>["exp",r])].sort((a,b)=>String(b[1].time||"").localeCompare(String(a[1].time||"")) || (b[1].createdAt||0)-(a[1].createdAt||0));
  h += `<div class="panel"><div class="whead"><b>${t("drvLog")}</b></div>${rows.length?`<div class="list">${rows.map(([k,r])=>k==="trip"?tripRow(r):txRow(k,r,false)).join("")}</div>`:`<span class="hint">${t("drvNoTrips")}</span>`}
    ${u.status!=="closed"?`<div class="two"><button class="btn" data-act="drvFuel">${icon("minus")}${t("drvAddFuel")}</button><button class="btn" data-act="newExp">${icon("minus")}${t("expense")}</button></div>`:""}</div>`;
  return h;
}
function tripRow(x){
  const c = commOf(x);
  return `<button class="row" data-act="editTrip" data-id="${esc(x.id)}"><span class="tx-ic inc">${icon("route")}</span><div class="m"><b>${esc(catLabel(x.category))}${x.time?` · ${t12(x.time)}`:""}</b>
    <span class="sub">${[x.payBy==="cash"?t("cash"):t("drvApp"), num(x.tip)?t("drvTipX",{x:fmt(num(x.tip))}):"", num(x.km)?`<span class="num">${fmt(num(x.km))}</span> ${t("km")}`:"", c?t("drvCommX",{x:fmt(c)}):"", x.note?esc(x.note):"", Array.isArray(x.files)&&x.files.length?icon("clip"):""].filter(Boolean).join(" · ")}</span></div>
    <b class="pos">+ ${money(num(x.amount))}</b></button>`;
}
function tripForm(x, preset={}){
  const u = unitById(x?.unitId || preset.unitId || (S.view==="unit"?S.uid:"")) || activeUnits().find(v=>KP(v).driver); if(!u){ toast(t("drvNoCar")); return; }
  const pls = (KP(u).platforms||[]).map(p=>[p[0], esc(cat(p))]);
  const last = lsGet("lastPlatform_"+u.id, pls[0] && pls[0][0]);
  FILES.begin(x?.files);
  openSheet({title: x ? t("drvEditTrip") : t("newTrip"), saveLabel: x ? t("save") : t("record"),
    fields:[{name:"amount",label:t("drvFare"),type:"money",big:true,value:x ? num(x.amount)-num(x.tip) : ""},
      {name:"category",label:t("drvApp"),type:"chips",options:pls,value:x?.category || preset.platform || last},
      {name:"payBy",label:t("drvPaidHow"),type:"chips",options:[["cash",t("cash")],["card",t("drvCardApp")]],value:x?.payBy || lsGet("lastPay_"+u.id,"cash")}],
    more:[{name:"tip",label:t("drvTip"),type:"money",value:x?.tip||""},{name:"km",label:t("drvTripKm"),type:"money",value:x?.km||""},
      {name:"time",label:t("time"),type:"time",value:x?.time || nowHM()},{name:"date",label:t("date"),type:"date",value:x?.date || (S.view==="unit"?S.date:today())},
      {name:"note",label:t("drvWhere"),value:x?.note,max:120}],
    html: FILES.field(),
    del: x ? {label:t("del"), run:async()=>{ const ok = await remove("income",x.id); if(ok) FILES.purge(x.files); return ok; }} : null,
    submit: async v=>{
      const fare = num(v.amount), tip = Math.max(0,num(v.tip)); if(fare<=0){ toast(t("eAmount")); return false; }
      const files = await FILES.commit(); if(files===null) return false;
      lsSet("lastPlatform_"+u.id, v.category); lsSet("lastPay_"+u.id, v.payBy);
      const ok = await save("income", x?.id, {...(x?strip(x):{createdAt:Date.now()}), trip:true, unitId:u.id, category:pls.some(p=>p[0]===v.category)?v.category:(pls[0]||["أخرى"])[0],
        amount:fare+tip, tip, km:Math.max(0,num(v.km)), payBy:v.payBy==="card"?"card":"cash", time:mins(v.time)!=null?v.time:nowHM(), date:validDate(v.date)?v.date:today(), note:(v.note||"").slice(0,120), files});
      if(ok){ FILES.done(); if(!x) toast(t("drvSaved",{x:moneyTxt(fare+tip)})); }
      return ok;
    }});
}
function shiftForm(u, mode){
  const d = S.date, sh = shiftOf(u.id, d) || {};
  const lastKm = S.shifts.filter(x=>x.unitId===u.id && num(x.endKm)>0 && x.date<=d).sort((a,b)=>b.date.localeCompare(a.date))[0];
  const fields = mode==="start" ? [{name:"startKm",label:t("odoStart"),type:"money",big:true,value:sh.startKm || (lastKm?lastKm.endKm:""),hint:t("odoHint")},{name:"startTime",label:t("drvStartAt"),type:"time",value:sh.startTime||nowHM()}]
    : mode==="end" ? [{name:"endKm",label:t("odoEnd"),type:"money",big:true,value:sh.endKm||"",hint:sh.startKm?t("odoFrom",{x:fmt(num(sh.startKm))}):""},{name:"endTime",label:t("drvEndAt"),type:"time",value:sh.endTime||nowHM()}]
    : [{name:"startTime",label:t("drvStartAt"),type:"time",value:sh.startTime||""},{name:"endTime",label:t("drvEndAt"),type:"time",value:sh.endTime||""},{name:"startKm",label:t("odoStart"),type:"money",value:sh.startKm||""},{name:"endKm",label:t("odoEnd"),type:"money",value:sh.endKm||""}];
  openSheet({title: mode==="start"?t("drvStart"):mode==="end"?t("drvEnd"):t("drvEditShift"), fields,
    del: sh.unitId && mode==="edit" ? {label:t("del"), run:()=>remove("shifts", d+"_"+u.id)} : null,
    submit: async v=>{
      const data = {...sh, unitId:u.id, date:d};
      ["startTime","endTime"].forEach(k=>{ if(k in v) data[k] = mins(v[k])!=null ? v[k] : ""; });
      ["startKm","endKm"].forEach(k=>{ if(k in v) data[k] = v[k]==="" ? "" : Math.max(0,num(v[k])); });
      if(num(data.endKm) && num(data.startKm) && num(data.endKm)<num(data.startKm)){ toast(t("odoBad")); return false; }
      delete data.id; return save("shifts", d+"_"+u.id, data);
    }});
}
/* month view for a car: per platform, per km, per hour */
function driverMonth(u){
  const a = monthStartOf(S.date||today()), b = monthEnd(a), x = driverDay(u.id, a, b);
  if(!x.n && !x.spend) return "";
  return `<div class="panel"><span class="label">${t("drvMonth")} · ${monthName(a)}</span><div class="kv">
    <div><span>${t("drvTripsN",{n:`<span class="num">${x.n}</span>`})}</span><b>${money(x.gross+x.tips)}</b></div>
    ${x.comm?`<div><span>${t("drvComm")}</span><b class="negv">− ${money(x.comm)}</b></div>`:""}
    <div><span>${t("drvSpend")}</span><b class="negv">− ${money(x.spend)}</b></div>
    ${x.km?`<div><span>${t("km")}</span><b class="num">${fmt(x.km)}</b></div>`:""}${x.hours?`<div><span>${t("drvHours")}</span><b>${hrsTxt(x.hours)}</b></div>`:""}</div>
    <div class="total"><span class="label">${t("drvNet")}</span><b class="${x.net<0?"negv":"pos"}">${money(x.net)}</b></div>
    <div class="kpis three mini"><div class="kpi"><span class="label">${t("drvPerTrip")}</span><b>${money(x.perTrip)}</b></div><div class="kpi"><span class="label">${t("drvPerHour")}</span><b>${x.hours?money(x.perHour):"—"}</b></div><div class="kpi"><span class="label">${t("drvPerKm")}</span><b>${x.km?money(x.perKm):"—"}</b></div></div></div>`;
}
/* ===== sheet ===== */
let onSubmit = null, onDelete = null;
function field(f){
  const id = "f_"+f.name, v = f.value ?? "";
  if(f.type==="chips"||f.type==="multichips"){
    const multi = f.type==="multichips", vs = multi ? (Array.isArray(v)?v.map(String):[]) : [String(v)];
    return `<div class="field" role="${multi?"group":"radiogroup"}" aria-label="${esc(f.label)}"><span class="flabel">${esc(f.label)}</span><div class="chips ${f.cls||""}">${f.options.map(([val,lab])=>`<label><input type="${multi?"checkbox":"radio"}" name="${f.name}" value="${esc(val)}" ${vs.includes(String(val))?"checked":""}><span>${lab}</span></label>`).join("")}</div>${f.hint?`<span class="hint">${f.hint}</span>`:""}</div>`;
  }
  let input;
  if(f.type==="select") input = `<select id="${id}" name="${f.name}">${f.options.map(([val,lab])=>`<option value="${esc(val)}" ${String(val)===String(v)?"selected":""}>${esc(lab)}</option>`).join("")}</select>`;
  else if(f.type==="money") input = `<input id="${id}" name="${f.name}" inputmode="decimal" autocomplete="off" value="${esc(v)}" placeholder="0">`;
  else input = `<input id="${id}" name="${f.name}" type="${f.type||"text"}" value="${esc(v)}" ${f.ph?`placeholder="${esc(f.ph)}"`:""} ${f.max?`maxlength="${f.max}"`:""} ${f.min!=null?`min="${f.min}"`:""} ${f.maxv!=null?`max="${f.maxv}"`:""}>`;
  return `<div class="field ${f.big?"bigamt":""}"><label for="${id}">${esc(f.label)}</label>${input}${f.hint!=null?`<span class="hint" id="${id}_hint">${f.hint}</span>`:""}</div>`;
}
function openSheet({title, fields=[], more=[], html="", submit, del, saveLabel, noSave}){
  document.getElementById("sheetTitle").textContent = title;
  document.getElementById("sheetBody").innerHTML = fields.map(field).join("") + html + (more.length?`<details><summary>${t("more")}</summary><div class="morebox">${more.map(field).join("")}</div></details>`:"");
  const sv = document.getElementById("sheetSave"); sv.textContent = saveLabel || t("save"); sv.hidden = !!noSave;
  document.getElementById("sheetExtra").innerHTML = del ? `<button type="button" class="btn danger" data-act="sheetDel">${esc(del.label||t("del"))}</button>` : "";
  onSubmit = submit; onDelete = del || null;
  document.getElementById("sheet").hidden = false;
  if(document.getElementById("attList")) FILES.loadThumbs();
  setTimeout(()=>{ const b = document.querySelector("#sheetBody .bigamt input"); if(b && !b.value) b.focus(); }, 80);
}
function closeSheet(){ document.getElementById("sheet").hidden = true; onSubmit = onDelete = null; }
function vals(){ const o = {}; document.querySelectorAll("#sheetBody [name]").forEach(el=>{
  if(el.type==="checkbox"){ o[el.name] = o[el.name] || []; if(el.checked) o[el.name].push(el.value); return; }
  if(el.type==="radio" && !el.checked) return; o[el.name] = el.value.trim(); }); return o; }
document.getElementById("sheetForm").addEventListener("submit", async e=>{
  e.preventDefault(); if(!onSubmit) return;
  const b = document.getElementById("sheetSave"); b.disabled = true;
  try{ const ok = await onSubmit(vals()); if(ok!==false) closeSheet(); } finally { b.disabled = false; }
});
const unitOptions = (cur) => S.units.filter(u=>u.status!=="closed"||u.id===cur).map(u=>[u.id,u.name]);

/* ===== forms ===== */
function unitForm(u, draft){
  S.unitFormId = u ? u.id : null;
  const d = draft || {}, kind = P[d.kind] ? d.kind : unitKind(u), p = P[kind], val = k => d[k]!==undefined ? d[k] : u?.[k];
  const more = [];
  if(p.client) more.push({name:"clientPhone",label:t("phoneOpt"),type:"tel",value:val("clientPhone"),max:30});
  more.push({name:"location",label:t("where"),value:val("location"),max:80});
  const fields = [{name:"name",label:tv("unitName"),value:val("name"),max:80},
    {name:"ukind",label:t("unitKind"),type:"chips",cls:"types",options:typeOptions(),value:kind,hint:t("unitKindHint")}];
  if(p.client) fields.push({name:"client",label:p.client[LI()],value:val("client"),max:80});
  if(p.budget) fields.push({name:"budget",label:p.budget[LI()],type:"money",value:val("budget")||""});
  if(p.recur){ fields.push({name:"recurAmount",label:`${p.recur.label[LI()]} · ${t("recurAmount")}`,type:"money",value:val("recurAmount")||""});
    fields.push({name:"recurDay",label:t("recurDay"),type:"number",value:val("recurDay")||1,min:1,maxv:28}); }
  if(p.driver) (p.platforms||[]).forEach(pl=>more.push({name:"comm_"+pl[0],label:t("commFor",{x:cat(pl)}),type:"money",value:(d.comm||u?.comm||{})[pl[0]]||"",hint:pl===p.platforms[0]?t("commHint"):null}));
  const cats = u ? `<button type="button" class="btn sm" data-act="unitCats" data-id="exp">${icon("tag")}${t("manageCats")}</button>` : "";
  openSheet({title: u ? t("edit")+" · "+u.name : tv("newUnit").replace(/^\+\s*/,""), saveLabel: u?t("save"):t("openFolderBtn"), fields, more, html:cats,
    del: u ? {label:tv("delUnit"), run:async()=>{ const ok = await remove("units",u.id); if(ok){ S.view="units"; render(); } return ok; }} : null,
    submit: async v=>{
      if(!v.name){ toast(t("eUnitName")); return false; }
      const k = P[v.ukind] ? v.ukind : ST().type, comm = {};
      (P[k].platforms||[]).forEach(pl=>{ const x = num(v["comm_"+pl[0]]); if(x>0) comm[pl[0]] = Math.min(60, x); });
      const keepCats = u && unitKind(u)===k;   // a new kind of work starts from that kind's own categories
      const data = {...(u?strip(u):{status:"active",createdAt:Date.now(),startDate:today()}), name:v.name.slice(0,80), kind:k, location:(v.location||"").slice(0,80),
        client:(v.client||"").slice(0,80), clientPhone:(v.clientPhone||"").slice(0,30), budget:num(v.budget), recurAmount:num(v.recurAmount), recurDay:Math.min(28,Math.max(1,parseInt(v.recurDay)||1)), comm};
      if(!keepCats){ delete data.expCats; delete data.incCats; }
      if(u) return save("units",u.id,data);
      const id = await createDoc("units",data); if(!id) return false;
      S.uid = id; S.view = "unit"; S.tab = "today"; render(); toast(tv("folderOpened")); return true;
    }});
}
/* the folder's own list of expense / income categories: rename by removing and adding, reorder by re-adding */
function unitCatsSheet(u, kind){
  if(!u) return;
  const list = unitCats(u, kind).map(p=>p[0]);
  const rows = list.map((k,i)=>`<div class="catrow"><span>${esc(catLabel(k))}</span><button type="button" class="iconbtn sm" data-act="catDel" data-id="${i}" aria-label="${t("del")}">${icon("x")}</button></div>`).join("");
  openSheet({title:t("catsOf",{x:u.name}), saveLabel:t("addCat"),
    html:`<div class="seg two-seg" role="group"><button type="button" data-act="unitCats" data-id="exp" aria-pressed="${kind==="exp"}">${t("expenses")}</button><button type="button" data-act="unitCats" data-id="inc" aria-pressed="${kind==="inc"}">${t("income")}</button></div>
      <div class="catlist">${rows}</div><span class="hint">${t("catsHint")}</span>
      <button type="button" class="linkbtn" data-act="catReset" data-id="${kind}">${t("catReset")}</button>`,
    fields:[{name:"newcat",label:t("newCat"),value:"",max:40,ph:kind==="exp"?t("newCatPhExp"):t("newCatPhInc")}],
    submit: async v=>{
      const k = catKey(v.newcat); if(!k){ toast(t("eCatName")); return false; }
      const cur = unitCats(u, kind).map(p=>p[0]); if(cur.some(x=>catLabel(x)===k || x===k)){ toast(t("eCatDup")); return false; }
      const other = cur.filter(x=>x!=="أخرى"), next = [...other, k, ...(cur.includes("أخرى")?["أخرى"]:[])].slice(0,40);
      if(await save("units", u.id, {...strip(u), [kind==="exp"?"expCats":"incCats"]: next}, true)){ toast(t("catAdded",{x:k})); unitCatsSheet(unitById(u.id), kind); }
      return false;
    }});
  S.catKind = kind;
}
function rateHint(){
  const el = document.getElementById("f_rate_hint"); if(!el) return;
  const tp = (document.querySelector('#sheetBody [name="rateType"]:checked')||{}).value, r = num((document.getElementById("f_rate")||{}).value);
  el.innerHTML = !r ? t("typeAmount") : tp==="day" ? t("rateHintDay",{x:moneyTxt(r)}) : tp==="month" ? t("rateHintMonth",{x:moneyTxt(r/workDaysMonth(today()))}) : t("rateHintWeek",{x:moneyTxt(r/workDaysWeek()),d:workDaysWeek()});
}
function staffForm(s){
  const others = !s ? S.staff.filter(x=>x.active!==false && x.unitId!==S.uid) : [];
  const defType = ST().payPeriod || PRE().pay;
  openSheet({title: s ? t("edit")+" · "+s.name : tv("addStaff").replace(/^\+\s*/,""), saveLabel: s?t("save"):t("addStaffBtn"),
    fields:[{name:"name",label:t("staffName"),value:s?.name,max:80},
      {name:"rateType",label:t("payType"),type:"chips",options:[["day",t("daily")],["week",t("weekly")],["month",t("monthly")]],value:s?.rateType||defType},
      {name:"rate",label:t("howMuch")+" ("+curName()+")",type:"money",big:true,value:s?.rate||"",hint:""}],
    html: others.length ? `<div class="field"><span class="flabel">${t("moveHere")}</span><div class="chips">${others.map(x=>`<button type="button" class="btn sm" data-act="moveHere" data-id="${esc(x.id)}">${esc(x.name)}</button>`).join("")}</div></div>` : "",
    more:[{name:"role",label:t("role"),value:s?.role,max:60},{name:"phone",label:t("staffPhone"),type:"tel",value:s?.phone,max:30},{name:"otRate",label:t("otRate"),type:"money",value:s?.otRate||"",hint:t("otHint",{h:fmt(shiftHours())})},
      ...(s?[{name:"unitId",label:t("worksAt"),type:"select",options:unitOptions(s.unitId),value:s.unitId}]:[])],
    del: s ? {label:t("removeStaff"), run:()=>save("staff",s.id,{...strip(s),active:false})} : null,
    submit: async v=>{
      if(!v.name){ toast(t("eStaffName")); return false; }
      if(num(v.rate)<=0){ toast(t("eRate")); return false; }
      const data = {...(s?strip(s):{createdAt:Date.now(),active:true,startDate:today()}), name:v.name.slice(0,80), role:(v.role||"").slice(0,60), phone:(v.phone||"").slice(0,30), rateType:v.rateType||defType, rate:num(v.rate), otRate:num(v.otRate), unitId:v.unitId || s?.unitId || S.uid};
      const ok = await save("staff", s?.id, data); if(ok && !s) toast(t("added",{x:v.name})); return ok;
    }});
  rateHint();
}
let timesStaff = null;
function timesForm(sid){
  const s = staffById(sid), a = attOf(sid,S.date); if(!s) return; timesStaff = sid;
  const si = ST().shiftIn, so = ST().shiftOut, tin = a?.in || si, tout = a?.out || so;
  const plus = (x,h) => { const m = ((mins(x)+h*60)%1440+1440)%1440; return String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0"); };
  const lab = x => t12(x).replace(/<[^>]+>/g,"");
  const ins = [[si,lab(si)+" · "+t("onTime")],[plus(si,0.5),lab(plus(si,0.5))],[plus(si,1),lab(plus(si,1))],[plus(si,2),lab(plus(si,2))],[plus(si,3),lab(plus(si,3))],[plus(si,4),lab(plus(si,4))]];
  const outs = [[so,lab(so)+" · "+t("onTime")],[plus(so,1),lab(plus(so,1))+" (+1)"],[plus(so,2),lab(plus(so,2))+" (+2)"],[plus(so,3),lab(plus(so,3))+" (+3)"],[plus(so,-2),lab(plus(so,-2))],[plus(so,-4),lab(plus(so,-4))]];
  openSheet({title:t("hoursOf",{x:s.name,d:dayName(S.date)}),
    fields:[{name:"qin",label:t("arrived"),type:"chips",options:ins,value:tin},{name:"qout",label:t("left"),type:"chips",options:outs,value:tout}],
    html:`<div class="preview" id="tprev"></div>`,
    more:[{name:"in",label:t("exactIn"),type:"time",value:tin},{name:"out",label:t("exactOut"),type:"time",value:tout}],
    submit: v=>attSave(sid,S.date,"present",v.in||si,v.out||so,S.uid)});
  tprev();
}
function tprev(){
  const fi = document.getElementById("f_in"), fo = document.getElementById("f_out"), el = document.getElementById("tprev"); if(!fi||!fo||!el) return;
  const s = staffById(timesStaff), x = timeCalc(fi.value, fo.value), dr = dayRate(s,S.date), ot = x.ot*otRate(s,S.date);
  el.innerHTML = `${t("earns",{x:money(dr+ot)})}${x.ot?` · ${t("ot",{x:hrsTxt(x.ot)})}`:""}${x.late?` · ${t("late",{x:hrsTxt(x.late)})}`:""}${x.early?` · ${t("early",{x:hrsTxt(x.early)})}`:""}`;
}
function payForm(x, preset={}){
  const sid = x?.staffId || preset.staffId, s = staffById(sid); if(!s) return;
  const kind = (x?.kind || preset.kind)==="salary" ? "salary" : "advance";
  FILES.begin(x?.files);
  openSheet({title: x ? t("editPayment",{x:s.name}) : kind==="salary" ? t("paidTo",{x:s.name}) : t("advFor",{x:s.name}), saveLabel: x?t("save"):t("record"),
    fields:[{name:"amount",label:t("howMuchTook"),type:"money",big:true,value:x?.amount ?? (preset.amount!=null?String(Math.round(preset.amount*100)/100):"")},
      {name:"kind",label:t("whatIsIt"),type:"chips",options:[["advance",t("advance")],["salary",t("fromSalary")]],value:kind}],
    html: FILES.field(),
    more:[{name:"date",label:t("date"),type:"date",value:x?.date||preset.date||S.date||today()},{name:"time",label:t("time"),type:"time",value:x?.time||""},
      {name:"payBy",label:t("payBy"),type:"chips",options:[["cash",t("cash")],["transfer",t("transfer")],["cheque",t("cheque")]],value:x?.payBy||"cash"},{name:"note",label:t("note"),value:x?.note,max:200}],
    del: x ? {label:t("del"), run:async()=>{ const ok = await remove("payments",x.id); if(ok) FILES.purge(x.files); return ok; }} : null,
    submit: async v=>{
      const amount = num(v.amount); if(amount<=0){ toast(t("eAmount")); return false; }
      const files = await FILES.commit(); if(files===null) return false;
      const ok = await save("payments", x?.id, {...(x?strip(x):{createdAt:Date.now()}), staffId:sid, unitId:x?.unitId||s.unitId||S.uid, kind:v.kind==="salary"?"salary":"advance", amount, date:validDate(v.date)?v.date:today(),
        time:mins(v.time)!=null?v.time:"", payBy:["cash","transfer","cheque"].includes(v.payBy)?v.payBy:"cash", note:(v.note||"").slice(0,200), files});
      if(ok) FILES.done();
      if(ok && !x) toast(t("savedPay",{x:s.name,k:v.kind==="salary"?t("fromSalary"):t("advance"),a:moneyTxt(amount)})); return ok;
    }});
}
function unitPickField(x, cur){
  if(S.view==="unit" && !x && cur===S.uid) return [];
  const opts = unitOptions(x?.unitId); if(!opts.length) return [];
  return [{name:"unitId",label:tv("forUnit"),type:"select",options:[["",""] ,...opts],value:cur||x?.unitId||(S.view==="unit"?S.uid:(opts.length===1?opts[0][0]:""))}];
}
function moneyForm(kind, x, preset={}){
  const isExp = kind==="exp";
  if(!x && !S.units.some(u=>u.status!=="closed")){ toast(tv("noUnitsSub")); return; }
  const uid0 = preset.unitId || x?.unitId || (S.view==="unit" ? S.uid : (activeUnits().length===1 ? activeUnits()[0].id : ""));
  const u0 = unitById(uid0), list = unitCats(u0, kind);
  const lastKey = "lastCat_"+unitKind(u0)+"_"+kind, last = lsGet(lastKey, list[0][0]);
  const curCat = preset.category || x?.category || (list.some(p=>p[0]===last) ? last : list[0][0]);
  const opts = list.map(p=>[p[0],esc(cat(p))]); if(curCat && !opts.some(o=>o[0]===curCat)) opts.unshift([curCat, esc(catLabel(curCat))]);
  FILES.begin(x?.files); S.mkind = kind;
  openSheet({title: x ? (isExp?t("editExp"):t("editInc")) : (isExp?t("newExp"):t("newInc")), saveLabel: x?t("save"):t("record"),
    fields:[{name:"amount",label:isExp?t("howMuchPaid"):t("howMuchGot"),type:"money",big:true,value:x?.amount ?? preset.amount},
      ...unitPickField(x, uid0),
      {name:"category",label:isExp?t("onWhat"):t("fromWhat"),type:"chips",options:opts,value:curCat},
      {name:isExp?"item":"note",label:isExp?t("desc"):t("note"),value:(isExp?x?.item:x?.note) ?? preset.note,max:160}],
    html: `${u0?`<button type="button" class="linkbtn addcat" data-act="quickCat" data-id="${kind}">${icon("plus")}${t("addCatHere")}</button>`:""}${FILES.field()}`,
    more:[{name:"date",label:t("date"),type:"date",value:x?.date||preset.date||(S.view==="unit"?S.date:today())}, {name:"time",label:t("time"),type:"time",value:x?.time||preset.time||""},
      ...(isExp?[{name:"supplier",label:t("shop"),value:x?.supplier ?? preset.supplier,max:80},{name:"payBy",label:t("payBy"),type:"chips",options:[["cash",t("cash")],["card",t("card")],["transfer",t("transfer")],["cheque",t("cheque")]],value:x?.payBy||preset.payBy||"cash"},{name:"invNo",label:t("invNo"),value:x?.invNo,max:40}]:[{name:"payBy",label:t("gotBy"),type:"chips",options:[["cash",t("cash")],["card",t("card")],["transfer",t("transfer")],["cheque",t("cheque")]],value:x?.payBy||preset.payBy||"cash"}])],
    del: x ? {label:t("del"), run:async()=>{ const ok = await remove(isExp?"expenses":"income",x.id); if(ok) FILES.purge(x.files); return ok; }} : null,
    submit: async v=>{
      const amount = num(v.amount); if(amount<=0){ toast(t("eAmount")); return false; }
      const unitId = v.unitId || x?.unitId || (S.view==="unit"?S.uid:""); if(!unitById(unitId)){ toast(tv("eUnitPick")); return false; }
      const u = unitById(unitId), ok_cats = unitCats(u, kind);
      const category = v.category && (ok_cats.some(p=>p[0]===v.category) || v.category===x?.category || v.category===preset.category) ? v.category : ok_cats[ok_cats.length-1][0];
      lsSet("lastCat_"+unitKind(u)+"_"+kind, category);
      const files = await FILES.commit(); if(files===null) return false;
      const base = {...(x?strip(x):{createdAt:Date.now()}), unitId, category, amount, date:validDate(v.date)?v.date:today(), time:mins(v.time)!=null?v.time:"", payBy:["cash","card","transfer","cheque"].includes(v.payBy)?v.payBy:"cash", files};
      const data = isExp ? {...base, item:(v.item||"").slice(0,160), supplier:(v.supplier||"").slice(0,80), invNo:(v.invNo||"").slice(0,40)} : {...base, note:(v.note||"").slice(0,160)};
      const id = x?.id || newId();
      const ok = await save(isExp?"expenses":"income", id, data);
      if(ok) FILES.done();
      if(ok && !x) toast(isExp ? t("savedExp",{c:catLabel(category),a:moneyTxt(amount)}) : t("savedInc",{a:moneyTxt(amount)})); return ok;
    }});
}
/* switching the folder inside the money form swaps its category chips */
function refreshCatChips(kind){
  const sel = document.querySelector('#sheetBody [name="unitId"]'), box = document.querySelector('#sheetBody [name="category"]'); if(!box) return;
  const u = unitById(sel ? sel.value : S.uid), list = unitCats(u, kind), cur = (document.querySelector('#sheetBody [name="category"]:checked')||{}).value;
  const wrap = box.closest(".chips"); if(!wrap) return;
  const pick = list.some(p=>p[0]===cur) ? cur : list[0][0];
  wrap.innerHTML = list.map(p=>`<label><input type="radio" name="category" value="${esc(p[0])}" ${p[0]===pick?"checked":""}><span>${esc(cat(p))}</span></label>`).join("");
}
async function attSave(sid, date, status, tin, tout, unitId){
  const s = staffById(sid); if(!s || !validDate(date)) return false;
  const a = attOf(sid,date);
  return save("attendance", date+"_"+sid, {staffId:sid, date, unitId:unitId||a?.unitId||s.unitId, status: status==="absent"?"absent":"present",
    in: status!=="absent" ? (tin||a?.in||ST().shiftIn) : "", out: status!=="absent" ? (tout||a?.out||ST().shiftOut) : "",
    dayRate:dayRate(s,date), otRate:otRate(s,date), updatedAt:Date.now()});
}
/* the + button: the 4-5 things people do every day, big and obvious */
const quickItems = () => { const drv = activeUnits().some(u=>KP(u).driver), staff = S.staff.some(x=>x.active!==false);
  return [...(drv?[["trip","route",t("newTrip"),t("qTripSub")]]:[]), ...(staff?[["att","users",t("qAtt"),t("qAttSub")]]:[]),
    ["exp","minus",t("expense"),t("qExpSub")], ["inc","plus",t("incomeOne"),t("qIncSub")], ...(staff?[["adv","wallet",t("addAdvance").replace(/^\+\s*/,""),t("qAdvSub")]]:[])]; };
const quickTiles = () => quickItems().map(([k,ic,l,sub])=>`<button type="button" class="qtile q-${k}" data-act="q" data-id="${k}">${icon(ic)}<b>${esc(l)}</b><span>${esc(sub)}</span></button>`).join("");
function quickSheet(){ openSheet({title:t("whatAdd"), noSave:true, html:`<div class="qgrid">${quickTiles()}</div>`}); }
/* pick a folder / a person when the action needs one */
function pickUnit(what){
  const us = activeUnits().filter(u=>unitStaff(u.id).length); if(!us.length){ toast(tv("noStaff")); return; }
  if(us.length===1){ A.openUnit(us[0].id); return; }
  openSheet({title:t("qWhichUnit"), noSave:true, html:`<div class="list">${us.map(u=>`<button type="button" class="row" data-act="openUnitClose" data-id="${esc(u.id)}"><span class="tx-ic">${icon(KP(u).icon)}</span><div class="m"><b>${esc(u.name)}</b><span class="sub">${t("cameOf",{a:`<span class="num">${unitStaff(u.id).filter(x=>came(attOf(x.id,today()))).length}</span>`,b:`<span class="num">${unitStaff(u.id).length}</span>`})}</span></div>${icon(LANG==="en"?"chevS":"chevE")}</button>`).join("")}</div>`});
}
function pickStaff(){
  const ss = S.staff.filter(x=>x.active!==false).sort((a,b)=>String(a.name).localeCompare(String(b.name)));
  if(ss.length===1){ payForm(null,{staffId:ss[0].id, kind:"advance"}); return; }
  openSheet({title:t("qWho"), noSave:true, html:`<input type="search" id="whoq" class="whoq" placeholder="${esc(t("qSearchName"))}" autocomplete="off"><div class="list" id="wholist">${ss.map(x=>`<button type="button" class="row" data-act="advFor" data-id="${esc(x.id)}" data-n="${esc(String(x.name).toLowerCase())}"><span class="avatar">${esc(initials(x.name))}</span><div class="m"><b>${esc(x.name)}</b><span class="sub">${esc((unitById(x.unitId)||{}).name||"")}</span></div></button>`).join("")}</div>`});
}
const typeOptions = () => TYPES.map(k=>[k, `${icon(P[k].icon)}${esc(P[k].name[LI()])}`]);
const curOptions = () => Object.keys(CUR).map(k=>[k, `${k} · ${CUR[k][0]}`]);
function settingsSheet(){
  if(ROLE!=="owner"){ toast(t("onlyOwner")); return; }
  const s = ST();
  openSheet({title:t("settings"),
    fields:[{name:"name",label:t("companyName"),value:COMPANY.name,max:80},
      {name:"type",label:t("bizType"),type:"chips",cls:"types",options:typeOptions(),value:s.type},
      {name:"currency",label:t("currency"),type:"select",options:curOptions(),value:s.currency},
      {name:"lang",label:t("language"),type:"chips",options:[["ar","العربية"],["en","English"]],value:LANG},
      {name:"weekend",label:t("weekend"),type:"multichips",options:DAYS_SHORT[LANG].map((d,i)=>[String(i),d]),value:s.weekend.map(String)}],
    more:[{name:"shiftIn",label:t("shiftIn"),type:"time",value:s.shiftIn},{name:"shiftOut",label:t("shiftOut"),type:"time",value:s.shiftOut},
      {name:"payPeriod",label:t("payPeriod"),type:"chips",options:[["week",t("weekly")],["month",t("monthly")]],value:s.payPeriod||PRE().pay},
      {name:"otMult",label:t("otMult"),type:"chips",options:[["1","100%"],["1.25",t("ot125")],["1.5","150%"]],value:String(s.otMult),hint:t("otMultHint")},
      {name:"phone",label:t("phoneCo"),type:"tel",value:COMPANY.phone||"",max:30}],
    submit: async v=>{
      if(!v.name || v.name.length<2){ toast(t("eName")); return false; }
      const settings = {...(COMPANY.settings||{}), type:P[v.type]?v.type:"other", currency:CUR[v.currency]?v.currency:"JOD", lang:v.lang==="en"?"en":"ar",
        weekend:(v.weekend||[]).map(Number).filter(n=>n>=0&&n<=6), shiftIn:mins(v.shiftIn)!=null?v.shiftIn:"08:00", shiftOut:mins(v.shiftOut)!=null?v.shiftOut:"17:00", payPeriod:v.payPeriod==="month"?"month":"week", otMult:[1,1.25,1.5].includes(Number(v.otMult))?Number(v.otMult):1};
      return applySettings({name:v.name.slice(0,80), phone:(v.phone||"").slice(0,30)||null, settings});
    }});
}
async function applySettings(patch){
  const { error } = await sb.from("companies").update(patch).eq("id",CID);
  if(error){ toast(errMsg(error)); return false; }
  COMPANY = {...COMPANY, ...patch};
  S.period = ST().payPeriod || PRE().pay; S.pstart = periodStartFor(S.date||today());
  if(patch.settings && patch.settings.lang && patch.settings.lang!==LANG) setLang(patch.settings.lang); else render();
  toast(t("settingsSaved")); return true;
}
/* ===== attachments: invoices, receipts, photos and files on any money record =====
   Files live in a PRIVATE Supabase Storage bucket ("files"), under the company's own folder:
   files/<company id>/<yyyy-mm>/<random id>.<ext>. The database only lets a company read and
   write inside its own folder (see storage policies in schema.sql), and every view uses a
   short-lived signed link — nothing is ever public. Photos are shrunk on the phone first. */
const BUCKET = "files";
const FILE_MAX = 6, IMG_MAX_IN = 25*1024*1024, IMG_MAX_OUT = 4*1024*1024, DOC_MAX = 10*1024*1024;
const DOC_TYPES = {"application/pdf":"pdf","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":"xlsx","application/vnd.ms-excel":"xls",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":"docx","application/msword":"doc","text/csv":"csv"};
const IMG_TYPES = ["image/jpeg","image/png","image/webp","image/heic","image/heif"];
const extOf = n => (String(n||"").toLowerCase().match(/\.([a-z0-9]{2,5})$/)||[])[1] || "";
const EXT_TYPE = {pdf:"application/pdf",xlsx:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",xls:"application/vnd.ms-excel",docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",doc:"application/msword",csv:"text/csv",jpg:"image/jpeg",jpeg:"image/jpeg",png:"image/png",webp:"image/webp",heic:"image/heic",heif:"image/heif"};
const cleanName = n => String(n||"file").replace(/[\u0000-\u001f<>:"/\\|?*]+/g,"").replace(/\s+/g," ").trim().slice(0,80) || "file";
const kb = n => n>=1048576 ? `${(n/1048576).toFixed(1)} MB` : `${Math.max(1,Math.round(n/1024))} KB`;

/* read the first bytes: the real type of a file, whatever its name says */
async function sniff(file){
  const b = new Uint8Array(await file.slice(0,12).arrayBuffer());
  const hex = [...b].map(x=>x.toString(16).padStart(2,"0")).join("");
  if(hex.startsWith("ffd8ff")) return "image/jpeg";
  if(hex.startsWith("89504e47")) return "image/png";
  if(hex.startsWith("52494646") && hex.slice(16,24)==="57454250") return "image/webp";
  if(hex.slice(8,16)==="66747970") return "image/heic";                       // ....ftyp (HEIC/HEIF from iPhones)
  if(hex.startsWith("25504446")) return "application/pdf";                    // %PDF
  if(hex.startsWith("504b0304")) return null;                                 // zip → trust the extension (xlsx/docx)
  if(hex.startsWith("d0cf11e0")) return null;                                 // old office → trust the extension
  return "unknown";
}
async function shrinkImage(file){
  let bmp; try{ bmp = await createImageBitmap(file); }catch(e){
    try{ bmp = await new Promise((res,rej)=>{ const i = new Image(); const u = URL.createObjectURL(file); i.onload = ()=>{ URL.revokeObjectURL(u); res(i); }; i.onerror = e=>{ URL.revokeObjectURL(u); rej(e); }; i.src = u; }); }
    catch(_){ return null; } }
  const W = bmp.width, H = bmp.height, k = Math.min(1, 1800/Math.max(W,H));
  const c = document.createElement("canvas"); c.width = Math.round(W*k); c.height = Math.round(H*k);
  const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0,0,c.width,c.height); g.drawImage(bmp, 0, 0, c.width, c.height);
  for(const q of [0.82, 0.7, 0.55]){ const blob = await new Promise(r=>c.toBlob(r, "image/jpeg", q)); if(blob && blob.size<=IMG_MAX_OUT) return blob; }
  return null;
}
async function signedUrl(path){
  if(window.DEMO_FILES) return window.DEMO_FILES.url(path);
  const { data, error } = await sb.storage.from(BUCKET).createSignedUrl(path, 600);
  return error ? null : data.signedUrl;
}

const FILES = {
  keep: [], add: [], drop: [], thumbs: {}, busy: false,
  begin(existing){ this.keep = Array.isArray(existing) ? existing.filter(f=>f && typeof f.path==="string").slice(0,FILE_MAX) : []; this.add.forEach(a=>a.url && URL.revokeObjectURL(a.url)); this.add = []; this.drop = []; },
  field(){ return `<div class="field att"><span class="flabel">${icon("clip")}${t("attTitle")}</span><div class="att-list" id="attList">${this.listHtml()}</div>
    <div class="att-btns"><label class="btn sm">${icon("camera")}${t("attCamera")}<input type="file" id="attCam" accept="image/*" capture="environment" hidden></label>
    <label class="btn sm">${icon("file")}${t("attFile")}<input type="file" id="attPick" accept="image/*,.pdf,.xlsx,.xls,.docx,.doc,.csv" multiple hidden></label></div>
    <span class="hint">${t("attHint")}</span></div>`; },
  listHtml(){
    const one = (f,i,isNew) => { const img = /^image\//.test(f.type), th = isNew ? f.url : this.thumbs[f.path];
      return `<div class="att-i">${img ? `<button type="button" class="att-th" data-act="${isNew?"attNewView":"attView"}" data-id="${i}" aria-label="${esc(f.name)}">${th?`<img src="${esc(th)}" alt="">`:icon("camera")}</button>`
        : `<button type="button" class="att-th doc" data-act="${isNew?"":"attView"}" data-id="${i}">${icon("file")}<span>${esc(extOf(f.name).toUpperCase()||"FILE")}</span></button>`}
        <span class="att-n">${esc(f.name)}</span><button type="button" class="att-x" data-act="${isNew?"attDropNew":"attDrop"}" data-id="${i}" aria-label="${t("del")}">${icon("x")}</button></div>`; };
    return [...this.keep.map((f,i)=>one(f,i,false)), ...this.add.map((f,i)=>one(f,i,true))].join("");
  },
  refresh(){ const el = document.getElementById("attList"); if(el) el.innerHTML = this.listHtml(); this.loadThumbs(); },
  async loadThumbs(){
    const need = this.keep.filter(f=>/^image\//.test(f.type) && !this.thumbs[f.path]); if(!need.length || !sb) return;
    for(const f of need){ const u = await signedUrl(f.path); if(u) this.thumbs[f.path] = u; }
    const el = document.getElementById("attList"); if(el) el.innerHTML = this.listHtml();
  },
  async pick(list){
    for(const file of [...list]){
      if(this.keep.length + this.add.length >= FILE_MAX){ toast(t("attMax",{n:FILE_MAX})); break; }
      const real = await sniff(file), ext = extOf(file.name), claimed = file.type || EXT_TYPE[ext] || "";
      let type = real && real!=="unknown" ? real : (real===null ? (EXT_TYPE[ext] && DOC_TYPES[EXT_TYPE[ext]] ? EXT_TYPE[ext] : "") : (ext==="csv" ? "text/csv" : ""));
      if(!type || (!IMG_TYPES.includes(type) && !DOC_TYPES[type])){ toast(t("attType")); continue; }
      if(IMG_TYPES.includes(type)){
        if(file.size>IMG_MAX_IN){ toast(t("attBig")); continue; }
        const blob = await shrinkImage(file); if(!blob){ toast(t("attImgFail")); continue; }
        this.add.push({blob, type:"image/jpeg", name:cleanName(file.name.replace(/\.[^.]+$/,"")+".jpg"), size:blob.size, url:URL.createObjectURL(blob)});
      } else {
        if(file.size>DOC_MAX){ toast(t("attBig")); continue; }
        this.add.push({blob:file, type, name:cleanName(file.name), size:file.size});
      }
    }
    this.refresh();
  },
  /* upload what's new; returns the final list for the record, or null if an upload failed */
  async commit(){
    if(this.busy) return null; this.busy = true;
    try{
      const out = this.keep.slice(), month = today().slice(0,7);
      for(const a of this.add){
        const id = newId(), ext = a.type==="image/jpeg" ? "jpg" : (DOC_TYPES[a.type]||"bin"), path = `${CID}/${month}/${id}.${ext}`;
        let error = null;
        if(window.DEMO_FILES) ({ error } = await window.DEMO_FILES.put(path, a.blob, a.type));
        else ({ error } = await sb.storage.from(BUCKET).upload(path, a.blob, {contentType:a.type, upsert:false, cacheControl:"3600"}));
        if(error){ toast(/exceed|size|quota|limit/i.test(error.message||"") ? t("attQuota") : t("attUpFail")); return null; }
        out.push({id, path, name:a.name, type:a.type, size:a.size, at:Date.now()});
      }
      return out;
    } finally { this.busy = false; }
  },
  /* after the record is saved: remove files the user took off it */
  done(){ if(this.drop.length) this.purge(this.drop); this.add.forEach(a=>a.url && URL.revokeObjectURL(a.url)); this.add = []; this.drop = []; },
  async purge(list){
    const paths = (list||[]).map(f=>f && f.path).filter(p=>typeof p==="string" && p.startsWith(CID+"/")); if(!paths.length) return;
    if(window.DEMO_FILES) return window.DEMO_FILES.remove(paths);
    try{ await sb.storage.from(BUCKET).remove(paths); }catch(e){}
  },
  async view(f){
    if(!f) return; const url = /^blob:/.test(f.url||"") ? f.url : await signedUrl(f.path);
    if(!url){ toast(t("attOpenFail")); return; }
    if(/^image\//.test(f.type)) return lightbox(url, f.name);
    const a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer"; document.body.appendChild(a); a.click(); a.remove();
  }
};
function lightbox(url, name){
  let lb = document.getElementById("lightbox");
  if(!lb){ lb = document.createElement("div"); lb.id = "lightbox"; lb.className = "lightbox"; document.body.appendChild(lb); }
  lb.innerHTML = `<button class="lb-x" data-act="lbClose" aria-label="${t("close")}">${icon("x")}</button><img alt="${esc(name||"")}"><a class="btn sm lb-open" target="_blank" rel="noopener noreferrer">${t("attOpen")}</a>`;
  lb.querySelector("img").src = url; lb.querySelector("a").href = url; lb.hidden = false;
}
document.addEventListener("change", e=>{ if(e.target.id==="attCam" || e.target.id==="attPick"){ const f = e.target.files; if(f && f.length) FILES.pick(f).then(()=>{ e.target.value = ""; }); } });
/* every file the company has, for "delete my account" */
async function purgeAllFiles(){
  const all = [...S.expenses, ...S.income, ...S.payments].flatMap(x=>Array.isArray(x.files)?x.files:[]);
  for(let i=0;i<all.length;i+=100) await FILES.purge(all.slice(i,i+100));
}
/* ===== support: write to the Daftar team, see their replies ===== */
const chatEl = document.getElementById("chat");
function openChat(mode){ S.chat.open = true; S.chat.mode = mode || (S.chat.unread ? "tickets" : "new"); S.chat.tid = null; chatEl.hidden = false; renderChat();
  if(CID) loadMyTickets(); }
function closeChat(){ S.chat.open = false; chatEl.hidden = true; if(S.screen==="app") render(); }
function md(s){ // tiny, safe formatting: escape first, then **bold** and line breaks
  return esc(s).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>").replace(/^(\d+)\.\s/gm,'<span class="num">$1.</span> ').replace(/\n/g,"<br>"); }
function renderChat(){
  if(!S.chat.open) return;
  const c = S.chat, signed = !!CID;
  let body;
  if(!signed) body = humanPane();
  else if(c.tid || c.mode==="tickets") body = ticketsPane();
  else body = newTicketPane();
  chatEl.innerHTML = `<div class="chat-back" data-act="closeChat"></div><section class="chat-panel" role="dialog" aria-label="${t("supTitle")}">
    <header class="chat-head"><span class="chat-logo">${MARK}</span><div class="col"><b>${t("supTitle")}</b><span class="sub">${t("supSubHuman")}</span></div><button class="iconbtn" data-act="closeChat" aria-label="${t("close")}">${icon("x")}</button></header>
    ${signed?`<div class="seg two-seg chat-tabs"><button data-act="chatMode" data-id="new" aria-pressed="${c.mode!=="tickets"}">${t("newMsg")}</button><button data-act="chatMode" data-id="tickets" aria-pressed="${c.mode==="tickets"}">${t("myTickets")}${c.unread?'<i class="dot"></i>':""}</button></div>`:""}
    ${body}</section>`;
  const m = document.getElementById("msgs"); if(m) m.scrollTop = m.scrollHeight;
}
function newTicketPane(){
  return `<form class="human" id="newTicketForm" novalidate><b>${t("supAsk")}</b><span class="sub">${t("supAskSub")}</span>
    <div class="sugg flat">${["sq1","sq2","sq3","sq4"].map(k=>`<button type="button" class="chip-btn" data-act="supTopic" data-id="${k}">${t(k)}</button>`).join("")}</div>
    <div class="field"><label for="nt_msg">${t("yourMsg")}</label><textarea id="nt_msg" name="msg" rows="5" maxlength="1500"></textarea></div>
    <button class="btn primary" type="submit">${icon("send")}${t("sendTeam")}</button><span class="hint">${t("supReplyTime")}</span></form>`;
}
function msgBubble(m){
  const who = m.role==="user" ? "me" : m.role==="support" ? "team" : "ai";
  return `<div class="bubble ${who}">${m.role==="support"?`<span class="who-l">${t("team")}</span>`:""}${m.text?md(m.text):""}</div>`;
}
function humanPane(){
  return `<form class="human" id="humanForm" novalidate><b>${t("humanForm")}</b>
    <div class="field"><label for="h_name">${t("yourName")}</label><input id="h_name" name="name" maxlength="80"></div>
    <div class="field"><label for="h_contact">${t("contactField")}</label><input id="h_contact" name="contact" maxlength="120" dir="ltr"></div>
    <div class="field"><label for="h_msg">${t("yourMsg")}</label><textarea id="h_msg" name="msg" rows="4" maxlength="1500"></textarea></div>
    <button class="btn primary" type="submit">${t("sendTeam")}</button><span class="hint">${t("supReplyTime")}</span></form>`;
}
function ticketsPane(){
  const c = S.chat;
  if(c.tid){ const tk = (c.tickets||[]).find(x=>x.id===c.tid); if(!tk) { c.tid = null; return ticketsPane(); }
    return `<div class="msgs" id="msgs"><div class="t-head"><button class="linkbtn" data-act="ticketBack">${icon(LANG==="en"?"chevE":"chevS")}${t("back")}</button><span class="pill ${tk.status==="answered"?"good":tk.status==="closed"?"":"warn"}">${t("tStatus_"+tk.status)}</span></div>
      ${(tk.messages||[]).map(m=>msgBubble({role:m.role==="ai"?"assistant":m.role, text:m.text})).join("")}</div>
      ${tk.status!=="closed"?`<form class="composer" id="ticketForm"><textarea id="ticketInput" rows="1" maxlength="1500" placeholder="${esc(t("replyPh"))}"></textarea><button class="send" type="submit" aria-label="${t("send")}">${icon("send")}</button></form>`:""}`; }
  if(!c.tickets) return `<div class="msgs"><div class="empty">${t("loading")}</div></div>`;
  if(!c.tickets.length) return `<div class="msgs"><div class="empty">${icon("chat","big")}<span>${t("noTickets")}</span><button class="btn" data-act="chatMode" data-id="new">${t("newMsg")}</button></div></div>`;
  return `<div class="msgs"><div class="list">${c.tickets.map(tk=>`<button class="row" data-act="openTicket" data-id="${esc(tk.id)}"><div class="m"><b>${esc(tk.subject||"—")}</b><span class="sub">${fdate(String(tk.updated_at).slice(0,10))}</span></div><span class="pill ${tk.status==="answered"?"good":tk.status==="closed"?"":"warn"}">${t("tStatus_"+tk.status)}</span></button>`).join("")}</div></div>`;
}
async function loadMyTickets(){
  if(!sb || !USER) return;
  const { data } = await sb.from("support_tickets").select("id,status,subject,messages,updated_at").order("updated_at",{ascending:false}).limit(30);
  S.chat.tickets = data || [];
  const seen = lsGet("ticketsSeen_"+USER.id, "");
  S.chat.unread = S.chat.tickets.some(x=>x.status==="answered" && String(x.updated_at) > seen);
  if(S.chat.open) renderChat();
}
async function checkTickets(){ const was = S.chat.unread; await loadMyTickets(); if(S.chat.unread && !was){ toast(t("newReply")); if(overlaysClosed()) render(); } }
function markTicketsSeen(){ if(USER){ lsSet("ticketsSeen_"+USER.id, new Date().toISOString()); S.chat.unread = false; } }

document.addEventListener("submit", async e=>{
  if(e.target.id==="newTicketForm"){ e.preventDefault(); const i = document.getElementById("nt_msg"), v = i.value.trim(); if(v.length<3){ toast(t("yourMsg")); return; }
    const b = e.target.querySelector('[type="submit"]'); b.disabled = true;
    const { error } = await sb.rpc("open_ticket", {p_subject:v.slice(0,150), p_messages:[{role:"user", text:v.slice(0,1500)}]});
    b.disabled = false;
    if(error){ toast(/too many/i.test(error.message||"") ? t("eTooMany") : t("eGeneric")); return; }
    toast(t("humanSent")); await loadMyTickets(); S.chat.mode = "tickets"; S.chat.tid = (S.chat.tickets&&S.chat.tickets[0]||{}).id || null; renderChat(); }
  if(e.target.id==="ticketForm"){ e.preventDefault(); const i = document.getElementById("ticketInput"), v = i.value.trim(); if(!v) return;
    const { error } = await sb.rpc("ticket_reply", {p_id:S.chat.tid, p_text:v.slice(0,1500)}); if(error){ toast(t("eGeneric")); return; } i.value = ""; await loadMyTickets(); }
  if(e.target.id==="humanForm"){ e.preventDefault(); const f = new FormData(e.target), name = String(f.get("name")||"").trim(), contact = String(f.get("contact")||"").trim(), msg = String(f.get("msg")||"").trim();
    if(contact.length<5){ toast(t("eContact")); return; } if(msg.length<3){ toast(t("yourMsg")); return; }
    const { error } = await sb.rpc("open_public_ticket", {p_name:name, p_contact:contact, p_message:msg});
    if(error){ toast(/too many/i.test(error.message||"") ? t("eTooMany") : t("eGeneric")); return; }
    e.target.reset(); toast(t("humanSentAnon")); }
});
document.addEventListener("keydown", e=>{ if(e.target.id==="ticketInput" && e.key==="Enter" && !e.shiftKey){ e.preventDefault(); e.target.form.requestSubmit(); } });
document.addEventListener("input", e=>{ if(e.target.id==="ticketInput"){ e.target.style.height = "auto"; e.target.style.height = Math.min(140, e.target.scrollHeight)+"px"; } });
/* ===== exports, sharing ===== */
function downloadCsv(name, rows){
  const cell = v => { const s = String(v ?? ""); return /[",\n;]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s; };
  const csv = "﻿" + rows.map(r=>r.map(cell).join(",")).join("\r\n");   // BOM so Excel reads Arabic correctly
  if(window.DEMO_MODE && window.claude && window.claude.use){ window.claude.use("downloads").then(d=>d ? d.save({filename:name, data:new Blob([csv],{type:"text/csv"})}).then(()=>toast(t("exported"))).catch(()=>{}) : toast(t("eGeneric"))); return; }
  const url = URL.createObjectURL(new Blob([csv], {type:"text/csv;charset=utf-8"}));
  const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 2000); toast(t("exported"));
}
const safeName = s => String(s||"").replace(/[\\/:*?"<>|]+/g,"").trim().slice(0,40) || "daftar";
function exportMoney(all){
  const a = all ? "0000-01-01" : (S.mmonth||monthStartOf(today())), b = all ? "9999-12-31" : monthEnd(a);
  const rows = [[t("date"), t("colType"), cap(term("unit")), t("colWhat"), t("colDesc"), t("colAmount"), t("currency")]];
  const cur = ST().currency, uname = id => (unitById(id)||{}).name || "";
  const items = [
    ...S.expenses.filter(x=>inRange(x.date,a,b)).map(x=>[x.date, t("expense"), uname(x.unitId), catLabel(x.category), x.item||"", -num(x.amount)]),
    ...S.income.filter(x=>inRange(x.date,a,b)).map(x=>[x.date, t("incomeOne"), uname(x.unitId), catLabel(x.category), x.note||"", num(x.amount)]),
    ...S.payments.filter(x=>inRange(x.date,a,b)).map(x=>[x.date, x.kind==="salary"?t("fromSalary"):t("advance"), uname(x.unitId), (staffById(x.staffId)||{}).name||"", x.note||"", -num(x.amount)]),
  ].sort((x,y)=>String(y[0]).localeCompare(String(x[0])));
  items.forEach(r=>rows.push([...r, cur]));
  downloadCsv(`${safeName(COMPANY&&COMPANY.name)}-${all?"all":a.slice(0,7)}.csv`, rows);
}
function exportPayroll(){
  const a = S.pstart, b = periodEnd(), list = S.view==="unit" ? unitStaff(S.uid) : S.staff.filter(s=>s.active!==false);
  const rows = [[t("staffName"), cap(term("unit")), t("colDays"), t("colAbsent"), t("colBase"), t("colOt"), t("advance"), t("fromSalary"), t("leftFor"), t("currency")]];
  list.forEach(s=>{ const k = account(s,a,b); rows.push([s.name, (unitById(s.unitId)||{}).name||"", k.days, k.absentN, fmt(k.base), fmt(k.ot), fmt(k.adv), fmt(k.paid), fmt(k.remaining), ST().currency]); });
  downloadCsv(`${safeName(COMPANY&&COMPANY.name)}-${t("tabAccount")}-${a}.csv`, rows);
}
function statementText(s){
  const a = S.pstart, b = periodEnd(), k = account(s,a,b), cur = curName();
  const L1 = [`${t("waHead",{x:s.name})}`, `${S.period==="month"?monthName(a).replace(/<[^>]+>/g,""):`${a} → ${lastWorkDay(a,b)}`}`, ""];
  L1.push(`${t("waDays",{n:k.days, days:k.days===1?t("dayW"):t("daysW"), r:fmt(k.days?k.base/k.days:dayRate(s,a))})} = ${fmt(k.base)} ${cur}`);
  if(k.ot) L1.push(`${t("otLine",{x:hrsTxt(k.otH).replace(/<[^>]+>/g,"")})}: +${fmt(k.ot)} ${cur}`);
  k.pp.forEach(x=>L1.push(`${x.kind==="salary"?t("fromSalary"):t("advance")} (${x.date}): −${fmt(num(x.amount))} ${cur}`));
  if(k.absentN) L1.push(t("absentN",{n:k.absentN}));
  L1.push("", `${k.remaining<-0.005?t("overpaid"):t("leftFor")}: ${fmt(Math.abs(k.remaining))} ${cur}`, `— ${COMPANY&&COMPANY.name||""}`, "", t("sentWith"));
  return L1.join("\n");
}
function waPhone(raw){
  const DIAL = {JOD:"962",SAR:"966",AED:"971",KWD:"965",QAR:"974",BHD:"973",OMR:"968",EGP:"20",IQD:"964",LBP:"961",SYP:"963",MAD:"212",TND:"216",DZD:"213",LYD:"218",SDG:"249",YER:"967",TRY:"90",GBP:"44"};
  let phone = String(raw||"").trim(); const plus = phone.startsWith("+"); phone = phone.replace(/[^0-9]/g,"");
  if(phone.startsWith("00")) phone = phone.slice(2); else if(!plus && phone.startsWith("0") && DIAL[ST().currency]) phone = DIAL[ST().currency] + phone.slice(1);
  return phone;
}
function openWaTo(phone, text){ const a = document.createElement("a"); a.href = `https://wa.me/${waPhone(phone)}?text=${encodeURIComponent(text)}`; a.target = "_blank"; a.rel = "noopener noreferrer"; document.body.appendChild(a); a.click(); a.remove(); }
function shareStatement(sid){ const s = staffById(sid); if(!s) return; openWaTo(s.phone, statementText(s)); }
/* the client's statement: what the job is worth, what they paid and when, what's left */
function clientStatementText(u){
  const cur = curName(), x = unitTotals(u.id), budget = num(u.budget), B = KP(u).budget;
  const pays = S.income.filter(i=>i.unitId===u.id).sort((a,b)=>(a.date||"").localeCompare(b.date||""));
  const L1 = [t("cstHead",{x:u.name}), u.client ? t("cstTo",{x:u.client}) : "", fdate(today()).replace(/<[^>]+>/g,""), ""];
  if(budget && B) L1.push(`${B[LI()]}: ${fmt(budget)} ${cur}`);
  if(pays.length){ L1.push(t("cstPaid")); pays.forEach(i=>L1.push(`• ${i.date}: ${fmt(num(i.amount))} ${cur}${i.note?" ("+i.note+")":""}`)); }
  L1.push("", `${t("cstTotalPaid")}: ${fmt(x.inc)} ${cur}`);
  if(budget) L1.push(`${t("cstLeft")}: ${fmt(Math.max(0,budget-x.inc))} ${cur}`);
  L1.push("", `— ${COMPANY&&COMPANY.name||""}`, "", t("sentWith"));
  return L1.filter((l,i,a)=>l!=="" || a[i-1]!=="").join("\n");
}
function shareClient(uid){ const u = unitById(uid); if(!u) return; openWaTo(u.clientPhone, clientStatementText(u)); }
/* ===== growth: bring your team in, tell another business owner ===== */
const SITE = "https://daftarapp.co";
async function copyText(txt, el){
  try{ await navigator.clipboard.writeText(txt); if(el){ const o = el.innerHTML; el.innerHTML = `${icon("check")}${t("copied")}`; setTimeout(()=>{ if(el.isConnected) el.innerHTML = o; }, 1800); } else toast(t("copied")); }
  catch(e){ toast(t("copyFail")); }
}
function openWa(text){ const a = document.createElement("a"); a.href = "https://wa.me/?text=" + encodeURIComponent(text); a.target = "_blank"; a.rel = "noopener noreferrer"; document.body.appendChild(a); a.click(); a.remove(); }
/* the owner's team: who's in, and a code to add someone (foreman, accountant, partner) */
async function teamSheet(){
  if(ROLE!=="owner"){ toast(t("onlyOwner")); return; }
  openSheet({title:t("teamAccess"), noSave:true, html:`<p class="sub">${t("teamIntro")}</p><div id="teamBox"><span class="hint">${t("loading")}</span></div>`});
  const { data, error } = window.DEMO_TEAM ? await window.DEMO_TEAM.list() : await sb.rpc("company_members");
  const box = document.getElementById("teamBox"); if(!box) return;
  if(error){ box.innerHTML = `<div class="alert warn">${icon("alert")}<span>${t("eGeneric")}</span></div>`; return; }
  const list = Array.isArray(data) ? data : [];
  box.innerHTML = `<div class="list">${list.map(m=>`<div class="row"><span class="avatar">${esc(initials(m.email))}</span><div class="m"><b class="ltr">${esc(m.email||"")}</b><span class="sub">${m.role==="owner"?t("roleOwner"):t("roleMember")}</span></div>
      ${m.role==="owner"?"":`<button type="button" class="btn sm ghost" data-act="rmMember" data-id="${esc(m.user_id)}">${t("remove")}</button>`}</div>`).join("")}</div>
    <div id="inviteBox">${S.lastInvite ? inviteCard(S.lastInvite) : `<button type="button" class="btn primary big" data-act="newInvite">${icon("plus")}${t("addPerson")}</button>`}</div>
    <span class="hint">${t("teamRules")}</span>`;
}
function inviteCard(code){
  const link = `${SITE}/app/?invite=${code}`;
  return `<div class="invite"><span class="label">${t("inviteCode")}</span><b class="code-big ltr">${esc(code.slice(0,4))}-${esc(code.slice(4))}</b>
    <span class="sub">${t("inviteValid")}</span>
    <div class="two"><button type="button" class="btn primary" data-act="sendInvite">${icon("send")}${t("sendWa")}</button><button type="button" class="btn" data-act="copyText" data-text="${esc(link)}">${icon("link")}${t("copyLink")}</button></div></div>`;
}
async function makeInvite(){
  const { data, error } = window.DEMO_TEAM ? await window.DEMO_TEAM.invite() : await sb.rpc("create_invite");
  if(error || !data || !data.code){ toast(/too many/i.test(String(error&&error.message)) ? t("eTooMany") : t("eGeneric")); return; }
  S.lastInvite = data.code; const box = document.getElementById("inviteBox"); if(box) box.innerHTML = inviteCard(data.code);
}
function sendInvite(){
  const c = S.lastInvite; if(!c) return;
  openWa(t("inviteMsg", {co:COMPANY&&COMPANY.name||"", code:`${c.slice(0,4)}-${c.slice(4)}`, link:`${SITE}/app/?invite=${c}`}));
}
/* word of mouth: one tap to tell another business owner */
async function shareApp(){
  const url = `${SITE}/get/?from=share`, text = t("shareMsg");
  if(navigator.share){ try{ await navigator.share({title:t("appName"), text, url}); if(window.dtrack) window.dtrack("copy_link"); return; }catch(e){ if(e && e.name==="AbortError") return; } }
  openWa(text + "\n" + url);
}

/* "try it with an example": a filled folder in one tap, so a new owner sees the point in seconds; removable in one tap */
const DEMO_COLS = ["units","staff","attendance","payments","expenses","income"];
const hasDemo = () => DEMO_COLS.some(c=>S[c].some(x=>x.demo));
async function demoLoad(el){
  if(el) el.disabled = true;
  const p = PRE(), uid = "demo-u-"+newId().slice(0,8), d0 = today();
  const days = [-2,-1,0].map(n=>addDays(d0,n)).filter(d=>!isOff(d) || d===d0);
  const ok = await save("units", uid, {demo:true, name:t("demoUnit",{x:p.unit[LI()][0]}), kind:ST().type, client:p.client?t("demoClient"):"", budget:p.budget?12000:0,
    status:"active", createdAt:Date.now(), startDate:addDays(d0,-2)}, true);
  if(!ok){ if(el) el.disabled = false; return; }
  const rt = p.pay==="day" ? "day" : p.pay==="week" ? "week" : "month", rate = rt==="day" ? 15 : rt==="week" ? 90 : 450;
  const people = [t("demoP1"), t("demoP2"), t("demoP3")];
  for(let i=0;i<people.length;i++){
    const sid = "demo-s"+i+"-"+uid.slice(7);
    await save("staff", sid, {demo:true, name:people[i], rateType:rt, rate, otRate:0, unitId:uid, active:true, createdAt:Date.now()+i, startDate:addDays(d0,-2)}, true);
    for(const d of days){ const s = staffById(sid), absent = i===2 && d===days[0];
      await save("attendance", d+"_"+sid, {demo:true, staffId:sid, date:d, unitId:uid, status:absent?"absent":"present", in:absent?"":ST().shiftIn, out:absent?"":(i===0?"19:00":ST().shiftOut), dayRate:dayRate(s,d), otRate:otRate(s,d), updatedAt:Date.now()}, true); }
  }
  await save("payments", "demo-p-"+uid.slice(7), {demo:true, staffId:"demo-s1-"+uid.slice(7), unitId:uid, kind:"advance", amount:20, date:d0, note:"", createdAt:Date.now()}, true);
  const ex = p.exp.slice(0,3), amts = [640, 120, 35];
  for(let i=0;i<ex.length;i++) await save("expenses", "demo-e"+i+"-"+uid.slice(7), {demo:true, unitId:uid, category:ex[i][0], amount:amts[i], date:days[Math.min(i,days.length-1)], item:"", supplier:"", payBy:"cash", files:[], createdAt:Date.now()+i}, true);
  await save("income", "demo-i-"+uid.slice(7), {demo:true, unitId:uid, category:p.inc[0][0], amount:2000, date:days[0], note:"", payBy:"transfer", files:[], createdAt:Date.now()}, true);
  S.uid = uid; S.view = "unit"; S.tab = "today"; S.date = d0; render(); toast(t("demoDone"));
}
async function demoClear(el){
  if(el && !armed(el, t("sure"))) return;
  for(const c of DEMO_COLS) for(const x of S[c].filter(r=>r.demo)) await remove(c, x.id);
  S.view = "home"; render(); toast(t("demoGone"));
}
/* ===== auth screens (one calm card) ===== */
function authShell(title, sub, form, foot=""){
  return `<div class="auth"><div class="auth-top"><span></span><button class="btn ghost sm" data-act="lang">${t("otherLang")}</button></div>
    <div class="auth-logo">${MARK}<b>${esc(t("appName"))}</b></div>
    <div class="auth-card"><h1 class="atitle">${title}</h1>${sub?`<p class="sub">${sub}</p>`:""}
      ${S.authMsg?`<div class="msg ${S.authMsgType||""}" role="status">${esc(S.authMsg)}</div>`:""}${form}</div>
    ${foot?`<div class="auth-foot">${foot}</div>`:""}
    <button class="help-link" data-act="support">${t("helpLogin")}</button></div>`;
}
const inp = (id,label,type,attrs="") => `<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" ${attrs}></div>`;
const pwInp = (id,label,auto) => `<div class="field"><label for="${id}">${label}</label><div class="pw"><input id="${id}" name="${id}" type="password" dir="ltr" autocomplete="${auto}" minlength="8" required><button type="button" class="pw-eye" data-act="eye" data-id="${id}" aria-label="${t("showPw")}">${t("showPw")}</button></div></div>`;
const selectF = (name,label,opts,val) => `<div class="field"><label for="${name}">${label}</label><select id="${name}" name="${name}">${opts.map(([v,l])=>`<option value="${esc(v)}" ${v===val?"selected":""}>${esc(l)}</option>`).join("")}</select></div>`;
const emailInp = () => inp("email",t("email"),"email",'autocomplete="email" inputmode="email" required dir="ltr"');
function authView(){
  const scr = S.screen;
  if(scr==="loading") return `<div class="splash">${MARK}<b>${esc(t("appName"))}</b></div>`;
  if(scr==="config") return `<div class="auth"><div class="auth-card"><b>${t("configMissing")}</b><p class="sub">${t("configMissingSub")}</p></div></div>`;
  if(scr==="signup") return authShell(S.invite ? t("joinTitle") : t("signup"), S.invite ? t("joinSub",{c:`<b class="ltr">${esc(S.invite)}</b>`}) : t("signupSub"),
    `<form data-form="signup" class="aform" novalidate>${S.invite ? `<input type="hidden" name="invite" value="${esc(S.invite)}">` : inp("company",t("companyName"),"text",'autocomplete="organization" required maxlength="80"')}
     ${emailInp()}${pwInp("password",t("pw8"),"new-password")}
     <button class="btn primary big" type="submit">${t("create")}</button>
     <p class="fine">${t("agree")} <a href="privacy.html" target="_blank" rel="noopener">${t("privacy")}</a></p></form>`,
    `${t("haveAccountQ")} <button class="linkbtn" data-act="goto" data-id="login">${t("login")}</button><br>${S.invite ? `<button class="linkbtn" data-act="dropInvite">${t("noInviteNew")}</button>` : `<button class="linkbtn" data-act="haveCode">${t("haveCode")}</button>`}`);
  if(scr==="code") return authShell(t("joinTitle"), t("codeEnterSub"),
    `<form data-form="entercode" class="aform" novalidate>${inp("code",t("inviteCode"),"text",'autocomplete="off" autocapitalize="characters" maxlength="12" dir="ltr" class="otp-in" required')}<button class="btn primary big" type="submit">${t("cont")}</button></form>`,
    `<button class="linkbtn" data-act="goto" data-id="signup">${t("backLogin")}</button>`);
  if(scr==="forgot") return authShell(t("forgot"), t("forgotSub"),
    `<form data-form="forgot" class="aform" novalidate>${emailInp()}<button class="btn primary big" type="submit">${t("sendCode")}</button></form>`,
    `<button class="linkbtn" data-act="goto" data-id="login">${t("backLogin")}</button>`);
  if(scr==="sent") return authShell(t("codeTitle"), t("codeSub",{e:`<b class="ltr">${esc(S.sentTo||"")}</b>`}),
    `<form data-form="otp" class="aform" novalidate><div class="field"><label for="otp">${t("codeLabel")}</label><input id="otp" name="otp" class="otp-in" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code" maxlength="10" dir="ltr" required></div>
     <button class="btn primary big" type="submit">${t("codeGo")}</button></form>
     <p class="hint center">${t("codeTip")}</p>
     ${S.sentKind==="reset"?"":`<p class="hint center">${t("codeLink")}</p>`}
     <button class="btn" data-act="resend">${t("resend")}</button>`,
    `<button class="linkbtn" data-act="goto" data-id="login">${t("backLogin")}</button>`);
  if(scr==="gate") return gateView();
  if(scr==="reset") return authShell(t("newPw"), t("newPwSub"),
    `<form data-form="reset" class="aform" novalidate>${pwInp("password",t("pw8"),"new-password")}<button class="btn primary big" type="submit">${t("savePw")}</button></form>`);
  if(scr==="nocompany") return authShell(t("companyName"), t("lastStep"),
    `<form data-form="company" class="aform" novalidate>${inp("company",t("companyName"),"text",'required maxlength="80"')}<button class="btn primary big" type="submit">${t("cont")}</button></form>
     <div class="or"><span>${t("orJoin")}</span></div>
     <form data-form="joincode" class="aform" novalidate>${inp("code",t("inviteCode"),"text",'autocomplete="off" autocapitalize="characters" maxlength="12" dir="ltr" class="otp-in"')}<button class="btn big" type="submit">${t("joinBtn")}</button></form>`,
    `<button class="linkbtn" data-act="logout">${t("logout")}</button>`);
  if(scr==="onboard") return onboardView();
  return authShell(t("login"), t("loginSub"),
    `<form data-form="login" class="aform" novalidate>${emailInp()}${pwInp("password",t("password"),"current-password")}
     <button class="btn primary big" type="submit">${t("enter")}</button>
     <button type="button" class="linkbtn center" data-act="goto" data-id="forgot">${t("forgotQ")}</button></form>`,
    `${t("noAccountQ")} <button class="linkbtn" data-act="goto" data-id="signup">${t("signupShort")}</button>`);
}
/* first-run: choose your line of business */
function onboardView(){
  const sel = S.obType || "contracting";
  return `<div class="auth wide"><div class="auth-logo">${MARK}<b>${esc(t("appName"))}</b></div>
    <div class="auth-card"><h1 class="atitle">${t("obTitle")}</h1><p class="sub">${t("obSub")}</p>
    <div class="sector-grid">${TYPES.map(k=>`<button type="button" class="sector ${sel===k?"on":""}" data-act="obPick" data-id="${k}" aria-pressed="${sel===k}">${icon(P[k].icon)}<span>${esc(P[k].name[LI()])}</span></button>`).join("")}</div>
    ${selectF("obCur",t("currency"),curOptions(),S.obCur||C.DEFAULT_CURRENCY||"JOD")}
    <button class="btn primary big" data-act="obDone">${t("obGo")}</button></div></div>`;
}
function setMsg(m, type){
  S.authMsg = m; S.authMsgType = type||"err";
  const form = document.querySelector(".auth form[data-form]"); if(!form){ render(); return; }
  let el = form.parentNode.querySelector(".msg");
  if(!el){ el = document.createElement("div"); el.setAttribute("role","status"); form.parentNode.insertBefore(el, form); }
  el.className = "msg "+S.authMsgType; el.textContent = m;
}
function authError(e){ const m = String(e && e.message || "");
  if(/invalid login/i.test(m)) return t("eBadLogin");
  if(/not confirmed/i.test(m)) return t("eConfirm");
  if(/already registered|already exists/i.test(m)) return t("eExists");
  if(/rate limit|too many|security purposes/i.test(m)) return t("eRate");
  if(/password/i.test(m) && /(weak|short|least|pwned|leaked)/i.test(m)) return t("eWeak");
  return t("eGeneric"); }
const validEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e) && e.length<=254;
const baseUrl = () => C.APP_URL || (location.origin + location.pathname);
const newSettings = v => ({type:P[v.type]?v.type:"other", currency:CUR[v.currency]?v.currency:(C.DEFAULT_CURRENCY||"JOD"), lang:LANG, weekend:LANG==="en"&&!/^ar/i.test(navigator.language||"")?[6,0]:[5], shiftIn:"08:00", shiftOut:"17:00", payPeriod:(P[v.type]||P.other).pay==="week"?"week":"month"});
const normCode = c => String(c||"").toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,8);
function setInvite(c){ S.invite = c || null; try{ c ? sessionStorage.setItem("invite", c) : sessionStorage.removeItem("invite"); }catch(e){} }
const FORMS = {
  async login(v){
    if(!validEmail(v.email) || !v.password) return setMsg(t("eFill"));
    const { error } = await sb.auth.signInWithPassword({email:v.email, password:v.password});
    if(error) setMsg(authError(error));
  },
  async signup(v){
    const code = normCode(v.invite);
    if(!code && (!v.company || v.company.length<2)) return setMsg(t("eName"));
    if(!validEmail(v.email)) return setMsg(t("eEmail"));
    if(v.password.length<8) return setMsg(t("ePw8"));
    const { data, error } = await sb.auth.signUp({email:v.email, password:v.password,
      options:{ data: code ? {invite_code:code} : {company_name:v.company.slice(0,80), company_settings:{lang:LANG, onboarded:false}}, emailRedirectTo: baseUrl() }});
    if(error) return setMsg(authError(error));
    if(!data.session){ S.sentTo = v.email; S.sentKind = "signup"; S.screen = "sent"; S.authMsg = ""; render(); }
  },
  async forgot(v){
    if(!validEmail(v.email)) return setMsg(t("eEmail"));
    const { error } = await sb.auth.resetPasswordForEmail(v.email, {redirectTo: baseUrl()});
    if(error && /rate|security purposes/i.test(error.message||"")) return setMsg(t("eRate"));
    S.sentTo = v.email; S.sentKind = "reset"; S.screen = "sent"; S.authMsg = ""; render();
  },
  async otp(v){
    const token = String(v.otp||"").replace(/\D/g,"");
    if(token.length<6) return setMsg(t("codeShort"));
    const rec = S.sentKind==="reset";
    if(rec) RECOVERING = true;
    const { error } = await sb.auth.verifyOtp({email:S.sentTo, token, type: rec ? "recovery" : "signup"});
    if(error){ if(rec) RECOVERING = false; return setMsg(t("codeBad")); }
    S.authMsg = "";
    if(rec){ S.screen = "reset"; render(); return; }
    await afterLogin();
  },
  async reset(v){
    if(v.password.length<8) return setMsg(t("ePw8"));
    const { error } = await sb.auth.updateUser({password:v.password});
    if(error) return setMsg(authError(error));
    toast(t("pwChanged")); S.authMsg = ""; RECOVERING = false; history.replaceState(null,"",location.pathname);
    if(BROWSER_RESET){ try{ await sb.auth.signOut(); }catch(e){} S.gateMsg = t("pwDoneBrowser"); S.screen = "gate"; render(); return; }
    await afterLogin();
  },
  async entercode(v){ const c = normCode(v.code); if(c.length!==8) return setMsg(t("eCode")); setInvite(c); S.screen = "signup"; S.authMsg = ""; render(); },
  async joincode(v){ const c = normCode(v.code); if(c.length!==8) return setMsg(t("eCode"));
    const { error } = await sb.rpc("join_company", {p_code:c}); if(error) return setMsg(/invalid/i.test(error.message||"") ? t("eCodeBad") : t("eGeneric"));
    setInvite(null); await afterLogin(); },
  async company(v){
    if(!v.company || v.company.length<2) return setMsg(t("eName"));
    const { error } = await sb.rpc("create_company", {p_name:v.company, p_phone:null, p_settings:{lang:LANG, onboarded:false}});
    if(error) return setMsg(t("eCreateCo"));
    await afterLogin();
  }
};
document.addEventListener("submit", async e=>{
  const f = e.target.closest("form[data-form]"); if(!f) return;
  e.preventDefault();
  const v = {}; new FormData(f).forEach((val,k)=>v[k]=String(val).trim());
  const pwEl = f.querySelector('[name="password"]'); if(pwEl) v.password = pwEl.value;
  const b = f.querySelector('[type="submit"]'); b.disabled = true; S.authMsg = "";
  try{ await FORMS[f.dataset.form](v); } finally { if(b.isConnected) b.disabled = false; }
});

/* ===== install gate: on phones Daftar only runs as the installed app ===== */
let RECOVERING = false, INSTALL_EVT = null, BROWSER_RESET = false;
const UA = navigator.userAgent || "";
const IS_IOS = /iPhone|iPad|iPod/.test(UA) || (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);
const IS_ANDROID = /Android/.test(UA);
const IN_APP_BROWSER = /Instagram|FBAN|FBAV|FB_IAB|musical_ly|BytedanceWebview|TikTok|Snapchat|WhatsApp/i.test(UA);
const IS_STANDALONE = () => window.matchMedia("(display-mode: standalone)").matches || window.matchMedia("(display-mode: fullscreen)").matches || window.matchMedia("(display-mode: minimal-ui)").matches || navigator.standalone === true;
function needsGate(){
  if(window.Capacitor || window.DEMO_MODE || IS_STANDALONE()) return false;
  if(/type=recovery/.test(location.hash)) { BROWSER_RESET = true; return false; }
  if(!IS_IOS && !IS_ANDROID){ try{ if(sessionStorage.getItem("dweb")==="1") return false; }catch(e){} }
  return true;
}
window.addEventListener("beforeinstallprompt", e=>{ e.preventDefault(); INSTALL_EVT = e; const b = document.getElementById("gateInstall"); if(b) b.hidden = false; });
window.addEventListener("appinstalled", ()=>{ if(window.dtrack) window.dtrack("installed"); });
function gateView(){
  const share = `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-8"/></svg>`;
  const iosSafari = IS_IOS && /Safari/.test(UA) && !/CriOS|FxiOS|EdgiOS/.test(UA) && !IN_APP_BROWSER;
  let steps = "";
  if(IS_IOS) steps = `${!iosSafari?`<div class="msg warn">${t("gateSafari")}</div>`:""}<ol class="gate-steps"><li>${share}<span>${t("gateIos1")}</span></li><li><span>${t("gateIos2")}</span></li><li><span>${t("gateIos3")}</span></li></ol>`;
  else steps = `<button class="btn primary big" id="gateInstall" data-act="gateInstall" ${INSTALL_EVT?"":"hidden"}>${t("gateInstall")}</button><ol class="gate-steps"><li><span>${t("gateAnd1")}</span></li><li><span>${t("gateAnd2")}</span></li></ol>`;
  return `<div class="auth"><div class="auth-top"><span></span><button class="btn ghost sm" data-act="lang">${t("otherLang")}</button></div>
    <div class="auth-logo">${MARK}<b>${esc(t("appName"))}</b></div>
    <div class="auth-card"><h1 class="atitle">${t("gateTitle")}</h1><p class="sub">${S.gateMsg || (S.gateDone?t("gateDone"):t("gateSub"))}</p>
      ${IN_APP_BROWSER?`<div class="msg warn">${t("gateInApp")}</div>`:""}${S.invite?`<div class="msg info">${t("gateKeepCode",{c:`<b class="ltr code-big">${esc(S.invite)}</b>`})}</div>`:""}${steps}
      <a class="btn big" href="../get/#how-${IS_IOS?"iphone":IS_ANDROID?"android":"pc"}">${t("gateHow")}</a></div>
    ${!IS_IOS && !IS_ANDROID ? `<div class="auth-foot"><button class="linkbtn" data-act="gateWeb">${t("gateWeb")}</button></div>` : ""}</div>`;
}

/* ===== session ===== */
let loggingIn = false;
async function afterLogin(){ if(loggingIn) return; loggingIn = true; try{ await afterLoginInner(); } finally { loggingIn = false; } }
async function afterLoginInner(){
  const { data:{ user } } = await sb.auth.getUser();
  if(!user){ S.screen = "login"; render(); return; }
  USER = user;
  let { data:mem } = await sb.from("members").select("company_id,role").maybeSingle();
  if(!mem){
    const meta = user.user_metadata || {}, code = normCode(meta.invite_code || S.invite);
    if(code){
      const j = await sb.rpc("join_company", {p_code:code});
      if(!j.error){ setInvite(null); ({ data:mem } = await sb.from("members").select("company_id,role").maybeSingle()); }
      else { S.authMsg = t("eCodeBad"); S.authMsgType = "err"; }
    }
    if(!mem && meta.company_name){
      const r = await sb.rpc("create_company", {p_name:meta.company_name, p_phone:meta.company_phone||null, p_settings:meta.company_settings||{}});
      if(!r.error) ({ data:mem } = await sb.from("members").select("company_id,role").maybeSingle());
    }
  }
  if(!mem){ S.screen = "nocompany"; render(); return; }
  CID = mem.company_id; ROLE = mem.role;
  const { data:comp } = await sb.from("companies").select("id,name,phone,settings").eq("id",CID).maybeSingle();
  COMPANY = comp || {name:"", settings:{}};
  if(COMPANY.settings && (COMPANY.settings.lang==="ar"||COMPANY.settings.lang==="en") && !lsGet("langChosen",false)) LANG = COMPANY.settings.lang;
  S.period = ST().payPeriod || PRE().pay; if(S.period!=="month") S.period = "week";
  S.date = today(); S.pstart = periodStartFor(S.date); S.view = "home";
  const st = COMPANY.settings || {};
  if(ROLE==="owner" && (st.onboarded===false || (!st.type && st.onboarded!==true))){ S.screen = "onboard"; S.obType = st.type || "contracting"; S.obCur = st.currency || C.DEFAULT_CURRENCY || "JOD"; render(); return; }
  S.screen = "app"; S.ready = false; render();
  if(await loadAll()){ subscribe(); render(); loadMyTickets(); }
}
async function logout(){
  if(channel) sb.removeChannel(channel); clearInterval(refreshT);
  await sb.auth.signOut();
  CID = USER = COMPANY = ROLE = null; COLS.forEach(c=>S[c]=[]); S.ready = false; S.view = "home"; S.screen = "login"; S.authMsg = "";
  S.chat = {open:false, mode:"ai", msgs:[], busy:false, tickets:null, tid:null, unread:false}; chatEl.hidden = true;
  closeSheet(); render();
}
function accountSheet(){
  openSheet({title:t("account"), noSave:true, html:`
    <div class="acct"><span class="avatar lg">${esc(initials(COMPANY&&COMPANY.name))}</span><div class="col"><b>${esc(COMPANY&&COMPANY.name||"")}</b><span class="sub ltr">${esc(USER&&USER.email||"")}</span><span class="sub">${icon(PRE().icon)} ${esc(PRE().name[LI()])}</span></div></div>
    <div class="menu">
    ${ROLE==="owner"?`<button type="button" class="mi" data-act="settings">${icon("gear")}${t("settings")}</button><button type="button" class="mi" data-act="team">${icon("users")}${t("teamAccess")}</button>`:""}
    <button type="button" class="mi" data-act="shareApp">${icon("send")}${t("shareApp")}</button>
    <button type="button" class="mi" data-act="changePw">${icon("key")}${t("changePw")}</button>
    <button type="button" class="mi" data-act="support">${icon("chat")}${t("navSupport")}</button>
    <button type="button" class="mi" data-act="exportAll">${icon("wallet")}${t("exportAll")}</button>
    <a class="mi" href="privacy.html" target="_blank" rel="noopener">${icon("shield")}${t("privacy")}</a>
    <button type="button" class="mi" data-act="logout">${icon("logout")}${t("logout")}</button></div>
    ${ROLE==="owner"?`<button type="button" class="linkbtn danger-link" data-act="deleteAcct">${t("delAcct")}</button>`:""}`});
}
function deleteSheet(){
  openSheet({title:t("delAcct"), saveLabel:t("delForever"),
    html:`<div class="alert bad">${icon("alert")}<span>${t("delWarn")}</span></div>`,
    fields:[{name:"confirm",label:t("delType",{x:esc(COMPANY.name)}),value:"",max:80}],
    submit: async v=>{
      if(v.confirm!==COMPANY.name){ toast(t("delMismatch")); return false; }
      const { error } = await sb.rpc("delete_my_account", {p_confirm:v.confirm});
      if(error){ toast(t("eGeneric")); return false; }
      try{ await purgeAllFiles(); }catch(e){}
      try{ localStorage.removeItem("chat_"+CID); }catch(e){}
      await logout(); toast(t("delDone")); return true;
    }});
}
function changePwSheet(){
  openSheet({title:t("changePw"),
    fields:[{name:"pw1",label:t("pw8"),type:"password"},{name:"pw2",label:t("pwAgain"),type:"password"}],
    submit: async ()=>{
      const a = document.getElementById("f_pw1").value, b = document.getElementById("f_pw2").value;
      if(a.length<8){ toast(t("ePw8")); return false; } if(a!==b){ toast(t("ePwMatch")); return false; }
      const { error } = await sb.auth.updateUser({password:a}); if(error){ toast(authError(error)); return false; }
      toast(t("pwChanged")); return true;
    }});
}

document.addEventListener("input", e=>{ if(e.target.id==="f_rate") rateHint();
  if(e.target.id==="whoq"){ const q = e.target.value.trim().toLowerCase(); document.querySelectorAll("#wholist .row").forEach(r=>r.hidden = !!q && !r.dataset.n.includes(q)); }
  if(e.target.id==="mq"){ S.mq = e.target.value; const pos = e.target.selectionStart; render(); const el = document.getElementById("mq"); if(el){ el.focus(); try{ el.setSelectionRange(pos,pos); }catch(_){} } } });

/* ===== actions ===== */
function armed(el, label){ if(el.dataset.armed==="1") return true; el.dataset.orig = el.textContent; el.dataset.armed = "1"; el.classList.add("armed"); el.textContent = label;
  setTimeout(()=>{ if(el.isConnected && el.dataset.armed==="1"){ el.dataset.armed = ""; el.classList.remove("armed"); el.textContent = el.dataset.orig; } }, 4000); return false; }
const A = {
  go: id => { S.view = id; if(id==="team"||id==="units"){ S.pstart = periodStartFor(today()); } scrollTo(0,0); render(); },
  home: () => A.go("home"),
  openUnit: id => { S.uid=id; S.view="unit"; S.tab="today"; S.date = today(); S.pstart = periodStartFor(S.date); scrollTo(0,0); render(); },
  newUnit: () => unitForm(), editUnit: () => unitForm(unitById(S.uid)),
  day: id => { if(id==="0") S.date = today(); else { const n = Number(id); S.date = addDays(S.date,n); for(let i=0;i<7 && isOff(S.date) && S.date!==today();i++) S.date = addDays(S.date,n); }
    S.pstart = periodStartFor(S.date); render(); },
  period: id => { S.period = id==="month" ? "month" : "week"; S.pstart = periodStartFor(S.view==="unit"?S.date:today()); render(); },
  pnav: id => { const n = Number(id); S.pstart = S.period==="month" ? addMonths(S.pstart,n) : addDays(S.pstart,7*n); render(); },
  mnav: id => { S.mmonth = addMonths(S.mmonth||monthStartOf(today()), Number(id)); render(); },
  mfilter: id => { S.mfilter = id; render(); },
  tab: id => { S.tab=id; render(); },
  addStaff: () => staffForm(), editStaff: id => staffForm(staffById(id)),
  moveHere: async id => { const s = staffById(id); if(!s) return; if(await save("staff",s.id,{...strip(s),unitId:S.uid})){ closeSheet(); toast(t("moved",{x:s.name})); } },
  mark: (id,el) => attSave(id, S.date, el.dataset.s, null, null, S.uid),
  allCame: async (id,el) => { el.disabled = true; for(const s of unitStaff(S.uid)) if(!attOf(s.id,S.date)){ if(!await attSave(s.id,S.date,"present",null,null,S.uid)) break; } toast(t("allMarked")); },
  times: id => timesForm(id),
  advance: id => payForm(null,{staffId:id, kind:"advance"}),
  editPay: id => payForm(S.payments.find(x=>x.id===id)),
  payRest: id => { const s = staffById(id), end = periodEnd(), k = account(s,S.pstart,end);
    payForm(null,{staffId:id, kind:"salary", amount:k.remaining, date: today()>=S.pstart && today()<=end ? today() : lastWorkDay(S.pstart,end)}); },
  newExp: () => moneyForm("exp"), editExp: id => moneyForm("exp", S.expenses.find(x=>x.id===id)),
  newInc: () => moneyForm("inc"), editInc: id => { const x = S.income.find(r=>r.id===id); if(x && x.trip) tripForm(x); else moneyForm("inc", x); },
  quick: () => quickSheet(),
  q: id => { closeSheet(); if(id==="trip") tripForm(null); else if(id==="adv") pickStaff("adv"); else if(id==="att") pickUnit("att"); else moneyForm(id==="inc"?"inc":"exp"); },
  // per-folder categories
  unitCats: id => unitCatsSheet(unitById(S.uid), id==="inc"?"inc":"exp"),
  catDel: async id => { const u = unitById(S.uid), kind = S.catKind||"exp", cur = unitCats(u, kind).map(p=>p[0]); if(cur.length<=1){ toast(t("eCatLast")); return; }
    cur.splice(Number(id),1); if(await save("units", u.id, {...strip(u), [kind==="exp"?"expCats":"incCats"]:cur}, true)) unitCatsSheet(unitById(u.id), kind); },
  catReset: async id => { const u = unitById(S.uid), kind = id==="inc"?"inc":"exp", d = strip(u); delete d[kind==="exp"?"expCats":"incCats"]; if(await save("units", u.id, d, true)) unitCatsSheet(unitById(u.id), kind); },
  quickCat: (id, el) => { if(document.getElementById("qcat")) return; el.insertAdjacentHTML("afterend", `<div class="inlineadd"><input id="qcat" maxlength="40" placeholder="${esc(t("newCat"))}"><button type="button" class="btn sm primary" data-act="quickCatSave" data-id="${id}">${t("add")}</button></div>`); document.getElementById("qcat").focus(); },
  quickCatSave: async id => { const kind = id==="inc"?"inc":"exp", inp = document.getElementById("qcat"), k = catKey(inp && inp.value); if(!k){ toast(t("eCatName")); return; }
    const sel = document.querySelector('#sheetBody [name="unitId"]'), u = unitById(sel ? sel.value : S.uid); if(!u){ toast(tv("eUnitPick")); return; }
    const cur = unitCats(u, kind).map(p=>p[0]);
    if(!cur.includes(k)){ const next = [...cur.filter(x=>x!=="أخرى"), k, ...(cur.includes("أخرى")?["أخرى"]:[])].slice(0,40); if(!await save("units", u.id, {...strip(u), [kind==="exp"?"expCats":"incCats"]:next}, true)) return; }
    refreshCatChips(kind); const r = [...document.querySelectorAll('#sheetBody [name="category"]')].find(x=>x.value===k); if(r) r.checked = true; inp.closest(".inlineadd").remove(); toast(t("catAdded",{x:k})); },
  // attachments
  attView: id => FILES.view(FILES.keep[Number(id)]), attNewView: id => { const f = FILES.add[Number(id)]; if(f) lightbox(f.url, f.name); },
  attDrop: id => { const f = FILES.keep.splice(Number(id),1)[0]; if(f) FILES.drop.push(f); FILES.refresh(); },
  attDropNew: id => { const f = FILES.add.splice(Number(id),1)[0]; if(f && f.url) URL.revokeObjectURL(f.url); FILES.refresh(); },
  lbClose: () => { const lb = document.getElementById("lightbox"); if(lb){ lb.hidden = true; lb.innerHTML = ""; } },
  // taxi & delivery
  haveCode: () => { S.screen = "code"; S.authMsg = ""; render(); }, dropInvite: () => { setInvite(null); render(); },
  team: () => { closeSheet(); teamSheet(); }, newInvite: () => makeInvite(), shareApp: () => { closeSheet(); shareApp(); },
  sendInvite: () => sendInvite(), copyText: (id, el) => copyText(el.dataset.text, el),
  rmMember: async (id, el) => { if(!armed(el, t("sure"))) return; const { error } = await sb.rpc("remove_member", {p_user:id}); if(error){ toast(t("eGeneric")); return; } toast(t("memberRemoved")); teamSheet(); },
  openUnitClose: id => { closeSheet(); A.openUnit(id); }, advFor: id => { closeSheet(); payForm(null,{staffId:id, kind:"advance"}); },
  newTrip: () => tripForm(null), tripOn: id => tripForm(null, {platform:id}), editTrip: id => tripForm(S.income.find(x=>x.id===id)),
  shiftStart: () => shiftForm(unitById(S.uid), "start"), shiftEnd: () => shiftForm(unitById(S.uid), "end"), shiftEdit: () => shiftForm(unitById(S.uid), "edit"),
  drvFuel: () => moneyForm("exp", null, {category:"بنزين"}),
  closeUnit: async (id,el) => { if(!armed(el,t("sure"))) return; const u = unitById(S.uid); if(await save("units",u.id,{...strip(u),status:"closed",closedAt:today()})) toast(t("closed")); },
  reopen: async () => { const u = unitById(S.uid); await save("units",u.id,{...strip(u),status:"active",closedAt:null}); },
  closeSheet: () => closeSheet(),
  sheetDel: async (id,el) => { if(!onDelete) return; if(!armed(el,t("sure"))) return; el.disabled = true; const ok = await onDelete.run(); if(ok!==false) closeSheet(); else el.disabled = false; },
  lang: () => { lsSet("langChosen", true); setLang(LANG==="en"?"ar":"en"); },
  goto: id => { S.screen = id; S.authMsg = ""; render(); },
  logout: () => logout(), account: () => accountSheet(),
  settings: () => { closeSheet(); settingsSheet(); }, changePw: () => { closeSheet(); changePwSheet(); },

  eye: id => { const i = document.getElementById(id); if(!i) return; const show = i.type==="password"; i.type = show ? "text" : "password"; const b = document.querySelector(`[data-act="eye"][data-id="${id}"]`); if(b) b.textContent = show ? t("hidePw") : t("showPw"); },
  gateInstall: async () => { if(window.dtrack) window.dtrack("install_click"); if(!INSTALL_EVT) return; INSTALL_EVT.prompt(); try{ await INSTALL_EVT.userChoice; }catch(e){} INSTALL_EVT = null; render(); },
  gateWeb: () => { try{ sessionStorage.setItem("dweb","1"); }catch(e){} location.reload(); },
  resend: async (id, el) => { el.disabled = true;
    const r = S.sentKind==="signup" ? await sb.auth.resend({type:"signup", email:S.sentTo, options:{emailRedirectTo:baseUrl()}}) : await sb.auth.resetPasswordForEmail(S.sentTo, {redirectTo:baseUrl()});
    toast(r && r.error ? (/rate|security purposes/i.test(r.error.message||"") ? t("eRate") : t("eGeneric")) : t("resent")); setTimeout(()=>{ if(el.isConnected) el.disabled = false; }, 30000); },
  obPick: id => { S.obType = id; const c = document.getElementById("obCur"); if(c) S.obCur = c.value; render(); },
  obDone: async (id, el) => { el.disabled = true; const c = document.getElementById("obCur"); S.obCur = c ? c.value : S.obCur;
    const settings = {...newSettings({type:S.obType, currency:S.obCur}), ...(COMPANY.settings||{}), type:S.obType, currency:S.obCur, payPeriod:(P[S.obType]||P.other).pay==="week"?"week":"month", onboarded:true};
    const { error } = await sb.from("companies").update({settings}).eq("id",CID);
    if(error){ el.disabled = false; toast(t("eGeneric")); return; }
    COMPANY.settings = settings; S.period = settings.payPeriod; S.pstart = periodStartFor(today());
    S.screen = "app"; S.ready = false; render(); if(await loadAll()){ subscribe(); render(); loadMyTickets(); } },
  deleteAcct: () => { closeSheet(); deleteSheet(); },
  openFirst: () => { const u = activeUnits()[0]; if(u) A.openUnit(u.id); },
  exportAll: () => { closeSheet(); exportMoney(true); },
  exportMonth: () => exportMoney(false), exportPayroll: () => exportPayroll(),
  shareWa: id => shareStatement(id), shareClient: id => shareClient(id), demoLoad: (id, el) => demoLoad(el), demoClear: (id, el) => demoClear(el), printReport: () => window.print(),
  // support
  support: () => { closeSheet(); openChat(); }, closeChat: () => closeChat(),
  supTopic: id => { const i = document.getElementById("nt_msg"); if(i){ i.value = t(id+"Text"); i.focus(); } },
  chatMode: id => { S.chat.mode = id; S.chat.tid = null; if(id==="tickets"){ markTicketsSeen(); loadMyTickets(); } renderChat(); },
  openTicket: id => { S.chat.mode = "tickets"; S.chat.tid = id; markTicketsSeen(); renderChat(); }, ticketBack: () => { S.chat.tid = null; renderChat(); },
};
document.addEventListener("click", e=>{ const el = e.target.closest("[data-act]"); if(!el) return; const f = A[el.dataset.act]; if(f){ e.preventDefault(); f(el.dataset.id, el); } });
document.addEventListener("change", e=>{
  const n = e.target.name;
  if(n==="qin"){ document.getElementById("f_in").value = e.target.value; tprev(); }
  else if(n==="qout"){ document.getElementById("f_out").value = e.target.value; tprev(); }
  else if(n==="in"||n==="out"){ ["qin","qout"].forEach(q=>document.querySelectorAll(`[name="${q}"]`).forEach(r=>r.checked = r.value===document.getElementById(q==="qin"?"f_in":"f_out").value)); tprev(); }
  else if(n==="rateType") rateHint();
  else if(n==="ukind"){ const v = vals(); const u = S.unitFormId ? unitById(S.unitFormId) : null;
    const comm = {}; Object.keys(v).filter(k=>k.startsWith("comm_")).forEach(k=>comm[k.slice(5)] = v[k]);
    unitForm(u, {name:v.name, kind:v.ukind, client:v.client, budget:v.budget, recurAmount:v.recurAmount, recurDay:v.recurDay, location:v.location, clientPhone:v.clientPhone, comm}); }
  else if(n==="unitId" && e.target.closest("#sheetBody") && document.querySelector('#sheetBody [name="category"]')){ refreshCatChips(S.mkind==="inc" ? "inc" : "exp"); }
});
document.addEventListener("keydown", e=>{ if(e.key==="Escape"){ const lb = document.getElementById("lightbox"); if(lb && !lb.hidden){ A.lbClose(); return; } if(!document.getElementById("sheet").hidden) closeSheet(); else if(S.chat.open) closeChat(); } });

/* ===== start ===== */
try{ const q = new URLSearchParams(location.search), c = normCode(q.get("invite")); if(c.length===8){ setInvite(c); history.replaceState(null,"",location.pathname); } else { const k = sessionStorage.getItem("invite"); if(k) S.invite = k; } }catch(e){}
// never run inside someone else's frame (clickjacking): GitHub Pages can't send X-Frame-Options, so we check here
if(window.top !== window.self && !window.DEMO_MODE){ try{ window.top.location.replace(location.href); }catch(e){ document.documentElement.innerHTML = ""; throw new Error("framed"); } }
S.date = today(); S.pstart = today();
if("serviceWorker" in navigator && location.protocol==="https:" && !window.Capacitor && !window.DEMO_MODE) navigator.serviceWorker.register("sw.js").catch(()=>{});
(async ()=>{
  applyDir();
  if(!C.SUPABASE_URL || !C.SUPABASE_ANON_KEY || /YOUR-/.test(C.SUPABASE_URL+C.SUPABASE_ANON_KEY)){ S.screen = "config"; render(); return; }
  if(needsGate()){
    // an old e-mail link opened in the browser: don't sign the browser in, send them back to the app
    if(/access_token|type=signup|type=recovery|error_description/.test(location.hash)){ S.gateDone = true; history.replaceState(null,"",location.pathname); }
    S.screen = "gate"; render(); return;
  }
  sb = window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY, {auth:{persistSession:true, autoRefreshToken:true, detectSessionInUrl:true, flowType:"implicit"}});
  RECOVERING = /type=recovery/.test(location.hash);
  sb.auth.onAuthStateChange((event)=>{
    if(event==="PASSWORD_RECOVERY"){ RECOVERING = true; S.screen = "reset"; S.authMsg = ""; render(); return; }
    if(event==="SIGNED_IN" && !RECOVERING && S.screen!=="app") setTimeout(afterLogin, 0);
    if(event==="SIGNED_OUT"){ if(BROWSER_RESET){ S.screen = "gate"; render(); return; } S.screen = "login"; render(); }
  });
  const { data:{ session } } = await sb.auth.getSession();
  if(RECOVERING && session){ S.screen = "reset"; render(); return; }
  if(session) await afterLogin(); else if(S.screen==="loading"){ S.screen = S.invite ? "signup" : "login"; render(); }
})();
