// Daftar voice assistant (Supabase Edge Function "voice").
//  - mode "ask": the user's words (already turned into text on the phone) → Claude → a short spoken reply
//    plus the records to save. Nothing is saved here: the app shows what was understood and saves only after
//    the user confirms.
//  - mode "talk": a voice recording → words (Groq Whisper) → the same as "ask", plus the spoken answer, in one trip.
//  - mode "tts": a short reply → speech (ElevenLabs if set, otherwise Groq's Arabic voice).
// The understanding part runs on Groq (free, GROQ_API_KEY) or on Claude (ANTHROPIC_API_KEY), whichever key is set;
// with both, AI_PROVIDER=groq|anthropic picks (default: Claude). Without ElevenLabs keys the phone speaks the reply itself.
// Secrets (Edge Function env): GROQ_API_KEY and/or ANTHROPIC_API_KEY; optional ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID,
// VOICE_MODEL, GROQ_MODEL, GROQ_MODEL_2.
// SUPABASE_URL / SUPABASE_ANON_KEY are provided by Supabase. No imports, so it also runs under the tests.

const env = (k: string) => (globalThis as any).Deno.env.get(k) || "";
const ORIGINS = ["https://daftarapp.co", "https://www.daftarapp.co"];
const cors = (req: Request) => {
  const o = req.headers.get("origin") || "";
  return { "Access-Control-Allow-Origin": ORIGINS.includes(o) ? o : ORIGINS[0], "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" };
};
const json = (req: Request, body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors(req), "Content-Type": "application/json" } });
const clip = (s: unknown, n: number) => String(s ?? "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);

async function take(auth: string, kind: "ask" | "tts") {
  const r = await fetch(`${env("SUPABASE_URL")}/rest/v1/rpc/voice_take`, {
    method: "POST", headers: { apikey: env("SUPABASE_ANON_KEY"), Authorization: auth, "Content-Type": "application/json" }, body: JSON.stringify({ p_kind: kind }),
  });
  if (r.status === 401 || r.status === 403) return { ok: false, err: "auth" };
  if (!r.ok) return { ok: false, err: "db" };
  return await r.json();
}

const TOOL = {
  name: "daftar_actions",
  description: "Return what to record in Daftar and the short spoken reply.",
  input_schema: {
    type: "object",
    properties: {
      reply: { type: "string", description: "Short spoken reply, max 25 words, in the user's language (Jordanian Arabic dialect when Arabic). Say what will be recorded and ask them to confirm, or ask ONE short question if something essential is missing. No markdown, no emoji, no IDs." },
      actions: {
        type: "array", maxItems: 8,
        items: {
          type: "object",
          properties: {
            type: { type: "string", enum: ["expense", "income", "stock", "advance", "attendance", "ask", "receipt", "payment", "sale"], description: "receipt = money received FROM a named customer/person; payment = money paid TO a named supplier/person; sale = sold to a named customer on account / make an invoice. Use expense/income only when no person or company is named." },
            party: { type: "string", description: "receipt/payment/sale: the customer or supplier name as said, e.g. 'أبو أحمد'." },
            party_id: { type: "string", description: "Matching party id from the list if it exists." },
            method: { type: "string", enum: ["cash", "cheque", "transfer", "card"], description: "receipt/payment: how. 'شيك' = cheque, 'تحويل' = transfer." },
            cheque_no: { type: "string", description: "Cheque number if said." },
            due_date: { type: "string", description: "Cheque due date YYYY-MM-DD if said ('آخر الشهر' = last day of this month)." },
            price: { type: "number", description: "sale: unit price if a quantity is given." },
            amount: { type: "number", description: "Money amount (expense, income, advance). Never guess." },
            category: { type: "string", description: "Category id from the given list for the chosen kind, closest match. Omit if unsure." },
            desc: { type: "string", description: "Short description in the user's words, e.g. 'باطون' or 'بنزين'." },
            unit: { type: "string", description: "Project/branch id from the list, only if the user named one." },
            date: { type: "string", description: "YYYY-MM-DD. Default today; 'مبارح' = yesterday." },
            item: { type: "string", description: "Stock item name as said (stock)." },
            item_id: { type: "string", description: "Matching item id from the list if it exists (stock)." },
            qty: { type: "number", description: "Quantity (stock)." },
            mode: { type: "string", enum: ["in", "out", "count"], description: "stock: in = bought/added, out = used/sold, count = how many are left now ('ضل عندي')." },
            staff_ids: { type: "array", items: { type: "string" }, description: "Staff ids from the list (advance: exactly one; attendance: the named ones)." },
            all_staff: { type: "boolean", description: "attendance: true when they mean everyone ('كل الشباب')." },
            status: { type: "string", enum: ["present", "absent"] },
            metric: { type: "string", enum: ["profit", "expenses", "income", "salaries", "summary", "owed_to_me", "i_owe", "total"], description: "ask: what they want to know. summary = 'شو صار اليوم/هالشهر'; owed_to_me = who owes me / how much people owe me; i_owe = how much I owe suppliers; total = a total for one person or one kind of spending ('كم دفعت لأبو خالد', 'قديش صرفت على البنزين')." },
            flow: { type: "string", enum: ["paid_to", "received_from", "sold_to", "bought_from", "spent", "earned"], description: "ask total: paid_to = money I paid a person; received_from = money a person paid me; sold_to / bought_from = invoices; spent = expenses on a kind of thing (category or desc); earned = income of a kind." },
            period: { type: "string", enum: ["today", "yesterday", "week", "month", "last_month", "year", "all"], description: "ask: the period. 'من أول السنة' = year; 'من الأول / كل الوقت' = all." },
          },
          required: ["type"],
        },
      },
    },
    required: ["reply", "actions"],
  },
};

function system(ctx: any) {
  return `You are the voice assistant inside Daftar, a simple accounting app for small businesses and contractors in Jordan and the Gulf.
The owner talks to you casually, usually in Jordanian Arabic. Turn what they say into records using the daftar_actions tool, and write a short spoken reply.
Rules:
- Never invent amounts, quantities or names. If an amount is missing, add no action for it and ask for it in the reply.
- Money words: "مية" 100, "ميتين" 200, "تلتمية" 300, "ألف" 1000, "ألفين" 2000, "نص" 0.5 when about money, "ليرة" in Jordan means a dinar. Default currency is ${ctx.currency || "JD"}.
- "اشتريت/دفعت/صرفت X بـ/على Y" is an expense. "قبضت/إجاني/بعت بـ" money in is income. A loan or advance to a worker ("سلفة", "سلّفت") is an advance for that one staff member.
- A number of things without a price ("اشتريت ميت بلوكة", "ضل عندي ستين بلاطة") is stock, not money. "ضل عندي / باقي عندي" means mode count; "استعملت / بعت" means out; "إجاني / اشتريت" means in. If they give both a price and a quantity, add both an expense (with the price) and a stock action (with the quantity).
- "الشباب/العمال اشتغلوا اليوم" is attendance (present). "ما إجا / غاب" is absent.
- A named customer or supplier changes the type: "قبضت من أبو أحمد مية" is receipt (party أبو أحمد, 100); "دفعت لأبو خالد ميتين" or "سدّدت للمورّد" is payment; "بعت لأبو أحمد بمية على الحساب" / "اعمل فاتورة لأبو أحمد بمية" / "حطها على حساب أبو أحمد" is sale. "إجاني شيك من أبو علي بألف" is receipt with method cheque; "كتبت شيك لأبو خالد" is payment with method cheque.
- More money words: "ميتين ونص" 250, "ألف وخمسمية" 1500, "خمسطعشر" 15, "عشرين ليرة" 20, "ربع" 0.25, "تمن" ثمانية 8, "مية وخمسين" 150. "رجّعلي خمسين" from a person = receipt 50.
- "شو صار اليوم؟" / "كيف الشغل اليوم؟" is ask metric summary, period today. "مين إلي عنده مصاري؟" is ask metric owed_to_me. "قديش عليّ للموردين؟" is ask metric i_owe.
- "كم دفعت لأبو خالد من أول السنة؟" is ask metric total, flow paid_to, party أبو خالد, period year. "قديش قبضت من شركة النور هالشهر؟" is total, received_from. "قديش صرفت على البنزين هالشهر؟" is total, flow spent, category بنزين (or desc بنزين), period month. "كم بعت لأبو أحمد؟" is total, sold_to. No period said → all for a person, month for spending.
- Questions like "قديش ربحت هالشهر؟" are an "ask" action; the app does the math, so reply with something like "لحظة، هاي النتيجة" without numbers.
- Use only ids that appear in the lists. Pick the closest category id for the kind; if nothing fits, omit category.
- This is a back-and-forth conversation. If the owner is answering your last question (a missing amount, which worker, which project) or correcting you, combine it with what was said before and return the complete list of actions again.
- Today is ${ctx.today}. Reply in ${ctx.lang === "en" ? "English" : "Jordanian Arabic"}, at most 25 words, warm and natural like a helpful assistant at the shop, and end with a short request to confirm when there is something to save.

Examples (owner → actions):
«اشتريت اسمنت بتلتمية وخمسين» → expense 350, desc اسمنت.
«الشباب كلهم داوموا إلا خالد» → attendance present for everyone except Khaled, and attendance absent for Khaled.
«سلّفت أبو علي خمسين» (أبو علي is staff) → advance 50.
«قبضت من شركة النور ألف بشيك مستحق آخر الشهر» → receipt 1000, party شركة النور, method cheque, due_date end of month.
«استعملنا عشرين كيس اسمنت» → stock out 20 اسمنت.

Business data (JSON): ${JSON.stringify({ projects: ctx.units, staff: ctx.staff, stock_items: ctx.items, parties: ctx.parties, expense_categories: ctx.expense_categories, income_categories: ctx.income_categories })}`;
}

// earlier turns of the same conversation (plain text only), always starting with the owner and alternating
function convo(history: any, text: string) {
  const out: { role: string; content: string }[] = [];
  for (const h of (Array.isArray(history) ? history : []).slice(-6)) {
    const role = h && h.role === "assistant" ? "assistant" : "user", content = clip(h && h.text, 300);
    if (!content) continue;
    if (!out.length && role !== "user") continue;
    if (out.length && out[out.length - 1].role === role) out[out.length - 1].content += "\n" + content; else out.push({ role, content });
  }
  if (out.length && out[out.length - 1].role === "user") out.pop();
  out.push({ role: "user", content: `The owner said: «${text}»` });
  return out;
}

function provider() {
  const want = env("AI_PROVIDER").toLowerCase();
  if (want === "groq" && env("GROQ_API_KEY")) return "groq";
  if (want === "anthropic" && env("ANTHROPIC_API_KEY")) return "anthropic";
  return env("ANTHROPIC_API_KEY") ? "anthropic" : env("GROQ_API_KEY") ? "groq" : "";
}

// Claude: forced tool call
async function viaAnthropic(sys: string, msgs: any[]) {
  const r = await fetch(env("ANTHROPIC_URL") || "https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": env("ANTHROPIC_API_KEY"), "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: env("VOICE_MODEL") || "claude-haiku-5-5", max_tokens: 700, temperature: 0, system: sys, tools: [TOOL], tool_choice: { type: "tool", name: "daftar_actions" }, messages: msgs }),
  });
  if (!r.ok) { console.error("anthropic", r.status, (await r.text()).slice(0, 300)); return null; }
  const out = await r.json();
  const use = (out.content || []).find((b: any) => b.type === "tool_use" && b.name === "daftar_actions");
  return use ? use.input || {} : null;
}

