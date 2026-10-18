# Builds Daftar's free-tool pages (for people searching Google) into docs/.
# Run:  python3 seo/build_pages.py     then upload docs/ as usual.
import json, os, html
ROOT = os.path.join(os.path.dirname(__file__), "..", "docs")
SITE = "https://daftarapp.co"
CSP = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'none'; object-src 'none'"

TOOLS = [
  ("/daily-accounts/", "دفتر حسابات يومية مجاني", "سجّل الداخل والطالع كل يوم، واعرف رصيدك فوراً. يشتغل على الموبايل وبينطبع."),
  ("/tools/overtime/", "حاسبة العمل الإضافي", "احسب أجر ساعة الإضافي حسب قانون العمل الأردني (125% و150%)."),
  ("/tools/salary/", "حاسبة الراتب والأجر اليومي", "من الراتب الشهري أو الأسبوعي لليومية، مع الغياب والإضافي والسلف."),
  ("/tools/driver/", "حاسبة ربح سائق التطبيقات", "كريم، أوبر، جيني، طلبات: كم بيضل معك بعد العمولة والبنزين، بالساعة وبالكيلو."),
  ("/tools/vat/", "حاسبة ضريبة المبيعات 16%", "ضيف الضريبة على السعر، أو طلّعها من سعر شامل، بثانية."),
  ("/tools/social-security/", "حاسبة الضمان الاجتماعي", "حصة الموظف 7.5% وحصة الشركة 14.25%، والصافي بعد الاقتطاع."),
  ("/accounting/", "برنامج محاسبة مجاني", "فواتير ضريبية، ذمم، شيكات، مخزون، قيود وميزانية، رواتب وضمان، ونقطة بيع. من الجوال."),
]

def page(path, title, desc, h1, lead, body, faq, crumbs_name, schema_type="WebApplication"):
    url = SITE + path
    faq_ld = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]}
    app_ld = {"@context": "https://schema.org", "@type": schema_type, "name": title, "url": url, "inLanguage": "ar",
              "applicationCategory": "BusinessApplication", "operatingSystem": "Web, Android, iOS",
              "offers": {"@type": "Offer", "price": "0", "priceCurrency": "JOD"}, "publisher": {"@type": "Organization", "name": "دفتر", "url": SITE + "/"}}
    crumbs_ld = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "دفتر", "item": SITE + "/"},
        {"@type": "ListItem", "position": 2, "name": "أدوات مجانية", "item": SITE + "/tools/"},
        *([{"@type": "ListItem", "position": 3, "name": crumbs_name, "item": url}] if path != "/tools/" else [])]}
    faq_html = "".join(f"<details><summary>{html.escape(q)}</summary><p>{html.escape(a)}</p></details>" for q, a in faq)
    others = "".join(f'<a class="card" href="{p}"><b>{html.escape(t)}</b><span>{html.escape(d)}</span></a>' for p, t, d in TOOLS if p != path)
    lds = "".join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in ([app_ld, crumbs_ld] + ([faq_ld] if faq else [])))
    return f"""<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta http-equiv="Content-Security-Policy" content="{CSP}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<title>{html.escape(title)} | دفتر</title>
<meta name="description" content="{html.escape(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website"><meta property="og:locale" content="ar_JO"><meta property="og:site_name" content="دفتر">
<meta property="og:title" content="{html.escape(title)}"><meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{url}"><meta property="og:image" content="{SITE}/get/media/poster.jpg">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#050A1C">
<link rel="icon" href="/app/icons/favicon-32.png" type="image/png">
<link rel="apple-touch-icon" href="/app/icons/icon-180.png">
<link rel="stylesheet" href="/get/fonts.css">
<link rel="stylesheet" href="/tools/tools.css">
{lds}
</head>
<body>
<header class="top"><a class="logo" href="/">دفتر<i>.</i></a><nav><a href="/accounting/">برنامج المحاسبة</a><a href="/tools/">أدوات مجانية</a><a class="cta" href="/get/">نزّل التطبيق</a></nav></header>
<main>
<div class="crumbs"><a href="/">دفتر</a> › <a href="/tools/">أدوات مجانية</a>{"" if path == "/tools/" else " › " + html.escape(crumbs_name)}</div>
<h1>{h1}</h1>
<p class="lead">{lead}</p>
{body}
{f'<h2>أسئلة بتتكرر</h2>{faq_html}' if faq else ''}
<div class="cta-box"><b>بدك هالحسابات تصير لحالها؟</b><p>تطبيق <b>دفتر</b> المجاني بيسجّل دوام العمال بكبسة، وبيحسب الرواتب والإضافي والسلف، وبيعرّفك قدّيش كلّف كل مشروع. فيه كمان حساب التكسي والتوصيل، والفواتير بالصور، وفريقك كله بيسجّل معك على نفس الحساب.</p>
<div class="btns"><a class="btn solid" href="/get/">نزّل دفتر مجاناً</a><a class="btn" href="/app/">افتحه الآن</a></div></div>
{f'<h2>أدوات ثانية</h2><div class="cards">{others}</div>' if others else ''}
</main>
<footer><span>© 2026 دفتر · صُنع في الأردن</span><span><a href="/tools/">أدوات مجانية</a> · <a href="/privacy.html">الخصوصية</a> · <a href="/get/">نزّل التطبيق</a></span></footer>
<script src="/tools/tools.js"></script>
</body>
</html>
"""

