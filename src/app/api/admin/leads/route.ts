import { isAdmin } from "@/lib/admin-auth";
import { deleteLead, listLeads } from "@/lib/leads";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return Response.json({ error: "Not logged in." }, { status: 401 });
  try {
    return Response.json({ leads: await listLeads() });
  } catch (e) {
    console.error("[leads] listar falhou", e);
    return Response.json({ error: "Could not load messages." }, { status: 502 });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Not logged in." }, { status: 401 });
  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  try {
    await deleteLead(String(id ?? ""));
  } catch {
    return Response.json({ error: "Could not delete." }, { status: 400 });
  }
  return Response.json({ ok: true });
}