// Groq (OpenAI-style): forced function call; if the first model is busy or refuses, try the second one
async function viaGroq(sys: string, msgs: any[]) {
  const models = [env("GROQ_MODEL") || "openai/gpt-oss-120b", env("GROQ_MODEL_2") || "llama-3.3-70b-versatile"];
  for (const model of models) {
    const fast = /gpt-oss/.test(model) ? { reasoning_effort: "low", include_reasoning: false } : {};
    const r = await fetch(`${groq()}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env("GROQ_API_KEY")}`, "content-type": "application/json" },
      body: JSON.stringify({ model, temperature: 0, max_completion_tokens: 2000, ...fast,
        messages: [{ role: "system", content: sys }, ...msgs],
        tools: [{ type: "function", function: { name: TOOL.name, description: TOOL.description, parameters: TOOL.input_schema } }],
        tool_choice: { type: "function", function: { name: "daftar_actions" } } }),
    });
    if (!r.ok) { console.error("groq", model, r.status, (await r.text()).slice(0, 300)); continue; }
    const out = await r.json();
    const call = (out.choices?.[0]?.message?.tool_calls || []).find((c: any) => c.function?.name === "daftar_actions");
    if (!call) { console.error("groq no tool call", model); continue; }
    try { return JSON.parse(call.function.arguments || "{}"); } catch { console.error("groq bad json", model); }
  }
  return null;
}
const groq = () => (env("GROQ_URL") || "https://api.groq.com/openai/v1").replace(/\/(chat\/completions)?$/, "");

// the business data the model sees, cleaned and capped
function context(c: any) {
  c = c || {};
  const list = (a: any, n: number) => (Array.isArray(a) ? a : []).slice(0, n).map((x: any) => ({ id: clip(x.id, 60), name: clip(x.name, 60) }));
  const cats = (a: any) => (Array.isArray(a) ? a : []).slice(0, 40).map((x: any) => ({ id: clip(x.id, 40), label: clip(x.label, 40) }));
  return { today: /^\d{4}-\d{2}-\d{2}$/.test(c.today) ? c.today : new Date().toISOString().slice(0, 10), lang: c.lang === "en" ? "en" : "ar", currency: clip(c.currency, 20),
    units: list(c.units, 40), staff: list(c.staff, 80), items: list(c.items, 150), parties: list(c.parties, 150), company: clip(c.company, 80), cur_code: /^[A-Z]{3}$/.test(c.cur_code) ? c.cur_code : "", expense_categories: cats(c.cats?.exp), income_categories: cats(c.cats?.inc) };
}

// understand + (when asked) the spoken answer; shared by "ask" and "talk"
async function answer(req: Request, body: any, text: string, ctx: any, auth: string, left: number, extra: any = {}) {
  const via = provider();
  const sys = system(ctx), msgs = convo(body.history, text);
  const inp = via === "groq" ? await viaGroq(sys, msgs) : await viaAnthropic(sys, msgs);
  if (!inp) { note("ai", `${via} failed`); return json(req, { err: "ai", ...extra }, 502); }
  const acts = (Array.isArray(inp.actions) ? inp.actions : []).filter((a: any) => a && typeof a === "object").slice(0, 8);
  const reply = clip(inp.reply, 400);
  let audio = "", audioType = "";
  // a question about numbers is answered by the app (it does the math), so no voice for the "wait" line
  const onlyAsk = acts.length > 0 && acts.every((a: any) => a.type === "ask");
  if (body.speak && reply && !onlyAsk && voiceOn()) {
    const t = await take(auth, "tts");
    if (t.ok) { const sp = await speech(reply, ctx.lang); if (sp) { audio = b64(sp.buf); audioType = sp.type; } }
  }
  return json(req, { ...extra, reply, actions: acts, audio, audio_type: audioType, left });
}