def write(path, content):
    out = os.path.join(ROOT, path.strip("/"), "index.html")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, "w", encoding="utf-8").write(content)

CUR = '<label>العملة<select id="cur"><option>دينار</option><option>ريال</option><option>درهم</option><option>جنيه</option><option>دولار</option></select></label>'

# ---------- hub ----------
write("/tools/", page("/tools/", "أدوات مجانية لأصحاب الشغل: حسابات يومية، رواتب، إضافي",
  "أدوات مجانية بالعربي: دفتر حسابات يومية، حاسبة العمل الإضافي حسب قانون العمل الأردني، حاسبة الراتب اليومي، وحاسبة ربح سائق التطبيقات.",
  "أدوات <em>مجانية</em> لأصحاب الشغل", "حسابات يومية، رواتب، إضافي، وربح السائق. كلها بالعربي، بتشتغل على الموبايل، وما بتحتاج تسجيل.",
  '<div class="cards">' + "".join(f'<a class="card" href="{p}"><b>{html.escape(t)}</b><span>{html.escape(d)}</span></a>' for p, t, d in TOOLS) + "</div>",
  [("هل الأدوات مجانية؟", "نعم، كل الأدوات مجانية وما بتحتاج حساب. الأرقام بتنحسب على جهازك وما بتنبعت لأي مكان."),
   ("بدي أحفظ حساباتي وأرجعلها؟", "دفتر الحسابات اليومية بيحفظ على نفس الجهاز. ولحفظ كامل على أكثر من جهاز، مع العمال والمشاريع والفواتير، نزّل تطبيق دفتر المجاني.")],
  "أدوات مجانية", "CollectionPage"))

# ---------- daily accounts ----------
write("/daily-accounts/", page("/daily-accounts/", "دفتر حسابات يومية مجاني أونلاين بالعربي",
  "دفتر حسابات يومية مجاني بالعربي: سجّل الدخل والمصاريف كل يوم واعرف الرصيد فوراً. بيشتغل على الموبايل، بينطبع، وبينزل Excel.",
  "دفتر <em>حسابات يومية</em> مجاني", "سجّل كل اللي دخل وطلع اليوم، والرصيد بيطلع لحاله. بيضل محفوظ على جهازك، وبتقدر تطبعه أو تنزّله ملف Excel.",
  """<section class="calc" id="led">
  <div style="overflow-x:auto"><table><thead><tr><th>التاريخ</th><th>البيان</th><th>داخل</th><th>طالع</th><th></th></tr></thead><tbody id="ledBody"></tbody>
  <tfoot><tr class="tot"><td colspan="2">المجموع</td><td><span id="lIn" class="num">0</span></td><td><span id="lOut" class="num">0</span></td><td></td></tr></tfoot></table></div>
  <div class="out"><div class="row"><span>الرصيد (الداخل − الطالع)</span><b class="big num" id="lBal">0</b></div></div>
  <div class="btns"><button class="btn solid" type="button" id="ledAdd">+ سطر جديد</button><button class="btn" type="button" id="ledPrint">اطبع</button><button class="btn" type="button" id="ledCsv">نزّل Excel</button><button class="btn" type="button" id="ledClear">امسح الكل</button></div>
  <p class="note">الحسابات محفوظة على هالجهاز وهالمتصفح بس، وما بتنبعت لأي مكان. إذا مسحت بيانات المتصفح بتروح.</p></section>
<h2>كيف تمسك حسابات يومية صح؟</h2>
<ol><li><b>سجّل لحظتها:</b> أي مبلغ داخل أو طالع، اكتبه أول ما يصير. الذاكرة آخر النهار بتخون.</li>
<li><b>اكتب البيان واضح:</b> "حديد فيلا عبدون" أحسن من "مواد". بعد شهر بتفرق كثير.</li>
<li><b>افصل الشغل عن البيت:</b> المصاريف الشخصية بدفتر لحالها، عشان تعرف ربح شغلك الحقيقي.</li>
<li><b>طابق مع البنك:</b> آخر الأسبوع قارن رصيدك مع رسائل البنك أو كشف الحساب.</li>
<li><b>احفظ الفواتير:</b> صوّرها واحفظها مع الحركة، بتلزمك وقت الخلاف أو الضريبة.</li></ol>""",
  [("شو يعني دفتر حسابات يومية؟", "هو سجل بسيط بتكتب فيه كل مبلغ دخل أو طلع خلال اليوم مع التاريخ والبيان، وبيطلعلك الرصيد. هو أساس أي محاسبة لمحل أو مشروع صغير."),
   ("هل لازم أكون محاسب؟", "لا. يكفي تسجّل التاريخ، شو صار، والمبلغ بخانة داخل أو طالع. الأداة بتجمع وبتحسب الرصيد لحالها."),
   ("وين بتنحفظ الحسابات؟", "على جهازك فقط، داخل المتصفح. ما في تسجيل وما بتنبعت لأي سيرفر. لحفظ دائم على أكثر من جهاز استعمل تطبيق دفتر."),
   ("بقدر أطبعه أو أفتحه بالإكسل؟", "نعم، في زر للطباعة وزر بينزّل ملف CSV بيفتح بالإكسل مع العربي.")],
  "دفتر حسابات يومية"))

