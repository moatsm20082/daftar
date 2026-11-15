// Daftar voice assistant (Supabase Edge Function "voice").
//  - mode "ask": the user's words (already turned into text on the phone) → Claude → a short spoken reply
//    plus the records to save. Nothing is saved here: the app shows what was understood and saves only after
//    the user confirms.
//  - mode "tts": a short reply → speech (ElevenLabs), so Daftar answers with a real human-sounding voice.
// Secrets (Edge Function env): ANTHROPIC_API_KEY, ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID (optional: VOICE_MODEL).
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

async function ask(req: Request, body: any) {
  const key = env("ANTHROPIC_API_KEY");
  if (!key) return json(req, { err: "not_ready" }, 503);
  const text = clip(body.text, 600);
  if (text.length < 2) return json(req, { err: "empty" }, 400);
  const c = body.ctx || {};
  const list = (a: any, n: number) => (Array.isArray(a) ? a : []).slice(0, n).map((x: any) => ({ id: clip(x.id, 60), name: clip(x.name, 60) }));
  const cats = (a: any) => (Array.isArray(a) ? a : []).slice(0, 40).map((x: any) => ({ id: clip(x.id, 40), label: clip(x.label, 40) }));
  const ctx = { today: /^\d{4}-\d{2}-\d{2}$/.test(c.today) ? c.today : new Date().toISOString().slice(0, 10), lang: c.lang === "en" ? "en" : "ar", currency: clip(c.currency, 20),
    units: list(c.units, 40), staff: list(c.staff, 80), items: list(c.items, 150), expense_categories: cats(c.cats?.exp), income_categories: cats(c.cats?.inc) };
  const t = await take(req.headers.get("authorization") || "", "ask");
  if (!t.ok) return json(req, { err: t.err || "limit" }, t.err === "auth" ? 401 : 429);
  const r = await fetch(env("ANTHROPIC_URL") || "https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({
      model: env("VOICE_MODEL") || "claude-haiku-5-5", max_tokens: 700, temperature: 0,
      system: system(ctx), tools: [TOOL], tool_choice: { type: "tool", name: "daftar_actions" },
      messages: convo(body.history, text),
    }),
  });
  if (!r.ok) { console.error("anthropic", r.status, (await r.text()).slice(0, 300)); return json(req, { err: "ai" }, 502); }
  const out = await r.json();
  const use = (out.content || []).find((b: any) => b.type === "tool_use" && b.name === "daftar_actions");
  if (!use) return json(req, { err: "ai" }, 502);
  const inp = use.input || {};
  return json(req, { reply: clip(inp.reply, 400), actions: Array.isArray(inp.actions) ? inp.actions.slice(0, 8) : [], left: t.left });
}

async function tts(req: Request, body: any) {
  const key = env("ELEVENLABS_API_KEY"), voice = env("ELEVENLABS_VOICE_ID");
  if (!key || !voice) return json(req, { err: "not_ready" }, 503);
  const text = clip(body.text, 320);
  if (text.length < 2) return json(req, { err: "empty" }, 400);
  const t = await take(req.headers.get("authorization") || "", "tts");
  if (!t.ok) return json(req, { err: t.err || "limit" }, t.err === "auth" ? 401 : 429);
  const r = await fetch(`${env("ELEVENLABS_URL") || "https://api.elevenlabs.io"}/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_44100_64`, {
    method: "POST",
    headers: { "xi-api-key": key, "content-type": "application/json", accept: "audio/mpeg" },
    body: JSON.stringify({ text, model_id: env("ELEVENLABS_MODEL") || "eleven_multilingual_v2", voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true } }),
  });
  if (!r.ok) { console.error("elevenlabs", r.status, (await r.text()).slice(0, 300)); return json(req, { err: "tts" }, 502); }
  return new Response(await r.arrayBuffer(), { headers: { ...cors(req), "Content-Type": "audio/mpeg", "Cache-Control": "no-store" } });
}

export async function handle(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(req) });
  if (req.method !== "POST") return json(req, { err: "method" }, 405);
  let body: any = {};
  try { body = await req.json(); } catch { return json(req, { err: "bad" }, 400); }
  if (body.mode === "health") return json(req, { ai: !!env("ANTHROPIC_API_KEY"), voice: !!(env("ELEVENLABS_API_KEY") && env("ELEVENLABS_VOICE_ID")), version: 2 });
  try {
    if (body.mode === "tts") return await tts(req, body);
    return await ask(req, body);
  } catch (e) { console.error(e); return json(req, { err: "server" }, 500); }
}
(globalThis as any).Deno?.serve?.(handle);
