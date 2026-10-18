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
  eConfirmSent:["حسابك لسا مش مأكّد. بعتنالك رمز جديد على إيميلك، اكتبه هون.","Your account isn't confirmed yet. We sent a new code to your email, enter it here."], eBadLogin:["الإيميل أو كلمة السر غلط.","Wrong email or password."], eConfirm:["لازم تأكد إيميلك أول. تفقّد صندوق الوارد (وكمان الـ Spam).","Please confirm your email first. Check your inbox (and spam)."],
  eExists:["هالإيميل مسجّل من قبل. جرّب تسجيل الدخول أو \"نسيت كلمة السر\".","This email is already registered. Sign in or use \"Forgot password\"."],
  eRate:["محاولات كثير. استنى شوي وجرّب.","Too many attempts. Wait a bit and try again."], eMailSend:["ما قدرنا نبعت الإيميل هلأ. جرّب بعد دقيقة، وإذا ضلّت راسلنا.","We couldn't send the email right now. Try again in a minute, or contact us if it keeps happening."], eWeak:["كلمة السر ضعيفة. استعمل ٨ أحرف أو أكثر، فيها أرقام وحروف.","Weak password. Use 8+ characters with letters and numbers."],
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
  worksAt:["شغال بـ","Works at"], removeStaff:["شيل من القائمة","Remove from list"], addStaffBtn:["ضيف","Add"], eStaffName:["اكتب الاسم.","Enter a name."], ePayRate:["اكتب الراتب.","Enter the pay amount."],
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
    otMult: [1,1.25,1.5].includes(Number(s.otMult)) ? Number(s.otMult) : 1,
    taxNo: String(s.taxNo||""), address: String(s.address||""), taxRate: s.taxRate===undefined||s.taxRate===null||s.taxRate==="" ? 16 : Math.max(0,Math.min(50,Number(s.taxRate)||0)),
    incTax: !!s.incTax, invFoot: String(s.invFoot||"") }; };
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
  const lab = sum(S.attendance.filter(f), x=>dayPay(x).total), iv = invNetFor(f);
  return {exp:exp+iv.exp, inc:inc+iv.inc, lab, comm, cost:exp+iv.exp+lab, profit:inc+iv.inc-exp-iv.exp-lab};
}
function companyTotals(a,b){
  const f = x => inRange(x.date,a,b);
  const incs = S.income.filter(f), comm = sum(incs, commOf);
  const iv = invNetFor(f), exp = sum(S.expenses.filter(f), x=>num(x.amount)) + comm + iv.exp, inc = sum(incs, x=>num(x.amount)) + iv.inc, lab = sum(S.attendance.filter(f), x=>dayPay(x).total);
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
  // paid leave, social security and income tax (HR module)
  const lvN = typeof leaveDays==="function" ? leaveDays(s.id,a,b) : 0, lvPay = Math.round(lvN*dayRate(s,a)*100)/100;
  const earned = base+ot+lvPay, span = Math.round((parseD(b)-parseD(a))/864e5)+1;
  let ssE = 0, ssR = 0, tax = 0;
  if(typeof ssEmpRate==="function"){ const capd = Math.min(earned, ssCap()*Math.max(1,span)/30);
    if(s.ss){ ssE = Math.round(capd*ssEmpRate()*100)/100; ssR = Math.round(capd*ssErRate()*100)/100; }
    tax = Math.round(num(s.taxMonthly)*Math.min(1, span/30)*100)/100; }
  return {days, absentN, base, ot, otH, lateH, lvN, lvPay, earned, ssE, ssR, tax, adv, paid, pp, remaining:earned-ssE-tax-adv-paid};
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
    S.view==="unit" ? viewUnit() : S.view==="units" ? viewUnits() : S.view==="team" ? viewTeam() : S.view==="money" ? viewBooks() : viewHome();
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
  const hasBooks = S.invoices.length>0 || S.vouchers.length>0;
  if(!hasBooks && !(hasUnit && hasStaff && (hasAtt||hasMoney))){
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
  if(typeof radarHomeCard==="function") h += radarHomeCard();
  if(typeof pushHomeCard==="function") h += pushHomeCard();
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
  items.unshift(...bookAlerts());
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
  if(k.lvPay) lines.push([`${t("hrLeavePay")} (<span class="num">${k.lvN}</span>)`, k.lvPay, "+"]);
  if(k.ssE) lines.push([t("hrSSEmp"), k.ssE, "-"]);
  if(k.tax) lines.push([t("hrIncTax"), k.tax, "-"]);
  k.pp.forEach(x=>lines.push([x.kind==="salary"?t("paidLine",{d:fdate(x.date)}):t("advLine",{d:fdate(x.date)}), num(x.amount), "-", x.id]));
  const r = k.remaining, u = unitById(s.unitId);
  return `<div class="panel"><div class="whead"><div class="who"><span class="avatar">${esc(initials(s.name))}</span><div class="col"><b>${esc(s.name)}</b><span class="sub">${S.view==="team"&&u?esc(u.name)+" · ":""}${k.absentN?t("absentN",{n:`<span class="num">${k.absentN}</span>`})+" · ":""}${k.lateH?t("late",{x:hrsTxt(k.lateH)}):""}</span></div></div></div>
    <div class="kv">${lines.map(([l,v,sg,id])=>`<div ${id?`data-act="editPay" data-id="${esc(id)}" class="clickable"`:""}><span>${l}</span><b class="${sg==="-"?"negv":sg==="+"?"pos":""}">${sg==="-"?"− ":sg==="+"?"+ ":""}${money(v)}</b></div>`).join("")}</div>
    <div class="total"><span class="label">${r<-0.005?t("overpaid"):t("leftFor")}</span><b class="${r>0.005?"due":r<-0.005?"negv":"pos"}">${money(Math.abs(r))}</b></div>
    <div class="two">${r>0.005?`<button class="btn primary" data-act="payRest" data-id="${esc(s.id)}">${t("payRest",{x:fmt(r)})}</button>`:k.earned>0?`<span class="pill good self-start">${icon("check")}${t("settled")}</span>`:"<span></span>"}<button class="btn" data-act="shareWa" data-id="${esc(s.id)}">${icon("send")}${t("waStatement")}</button></div>
    <div class="two"><button class="btn ghost sm" data-act="payslip" data-id="${esc(s.id)}">${icon("file")}${t("hrPayslip")}</button><button class="btn ghost sm" data-act="leave" data-id="${esc(s.id)}">${icon("calendar")}${t("hrLeave")}</button></div></div>`;
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
  h += `<div class="two"><button class="btn" data-act="leave">${icon("calendar")}${t("hrLeaveNew")}</button>${ss.some(x=>x.ss)?`<button class="btn" data-act="ssSheet">${icon("file")}${t("hrSSSheet")}</button>`:"<span></span>"}</div>`;
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
function openSheet({title, fields=[], more=[], html="", top="", submit, del, saveLabel, noSave}){
  document.getElementById("sheetTitle").textContent = title;
  document.getElementById("sheetBody").innerHTML = top + fields.map(field).join("") + html + (more.length?`<details><summary>${t("more")}</summary><div class="morebox">${more.map(field).join("")}</div></details>`:"");
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
      ...(s?[{name:"unitId",label:t("worksAt"),type:"select",options:unitOptions(s.unitId),value:s.unitId}]:[]),
      {name:"ss",label:t("hrSS"),type:"chips",options:[["0",t("no")],["1",t("yes")]],value:s?.ss?"1":"0"},{name:"ssNo",label:t("hrSSNo"),value:s?.ssNo||"",max:30},
      {name:"family",label:t("hrFamily"),type:"chips",options:[["0",t("no")],["1",t("yes")]],value:s?.family?"1":"0"},
      {name:"taxMonthly",label:t("hrTax"),type:"money",value:s?.taxMonthly||"",hint:`<button type="button" class="linkbtn" data-act="taxEst">${t("hrTaxEst")}</button> · ${t("hrTaxHint",{f:t("hrFam")})}`}],
    del: s ? {label:t("removeStaff"), run:()=>save("staff",s.id,{...strip(s),active:false})} : null,
    submit: async v=>{
      if(!v.name){ toast(t("eStaffName")); return false; }
      if(num(v.rate)<=0){ toast(t("ePayRate")); return false; }
      const data = {...(s?strip(s):{createdAt:Date.now(),active:true,startDate:today()}), name:v.name.slice(0,80), role:(v.role||"").slice(0,60), phone:(v.phone||"").slice(0,30), rateType:v.rateType||defType, rate:num(v.rate), otRate:num(v.otRate), unitId:v.unitId || s?.unitId || S.uid,
        ss:v.ss==="1", ssNo:(v.ssNo||"").slice(0,30), family:v.family==="1", taxMonthly:num(v.taxMonthly)};
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
    ["exp","minus",t("expense"),t("qExpSub")], ["inc","plus",t("incomeOne"),t("qIncSub")], ...(staff?[["adv","wallet",t("addAdvance").replace(/^\+\s*/,""),t("qAdvSub")]]:[]),
    ["inv","file",t("newSale"),t("qInvSub")], ["rec","bank",t("vNewR"),t("qRecSub")], ...(S.items.some(i=>num(i.price)>0)?[["pos","bag",t("pos"),t("posSub")]]:[])]; };
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
      {name:"phone",label:t("phoneCo"),type:"tel",value:COMPANY.phone||"",max:30},
      {name:"taxNo",label:t("setTaxNo"),value:s.taxNo||"",max:30},{name:"address",label:t("setAddr"),value:s.address||"",max:120},
      {name:"taxRate",label:t("setTax"),type:"chips",options:[["16","16%"],["10","10%"],["8","8%"],["4","4%"],["0",t("taxExempt")]],value:String(s.taxRate===undefined||s.taxRate===null||s.taxRate===""?16:s.taxRate)},
      {name:"incTax",label:t("setIncTax"),type:"chips",options:[["0",LANG==="en"?"No":"لا"],["1",LANG==="en"?"Yes":"آه"]],value:s.incTax?"1":"0"},
      {name:"invFoot",label:t("setInvFoot"),value:s.invFoot||"",max:120,ph:t("thanksInv")},
      {name:"ssEmp",label:t("setSSEmp"),type:"money",value:String((COMPANY.settings||{}).ssEmp ?? 7.5),hint:t("hrSSHint")},{name:"ssEr",label:t("setSSEr"),type:"money",value:String((COMPANY.settings||{}).ssEr ?? 14.25)},
      {name:"ssCap",label:t("setSSCap"),type:"money",value:String((COMPANY.settings||{}).ssCap ?? 3733)}],
    submit: async v=>{
      if(!v.name || v.name.length<2){ toast(t("eName")); return false; }
      const settings = {...(COMPANY.settings||{}), type:P[v.type]?v.type:"other", currency:CUR[v.currency]?v.currency:"JOD", lang:v.lang==="en"?"en":"ar",
        weekend:(v.weekend||[]).map(Number).filter(n=>n>=0&&n<=6), shiftIn:mins(v.shiftIn)!=null?v.shiftIn:"08:00", shiftOut:mins(v.shiftOut)!=null?v.shiftOut:"17:00", payPeriod:v.payPeriod==="month"?"month":"week", otMult:[1,1.25,1.5].includes(Number(v.otMult))?Number(v.otMult):1,
        taxNo:(v.taxNo||"").slice(0,30), address:(v.address||"").slice(0,120), taxRate:Math.max(0,Math.min(50,num(v.taxRate))), incTax:v.incTax==="1", invFoot:(v.invFoot||"").slice(0,120),
        ssEmp:Math.max(0,Math.min(30,num(v.ssEmp))), ssEr:Math.max(0,Math.min(40,num(v.ssEr))), ssCap:num(v.ssCap)||3733};
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
  const roles = ["manager","accountant","cashier","viewer"];
  box.innerHTML = `<div class="list">${list.map(m=>`<div class="row static memrow"><span class="avatar">${esc(initials(m.email))}</span><div class="m"><b class="ltr">${esc(m.email||"")}</b><span class="sub">${t(ROLE_L[m.role]||"roleMember")}</span>
      ${m.role==="owner"?"":`<div class="chiprow">${roles.map(r=>`<button type="button" class="chipbtn sm" data-act="setRole" data-id="${esc(m.user_id)}" data-r="${r}" aria-pressed="${m.role===r||(r==="manager"&&m.role==="member")}">${t(ROLE_L[r])}</button>`).join("")}</div>`}</div>
      ${m.role==="owner"?"":`<button type="button" class="btn sm ghost" data-act="rmMember" data-id="${esc(m.user_id)}">${t("remove")}</button>`}</div>`).join("")}</div><span class="hint">${t("roleHint")}</span>
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
  if(/error sending|smtp/i.test(m)) return t("eMailSend");
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
    if(error && /not confirmed/i.test(error.message||"")){
      // signed up but never typed the code: take them straight to the code screen with a fresh code
      S.sentTo = v.email; S.sentKind = "signup"; S.screen = "sent"; render();
      const r = await sb.auth.resend({type:"signup", email:v.email, options:{emailRedirectTo:baseUrl()}});
      r && r.error ? setMsg(authError(r.error)) : setMsg(t("eConfirmSent"), "info"); return;
    }
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
    if(error) return setMsg(authError(error));
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
  if(await loadAll()){ subscribe(); render(); loadMyTickets(); if(typeof pushResync==="function") pushResync(); }
}
async function logout(){
  if(channel) sb.removeChannel(channel); clearInterval(refreshT);
  try{ if(typeof pushCurrent==="function"){ const ps = await pushCurrent(); if(ps) await sb.rpc("push_unsubscribe", {p_endpoint:ps.endpoint}); } }catch(e){}   // a signed-out phone gets no company news
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
    <button type="button" class="mi" data-act="push">${icon("bell")}${t("pushT")}</button>
    <button type="button" class="mi" data-act="shareApp">${icon("send")}${t("shareApp")}</button>
    <button type="button" class="mi" data-act="changePw">${icon("key")}${t("changePw")}</button>
    <button type="button" class="mi" data-act="support">${icon("chat")}${t("navSupport")}</button>
    <button type="button" class="mi" data-act="exportXls">${icon("wallet")}${t("exportXls")}</button>
    <button type="button" class="mi" data-act="exportAll">${icon("wallet")}${t("exportAll")}</button>
    ${ROLE==="owner"?`<button type="button" class="mi" data-act="activity">${icon("clock")}${t("activity")}</button>`:""}
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
    toast(r && r.error ? authError(r.error) : t("resent")); setTimeout(()=>{ if(el.isConnected) el.disabled = false; }, 30000); },
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
/* =====================================================================
   Sales & purchases: customers / suppliers, items, invoices with tax,
   receipts & payments, cheques, statements, VAT & receivables reports.
   Lives under the "money" tab as sub-pages, so the bottom bar stays the same.
   ===================================================================== */
Object.assign(L, {
  bkMoves:["الحركات","Moves"], bkInv:["الفواتير","Invoices"], bkParties:["العملاء","Contacts"], bkCheques:["الشيكات","Cheques"], bkReports:["التقارير","Reports"],
  bkMoneyT:["الحسابات","Accounts"],
  // invoice types
  itSale:["فاتورة بيع","Sales invoice"], itPurchase:["فاتورة شراء","Purchase bill"], itSaleRet:["مرتجع مبيعات","Sales return"], itPurRet:["مرتجع مشتريات","Purchase return"], itQuote:["عرض سعر","Quotation"],
  itSales:["المبيعات","Sales"], itPurchases:["المشتريات","Purchases"], itQuotes:["عروض الأسعار","Quotes"], itReturns:["المرتجعات","Returns"],
  newSale:["فاتورة بيع","Sales invoice"], newPurchase:["فاتورة شراء","Purchase bill"],
  // parties
  pCustomer:["زبون","Customer"], pSupplier:["مورّد","Supplier"], pBoth:["زبون ومورّد","Both"], pCustomers:["الزباين","Customers"], pSuppliers:["الموردين","Suppliers"],
  pNew:["زبون أو مورّد جديد","New contact"], pName:["الاسم","Name"], pKind:["مين هو؟","Who is it?"], pPhone:["رقم الجوال","Mobile"], pTaxNo:["الرقم الضريبي","Tax number"],
  pAddr:["العنوان","Address"], pOpen:["رصيد افتتاحي","Opening balance"], pOpenHint:["إذا عليه مصاري قبل ما تبلش بدفتر اكتبها موجب، وإذا إلو عندك اكتبها بالسالب.","If they owed you before Daftar, enter it positive; if you owed them, negative."],
  pLimit:["سقف الدين","Credit limit"], eParty:["اختار الزبون أو المورّد","Pick a customer or supplier"], ePartyName:["اكتب الاسم","Enter a name"],
  owesUs:["عليه إلنا","Owes us"], weOwe:["إلو علينا","We owe"], settledP:["مسكّر","Settled"], noParties:["لسا ما في زباين ولا موردين.","No customers or suppliers yet."],
  noPartiesSub:["ضيفهم مرة وحدة، وبعدها كل فاتورة وكل دفعة بتنحسب على حسابهم لحالها.","Add them once and every invoice and payment lands on their account automatically."],
  statement:["كشف حساب","Statement"], stOpen:["رصيد أول المدة","Opening balance"], stBal:["الرصيد","Balance"], stDebit:["مدين","Debit"], stCredit:["دائن","Credit"],
  stShare:["ابعت الكشف واتساب","Send statement on WhatsApp"], stPrint:["اطبع الكشف","Print statement"], stAll:["كل الفترات","All time"],
  overLimit:["تعدّى سقف الدين ({x})","Over credit limit ({x})"],
  // items
  items:["الأصناف والخدمات","Items & services"], itemNew:["صنف جديد","New item"], itemName:["اسم الصنف أو الخدمة","Item or service name"], itemPrice:["سعر البيع","Sale price"], itemCost:["سعر الشراء","Cost price"],
  itemUnit:["الوحدة","Unit"], itemUnitPh:["قطعة، متر، كيلو، ساعة…","piece, metre, kg, hour…"], itemSku:["الكود (اختياري)","Code (optional)"], noItems:["ما في أصناف. بتقدر تكتب أي صنف جوّا الفاتورة وبينحفظ لحاله.","No items yet. Type any item on an invoice and it's saved for next time."],
  // invoice form
  invParty:["الزبون","Customer"], invSupplier:["المورّد","Supplier"], invDate:["تاريخ الفاتورة","Invoice date"], invDue:["الدفع","Payment"], dueCash:["نقدي","Cash"], dueDays:["بعد {n} يوم","{n} days"],
  invLines:["الأصناف","Items"], lnItem:["الصنف","Item"], lnQty:["الكمية","Qty"], lnPrice:["السعر","Price"], lnTax:["الضريبة","Tax"], lnDisc:["خصم","Disc."], addLine:["سطر جديد","Add line"],
  incTax:["الأسعار شاملة الضريبة","Prices include tax"], invDiscount:["خصم على الفاتورة","Invoice discount"], invNotes:["ملاحظات تطلع على الفاتورة","Notes printed on the invoice"],
  supInvNo:["رقم فاتورة المورّد","Supplier's bill number"], forUnitOpt:["على أي مشروع؟ (اختياري)","For which project? (optional)"],
  subTotal:["المجموع قبل الضريبة","Subtotal"], taxTotal:["الضريبة","Tax"], discountL:["الخصم","Discount"], grandTotal:["المجموع","Total"], paidNow:["انقبض هلأ","Paid now"], paidNowP:["ندفع هلأ","Paid now"],
  eLines:["ضيف صنف واحد عالأقل بسعر","Add at least one item with a price"], invSaved:["انحفظت {x} رقم {n}","{x} {n} saved"],
  taxExempt:["معفى","Exempt"],
  // invoice view
  invNoS:["رقم","No."], status:["الحالة","Status"], chWeek:["مستحق خلال أسبوع","Due within a week"], stPaid:["مدفوعة","Paid"], stPartial:["مدفوعة جزئياً","Part paid"], stUnpaid:["مش مدفوعة","Unpaid"], stOverdue:["متأخرة","Overdue"], stQuote:["عرض سعر","Quote"],
  remainingL:["الباقي","Balance due"], paidL:["المدفوع","Paid"], recordPay:["سجّل دفعة","Record payment"], printInv:["اطبع / PDF","Print / PDF"], shareInv:["ابعت واتساب","Send on WhatsApp"],
  toInvoice:["حوّله لفاتورة","Convert to invoice"], makeReturn:["اعمل مرتجع","Make a return"], dupInv:["نسخة جديدة","Duplicate"], editInv:["عدّل","Edit"],
  payments_:["الدفعات","Payments"], noInvoices:["لسا ما في فواتير.","No invoices yet."], noInvoicesSub:["اعمل أول فاتورة بدقيقة: اختار الزبون، اكتب الأصناف، والضريبة بتنحسب لحالها.","Make your first invoice in a minute: pick the customer, type the items, tax is worked out for you."],
  invSearch:["ابحث برقم الفاتورة أو الاسم…","Search by number or name…"], thanksInv:["شكراً لتعاملكم معنا","Thank you for your business"], taxNoL:["الرقم الضريبي","Tax No."], billTo:["إلى","Bill to"],
  dueOnL:["تاريخ الاستحقاق","Due date"], waInv:["{type} رقم {n}\nمن: {co}\nالتاريخ: {d}\n\n{lines}\n\nالمجموع: {t}{paid}\n\n{foot}","{type} {n}\nFrom: {co}\nDate: {d}\n\n{lines}\n\nTotal: {t}{paid}\n\n{foot}"],
  waLeft:["\nالمدفوع: {p}\nالباقي: {r}","\nPaid: {p}\nBalance due: {r}"],
  // vouchers
  vReceipt:["سند قبض","Receipt"], vPayment:["سند صرف","Payment"], vNewR:["قبضنا من زبون","Received from customer"], vNewP:["دفعنا لمورّد","Paid a supplier"],
  vAmount:["المبلغ","Amount"], vMethod:["طريقة الدفع","Method"], vForInv:["عن أي فاتورة؟","For which invoice?"], vNoInv:["على الحساب","On account"], vSaved:["انحفظ {x}: {a}","{x} saved: {a}"],
  vVoid:["ملغي (شيك راجع)","Void (bounced cheque)"],
  // cheques
  chIn:["شيكات واردة","Received cheques"], chOut:["شيكات صادرة","Issued cheques"], chNo:["رقم الشيك","Cheque no."], chBank:["البنك","Bank"], chDue:["تاريخ الاستحقاق","Due date"],
  chPending:["بالدرج","Pending"], chDeposited:["مودع بالبنك","Deposited"], chCleared:["انصرف","Cleared"], chBounced:["راجع","Bounced"], chHanded:["مسلّم للمورّد","Handed over"],
  chMarkDep:["أودعته بالبنك","Deposited"], chMarkClr:["انصرف","Cleared"], chMarkBnc:["رجع","Bounced"], noCheques:["ما في شيكات.","No cheques."],
  chBouncedToast:["انلغى القبض وارجع المبلغ على حساب {x}","Receipt voided; amount is back on {x}'s account"], chDueSoon:["شيكات مستحقة خلال أسبوع: {n} بقيمة {x}","Cheques due this week: {n} worth {x}"],
  chOverdue:["فات موعده","Past due"], chInDays:["بعد {n} يوم","in {n} days"], chToday:["اليوم","today"],
  // reports
  rSales:["المبيعات (بدون ضريبة)","Sales (excl. tax)"], rPurch:["المشتريات (بدون ضريبة)","Purchases (excl. tax)"], rGross:["مجمل الربح من الفواتير","Gross profit from invoices"],
  rTaxOut:["ضريبة على المبيعات","Output tax"], rTaxIn:["ضريبة على المشتريات","Input tax"], rTaxDue:["الضريبة المستحقة للدفع","Tax payable"], rTaxRefund:["ضريبة إلك (مسترد)","Tax refundable"],
  rRecv:["إلنا عند الناس","Receivables"], rPay:["علينا للناس","Payables"], rAging:["أعمار الديون","Receivables aging"], rTop:["أكثر الزباين شراء","Top customers"],
  rAge0:["لسا ما استحقت","Not due"], rAge30:["1-30 يوم","1-30 days"], rAge60:["31-60 يوم","31-60 days"], rAge90:["61-90 يوم","61-90 days"], rAge90p:["أكثر من 90","90+ days"],
  rTaxNote:["ضريبة المبيعات العامة بالأردن 16%. هاد الرقم للاسترشاد، راجع محاسبك قبل الإقرار.","Jordan's general sales tax is 16%. This figure is a guide; check with your accountant before filing."],
  rPeriod:["الفترة","Period"], rMonth:["الشهر","Month"], rQuarter:["شهرين (فترة الإقرار)","2 months (filing period)"], rYear:["السنة","Year"], exportInv:["صدّر الفواتير Excel","Export invoices (Excel)"],
  // settings
  setTaxNo:["الرقم الضريبي للشركة","Company tax number"], setAddr:["عنوان الشركة (يطلع على الفاتورة)","Company address (on invoices)"], setTax:["نسبة الضريبة الأساسية","Default tax rate"],
  setInvFoot:["سطر أسفل الفاتورة","Invoice footer line"], setIncTax:["أسعاري شاملة الضريبة","My prices include tax"],
  // home
  aOverdueInv:["فواتير متأخرة: {n} بقيمة {x}","Overdue invoices: {n} worth {x}"], aChequesDue:["شيكات مستحقة خلال أسبوع: {n} بقيمة {x}","Cheques due within a week: {n} worth {x}"],
  qInvSub:["فاتورة بضريبة وتنبعت واتساب","Taxed invoice, sent on WhatsApp"], qRecSub:["زبون دفعلك","A customer paid you"],
});
const BOOK_COLS = ["parties","items","invoices","vouchers","cheques"];
BOOK_COLS.forEach(c=>{ if(!COLS.includes(c)) COLS.push(c); S[c] = S[c] || []; });

/* ----- numbers & helpers ----- */
const r2 = n => Math.round((n||0)*100)/100;
const INV_PFX = {sale:"S", purchase:"P", saleReturn:"SR", purchaseReturn:"PR", quote:"Q"};
const INV_T = {sale:"itSale", purchase:"itPurchase", saleReturn:"itSaleRet", purchaseReturn:"itPurRet", quote:"itQuote"};
const isSaleSide = tp => tp==="sale" || tp==="saleReturn" || tp==="quote";
const taxRate = () => ST().taxRate;
const partyById = id => S.parties.find(p=>p.id===id);
const invById = id => S.invoices.find(x=>x.id===id);
function nextNo(col, pfx){
  const all = (col==="invoices" ? S.invoices : S.vouchers).map(x=>String(x.no||"")).filter(n=>n.startsWith(pfx+"-")).map(n=>parseInt(n.slice(pfx.length+1))||0);
  return pfx+"-"+String((all.length?Math.max(...all):0)+1).padStart(4,"0");
}
/* one invoice's numbers: lines → net, tax; invoice discount spread over the lines before tax */
function invCalc(inv){
  const inc = !!inv.incTax, lines = (inv.lines||[]).filter(l=>num(l.qty)>0 && num(l.price)>=0 && String(l.name||"").trim());
  const rows = lines.map(l=>{ const g = num(l.qty)*num(l.price) - num(l.disc), rt = num(l.tax)/100; const net = inc ? g/(1+rt) : g; return {...l, gross:g, net, rt}; });
  const sumNet = sum(rows, x=>x.net), d = Math.min(Math.max(0, num(inv.discount)), sumNet), k = sumNet ? (sumNet-d)/sumNet : 1;
  rows.forEach(x=>{ x.netA = x.net*k; x.taxA = x.netA*x.rt; });
  const net = r2(sum(rows,x=>x.netA)), tax = r2(sum(rows,x=>x.taxA));
  return {rows, gross:r2(sumNet), discount:r2(d), net, tax, total:r2(net+tax)};
}
const invSign = tp => tp==="sale" ? 1 : tp==="saleReturn" ? -1 : tp==="purchase" ? -1 : tp==="purchaseReturn" ? 1 : 0;   // + means the party owes us more
const liveInv = () => S.invoices.filter(x=>x.type!=="quote" && !x.void);
const liveVouch = () => S.vouchers.filter(v=>!v.void);
function invPaid(inv){ return r2(sum(liveVouch().filter(v=>v.invoiceId===inv.id), v=>num(v.amount))); }
function invState(inv){
  if(inv.type==="quote") return "quote";
  const tot = invCalc(inv).total, p = invPaid(inv);
  if(tot<=0.005 || p>=tot-0.005) return "paid";
  if(inv.dueDate && inv.dueDate<today()) return "overdue";
  return p>0.005 ? "partial" : "unpaid";
}
const stPill = st => `<span class="pill ${st==="paid"?"good":st==="overdue"?"bad":st==="quote"?"":"warn"}">${t({paid:"stPaid",partial:"stPartial",unpaid:"stUnpaid",overdue:"stOverdue",quote:"stQuote"}[st])}</span>`;
/* party balance: + they owe us, − we owe them */
function partyLedger(pid, a, b){
  const p = partyById(pid); const rows = [];
  liveInv().filter(x=>x.partyId===pid).forEach(x=>rows.push({date:x.date, kind:"inv", ref:x, amt:invSign(x.type)*invCalc(x).total, txt:`${t(INV_T[x.type])} ${x.no||""}`}));
  liveVouch().filter(v=>v.partyId===pid).forEach(v=>rows.push({date:v.date, kind:"v", ref:v, amt:(v.type==="receipt"?-1:1)*num(v.amount), txt:`${t(v.type==="receipt"?"vReceipt":"vPayment")} ${v.no||""}${v.method==="cheque"?" · "+t("cheque"):""}`}));
  rows.sort((x,y)=>(x.date||"").localeCompare(y.date||"") || (x.ref.createdAt||0)-(y.ref.createdAt||0));
  let open = num(p && p.openBal); const before = a ? rows.filter(r=>r.date<a) : [];
  open += sum(before, r=>r.amt);
  const inr = rows.filter(r=>(!a || r.date>=a) && (!b || r.date<=b));
  let bal = open; inr.forEach(r=>{ bal += r.amt; r.bal = bal; });
  return {open:r2(open), rows:inr, bal:r2(bal)};
}
const partyBal = pid => partyLedger(pid).bal;
const balTxt = b => b>0.005 ? `<span class="due">${t("owesUs")} ${money(b)}</span>` : b<-0.005 ? `<span class="negv">${t("weOwe")} ${money(-b)}</span>` : `<span class="sub">${t("settledP")}</span>`;
const partyOptions = (side, cur) => S.parties.filter(p=>!p.archived && (p.kind==="both" || p.kind===(side==="sale"?"customer":"supplier") || p.id===cur)).sort((a,b)=>String(a.name).localeCompare(String(b.name))).map(p=>[p.id,p.name]);
const daysTo = d => Math.round((parseD(d)-parseD(today()))/864e5);

/* ----- totals hooks used by home / projects (invoices count as income & cost, before tax) ----- */
function invNetFor(f){ let inc = 0, exp = 0;
  liveInv().filter(f).forEach(x=>{ const n = invCalc(x).net; if(x.type==="sale") inc += n; else if(x.type==="saleReturn") inc -= n; else if(x.type==="purchase") exp += n; else if(x.type==="purchaseReturn") exp -= n; });
  return {inc, exp}; }

/* ===================== the money hub ===================== */
function viewBooks(){
  const tab = S.btab || "moves";
  const tabs = [["moves",t("bkMoves")],["radar",t("bkRadar")],["invoices",t("bkInv")],["parties",t("bkParties")],["stock",t("bkStock")],["cheques",t("bkCheques")],["gl",t("bkGl")],["reports",t("bkReports")]];
  const seg = `<div class="chiprow tabsx" role="tablist">${tabs.map(([k,l])=>`<button class="chipbtn" role="tab" data-act="btab" data-id="${k}" aria-pressed="${tab===k}" aria-selected="${tab===k}">${esc(l)}</button>`).join("")}</div>`;
  if(tab==="moves"){ const m = viewMoney(), i = m.indexOf('<div class="daybar">'); return i>0 ? m.slice(0,i)+seg+m.slice(i) : seg+m; }   // the old money page, with the tabs under its header
  const body = tab==="radar" ? viewRadar() : tab==="invoices" ? viewInvoices() : tab==="parties" ? viewParties() : tab==="cheques" ? viewCheques() : tab==="stock" ? viewStock() : tab==="gl" ? viewLedger() : viewReports();
  return pageHead(t("navMoney"), "", tab==="invoices" ? `<div class="hbtns"><button class="btn" data-act="pos">${icon("bag")}${t("pos")}</button><button class="btn" data-act="newInv" data-id="purchase">${icon("minus")}${t("newPurchase")}</button><button class="btn primary" data-act="newInv" data-id="sale">${icon("plus")}${t("newSale")}</button></div>`
    : tab==="parties" ? `<button class="btn primary" data-act="newParty">${icon("plus")}${t("pNew")}</button>` : "") + seg + body;
}

/* ----- invoices list ----- */
function viewInvoices(){
  const f = S.ifilter || "sale", q = (S.iq||"").trim().toLowerCase();
  const fl = x => f==="sale" ? x.type==="sale" : f==="purchase" ? x.type==="purchase" : f==="quote" ? x.type==="quote" : (x.type==="saleReturn"||x.type==="purchaseReturn");
  const list = S.invoices.filter(x=>!x.void && fl(x)).filter(x=>!q || [x.no, x.supInvNo, (partyById(x.partyId)||{}).name, String(invCalc(x).total)].some(v=>String(v||"").toLowerCase().includes(q))).sort(byDateDesc);
  let h = `<div class="seg four" role="group">${[["sale",t("itSales")],["purchase",t("itPurchases")],["quote",t("itQuotes")],["ret",t("itReturns")]].map(([k,l])=>`<button data-act="ifilter" data-id="${k}" aria-pressed="${f===k}">${l}</button>`).join("")}</div>`;
  if(f==="sale" || f==="purchase"){
    const open = S.invoices.filter(x=>!x.void && x.type===f), due = sum(open, x=>Math.max(0, invCalc(x).total-invPaid(x))), od = open.filter(x=>invState(x)==="overdue");
    h += `<div class="kpis three"><div class="kpi"><span class="label">${f==="sale"?t("rSales"):t("rPurch")} · ${t("thisMonth")}</span><b>${money(sum(open.filter(x=>x.date>=monthStartOf(today())),x=>invCalc(x).net))}</b></div>
      <div class="kpi"><span class="label">${f==="sale"?t("rRecv"):t("rPay")}</span><b class="due">${money(due)}</b></div>
      <div class="kpi ${od.length?"neg":""}"><span class="label">${t("stOverdue")}</span><b><span class="num">${od.length}</span></b></div></div>`;
  }
  h += `<div class="panel"><div class="searchrow"><input id="iq" type="search" placeholder="${esc(t("invSearch"))}" value="${esc(S.iq||"")}" autocomplete="off"><button class="btn sm" data-act="items">${icon("tag")}${t("items")}</button></div>`;
  if(!S.invoices.length) return h + `<div class="empty">${icon("file","big")}<b>${t("noInvoices")}</b><span>${t("noInvoicesSub")}</span><button class="btn primary" data-act="newInv" data-id="sale">${icon("plus")}${t("newSale")}</button></div></div>`;
  h += list.length ? `<div class="list">${list.map(invRow).join("")}</div>` : `<span class="hint">${t("noTx")}</span>`;
  return h + `<button class="btn ghost sm self-start" data-act="exportInv">${icon("wallet")}${t("exportInv")}</button></div>`;
}
function invRow(x){
  const c = invCalc(x), p = partyById(x.partyId), st = invState(x);
  return `<button class="row" data-act="viewInv" data-id="${esc(x.id)}"><span class="tx-ic ${isSaleSide(x.type)?"inc":"exp"}">${icon("file")}</span>
    <div class="m"><b>${esc(p?p.name:"—")}</b><span class="sub"><span class="num ltr">${esc(x.no||"")}</span> · ${fdate(x.date)}${x.type!=="sale"&&x.type!=="purchase"?" · "+esc(t(INV_T[x.type])):""}</span></div>
    <div class="col end"><b class="${x.type==="sale"?"pos":""}">${money(c.total)}</b>${stPill(st)}</div></button>`;
}

/* ----- invoice form ----- */
let INV = null;   // the invoice being edited: {id?, type, lines:[...]}
function invForm(x, preset={}){
  const type = x?.type || preset.type || "sale", side = isSaleSide(type) ? "sale" : "purchase";
  INV = {id:x?.id||null, type, lines:(x?.lines || preset.lines || [{name:"",qty:1,price:"",tax:taxRate(),disc:0}]).map(l=>({...l})), from:x||null, srcId:preset.srcId||null};
  const opts = partyOptions(side, x?.partyId||preset.partyId);
  const dueSel = x?.dueDate ? String(Math.max(0, Math.round((parseD(x.dueDate)-parseD(x.date))/864e5))) : (preset.dueDays!=null ? String(preset.dueDays) : "0");
  const dueOpts = [["0",t("dueCash")],["15",t("dueDays",{n:"15"})],["30",t("dueDays",{n:"30"})],["60",t("dueDays",{n:"60"})],["90",t("dueDays",{n:"90"})]];
  if(!dueOpts.some(o=>o[0]===dueSel)) dueOpts.push([dueSel, t("dueDays",{n:dueSel})]);
  openSheet({title: x ? `${t("editInv")} · ${x.no}` : t(INV_T[type]), saveLabel: x ? t("save") : t("record"),
    top:`<div class="field"><label for="f_partyId">${side==="sale"?t("invParty"):t("invSupplier")}</label><div class="inlinepick"><select id="f_partyId" name="partyId"><option value=""></option>${opts.map(([v,l])=>`<option value="${esc(v)}" ${v===(x?.partyId||preset.partyId)?"selected":""}>${esc(l)}</option>`).join("")}</select><button type="button" class="btn sm" data-act="quickParty" data-id="${side}">${icon("plus")}</button></div></div>
      <div class="field"><span class="flabel">${t("invLines")}</span><div id="invLines" class="invlines">${INV.lines.map(lineRow).join("")}</div><datalist id="itemsDl">${S.items.map(i=>`<option value="${esc(i.name)}"></option>`).join("")}</datalist>
      <button type="button" class="btn dashed sm" data-act="addLine">${icon("plus")}${t("addLine")}</button></div>
      <div class="preview invtot" id="invTot"></div>`,
    fields:[{name:"due",label:t("invDue"),type:"chips",options:dueOpts,value:dueSel},
      ...(x || type==="quote" ? [] : [{name:"paidNow",label:side==="sale"?t("paidNow"):t("paidNowP"),type:"money",value:preset.paidNow||"",hint:""},
        {name:"method",label:t("vMethod"),type:"chips",options:[["cash",t("cash")],["transfer",t("transfer")],["card",t("card")],["cheque",t("cheque")]],value:"cash"},
        {name:"chNo",label:t("chNo"),value:"",max:30},{name:"chDue",label:t("chDue"),type:"date",value:today()}])],
    more:[{name:"date",label:t("invDate"),type:"date",value:x?.date||today()},
      {name:"incTax",label:t("incTax"),type:"chips",options:[["0",LANG==="en"?"No":"لا"],["1",LANG==="en"?"Yes":"آه"]],value:(x ? x.incTax : (preset.incTax!=null?preset.incTax:ST().incTax)) ? "1":"0"},
      {name:"discount",label:t("invDiscount"),type:"money",value:x?.discount||""},
      ...(side==="purchase"?[{name:"supInvNo",label:t("supInvNo"),value:x?.supInvNo||"",max:40}]:[]),
      ...(storeList().length>1?[{name:"storeId",label:t("invStore"),type:"select",options:storeList().map(x=>[x.id,x.name]),value:x?.storeId||S.sstore||MAIN_STORE}]:[]),
      ...(activeUnits().length?[{name:"unitId",label:t("forUnitOpt"),type:"select",options:[["",""],...unitOptions(x?.unitId)],value:x?.unitId||preset.unitId||(S.view==="unit"?S.uid:"")}]:[]),
      ...(x || type==="quote" ? [] : [{name:"chBank",label:t("chBank"),value:"",max:40}]),
      {name:"notes",label:t("invNotes"),value:x?.notes||preset.notes||"",max:300}],
    del: x ? {label:t("del"), run:()=>delInvoice(x)} : null,
    submit: v=>saveInvoice(v)});
  invTotals(); chFieldsVis();
}
const taxOpts = cur => { const base = [taxRate(), 16, 10, 8, 4, 0].filter((v,i,a)=>a.indexOf(v)===i); if(!base.includes(num(cur))) base.push(num(cur)); return base; };
function lineRow(l, i){
  return `<div class="ln" data-i="${i}">
    <input class="ln-name" list="itemsDl" data-f="name" placeholder="${esc(t("lnItem"))}" value="${esc(l.name||"")}" maxlength="120" aria-label="${esc(t("lnItem"))}">
    <div class="ln-nums"><label><span>${t("lnQty")}</span><input data-f="qty" inputmode="decimal" value="${esc(l.qty??1)}"></label>
      <label><span>${t("lnPrice")}</span><input data-f="price" inputmode="decimal" value="${esc(l.price??"")}" placeholder="0"></label>
      <label><span>${t("lnTax")}</span><select data-f="tax">${taxOpts(l.tax).map(r=>`<option value="${r}" ${num(l.tax)===r?"selected":""}>${r?r+"%":t("taxExempt")}</option>`).join("")}</select></label>
      <button type="button" class="iconbtn sm" data-act="delLine" data-id="${i}" aria-label="${t("del")}">${icon("x")}</button></div></div>`;
}
function readLines(){
  const out = []; document.querySelectorAll("#invLines .ln").forEach(r=>{ const g = f => (r.querySelector(`[data-f="${f}"]`)||{}).value || "";
    out.push({name:g("name").trim().slice(0,120), qty:num(g("qty")), price:num(g("price")), tax:num(g("tax")), disc:0}); });
  return out;
}
function invTotals(){
  const el = document.getElementById("invTot"); if(!el || !INV) return;
  const inc = (document.querySelector('#sheetBody [name="incTax"]:checked')||{}).value==="1", disc = num((document.getElementById("f_discount")||{}).value);
  const c = invCalc({lines:readLines(), incTax:inc, discount:disc});
  el.innerHTML = `<div class="kv"><div><span>${t("subTotal")}</span><b>${money(c.gross)}</b></div>${c.discount?`<div><span>${t("discountL")}</span><b class="negv">− ${money(c.discount)}</b></div>`:""}<div><span>${t("taxTotal")}</span><b>${money(c.tax)}</b></div></div><div class="total"><span class="label">${t("grandTotal")}</span><b>${money(c.total)}</b></div>`;
  const pn = document.getElementById("f_paidNow_hint"); if(pn) pn.innerHTML = c.total ? `<button type="button" class="linkbtn" data-act="payAll" data-id="${c.total}">${t("payRest",{x:fmt(c.total)})}</button>` : "";
}
async function saveInvoice(v){
  if(!INV) return false;
  const pid = v.partyId; if(!partyById(pid)){ toast(t("eParty")); return false; }
  const lines = readLines().filter(l=>l.name && l.qty>0);
  if(!lines.length || !lines.some(l=>l.price>0)){ toast(t("eLines")); return false; }
  const type = INV.type, x = INV.from, date = validDate(v.date)?v.date:today(), dd = Math.max(0, parseInt(v.due)||0);
  const data = {...(x?strip(x):{createdAt:Date.now(), no:nextNo("invoices", INV_PFX[type])}), type, partyId:pid, date, dueDate: dd ? addDays(date, dd) : date,
    lines, storeId: storeList().some(x=>x.id===v.storeId) ? v.storeId : (x?.storeId||MAIN_STORE), incTax: v.incTax==="1", discount:num(v.discount), notes:(v.notes||"").slice(0,300), supInvNo:(v.supInvNo||"").slice(0,40), unitId: unitById(v.unitId) ? v.unitId : "", srcId: x?.srcId || INV.srcId || ""};
  data.total = invCalc(data).total;
  const id = x?.id || newId();
  if(!await save("invoices", id, data, true)) return false;
  // remember new items for next time
  for(const l of lines) if(l.price>0 && !S.items.some(i=>i.name.toLowerCase()===l.name.toLowerCase()) && S.items.length<2000)
    await save("items", null, {name:l.name, price:isSaleSide(type)?l.price:0, cost:isSaleSide(type)?0:l.price, tax:l.tax, unit:"", createdAt:Date.now()}, true);
  // link each line to its item (by name), so stock and cost follow the invoice
  const linked = lines.map(l=>{ const it = itemByName(l.name); return it ? {...l, itemId:it.id} : l; });
  if(linked.some((l,i)=>l.itemId!==lines[i].itemId)){ data.lines = linked; await save("invoices", id, data, true); }
  stockWarn(data);
  const paid = Math.min(num(v.paidNow), data.total);
  if(!x && paid>0 && type!=="quote") await saveVoucher({type: isSaleSide(type) ? (type==="saleReturn"?"payment":"receipt") : (type==="purchaseReturn"?"receipt":"payment"), partyId:pid, amount:paid, date, invoiceId:id,
    method:v.method, chNo:v.chNo, chBank:v.chBank, chDue:v.chDue, note:""}, true);
  INV = null; render(); toast(t("invSaved",{x:t(INV_T[type]), n:data.no}));
  setTimeout(()=>viewInvSheet(id), 50);
  return true;
}
async function delInvoice(x){
  for(const v of S.vouchers.filter(v=>v.invoiceId===x.id)){ const ch = S.cheques.find(c=>c.voucherId===v.id); if(ch) await remove("cheques", ch.id); await remove("vouchers", v.id); }
  return remove("invoices", x.id);
}

/* ----- invoice view ----- */
function viewInvSheet(id){
  const x = invById(id); if(!x) return;
  const c = invCalc(x), p = partyById(x.partyId), paid = invPaid(x), st = invState(x), vs = liveVouch().filter(v=>v.invoiceId===x.id);
  openSheet({title:`${t(INV_T[x.type])} ${x.no||""}`, noSave:true, html:`
    <div class="inv-head"><div class="col"><b>${esc(p?p.name:"")}</b><span class="sub">${fdate(x.date)}${x.dueDate&&x.dueDate!==x.date?` · ${t("dueOnL")}: ${fdate(x.dueDate)}`:""}</span></div>${stPill(st)}</div>
    <div class="list">${c.rows.map(l=>`<div class="row static"><div class="m"><b>${esc(l.name)}</b><span class="sub"><span class="num">${fmt(num(l.qty))}</span> × ${money(num(l.price))}${l.rt?` · ${t("lnTax")} <span class="num">${Math.round(l.rt*100)}%</span>`:""}</span></div><b>${money(l.netA+l.taxA)}</b></div>`).join("")}</div>
    <div class="kv"><div><span>${t("subTotal")}</span><b>${money(c.gross)}</b></div>${c.discount?`<div><span>${t("discountL")}</span><b>− ${money(c.discount)}</b></div>`:""}<div><span>${t("taxTotal")}</span><b>${money(c.tax)}</b></div></div>
    <div class="total"><span class="label">${t("grandTotal")}</span><b>${money(c.total)}</b></div>
    ${x.type!=="quote"?`<div class="kv"><div><span>${t("paidL")}</span><b class="pos">${money(paid)}</b></div><div><span>${t("remainingL")}</span><b class="${c.total-paid>0.005?"due":""}">${money(Math.max(0,c.total-paid))}</b></div></div>
      ${vs.length?`<div class="list">${vs.map(v=>`<button type="button" class="row" data-act="editVoucher" data-id="${esc(v.id)}"><div class="m"><b>${t(v.type==="receipt"?"vReceipt":"vPayment")} <span class="num ltr">${esc(v.no||"")}</span></b><span class="sub">${fdate(v.date)} · ${esc(t(v.method||"cash"))}</span></div><b>${money(num(v.amount))}</b></button>`).join("")}</div>`:""}`:""}
    ${x.notes?`<span class="hint">${esc(x.notes)}</span>`:""}
    <div class="grid2">
      ${x.type!=="quote" && c.total-paid>0.005 ? `<button type="button" class="btn primary" data-act="payInv" data-id="${esc(x.id)}">${icon("wallet")}${t("recordPay")}</button>`:""}
      ${x.type==="quote" ? `<button type="button" class="btn primary" data-act="quoteToInv" data-id="${esc(x.id)}">${icon("check")}${t("toInvoice")}</button>`:""}
      <button type="button" class="btn" data-act="printInv" data-id="${esc(x.id)}">${icon("file")}${t("printInv")}</button>
      <button type="button" class="btn" data-act="shareInv" data-id="${esc(x.id)}">${icon("send")}${t("shareInv")}</button>
      <button type="button" class="btn" data-act="editInv" data-id="${esc(x.id)}">${icon("gear")}${t("editInv")}</button>
      ${x.type==="sale"||x.type==="purchase"?`<button type="button" class="btn ghost" data-act="retInv" data-id="${esc(x.id)}">${t("makeReturn")}</button>`:""}
      <button type="button" class="btn ghost" data-act="dupInv" data-id="${esc(x.id)}">${t("dupInv")}</button>
    </div>`});
}
function invDocHtml(x){
  const c = invCalc(x), p = partyById(x.partyId) || {}, s = ST(), paid = invPaid(x);
  return `<div class="doc">
    <div class="doc-head"><div><h1>${esc(COMPANY.name||"")}</h1>${s.address?`<div>${esc(s.address)}</div>`:""}${COMPANY.phone?`<div class="ltr">${esc(COMPANY.phone)}</div>`:""}${s.taxNo?`<div>${t("taxNoL")}: <span class="ltr">${esc(s.taxNo)}</span></div>`:""}</div>
      <div class="doc-t"><h2>${esc(t(INV_T[x.type]))}${s.taxNo&&x.type==="sale"?(LANG==="en"?" (Tax invoice)":" ضريبية"):""}</h2><div>${t("invNoS")}: <b class="ltr">${esc(x.no||"")}</b></div><div>${t("date")}: ${esc(x.date)}</div>${x.dueDate&&x.dueDate!==x.date?`<div>${t("dueOnL")}: ${esc(x.dueDate)}</div>`:""}${x.supInvNo?`<div>${t("supInvNo")}: ${esc(x.supInvNo)}</div>`:""}</div></div>
    <div class="doc-to"><span>${t("billTo")}:</span> <b>${esc(p.name||"")}</b>${p.taxNo?` · ${t("taxNoL")}: <span class="ltr">${esc(p.taxNo)}</span>`:""}${p.phone?` · <span class="ltr">${esc(p.phone)}</span>`:""}${p.address?` · ${esc(p.address)}`:""}</div>
    <table class="doc-tb"><thead><tr><th>#</th><th>${t("lnItem")}</th><th>${t("lnQty")}</th><th>${t("lnPrice")}</th><th>${t("lnTax")}</th><th>${t("grandTotal")}</th></tr></thead>
      <tbody>${c.rows.map((l,i)=>`<tr><td>${i+1}</td><td>${esc(l.name)}</td><td>${fmt(num(l.qty))}</td><td>${fmt(num(l.price))}</td><td>${l.rt?Math.round(l.rt*100)+"%":"—"}</td><td>${fmt(l.netA+l.taxA)}</td></tr>`).join("")}</tbody></table>
    <table class="doc-sum"><tr><td>${t("subTotal")}</td><td>${moneyTxt(c.gross)}</td></tr>${c.discount?`<tr><td>${t("discountL")}</td><td>− ${moneyTxt(c.discount)}</td></tr>`:""}<tr><td>${t("taxTotal")}</td><td>${moneyTxt(c.tax)}</td></tr>
      <tr class="g"><td>${t("grandTotal")}</td><td>${moneyTxt(c.total)}</td></tr>${x.type!=="quote"&&paid>0.005?`<tr><td>${t("paidL")}</td><td>${moneyTxt(paid)}</td></tr><tr><td>${t("remainingL")}</td><td>${moneyTxt(Math.max(0,c.total-paid))}</td></tr>`:""}</table>
    ${x.notes?`<p class="doc-note">${esc(x.notes)}</p>`:""}
    <div class="doc-foot">${esc(s.invFoot||t("thanksInv"))}<br><small>${t("madeWith")} · daftarapp.co</small></div></div>`;
}
function printDoc(html){
  let el = document.getElementById("printDoc"); if(!el){ el = document.createElement("div"); el.id = "printDoc"; document.body.appendChild(el); }
  el.innerHTML = html; document.body.classList.add("printing-doc");
  const done = () => { document.body.classList.remove("printing-doc"); window.removeEventListener("afterprint", done); };
  window.addEventListener("afterprint", done); setTimeout(()=>window.print(), 60); setTimeout(done, 60000);
}
function invWaText(x){
  const c = invCalc(x), paid = invPaid(x);
  const lines = c.rows.map(l=>`• ${l.name} × ${fmt(num(l.qty))} = ${moneyTxt(l.netA+l.taxA)}`).join("\n");
  const left = x.type!=="quote" && paid>0.005 ? t("waLeft",{p:moneyTxt(paid), r:moneyTxt(Math.max(0,c.total-paid))}) : "";
  return t("waInv",{type:t(INV_T[x.type]), n:x.no||"", co:COMPANY.name||"", d:x.date, lines, t:moneyTxt(c.total)+(c.tax?` (${t("taxTotal")} ${moneyTxt(c.tax)})`:""), paid:left, foot:(ST().invFoot||t("thanksInv"))+"\n"+t("madeWith")+" · daftarapp.co"});
}

/* ----- parties ----- */
function viewParties(){
  const f = S.pfilter || "customer", q = (S.pq||"").trim().toLowerCase();
  const list = S.parties.filter(p=>!p.archived && (p.kind==="both" || p.kind===f)).map(p=>[p, partyBal(p.id)])
    .filter(([p])=>!q || [p.name,p.phone,p.taxNo].some(v=>String(v||"").toLowerCase().includes(q))).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1]) || String(a[0].name).localeCompare(String(b[0].name)));
  const recv = sum(S.parties, p=>Math.max(0, partyBal(p.id))), pay = sum(S.parties, p=>Math.max(0, -partyBal(p.id)));
  let h = `<div class="kpis two-k"><div class="kpi"><span class="label">${t("rRecv")}</span><b class="due">${money(recv)}</b></div><div class="kpi"><span class="label">${t("rPay")}</span><b class="negv">${money(pay)}</b></div></div>`;
  h += `<div class="seg two-seg" role="group"><button data-act="pfilter" data-id="customer" aria-pressed="${f==="customer"}">${t("pCustomers")}</button><button data-act="pfilter" data-id="supplier" aria-pressed="${f==="supplier"}">${t("pSuppliers")}</button></div>`;
  if(!S.parties.length) return h + `<div class="panel empty">${icon("users","big")}<b>${t("noParties")}</b><span>${t("noPartiesSub")}</span><button class="btn primary" data-act="newParty">${icon("plus")}${t("pNew")}</button></div>`;
  return h + `<div class="panel"><div class="searchrow"><input id="pq" type="search" placeholder="${esc(t("qSearchName"))}" value="${esc(S.pq||"")}" autocomplete="off"></div>
    ${list.length?`<div class="list">${list.map(([p,b])=>`<button class="row" data-act="viewParty" data-id="${esc(p.id)}"><span class="avatar">${esc(initials(p.name))}</span><div class="m"><b>${esc(p.name)}</b><span class="sub">${[p.phone?`<span class="ltr">${esc(p.phone)}</span>`:"", num(p.limit)&&b>num(p.limit)?`<span class="negv">${t("overLimit",{x:fmt(num(p.limit))})}</span>`:""].filter(Boolean).join(" · ")||"&nbsp;"}</span></div><div class="col end">${balTxt(b)}</div></button>`).join("")}</div>`:`<span class="hint">${t("noTx")}</span>`}</div>`;
}
function partyForm(p, preset={}, after){
  openSheet({title: p ? `${t("edit")} · ${p.name}` : t("pNew"), saveLabel: p?t("save"):t("add"),
    fields:[{name:"name",label:t("pName"),value:p?.name||preset.name||"",max:100},
      {name:"kind",label:t("pKind"),type:"chips",options:[["customer",t("pCustomer")],["supplier",t("pSupplier")],["both",t("pBoth")]],value:p?.kind||preset.kind||"customer"},
      {name:"phone",label:t("pPhone"),type:"tel",value:p?.phone||"",max:30}],
    more:[{name:"taxNo",label:t("pTaxNo"),value:p?.taxNo||"",max:30},{name:"address",label:t("pAddr"),value:p?.address||"",max:120},
      {name:"openBal",label:t("pOpen"),type:"money",value:p?.openBal||"",hint:t("pOpenHint")},{name:"limit",label:t("pLimit"),type:"money",value:p?.limit||""}],
    del: p ? {label:t("del"), run:async()=>{ const used = S.invoices.some(x=>x.partyId===p.id) || S.vouchers.some(x=>x.partyId===p.id);
      if(used){ const ok = await save("parties", p.id, {...strip(p), archived:true}); if(ok){ S.btab="parties"; render(); } return ok; } return remove("parties", p.id); }} : null,
    submit: async v=>{
      if(!v.name){ toast(t("ePartyName")); return false; }
      const raw = toEn(v.openBal||"").trim(), ob = /^-/.test(raw) ? -num(raw.replace(/^-/,"")) : num(raw);
      const data = {...(p?strip(p):{createdAt:Date.now()}), name:v.name.slice(0,100), kind:["customer","supplier","both"].includes(v.kind)?v.kind:"customer", phone:(v.phone||"").slice(0,30),
        taxNo:(v.taxNo||"").slice(0,30), address:(v.address||"").slice(0,120), openBal:ob, limit:num(v.limit)};
      const id = p?.id || newId();
      const ok = await save("parties", id, data, !!after); if(ok && after) after(id); return ok;
    }});
}
function viewPartySheet(id){
  const p = partyById(id); if(!p) return;
  const a = S.stFrom || "", L0 = partyLedger(id, a || null, null);
  const cust = p.kind!=="supplier";
  openSheet({title:p.name, noSave:true, html:`
    <div class="owe">${MARK}<span class="label">${L0.bal>=0?t("owesUs"):t("weOwe")}</span><b>${money(Math.abs(L0.bal))}</b><span class="sub">${p.phone?`<span class="ltr">${esc(p.phone)}</span>`:""}${p.taxNo?` · ${t("taxNoL")} ${esc(p.taxNo)}`:""}</span></div>
    <div class="grid2">
      ${cust?`<button type="button" class="btn primary" data-act="newInv" data-id="sale" data-p="${esc(id)}">${icon("file")}${t("newSale")}</button><button type="button" class="btn" data-act="newVoucher" data-id="receipt" data-p="${esc(id)}">${icon("plus")}${t("vNewR")}</button>`:""}
      ${p.kind!=="customer"?`<button type="button" class="btn ${cust?"":"primary"}" data-act="newInv" data-id="purchase" data-p="${esc(id)}">${icon("file")}${t("newPurchase")}</button><button type="button" class="btn" data-act="newVoucher" data-id="payment" data-p="${esc(id)}">${icon("minus")}${t("vNewP")}</button>`:""}
    </div>
    <div class="seg two-seg" role="group"><button type="button" data-act="stRange" data-id="${esc(id)}" data-r="all" aria-pressed="${!a}">${t("stAll")}</button><button type="button" data-act="stRange" data-id="${esc(id)}" data-r="month" aria-pressed="${!!a}">${t("thisMonth")}</button></div>
    <span class="label">${t("statement")}</span>
    <div class="list">${a||L0.open?`<div class="row static"><div class="m"><b>${t("stOpen")}</b></div><b>${money(L0.open)}</b></div>`:""}
      ${L0.rows.slice().reverse().map(r=>`<button type="button" class="row" data-act="${r.kind==="inv"?"viewInv":"editVoucher"}" data-id="${esc(r.ref.id)}"><div class="m"><b>${esc(r.txt)}</b><span class="sub">${fdate(r.date)} · ${t("stBal")} ${money(r.bal)}</span></div><b class="${r.amt>0?"due":"pos"}">${r.amt>0?"+":"−"} ${money(Math.abs(r.amt))}</b></button>`).join("") || `<span class="hint">${t("noTx")}</span>`}</div>
    <div class="grid2"><button type="button" class="btn" data-act="shareSt" data-id="${esc(id)}">${icon("send")}${t("stShare")}</button><button type="button" class="btn" data-act="printSt" data-id="${esc(id)}">${icon("file")}${t("stPrint")}</button>
      <button type="button" class="btn ghost" data-act="editParty" data-id="${esc(id)}">${icon("gear")}${t("edit")}</button></div>`});
}
function stDocHtml(id){
  const p = partyById(id), a = S.stFrom || null, L0 = partyLedger(id, a, null);
  return `<div class="doc"><div class="doc-head"><div><h1>${esc(COMPANY.name||"")}</h1>${ST().taxNo?`<div>${t("taxNoL")}: ${esc(ST().taxNo)}</div>`:""}</div><div class="doc-t"><h2>${t("statement")}</h2><div>${esc(p.name)}</div><div>${esc(today())}</div></div></div>
    <table class="doc-tb"><thead><tr><th>${t("date")}</th><th>${t("note")}</th><th>${t("stDebit")}</th><th>${t("stCredit")}</th><th>${t("stBal")}</th></tr></thead><tbody>
    <tr><td></td><td>${t("stOpen")}</td><td></td><td></td><td>${fmt(L0.open)}</td></tr>
    ${L0.rows.map(r=>`<tr><td>${esc(r.date)}</td><td>${esc(r.txt)}</td><td>${r.amt>0?fmt(r.amt):""}</td><td>${r.amt<0?fmt(-r.amt):""}</td><td>${fmt(r.bal)}</td></tr>`).join("")}</tbody></table>
    <table class="doc-sum"><tr class="g"><td>${L0.bal>=0?t("owesUs"):t("weOwe")}</td><td>${moneyTxt(Math.abs(L0.bal))}</td></tr></table><div class="doc-foot"><small>${t("madeWith")} · daftarapp.co</small></div></div>`;
}
function stWaText(id){
  const p = partyById(id), L0 = partyLedger(id, S.stFrom||null, null);
  const last = L0.rows.slice(-12).map(r=>`${r.date}  ${r.txt}  ${r.amt>0?"+":"−"}${fmt(Math.abs(r.amt))}`).join("\n");
  return `${t("statement")} · ${p.name}\n${COMPANY.name||""}\n\n${last}\n\n${L0.bal>=0?t("owesUs"):t("weOwe")}: ${moneyTxt(Math.abs(L0.bal))}\n\n${t("madeWith")} · daftarapp.co`;
}
function openWaText(phone, text){
  const ph = typeof waPhone==="function" ? waPhone(phone||"") : "";
  const url = (ph ? `https://wa.me/${ph}?text=` : "https://wa.me/?text=") + encodeURIComponent(text);
  const a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener"; a.click();
}