async function ask(req: Request, body: any) {
  if (!provider()) return json(req, { err: "not_ready" }, 503);
  const text = clip(body.text, 600);
  if (text.length < 2) return json(req, { err: "empty" }, 400);
  const auth = req.headers.get("authorization") || "";
  const t = await take(auth, "ask");
  if (!t.ok) return json(req, { err: t.err || "limit" }, t.err === "auth" ? 401 : 429);
  return await answer(req, body, text, context(body.ctx), auth, t.left);
}

// ---------- hearing: a recording → words (Groq Whisper)
const YES = /^(آه|اه|أه|ايوا|ايوه|أيوا|أيوه|اكيد|أكيد|أكد|أكّد|اكد|تمام|ماشي|سجل|سجّل|سجلهم|سجّلهم|صح|مزبوط|yes|yeah|yep|ok|okay|sure|confirm)(?:\s|$)/i;
const NO = /^(لا|لأ|لاء|الغي|ألغي|إلغاء|الغيها|ألغيها|بلاش|غلط|no|nope|cancel)(?:\s|$)/i;
const BYE = /^(خلص|خلاص|يعطيك العافيه|يعطيك العافية|شكرا|شكراً|مع السلامه|مع السلامة|باي|bye|thanks|thank you|that's all)(?:\s|$)/i;
// what Whisper "hears" in silence or noise (subtitle credits and the like)
const GHOST = /(اشترك|القناة|نانسي|قنقر|ترجمة|المترجم|شكرا للمشاهدة|شكراً للمشاهدة|موسيقى|subtitles?|thanks for watching|amara\.org)/i;

function unb64(s: string) { const bin = atob(s); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u; }
function b64(buf: ArrayBuffer) { const u = new Uint8Array(buf); let s = ""; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000)); return btoa(s); }

// the last thing that went wrong with hearing / speaking (no secrets), shown by "health" to find problems fast
const LAST: { stt: string; tts: string; ai: string; vision: string } = { stt: "", tts: "", ai: "", vision: "" };
const note = (k: "stt" | "tts" | "ai" | "vision", m: string) => { LAST[k] = `${new Date().toISOString().slice(0, 19)} ${m}`.slice(0, 300); };

async function hear(audio: Uint8Array, mime: string, ctx: any, last = "") {
  const type = (mime.split(";")[0] || "audio/webm").trim();
  const ext = /mp4|m4a|aac/.test(type) ? "mp4" : /ogg/.test(type) ? "ogg" : /wav/.test(type) ? "wav" : /mpeg|mp3/.test(type) ? "mp3" : "webm";
  const names = [...ctx.staff, ...ctx.items, ...ctx.units].slice(0, 25).map((x: any) => x.name).join("، ");
  // Whisper reads the hint as "what came before": Daftar's last question and the business's own names
  const hint = clip((ctx.lang === "en" ? "Daftar. expenses, income, advance, stock, JD. " : "دفتر. اشتريت، صرفت، قبضت، سلفة، دينار، مية، ميتين، ضل عندي. ") + (last ? clip(last, 120) + " " : "") + names, 400);
  let out: any = null;
  // the full model hears Arabic best; the turbo one is the backup when it's busy
  for (const model of [env("STT_MODEL") || "whisper-large-v3", env("STT_MODEL_2") || "whisper-large-v3-turbo"]) {
    const fd = new FormData();
    fd.append("file", new Blob([audio], { type }), `talk.${ext}`);
    fd.append("model", model);
    fd.append("language", ctx.lang === "en" ? "en" : "ar");
    fd.append("response_format", "json");
    fd.append("temperature", "0");
    fd.append("prompt", hint);
    const r = await fetch(`${groq()}/audio/transcriptions`, { method: "POST", headers: { Authorization: `Bearer ${env("GROQ_API_KEY")}` }, body: fd });
    if (r.ok) { out = await r.json(); break; }
    const e = (await r.text()).slice(0, 300); console.error("whisper", model, r.status, e); note("stt", `${model} ${r.status} ${e}`);
  }
  if (!out) return null;
  const text = clip(out.text, 600).replace(/^[\s.,،؟?!-]+|[\s.,،؟?!-]+$/g, "");
  if (!text || text.length < 2 || GHOST.test(text) || text === clip(hint, 600)) return "";
  return text;
}

async function talk(req: Request, body: any) {
  if (!env("GROQ_API_KEY")) return json(req, { err: "not_ready" }, 503);
  const raw = String(body.audio || "");
  if (raw.length < 400) return json(req, { heard: "" });
  if (raw.length > 6_000_000) return json(req, { err: "big" }, 413);
  const auth = req.headers.get("authorization") || "";
  const t = await take(auth, "ask");
  if (!t.ok) return json(req, { err: t.err || "limit" }, t.err === "auth" ? 401 : 429);
  const ctx = context(body.ctx);
  let audio: Uint8Array;
  try { audio = unb64(raw); } catch { return json(req, { err: "bad" }, 400); }
  const heard = await hear(audio, clip(body.mime, 80), ctx, clip(body.last, 200));
  if (heard === null) return json(req, { err: "stt" }, 502);
  if (!heard) return json(req, { heard: "", left: t.left });
  const short = heard.split(/\s+/).length <= 4;
  if (short && (YES.test(heard) || NO.test(heard) || BYE.test(heard))) return json(req, { heard, skip: true, left: t.left });
  if (!provider()) return json(req, { err: "not_ready" }, 503);
  return await answer(req, body, heard, ctx, auth, t.left, { heard });
}

