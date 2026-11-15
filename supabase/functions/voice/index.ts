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
            type: { type: "string", enum: ["expense", "income", "stock", "advance", "attendance", "ask"] },
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
            metric: { type: "string", enum: ["profit", "expenses", "income", "salaries"], description: "ask: what they want to know." },
            period: { type: "string", enum: ["today", "week", "month", "last_month"], description: "ask: the period." },
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
- Questions like "قديش ربحت هالشهر؟" are an "ask" action; the app does the math, so reply with something like "لحظة، هاي النتيجة" without numbers.
- Use only ids that appear in the lists. Pick the closest category id for the kind; if nothing fits, omit category.
- This is a back-and-forth conversation. If the owner is answering your last question (a missing amount, which worker, which project) or correcting you, combine it with what was said before and return the complete list of actions again.
- Today is ${ctx.today}. Reply in ${ctx.lang === "en" ? "English" : "Jordanian Arabic"}, at most 25 words, warm and natural like a helpful assistant at the shop, and end with a short request to confirm when there is something to save.

Business data (JSON): ${JSON.stringify({ projects: ctx.units, staff: ctx.staff, stock_items: ctx.items, expense_categories: ctx.expense_categories, income_categories: ctx.income_categories })}`;
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
    units: list(c.units, 40), staff: list(c.staff, 80), items: list(c.items, 150), expense_categories: cats(c.cats?.exp), income_categories: cats(c.cats?.inc) };
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
const LAST: { stt: string; tts: string; ai: string } = { stt: "", tts: "", ai: "" };
const note = (k: "stt" | "tts" | "ai", m: string) => { LAST[k] = `${new Date().toISOString().slice(0, 19)} ${m}`.slice(0, 300); };

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
  if (body.mode === "health") return json(req, { ai: !!provider(), via: provider(), hear: !!env("GROQ_API_KEY"), voice: voiceOn(), version: 5, last_errors: LAST });
  try {
    if (body.mode === "tts") return await tts(req, body);
    if (body.mode === "talk") return await talk(req, body);
    return await ask(req, body);
  } catch (e) { console.error(e); return json(req, { err: "server" }, 500); }
}
(globalThis as any).Deno?.serve?.(handle);