/* ----- vouchers (receipts / payments) ----- */
async function saveVoucher(d, quiet){
  const type = d.type==="payment" ? "payment" : "receipt", id = d.id || newId(), x = d.id ? S.vouchers.find(v=>v.id===d.id) : null;
  const method = ["cash","transfer","card","cheque"].includes(d.method) ? d.method : "cash";
  const data = {...(x?strip(x):{createdAt:Date.now(), no:nextNo("vouchers", type==="receipt"?"RV":"PV")}), type, partyId:d.partyId, amount:r2(num(d.amount)), date:validDate(d.date)?d.date:today(),
    method, invoiceId: invById(d.invoiceId) ? d.invoiceId : "", note:(d.note||"").slice(0,200)};
  if(!await save("vouchers", id, data, true)) return false;
  const ch = S.cheques.find(c=>c.voucherId===id);
  if(method==="cheque"){
    const cd = {...(ch?strip(ch):{createdAt:Date.now(), status:"pending"}), dir:type==="receipt"?"in":"out", no:String(d.chNo||ch?.no||"").slice(0,30), bank:String(d.chBank||ch?.bank||"").slice(0,40),
      dueDate:validDate(d.chDue)?d.chDue:(ch?.dueDate||data.date), amount:data.amount, partyId:data.partyId, voucherId:id};
    await save("cheques", ch?.id || null, cd, true);
  } else if(ch) await remove("cheques", ch.id);
  if(!quiet){ render(); toast(t("vSaved",{x:t(type==="receipt"?"vReceipt":"vPayment"), a:moneyTxt(data.amount)})); }
  return true;
}
function voucherForm(x, preset={}){
  const type = x?.type || preset.type || "receipt", side = type==="receipt" ? "sale" : "purchase";
  const pid = x?.partyId || preset.partyId || "";
  const opts = partyOptions(side, pid), ch = x ? S.cheques.find(c=>c.voucherId===x.id) : null;
  const openInv = pid ? S.invoices.filter(i=>!i.void && i.partyId===pid && i.type===(type==="receipt"?"sale":"purchase") && (invCalc(i).total-invPaid(i)>0.005 || i.id===x?.invoiceId)) : [];
  openSheet({title: x ? `${t(type==="receipt"?"vReceipt":"vPayment")} ${x.no||""}` : t(type==="receipt"?"vNewR":"vNewP"), saveLabel: x?t("save"):t("record"),
    top:`<div class="field"><label for="f_partyId">${side==="sale"?t("invParty"):t("invSupplier")}</label><div class="inlinepick"><select id="f_partyId" name="partyId" data-vtype="${type}"><option value=""></option>${opts.map(([v,l])=>`<option value="${esc(v)}" ${v===pid?"selected":""}>${esc(l)}</option>`).join("")}</select><button type="button" class="btn sm" data-act="quickParty" data-id="${side}">${icon("plus")}</button></div>
      ${pid?`<span class="hint">${balTxt(partyBal(pid))}</span>`:""}</div>`,
    fields:[{name:"amount",label:t("vAmount"),type:"money",big:true,value:x?.amount ?? preset.amount ?? ""},
      {name:"method",label:t("vMethod"),type:"chips",options:[["cash",t("cash")],["transfer",t("transfer")],["card",t("card")],["cheque",t("cheque")]],value:x?.method||"cash"},
      ...(openInv.length?[{name:"invoiceId",label:t("vForInv"),type:"select",options:[["",t("vNoInv")],...openInv.map(i=>[i.id,`${i.no} · ${fmt(invCalc(i).total-invPaid(i)+(i.id===x?.invoiceId?num(x.amount):0))}`])],value:x?.invoiceId||preset.invoiceId||""}]:[]),
      {name:"chNo",label:t("chNo"),value:ch?.no||"",max:30},{name:"chDue",label:t("chDue"),type:"date",value:ch?.dueDate||today()}],
    more:[{name:"date",label:t("date"),type:"date",value:x?.date||today()},{name:"chBank",label:t("chBank"),value:ch?.bank||"",max:40},{name:"note",label:t("note"),value:x?.note||"",max:200}],
    del: x ? {label:t("del"), run:async()=>{ if(ch) await remove("cheques", ch.id); return remove("vouchers", x.id); }} : null,
    submit: async v=>{
      if(!partyById(v.partyId)){ toast(t("eParty")); return false; }
      if(num(v.amount)<=0){ toast(t("eAmount")); return false; }
      return saveVoucher({...v, type, id:x?.id});
    }});
  chFieldsVis();
}
function chFieldsVis(){
  const m = (document.querySelector('#sheetBody [name="method"]:checked')||{}).value, on = m==="cheque";
  ["chNo","chDue","chBank"].forEach(n=>{ const el = document.getElementById("f_"+n); if(!el) return; const f = el.closest(".field"); if(f && !f.closest(".morebox")) f.hidden = !on; });
}