// ---------- amounts written in words (cheques): Arabic and English → number
const AR_DIGITS = /[٠-٩۰-۹]/g;
const toLatinDigits = (s: string) => String(s || "").replace(AR_DIGITS, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d) >= 0 ? "٠١٢٣٤٥٦٧٨٩".indexOf(d) : "۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
const normAr = (s: string) => String(s || "").replace(/[ً-ْـ]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه").replace(/ؤ/g, "و").replace(/ئ/g, "ي");
const AR_WORDS: Record<string, number> = {
  "صفر": 0, "واحد": 1, "واحده": 1, "احد": 1, "اثنان": 2, "اثنين": 2, "اثنا": 2, "اثني": 2, "اثنتان": 2, "اثنتين": 2, "ثنتين": 2,
  "ثلاث": 3, "ثلاثه": 3, "ثلث": 3, "اربع": 4, "اربعه": 4, "خمس": 5, "خمسه": 5, "ست": 6, "سته": 6, "سبع": 7, "سبعه": 7,
  "ثمان": 8, "ثماني": 8, "ثمانيه": 8, "ثمانية": 8, "تسع": 9, "تسعه": 9, "عشر": 10, "عشره": 10,
  "عشرون": 20, "عشرين": 20, "ثلاثون": 30, "ثلاثين": 30, "اربعون": 40, "اربعين": 40, "خمسون": 50, "خمسين": 50,
  "ستون": 60, "ستين": 60, "سبعون": 70, "سبعين": 70, "ثمانون": 80, "ثمانين": 80, "تسعون": 90, "تسعين": 90,
  "مائه": 100, "مايه": 100, "مئه": 100, "ميه": 100, "مائتان": 200, "مائتين": 200, "مئتان": 200, "مئتين": 200, "ميتين": 200, "مائتا": 200, "مئتا": 200,
  "الف": 1000, "الفا": 1000, "الفان": 2000, "الفين": 2000, "الاف": 1000, "الوف": 1000,
  "مليون": 1e6, "مليونا": 1e6, "مليونان": 2e6, "مليونين": 2e6, "ملايين": 1e6,
};
for (const k of Object.keys(AR_WORDS)) { const n = normAr(k); if (!(n in AR_WORDS)) AR_WORDS[n] = AR_WORDS[k]; }
const EN_WORDS: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fourty: 40, fifty: 50,
  sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000, million: 1e6,
};
// the main unit and the small unit, Arabic and English
const MAIN_UNIT = /(دينار|دنانير|ريال|ريالات|درهم|دراهم|جنيه|جنيهات|ليره|ليرات|dinars?|riyals?|rials?|dirhams?|pounds?|dollars?)/;
const SUB_UNIT = /(فلس|فلسا|فلوس|هلله|هللات|قرش|قروش|بيسه|بيسات|درهم|fils|halalas?|piastres?|baisas?|cents?)/;
function wordsToNumber(tokens: string[], dict: Record<string, number>): number | null {
  let total = 0, cur = 0, seen = false;
  for (let raw of tokens) {
    let w = raw;
    if (dict === AR_WORDS) {
      w = normAr(w).replace(/^و(?=.)/, "");
      if (!(w in dict)) { w = w.replace(/^ال(?=.)/, ""); }
      // ثلاثمائة / خمسمية / تسعمئة written as one word
      const m = w.match(/^(ثلاث|ثلث|اربع|خمس|ست|سبع|ثمان|ثماني|تسع)(مائه|مايه|ميه)$/);
      if (m) { cur += AR_WORDS[m[1]] * 100; seen = true; continue; }
    } else w = w.toLowerCase().replace(/[^a-z]/g, "");
    if (!(w in dict)) { if (/^\d+(\.\d+)?$/.test(raw)) { cur += Number(raw); seen = true; } continue; }
    const v = dict[w]; seen = true;
    if (v === 100) cur = (cur || 1) * 100;
    else if (v === 2000 || v === 2e6) total += v;
    else if (v >= 1000) { total += (cur || 1) * v; cur = 0; }
    else cur += v;
  }
  return seen ? total + cur : null;
}
// «فقط ألف وخمسمائة دينار وخمسون فلساً لا غير» → 1500.05 (fils = 1/1000 for JOD/KWD/BHD/OMR, 1/100 otherwise)
function amountFromWords(text: string, decimals = 3): number | null {
  if (!text) return null;
  const t = toLatinDigits(text).replace(/[،,.\-–()]/g, " ").replace(/\s+/g, " ").trim();
  const ar = /[؀-ۿ]/.test(t);
  const toks = t.split(" ").filter(Boolean);
  const dict = ar ? AR_WORDS : EN_WORDS;
  let mainEnd = toks.findIndex((x) => MAIN_UNIT.test(ar ? normAr(x).replace(/^و/, "").replace(/^ال/, "") : x.toLowerCase()));
  if (mainEnd < 0) mainEnd = toks.length;
  const main = wordsToNumber(toks.slice(0, mainEnd), dict);
  const rest = toks.slice(mainEnd + 1), subEnd = rest.findIndex((x) => SUB_UNIT.test(ar ? normAr(x).replace(/^و/, "").replace(/^ال/, "") : x.toLowerCase()));
  const sub = subEnd > 0 ? wordsToNumber(rest.slice(0, subEnd), dict) : null;
  if (main === null && sub === null) return null;
  return Math.round(((main || 0) + (sub ? sub / Math.pow(10, decimals) : 0)) * 1000) / 1000;
}

