// Recebe o formulário de contato e manda por e-mail via Resend.
// Precisa na Vercel: RESEND_API_KEY e CONTACT_TO (e-mail que recebe). Opcional: CONTACT_FROM (remetente de domínio verificado).
export const runtime = "nodejs";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // robô preencheu a isca: finge que deu certo
  if (clean(body.website, 200)) return Response.json({ ok: true });

  const name = clean(body.name, 200);
  const email = clean(body.email, 200);
  const company = clean(body.company, 200);
  const message = clean(body.message, 1000);
  const topics = Array.isArray(body.topics) ? body.topics.filter((t) => typeof t === "string").slice(0, 5).map((t) => clean(t, 40)) : [];

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please fill in your name, a valid email and a message." }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!key || !to) {
    console.error("[contact] RESEND_API_KEY/CONTACT_TO não configurados", { name, email, company, topics });
    return Response.json({ error: "" }, { status: 503 });
  }

  const html = `
    <h2>New contact – BB Agency site</h2>
    <p><b>Name:</b> ${esc(name)}<br><b>Email:</b> ${esc(email)}<br><b>Company:</b> ${esc(company || "-")}<br><b>Topics:</b> ${esc(topics.join(", ") || "-")}</p>
    <p style="white-space:pre-wrap">${esc(message)}</p>`;

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "BB Agency <onboarding@resend.dev>",
      to: to.split(",").map((s) => s.trim()),
      reply_to: email,
      subject: `New contact: ${name}${company ? ` (${company})` : ""}`,
      html,
    }),
  });
  if (!r.ok) {
    console.error("[contact] resend falhou", r.status, await r.text());
    return Response.json({ error: "" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