# ---------- overtime ----------
write("/tools/overtime/", page("/tools/overtime/", "حاسبة العمل الإضافي حسب قانون العمل الأردني",
  "احسب أجر ساعة العمل الإضافي: 125% بالأيام العادية و150% بأيام العطل حسب المادة 59 من قانون العمل الأردني. من الراتب الشهري أو الأسبوعي أو اليومي.",
  "حاسبة <em>العمل الإضافي</em>", "حط الراتب وعدد ساعات الإضافي، وبتطلعلك قيمة الساعة وأجر الإضافي. النسب الافتراضية حسب قانون العمل الأردني، وبتقدر تغيّرها.",
  f"""<section class="calc" id="ot">
  <div class="seg"><label><input type="radio" name="otType" value="month" checked> راتب شهري</label><label><input type="radio" name="otType" value="week"> أسبوعي</label><label><input type="radio" name="otType" value="day"> يومية</label></div>
  <div class="grid"><label>الأجر<input id="otWage" inputmode="decimal" value="400"></label>{CUR}
   <label id="otDaysRow">نقسم الشهر على كم يوم؟<input id="otDays" inputmode="decimal" value="30"></label>
   <label id="otWeekRow" hidden>أيام الشغل بالأسبوع<input id="otWeekDays" inputmode="decimal" value="6"></label>
   <label>ساعات الدوام العادي باليوم<input id="otHours" inputmode="decimal" value="8"></label></div>
  <div class="grid"><label>ساعات إضافي بأيام عادية<input id="otH1" inputmode="decimal" value="10"></label><label>النسبة %<input id="otRate1" inputmode="decimal" value="125"></label>
   <label>ساعات إضافي بالعطل والجمعة<input id="otH2" inputmode="decimal" value="0"></label><label>النسبة %<input id="otRate2" inputmode="decimal" value="150"></label></div>
  <div class="out"><div class="row"><span>أجر اليوم</span><b><span class="num" id="oDaily">0</span> <span class="cur"></span></b></div>
   <div class="row"><span>أجر الساعة العادية</span><b><span class="num" id="oHourly">0</span> <span class="cur"></span></b></div>
   <div class="row"><span>إضافي الأيام العادية</span><b><span class="num" id="oH1">0</span> <span class="cur"></span></b></div>
   <div class="row"><span>إضافي العطل</span><b><span class="num" id="oH2">0</span> <span class="cur"></span></b></div>
   <div class="row"><span>مجموع الإضافي</span><b class="big"><span class="num" id="oTotal">0</span> <span class="cur"></span></b></div></div>
  <p class="note">للمعلومة العامة، مش استشارة قانونية. بعض الشركات بتقسم الراتب على 26 يوم شغل بدل 30. غيّرها من الخانة فوق.</p></section>
<h2>كيف بينحسب الإضافي بالأردن؟</h2>
<p>حسب <b>قانون العمل الأردني رقم 8 لسنة 1996</b>:</p>
<ul><li><b>المادة 56:</b> ساعات العمل العادية 8 ساعات باليوم، ولا تزيد عن 48 ساعة بالأسبوع.</li>
<li><b>المادة 59 (أ):</b> العمل الإضافي بموافقة العامل، وأجر الساعة الإضافية لا يقل عن <b>125%</b> من أجره المعتاد.</li>
<li><b>المادة 59 (ب):</b> الشغل بيوم العطلة الأسبوعية أو الأعياد والعطل الرسمية أجره لا يقل عن <b>150%</b> من أجره المعتاد.</li></ul>
<h3>مثال</h3>
<p>عامل راتبه 400 دينار بالشهر، ودوامه 8 ساعات: أجر يومه 400 ÷ 30 = 13.333، وأجر ساعته 13.333 ÷ 8 = 1.667 دينار. ساعة الإضافي العادية = 1.667 × 125% = 2.083 دينار. إذا اشتغل 10 ساعات إضافي، بياخذ 20.83 دينار.</p>""",
  [("كم نسبة العمل الإضافي بقانون العمل الأردني؟", "لا تقل عن 125% من الأجر المعتاد للساعة بالأيام العادية، ولا تقل عن 150% للشغل بيوم العطلة الأسبوعية أو العطل الرسمية والأعياد (المادة 59)."),
   ("كيف أحسب أجر الساعة من الراتب الشهري؟", "اقسم الراتب على عدد أيام الشهر (غالباً 30، وبعض الشركات 26 يوم شغل) لتطلع اليومية، وبعدين اقسم اليومية على ساعات الدوام العادي (8 ساعات)."),
   ("كم ساعات الدوام العادي بالأردن؟", "8 ساعات باليوم و48 ساعة بالأسبوع كحد أعلى، حسب المادة 56 من قانون العمل."),
   ("هل العامل مجبور يشتغل إضافي؟", "الأصل إنه الإضافي بموافقة العامل، مع استثناءات محدودة بالقانون مثل الجرد السنوي أو منع خسارة البضائع (المادة 57).")],
  "حاسبة العمل الإضافي"))