// ---------- banks of Jordan, the Gulf, Egypt, Iraq, Lebanon and Palestine → name, country, currency
// [Arabic name, English name / other spellings separated by |, currency]
const BANKS: [string, string, string][] = [
  // Jordan (JOD)
  ["البنك العربي", "arab bank", "JOD"], ["بنك الإسكان", "housing bank|the housing bank for trade and finance|hbtf", "JOD"],
  ["البنك الأهلي الأردني", "jordan ahli bank|ahli bank", "JOD"], ["بنك القاهرة عمان", "cairo amman bank|cab", "JOD"],
  ["بنك الاتحاد", "bank al etihad|union bank", "JOD"], ["البنك الأردني الكويتي", "jordan kuwait bank|jkb", "JOD"],
  ["بنك الأردن", "bank of jordan", "JOD"], ["كابيتال بنك", "capital bank|بنك المال الأردني", "JOD"],
  ["البنك التجاري الأردني", "jordan commercial bank", "JOD"], ["بنك صفوة الإسلامي", "safwa islamic bank|safwa", "JOD"],
  ["البنك الإسلامي الأردني", "jordan islamic bank", "JOD"], ["البنك العربي الإسلامي الدولي", "islamic international arab bank|iiab", "JOD"],
  ["البنك الاستثماري", "invest bank|investbank", "JOD"], ["بنك ABC الأردن", "abc bank|arab banking corporation", "JOD"],
  ["بنك سوسيته جنرال الأردن", "societe generale|sgbj", "JOD"], ["بنك المؤسسة العربية المصرفية", "bank abc", "JOD"],
  ["بنك الإسكان للتجارة والتمويل", "housing bank for trade", "JOD"], ["بنك دبي الإسلامي الأردن", "jordan dubai islamic bank|jdib", "JOD"],
  ["البنك الأهلي الكويتي الأردن", "", "JOD"], ["بنك الرافدين", "rafidain bank", "IQD"], ["بنك الرشيد", "rasheed bank", "IQD"],
  // Saudi Arabia (SAR)
  ["مصرف الراجحي", "al rajhi bank|alrajhi|rajhi", "SAR"], ["البنك الأهلي السعودي", "saudi national bank|snb|alahli|ncb", "SAR"],
  ["بنك الرياض", "riyad bank", "SAR"], ["البنك السعودي الأول", "saudi awwal bank|sab|sabb", "SAR"], ["مصرف الإنماء", "alinma bank|alinma", "SAR"],
  ["بنك البلاد", "bank albilad|albilad", "SAR"], ["بنك الجزيرة", "bank aljazira|aljazira", "SAR"], ["البنك العربي الوطني", "arab national bank|anb", "SAR"],
  ["البنك السعودي الفرنسي", "banque saudi fransi|bsf", "SAR"], ["البنك السعودي للاستثمار", "saudi investment bank|saib", "SAR"],
  // UAE (AED)
  ["بنك الإمارات دبي الوطني", "emirates nbd|enbd", "AED"], ["بنك أبوظبي الأول", "first abu dhabi bank|fab", "AED"],
  ["بنك أبوظبي التجاري", "abu dhabi commercial bank|adcb", "AED"], ["بنك دبي الإسلامي", "dubai islamic bank|dib", "AED"],
  ["بنك المشرق", "mashreq|mashreqbank", "AED"], ["بنك رأس الخيمة الوطني", "rakbank|rak bank", "AED"],
  ["مصرف أبوظبي الإسلامي", "abu dhabi islamic bank|adib", "AED"], ["بنك دبي التجاري", "commercial bank of dubai|cbd", "AED"],
  ["مصرف الإمارات الإسلامي", "emirates islamic", "AED"], ["بنك الفجيرة الوطني", "national bank of fujairah|nbf", "AED"],
  // Kuwait (KWD)
  ["بنك الكويت الوطني", "national bank of kuwait|nbk", "KWD"], ["بيت التمويل الكويتي", "kuwait finance house|kfh|بيتك", "KWD"],
  ["بنك الخليج", "gulf bank", "KWD"], ["بنك برقان", "burgan bank", "KWD"], ["بنك بوبيان", "boubyan bank", "KWD"],
  ["بنك وربة", "warba bank", "KWD"], ["البنك التجاري الكويتي", "commercial bank of kuwait|cbk", "KWD"], ["البنك الأهلي الكويتي", "al ahli bank of kuwait|abk", "KWD"],
  // Qatar (QAR)
  ["بنك قطر الوطني", "qnb|qatar national bank", "QAR"], ["البنك التجاري", "commercial bank|cbq", "QAR"], ["بنك الدوحة", "doha bank", "QAR"],
  ["مصرف قطر الإسلامي", "qatar islamic bank|qib", "QAR"], ["مصرف الريان", "masraf al rayan|al rayan", "QAR"], ["بنك دخان", "dukhan bank", "QAR"],
  // Bahrain (BHD)
  ["بنك البحرين الوطني", "national bank of bahrain|nbb", "BHD"], ["بنك البحرين والكويت", "bbk|bank of bahrain and kuwait", "BHD"],
  ["البنك الأهلي المتحد", "ahli united bank|aub", "BHD"], ["بنك البحرين الإسلامي", "bahrain islamic bank|bisb", "BHD"], ["بنك السلام", "al salam bank", "BHD"],
  // Oman (OMR)
  ["بنك مسقط", "bank muscat", "OMR"], ["البنك الوطني العماني", "national bank of oman|nbo", "OMR"], ["بنك ظفار", "bank dhofar", "OMR"],
  ["بنك صحار الدولي", "sohar international", "OMR"], ["البنك العربي العماني", "oman arab bank", "OMR"], ["بنك نزوى", "bank nizwa", "OMR"],
  // Egypt (EGP)
  ["البنك الأهلي المصري", "national bank of egypt|nbe", "EGP"], ["بنك مصر", "banque misr", "EGP"], ["البنك التجاري الدولي", "cib|commercial international bank", "EGP"],
  ["بنك القاهرة", "banque du caire", "EGP"], ["بنك الإسكندرية", "alexbank|bank of alexandria", "EGP"],
  // Palestine (ILS / JOD both used), Lebanon (LBP / USD)
  ["بنك فلسطين", "bank of palestine", "ILS"], ["البنك الإسلامي الفلسطيني", "palestine islamic bank", "ILS"], ["بنك القدس", "quds bank", "ILS"],
  ["بنك عودة", "bank audi", "LBP"], ["بنك بيبلوس", "byblos bank", "LBP"], ["بنك لبنان والمهجر", "blom bank", "LBP"],
];
const CUR_DEC: Record<string, number> = { JOD: 3, KWD: 3, BHD: 3, OMR: 3, IQD: 3, TND: 3, LYD: 3, SAR: 2, AED: 2, QAR: 2, EGP: 2, USD: 2, EUR: 2, ILS: 2, LBP: 2 };
const CUR_WORDS: [RegExp, string][] = [
  [/(دينار\s*كويتي|kuwaiti\s*dinar|\bkwd\b|د\.ك)/i, "KWD"], [/(دينار\s*بحريني|bahraini\s*dinar|\bbhd\b|د\.ب)/i, "BHD"], [/(دينار\s*عراقي|iraqi\s*dinar|\biqd\b)/i, "IQD"],
  [/(ريال\s*عماني|omani\s*rial|\bomr\b|ر\.ع)/i, "OMR"], [/(ريال\s*قطري|qatari\s*riyal|\bqar\b|ر\.ق)/i, "QAR"], [/(ريال\s*سعودي|saudi\s*riyal|\bsar\b|ر\.س)/i, "SAR"],
  [/(درهم|dirham|\baed\b|د\.إ)/i, "AED"], [/(جنيه|egyptian\s*pound|\begp\b)/i, "EGP"], [/(شيكل|شيقل|shekel|\bils\b|\bnis\b)/i, "ILS"],
  [/(دولار|dollar|\busd\b|\$)/i, "USD"], [/(دينار|dinar|\bjod\b|\bjd\b|د\.أ)/i, "JOD"], [/(ريال|riyal|rial)/i, "SAR"],
];
const bnorm = (s: string) => normAr(String(s || "").toLowerCase()).replace(/^(ال)/, "").replace(/[^؀-ۿa-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
function findBank(name: string) {
  const n = bnorm(name); if (n.length < 3) return null;
  // exact name first, then the longest bank name found inside what was read, then a name that contains what was read
  let best: [string, string, string] | null = null, score = 0;
  for (const b of BANKS) {
    for (const v of [b[0], ...b[1].split("|")].filter(Boolean)) {
      const x = bnorm(v); if (x.length < 3) continue;
      const sc = n === x ? 3000 : n.includes(x) ? 2000 + x.length : (x.includes(n) && n.length >= 5) ? 1000 - x.length : 0;
      if (sc > score) { best = b; score = sc; }
    }
  }
  return best ? { name: best[0], currency: best[2] } : null;
}
// specific = a currency named with its country (دينار كويتي، دولار، درهم...), not the bare word «دينار» or «ريال»
function currencyFrom(text: string, specific = false) {
  for (const [re, c] of CUR_WORDS) { if (specific && (c === "JOD" || re.source.startsWith("(ريال|"))) continue; if (re.test(String(text || ""))) return c; }
  return "";
}

// ---------- seeing: a photo of a receipt, a supplier invoice or a cheque → the fields to record
const PHOTO_TOOL = {
  name: "daftar_photo",
  description: "What this document is and the fields to record in Daftar.",
  input_schema: {
    type: "object",
    properties: {
      kind: { type: "string", enum: ["receipt", "supplier_invoice", "sales_invoice", "cheque", "other"], description: "receipt = a shop/fuel/restaurant receipt the owner paid; supplier_invoice = a bill from a supplier to the owner; sales_invoice = an invoice the owner issued to a customer; cheque = a bank cheque; other = not a money document." },
      reply: { type: "string", description: "One short sentence in the owner's language (Jordanian Arabic when Arabic) saying what was read, e.g. 'هاي فاتورة محطة بنزين بعشرين دينار'. No emoji." },
      merchant: { type: "string", description: "Shop, supplier or customer name printed on it." },
      seller: { type: "string", description: "Invoices/receipts: who issued it (the shop or company at the top / letterhead)." },
      buyer: { type: "string", description: "Invoices: who it is billed to (السيد / المطلوب من / Bill to / Customer), if printed." },
      dir: { type: "string", enum: ["in", "out"], description: "Money direction for the owner: in = the owner RECEIVES money (they issued the invoice, or the cheque is paid to them); out = the owner PAYS (a shop receipt, a supplier bill, a cheque they wrote)." },
      date: { type: "string", description: "Document date YYYY-MM-DD if printed." },
      total: { type: "number", description: "The final total to pay, as a plain decimal number in the document's currency (Jordanian amounts often have 3 decimals: 12.500 = twelve and a half). Never guess." },
      tax: { type: "number", description: "Tax amount if printed." },
      currency: { type: "string", description: "ISO code: printed currency, or the currency of the bank's country (Jordan JOD, Saudi SAR, UAE AED, Kuwait KWD, Qatar QAR, Bahrain BHD, Oman OMR, Egypt EGP, Iraq IQD)." },
      country: { type: "string", description: "Country of the shop or bank if you can tell (JO, SA, AE, KW, QA, BH, OM, EG, IQ, PS, LB)." },
      invoice_no: { type: "string", description: "Invoice or receipt number if printed." },
      items: { type: "array", maxItems: 30, items: { type: "object", properties: { name: { type: "string" }, qty: { type: "number" }, price: { type: "number", description: "unit price" } }, required: ["name"] } },
      category: { type: "string", description: "Closest expense category id from the given list (receipts and supplier invoices). Omit if unsure." },
      cheque: { type: "object", properties: {
        number: { type: "string", description: "The cheque serial number: printed at the top corner and as the first group of the magnetic (MICR) line at the bottom. Digits only." },
        bank: { type: "string", description: "Bank name exactly as printed (Arabic or English)." }, branch: { type: "string" },
        amount_digits: { type: "number", description: "The amount written in figures inside the amount box, as a decimal number." },
        amount_words: { type: "string", description: "The amount line written in words, copied as written (e.g. «فقط ألف وخمسمائة دينار لا غير»)." },
        amount: { type: "number", description: "Your best reading of the amount." },
        date_raw: { type: "string", description: "The date exactly as written on the cheque (digits as seen, e.g. 30/11/2026 or ٣٠/١١/٢٠٢٦)." },
        due_date: { type: "string", description: "The same date as YYYY-MM-DD. Dates on cheques in this region are day/month/year." },
        currency: { type: "string", description: "ISO code of the cheque's currency." },
        payee: { type: "string", description: "Who it is paid to (ادفعوا لأمر)." },
        drawer: { type: "string", description: "Whose account it is drawn on / the signer, if printed." },
        dir: { type: "string", enum: ["in", "out"], description: "in when it is paid to the owner's company (payee matches the company name), out when the owner's company wrote it (drawer matches the company)." },
      } },
    },
    required: ["kind", "reply"],
  },
};
function photoSystem(ctx: any) {
  return `You read photos of money documents for Daftar, an accounting app for small businesses in Jordan, the Gulf and the Arab world. Documents are in Arabic, English or both: printed thermal receipts, supplier invoices, and bank cheques (often handwritten).
Read carefully and only report what is printed or clearly handwritten. Never invent numbers. If something is unclear, leave it out and say so in the reply.
Digits may be Arabic-Indic (٠١٢٣٤٥٦٧٨٩) or Persian (۰۱۲۳۴۵۶۷۸۹): convert them to 0-9. A comma may separate thousands (1,250.500) or, rarely, decimals; Jordanian, Kuwaiti, Bahraini and Omani amounts have 3 decimals (12.500 = twelve and a half), Saudi, Emirati, Qatari and Egyptian amounts have 2.
Receipts: the total is the line marked المجموع / الإجمالي / المطلوب / الصافي / Total / Net / Amount due, after tax and discount. Ignore cash given and change (المدفوع / الباقي / Change).
Cheques in this region: the bank name and logo are at the top; «ادفعوا لأمر / Pay to the order of» is the payee; the amount appears twice, in figures inside a box and in words on a line («فقط ... لا غير» / «... only»); the date is day/month/year, often in small boxes; the serial number is printed at a top corner and again as the first group of digits on the magnetic line at the very bottom; the drawer's name (account holder) is printed under or near the signature. When the figures and the words disagree, the words are what counts legally: report both exactly as written.
The currency follows the bank's country unless another currency is printed or written (e.g. «دولار أمريكي»).
Kind: a cheque is a bank form with a bank name, «ادفعوا لأمر», an amount line in words and usually a magnetic number line; anything else listing items, prices and a total is a receipt or an invoice, even if it says «سند» or has a stamp.
Direction: compare names with the owner's company «${clip(ctx.company, 80) || "?"}». Cheque paid to that name → in; drawn by that name → out. Invoice issued by that name (letterhead) → in (sales_invoice); billed to that name → out (supplier_invoice). A shop, fuel, restaurant or supermarket receipt → out. If no name matches, give your best guess.
The owner's company is «${clip(ctx.company, 80) || "?"}». Today is ${ctx.today}. Reply in ${ctx.lang === "en" ? "English" : "Jordanian Arabic"}.
Expense categories: ${JSON.stringify(ctx.expense_categories)}`;
}
async function viaVision(sys: string, dataUrl: string, TOOLX: any = PHOTO_TOOL, maxTok = 1800) {
  const models = [env("VISION_MODEL") || "qwen/qwen3.8-27b", env("VISION_MODEL_2") || "meta-llama/llama-4-scout-17b-16e-instruct"];
  const user = { role: "user", content: [{ type: "text", text: `Read this document and call ${TOOLX.name}.` }, { type: "image_url", image_url: { url: dataUrl } }] };
  for (const model of models) {
    for (const mode of ["tool", "json"]) {
      const body: any = { model, temperature: 0, max_completion_tokens: maxTok, messages: [{ role: "system", content: sys }, user] };
      if (mode === "tool") { body.tools = [{ type: "function", function: { name: TOOLX.name, description: TOOLX.description, parameters: TOOLX.input_schema } }]; body.tool_choice = { type: "function", function: { name: TOOLX.name } }; }
      else { body.response_format = { type: "json_object" }; body.messages[0].content = sys + "\nAnswer with one JSON object with these fields: " + JSON.stringify(TOOLX.input_schema.properties); }
      const r = await fetch(`${groq()}/chat/completions`, { method: "POST", headers: { Authorization: `Bearer ${env("GROQ_API_KEY")}`, "content-type": "application/json" }, body: JSON.stringify(body) });
      if (!r.ok) { const e = (await r.text()).slice(0, 300); console.error("vision", model, mode, r.status, e); note("vision", `${model} ${mode} ${r.status} ${e}`); if (r.status === 429 || r.status >= 500) break; continue; }
      const out = await r.json(), msg = out.choices?.[0]?.message || {};
      try {
        if (mode === "tool") { const call = (msg.tool_calls || []).find((c: any) => c.function?.name === TOOLX.name); if (call) return JSON.parse(call.function.arguments || "{}"); }
        else { const txt = String(msg.content || "").replace(/^[^{]*/, "").replace(/[^}]*$/, ""); if (txt) return JSON.parse(txt); }
      } catch { console.error("vision bad json", model, mode); }
    }
  }
  return null;
}
async function photo(req: Request, body: any) {
  if (!env("GROQ_API_KEY")) return json(req, { err: "not_ready" }, 503);
  const img = String(body.image || "");
  if (img.length < 1000) return json(req, { err: "empty" }, 400);
  if (img.length > 7_000_000) return json(req, { err: "big" }, 413);
  if (!/^[A-Za-z0-9+/=]+$/.test(img.slice(0, 2000))) return json(req, { err: "bad" }, 400);
  const auth = req.headers.get("authorization") || "";
  const t = await take(auth, "ask");
  if (!t.ok) return json(req, { err: t.err || "limit" }, t.err === "auth" ? 401 : 429);
  const ctx = context(body.ctx);
  const out = await viaVision(photoSystem(ctx), "data:image/jpeg;base64," + img);
  if (!out) return json(req, { err: "ai" }, 502);
  const n = (v: any) => { if (typeof v === "string") v = Number(toLatinDigits(v).replace(/,/g, "")); return typeof v === "number" && isFinite(v) && v >= 0 && v < 1e9 ? Math.round(v * 1000) / 1000 : undefined; };
  const d = (v: any) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined);
  let ch = out.cheque && typeof out.cheque === "object" ? out.cheque : null;
  const flags: string[] = [];
  let currency = (clip(out.currency, 6) || "").toUpperCase();
  if (ch) {
    // a second, focused look when the amount isn't certain
    const bank0 = findBank(ch.bank || ""), cur0 = currencyFrom(ch.amount_words || "", true) || (bank0 && bank0.currency) || String(ch.currency || "").toUpperCase() || currency || currencyFrom(ch.amount_words || "");
    const w0 = amountFromWords(ch.amount_words || "", CUR_DEC[cur0] ?? 3), g0 = n(ch.amount_digits);
    if (w0 === null || g0 === undefined || Math.abs((w0 || 0) - (g0 || 0)) > 0.0005 || !ch.number || !ch.date_raw) {
      const again = await viaVision(photoSystem(ctx) + `\nSecond look, focus only on this cheque's amount box (figures), the amount line (words, copy it letter by letter), the date boxes and the serial number. A first reading gave figures=${g0 ?? "?"}, words=«${clip(ch.amount_words, 160) || "?"}», date=${clip(ch.date_raw, 20) || "?"}, number=${clip(ch.number, 30) || "?"}; correct anything that's wrong.`, "data:image/jpeg;base64," + img);
      if (again && again.cheque && typeof again.cheque === "object") { const a2 = again.cheque; ch = { ...ch, ...Object.fromEntries(Object.entries(a2).filter(([, v]) => v !== null && v !== undefined && v !== "")) }; }
    }
    const bank = findBank(ch.bank || "");
    // currency: a currency named on the cheque, else the bank's country, else what the model read, else the bare word
    const said = String(ch.currency || "").toUpperCase().match(/^[A-Z]{3}$/) ? String(ch.currency).toUpperCase() : "";
    const cur = currencyFrom(ch.amount_words || "", true) || (bank && bank.currency) || said || currency || currencyFrom(ch.amount_words || "");
    const words = amountFromWords(ch.amount_words || "", CUR_DEC[cur] ?? 3), digits = n(ch.amount_digits) ?? n(ch.amount);
    let amount = digits;
    if (words !== null && words > 0) {
      if (digits === undefined) amount = words;
      else if (Math.abs(words - digits) > 0.0005) { amount = words; flags.push("amount_mismatch"); }
    } else if (digits !== undefined) flags.push("amount_words_unread");
    if (amount === undefined) flags.push("amount_missing");
    // the date: trust what was written (day/month/year) over the model's own conversion
    let due = d(ch.due_date);
    const raw = toLatinDigits(String(ch.date_raw || "")).replace(/\s/g, ""), m = raw.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/);
    if (m) { let y = Number(m[3]); if (y < 100) y += 2000; const dd = Number(m[1]), mm = Number(m[2]); if (dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12) due = `${y}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`; }
    if (!due) flags.push("date_missing");
    const num = toLatinDigits(String(ch.number || "")).replace(/\D/g, "").slice(0, 20);
    if (!num) flags.push("number_missing");
    ch = { ...ch, number: num, bank: bank ? bank.name : clip(ch.bank, 40), amount, due_date: due, currency: cur };
    currency = cur;
  } else {
    currency = (currency.match(/^[A-Z]{3}$/) ? currency : "") || "";
  }
  if (ctx.cur_code && currency && currency !== ctx.cur_code) flags.push("other_currency");
  // who receives the money: decided from the names when the owner's company name appears on it
  let kind = ["receipt", "supplier_invoice", "sales_invoice", "cheque", "other"].includes(out.kind) ? out.kind : "other";
  if (ch && kind !== "cheque" && (ch.number || ch.amount_words)) kind = "cheque";
  const co = bnorm(ctx.company || ""), same = (x: any) => { const v = bnorm(String(x || "")); return co.length >= 3 && v.length >= 3 && (v.includes(co) || (co.includes(v) && v.length >= 5)); };
  let dir = out.dir === "in" || out.dir === "out" ? out.dir : (kind === "sales_invoice" ? "in" : kind === "cheque" ? (ch && ch.dir === "out" ? "out" : "in") : "out");
  let dirSure = false;
  if (kind === "cheque" && ch) { if (same(ch.payee)) { dir = "in"; dirSure = true; } else if (same(ch.drawer)) { dir = "out"; dirSure = true; } }
  else if (kind !== "other") {
    if (same(out.seller)) { dir = "in"; dirSure = true; } else if (same(out.buyer)) { dir = "out"; dirSure = true; } else if (kind === "receipt") { dir = "out"; dirSure = true; }
    kind = dir === "in" ? "sales_invoice" : (kind === "sales_invoice" ? "supplier_invoice" : kind);
  }
  if (ch) ch = { ...ch, dir };
  return json(req, { flags, currency, dir, dir_sure: dirSure, seller: clip(out.seller, 80), buyer: clip(out.buyer, 80),
    kind,
    reply: clip(out.reply, 300), merchant: clip(out.merchant, 80), date: d(out.date), total: n(out.total), tax: n(out.tax),
    invoice_no: clip(out.invoice_no, 40), category: clip(out.category, 40),
    items: (Array.isArray(out.items) ? out.items : []).slice(0, 30).map((x: any) => ({ name: clip(x && x.name, 80), qty: n(x && x.qty), price: n(x && x.price) })).filter((x: any) => x.name),
    cheque: ch ? { number: clip(ch.number, 30), bank: clip(ch.bank, 40), branch: clip(ch.branch, 40), amount: n(ch.amount), amount_words: clip(ch.amount_words, 200), due_date: d(ch.due_date), payee: clip(ch.payee, 80), drawer: clip(ch.drawer, 80), currency: clip(ch.currency, 3), dir: ch.dir === "out" ? "out" : "in" } : null,
    left: t.left,
  });
}

