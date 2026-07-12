import { getStore } from "@netlify/blobs";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};
const KV = ["settings", "teams", "accounts", "custom"];

export default async (req) => {
  const store = getStore({ name: "tbm-data", consistency: "strong" });
  if (req.method === "OPTIONS") return new Response("", { headers: CORS });
  try {
    if (req.method === "GET") {
      const { blobs } = await store.list();
      const out = { settings: null, teams: null, accounts: null, custom: null, records: [] };
      for (const b of blobs) {
        if (b.key.startsWith("kv:")) {
          const k = b.key.slice(3);
          if (KV.includes(k)) out[k] = await store.get(b.key, { type: "json" });
        } else if (b.key.startsWith("rec:")) {
          const v = await store.get(b.key, { type: "json" });
          if (v) out.records.push(v);
        }
      }
      return json(out);
    }
    if (req.method === "POST") {
      const body = await req.json();
      const op = body.op;
      if (op === "kv" && KV.includes(body.key)) {
        await store.setJSON("kv:" + body.key, body.val);
      } else if (op === "rec" && body.rec && body.rec.id) {
        await store.setJSON("rec:" + body.rec.id, body.rec);
      } else if (op === "delRec" && body.id) {
        await store.delete("rec:" + body.id);
      } else if (op === "clearRecords") {
        const { blobs } = await store.list();
        for (const b of blobs) if (b.key.startsWith("rec:")) await store.delete(b.key);
      } else if (op === "bulk" && body.data) {
        const { blobs } = await store.list();
        for (const b of blobs) if (b.key.startsWith("rec:")) await store.delete(b.key);
        for (const k of KV) if (body.data[k] !== undefined) await store.setJSON("kv:" + k, body.data[k]);
        for (const r of (body.data.records || [])) if (r && r.id) await store.setJSON("rec:" + r.id, r);
      }
      return json({ ok: true });
    }
    return new Response("Method Not Allowed", { status: 405, headers: CORS });
  } catch (e) {
    return json({ error: String(e && e.message || e) }, 500);
  }
};
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { ...CORS, "Content-Type": "application/json" } });
}