/* ----- cheques ----- */
const CH_ST = {pending:"chPending", deposited:"chDeposited", cleared:"chCleared", bounced:"chBounced", handed:"chHanded"};
function viewCheques(){
  const dir = S.cdir || "in";
  const list = S.cheques.filter(c=>c.dir===dir).sort((a,b)=>{ const oa = a.status==="cleared"||a.status==="bounced", ob = b.status==="cleared"||b.status==="bounced"; return oa-ob || (a.dueDate||"").localeCompare(b.dueDate||""); });
  const open = list.filter(c=>c.status==="pending"||c.status==="deposited"||c.status==="handed");
  let h = `<div class="seg two-seg" role="group"><button data-act="cdir" data-id="in" aria-pressed="${dir==="in"}">${t("chIn")}</button><button data-act="cdir" data-id="out" aria-pressed="${dir==="out"}">${t("chOut")}</button></div>`;
  h += `<div class="kpis two-k"><div class="kpi"><span class="label">${t("chPending")}</span><b>${money(sum(open,c=>num(c.amount)))}</b></div><div class="kpi"><span class="label">${t("chWeek")}</span><b>${money(sum(open.filter(c=>daysTo(c.dueDate)<=7),c=>num(c.amount)))}</b></div></div>`;
  h += `<div class="two"><button class="btn" data-act="newVoucher" data-id="${dir==="in"?"receipt":"payment"}" data-cheque="1">${icon("plus")}${dir==="in"?t("vNewR"):t("vNewP")}</button></div>`;
  if(!list.length) return h + `<div class="panel empty">${icon("bank","big")}<span>${t("noCheques")}</span></div>`;
  return h + `<div class="panel"><div class="list">${list.map(c=>{ const p = partyById(c.partyId), dt = daysTo(c.dueDate), done = c.status==="cleared"||c.status==="bounced";
    const when = done ? "" : dt<0 ? `<span class="negv">${t("chOverdue")}</span>` : dt===0 ? `<span class="due">${t("chToday")}</span>` : dt<=7 ? `<span class="due">${t("chInDays",{n:`<span class="num">${dt}</span>`})}</span>` : "";
    return `<button class="row" data-act="viewCheque" data-id="${esc(c.id)}"><span class="tx-ic ${c.dir==="in"?"inc":"exp"}">${icon("bank")}</span><div class="m"><b>${esc(p?p.name:"")}</b><span class="sub">${c.no?`<span class="num ltr">#${esc(c.no)}</span> · `:""}${c.bank?esc(c.bank)+" · ":""}${fdate(c.dueDate)}${when?" · "+when:""}</span></div><div class="col end"><b>${money(num(c.amount))}</b><span class="pill ${c.status==="cleared"?"good":c.status==="bounced"?"bad":"warn"}">${t(CH_ST[c.status]||"chPending")}</span></div></button>`; }).join("")}</div></div>`;
}
function chequeSheet(id){
  const c = S.cheques.find(x=>x.id===id); if(!c) return; const p = partyById(c.partyId);
  const acts = c.dir==="in" ? [["deposited","chMarkDep"],["cleared","chMarkClr"],["bounced","chMarkBnc"],["pending","chPending"]] : [["handed","chHanded"],["cleared","chMarkClr"],["bounced","chMarkBnc"],["pending","chPending"]];
  openSheet({title:`${t("cheque")} ${c.no?"#"+c.no:""}`, noSave:true, html:`<div class="kv"><div><span>${c.dir==="in"?t("invParty"):t("invSupplier")}</span><b>${esc(p?p.name:"")}</b></div><div><span>${t("vAmount")}</span><b>${money(num(c.amount))}</b></div><div><span>${t("chDue")}</span><b>${fdate(c.dueDate)}</b></div>${c.bank?`<div><span>${t("chBank")}</span><b>${esc(c.bank)}</b></div>`:""}<div><span>${t("status")}</span><b>${t(CH_ST[c.status]||"chPending")}</b></div></div>
    <div class="grid2">${acts.filter(a=>a[0]!==c.status).map(([s,l])=>`<button type="button" class="btn ${s==="bounced"?"danger":s==="cleared"?"primary":""}" data-act="chSet" data-id="${esc(c.id)}" data-s="${s}">${t(l)}</button>`).join("")}
    ${c.voucherId?`<button type="button" class="btn ghost" data-act="editVoucher" data-id="${esc(c.voucherId)}">${icon("gear")}${t("edit")}</button>`:""}</div>`});
}
async function chSet(id, st){
  const c = S.cheques.find(x=>x.id===id); if(!c) return;
  if(!await save("cheques", c.id, {...strip(c), status:st, statusAt:today()}, true)) return;
  const v = S.vouchers.find(x=>x.id===c.voucherId);
  if(v){ const wantVoid = st==="bounced"; if(!!v.void!==wantVoid) await save("vouchers", v.id, {...strip(v), void:wantVoid}, true); }
  closeSheet(); render(); if(st==="bounced") toast(t("chBouncedToast",{x:(partyById(c.partyId)||{}).name||""}));
}