// ---------- bank statements and bank app screenshots → a list of transactions
const STATEMENT_TOOL = {
  name: "daftar_statement",
  description: "Every transaction line on this bank statement or bank app screen.",
  input_schema: {
    type: "object",
    properties: {
      is_statement: { type: "boolean", description: "true when this is a bank statement, account history or bank/wallet app transactions screen." },
      bank: { type: "string", description: "Bank or wallet name if shown." },
      currency: { type: "string", description: "ISO code of the account currency." },
      reply: { type: "string", description: "One short line for the owner, e.g. «لقيت 12 حركة بالكشف»." },
      rows: { type: "array", maxItems: 80, items: { type: "object", properties: {
        date: { type: "string", description: "YYYY-MM-DD. Statement dates here are day/month/year." },
        desc: { type: "string", description: "The description as printed, shortened (who / what)." },
        out: { type: "number", description: "Money out of the account (مدين / سحب / Debit / Withdrawal / minus sign)." },
        in: { type: "number", description: "Money into the account (دائن / إيداع / Credit / Deposit / plus sign)." },
        category: { type: "string", description: "For money out: closest expense category id from the list. Omit if unsure." },
      } } },
    },
    required: ["is_statement", "rows"],
  },
};
function statementSystem(ctx: any) {
  return `You read bank statements and screenshots of bank or wallet apps for Daftar, an accounting app for small businesses in Jordan, the Gulf and the Arab world (Arabic, English or both).
List every transaction line, top to bottom. Each line has money out OR money in, never both. Debit / مدين / سحب / a minus sign = out; Credit / دائن / إيداع / a plus sign = in. Ignore the running balance column (الرصيد / Balance) and the opening and closing balance lines, totals and headers.
Digits may be Arabic-Indic: convert them. Jordanian, Kuwaiti, Bahraini and Omani amounts have 3 decimals. Dates are day/month/year. Never invent a line or an amount; skip a line you can't read.
Today is ${ctx.today}. Reply in ${ctx.lang === "en" ? "English" : "Jordanian Arabic"}.
Expense categories: ${JSON.stringify(ctx.expense_categories)}`;
}
async function statement(req: Request, body: any) {
  if (!env("GROQ_API_KEY")) return json(req, { err: "not_ready" }, 503);
  const img = String(body.image || "");
  if (img.length < 1000) return json(req, { err: "empty" }, 400);
  if (img.length > 7_000_000) return json(req, { err: "big" }, 413);
  if (!/^[A-Za-z0-9+/=]+$/.test(img.slice(0, 2000))) return json(req, { err: "bad" }, 400);
  const auth = req.headers.get("authorization") || "";
  const t = await take(auth, "ask");
  if (!t.ok) return json(req, { err: t.err || "limit" }, t.err === "auth" ? 401 : 429);
  const ctx = context(body.ctx);
  const out = await viaVision(statementSystem(ctx), "data:image/jpeg;base64," + img, STATEMENT_TOOL, 4000);
  if (!out) return json(req, { err: "ai" }, 502);
  const n = (v: any) => { if (typeof v === "string") v = Number(toLatinDigits(v).replace(/,/g, "")); return typeof v === "number" && isFinite(v) && v > 0 && v < 1e9 ? Math.round(v * 1000) / 1000 : 0; };
  const d = (v: any) => {
    const s = toLatinDigits(String(v || "")).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})$/);
    if (m) { let y = Number(m[3]); if (y < 100) y += 2000; const dd = Number(m[1]), mm = Number(m[2]); if (dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12) return `${y}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`; }
    return "";
  };
  const bank = findBank(String(out.bank || ""));
  const said = String(out.currency || "").toUpperCase();
  const currency = /^[A-Z]{3}$/.test(said) ? said : (bank ? bank.currency : "");
  const rows = (Array.isArray(out.rows) ? out.rows : []).slice(0, 80).map((r: any) => {
    const o = n(r && r.out), i = n(r && r.in);
    if (!o && !i) return null;
    return { date: d(r.date), desc: clip(r.desc, 80), dir: o ? "out" : "in", amount: o || i, category: o ? clip(r.category, 40) : "" };
  }).filter(Boolean);
  const flags: string[] = [];
  if (ctx.cur_code && currency && currency !== ctx.cur_code) flags.push("other_currency");
  return json(req, { is_statement: out.is_statement !== false && rows.length > 0, bank: bank ? bank.name : clip(out.bank, 40), currency, reply: clip(out.reply, 200), rows, flags, left: t.left });
}