# ---------- salary ----------
write("/tools/salary/", page("/tools/salary/", "حاسبة الراتب والأجر اليومي للعمال",
  "حاسبة رواتب العمال: حوّل الراتب الشهري أو الأسبوعي ليومية، واحسب الغياب والإضافي والسلف، واعرف الصافي اللي بتدفعه.",
  "حاسبة <em>الراتب</em> والأجر اليومي", "شهري، أسبوعي أو يومية: احسب أجر اليوم، اخصم الغياب والسلف، زيد الإضافي، واعرف قدّيش ضايل للعامل.",
  f"""<section class="calc" id="sal">
  <div class="seg"><label><input type="radio" name="sType" value="month" checked> شهري</label><label><input type="radio" name="sType" value="week"> أسبوعي</label><label><input type="radio" name="sType" value="day"> يومية</label></div>
  <div class="grid"><label>الأجر<input id="sWage" inputmode="decimal" value="450"></label>{CUR}
   <label id="sWorkDaysRow">أيام الشغل بالفترة<input id="sWorkDays" inputmode="decimal" value="26"></label>
   <label id="sWorkedRow" hidden>أيام اشتغلها<input id="sWorked" inputmode="decimal" value="6"></label>
   <label id="sAbsentRow">أيام غياب<input id="sAbsent" inputmode="decimal" value="1"></label></div>
  <div class="grid"><label>أجر الإضافي<input id="sOt" inputmode="decimal" value="0"></label><label>سلف أخذها<input id="sAdv" inputmode="decimal" value="50"></label><label>خصومات ثانية<input id="sDed" inputmode="decimal" value="0"></label></div>
  <div class="out"><div class="row"><span>أجر اليوم</span><b><span class="num" id="rDaily">0</span> <span class="cur"></span></b></div>
   <div class="row"><span>الأجر بعد الغياب</span><b><span class="num" id="rBase">0</span> <span class="cur"></span></b></div>
   <div class="row"><span>+ الإضافي</span><b><span class="num" id="rOt">0</span> <span class="cur"></span></b></div>
   <div class="row"><span>− السلف والخصومات</span><b><span class="num" id="rAdv">0</span> <span class="cur"></span></b></div>
   <div class="row"><span>الصافي للعامل</span><b class="big"><span class="num" id="rNet">0</span> <span class="cur"></span></b></div></div>
  <p class="note">لحساب الإضافي بالساعة استعمل <a href="/tools/overtime/">حاسبة العمل الإضافي</a>.</p></section>
<h2>كيف بتحسب يومية العامل؟</h2>
<ul><li><b>من الراتب الشهري:</b> الراتب ÷ أيام الشغل بالشهر (مثلاً 26 إذا الجمعة عطلة).</li>
<li><b>من الأسبوعي:</b> الراتب ÷ أيام الشغل بالأسبوع (غالباً 6).</li>
<li><b>الغياب:</b> كل يوم غياب بينخصم بقيمة يومية.</li>
<li><b>السلف:</b> بتنخصم من الراتب آخر الفترة، فلازم تتسجّل أول بأول.</li></ul>""",
  [("كيف أحسب اليومية من الراتب الشهري؟", "اقسم الراتب الشهري على عدد أيام الشغل الفعلية بالشهر. مثلاً 450 ÷ 26 = 17.31 باليوم."),
   ("كيف أخصم أيام الغياب؟", "اضرب عدد أيام الغياب بأجر اليوم واطرحها من الراتب. الحاسبة بتعملها لحالها."),
   ("وين أسجّل سلف العمال؟", "بأي دفتر، بس الأفضل بتطبيق بيخصمها لحالها من الراتب، زي تطبيق دفتر المجاني.")],
  "حاسبة الراتب"))

