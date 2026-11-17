import { revalidatePath, revalidateTag } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { blobReady, CONTENT_TAG, sanitize, saveContent } from "@/lib/content";

export async function PUT(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Not logged in." }, { status: 401 });
  if (!blobReady()) return Response.json({ error: "Storage not connected yet." }, { status: 503 });
  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "Invalid data." }, { status: 400 });
  const content = sanitize(body);
  try {
    await saveContent(content);
  } catch (e) {
    console.error("[admin] salvar falhou", e);
    return Response.json({ error: "Could not save. Try again." }, { status: 502 });
  }
  revalidateTag(CONTENT_TAG, { expire: 0 });
  revalidatePath("/");
  return Response.json({ ok: true, content });
}