/* ----- items ----- */
function itemsSheet(){
  const list = S.items.slice().sort((a,b)=>String(a.name).localeCompare(String(b.name)));
  openSheet({title:t("items"), noSave:true, html:`<button type="button" class="btn primary" data-act="newItem">${icon("plus")}${t("itemNew")}</button>
    ${list.length?`<div class="list">${list.map(i=>`<button type="button" class="row" data-act="editItem" data-id="${esc(i.id)}"><div class="m"><b>${esc(i.name)}</b><span class="sub">${i.sku?esc(i.sku)+" · ":""}${i.unit?esc(i.unit)+" · ":""}${t("lnTax")} <span class="num">${num(i.tax??taxRate())}%</span></span></div><div class="col end"><b>${money(num(i.price))}</b>${num(i.cost)?`<span class="sub">${t("itemCost")} ${fmt(num(i.cost))}</span>`:""}</div></button>`).join("")}</div>`:`<span class="hint">${t("noItems")}</span>`}`});
}
function itemForm(i){
  openSheet({title: i ? i.name : t("itemNew"), saveLabel: i?t("save"):t("add"),
    fields:[{name:"name",label:t("itemName"),value:i?.name||"",max:120},{name:"price",label:t("itemPrice"),type:"money",value:i?.price||""},{name:"cost",label:t("itemCost"),type:"money",value:i?.cost||""},
      {name:"tax",label:t("lnTax"),type:"chips",options:taxOpts(i?.tax??taxRate()).map(r=>[String(r), r?r+"%":t("taxExempt")]),value:String(num(i?.tax??taxRate()))}],
    more:[{name:"service",label:t("isService"),type:"chips",options:[["0",t("kProduct")],["1",t("kService")]],value:i?.service?"1":"0"},
      {name:"openQty",label:t("openQty"),type:"money",value:i?.openQty||""},{name:"minQty",label:t("minQty"),type:"money",value:i?.minQty||""},
      {name:"unit",label:t("itemUnit"),value:i?.unit||"",max:20,ph:t("itemUnitPh")},{name:"sku",label:t("itemSku"),value:i?.sku||"",max:40}],
    del: i ? {label:t("del"), run:async()=>{ const ok = await remove("items", i.id); if(ok) setTimeout(itemsSheet, 30); return ok; }} : null,
    submit: async v=>{ if(!v.name){ toast(t("ePartyName")); return false; }
      const ok = await save("items", i?.id, {...(i?strip(i):{createdAt:Date.now()}), name:v.name.slice(0,120), price:num(v.price), cost:num(v.cost), tax:num(v.tax), unit:(v.unit||"").slice(0,20), sku:(v.sku||"").slice(0,40),
        service:v.service==="1", openQty:num(v.openQty), minQty:num(v.minQty), openDate:i?.openDate||today()}, true);
      if(ok && S.btab!=="stock") setTimeout(itemsSheet, 30); return ok; }});
}

/* ----- reports ----- */
function viewReports(){
  const per = S.rper || "month"; if(!S.rstart) S.rstart = monthStartOf(today());
  let a, b;
  if(per==="month"){ a = S.rstart; b = monthEnd(a); }
  else if(per==="bi"){ const d = parseD(S.rstart), m0 = d.getMonth() - d.getMonth()%2; a = iso(new Date(d.getFullYear(), m0, 1)); b = monthEnd(addMonths(a,1)); }
  else { const y = parseD(S.rstart).getFullYear(); a = `${y}-01-01`; b = `${y}-12-31`; }
  const inP = x => inRange(x.date,a,b), invs = liveInv().filter(inP);
  const tot = tp => invs.filter(x=>x.type===tp).reduce((o,x)=>{ const c = invCalc(x); o.net += c.net; o.tax += c.tax; return o; }, {net:0,tax:0});
  const s = tot("sale"), sr = tot("saleReturn"), pu = tot("purchase"), pr = tot("purchaseReturn");
  const sales = s.net - sr.net, purch = pu.net - pr.net, tOut = s.tax - sr.tax, tIn = pu.tax - pr.tax, tDue = tOut - tIn;
  const prev = LANG==="en" ? "chevE" : "chevS", next = LANG==="en" ? "chevS" : "chevE";
  const label = per==="year" ? `<span class="num">${parseD(a).getFullYear()}</span>` : per==="bi" ? `${MONTHS[LANG][parseD(a).getMonth()]} – ${monthName(b)}` : monthName(a);
  let h = `<div class="seg three-seg" role="group">${[["month",t("rMonth")],["bi",t("rQuarter")],["year",t("rYear")]].map(([k,l])=>`<button data-act="rper" data-id="${k}" aria-pressed="${per===k}">${l}</button>`).join("")}</div>
    <div class="daybar"><button class="iconbtn" data-act="rnav" data-id="-1">${icon(prev)}</button><div class="d"><b>${label}</b></div><button class="iconbtn" data-act="rnav" data-id="1">${icon(next)}</button></div>`;
  h += `<div class="kpis"><div class="kpi"><span class="label">${t("rSales")}</span><b class="pos">${money(sales)}</b></div><div class="kpi"><span class="label">${t("rPurch")}</span><b>${money(purch)}</b></div>
    <div class="kpi hero ${sales-purch<0?"neg":""}"><span class="label">${t("rGross")}</span><b>${money(Math.abs(sales-purch))}</b></div></div>`;
  h += `<div class="panel"><span class="label">${t("taxTotal")} · ${label}</span><div class="kv"><div><span>${t("rTaxOut")}</span><b>${money(tOut)}</b></div><div><span>${t("rTaxIn")}</span><b>− ${money(tIn)}</b></div></div>
    <div class="total"><span class="label">${tDue>=0?t("rTaxDue"):t("rTaxRefund")}</span><b class="${tDue>=0?"due":"pos"}">${money(Math.abs(tDue))}</b></div><span class="hint">${t("rTaxNote")}</span></div>`;
  // aging of what customers owe, from open sales invoices (by due date)
  const ag = [0,0,0,0,0]; S.invoices.filter(x=>!x.void && x.type==="sale").forEach(x=>{ const left = invCalc(x).total-invPaid(x); if(left<=0.005) return; const d = -daysTo(x.dueDate||x.date);
    ag[d<=0?0:d<=30?1:d<=60?2:d<=90?3:4] += left; });
  const agL = ["rAge0","rAge30","rAge60","rAge90","rAge90p"], agT = sum(ag);
  h += `<div class="panel"><span class="label">${t("rAging")}</span>${agT>0.005?agL.map((k,i)=>`<div class="cat"><span>${t(k)}</span><b class="${i>=3&&ag[i]?"negv":""}">${money(ag[i])}</b><div class="bar"><span style="width:${ag[i]/agT*100}%"></span></div></div>`).join(""):`<span class="hint">${t("allGood")}</span>`}</div>`;
  const byC = {}; invs.filter(x=>x.type==="sale").forEach(x=>{ byC[x.partyId] = (byC[x.partyId]||0) + invCalc(x).net; });
  const top = Object.entries(byC).sort((x,y)=>y[1]-x[1]).slice(0,6), mx = top.length ? top[0][1] : 1;
  if(top.length) h += `<div class="panel"><span class="label">${t("rTop")}</span>${top.map(([pid,v])=>`<div class="cat"><span>${esc((partyById(pid)||{}).name||"")}</span><b>${money(v)}</b><div class="bar"><span style="width:${v/mx*100}%"></span></div></div>`).join("")}</div>`;
  return h + `<button class="btn ghost" data-act="exportInv">${icon("wallet")}${t("exportInv")}</button>`;
}
function exportInvoices(){
  const rows = [[t("invNoS"),t("date"),LANG==="en"?"Type":"النوع",t("pName"),t("pTaxNo"),t("subTotal"),t("taxTotal"),t("grandTotal"),t("paidL"),t("remainingL"),LANG==="en"?"Status":"الحالة"]];
  S.invoices.filter(x=>!x.void).sort((a,b)=>(a.date||"").localeCompare(b.date||"")).forEach(x=>{ const c = invCalc(x), p = partyById(x.partyId)||{}, pd = invPaid(x);
    rows.push([x.no, x.date, t(INV_T[x.type]), p.name||"", p.taxNo||"", c.net, c.tax, c.total, x.type==="quote"?"":pd, x.type==="quote"?"":r2(c.total-pd), t({paid:"stPaid",partial:"stPartial",unpaid:"stUnpaid",overdue:"stOverdue",quote:"stQuote"}[invState(x)])]); });
  const csv = "﻿" + rows.map(r=>r.map(v=>{ const s = String(v??""); return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s; }).join(",")).join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"})); a.download = `daftar-invoices-${today()}.csv`; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
}

/* ----- home alerts for the books ----- */
function bookAlerts(){
  const out = [];
  const od = S.invoices.filter(x=>!x.void && x.type==="sale" && invState(x)==="overdue");
  if(od.length) out.push(["bad","file", t("aOverdueInv",{n:`<span class="num">${od.length}</span>`, x:money(sum(od,x=>invCalc(x).total-invPaid(x)))})]);
  const ch = S.cheques.filter(c=>(c.status==="pending"||c.status==="deposited"||c.status==="handed") && daysTo(c.dueDate)<=7);
  if(ch.length) out.push(["warn","bank", t("aChequesDue",{n:`<span class="num">${ch.length}</span>`, x:money(sum(ch,c=>num(c.amount)))})]);
  const low = typeof lowItems==="function" ? lowItems() : []; if(low.length) out.push(["warn","tag", t("aLowStock",{n:`<span class="num">${low.length}</span>`}) + ": " + low.slice(0,3).map(i=>esc(i.name)).join("، ")]);
  const rd = typeof radarAlert==="function" ? radarAlert() : null; if(rd) out.unshift(rd);
  return out;
}

/* ----- actions ----- */
const _q0 = A.q;
Object.assign(A, {
  q: id => { if(id==="pos"){ closeSheet(); posOpen(); return; } if(id==="inv"){ closeSheet(); A.newInv("sale"); } else if(id==="rec"){ closeSheet(); voucherForm(null, {type:"receipt"}); } else _q0(id); },
  btab: id => { S.btab = id; scrollTo(0,0); render(); },
  ifilter: id => { S.ifilter = id; render(); }, pfilter: id => { S.pfilter = id; render(); }, cdir: id => { S.cdir = id; render(); },
  rper: id => { S.rper = id; render(); },
  rnav: id => { const n = Number(id), per = S.rper||"month"; S.rstart = per==="year" ? addMonths(S.rstart, 12*n) : addMonths(S.rstart, (per==="bi"?2:1)*n); render(); },
  newInv: (id, el) => { closeSheet(); const pid = el && el.dataset.p; if(!S.parties.length){ partyForm(null, {kind:id==="purchase"?"supplier":"customer"}, nid=>setTimeout(()=>invForm(null,{type:id, partyId:nid}),30)); return; } invForm(null, {type:id||"sale", partyId:pid||""}); },
  viewInv: id => { closeSheet(); viewInvSheet(id); },
  editInv: id => { closeSheet(); invForm(invById(id)); },
  dupInv: id => { const x = invById(id); if(!x) return; closeSheet(); invForm(null, {type:x.type, partyId:x.partyId, lines:x.lines, incTax:x.incTax, notes:x.notes, unitId:x.unitId}); },
  retInv: id => { const x = invById(id); if(!x) return; closeSheet(); invForm(null, {type:x.type==="sale"?"saleReturn":"purchaseReturn", partyId:x.partyId, lines:x.lines, incTax:x.incTax, srcId:x.id, unitId:x.unitId}); },
  quoteToInv: id => { const x = invById(id); if(!x) return; closeSheet(); invForm(null, {type:"sale", partyId:x.partyId, lines:x.lines, incTax:x.incTax, notes:x.notes, srcId:x.id, unitId:x.unitId}); },
  payInv: id => { const x = invById(id); if(!x) return; closeSheet(); voucherForm(null, {type:isSaleSide(x.type)?"receipt":"payment", partyId:x.partyId, invoiceId:x.id, amount:String(r2(invCalc(x).total-invPaid(x)))}); },
  printInv: id => { const x = invById(id); if(x){ closeSheet(); printDoc(invDocHtml(x)); } },
  shareInv: id => { const x = invById(id); if(x) openWaText((partyById(x.partyId)||{}).phone, invWaText(x)); },
  addLine: () => { const box = document.getElementById("invLines"); if(!box) return; const ls = readLines(); ls.push({name:"",qty:1,price:"",tax:taxRate()}); box.innerHTML = ls.map(lineRow).join(""); const n = box.querySelectorAll(".ln-name"); if(n.length) n[n.length-1].focus(); invTotals(); },
  delLine: id => { const box = document.getElementById("invLines"); if(!box) return; const ls = readLines(); ls.splice(Number(id),1); if(!ls.length) ls.push({name:"",qty:1,price:"",tax:taxRate()}); box.innerHTML = ls.map(lineRow).join(""); invTotals(); },
  payAll: id => { const el = document.getElementById("f_paidNow"); if(el) el.value = id; },
  quickParty: (id, el) => { if(document.getElementById("qparty")) return; el.closest(".inlinepick").insertAdjacentHTML("afterend", `<div class="inlineadd"><input id="qparty" maxlength="100" placeholder="${esc(t("pName"))}"><button type="button" class="btn sm primary" data-act="quickPartySave" data-id="${id}">${t("add")}</button></div>`); document.getElementById("qparty").focus(); },
  quickPartySave: async id => { const sel = document.getElementById("f_partyId"), inp = document.getElementById("qparty"), nm = (inp && inp.value || "").trim(); if(!sel || !nm){ toast(t("ePartyName")); return; }
    const pid = newId(); if(!await save("parties", pid, {name:nm.slice(0,100), kind:id==="purchase"?"supplier":"customer", createdAt:Date.now(), openBal:0}, true)) return;
    sel.insertAdjacentHTML("beforeend", `<option value="${esc(pid)}">${esc(nm)}</option>`); sel.value = pid; inp.closest(".inlineadd").remove(); toast(t("added",{x:nm})); },
  newParty: () => partyForm(null, {kind:S.pfilter==="supplier"?"supplier":"customer"}),
  editParty: id => { closeSheet(); partyForm(partyById(id)); },
  viewParty: id => { S.stFrom = ""; viewPartySheet(id); },
  stRange: (id, el) => { S.stFrom = el.dataset.r==="month" ? monthStartOf(today()) : ""; viewPartySheet(id); },
  shareSt: id => { const p = partyById(id); if(p) openWaText(p.phone, stWaText(id)); },
  printSt: id => { if(partyById(id)){ closeSheet(); printDoc(stDocHtml(id)); } },
  newVoucher: (id, el) => { closeSheet(); voucherForm(null, {type:id==="payment"?"payment":"receipt", partyId:(el&&el.dataset.p)||""}); if(el && el.dataset.cheque){ const r = document.querySelector('#sheetBody [name="method"][value="cheque"]'); if(r){ r.checked = true; chFieldsVis(); } } },
  editVoucher: id => { const v = S.vouchers.find(x=>x.id===id); if(v){ closeSheet(); voucherForm(v); } },
  viewCheque: id => chequeSheet(id), chSet: (id, el) => chSet(id, el.dataset.s),
  items: () => itemsSheet(), newItem: () => itemForm(null), editItem: id => itemForm(S.items.find(i=>i.id===id)),
  exportInv: () => exportInvoices(),
});
document.addEventListener("input", e=>{
  if(e.target.closest && e.target.closest("#invLines")){
    if(e.target.dataset.f==="name"){ const it = S.items.find(i=>i.name===e.target.value); if(it){ const r = e.target.closest(".ln"), pr = r.querySelector('[data-f="price"]'), tx = r.querySelector('[data-f="tax"]');
      const p = INV && !isSaleSide(INV.type) ? (num(it.cost)||num(it.price)) : num(it.price); if(pr && !num(pr.value) && p) pr.value = p; if(tx && it.tax!=null) tx.value = String(num(it.tax)); } }
    invTotals(); }
  if(e.target.id==="f_discount") invTotals();
  if(e.target.id==="iq"||e.target.id==="pq"){ S[e.target.id] = e.target.value; const id = e.target.id, pos = e.target.selectionStart; render(); const el = document.getElementById(id); if(el){ el.focus(); try{ el.setSelectionRange(pos,pos); }catch(_){} } }
});
document.addEventListener("change", e=>{
  if(e.target.closest && e.target.closest("#invLines")) invTotals();
  if(e.target.name==="incTax") invTotals();
  if(e.target.name==="method") chFieldsVis();
  if(e.target.id==="f_partyId" && e.target.dataset.vtype){ const v = vals(); voucherForm(null, {type:e.target.dataset.vtype, partyId:e.target.value, amount:v.amount}); }
});
/* =====================================================================
   Inventory: warehouses, stock from invoices, adjustments, transfers,
   stock counts, average cost, low-stock alerts.
   ===================================================================== */
Object.assign(L, {
  bkStock:["المخزون","Stock"], stores:["المستودعات","Warehouses"], storeMain:["المستودع الرئيسي","Main warehouse"], storeNew:["مستودع جديد","New warehouse"], storeName:["اسم المستودع","Warehouse name"],
  allStores:["كل المستودعات","All warehouses"], onHand:["الكمية","On hand"], stValue:["قيمة المخزون","Stock value"], avgCost:["متوسط التكلفة","Average cost"], lowStock:["قرب يخلص","Low"],
  minQty:["حد التنبيه","Alert below"], openQty:["الكمية الافتتاحية","Opening quantity"], isService:["نوعه","Type"], kProduct:["منتج بمخزون","Stocked product"], kService:["خدمة (بدون مخزون)","Service (no stock)"],
  smNew:["حركة مخزون","Stock movement"], smType:["شو صار؟","What happened?"], smIn:["زيادة","Add"], smOut:["نقص / تالف","Remove / damaged"], smMove:["نقل لمستودع ثاني","Transfer"], smCount:["جرد","Stock count"],
  smQty:["الكمية","Quantity"], smActual:["الكمية الفعلية بالمستودع","Actual quantity counted"], smTo:["لوين؟","To which warehouse?"], smFrom:["من أي مستودع؟","From which warehouse?"],
  smSaved:["انحفظت حركة المخزون","Stock movement saved"], eItem:["اختار الصنف","Pick an item"], eStores:["اختار مستودعين مختلفين","Pick two different warehouses"],
  movements:["الحركات","Movements"], noStock:["ما في أصناف بمخزون لسا. ضيف صنف، أو اعمل فاتورة شراء وبتنضاف الأصناف لحالها.","No stocked items yet. Add an item, or record a purchase bill and items are added for you."],
  aLowStock:["أصناف قربت تخلص: {n}","Items running low: {n}"], wNoStock:["انتبه: {x} ما بيكفي بالمستودع (موجود {n})","Heads up: not enough {x} in stock ({n} left)"],
  invStore:["من أي مستودع؟","Which warehouse?"], smCountDiff:["الفرق: {x}","Difference: {x}"], mvInv:["فاتورة","Invoice"], mvAdj:["تعديل","Adjustment"], mvTr:["نقل","Transfer"], mvOpen:["افتتاحي","Opening"],
});
["stores","stockmoves"].forEach(c=>{ if(!COLS.includes(c)) COLS.push(c); S[c] = S[c] || []; });

const MAIN_STORE = "main";
const storeList = () => [{id:MAIN_STORE, name:t("storeMain")}, ...S.stores.filter(s=>!s.archived && s.id!==MAIN_STORE).sort((a,b)=>(a.createdAt||0)-(b.createdAt||0))];
const storeName = id => (storeList().find(s=>s.id===id) || {name:t("storeMain")}).name;
const itemByName = n => { const k = String(n||"").trim().toLowerCase(); return k ? S.items.find(i=>String(i.name).trim().toLowerCase()===k) : null; };
const itemOf = l => (l.itemId && S.items.find(i=>i.id===l.itemId)) || itemByName(l.name);
const stocked = i => i && !i.service;
const invStockSign = tp => tp==="sale" ? -1 : tp==="saleReturn" ? 1 : tp==="purchase" ? 1 : tp==="purchaseReturn" ? -1 : 0;
/* every stock movement, from invoices, manual moves and opening quantities */
function stockMoves(itemId){
  const out = [];
  const it = S.items.find(i=>i.id===itemId);
  if(it && num(it.openQty)) out.push({date:it.openDate||"0000-00-00", store:MAIN_STORE, qty:num(it.openQty), kind:"open", cost:num(it.cost)});
  liveInv().forEach(x=>{ const sg = invStockSign(x.type); if(!sg) return; const c = invCalc(x);
    c.rows.forEach(l=>{ const i = itemOf(l); if(!i || i.id!==itemId || !stocked(i)) return;
      out.push({date:x.date, store:x.storeId||MAIN_STORE, qty:sg*num(l.qty), kind:"inv", ref:x, unit: num(l.qty) ? l.netA/num(l.qty) : 0}); }); });
  S.stockmoves.filter(m=>m.itemId===itemId).forEach(m=>{
    if(m.type==="transfer"){ out.push({date:m.date, store:m.storeId||MAIN_STORE, qty:-num(m.qty), kind:"tr", ref:m}); out.push({date:m.date, store:m.toStoreId||MAIN_STORE, qty:num(m.qty), kind:"tr", ref:m}); }
    else out.push({date:m.date, store:m.storeId||MAIN_STORE, qty:num(m.qty), kind:"adj", ref:m});
  });
  return out.sort((a,b)=>(a.date||"").localeCompare(b.date||""));
}
function qtyOf(itemId, storeId){ return r2(sum(stockMoves(itemId).filter(m=>!storeId || m.store===storeId), m=>m.qty)); }
function avgCostOf(itemId){
  const it = S.items.find(i=>i.id===itemId); if(!it) return 0;
  let q = num(it.openQty), v = num(it.openQty)*num(it.cost);
  liveInv().filter(x=>x.type==="purchase").forEach(x=>invCalc(x).rows.forEach(l=>{ const i = itemOf(l); if(i && i.id===itemId){ q += num(l.qty); v += l.netA; } }));
  return q>0 ? v/q : num(it.cost);
}
const lowItems = () => S.items.filter(i=>stocked(i) && num(i.minQty)>0 && qtyOf(i.id)<=num(i.minQty));

