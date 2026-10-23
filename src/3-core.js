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
    incTax: !!s.incTax, invFoot: String(s.invFoot||""), paper: ["80","58"].includes(String(s.paper)) ? String(s.paper) : "a4" }; };
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
  if(error){
    // no internet: shop work (sales, receipts, customers) is kept on the device and sent later
    if(typeof outboxTake==="function" && outboxTake(col, id, data, error)){ applyLocal(col,id,data); if(!quiet) render(); return true; }
    toast(errMsg(error)); return false; }
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
