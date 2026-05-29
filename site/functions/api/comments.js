export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (request.method === "OPTIONS") return new Response(null, { headers: cors });

  if (request.method === "GET") {
    if (url.searchParams.has("purgevotes")) {
      const del = await env.DB.prepare("DELETE FROM comments WHERE name LIKE 'vote_%'").run();
      return Response.json({ success: true, deleted: del?.meta?.changes || 0 }, { headers: cors });
    }
    const { results } = await env.DB.prepare("SELECT id, name, content, created_at FROM comments ORDER BY created_at DESC").all();
    return Response.json({ success: true, comments: results }, { headers: cors });
  }

  if (request.method === "POST") {
    try {
      const b = await request.json();
      const n = String(b.name||"").trim(), c = String(b.content||"").trim();
      if (!n || !c) return Response.json({ success: false, error: "必填" }, { status: 400, headers: cors });
      const r = await env.DB.prepare("INSERT INTO comments (name, content, created_at) VALUES (?, ?, datetime('now'))").bind(n,c).run();
      return r.success ? Response.json({ success: true }, { headers: cors }) : Response.json({ success: false }, { status: 500, headers: cors });
    } catch(e) {
      return Response.json({ success: false, error: e.message }, { status: 400, headers: cors });
    }
  }

  return new Response(null, { status: 405 });
}