/* ----- stock page ----- */
function viewStock(){
  const st = S.sstore || "", q = (S.sq||"").trim().toLowerCase();
  const items = S.items.filter(stocked).filter(i=>!q || [i.name,i.sku].some(v=>String(v||"").toLowerCase().includes(q))).map(i=>{ const n = qtyOf(i.id, st||null), c = avgCostOf(i.id); return {i, n, c, v:n*c}; })
    .sort((a,b)=>String(a.i.name).localeCompare(String(b.i.name)));
  const stores = storeList();
  let h = `<div class="kpis three"><div class="kpi"><span class="label">${t("stValue")}</span><b>${money(sum(items,x=>Math.max(0,x.v)))}</b></div><div class="kpi"><span class="label">${t("items")}</span><b class="num">${items.length}</b></div><div class="kpi ${lowItems().length?"neg":""}"><span class="label">${t("lowStock")}</span><b class="num">${lowItems().length}</b></div></div>`;
  h += `<div class="chiprow">${[["",t("allStores")],...stores.map(s=>[s.id,s.name])].map(([k,l])=>`<button class="chipbtn" data-act="sstore" data-id="${esc(k)}" aria-pressed="${st===k}">${esc(l)}</button>`).join("")}<button class="chipbtn add" data-act="storesSheet">${icon("gear")}${t("stores")}</button></div>`;
  h += `<div class="two"><button class="btn" data-act="newItem">${icon("plus")}${t("itemNew")}</button><button class="btn" data-act="smNew">${icon("route")}${t("smNew")}</button></div>`;
  h += `<div class="panel"><div class="searchrow"><input id="sq" type="search" placeholder="${esc(t("qSearchName"))}" value="${esc(S.sq||"")}" autocomplete="off"></div>`;
  if(!items.length) return h + `<span class="hint">${t("noStock")}</span></div>`;
  return h + `<div class="list">${items.map(({i,n,c,v})=>{ const low = num(i.minQty)>0 && qtyOf(i.id)<=num(i.minQty);
    return `<button class="row" data-act="viewItem" data-id="${esc(i.id)}"><span class="tx-ic">${icon("tag")}</span><div class="m"><b>${esc(i.name)}</b><span class="sub">${i.sku?esc(i.sku)+" · ":""}${t("avgCost")} ${fmt(c)}${low?` · <span class="negv">${t("lowStock")}</span>`:""}</span></div>
      <div class="col end"><b class="${n<0?"negv":""}"><span class="num">${fmt(n)}</span> ${esc(i.unit||"")}</b><span class="sub">${money(Math.max(0,v))}</span></div></button>`; }).join("")}</div></div>`;
}
function itemSheet(id){
  const i = S.items.find(x=>x.id===id); if(!i) return;
  const mv = stockMoves(id), c = avgCostOf(id);
  openSheet({title:i.name, noSave:true, html:`
    <div class="kv">${storeList().map(s=>`<div><span>${esc(s.name)}</span><b class="num">${fmt(qtyOf(id,s.id))} ${esc(i.unit||"")}</b></div>`).join("")}
      <div><span>${t("avgCost")}</span><b>${money(c)}</b></div><div><span>${t("itemPrice")}</span><b>${money(num(i.price))}</b></div></div>
    <div class="total"><span class="label">${t("onHand")}</span><b>${fmt(qtyOf(id))} ${esc(i.unit||"")} · ${money(qtyOf(id)*c)}</b></div>
    <div class="grid2"><button type="button" class="btn primary" data-act="smNew" data-id="${esc(id)}">${icon("route")}${t("smNew")}</button><button type="button" class="btn" data-act="editItem" data-id="${esc(id)}">${icon("gear")}${t("edit")}</button></div>
    <span class="label">${t("movements")}</span>
    <div class="list">${mv.slice(-40).reverse().map(m=>`<div class="row static"><div class="m"><b>${m.kind==="inv"?esc(t(INV_T[m.ref.type])+" "+(m.ref.no||"")):m.kind==="tr"?t("mvTr"):m.kind==="open"?t("mvOpen"):esc(m.ref.note||t("mvAdj"))}</b><span class="sub">${m.date&&m.date!=="0000-00-00"?fdate(m.date)+" · ":""}${esc(storeName(m.store))}</span></div><b class="${m.qty<0?"negv":"pos"}">${m.qty>0?"+":""}${fmt(m.qty)}</b></div>`).join("") || `<span class="hint">${t("noTx")}</span>`}</div>`});
}
function stockMoveForm(itemId){
  const stores = storeList(), items = S.items.filter(stocked).sort((a,b)=>String(a.name).localeCompare(String(b.name)));
  if(!items.length){ toast(t("noStock")); return; }
  openSheet({title:t("smNew"), saveLabel:t("record"),
    fields:[{name:"itemId",label:t("lnItem"),type:"select",options:[["",""],...items.map(i=>[i.id,i.name])],value:itemId||""},
      {name:"type",label:t("smType"),type:"chips",options:[["in",t("smIn")],["out",t("smOut")],["count",t("smCount")],...(stores.length>1?[["transfer",t("smMove")]]:[])],value:"in"},
      {name:"qty",label:t("smQty"),type:"money",big:true,value:"",hint:""},
      ...(stores.length>1?[{name:"storeId",label:t("smFrom"),type:"select",options:stores.map(s=>[s.id,s.name]),value:S.sstore||MAIN_STORE},{name:"toStoreId",label:t("smTo"),type:"select",options:stores.map(s=>[s.id,s.name]),value:(stores[1]||{}).id||MAIN_STORE}]:[])],
    more:[{name:"date",label:t("date"),type:"date",value:today()},{name:"note",label:t("note"),value:"",max:120}],
    submit: async v=>{
      const it = S.items.find(i=>i.id===v.itemId); if(!it){ toast(t("eItem")); return false; }
      const store = v.storeId || MAIN_STORE, q = num(v.qty), date = validDate(v.date)?v.date:today();
      let data;
      if(v.type==="transfer"){ if(q<=0){ toast(t("eAmount")); return false; } if(v.toStoreId===store){ toast(t("eStores")); return false; }
        data = {type:"transfer", itemId:it.id, qty:q, storeId:store, toStoreId:v.toStoreId||MAIN_STORE}; }
      else if(v.type==="count"){ const now = qtyOf(it.id, store), d = r2(q - now); if(!d){ closeSheet(); toast(t("smSaved")); return true; } data = {type:"count", itemId:it.id, qty:d, storeId:store, counted:q}; }
      else { if(q<=0){ toast(t("eAmount")); return false; } data = {type:"adjust", itemId:it.id, qty: v.type==="out" ? -q : q, storeId:store}; }
      const ok = await save("stockmoves", null, {...data, date, note:(v.note||"").slice(0,120), createdAt:Date.now()});
      if(ok) toast(t("smSaved")); return ok;
    }});
  smHint();
}
function smHint(){
  const el = document.getElementById("f_qty_hint"); if(!el) return;
  const tp = (document.querySelector('#sheetBody [name="type"]:checked')||{}).value, it = (document.getElementById("f_itemId")||{}).value, st = (document.getElementById("f_storeId")||{}).value || MAIN_STORE;
  const lab = document.querySelector('label[for="f_qty"]'); if(lab) lab.textContent = tp==="count" ? t("smActual") : t("smQty");
  const to = document.getElementById("f_toStoreId"); if(to) to.closest(".field").hidden = tp!=="transfer";
  if(!it){ el.innerHTML = ""; return; }
  const now = qtyOf(it, st), q = num((document.getElementById("f_qty")||{}).value);
  el.innerHTML = `${t("onHand")}: <b class="num">${fmt(now)}</b>${tp==="count" && (document.getElementById("f_qty")||{}).value!=="" ? " · "+t("smCountDiff",{x:`<span class="num">${(q-now>0?"+":"")+fmt(q-now)}</span>`}) : ""}`;
}
function storesSheet(){
  openSheet({title:t("stores"), saveLabel:t("add"), html:`<div class="list">${storeList().map(s=>`<div class="row static"><span class="tx-ic">${icon("building")}</span><div class="m"><b>${esc(s.name)}</b><span class="sub">${t("stValue")} ${money(sum(S.items.filter(stocked),i=>Math.max(0,qtyOf(i.id,s.id))*avgCostOf(i.id)))}</span></div></div>`).join("")}</div>`,
    fields:[{name:"name",label:t("storeNew"),value:"",max:60,ph:t("storeName")}],
    submit: async v=>{ if(!v.name){ toast(t("ePartyName")); return false; } if(await save("stores", null, {name:v.name.slice(0,60), createdAt:Date.now()}, true)){ toast(t("added",{x:v.name})); setTimeout(storesSheet,30); return true; } return false; }});
}
function stockWarn(inv){
  if(inv.type!=="sale" && inv.type!=="purchaseReturn") return;
  for(const l of inv.lines||[]){ const i = itemOf(l); if(!stocked(i)) continue; const n = qtyOf(i.id, inv.storeId||MAIN_STORE);
    if(n < 0){ toast(t("wNoStock",{x:i.name, n:fmt(n + num(l.qty))})); return; } }
}

Object.assign(A, {
  sstore: id => { S.sstore = id; render(); },
  viewItem: id => itemSheet(id), smNew: id => { closeSheet(); stockMoveForm(id||""); }, storesSheet: () => storesSheet(),
});
document.addEventListener("input", e=>{ if(e.target.id==="f_qty" && document.querySelector('#sheetBody [name="toStoreId"], #sheetBody [name="type"][value="count"]')) smHint();
  if(e.target.id==="sq"){ S.sq = e.target.value; const pos = e.target.selectionStart; render(); const el = document.getElementById("sq"); if(el){ el.focus(); try{ el.setSelectionRange(pos,pos); }catch(_){} } } });
document.addEventListener("change", e=>{ if(["type","itemId","storeId"].includes(e.target.name) && document.querySelector('#sheetBody [name="type"][value="count"]')) smHint(); });
/* =====================================================================
   General ledger: chart of accounts, journal entries built automatically
   from everything in the app (double entry), manual journals,
   trial balance, income statement, balance sheet, account ledger.
   ===================================================================== */
Object.assign(L, {
  bkGl:["المحاسبة","Accounting"], glTree:["شجرة الحسابات","Chart of accounts"], glJournal:["القيود","Journal"], glTB:["ميزان المراجعة","Trial balance"], glIS:["قائمة الدخل","Income statement"], glBS:["الميزانية","Balance sheet"],
  glNewJ:["قيد يدوي","Manual entry"], glAcc:["الحساب","Account"], glDebit:["مدين","Debit"], glCredit:["دائن","Credit"], glTotal:["المجموع","Total"], glBal:["الرصيد","Balance"],
  glUnbal:["القيد مش موزون: المدين {d} والدائن {c}","Entry doesn't balance: debit {d}, credit {c}"], glSaved:["انحفظ القيد","Entry saved"], glLines2:["لازم سطرين عالأقل بمبالغ","At least two lines with amounts"],
  glNewAcc:["حساب جديد","New account"], glAccName:["اسم الحساب","Account name"], glParent:["تحت أي حساب؟","Under which account?"], glCode:["الرقم","Code"],
  glAssets:["الأصول","Assets"], glLiab:["الخصوم","Liabilities"], glEquity:["حقوق الملكية","Equity"], glRev:["الإيرادات","Revenue"], glExp:["المصاريف","Expenses"],
  glNetProfit:["صافي الربح","Net profit"], glNetLoss:["صافي الخسارة","Net loss"], glCurProfit:["أرباح الفترة","Profit for the period"], glLE:["الخصوم وحقوق الملكية","Liabilities & equity"],
  glBalanced:["الميزانية موزونة","Balanced"], glAuto:["تلقائي","Auto"], glManual:["يدوي","Manual"], glAsOf:["لغاية {d}","As of {d}"], glFromTo:["من {a} لـ {b}","{a} to {b}"],
  glHint:["كل حركة بتسجّلها (فاتورة، قبض، صرف، مصروف، راتب، شيك) بتعمل قيدها هون لحالها، فما بتحتاج تعرف محاسبة. القيد اليدوي للحالات الخاصة بس.","Every move you record (invoice, receipt, payment, expense, wage, cheque) posts its own entry here, so no accounting knowledge needed. Manual entries are for special cases only."],
  glExport:["صدّر الميزان Excel","Export trial balance (Excel)"], glLedgerOf:["حركة حساب: {x}","Ledger: {x}"], glOpening:["رصيد افتتاحي","Opening balance"],
  // default accounts
  a1:["الأصول","Assets"], a11:["الصندوق (كاش)","Cash"], a12:["البنك","Bank"], a13:["ذمم الزباين","Accounts receivable"], a14:["المخزون","Inventory"], a15:["شيكات برسم التحصيل","Cheques to collect"], a16:["ضريبة المشتريات (مدخلات)","Input tax"], a17:["سلف الموظفين","Staff advances"],
  a2:["الخصوم","Liabilities"], a21:["ذمم الموردين","Accounts payable"], a22:["شيكات آجلة الدفع","Post-dated cheques payable"], a23:["ضريبة المبيعات المستحقة","Sales tax payable"], a24:["رواتب مستحقة","Wages payable"], a25:["الضمان الاجتماعي المستحق","Social security payable"], a26:["ضريبة دخل مقتطعة","Income tax withheld"],
  a3:["حقوق الملكية","Equity"], a31:["رأس المال","Capital"], a32:["جاري الشركاء","Owners' drawings"], a33:["أرصدة افتتاحية","Opening balances"],
  a4:["الإيرادات","Revenue"], a41:["المبيعات","Sales"], a42:["مردودات المبيعات","Sales returns"], a43:["إيرادات المشاريع والخدمات","Project & service income"],
  a5:["المصاريف","Expenses"], a51:["تكلفة البضاعة المباعة","Cost of goods sold"], a52:["الرواتب والأجور","Wages & salaries"], a53:["مصاريف التشغيل","Operating expenses"], a54:["عمولات التطبيقات","App commissions"], a55:["فروقات جرد المخزون","Stock count differences"], a56:["حصة الشركة بالضمان","Employer social security"], a57:["مشتريات خدمات ومواد","Purchased services & supplies"],
});
["journals","accounts"].forEach(c=>{ if(!COLS.includes(c)) COLS.push(c); S[c] = S[c] || []; });

const ACC_BASE = [["1",null,"A"],["11","1"],["12","1"],["13","1"],["14","1"],["15","1"],["16","1"],["17","1"],
  ["2",null,"L"],["21","2"],["22","2"],["23","2"],["24","2"],["25","2"],["26","2"],
  ["3",null,"E"],["31","3"],["32","3"],["33","3"],
  ["4",null,"R"],["41","4"],["42","4"],["43","4"],
  ["5",null,"X"],["51","5"],["52","5"],["53","5"],["54","5"],["55","5"],["56","5"],["57","5"]];
/* the full chart: base accounts + one sub-account per expense category + the user's own accounts */
function chart(){
  const m = new Map();
  ACC_BASE.forEach(([code,parent])=>m.set(code, {code, parent, name:t("a"+code), base:true}));
  const cats = new Set(S.expenses.map(x=>x.category).filter(Boolean)); let n = 1;
  [...cats].sort().forEach(c=>{ const code = "53"+String(n++).padStart(2,"0"); m.set(code, {code, parent:"53", name:catLabel(c), cat:c}); });
  S.accounts.filter(a=>!a.archived).forEach(a=>m.set(a.code, {code:a.code, parent:a.parent, name:a.name, id:a.id, custom:true}));
  return m;
}
const accRoot = code => String(code)[0];
const accSide = code => ["1","5"].includes(accRoot(code)) ? 1 : -1;   // normal debit balance for assets & expenses
const catAcc = (C, cat) => { for(const a of C.values()) if(a.cat===cat) return a.code; return "53"; };
const payAcc = m => m==="cash" || !m ? "11" : "12";
/* every journal entry, derived from the data (never stored), plus manual ones */
function journal(){
  const C = chart(), out = [];
  const E = (date, ref, txt, lines, auto=true) => { const ls = lines.filter(l=>Math.abs(l[1])>0.004); if(ls.length) out.push({date, ref, txt, auto, lines:ls.map(([acc,amt,note])=>({acc, dr:amt>0?r2(amt):0, cr:amt<0?r2(-amt):0, note}))}); };
  // party opening balances
  S.parties.forEach(p=>{ const b = num(p.openBal); if(b) E(p.openDate||"0000-01-01", p, `${t("glOpening")} · ${p.name}`, b>0 ? [["13",b],["33",-b]] : [["33",-b],["21",b]]); });
  // stock opening
  S.items.forEach(i=>{ const v = num(i.openQty)*num(i.cost); if(v && !i.service) E(i.openDate||"0000-01-01", i, `${t("glOpening")} · ${i.name}`, [["14",v],["33",-v]]); });
  // invoices
  liveInv().forEach(x=>{ const c = invCalc(x), p = (partyById(x.partyId)||{}).name||"", txt = `${t(INV_T[x.type])} ${x.no||""} · ${p}`;
    let stockCost = 0, stockBuy = 0, other = 0;
    c.rows.forEach(l=>{ const i = itemOf(l); if(stocked(i)){ stockCost += num(l.qty)*avgCostOf(i.id); stockBuy += l.netA; } else other += l.netA; });
    if(x.type==="sale") E(x.date, x, txt, [["13",c.total],["41",-c.net],["23",-c.tax],["51",stockCost],["14",-stockCost]]);
    else if(x.type==="saleReturn") E(x.date, x, txt, [["42",c.net],["23",c.tax],["13",-c.total],["14",stockCost],["51",-stockCost]]);
    else if(x.type==="purchase") E(x.date, x, txt, [["14",stockBuy],["57",other],["16",c.tax],["21",-c.total]]);
    else if(x.type==="purchaseReturn") E(x.date, x, txt, [["21",c.total],["14",-stockBuy],["57",-other],["16",-c.tax]]);
  });
  // receipts & payments, cheques
  liveVouch().forEach(v=>{ const p = (partyById(v.partyId)||{}).name||"", a = num(v.amount), ch = S.cheques.find(c=>c.voucherId===v.id);
    const txt = `${t(v.type==="receipt"?"vReceipt":"vPayment")} ${v.no||""} · ${p}`;
    if(v.type==="receipt") E(v.date, v, txt, [[v.method==="cheque"?"15":payAcc(v.method), a],["13",-a]]);
    else E(v.date, v, txt, [["21",a],[v.method==="cheque"?"22":payAcc(v.method), -a]]);
    if(ch && ch.status==="cleared") E(ch.statusAt||ch.dueDate||v.date, ch, `${t("cheque")} ${ch.no||""} · ${t("chCleared")}`, ch.dir==="in" ? [["12",a],["15",-a]] : [["22",a],["12",-a]]);
  });
  // project expenses & income, app commissions
  S.expenses.forEach(x=>{ const a = num(x.amount); E(x.date, x, `${catLabel(x.category)}${x.item?" · "+x.item:""}`, [[catAcc(C,x.category), a],[payAcc(x.payBy), -a]]); });
  S.income.forEach(x=>{ const a = num(x.amount), cm = commOf(x); E(x.date, x, `${catLabel(x.category)}${x.note?" · "+x.note:""}`, [[payAcc(x.payBy), a-cm],["54",cm],["43",-a]]); });
  // wages earned (by attendance) and paid
  const ssOn = typeof ssEmpRate==="function";
  const wageDay = (date, ref, s, w) => { const ee = ssOn && s && s.ss ? w*ssEmpRate() : 0, er = ssOn && s && s.ss ? w*ssErRate() : 0, tx = s && num(s.taxMonthly) ? num(s.taxMonthly)/workDaysMonth(date) : 0;
    E(date, ref, `${t("a52")} · ${(s||{}).name||""}`, [["52",w],["24",-(w-ee-tx)],["25",-ee],["26",-tx],["56",er],["25",-er]]); };
  S.attendance.filter(came).forEach(x=>wageDay(x.date, x, staffById(x.staffId), dayPay(x).total));
  S.leaves.filter(l=>l.type!=="unpaid").forEach(l=>{ const s = staffById(l.staffId); if(!s) return; for(let d=l.from; d<=l.to; d=addDays(d,1)){ if(!isOff(d) && !attOf(s.id,d)) wageDay(d, l, s, dayRate(s,d)); } });
  S.payments.forEach(x=>{ const a = num(x.amount); E(x.date, x, `${x.kind==="salary"?t("fromSalary"):t("advance")} · ${(staffById(x.staffId)||{}).name||""}`, [["24",a],[payAcc(x.payBy), -a]]); });
  // stock adjustments & counts (transfers don't change value)
  S.stockmoves.filter(m=>m.type!=="transfer").forEach(m=>{ const v = num(m.qty)*avgCostOf(m.itemId); E(m.date, m, `${m.type==="count"?t("smCount"):t("mvAdj")} · ${(S.items.find(i=>i.id===m.itemId)||{}).name||""}`, [["14",v],["55",-v]]); });
  // manual
  S.journals.forEach(j=>out.push({date:j.date, ref:j, txt:j.note||t("glManual"), auto:false, no:j.no, lines:(j.lines||[]).map(l=>({acc:l.acc, dr:r2(num(l.dr)), cr:r2(num(l.cr)), note:l.note||""}))}));
  return out.sort((a,b)=>(a.date||"").localeCompare(b.date||""));
}
/* balances by account for a date range (b = up to, a = from; balance sheet uses only b) */
function balances(a, b){
  const C = chart(), bal = {}; C.forEach((_,k)=>bal[k]={dr:0,cr:0});
  journal().filter(e=>(!a || e.date>=a) && (!b || e.date<=b)).forEach(e=>e.lines.forEach(l=>{ if(!bal[l.acc]) bal[l.acc] = {dr:0,cr:0}; bal[l.acc].dr += l.dr; bal[l.acc].cr += l.cr; }));
  // roll up into parents
  const kids = code => [...C.values()].filter(x=>x.parent===code).map(x=>x.code);
  const roll = code => { const k = kids(code); if(!k.length) return bal[code]||{dr:0,cr:0}; const s = {dr:(bal[code]||{}).dr||0, cr:(bal[code]||{}).cr||0}; k.forEach(c=>{ const x = roll(c); s.dr += x.dr; s.cr += x.cr; }); return s; };
  const out = {}; C.forEach((acc,k)=>{ const x = roll(k); out[k] = {acc, dr:r2(x.dr), cr:r2(x.cr), net:r2((x.dr-x.cr)*accSide(k))}; });
  return out;
}