# ---------- driver ----------
write("/tools/driver/", page("/tools/driver/", "حاسبة ربح سائق كريم وأوبر والتوصيل",
  "كم بيضل معك من شغل كريم وأوبر وجيني وطلبات؟ احسب الصافي بعد عمولة التطبيق والبنزين، وربحك بالساعة وبالكيلو وبالطلعة.",
  "حاسبة <em>ربح السائق</em>", "حط دخلك من الطلعات، عمولة التطبيق والبنزين، وبتعرف قدّيش بتربح فعلاً بالساعة وبالكيلو.",
  f"""<section class="calc" id="drv">
  <div class="grid"><label>مجموع الأجرة (اليوم أو الأسبوع)<input id="dFares" inputmode="decimal" value="45"></label>{CUR}
   <label>عدد الطلعات<input id="dTrips" inputmode="decimal" value="14"></label><label>إكراميات<input id="dTips" inputmode="decimal" value="2"></label>
   <label>عمولة التطبيق %<input id="dComm" inputmode="decimal" value="20"></label></div>
  <div class="grid"><label>الكيلومترات<input id="dKm" inputmode="decimal" value="160"></label><label>استهلاك لتر/100 كم<input id="dL100" inputmode="decimal" value="8"></label>
   <label>سعر لتر البنزين<input id="dLitre" inputmode="decimal" placeholder="مثلاً 0.9"></label><label>أو كلفة البنزين مباشرة<input id="dFuel" inputmode="decimal" placeholder="اختياري"></label>
   <label>مصاريف ثانية (غسيل، رصيد…)<input id="dOther" inputmode="decimal" value="1"></label><label>ساعات الشغل<input id="dHours" inputmode="decimal" value="9"></label></div>
  <div class="out"><div class="row"><span>عمولة التطبيق</span><b><span class="num" id="xComm">0</span> <span class="cur"></span></b></div>
   <div class="row"><span>البنزين</span><b><span class="num" id="xFuel">0</span> <span class="cur"></span> · <span class="num" id="xFuelPct">—</span> من الأجرة</b></div>
   <div class="row"><span>الصافي</span><b class="big"><span class="num" id="xNet">0</span> <span class="cur"></span></b></div>
   <div class="row"><span>بالساعة</span><b><span class="num" id="xHour">—</span> <span class="cur"></span></b></div>
   <div class="row"><span>بالكيلو</span><b><span class="num" id="xKm">—</span> <span class="cur"></span></b></div>
   <div class="row"><span>معدّل الطلعة</span><b><span class="num" id="xTrip">—</span> <span class="cur"></span></b></div></div>
  <p class="note">نسب العمولة بتختلف حسب التطبيق والعرض. حط النسبة اللي بتشوفها بتطبيقك. سعر البنزين بيتغيّر كل شهر.</p></section>
<h2>ليش لازم تعرف ربحك بالكيلو؟</h2>
<p>الطلعة الطويلة ممكن تطلع أقل ربح من ثلاث طلعات قصيرة إذا الكيلو بطّال. لما تعرف قدّيش بتربح بالكيلو وبالساعة، بتعرف أي ساعات وأي مناطق بتستاهل، وإيمتى البنزين والعمولة أكلوا ربحك.</p>
<h3>كاش ولا بطاقة؟</h3>
<p>بطلعات الكاش الأجرة كلها بتضل بإيدك، والتطبيق بيخصم عمولته من رصيدك عنده. بطلعات البطاقة التطبيق بيحوّلك الصافي. تطبيق <b>دفتر</b> بيفصلهم وبيقلك قدّيش عليك للتطبيقات وقدّيش إلك عندهم.</p>""",
  [("كيف أحسب ربحي من كريم أو أوبر؟", "اطرح من مجموع الأجرة عمولة التطبيق والبنزين والمصاريف الثانية، والباقي هو الصافي. اقسمه على ساعات الشغل لتعرف ربحك بالساعة."),
   ("كيف أحسب كلفة البنزين بالكيلو؟", "اضرب الكيلومترات باستهلاك سيارتك (لتر لكل 100 كم) واقسم على 100، وبعدين اضرب بسعر اللتر."),
   ("في تطبيق بيحسبلي هالشي كل يوم؟", "نعم، تطبيق دفتر المجاني فيه قسم للتكسي والتوصيل: بتسجّل الطلعة بكبستين، وبيحسب الصافي والعمولة والبنزين بالساعة وبالكيلو.")],
  "حاسبة ربح السائق"))

