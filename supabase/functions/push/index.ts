// Daftar push notifications (Supabase Edge Function "push").
//  - mode "digest"    : called by pg_cron with x-cron-secret → morning "due today" / evening "today's summary" per company
//  - mode "broadcast" : called from the admin console with the admin's session (must be a platform admin with 2-step sign-in)
//  - mode "test"      : called by a signed-in user → one test notification to their own devices
// Secrets (Edge Function env): VAPID_PUBLIC, VAPID_PRIVATE, VAPID_SUBJECT, CRON_SECRET.
// SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are provided by Supabase.
import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const URL_ = Deno.env.get("SUPABASE_URL")!;
const ANON = Deno.env.get("SUPABASE_ANON_KEY")!;
const SERVICE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CRON = Deno.env.get("CRON_SECRET") || "";
let vapidReady = false;
function vapid() {   // set lazily so a missing secret gives a clear error instead of a crashed function
  if (vapidReady) return true;
  const pub = Deno.env.get("VAPID_PUBLIC"), priv = Deno.env.get("VAPID_PRIVATE");
  if (!pub || !priv) return false;
  webpush.setVapidDetails(Deno.env.get("VAPID_SUBJECT") || "mailto:hello@daftarapp.co", pub, priv);
  return (vapidReady = true);
}
const db = createClient(URL_, SERVICE, { auth: { persistSession: false } });

const ORIGIN = "https://daftarapp.co";
const cors = (req: Request) => {
  const o = req.headers.get("origin") || "";
  const ok = o === ORIGIN || o === "https://www.daftarapp.co";
  return { "Access-Control-Allow-Origin": ok ? o : ORIGIN, "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" };
};
const json = (req: Request, body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors(req), "Content-Type": "application/json" } });
const safeEq = (a: string, b: string) => { if (!a || a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; };

type Sub = { id: number; user_id: string; company_id: string | null; endpoint: string; p256dh: string; auth: string; lang: string; morning: boolean; evening: boolean; news: boolean; fails: number };
type Msg = { title: string; body: string; url?: string; tag?: string };

async function send(subs: Sub[], msg: (s: Sub) => Msg | null) {
  let sent = 0, failed = 0;
  const dead: number[] = [], ok: number[] = [], soft: Sub[] = [];
  const jobs = subs.map(async (s) => {
    const m = msg(s); if (!m) return;
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        JSON.stringify({ title: m.title.slice(0, 120), body: m.body.slice(0, 900), url: m.url || "/app/", tag: m.tag || "daftar", lang: s.lang }),
        { TTL: 60 * 60 * 12, urgency: "normal" });
      sent++; ok.push(s.id);
    } catch (e) {
      failed++; const code = (e as { statusCode?: number }).statusCode || 0;
      if (code === 404 || code === 410) dead.push(s.id); else soft.push(s);
    }
  });
  for (let i = 0; i < jobs.length; i += 50) await Promise.all(jobs.slice(i, i + 50));
  if (dead.length) await db.from("push_subs").delete().in("id", dead);
  if (ok.length) await db.from("push_subs").update({ last_ok: new Date().toISOString(), fails: 0 }).in("id", ok);
  for (const s of soft) { if (s.fails + 1 >= 5) await db.from("push_subs").delete().eq("id", s.id); else await db.from("push_subs").update({ fails: s.fails + 1 }).eq("id", s.id); }
  return { sent, failed, removed: dead.length };
}

// ---------- the daily digest ----------
const ammanToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Amman", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const addDays = (d: string, n: number) => { const x = new Date(d + "T12:00:00Z"); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
const num = (v: unknown) => { const n = Number(v); return isFinite(n) ? n : 0; };
const r2 = (n: number) => Math.round(n * 100) / 100;
const CUR: Record<string, [string, string]> = { JOD: ["دينار", "JOD"], SAR: ["ريال", "SAR"], AED: ["درهم", "AED"], EGP: ["جنيه", "EGP"], USD: ["دولار", "USD"], KWD: ["دينار", "KWD"], QAR: ["ريال", "QAR"], BHD: ["دينار", "BHD"], OMR: ["ريال", "OMR"], IQD: ["دينار", "IQD"], LBP: ["ليرة", "LBP"], SYP: ["ليرة", "SYP"], ILS: ["شيكل", "ILS"], MAD: ["درهم", "MAD"], TND: ["دينار", "TND"], DZD: ["دينار", "DZD"], LYD: ["دينار", "LYD"], SDG: ["جنيه", "SDG"], YER: ["ريال", "YER"], TRY: ["ليرة", "TRY"], EUR: ["يورو", "EUR"], GBP: ["جنيه", "GBP"] };
const fmt = (n: number) => r2(n).toLocaleString("en-US", { maximumFractionDigits: 2 });
const isBank = (m: unknown) => m === "transfer" || m === "card";

