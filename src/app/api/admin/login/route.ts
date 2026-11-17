import { cookies } from "next/headers";
import { COOKIE, passwordOk, sessionValue } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  if (typeof password !== "string" || !passwordOk(password)) {
    await new Promise((r) => setTimeout(r, 800)); // segura chute de senha
    return Response.json({ error: "Wrong password." }, { status: 401 });
  }
  (await cookies()).set(COOKIE, sessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return Response.json({ ok: true });
}

export async function DELETE() {
  (await cookies()).delete(COOKIE);
  return Response.json({ ok: true });
}