write("/tools/vat/", page("/tools/vat/", "حاسبة ضريبة المبيعات 16% بالأردن", "احسب ضريبة المبيعات العامة 16%: ضيفها على السعر أو طلّعها من سعر شامل الضريبة، مجاناً وبدون تسجيل.",
  "حاسبة <em>ضريبة المبيعات</em> 16%", "ضيف الضريبة على السعر، أو طلّعها من سعر شامل، وبتعرف قدّيش الضريبة وقدّيش السعر قبلها.",
  f"""<section class="calc" id="vat">
  <div class="seg"><label><input type="radio" name="vMode" value="exc" checked> السعر بدون ضريبة</label><label><input type="radio" name="vMode" value="inc"> السعر شامل الضريبة</label></div>
  <div class="grid"><label>السعر<input id="vAmt" inputmode="decimal" value="100"></label><label>نسبة الضريبة %<input id="vRate" inputmode="decimal" value="16"></label>{CUR}</div>
  <div class="out"><div class="row"><span>السعر قبل الضريبة</span><b><span class="num" id="vNet">0</span> <span class="cur"></span></b></div>
   <div class="row"><span>الضريبة</span><b><span class="num" id="vTax">0</span> <span class="cur"></span></b></div>
   <div class="row"><span>المجموع</span><b class="big"><span class="num" id="vTot">0</span> <span class="cur"></span></b></div></div>
  <p class="note">النسبة العامة بالأردن 16%، وفي سلع وخدمات إلها نسب أقل أو معفاة. للاسترشاد، راجع محاسبك أو دائرة ضريبة الدخل والمبيعات.</p></section>
<h2>كيف بتنحسب ضريبة المبيعات؟</h2>
<ul><li><b>إذا السعر بدون ضريبة:</b> الضريبة = السعر × 16%، والمجموع = السعر × 1.16.</li>
<li><b>إذا السعر شامل الضريبة:</b> السعر قبل الضريبة = السعر ÷ 1.16، والضريبة = الفرق.</li>
<li><b>الإقرار:</b> بتدفع للدائرة الفرق بين الضريبة اللي أخذتها على مبيعاتك والضريبة اللي دفعتها على مشترياتك.</li></ul>""",
  [("قدّيش ضريبة المبيعات بالأردن؟", "النسبة العامة 16%، وفي سلع وخدمات إلها نسب مخفّضة أو معفاة حسب القانون."),
   ("كيف أطلّع الضريبة من سعر شامل؟", "اقسم السعر على 1.16 بتطلعلك القيمة قبل الضريبة، والفرق هو الضريبة. مثلاً 116 ÷ 1.16 = 100، والضريبة 16."),
   ("في برنامج بيعمل فواتير ضريبية مجاناً؟", "نعم، تطبيق دفتر المجاني بيعمل فواتير بيع وشراء بضريبة 16% أو أي نسبة، وبيطلعلك تقرير الضريبة المستحقة لكل فترة إقرار.")],
  "حاسبة الضريبة"))