type Rec = { col: string; id: string; data: Record<string, unknown> };
async function companyRecords(cid: string, cols: string[]) {
  const out: Rec[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await db.from("records").select("col,id,data").eq("company_id", cid).in("col", cols).range(from, from + 999);
    if (error) throw error; out.push(...(data as Rec[])); if (!data || data.length < 1000) break;
  }
  return out;
}

function invTotal(x: Record<string, unknown>) {
  const inc = !!x.incTax; let net = 0, tax = 0;
  for (const l of (x.lines as Record<string, unknown>[]) || []) {
    const g = num(l.qty) * num(l.price) - num(l.disc), rt = num(l.tax) / 100; const n = inc ? g / (1 + rt) : g; net += n; tax += n * rt;
  }
  const d = Math.min(Math.max(0, num(x.discount)), net), k = net ? (net - d) / net : 1;
  return r2(net * k + tax * k);
}

function digest(slot: "morning" | "evening", co: { name: string; settings: Record<string, unknown> }, R: Rec[], lang: string, today: string): Msg | null {
  const en = lang === "en", c = CUR[String(co.settings?.currency || "JOD")] || CUR.JOD, cur = en ? c[1] : c[0];
  const m = (n: number) => `${fmt(n)} ${cur}`;
  const by = (col: string) => R.filter((r) => r.col === col).map((r) => ({ id: r.id, ...r.data }) as Record<string, unknown> & { id: string });
  const staff = by("staff").filter((s) => s.active !== false), att = by("attendance"), inc = by("income"), exp = by("expenses");
  const vou = by("vouchers").filter((v) => !v.void), pay = by("payments"), chq = by("cheques"), inv = by("invoices").filter((x) => !x.void && x.type !== "quote");
  const lines: string[] = [];
  if (slot === "evening") {
    // attendance
    if (staff.length) {
      const todays = att.filter((a) => a.date === today), came = todays.filter((a) => a.status === "present");
      const absent = staff.filter((s) => todays.some((a) => a.staffId === s.id && a.status === "absent")).map((s) => String(s.name || ""));
      if (todays.length) lines.push(en ? `Attendance: ${came.length} of ${staff.length}${absent.length ? ` · absent: ${absent.slice(0, 4).join(", ")}` : ""}` : `الدوام: ${came.length} من ${staff.length}${absent.length ? ` · غاب: ${absent.slice(0, 4).join("، ")}` : ""}`);
      else lines.push(en ? "Attendance wasn't recorded today" : "ما انسجّل دوام اليوم");
    }
    // money in / out today
    const inToday = inc.filter((x) => x.date === today).reduce((s, x) => s + num(x.amount), 0) + vou.filter((v) => v.date === today && v.type === "receipt").reduce((s, v) => s + num(v.amount), 0);
    const outToday = exp.filter((x) => x.date === today).reduce((s, x) => s + num(x.amount), 0) + vou.filter((v) => v.date === today && v.type === "payment").reduce((s, v) => s + num(v.amount), 0) + pay.filter((p) => p.date === today).reduce((s, p) => s + num(p.amount), 0);
    if (inToday || outToday) lines.push(en ? `In: ${m(inToday)} · Out: ${m(outToday)}` : `دخل: ${m(inToday)} · طلع: ${m(outToday)}`);
    // bank
    const bankOut = exp.filter((x) => x.date === today && isBank(x.payBy)).reduce((s, x) => s + num(x.amount), 0)
      + vou.filter((v) => v.date === today && v.type === "payment" && isBank(v.method)).reduce((s, v) => s + num(v.amount), 0)
      + pay.filter((p) => p.date === today && isBank(p.payBy)).reduce((s, p) => s + num(p.amount), 0)
      + chq.filter((q) => q.dir === "out" && q.status === "cleared" && q.statusAt === today).reduce((s, q) => s + num(q.amount), 0);
    const bankIn = inc.filter((x) => x.date === today && isBank(x.payBy)).reduce((s, x) => s + num(x.amount), 0)
      + vou.filter((v) => v.date === today && v.type === "receipt" && isBank(v.method)).reduce((s, v) => s + num(v.amount), 0)
      + chq.filter((q) => q.dir === "in" && q.status === "cleared" && q.statusAt === today).reduce((s, q) => s + num(q.amount), 0);
    if (bankOut || bankIn) lines.push(en ? `Bank: out ${m(bankOut)} · in ${m(bankIn)}` : `البنك: طلع ${m(bankOut)} · دخل ${m(bankIn)}`);
    // tomorrow's cheques
    const tm = addDays(today, 1), open = chq.filter((q) => q.dueDate === tm && ["pending", "deposited", "handed"].includes(String(q.status)));
    const tIn = open.filter((q) => q.dir === "in").reduce((s, q) => s + num(q.amount), 0), tOut = open.filter((q) => q.dir === "out").reduce((s, q) => s + num(q.amount), 0);
    if (tIn || tOut) lines.push((en ? "Cheques tomorrow: " : "شيكات بكرة: ") + [tIn ? (en ? `in ${m(tIn)}` : `إلك ${m(tIn)}`) : "", tOut ? (en ? `out ${m(tOut)}` : `عليك ${m(tOut)}`) : ""].filter(Boolean).join(" · "));
    if (!lines.length) return null;
    return { title: en ? `Today at ${co.name}` : `ملخص اليوم · ${co.name}`, body: lines.join("\n"), url: "/app/", tag: "digest-evening" };
  }
  // morning: what is due today
  const open = chq.filter((q) => ["pending", "deposited", "handed"].includes(String(q.status)) && String(q.dueDate || "") <= today);
  const cIn = open.filter((q) => q.dir === "in"), cOut = open.filter((q) => q.dir === "out");
  if (cIn.length) lines.push(en ? `Cheques to collect: ${cIn.length} · ${m(cIn.reduce((s, q) => s + num(q.amount), 0))}` : `شيكات إلك مستحقة: ${cIn.length} بقيمة ${m(cIn.reduce((s, q) => s + num(q.amount), 0))}`);
  if (cOut.length) lines.push(en ? `Cheques you owe today: ${cOut.length} · ${m(cOut.reduce((s, q) => s + num(q.amount), 0))}` : `شيكات عليك مستحقة: ${cOut.length} بقيمة ${m(cOut.reduce((s, q) => s + num(q.amount), 0))} — تأكد إنه رصيد البنك بيكفي`);
  const paid: Record<string, number> = {}; vou.forEach((v) => { if (v.invoiceId) paid[String(v.invoiceId)] = (paid[String(v.invoiceId)] || 0) + num(v.amount); });
  const dueSales = inv.filter((x) => x.type === "sale" && x.dueDate === today && invTotal(x) - (paid[x.id] || 0) > 0.005);
  const dueBills = inv.filter((x) => x.type === "purchase" && x.dueDate === today && invTotal(x) - (paid[x.id] || 0) > 0.005);
  if (dueSales.length) lines.push(en ? `Invoices due today: ${dueSales.length} · ${m(dueSales.reduce((s, x) => s + invTotal(x) - (paid[x.id] || 0), 0))}` : `فواتير بتستحق اليوم: ${dueSales.length} بقيمة ${m(dueSales.reduce((s, x) => s + invTotal(x) - (paid[x.id] || 0), 0))}`);
  if (dueBills.length) lines.push(en ? `Supplier bills due today: ${dueBills.length}` : `فواتير موردين بتستحق اليوم: ${dueBills.length}`);
  if (today.endsWith("-15") && staff.some((s) => s.ss)) lines.push(en ? "Social security contributions are due today" : "اليوم آخر موعد لاشتراكات الضمان");
  if (!lines.length) return null;
  return { title: en ? `Due today · ${co.name}` : `اليوم عليك · ${co.name}`, body: lines.join("\n"), url: "/app/", tag: "digest-morning" };
}