// ---------- speaking
const voiceOn = () => !!((env("ELEVENLABS_API_KEY") && env("ELEVENLABS_VOICE_ID")) || (env("GROQ_API_KEY") && env("GROQ_TTS") !== "off"));
// what a voice can read: no emoji or symbols, and at most ~200 characters cut at a pause
function sayable(text: string, n: number) {
  let s = String(text).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}✓✔]/gu, "").replace(/\s+/g, " ").trim();
  if (s.length <= n) return s;
  const cut = s.slice(0, n), at = Math.max(cut.lastIndexOf("،"), cut.lastIndexOf("."), cut.lastIndexOf("؟"), cut.lastIndexOf("?"), cut.lastIndexOf(","), cut.lastIndexOf("!"));
  return (at > n * 0.5 ? cut.slice(0, at + 1) : cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : n)).trim();
}
async function speech(text: string, lang: string): Promise<{ buf: ArrayBuffer; type: string } | null> {
  const key = env("ELEVENLABS_API_KEY"), voice = env("ELEVENLABS_VOICE_ID");
  if (key && voice) {
    const r = await fetch(`${env("ELEVENLABS_URL") || "https://api.elevenlabs.io"}/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_44100_64`, {
      method: "POST",
      headers: { "xi-api-key": key, "content-type": "application/json", accept: "audio/mpeg" },
      body: JSON.stringify({ text: sayable(text, 320), model_id: env("ELEVENLABS_MODEL") || "eleven_multilingual_v2", voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true } }),
    });
    if (r.ok) return { buf: await r.arrayBuffer(), type: "audio/mpeg" };
    console.error("elevenlabs", r.status, (await r.text()).slice(0, 300));
  }
  if (!env("GROQ_API_KEY") || env("GROQ_TTS") === "off") return null;
  const en = lang === "en";
  const model = en ? (env("GROQ_TTS_MODEL_EN") || "canopylabs/orpheus-v1-english") : (env("GROQ_TTS_MODEL") || "canopylabs/orpheus-arabic-saudi");
  const v = en ? (env("GROQ_VOICE_EN") || "troy") : (env("GROQ_VOICE") || "fahad");
  const input = sayable(text, 195);
  if (input.length < 2) return null;
  for (const name of [v, v.charAt(0).toUpperCase() + v.slice(1)]) {
    const r = await fetch(`${groq()}/audio/speech`, {
      method: "POST",
      headers: { Authorization: `Bearer ${env("GROQ_API_KEY")}`, "content-type": "application/json" },
      body: JSON.stringify({ model, input, voice: name, response_format: "wav" }),
    });
    if (r.ok) { LAST.tts = ""; return { buf: await r.arrayBuffer(), type: "audio/wav" }; }
    const e = (await r.text()).slice(0, 300); console.error("groq tts", name, r.status, e); note("tts", `${model} ${name} ${r.status} ${e}`);
    if (r.status !== 400 && r.status !== 404) break;
  }
  return null;
}