write("/tools/social-security/", page("/tools/social-security/", "حاسبة اشتراكات الضمان الاجتماعي بالأردن", "احسب اقتطاع الضمان الاجتماعي: حصة الموظف 7.5% وحصة صاحب العمل 14.25%، والصافي، ومجموع اللي بتدفعه للمؤسسة.",
  "حاسبة <em>الضمان الاجتماعي</em>", "حصة الموظف وحصة الشركة، وصافي الراتب بعد الاقتطاع، ومجموع اللي بتدفعه للضمان عن كل الموظفين.",
  f"""<section class="calc" id="ssc">
  <div class="grid"><label>الأجر الشهري<input id="sWageM" inputmode="decimal" value="500"></label>{CUR}<label>عدد الموظفين بنفس الأجر<input id="sCount" inputmode="decimal" value="1"></label></div>
  <div class="grid"><label>حصة الموظف %<input id="sEmp" inputmode="decimal" value="7.5"></label><label>حصة الشركة %<input id="sEr" inputmode="decimal" value="14.25"></label><label>سقف الأجر الخاضع<input id="sCap" inputmode="decimal" value="3733"></label></div>
  <div class="out"><div class="row"><span>حصة الموظف (بتنقطع من راتبه)</span><b><span class="num" id="sE">0</span> <span class="cur"></span></b></div>
   <div class="row"><span>حصة الشركة</span><b><span class="num" id="sR">0</span> <span class="cur"></span></b></div>
   <div class="row"><span>المجموع للضمان عن الموظف</span><b><span class="num" id="sT">0</span> <span class="cur"></span></b></div>
   <div class="row"><span>صافي الراتب بعد الضمان</span><b class="big"><span class="num" id="sNet">0</span> <span class="cur"></span></b></div>
   <div class="row"><span>المجموع عن كل الموظفين</span><b><span class="num" id="sAll">0</span> <span class="cur"></span></b></div></div>
  <p class="note">النسب الأكثر شيوعاً 7.5% للموظف و14.25% للشركة، والسقف بيتعدّل كل سنة. بعض المنشآت إلها نسب مختلفة، تأكد من مؤسسة الضمان.</p></section>""",
  [("قدّيش نسبة الضمان الاجتماعي بالأردن؟", "الأكثر شيوعاً 21.75% من الأجر: 7.5% بتنقطع من الموظف و14.25% بيدفعها صاحب العمل."),
   ("كيف أحسب صافي الراتب بعد الضمان؟", "اطرح 7.5% من الأجر الخاضع للاقتطاع. مثلاً أجر 500 دينار: الاقتطاع 37.5 والصافي 462.5 قبل ضريبة الدخل."),
   ("في برنامج بيحسب الضمان مع الرواتب؟", "نعم، تطبيق دفتر بيحسب حصة الموظف وحصة الشركة لكل موظف مشترك، وبيطلع قسيمة الراتب وكشف الضمان الشهري.")],
  "حاسبة الضمان"))