/* ----- the accounting page ----- */
function viewLedger(){
  const g = S.gtab || "is";
  if(!S.gend) S.gend = today(); if(!S.gstart) S.gstart = `${today().slice(0,4)}-01-01`;
  let h = `<div class="chiprow">${[["is",t("glIS")],["bs",t("glBS")],["tb",t("glTB")],["j",t("glJournal")],["tree",t("glTree")]].map(([k,l])=>`<button class="chipbtn" data-act="gtab" data-id="${k}" aria-pressed="${g===k}">${l}</button>`).join("")}</div>`;
  h += `<div class="panel daterow"><label>${LANG==="en"?"From":"من"}<input type="date" id="gstart" value="${esc(S.gstart)}"></label><label>${LANG==="en"?"To":"لـ"}<input type="date" id="gend" value="${esc(S.gend)}"></label></div>`;
  if(g==="tree") return h + viewTree();
  if(g==="j") return h + viewJournal();
  if(g==="tb") return h + viewTB();
  if(g==="bs") return h + viewBS();
  return h + viewIS();
}
const accRow = (k, b, lvl=1, strong=false) => `<button class="row arow lvl${lvl}" data-act="accLedger" data-id="${esc(k)}"><div class="m"><b class="${strong?"":"wn"}"><span class="num code">${esc(k)}</span> ${esc(b.acc.name)}</b></div><b class="${b.net<0?"negv":""}">${money(b.net)}</b></button>`;
function viewIS(){
  const B = balances(S.gstart, S.gend), C = chart();
  const kids = p => [...C.values()].filter(a=>a.parent===p).map(a=>a.code).filter(k=>B[k] && (B[k].dr||B[k].cr));
  const rev = B["4"].net, exp = B["5"].net, np = r2(rev-exp);
  return `<div class="panel"><span class="label">${t("glIS")} · ${t("glFromTo",{a:fdate(S.gstart),b:fdate(S.gend)})}</span>
    <div class="list">${accRow("4",B["4"],0,true)}${kids("4").map(k=>accRow(k,B[k])).join("")}</div>
    <div class="list">${accRow("5",B["5"],0,true)}${kids("5").map(k=>accRow(k,B[k])+[...C.values()].filter(a=>a.parent===k && B[a.code] && (B[a.code].dr||B[a.code].cr)).map(a=>accRow(a.code,B[a.code],2)).join("")).join("")}</div>
    <div class="total"><span class="label">${np<0?t("glNetLoss"):t("glNetProfit")}</span><b class="${np<0?"negv":"pos"}">${money(Math.abs(np))}</b></div></div>`;
}
function viewBS(){
  const B = balances(null, S.gend), C = chart();
  const kids = p => [...C.values()].filter(a=>a.parent===p).map(a=>a.code).filter(k=>B[k] && (B[k].dr||B[k].cr));
  const profit = r2(B["4"].net - B["5"].net), A = B["1"].net, Lb = B["2"].net, Eq = r2(B["3"].net + profit), ok = Math.abs(A-(Lb+Eq))<0.02;
  return `<div class="panel"><span class="label">${t("glBS")} · ${t("glAsOf",{d:fdate(S.gend)})}</span>
    <div class="list">${accRow("1",B["1"],0,true)}${kids("1").map(k=>accRow(k,B[k])).join("")}</div>
    <div class="total"><span class="label">${t("glAssets")}</span><b>${money(A)}</b></div>
    <div class="list">${accRow("2",B["2"],0,true)}${kids("2").map(k=>accRow(k,B[k])).join("")}</div>
    <div class="list">${accRow("3",B["3"],0,true)}${kids("3").map(k=>accRow(k,B[k])).join("")}<div class="row static"><div class="m"><b class="wn">${t("glCurProfit")}</b></div><b class="${profit<0?"negv":""}">${money(profit)}</b></div></div>
    <div class="total"><span class="label">${t("glLE")}</span><b>${money(Lb+Eq)}</b></div>
    <span class="pill ${ok?"good":"bad"} self-start">${ok?icon("check")+t("glBalanced"):t("glUnbal",{d:fmt(A),c:fmt(Lb+Eq)})}</span></div>`;
}
function viewTB(){
  const B = balances(S.gstart, S.gend), C = chart();
  const leaf = [...C.values()].filter(a=>![...C.values()].some(x=>x.parent===a.code)).map(a=>a.code).filter(k=>B[k].dr||B[k].cr).sort();
  const td = sum(leaf,k=>B[k].dr), tc = sum(leaf,k=>B[k].cr);
  return `<div class="panel"><span class="label">${t("glTB")} · ${t("glFromTo",{a:fdate(S.gstart),b:fdate(S.gend)})}</span>
    <div class="tbl-wrap"><table class="tbl"><thead><tr><th>${t("glCode")}</th><th>${t("glAcc")}</th><th>${t("glDebit")}</th><th>${t("glCredit")}</th></tr></thead><tbody>
    ${leaf.map(k=>`<tr data-act="accLedger" data-id="${esc(k)}"><td class="num">${esc(k)}</td><td>${esc(B[k].acc.name)}</td><td class="num">${B[k].dr?fmt(B[k].dr):""}</td><td class="num">${B[k].cr?fmt(B[k].cr):""}</td></tr>`).join("")}
    </tbody><tfoot><tr><td></td><td>${t("glTotal")}</td><td class="num">${fmt(td)}</td><td class="num">${fmt(tc)}</td></tr></tfoot></table></div>
    <span class="pill ${Math.abs(td-tc)<0.02?"good":"bad"} self-start">${Math.abs(td-tc)<0.02?icon("check")+t("glBalanced"):t("glUnbal",{d:fmt(td),c:fmt(tc)})}</span>
    <button class="btn ghost sm self-start" data-act="exportTB">${icon("wallet")}${t("glExport")}</button></div>`;
}
function viewJournal(){
  const J = journal().filter(e=>e.date>=S.gstart && e.date<=S.gend).reverse(), C = chart();
  return `<span class="hint">${t("glHint")}</span><button class="btn primary self-start" data-act="newJournal">${icon("plus")}${t("glNewJ")}</button>
    <div class="panel"><div class="list">${J.slice(0,150).map(e=>`<${e.auto?"div":"button type=\"button\""} class="row jrow ${e.auto?"static":""}" ${e.auto?"":`data-act="editJournal" data-id="${esc(e.ref.id)}"`}><div class="m"><b>${esc(e.txt)}</b><span class="sub">${fdate(e.date)} · ${e.auto?t("glAuto"):t("glManual")}</span>
      <div class="jl">${e.lines.map(l=>`<span>${l.dr?"":"&nbsp;&nbsp;&nbsp;"}${esc((C.get(l.acc)||{name:l.acc}).name)}</span><span class="num">${l.dr?fmt(l.dr):""}</span><span class="num">${l.cr?fmt(l.cr):""}</span>`).join("")}</div></div></${e.auto?"div":"button"}>`).join("") || `<span class="hint">${t("noTx")}</span>`}</div></div>`;
}
function viewTree(){
  const C = chart(), B = balances(null, null);
  const walk = (p, lvl) => [...C.values()].filter(a=>a.parent===p).sort((a,b)=>a.code.localeCompare(b.code)).map(a=>accRow(a.code, B[a.code], lvl, lvl===0) + walk(a.code, lvl+1)).join("");
  return `<button class="btn self-start" data-act="newAcc">${icon("plus")}${t("glNewAcc")}</button><div class="panel"><div class="list">${walk(null,0)}</div></div>`;
}
function accLedgerSheet(code){
  const C = chart(), acc = C.get(code); if(!acc) return;
  const codes = new Set([code]); let grew = true; while(grew){ grew = false; C.forEach(a=>{ if(a.parent && codes.has(a.parent) && !codes.has(a.code)){ codes.add(a.code); grew = true; } }); }
  let bal = 0; const rows = [];
  journal().filter(e=>!S.gend || e.date<=S.gend).forEach(e=>e.lines.filter(l=>codes.has(l.acc)).forEach(l=>{ bal += (l.dr-l.cr)*accSide(code); rows.push({e, l, bal}); }));
  openSheet({title:t("glLedgerOf",{x:acc.name}), noSave:true, html:`<div class="total"><span class="label">${t("glBal")}</span><b>${money(bal)}</b></div>
    <div class="list">${rows.slice(-120).reverse().map(({e,l,bal})=>`<div class="row static"><div class="m"><b>${esc(e.txt)}</b><span class="sub">${e.date>"0001"?fdate(e.date):t("glOpening")} · ${t("glBal")} ${fmt(bal)}</span></div><b class="${l.cr?"negv":""}">${l.dr?"+ "+fmt(l.dr):"− "+fmt(l.cr)}</b></div>`).join("") || `<span class="hint">${t("noTx")}</span>`}</div>`});
}
let JL = [];
function journalForm(j){
  const C = chart(), opts = [...C.values()].filter(a=>![...C.values()].some(x=>x.parent===a.code)).sort((a,b)=>a.code.localeCompare(b.code)).map(a=>[a.code, `${a.code} · ${a.name}`]);
  JL = j ? (j.lines||[]).map(l=>({...l})) : [{acc:"",dr:"",cr:""},{acc:"",dr:"",cr:""}];
  const row = (l,i) => `<div class="ln jln" data-i="${i}"><select data-f="acc">${[["",""],...opts].map(([v,lab])=>`<option value="${esc(v)}" ${v===l.acc?"selected":""}>${esc(lab)}</option>`).join("")}</select>
    <div class="ln-nums j"><label><span>${t("glDebit")}</span><input data-f="dr" inputmode="decimal" value="${esc(l.dr||"")}"></label><label><span>${t("glCredit")}</span><input data-f="cr" inputmode="decimal" value="${esc(l.cr||"")}"></label></div></div>`;
  window.__jrow = row;
  openSheet({title: j ? t("glManual") : t("glNewJ"), saveLabel: j?t("save"):t("record"),
    top:`<div id="jLines" class="invlines">${JL.map(row).join("")}</div><button type="button" class="btn dashed sm" data-act="addJLine">${icon("plus")}${t("addLine")}</button><div class="preview" id="jTot"></div>`,
    fields:[{name:"note",label:t("note"),value:j?.note||"",max:160},{name:"date",label:t("date"),type:"date",value:j?.date||today()}],
    del: j ? {label:t("del"), run:()=>remove("journals", j.id)} : null,
    submit: async v=>{
      const ls = readJ().filter(l=>l.acc && (l.dr||l.cr));
      if(ls.length<2){ toast(t("glLines2")); return false; }
      const d = r2(sum(ls,l=>l.dr)), c = r2(sum(ls,l=>l.cr)); if(Math.abs(d-c)>0.004){ toast(t("glUnbal",{d:fmt(d),c:fmt(c)})); return false; }
      const ok = await save("journals", j?.id, {...(j?strip(j):{createdAt:Date.now()}), date:validDate(v.date)?v.date:today(), note:(v.note||"").slice(0,160), lines:ls});
      if(ok) toast(t("glSaved")); return ok;
    }});
  jTot();
}
function readJ(){ const out = []; document.querySelectorAll("#jLines .jln").forEach(r=>{ const g = f => (r.querySelector(`[data-f="${f}"]`)||{}).value||""; out.push({acc:g("acc"), dr:r2(num(g("dr"))), cr:r2(num(g("cr")))}); }); return out; }
function jTot(){ const el = document.getElementById("jTot"); if(!el) return; const ls = readJ(), d = sum(ls,l=>l.dr), c = sum(ls,l=>l.cr);
  el.innerHTML = `${t("glDebit")} <b class="num">${fmt(d)}</b> · ${t("glCredit")} <b class="num">${fmt(c)}</b> ${Math.abs(d-c)<0.005 && d ? `<span class="pill good">${icon("check")}${t("glBalanced")}</span>` : ""}`; }