async function tts(req: Request, body: any) {
  if (!voiceOn()) return json(req, { err: "not_ready" }, 503);
  const text = clip(body.text, 320);
  if (text.length < 2) return json(req, { err: "empty" }, 400);
  const t = await take(req.headers.get("authorization") || "", "tts");
  if (!t.ok) return json(req, { err: t.err || "limit" }, t.err === "auth" ? 401 : 429);
  const sp = await speech(text, body.lang === "en" ? "en" : "ar");
  if (!sp) return json(req, { err: "tts" }, 502);
  return new Response(sp.buf, { headers: { ...cors(req), "Content-Type": sp.type, "Cache-Control": "no-store" } });
}

export async function handle(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  if (req.method !== "POST") return json(req, { err: "method" }, 405);
  let body: any = {};
  try { body = await req.json(); } catch { return json(req, { err: "bad" }, 400); }
  if (body.mode === "health") return json(req, { ai: !!provider(), via: provider(), hear: !!env("GROQ_API_KEY"), voice: voiceOn(), version: 9, see: !!env("GROQ_API_KEY"), last_errors: LAST });
  try {
    if (body.mode === "tts") return await tts(req, body);
    if (body.mode === "talk") return await talk(req, body);
    if (body.mode === "photo") return await photo(req, body);
    if (body.mode === "statement") return await statement(req, body);
    return await ask(req, body);
  } catch (e) { console.error(e); return json(req, { err: "server" }, 500); }
}
(globalThis as any).Deno?.serve?.(handle);
