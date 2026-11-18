import { blobReady } from "@/lib/content";
import { cleanLead, saveLead } from "@/lib/leads";

// Recebe o formulário de contato e guarda na caixa de entrada do /admin.
const hits = new Map<string, number[]>(); // freio simples contra robô (por instância)

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Invalid request." }, { status: 400 });

  // robô preencheu a isca: finge que deu certo
  if (typeof body.website === "string" && body.website) return Response.json({ ok: true });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "?";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (recent.length >= 5) return Response.json({ error: "Too many messages, try again in a few minutes." }, { status: 429 });
  hits.set(ip, [...recent, now]);

  const lead = cleanLead(body);
  if (!lead) return Response.json({ error: "Please fill in your name, a contact and a message." }, { status: 400 });
  if (!blobReady()) return Response.json({ error: "" }, { status: 503 });

  try {
    await saveLead(lead);
  } catch (e) {
    console.error("[contact] salvar falhou", e);
    return Response.json({ error: "" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