function accForm(){
  const C = chart(), parents = [...C.values()].filter(a=>a.code.length<=2).map(a=>[a.code, `${a.code} · ${a.name}`]);
  openSheet({title:t("glNewAcc"), saveLabel:t("add"),
    fields:[{name:"name",label:t("glAccName"),value:"",max:80},{name:"parent",label:t("glParent"),type:"select",options:parents,value:"53"}],
    submit: async v=>{ if(!v.name){ toast(t("ePartyName")); return false; }
      const sib = [...C.keys()].filter(k=>k.startsWith(v.parent) && k.length===v.parent.length+2).map(k=>parseInt(k.slice(v.parent.length))||0);
      const code = v.parent + String(Math.max(50, ...sib)+1).padStart(2,"0");
      return save("accounts", null, {code, parent:v.parent, name:v.name.slice(0,80), createdAt:Date.now()}); }});
}
function exportTB(){
  const B = balances(S.gstart, S.gend), C = chart();
  const rows = [[t("glCode"),t("glAcc"),t("glDebit"),t("glCredit"),t("glBal")]];
  [...C.keys()].sort().forEach(k=>{ if(B[k].dr||B[k].cr) rows.push([k, B[k].acc.name, B[k].dr, B[k].cr, B[k].net]); });
  downloadCsv(rows, `daftar-trial-balance-${S.gend}.csv`);
}
function downloadCsv(rows, name){
  const csv = "﻿" + rows.map(r=>r.map(v=>{ const s = String(v??""); return /[",\n]/.test(s) ? `"${s.replace(/"/g,'""')}"` : s; }).join(",")).join("\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"})); a.download = name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
}

Object.assign(A, {
  gtab: id => { S.gtab = id; render(); }, accLedger: id => accLedgerSheet(id),
  newJournal: () => journalForm(null), editJournal: id => journalForm(S.journals.find(j=>j.id===id)),
  addJLine: () => { const box = document.getElementById("jLines"); if(!box) return; const ls = readJ(); ls.push({acc:"",dr:"",cr:""}); box.innerHTML = ls.map(window.__jrow).join(""); jTot(); },
  newAcc: () => accForm(), exportTB: () => exportTB(),
});
document.addEventListener("input", e=>{ if(e.target.closest && e.target.closest("#jLines")) jTot(); });
document.addEventListener("change", e=>{ if(e.target.id==="gstart"||e.target.id==="gend"){ if(validDate(e.target.value)){ S[e.target.id] = e.target.value; render(); } } if(e.target.closest && e.target.closest("#jLines")) jTot(); });
/* =====================================================================
   HR & payroll (Jordan defaults): social security shares, income tax
   withholding, leaves, payslips, monthly social-security sheet.
   ===================================================================== */
Object.assign(L, {
  hrSS:["مشترك بالضمان","Social security"], hrSSNo:["رقم الضمان","SS number"], hrTax:["ضريبة دخل شهرية تنقطع","Monthly income tax withheld"], hrTaxEst:["احسبها تقريبياً","Estimate it"],
  hrTaxHint:["تقدير على أساس إعفاء 9,000 للشخص{f} وشرائح 5% لـ 25%. راجع محاسبك.","Estimate using the 9,000 personal exemption{f} and 5%–25% brackets. Check with your accountant."], hrFam:[" و9,000 للعائلة"," + 9,000 family"],
  hrFamily:["إله عائلة (معيل)","Supports a family"], yes:["آه","Yes"], no:["لا","No"],
  hrLeave:["إجازة","Leave"], hrLeaves:["الإجازات","Leaves"], hrLeaveNew:["سجّل إجازة","Record leave"], hrLeaveType:["نوع الإجازة","Leave type"], lvAnnual:["سنوية (مدفوعة)","Annual (paid)"], lvSick:["مرضية (مدفوعة)","Sick (paid)"], lvUnpaid:["بدون راتب","Unpaid"],
  hrFrom:["من","From"], hrTo:["لـ","To"], hrLeaveBal:["رصيد الإجازة السنوية {y}: باقي {n} من {t} يوم","{y} annual leave: {n} of {t} days left"], hrWho:["الموظف","Employee"], eLeaveDates:["تأكد من التواريخ","Check the dates"],
  hrPayslip:["قسيمة راتب","Payslip"], hrSSSheet:["كشف الضمان الشهري","Monthly SS sheet"], hrGross:["إجمالي المستحق","Gross earned"], hrBase:["الراتب حسب الدوام","Pay for days worked"], hrLeavePay:["إجازات مدفوعة","Paid leave"],
  hrDed:["الاقتطاعات","Deductions"], hrSSEmp:["الضمان (حصة الموظف)","Social security (employee)"], hrSSEr:["الضمان (حصة الشركة)","Social security (employer)"], hrIncTax:["ضريبة الدخل","Income tax"], hrAdv:["السلف","Advances"],
  hrNet:["الصافي","Net pay"], hrPaidAlready:["انصرف","Already paid"], hrLeft:["الباقي إله","Still owed"], hrSSTotal:["المجموع للضمان","Total to pay SS"], hrWage:["الأجر","Wage"],
  setSSEmp:["حصة الموظف بالضمان %","Employee SS %"], setSSEr:["حصة الشركة بالضمان %","Employer SS %"], setSSCap:["سقف الأجر الخاضع للضمان (شهري)","SS wage ceiling (monthly)"],
  hrSSHint:["النسب الافتراضية 7.5% للموظف و14.25% للشركة. غيّرها إذا نشاطك إله نسبة ثانية.","Defaults: 7.5% employee and 14.25% employer. Change them if your activity has a different rate."],
  ssLine:["الضمان {p}%","SS {p}%"], taxLine:["ضريبة الدخل","Income tax"],
});
["leaves"].forEach(c=>{ if(!COLS.includes(c)) COLS.push(c); S[c] = S[c] || []; });

const ssEmpRate = () => { const s = (COMPANY&&COMPANY.settings)||{}; return (s.ssEmp===undefined||s.ssEmp===""||s.ssEmp===null ? 7.5 : Math.max(0,Math.min(30,Number(s.ssEmp)||0)))/100; };
const ssErRate = () => { const s = (COMPANY&&COMPANY.settings)||{}; return (s.ssEr===undefined||s.ssEr===""||s.ssEr===null ? 14.25 : Math.max(0,Math.min(40,Number(s.ssEr)||0)))/100; };
const ssCap = () => { const s = (COMPANY&&COMPANY.settings)||{}; return num(s.ssCap) || 3733; };
/* Jordan personal income tax, yearly (5/10/15/20/25%, 30% above 1M) */
function jordanTaxYear(annual, family){
  let x = Math.max(0, annual - 9000 - (family?9000:0)), tax = 0;
  const br = [[5000,.05],[5000,.10],[5000,.15],[5000,.20],[980000,.25],[Infinity,.30]];
  for(const [w,r] of br){ const p = Math.min(x, w); tax += p*r; x -= p; if(x<=0) break; }
  return r2(tax);
}
const monthlyWage = s => s.rateType==="month" ? num(s.rate) : s.rateType==="week" ? num(s.rate)*52/12 : num(s.rate)*workDaysMonth(today());
/* paid leave days inside a range (weekends don't count) */
function leaveDays(sid, a, b, paidOnly=true){
  let n = 0;
  S.leaves.filter(l=>l.staffId===sid && (!paidOnly || l.type!=="unpaid")).forEach(l=>{ for(let d=l.from; d<=l.to; d=addDays(d,1)){ if(inRange(d,a,b) && !isOff(d) && !attOf(sid,d)) n++; if(d>="9999") break; } });
  return n;
}
function annualLeaveLeft(s){
  const y = today().slice(0,4), tot = s.startDate && (parseD(today())-parseD(s.startDate))/(365.25*864e5) >= 5 ? 21 : 14;
  let used = 0; S.leaves.filter(l=>l.staffId===s.id && l.type==="annual").forEach(l=>{ for(let d=l.from; d<=l.to; d=addDays(d,1)){ if(d.startsWith(y) && !isOff(d)) used++; } });
  return {y, tot, used, left:tot-used};
}
/* extra payroll lines on top of the existing staff account */
function payrollExtra(s, a, b, k){
  return {lv:k.lvN, lvPay:k.lvPay, gross:r2(k.earned), ssE:k.ssE, ssR:k.ssR, tax:k.tax, net:r2(k.earned-k.ssE-k.tax), left:r2(k.remaining)};
}

/* ----- forms ----- */
function leaveForm(sid){
  const ss = S.staff.filter(x=>x.active!==false).sort((a,b)=>String(a.name).localeCompare(String(b.name))); if(!ss.length){ toast(tv("noTeam")); return; }
  const s0 = staffById(sid) || ss[0], lb = annualLeaveLeft(s0);
  openSheet({title:t("hrLeaveNew"), saveLabel:t("record"),
    fields:[{name:"staffId",label:t("hrWho"),type:"select",options:ss.map(x=>[x.id,x.name]),value:s0.id},
      {name:"type",label:t("hrLeaveType"),type:"chips",options:[["annual",t("lvAnnual")],["sick",t("lvSick")],["unpaid",t("lvUnpaid")]],value:"annual",hint:t("hrLeaveBal",{y:lb.y,n:`<span class="num">${lb.left}</span>`,t:`<span class="num">${lb.tot}</span>`})},
      {name:"from",label:t("hrFrom"),type:"date",value:today()},{name:"to",label:t("hrTo"),type:"date",value:today()}],
    more:[{name:"note",label:t("note"),value:"",max:120}],
    submit: async v=>{ if(!validDate(v.from)||!validDate(v.to)||v.to<v.from || (parseD(v.to)-parseD(v.from))/864e5>120){ toast(t("eLeaveDates")); return false; }
      return save("leaves", null, {staffId:v.staffId, type:["annual","sick","unpaid"].includes(v.type)?v.type:"annual", from:v.from, to:v.to, note:(v.note||"").slice(0,120), createdAt:Date.now()}); }});
}
function payslipHtml(s, a, b){
  const k = account(s, a, b), x = payrollExtra(s, a, b, k), u = unitById(s.unitId);
  const row = (l, v, neg) => `<tr><td>${l}</td><td>${neg?"− ":""}${moneyTxt(v)}</td></tr>`;
  return `<div class="doc"><div class="doc-head"><div><h1>${esc(COMPANY.name||"")}</h1>${ST().taxNo?`<div>${t("taxNoL")}: ${esc(ST().taxNo)}</div>`:""}</div><div class="doc-t"><h2>${t("hrPayslip")}</h2><div>${esc(a)} → ${esc(b)}</div></div></div>
    <div class="doc-to"><b>${esc(s.name)}</b>${s.role?` · ${esc(s.role)}`:""}${u?` · ${esc(u.name)}`:""}${s.ssNo?` · ${t("hrSSNo")}: ${esc(s.ssNo)}`:""}</div>
    <table class="doc-sum wide">${row(`${t("hrBase")} (${k.days} ${t("daysW")})`, k.base)}${k.ot?row(t("otLine",{x:hrsTxt(k.otH)}).replace(/<[^>]+>/g,""), k.ot):""}${x.lvPay?row(`${t("hrLeavePay")} (${x.lv})`, x.lvPay):""}
      <tr class="g"><td>${t("hrGross")}</td><td>${moneyTxt(x.gross)}</td></tr>
      ${x.ssE?row(t("hrSSEmp"), x.ssE, true):""}${x.tax?row(t("hrIncTax"), x.tax, true):""}
      <tr class="g"><td>${t("hrNet")}</td><td>${moneyTxt(x.net)}</td></tr>
      ${k.adv?row(t("hrAdv"), k.adv, true):""}${k.paid?row(t("hrPaidAlready"), k.paid, true):""}
      <tr class="g"><td>${t("hrLeft")}</td><td>${moneyTxt(Math.max(0,x.left))}</td></tr>
      ${x.ssR?`<tr><td><small>${t("hrSSEr")}</small></td><td><small>${moneyTxt(x.ssR)}</small></td></tr>`:""}</table>
    <div class="doc-foot"><small>${t("madeWith")} · daftarapp.co</small></div></div>`;
}
function ssSheetHtml(a, b){
  const ss = S.staff.filter(x=>x.ss).map(s=>{ const k = account(s,a,b), x = payrollExtra(s,a,b,k); return {s, w:x.gross, e:x.ssE, r:x.ssR}; });
  return `<div class="doc"><div class="doc-head"><div><h1>${esc(COMPANY.name||"")}</h1></div><div class="doc-t"><h2>${t("hrSSSheet")}</h2><div>${esc(a)} → ${esc(b)}</div></div></div>
    <table class="doc-tb"><thead><tr><th>#</th><th>${t("hrWho")}</th><th>${t("hrSSNo")}</th><th>${t("hrWage")}</th><th>${t("hrSSEmp")}</th><th>${t("hrSSEr")}</th><th>${t("glTotal")}</th></tr></thead>
    <tbody>${ss.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.s.name)}</td><td>${esc(x.s.ssNo||"")}</td><td>${fmt(x.w)}</td><td>${fmt(x.e)}</td><td>${fmt(x.r)}</td><td>${fmt(x.e+x.r)}</td></tr>`).join("")}</tbody></table>
    <table class="doc-sum"><tr class="g"><td>${t("hrSSTotal")}</td><td>${moneyTxt(sum(ss,x=>x.e+x.r))}</td></tr></table><div class="doc-foot"><small>${t("madeWith")} · daftarapp.co</small></div></div>`;
}

Object.assign(A, {
  leave: id => { closeSheet(); leaveForm(id); },
  payslip: id => { const s = staffById(id); if(s) printDoc(payslipHtml(s, S.pstart, periodEnd())); },
  ssSheet: () => { const a = S.period==="month" ? S.pstart : monthStartOf(S.pstart); printDoc(ssSheetHtml(a, monthEnd(a))); },
  taxEst: () => { const r = num((document.getElementById("f_rate")||{}).value), tp = (document.querySelector('#sheetBody [name="rateType"]:checked')||{}).value||"month";
    const fam = (document.querySelector('#sheetBody [name="family"]:checked')||{}).value==="1";
    const m = tp==="month" ? r : tp==="week" ? r*52/12 : r*workDaysMonth(today()); const el = document.getElementById("f_taxMonthly"); if(el) el.value = String(r2(jordanTaxYear(m*12, fam)/12)); },
});
/* =====================================================================
   Point of sale (cashier screen), team roles & permissions,
   activity log, full Excel workbook export.
   ===================================================================== */
Object.assign(L, {
  pos:["نقطة بيع","Point of sale"], posSub:["كاشير سريع للمحل","Quick cashier for the shop"], posCart:["السلة","Cart"], posEmpty:["اضغط على صنف ليضاف","Tap an item to add it"],
  posPay:["ادفع {x}","Charge {x}"], posWalkIn:["زبون نقدي","Walk-in customer"], posDone:["تمّ البيع · {n}","Sale done · {n}"], posReceipt:["اطبع الإيصال","Print receipt"],
  posNew:["بيع جديد","New sale"], posSearch:["ابحث عن صنف…","Search items…"], posNoItems:["ضيف أصناف بأسعار من المخزون أو الفواتير أول.","Add items with prices from Stock or Invoices first."],
  posChange:["الباقي للزبون","Change"], posGiven:["المبلغ المستلم","Cash given"], posCustomer:["الزبون","Customer"],
  // roles
  roleManager:["مدير (كل شي)","Manager (everything)"], roleAccountant:["محاسب","Accountant"], roleCashier:["كاشير","Cashier"], roleViewer:["مشاهدة بس","View only"],
  roleMemberL:["عضو (كل شي)","Member (everything)"], roleHint:["المدير والمحاسب بيقدروا يعدّلوا كل الحسابات. الكاشير بيعمل فواتير بيع وقبض بس. المشاهدة بتشوف بدون ما تعدّل.","Managers and accountants can edit everything. A cashier only makes sales and receipts. View-only can look but not change."],
  pickRole:["شو صلاحيته؟","What can they do?"], roleSaved:["تغيّرت الصلاحية","Role changed"], noPerm:["صلاحيتك ما بتسمح بهاد","Your role doesn't allow this"],
  activity:["سجل النشاط","Activity log"], actIns:["أضاف","added"], actUpd:["عدّل","edited"], actDel:["حذف","deleted"], noActivity:["ما في نشاط لسا.","No activity yet."],
  exportXls:["صدّر كل شي Excel (شيت لكل قسم)","Export everything to Excel (one sheet per section)"],
  colNames:["{}",""],
});

/* ----- point of sale ----- */
let POS = null;
function walkInId(){ const p = S.parties.find(x=>x.walkIn); return p ? p.id : null; }
async function ensureWalkIn(){ let id = walkInId(); if(id) return id; id = newId(); return (await save("parties", id, {name:t("posWalkIn"), kind:"customer", walkIn:true, openBal:0, createdAt:Date.now()}, true)) ? id : null; }
function posOpen(){
  const items = S.items.filter(i=>num(i.price)>0);
  if(!items.length){ toast(t("posNoItems")); return; }
  POS = POS && POS.lines.length ? POS : {lines:[], q:"", partyId:""};
  posRender();
}
function posRender(){
  const q = (POS.q||"").toLowerCase(), items = S.items.filter(i=>num(i.price)>0 && (!q || String(i.name).toLowerCase().includes(q) || String(i.sku||"").toLowerCase()===q)).sort((a,b)=>String(a.name).localeCompare(String(b.name))).slice(0,60);
  const c = invCalc({lines:POS.lines, incTax:ST().incTax});
  const custs = partyOptions("sale", POS.partyId).filter(([id])=>!(partyById(id)||{}).walkIn);
  openSheet({title:t("pos"), noSave:true, html:`
    <input type="search" id="posq" class="whoq" placeholder="${esc(t("posSearch"))}" value="${esc(POS.q||"")}" autocomplete="off">
    <div class="posgrid">${items.map(i=>{ const n = stocked(i) ? qtyOf(i.id) : null; return `<button type="button" class="postile" data-act="posAdd" data-id="${esc(i.id)}"><b>${esc(i.name)}</b><span>${money(num(i.price))}</span>${n!==null?`<small class="${n<=0?"negv":""}">${t("onHand")}: ${fmt(n)}${i.unit?" "+esc(i.unit):""}</small>`:""}</button>`; }).join("")}</div>
    <span class="label">${t("posCart")}</span>
    <div class="list">${POS.lines.length ? POS.lines.map((l,i)=>`<div class="row static"><div class="m"><b>${esc(l.name)}</b><span class="sub">${money(num(l.price))}</span></div>
      <div class="qty"><button type="button" class="iconbtn sm" data-act="posQty" data-id="${i}" data-d="-1" aria-label="-">${icon("minus")}</button><b class="num">${fmt(l.qty)}</b><button type="button" class="iconbtn sm" data-act="posQty" data-id="${i}" data-d="1" aria-label="+">${icon("plus")}</button></div></div>`).join("") : `<span class="hint">${t("posEmpty")}</span>`}</div>
    ${custs.length?`<div class="field"><label for="posCust">${t("posCustomer")}</label><select id="posCust"><option value="">${esc(t("posWalkIn"))}</option>${custs.map(([v,l])=>`<option value="${esc(v)}" ${v===POS.partyId?"selected":""}>${esc(l)}</option>`).join("")}</select></div>`:""}
    <div class="kv"><div><span>${t("taxTotal")}</span><b>${money(c.tax)}</b></div></div><div class="total"><span class="label">${t("grandTotal")}</span><b>${money(c.total)}</b></div>
    <div class="field"><label for="posGiven">${t("posGiven")}</label><input id="posGiven" inputmode="decimal" placeholder="${fmt(c.total)}"><span class="hint" id="posChange"></span></div>
    ${POS.lines.length?`<div class="grid2"><button type="button" class="btn primary big" data-act="posPay" data-id="cash">${icon("wallet")}${t("cash")} · ${fmt(c.total)}</button><button type="button" class="btn big" data-act="posPay" data-id="card">${t("card")}</button><button type="button" class="btn" data-act="posPay" data-id="transfer">${t("transfer")}</button><button type="button" class="btn ghost" data-act="posClear">${t("posNew")}</button></div>`:""}`});
  const qi = document.getElementById("posq"); if(qi && POS.focusQ){ qi.focus(); try{ qi.setSelectionRange(qi.value.length, qi.value.length); }catch(_){} }
}
async function posPay(method, el){
  if(!POS || !POS.lines.length) return; if(el) el.disabled = true;
  const pid = POS.partyId || await ensureWalkIn(); if(!pid){ if(el) el.disabled = false; return; }
  const data = {type:"sale", no:nextNo("invoices","S"), partyId:pid, date:today(), dueDate:today(), lines:POS.lines.map(l=>({name:l.name, itemId:l.itemId, qty:l.qty, price:l.price, tax:l.tax, disc:0})), incTax:ST().incTax, discount:0, notes:"", pos:true, createdAt:Date.now()};
  data.total = invCalc(data).total; const id = newId();
  if(!await save("invoices", id, data, true)){ if(el) el.disabled = false; return; }
  await saveVoucher({type:"receipt", partyId:pid, amount:data.total, date:data.date, invoiceId:id, method}, true);
  stockWarn(data); POS = {lines:[], q:"", partyId:""}; render();
  openSheet({title:t("posDone",{n:data.no}), noSave:true, html:`<div class="owe">${MARK}<span class="label">${t("grandTotal")}</span><b>${money(data.total)}</b></div>
    <div class="grid2"><button type="button" class="btn" data-act="posPrint" data-id="${esc(id)}">${icon("file")}${t("posReceipt")}</button><button type="button" class="btn primary" data-act="pos">${icon("plus")}${t("posNew")}</button></div>`});
}
function receiptHtml(x){
  const c = invCalc(x);
  return `<div class="doc rcpt"><h1>${esc(COMPANY.name||"")}</h1>${ST().taxNo?`<div>${t("taxNoL")}: ${esc(ST().taxNo)}</div>`:""}<div>${esc(x.no)} · ${esc(x.date)}</div><hr>
    ${c.rows.map(l=>`<div class="rl"><span>${esc(l.name)} × ${fmt(num(l.qty))}</span><span>${fmt(l.netA+l.taxA)}</span></div>`).join("")}<hr>
    <div class="rl"><span>${t("taxTotal")}</span><span>${fmt(c.tax)}</span></div><div class="rl g"><span>${t("grandTotal")}</span><span>${moneyTxt(c.total)}</span></div><hr><div>${esc(ST().invFoot||t("thanksInv"))}</div><small>daftarapp.co</small></div>`;
}

/* ----- roles: what each person may change (the database enforces the same rules) ----- */
const CASHIER_COLS = ["invoices","vouchers","parties","items","cheques"];
const canWrite = col => !ROLE || ROLE==="owner" || ROLE==="member" || ROLE==="manager" || ROLE==="accountant" || (ROLE==="cashier" && CASHIER_COLS.includes(col));
const canDelete = col => !ROLE || ["owner","member","manager","accountant"].includes(ROLE);
const ROLE_L = {owner:"roleOwner", member:"roleMemberL", manager:"roleManager", accountant:"roleAccountant", cashier:"roleCashier", viewer:"roleViewer"};
const _save0 = save, _remove0 = remove;
save = async function(col,id,data,quiet){ if(!canWrite(col)){ toast(t("noPerm")); return false; } return _save0(col,id,data,quiet); };
remove = async function(col,id){ if(!canDelete(col)){ toast(t("noPerm")); return false; } return _remove0(col,id); };
async function setRole(uid, role){
  const { error } = window.DEMO_TEAM ? {error:null} : await sb.rpc("set_member_role", {p_user:uid, p_role:role});
  if(error){ toast(t("eGeneric")); return; } toast(t("roleSaved")); teamSheet();
}
async function activitySheet(){
  openSheet({title:t("activity"), noSave:true, html:`<div id="actBox"><span class="hint">${t("loading")}</span></div>`});
  const { data, error } = window.DEMO_TEAM ? {data:[], error:null} : await sb.rpc("company_activity", {p_limit:200});
  const box = document.getElementById("actBox"); if(!box) return;
  if(error){ box.innerHTML = `<span class="hint">${t("eGeneric")}</span>`; return; }
  const rows = Array.isArray(data) ? data : [];
  box.innerHTML = rows.length ? `<div class="list">${rows.map(r=>`<div class="row static"><div class="m"><b>${esc(r.email||"")}</b><span class="sub">${t(r.op==="INSERT"?"actIns":r.op==="DELETE"?"actDel":"actUpd")} · ${esc(r.col)} · <span class="ltr">${esc(String(r.at||"").slice(0,16).replace("T"," "))}</span></span></div></div>`).join("")}</div>` : `<span class="hint">${t("noActivity")}</span>`;
}

/* ----- one Excel workbook with a sheet per section (SpreadsheetML: opens in Excel, no library needed) ----- */
function exportWorkbook(){
  const x = v => String(v??"").replace(/[<>&"]/g, c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c]));
  const sheet = (name, rows) => `<Worksheet ss:Name="${x(name).slice(0,31)}"><Table>${rows.map((r,i)=>`<Row>${r.map(v=>typeof v==="number"&&isFinite(v)?`<Cell${i?"":' ss:StyleID="h"'}><Data ss:Type="Number">${r2(v)}</Data></Cell>`:`<Cell${i?"":' ss:StyleID="h"'}><Data ss:Type="String">${x(v)}</Data></Cell>`).join("")}</Row>`).join("")}</Table></Worksheet>`;
  const pn = id => (partyById(id)||{}).name||"", un = id => (unitById(id)||{}).name||"";
  const sh = [];
  sh.push(sheet(t("bkInv"), [[t("invNoS"),t("date"),"",t("pName"),t("subTotal"),t("taxTotal"),t("grandTotal"),t("paidL"),t("remainingL")], ...S.invoices.filter(i=>!i.void).map(i=>{ const c = invCalc(i), p = invPaid(i); return [i.no, i.date, t(INV_T[i.type]), pn(i.partyId), c.net, c.tax, c.total, p, r2(c.total-p)]; })]));
  sh.push(sheet(t("bkParties"), [[t("pName"),t("pKind"),t("pPhone"),t("pTaxNo"),t("stBal")], ...S.parties.filter(p=>!p.archived).map(p=>[p.name, t(p.kind==="supplier"?"pSupplier":p.kind==="both"?"pBoth":"pCustomer"), p.phone||"", p.taxNo||"", partyBal(p.id)])]));
  sh.push(sheet(t("bkStock"), [[t("itemName"),t("itemSku"),t("onHand"),t("avgCost"),t("stValue"),t("itemPrice")], ...S.items.map(i=>[i.name, i.sku||"", stocked(i)?qtyOf(i.id):"", avgCostOf(i.id), stocked(i)?r2(qtyOf(i.id)*avgCostOf(i.id)):"", num(i.price)])]));
  sh.push(sheet(t("vReceipt")+" / "+t("vPayment"), [[t("invNoS"),t("date"),"",t("pName"),t("vAmount"),t("vMethod")], ...S.vouchers.map(v=>[v.no, v.date, t(v.type==="receipt"?"vReceipt":"vPayment")+(v.void?" ("+t("chBounced")+")":""), pn(v.partyId), num(v.amount), t(v.method||"cash")])]));
  sh.push(sheet(t("bkCheques"), [[t("chNo"),t("chBank"),t("chDue"),t("pName"),t("vAmount"),t("status")], ...S.cheques.map(c=>[c.no, c.bank||"", c.dueDate, pn(c.partyId), num(c.amount), t(CH_ST[c.status]||"chPending")])]));
  sh.push(sheet(t("expenses"), [[t("date"),t("onWhat"),t("desc"),tv("forUnit"),t("vAmount")], ...S.expenses.map(e=>[e.date, catLabel(e.category), e.item||"", un(e.unitId), num(e.amount)])]));
  sh.push(sheet(t("income"), [[t("date"),t("fromWhat"),t("note"),tv("forUnit"),t("vAmount")], ...S.income.map(e=>[e.date, catLabel(e.category), e.note||"", un(e.unitId), num(e.amount)])]));
  const a = monthStartOf(today()), b = monthEnd(a);
  sh.push(sheet(t("salaries"), [[t("hrWho"),t("hrGross"),t("hrSSEmp"),t("hrIncTax"),t("hrAdv"),t("hrPaidAlready"),t("hrLeft")], ...S.staff.filter(s=>s.active!==false).map(s=>{ const k = account(s,a,b); return [s.name, k.earned, k.ssE, k.tax, k.adv, k.paid, k.remaining]; })]));
  const B = balances(null, today()), C = chart();
  sh.push(sheet(t("glTB"), [[t("glCode"),t("glAcc"),t("glDebit"),t("glCredit"),t("glBal")], ...[...C.keys()].sort().filter(k=>B[k].dr||B[k].cr).map(k=>[k, B[k].acc.name, B[k].dr, B[k].cr, B[k].net])]));
  const xml = `<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="h"><Font ss:Bold="1"/></Style></Styles>${sh.join("")}</Workbook>`;
  const el = document.createElement("a"); el.href = URL.createObjectURL(new Blob([xml],{type:"application/vnd.ms-excel"})); el.download = `daftar-${today()}.xls`; el.click(); setTimeout(()=>URL.revokeObjectURL(el.href), 4000);
}

Object.assign(A, {
  pos: () => { closeSheet(); posOpen(); },
  posAdd: id => { const i = S.items.find(x=>x.id===id); if(!i) return; const l = POS.lines.find(x=>x.itemId===id); if(l) l.qty += 1; else POS.lines.push({itemId:i.id, name:i.name, qty:1, price:num(i.price), tax:num(i.tax ?? taxRate())}); POS.focusQ = false; posRender(); },
  posQty: (id, el) => { const l = POS.lines[Number(id)]; if(!l) return; l.qty += Number(el.dataset.d); if(l.qty<=0) POS.lines.splice(Number(id),1); posRender(); },
  posClear: () => { POS = {lines:[], q:"", partyId:""}; posRender(); },
  posPay: (id, el) => posPay(id, el),
  posPrint: id => { const x = invById(id); if(x){ closeSheet(); printDoc(receiptHtml(x)); } },
  setRole: (id, el) => setRole(id, el.dataset.r), activity: () => { closeSheet(); activitySheet(); },
  exportXls: () => { closeSheet(); exportWorkbook(); },
});
document.addEventListener("input", e=>{
  if(e.target.id==="posq" && POS){ POS.q = e.target.value; POS.focusQ = true; posRender(); }
  if(e.target.id==="posGiven" && POS){ const c = invCalc({lines:POS.lines, incTax:ST().incTax}), g = num(e.target.value), el = document.getElementById("posChange"); if(el) el.innerHTML = g>c.total ? `${t("posChange")}: <b>${money(g-c.total)}</b>` : ""; }
});
document.addEventListener("change", e=>{ if(e.target.id==="posCust" && POS){ POS.partyId = e.target.value; } });
/* =====================================================================
   Cash radar: day-by-day cash forecast from what is already in Daftar.
   Inflows: received cheques, unpaid sales invoices, usual daily income.
   Outflows: issued cheques, unpaid bills, wages (by pay period), social
   security (15th of next month), income tax withheld, sales tax (2-month
   periods, 30 days after), usual daily expenses.
   Two lines: "expected" (everything) and "safe" (only sure money).
   ===================================================================== */
Object.assign(L, {
  bkRadar:["السيولة","Cash radar"], rdTitle:["رادار السيولة","Cash radar"],
  rdSub:["هل رح يكفي معك مصاري؟ دفتر بيحسبها من الشيكات والفواتير والرواتب والضمان والضريبة.","Will your cash last? Worked out from cheques, invoices, wages, social security and tax."],
  rdNow:["معك هلأ (كاش وبنك)","Cash & bank now"], rdIn:["داخل","Coming in"], rdOut:["طالع","Going out"], rdLow:["أقل رصيد","Lowest point"],
  rdDays:["{n} يوم","{n} days"], rdFix:["صحّح","Correct"], rdFixT:["قدّيش معك فعلياً اليوم؟","How much do you actually have today?"],
  rdFixHint:["اجمع الكاش اللي معك ورصيد البنك. دفتر بيكمّل من هون وبيضيف كل حركة بعد اليوم.","Add your cash and bank balance. Daftar continues from here and adds every move after today."],
  rdMin:["أقل رصيد بدك تضل فوقه","Minimum balance to keep"], rdMinHint:["إذا الرصيد المتوقع نزل تحته بنبّهك.","You'll be warned if the forecast drops below it."],
  rdAvg:["احسب المصاريف والمداخيل المعتادة","Include usual daily income & expenses"], rdSettings:["إعدادات الرادار","Radar settings"],
  rdGood:["وضعك منيح. الرصيد ما بينزل تحت {m} خلال {n} يوم.","You're fine. Cash stays above {m} for the next {n} days."],
  rdWarn:["انتبه: إذا ما حصّلت فلوسك من الزباين، رصيدك بينزل لـ {x} بتاريخ {d}.","Careful: if customers don't pay, cash drops to {x} on {d}."],
  rdBad:["رح ينقصك {x} بتاريخ {d}.","You'll be short {x} on {d}."],
  rdExpected:["المتوقع","Expected"], rdSafe:["لو ما حصّلت من الزباين","If customers don't pay"],
  rdFix1:["كيف بتمرق؟","How to get through"], rdCollect:["حصّل من {x}","Collect from {x}"], rdCollectS:["عليه {a}","Owes {a}"],
  rdDeposit:["أودع الشيكات المستحقة ({n})","Deposit cheques already due ({n})"], rdPostpone:["اطلب تأجيل فاتورة {x}","Ask to postpone {x}'s bill"],
  rdPostS:["{a} · مستحقة {d}","{a} · due {d}"], rdCovered:["هيك بتغطي النقص.","That covers the gap."], rdNotCovered:["حتى مع هيك بيضل ناقص {x}. فكّر بتمويل أو تأجيل دفعات.","Still {x} short. Consider financing or delaying payments."],
  rdNext:["الجاي","Coming up"], rdNone:["ما في حركات مستحقة بهالفترة.","Nothing due in this period."],
  rdEmpty:["سجّل شيكاتك وفواتيرك ورواتب الشغيلة، ودفتر بيرسملك وين رايحة مصاريك بالأيام الجاية.","Record your cheques, invoices and team, and Daftar shows where your cash is heading."],
  evChIn:["شيك من {x}","Cheque from {x}"], evChOut:["شيك لـ {x}","Cheque to {x}"], evInv:["فاتورة {n} · {x}","Invoice {n} · {x}"], evInvLate:["فاتورة متأخرة {n} · {x}","Overdue invoice {n} · {x}"],
  evBill:["فاتورة مورّد {n} · {x}","Bill {n} · {x}"], evWages:["رواتب الشغيلة","Wages"], evSS:["اشتراكات الضمان عن {m}","Social security for {m}"],
  evTax:["ضريبة الدخل المقتطعة عن {m}","Income tax withheld for {m}"], evVat:["ضريبة المبيعات عن {m}","Sales tax for {m}"], evAvg:["المصاريف والمداخيل المعتادة","Usual daily income & expenses"],
  rdHome:["السيولة لـ {n} يوم","Cash for {n} days"], rdHomeLow:["أقل رصيد {x} بتاريخ {d}","Lowest {x} on {d}"], rdOpen:["افتح الرادار","Open radar"],
  aRadar:["رادار السيولة: رح ينقصك {x} بتاريخ {d}","Cash radar: {x} short on {d}"],
});
ICON.radar = '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><path d="M12 12 18.5 5.5"/><circle cx="12" cy="12" r="1.2"/>';

const rdSet = () => { const s = (COMPANY&&COMPANY.settings)||{}; return {min:num(s.cashMin)||0, now:s.cashNow&&validDate(s.cashNow.date)?s.cashNow:null, avg:s.radarAvg!==false}; };
const isCashAcc = a => /^1[12]/.test(String(a));
const ymOf = d => d.slice(0,7);
const mName = d => `${MONTHS[LANG][parseD(d).getMonth()]} ${d.slice(0,4)}`;

/* cash + bank on a date, from the ledger, shifted by the owner's correction if there is one */
function cashOn(J, d){ let s = 0; J.forEach(e=>{ if(e.date<=d) e.lines.forEach(l=>{ if(isCashAcc(l.acc)) s += l.dr-l.cr; }); }); return s; }
function cashNow(J){
  const led = cashOn(J, today()), c = rdSet().now;
  if(c && c.date<=today()) return r2(num(c.amount) + led - (c.base!==undefined ? num(c.base) : cashOn(J, c.date)));
  return r2(led);
}

/* every expected movement in the next H days */
function radarEvents(H, J){
  const t0 = today(), end = addDays(t0, H), ev = [];
  const push = (date, amt, kind, label, sure, act, id) => { if(Math.abs(amt)<0.005) return; const d = date<t0 ? t0 : date; if(d<=end) ev.push({date:d, amt:r2(amt), kind, label, sure, act, id}); };
  const pn = id => (partyById(id)||{}).name || "";
  // cheques not yet cleared
  S.cheques.forEach(c=>{
    if(c.dir==="in" && (c.status==="pending"||c.status==="deposited")) push(c.dueDate||t0, num(c.amount), "chIn", t("evChIn",{x:pn(c.partyId)}), true, "viewCheque", c.id);
    if(c.dir==="out" && (c.status==="pending"||c.status==="handed")) push(c.dueDate||t0, -num(c.amount), "chOut", t("evChOut",{x:pn(c.partyId)}), true, "viewCheque", c.id);
  });
  // unpaid invoices (money already promised by a cheque is counted above, through its voucher)
  liveInv().forEach(x=>{
    if(x.type!=="sale" && x.type!=="purchase") return;
    const left = r2(invCalc(x).total - invPaid(x)); if(left<=0.005) return;
    const due = x.dueDate || x.date || t0;
    if(x.type==="sale"){ const late = due<t0; push(late ? addDays(t0,7) : due, left, "inv", t(late?"evInvLate":"evInv",{n:x.no||"",x:pn(x.partyId)}), false, "viewInv", x.id); }
    else push(due, -left, "bill", t("evBill",{n:x.supNo||x.no||"",x:pn(x.partyId)}), true, "viewInv", x.id);
  });
  // wages, social security and income tax: what is owed now + what the team will earn
  const team = S.staff.filter(s=>s.active!==false && num(s.rate)>0);
  if(team.length){
    const ssOn = typeof ssEmpRate==="function", ee = ssOn?ssEmpRate():0, er = ssOn?ssErRate():0;
    const ps = periodStartFor(t0), pe0 = S.period==="month" ? monthEnd(ps) : addDays(ps,6);
    let owed = sum(team, s=>Math.max(0, account(s, ps, t0).remaining));
    const ssM = {}, taxM = {};
    // what was already earned this month and last month (for SS / tax due dates)
    const lm = addMonths(monthStartOf(t0), -1);
    J.forEach(e=>{ if(e.date>=lm && e.date<=t0) e.lines.forEach(l=>{ const m = ymOf(e.date); if(l.acc==="25") ssM[m] = (ssM[m]||0) + l.cr - l.dr; if(l.acc==="26") taxM[m] = (taxM[m]||0) + l.cr - l.dr; }); });
    // pay periods inside the horizon
    let pEnd = pe0, acc = owed, d = addDays(t0,1);
    const accrue = day => { let net = 0; team.forEach(s=>{ if(isOff(day)) return; const w = dayRate(s, day), e1 = s.ss ? w*ee : 0, tx = num(s.taxMonthly) ? num(s.taxMonthly)/workDaysMonth(day) : 0;
      net += w - e1 - tx; const m = ymOf(day); if(s.ss) ssM[m] = (ssM[m]||0) + w*(ee+er); if(tx) taxM[m] = (taxM[m]||0) + tx; }); return net; };
    while(pEnd<=end){
      for(; d<=pEnd; d=addDays(d,1)) acc += accrue(d);
      push(pEnd, -acc, "wages", t("evWages"), true, "go", "team");
      acc = 0; pEnd = S.period==="month" ? monthEnd(addMonths(pEnd,1)) : addDays(pEnd,7);
    }
    for(; d<=end; d=addDays(d,1)) accrue(d);   // keeps SS / tax months complete
    Object.keys(ssM).forEach(m=>{ const due = `${addMonths(m+"-01",1).slice(0,7)}-15`; if(due>=t0) push(due, -ssM[m], "ss", t("evSS",{m:mName(m+"-01")}), true); });
    Object.keys(taxM).forEach(m=>{ const due = monthEnd(addMonths(m+"-01",1)); if(due>=t0) push(due, -taxM[m], "tax", t("evTax",{m:mName(m+"-01")}), true); });
  }
  // sales tax: 2-month periods (Jan–Feb, Mar–Apr…), paid within 30 days after the period ends
  const taxed = liveInv().filter(x=>x.type!=="quote");
  if(taxed.some(x=>invCalc(x).tax>0)){
    const y = Number(t0.slice(0,4)), m0 = parseD(t0).getMonth();
    const startCur = iso(new Date(y, m0 - (m0%2), 1));
    [addMonths(startCur,-2), startCur, addMonths(startCur,2)].forEach(a=>{
      const b = monthEnd(addMonths(a,1)), due = addDays(b,30); if(due<t0 || a>t0) return;
      let out = 0; taxed.filter(x=>x.date>=a && x.date<=b).forEach(x=>{ const tx = invCalc(x).tax; out += x.type==="sale" ? tx : x.type==="saleReturn" ? -tx : x.type==="purchase" ? -tx : tx; });
      if(out>0.005) push(due, -out, "vat", t("evVat",{m:`${mName(a)} – ${mName(b)}`}), true);
    });
  }
  // usual daily income & expenses (last 60 days), if there is enough history
  if(rdSet().avg){
    const a = addDays(t0,-60), exps = S.expenses.filter(x=>x.date>=a && x.date<=t0), incs = S.income.filter(x=>x.date>=a && x.date<=t0);
    const first = [...exps, ...incs].map(x=>x.date).sort()[0];
    const span = first ? Math.round((parseD(t0)-parseD(first))/864e5)+1 : 0;
    if(span>=14){
      // only steady flows count: lumpy money (a contractor's progress payment) isn't a daily habit
      const steady = arr => new Set(arr.map(x=>x.date)).size >= 8;
      const ex = steady(exps) ? sum(exps, x=>num(x.amount))/span : 0, ic = steady(incs) ? sum(incs, x=>num(x.amount)-commOf(x))/span : 0;
      for(let d=addDays(t0,1); d<=end; d=addDays(d,1)){ if(ex) push(d, -ex, "avgOut", t("evAvg"), true); if(ic) push(d, ic, "avgIn", t("evAvg"), false); }
    }
  }
  return ev.sort((x,y)=>x.date.localeCompare(y.date) || x.amt-y.amt);
}

/* the forecast: start balance, two running lines, lowest points */
function radar(H=30){
  const J = journal(), start = cashNow(J), ev = radarEvents(H, J), t0 = today();
  const days = []; let e = start, s = start, i = 0;
  for(let n=0; n<=H; n++){ const d = addDays(t0,n);
    while(i<ev.length && ev[i].date===d){ e += ev[i].amt; if(ev[i].sure) s += ev[i].amt; i++; }
    days.push({d, e:r2(e), s:r2(s)}); }
  const lowE = days.reduce((m,x)=>x.e<m.e?x:m, days[0]), lowS = days.reduce((m,x)=>x.s<m.s?x:m, days[0]);
  const inn = sum(ev.filter(x=>x.amt>0), x=>x.amt), out = -sum(ev.filter(x=>x.amt<0), x=>x.amt);
  const min = rdSet().min, firstBadE = days.find(x=>x.e<min-0.005), firstBadS = days.find(x=>x.s<min-0.005);
  const state = firstBadE ? "bad" : firstBadS ? "warn" : "good";
  return {H, start, ev, days, lowE, lowS, inn:r2(inn), out:r2(out), min, state, firstBadE, firstBadS};
}
const radarHasData = () => S.cheques.length || S.invoices.length || S.staff.some(s=>s.active!==false && num(s.rate)>0) || S.expenses.length || S.income.length;

/* ways to get through a shortfall */
function radarFixes(R){
  const low = R.state==="bad" ? R.lowE : R.lowS, gap = r2(R.min - low.s);   // plan for the safe line
  if(gap<=0.005) return null;
  const out = []; let cover = 0;
  // cheques already due but still in the drawer
  const drawer = S.cheques.filter(c=>c.dir==="in" && c.status==="pending" && (c.dueDate||"")<=today());
  if(drawer.length){ const a = sum(drawer,c=>num(c.amount)); out.push({ic:"bank", b:t("rdDeposit",{n:`<span class="num">${drawer.length}</span>`}), s:money(a), act:"btab", id:"cheques"}); }
  // biggest balances owed to us
  S.parties.filter(p=>!p.archived).map(p=>({p, b:partyBal(p.id)})).filter(x=>x.b>0.005).sort((a,b)=>b.b-a.b).slice(0,6).forEach(x=>{
    if(cover>=gap) return; cover += x.b; out.push({ic:"wallet", b:t("rdCollect",{x:esc(x.p.name)}), s:t("rdCollectS",{a:money(x.b)}), act:"viewParty", id:x.p.id}); });
  // supplier bills due before the low point
  R.ev.filter(x=>x.kind==="bill" && x.date<=low.d).sort((a,b)=>a.amt-b.amt).slice(0,3).forEach(x=>{
    const inv = invById(x.id); if(cover>=gap || !inv) return; cover += -x.amt;
    out.push({ic:"file", b:t("rdPostpone",{x:esc((partyById(inv.partyId)||{}).name||"")}), s:t("rdPostS",{a:money(-x.amt), d:fdate(x.date)}), act:"viewInv", id:x.id}); });
  return {gap, out, covered:cover>=gap, left:r2(gap-cover)};
}

/* ----- chart (inline SVG, left→right in time) ----- */
function radarChart(R){
  const W = 640, Hh = 210, P = {l:8, r:8, t:16, b:26};
  const vals = R.days.flatMap(x=>[x.e, x.s]).concat([R.min, 0]), lo = Math.min(...vals), hi = Math.max(...vals), span = (hi-lo) || 1;
  const X = i => P.l + i*(W-P.l-P.r)/Math.max(1,R.days.length-1), Y = v => P.t + (hi-v)*(Hh-P.t-P.b)/span;
  const line = k => R.days.map((x,i)=>`${X(i).toFixed(1)},${Y(x[k]).toFixed(1)}`).join(" ");
  const iE = R.days.indexOf(R.lowE), mid = Math.floor((R.days.length-1)/2);
  const area = `${X(0)},${Y(lo)} ${line("e")} ${X(R.days.length-1)},${Y(lo)}`;
  const minY = Y(R.min);
  return `<figure class="rdchart" aria-label="${esc(t("rdTitle"))}"><svg viewBox="0 0 ${W} ${Hh}" preserveAspectRatio="none" role="img">
    <polygon class="rd-area" points="${area}"/>
    ${lo<R.min ? `<rect class="rd-danger" x="${P.l}" y="${minY}" width="${W-P.l-P.r}" height="${Math.max(0,Y(lo)-minY)}"/>` : ""}
    <line class="rd-zero" x1="${P.l}" x2="${W-P.r}" y1="${minY}" y2="${minY}"/>
    <polyline class="rd-safe" points="${line("s")}"/><polyline class="rd-exp" points="${line("e")}"/>
    <circle class="rd-dot ${R.lowE.e<R.min?"bad":""}" cx="${X(iE)}" cy="${Y(R.lowE.e)}" r="5"/>
  </svg><div class="rd-x"><span>${fdate(R.days[0].d)}</span><span>${fdate(R.days[mid].d)}</span><span>${fdate(R.days[R.days.length-1].d)}</span></div>
  <figcaption class="rd-key"><span><i class="k-exp"></i>${t("rdExpected")}</span><span><i class="k-safe"></i>${t("rdSafe")}</span></figcaption></figure>`;
}

/* ----- the page ----- */
function viewRadar(){
  const H = S.rdH || 30, R = radar(H);
  let h = `<div class="panel rd-head"><div class="col"><b>${t("rdTitle")}</b><span class="sub">${t("rdSub")}</span></div><button class="btn sm ghost" data-act="rdSettings">${icon("gear")}${t("rdSettings")}</button></div>`;
  h += `<div class="chiprow">${[14,30,60,90].map(n=>`<button class="chipbtn" data-act="rdH" data-id="${n}" aria-pressed="${H===n}">${t("rdDays",{n:`<span class="num">${n}</span>`})}</button>`).join("")}</div>`;
  if(!radarHasData()) return h + `<div class="panel empty">${icon("radar","big")}<span>${t("rdEmpty")}</span></div>`;
  const msg = R.state==="good" ? t("rdGood",{m:money(R.min), n:`<span class="num">${H}</span>`})
    : R.state==="warn" ? t("rdWarn",{x:money(R.lowS.s), d:fdate(R.firstBadS.d)}) : t("rdBad",{x:money(R.min-R.lowE.e), d:fdate(R.firstBadE.d)});
  h += `<div class="alert ${R.state}">${icon(R.state==="good"?"check":"alert")}<span>${msg}</span></div>`;
  h += `<div class="kpis"><div class="kpi"><span class="label">${t("rdNow")}</span><b>${money(R.start)}</b><button class="linkbtn" data-act="rdFix">${t("rdFix")}</button></div>
    <div class="kpi"><span class="label">${t("rdIn")}</span><b class="pos">${money(R.inn)}</b></div><div class="kpi"><span class="label">${t("rdOut")}</span><b>${money(R.out)}</b></div>
    <div class="kpi ${R.lowE.e<R.min?"neg":""}"><span class="label">${t("rdLow")}</span><b class="${R.lowE.e<0?"negv":""}">${money(R.lowE.e)}</b><span class="sub">${fdate(R.lowE.d)}</span></div></div>`;
  h += `<div class="panel">${radarChart(R)}</div>`;
  const fx = R.state!=="good" ? radarFixes(R) : null;
  if(fx && fx.out.length) h += `<div class="panel"><span class="label">${t("rdFix1")}</span><div class="list">${fx.out.map(o=>`<button class="row" data-act="${o.act}" data-id="${esc(o.id)}"><span class="tx-ic">${icon(o.ic)}</span><div class="m"><b>${o.b}</b><span class="sub">${o.s}</span></div></button>`).join("")}</div>
    <p class="sub rd-note">${fx.covered ? t("rdCovered") : t("rdNotCovered",{x:money(fx.left)})}</p></div>`;
  // timeline (daily averages folded into one line per week to keep it readable)
  const big = R.ev.filter(x=>x.kind!=="avgIn" && x.kind!=="avgOut");
  const avg = sum(R.ev.filter(x=>x.kind==="avgIn"||x.kind==="avgOut"), x=>x.amt);
  let run = R.start; const bal = {}; R.days.forEach(x=>bal[x.d]=x.e);
  h += `<div class="panel"><span class="label">${t("rdNext")}</span>${big.length?`<div class="list">${big.map(x=>{ run += x.amt; return `<button class="row" ${x.act?`data-act="${x.act}" data-id="${esc(x.id||"")}"`:""}><span class="tx-ic ${x.amt>0?"inc":"exp"}">${icon(x.kind==="chIn"||x.kind==="chOut"?"bank":x.kind==="wages"?"users":x.kind==="inv"||x.kind==="bill"?"file":"wallet")}</span><div class="m"><b>${esc(x.label)}</b><span class="sub">${fdate(x.date)}${x.sure?"":` · <span class="due">${t("rdExpected")}</span>`}</span></div><div class="col end"><b class="${x.amt<0?"negv":"pos"}">${x.amt>0?"+":"−"}${money(Math.abs(x.amt))}</b><span class="sub">${money(bal[x.date])}</span></div></button>`; }).join("")}</div>`:`<p class="sub">${t("rdNone")}</p>`}
    ${Math.abs(avg)>0.5?`<p class="sub rd-note">${t("evAvg")}: ${avg>0?"+":"−"}${money(Math.abs(avg))}</p>`:""}</div>`;
  return h;
}

/* small card on the home page */
function radarHomeCard(){
  if(!radarHasData()) return "";
  const R = radar(30);
  return `<button class="panel rd-card ${R.state}" data-act="rdOpen"><span class="tx-ic">${icon("radar")}</span><div class="m"><span class="label">${t("rdHome",{n:`<span class="num">30</span>`})}</span>
    <b>${t("rdHomeLow",{x:money(R.lowE.e), d:fdate(R.lowE.d)})}</b></div>${spark(R)}</button>`;
}
function spark(R){
  const W = 96, Hh = 32, v = R.days.map(x=>x.e), lo = Math.min(...v, R.min), hi = Math.max(...v), sp = (hi-lo)||1;
  return `<svg class="rd-spark" viewBox="0 0 ${W} ${Hh}" aria-hidden="true"><polyline points="${v.map((y,i)=>`${(i*W/Math.max(1,v.length-1)).toFixed(1)},${(2+(hi-y)*(Hh-4)/sp).toFixed(1)}`).join(" ")}"/></svg>`;
}
function radarAlert(){
  if(!radarHasData()) return null; const R = radar(30);
  return R.state==="bad" ? ["bad","radar", t("aRadar",{x:money(R.min-R.lowE.e), d:fdate(R.firstBadE.d)})] : null;
}

function radarSettingsSheet(){
  const s = rdSet();
  openSheet({title:t("rdSettings"),
    fields:[{name:"cashMin",label:t("rdMin"),type:"money",value:String(s.min||0),hint:t("rdMinHint")},
      {name:"avg",label:t("rdAvg"),type:"chips",options:[["1",LANG==="en"?"Yes":"آه"],["0",LANG==="en"?"No":"لا"]],value:s.avg?"1":"0"}],
    submit: async v=>applySettings({settings:{...(COMPANY.settings||{}), cashMin:Math.max(0,num(v.cashMin)), radarAvg:v.avg!=="0"}})});
}
function radarFixSheet(){
  const J = journal(), cur = cashNow(J);
  openSheet({title:t("rdFixT"),
    fields:[{name:"amount",label:t("rdNow"),type:"money",value:String(cur),hint:t("rdFixHint")}],
    submit: async v=>{ if(String(v.amount).trim()===""||!isFinite(num(v.amount))){ toast(t("eAmount")); return false; }
      return applySettings({settings:{...(COMPANY.settings||{}), cashNow:{amount:r2(num(v.amount)), date:today(), base:r2(cashOn(journal(), today()))}}}); }});
}

Object.assign(A, {
  rdH: id => { S.rdH = Number(id)||30; render(); },
  rdOpen: () => { S.view = "money"; S.btab = "radar"; scrollTo(0,0); render(); },
  rdSettings: () => radarSettingsSheet(),
  rdFix: () => radarFixSheet(),
});
/* =====================================================================
   Phone notifications: evening "today at a glance" (attendance, money in
   and out, bank, tomorrow's cheques), morning "due today", and news from
   the Daftar team. Sending happens on the server (Edge Function "push");
   the app only subscribes this device and keeps its choices.
   ===================================================================== */
Object.assign(L, {
  pushT:["الإشعارات","Notifications"], pushSub:["خلّي دفتر يحكيلك كل يوم شو صار وشو عليك، على تلفونك.","Let Daftar tell you every day what happened and what's due, on your phone."],
  pushOn:["شغّل الإشعارات","Turn on notifications"], pushOff:["وقّف الإشعارات على هالجهاز","Turn off on this device"], pushTest:["ابعتلي إشعار تجربة","Send me a test"],
  pushIsOn:["الإشعارات شغالة على هالجهاز","Notifications are on for this device"], pushIsOff:["الإشعارات مطفية على هالجهاز","Notifications are off on this device"],
  pushBlocked:["المتصفح مانع الإشعارات لدفتر. افتح إعدادات المتصفح ← الإشعارات، واسمح لـ daftarapp.co.","Your browser blocks Daftar's notifications. Open browser settings → Notifications and allow daftarapp.co."],
  pushNoSupport:["هالمتصفح ما بيدعم الإشعارات. جرّب Chrome على أندرويد، أو Safari على آيفون بعد ما تضيف دفتر عالشاشة الرئيسية.","This browser doesn't support notifications. Try Chrome on Android, or Safari on iPhone after adding Daftar to the home screen."],
  pushIos:["على الآيفون: افتح دفتر بـ Safari، اضغط زر المشاركة ← «إضافة إلى الشاشة الرئيسية»، وافتحه من الأيقونة، وبعدها شغّل الإشعارات من هون.","On iPhone: open Daftar in Safari, tap Share → Add to Home Screen, open it from the icon, then turn notifications on here."],
  pushEvening:["ملخص اليوم (الساعة 9 بالليل)","Today's summary (9 pm)"], pushEveningS:["مين داوم، شو دخل وطلع، شو انسحب من البنك، وشيكات بكرة","Who came, money in and out, bank, tomorrow's cheques"],
  pushMorning:["شو عليك اليوم (الساعة 8 الصبح)","Due today (8 am)"], pushMorningS:["شيكات وفواتير مستحقة، وموعد الضمان","Cheques and invoices due, social security date"],
  pushNews:["أخبار وميزات جديدة من دفتر","News and new features from Daftar"],
  pushRoleNote:["الملخصات المالية بتوصل لصاحب الشركة والمدير والمحاسب بس.","Money summaries go only to the owner, managers and accountants."],
  pushSaved:["تمام، الإشعارات شغالة","Done, notifications are on"], pushStopped:["وقفت الإشعارات على هالجهاز","Notifications stopped on this device"], pushSent:["انبعت. إذا ما وصل خلال دقيقة، تأكد إنه الإشعارات مسموحة لدفتر.","Sent. If it doesn't arrive in a minute, check that Daftar's notifications are allowed."],
  pushFail:["ما زبط، جرّب كمان مرة","That didn't work, try again"], pushAsk:["بدك يوصلك ملخص يومك على التلفون؟","Want today's summary on your phone?"], pushAskS:["مين داوم، شو دخل وطلع، وشو مستحق بكرة. كل مسا.","Who came, money in and out, and what's due tomorrow. Every evening."],
  pushLater:["مش هلأ","Not now"],
});
ICON.bell = '<path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>';

const pushOk = () => "serviceWorker" in navigator && "PushManager" in window && "Notification" in window && !!(window.APP_CONFIG||{}).VAPID_PUBLIC_KEY;
const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);
const isStandalone = () => window.matchMedia("(display-mode: standalone)").matches || navigator.standalone===true;
const b64u = s => { const p = "=".repeat((4 - s.length % 4) % 4), b = atob((s + p).replace(/-/g,"+").replace(/_/g,"/")); return Uint8Array.from(b, c=>c.charCodeAt(0)); };
async function pushReg(){ const r = await navigator.serviceWorker.getRegistration(); return r || navigator.serviceWorker.ready; }
async function pushCurrent(){ try{ if(!pushOk()) return null; const r = await pushReg(); return r ? await r.pushManager.getSubscription() : null; }catch(e){ return null; } }

async function pushEnable(prefs){
  if(!pushOk()) { toast(t("pushNoSupport")); return false; }
  const perm = Notification.permission==="granted" ? "granted" : await Notification.requestPermission();
  if(perm!=="granted"){ toast(t("pushBlocked")); return false; }
  try{
    const r = await pushReg();
    let sub = await r.pushManager.getSubscription();
    if(!sub) sub = await r.pushManager.subscribe({userVisibleOnly:true, applicationServerKey:b64u(APP_CONFIG.VAPID_PUBLIC_KEY)});
    const j = sub.toJSON(), p = prefs || {morning:true, evening:true, news:true};
    const { error } = await sb.rpc("push_subscribe", {p_endpoint:j.endpoint, p_p256dh:j.keys.p256dh, p_auth:j.keys.auth, p_lang:LANG, p_morning:!!p.morning, p_evening:!!p.evening, p_news:!!p.news});
    if(error) throw error;
    lsSet("pushAsked", 1); return true;
  }catch(e){ toast(t("pushFail")); return false; }
}
async function pushDisable(){
  const sub = await pushCurrent(); if(!sub) return true;
  try{ await sb.rpc("push_unsubscribe", {p_endpoint:sub.endpoint}); }catch(e){}
  try{ await sub.unsubscribe(); }catch(e){}
  return true;
}
/* keep the server copy fresh after login (new company, new language, rotated keys) */
async function pushResync(){
  try{ if(!pushOk() || Notification.permission!=="granted") return; const sub = await pushCurrent(); if(!sub) return;
    const j = sub.toJSON(), { data } = await sb.rpc("push_mine", {p_endpoint:j.endpoint}); const p = data || {morning:true, evening:true, news:true};
    await sb.rpc("push_subscribe", {p_endpoint:j.endpoint, p_p256dh:j.keys.p256dh, p_auth:j.keys.auth, p_lang:LANG, p_morning:p.morning!==false, p_evening:p.evening!==false, p_news:p.news!==false}); }catch(e){}
}

async function pushSheet(){
  const sub = await pushCurrent(), on = !!sub && pushOk() && Notification.permission==="granted";
  let prefs = {morning:true, evening:true, news:true};
  if(on){ try{ const { data } = await sb.rpc("push_mine", {p_endpoint:sub.endpoint}); if(data) prefs = data; }catch(e){} }
  const blocked = pushOk() && Notification.permission==="denied";
  const ios = isIOS() && !isStandalone();
  const money = ["owner","member","manager","accountant"].includes(ROLE);
  const state = !pushOk() ? `<div class="alert warn">${icon("alert")}<span>${ios?t("pushIos"):t("pushNoSupport")}</span></div>`
    : blocked ? `<div class="alert bad">${icon("alert")}<span>${t("pushBlocked")}</span></div>`
    : `<div class="alert ${on?"good":"info"}">${icon(on?"check":"bell")}<span>${on?t("pushIsOn"):t("pushIsOff")}</span></div>`;
  const opts = [["evening","pushEvening","pushEveningS"],["morning","pushMorning","pushMorningS"],["news","pushNews",""]].filter(o=>money || o[0]==="news");
  openSheet({title:t("pushT"), noSave:true, html:`<p class="sub">${t("pushSub")}</p>${state}
    ${pushOk() && !blocked ? `<div class="checks">${opts.map(([k,l,s])=>`<label class="check"><input type="checkbox" name="p_${k}" ${prefs[k]!==false?"checked":""}><span><b>${t(l)}</b>${s?`<small class="sub">${t(s)}</small>`:""}</span></label>`).join("")}</div>
    ${money?"":`<p class="sub">${t("pushRoleNote")}</p>`}
    <div class="grid2"><button type="button" class="btn primary" data-act="pushSave">${icon("bell")}${t("pushOn")}</button>
    ${on?`<button type="button" class="btn" data-act="pushTest">${icon("send")}${t("pushTest")}</button><button type="button" class="btn ghost" data-act="pushStop">${t("pushOff")}</button>`:""}</div>` : ""}`});
}
const pushPrefsFromSheet = () => { const g = k => { const el = document.querySelector(`#sheetBody [name="p_${k}"]`); return el ? el.checked : (k==="news"); }; return {morning:g("morning"), evening:g("evening"), news:g("news")}; };

/* gentle one-time card on home for owners & managers */
function pushHomeCard(){
  if(!pushOk() || Notification.permission!=="default" || lsGet("pushAsked",0) || !["owner","manager","accountant","member"].includes(ROLE)) return "";
  if(!(S.staff.length || S.invoices.length || S.cheques.length || S.expenses.length)) return "";
  return `<div class="panel grow push-card"><span class="tx-ic">${icon("bell")}</span><div class="col"><b>${t("pushAsk")}</b><span class="sub">${t("pushAskS")}</span></div>
    <div class="row-btns"><button class="btn sm primary" data-act="pushQuick">${t("pushOn")}</button><button class="btn sm ghost" data-act="pushLater">${t("pushLater")}</button></div></div>`;
}

Object.assign(A, {
  push: () => { closeSheet(); pushSheet(); },
  pushSave: async () => { const ok = await pushEnable(pushPrefsFromSheet()); if(ok){ toast(t("pushSaved")); closeSheet(); pushSheet(); } },
  pushQuick: async () => { const ok = await pushEnable(); lsSet("pushAsked", 1); if(ok) toast(t("pushSaved")); render(); },
  pushLater: () => { lsSet("pushAsked", 1); render(); },
  pushStop: async () => { await pushDisable(); toast(t("pushStopped")); closeSheet(); pushSheet(); },
  pushTest: async () => { try{ const { error } = await sb.functions.invoke("push", {body:{mode:"test"}}); toast(error ? t("pushFail") : t("pushSent")); }catch(e){ toast(t("pushFail")); } },
});