async function runDigest(slot: "morning" | "evening") {
  const today = ammanToday();
  const { data: subs } = await db.from("push_subs").select("*").not("company_id", "is", null).eq(slot, true);
  const all = (subs || []) as Sub[]; if (!all.length) return { companies: 0, sent: 0 };
  // only people who may see the money: owner, member, manager, accountant
  const { data: mem } = await db.from("members").select("user_id,company_id,role").in("user_id", [...new Set(all.map((s) => s.user_id))]);
  const roleOf = new Map((mem || []).map((x: { user_id: string; company_id: string; role: string }) => [x.user_id + "|" + x.company_id, x.role]));
  const allowed = all.filter((s) => ["owner", "member", "manager", "accountant"].includes(String(roleOf.get(s.user_id + "|" + s.company_id))));
  const byCo = new Map<string, Sub[]>(); allowed.forEach((s) => { const k = s.company_id!; byCo.set(k, [...(byCo.get(k) || []), s]); });
  let sent = 0, failed = 0;
  for (const [cid, list] of byCo) {
    try {
      const { data: co } = await db.from("companies").select("name,settings").eq("id", cid).single();
      if (!co) continue;
      const R = await companyRecords(cid, ["staff", "attendance", "income", "expenses", "vouchers", "payments", "cheques", "invoices"]);
      const res = await send(list, (s) => digest(slot, co as { name: string; settings: Record<string, unknown> }, R, s.lang, today));
      sent += res.sent; failed += res.failed;
    } catch (e) { console.error("digest", cid, String(e)); }
  }
  return { companies: byCo.size, sent, failed };
}