ACC_FEATS = [
  ("فواتير ضريبية", "فواتير بيع وشراء وعروض أسعار ومرتجعات، بضريبة 16% أو أي نسبة، أسعار شاملة أو غير شاملة، وترقيم تلقائي. بتنطبع PDF وبتنبعت للزبون واتساب."),
  ("الذمم وكشف الحساب", "حساب لكل زبون ومورّد برصيد افتتاحي وسقف دين، وسندات قبض وصرف، وكشف حساب برصيد متحرك بينبعت واتساب."),
  ("الشيكات", "شيكات واردة وصادرة مع البنك وتاريخ الاستحقاق: بالدرج، مودع، انصرف، أو راجع، وتنبيه قبل الاستحقاق."),
  ("المخزون والمستودعات", "كميات بتنقص وبتزيد مع الفواتير لحالها، أكثر من مستودع، نقل وجرد، متوسط التكلفة، وتنبيه لما الصنف يقرب يخلص."),
  ("المحاسبة العامة", "شجرة حسابات جاهزة وقيود تلقائية من كل حركة، وقيود يدوية، وميزان مراجعة، وقائمة دخل، وميزانية موزونة."),
  ("الرواتب والضمان", "دوام بكبسة وإضافي وسلف، وحصة الضمان للموظف والشركة، وضريبة الدخل، والإجازات، وقسيمة راتب، وكشف ضمان شهري."),
  ("نقطة بيع", "كاشير سريع للمحل: اضغط على الصنف، اقبض كاش أو بطاقة، واطبع الإيصال. المخزون والحسابات بيتحدثوا لحالهم."),
  ("فريق وصلاحيات", "ضيف المحاسب أو الكاشير أو الشريك، وحدد صلاحية كل واحد، وشوف سجل مين عدّل شو."),
  ("رادار السيولة", "رصيدك المتوقع يوم بيوم لحد 90 يوم من الشيكات والفواتير والرواتب والضمان والضريبة، وتنبيه قبل ما تنقصك المصاري مع اقتراحات للحل."),
  ("إشعارات يومية", "كل مسا ملخص على تلفونك: مين داوم، شو دخل وطلع، شو انسحب من البنك، وشيكات بكرة. وكل صبح شو مستحق عليك."),
]
acc_body = '<div class="cards">' + "".join(f'<div class="card"><b>{html.escape(a)}</b><span>{html.escape(b)}</span></div>' for a, b in ACC_FEATS) + '</div>' + """
<h2>ليش دفتر؟</h2>
<ul><li><b>مجاني</b>، بدون بطاقة وبدون اشتراك.</li><li><b>عالجوال</b> وعالكمبيوتر، بدون تنزيل برامج ولا سيرفر.</li>
<li><b>عربي باللهجة</b> وإنجليزي، والعملة اللي بدك إياها (دينار، ريال، درهم، جنيه، دولار…).</li>
<li><b>ما بتحتاج تكون محاسب:</b> بتسجّل الفاتورة أو القبض، والقيد بينعمل لحاله.</li>
<li>بياناتك بشركتك بس، ومحمية بصلاحيات على مستوى قاعدة البيانات.</li></ul>
<h2>لمين؟</h2>
<p>المقاولات والتشطيبات، المحلات والسوبرماركت، المطاعم والكافيهات، الورش والصيانة، شركات التوصيل والنقل، المكاتب والخدمات، وأي شركة صغيرة أو متوسطة بالأردن والوطن العربي.</p>"""
write("/accounting/", page("/accounting/", "برنامج محاسبة مجاني للشركات بالأردن", "دفتر: برنامج محاسبة مجاني بالعربي عالجوال. فواتير ضريبية 16%، ذمم وكشوف حساب، شيكات، مخزون ومستودعات، قيود وميزانية، رواتب وضمان اجتماعي، ونقطة بيع.",
  "برنامج <em>محاسبة</em> مجاني للشركات", "فواتير بضريبة، زباين وموردين، شيكات، مخزون، قيود وميزانية، رواتب وضمان، ونقطة بيع. كله بمكان واحد، من جوالك، ومجاني.",
  acc_body,
  [("شو أفضل برنامج محاسبة مجاني بالأردن؟", "دفتر برنامج محاسبة مجاني بالعربي بيشتغل عالجوال والكمبيوتر: فواتير ضريبية 16%، ذمم، شيكات، مخزون، قيود تلقائية وميزانية، رواتب مع الضمان الاجتماعي، ونقطة بيع. ما بيحتاج تنزيل ولا اشتراك."),
   ("في برنامج فواتير ضريبية مجاني؟", "نعم، دفتر بيعمل فواتير بيع ضريبية بالرقم الضريبي للشركة وضريبة 16%، وبتنطبع PDF أو بتنبعت للزبون واتساب."),
   ("في برنامج بيحسب الشيكات المستحقة؟", "دفتر بيسجّل الشيكات الواردة والصادرة بتاريخ الاستحقاق وحالتها، وبينبهك قبل ما تستحق، ولما يرجع شيك بيرجع المبلغ على حساب الزبون لحاله."),
   ("هل بيطلع ميزان مراجعة وميزانية؟", "نعم، كل حركة بتعمل قيدها لحالها، وبيطلعلك ميزان مراجعة وقائمة دخل وميزانية لأي فترة، وبتنصدّر Excel."),
   ("في برنامج رواتب بيحسب الضمان الاجتماعي؟", "دفتر بيحسب حصة الموظف 7.5% وحصة الشركة 14.25% (قابلة للتعديل)، وضريبة الدخل، والإجازات، وبيطلع قسيمة راتب وكشف ضمان شهري."),
   ("بيشتغل للمحلات؟", "نعم، فيه نقطة بيع (كاشير) بتطبع إيصال، ومخزون بأكثر من مستودع، وتنبيه لما الصنف يقرب يخلص."),
   ("بيشتغل بغير الأردن؟", "نعم، فيه أكثر من 20 عملة عربية وعالمية، ونسبة الضريبة بتغيّرها من الإعدادات."),
   ("في برنامج بيتوقع السيولة والشيكات؟", "دفتر فيه رادار السيولة: بيحسب رصيدك يوم بيوم من الشيكات المؤجلة والفواتير والرواتب والضمان والضريبة، وبينبهك قبل بأسابيع إذا رح ينقصك، وبيقترح مين تحصّل منه."),
   ("كم سعره؟", "دفتر مجاني لأي شركة، بدون بطاقة ائتمان.")],
  "برنامج المحاسبة", schema_type="SoftwareApplication"))

# sitemap
urls = ["/", "/accounting/", "/get/", "/tools/", "/daily-accounts/", "/tools/vat/", "/tools/social-security/", "/tools/overtime/", "/tools/salary/", "/tools/driver/", "/privacy.html"]
pri = {"/": "1.0", "/accounting/": "0.95", "/get/": "0.9", "/daily-accounts/": "0.9", "/tools/": "0.8"}
sm = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(
    f"  <url><loc>{SITE}{u}</loc><lastmod>2026-10-18</lastmod><priority>{pri.get(u, '0.7' if u != '/privacy.html' else '0.3')}</priority></url>\n" for u in urls) + "</urlset>\n"
open(os.path.join(ROOT, "sitemap.xml"), "w").write(sm)
open(os.path.join(ROOT, "robots.txt"), "w").write("User-agent: *\nAllow: /\nDisallow: /app/\n\nSitemap: https://daftarapp.co/sitemap.xml\n")
print("pages built")