async function caller(req: Request) {
  const h = req.headers.get("authorization") || ""; if (!h.startsWith("Bearer ")) return null;
  const c = createClient(URL_, ANON, { global: { headers: { Authorization: h } }, auth: { persistSession: false } });
  const { data } = await c.auth.getUser(h.slice(7)); if (!data || !data.user) return null;
  return { user: data.user, c };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  if (req.method !== "POST") return json(req, { error: "method" }, 405);
  let b: Record<string, unknown> = {};
  try { const t = await req.text(); if (t.length > 4000) return json(req, { error: "too big" }, 413); b = JSON.parse(t || "{}"); } catch { return json(req, { error: "bad json" }, 400); }
  const mode = String(b.mode || "");
  if (!vapid()) return json(req, { error: "not configured" }, 503);

  if (mode === "digest") {
    if (!CRON || !safeEq(req.headers.get("x-cron-secret") || "", CRON)) return json(req, { error: "forbidden" }, 403);
    const slot = b.slot === "morning" ? "morning" : "evening";
    return json(req, await runDigest(slot));
  }

  const who = await caller(req); if (!who) return json(req, { error: "sign in" }, 401);

  if (mode === "test") {
    const { data: subs } = await db.from("push_subs").select("*").eq("user_id", who.user.id);
    if (!subs || !subs.length) return json(req, { error: "no device" }, 404);
    const res = await send(subs as Sub[], (s) => s.lang === "en"
      ? { title: "Daftar", body: "Notifications are on. You'll get today's summary every evening.", tag: "test" }
      : { title: "دفتر", body: "الإشعارات شغالة. رح يوصلك ملخص يومك كل مسا.", tag: "test" });
    return json(req, res);
  }

  if (mode === "broadcast") {
    const { data: w } = await who.c.rpc("admin_whoami");
    if (!w || !w.listed || !w.mfa) return json(req, { error: "forbidden" }, 403);
    const title = String(b.title || "").trim().slice(0, 80), body = String(b.body || "").trim().slice(0, 400);
    let url = String(b.url || "/app/").trim(); if (!/^\/[A-Za-z0-9/_\-.?=&#]*$/.test(url)) url = "/app/";
    const target = b.target === "owners" ? "owners" : "all";
    if (title.length < 2 || body.length < 2) return json(req, { error: "empty" }, 400);
    const since = new Date(Date.now() - 864e5).toISOString();
    const { count } = await db.from("push_log").select("id", { count: "exact", head: true }).gte("at", since);
    if ((count || 0) >= 5) return json(req, { error: "limit" }, 429);
    let { data: subs } = await db.from("push_subs").select("*").eq("news", true);
    subs = subs || [];
    if (target === "owners") {
      const { data: own } = await db.from("members").select("user_id").eq("role", "owner");
      const ids = new Set((own || []).map((x: { user_id: string }) => x.user_id)); subs = subs.filter((s: Sub) => ids.has(s.user_id));
    }
    const res = await send(subs as Sub[], () => ({ title, body, url, tag: "news" }));
    await db.from("push_log").insert({ by_user: who.user.id, title, body, url, target, sent: res.sent, failed: res.failed });
    return json(req, res);
  }
  return json(req, { error: "mode" }, 400);
});
