import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Senha do painel = variável ADMIN_PASSWORD na Vercel. O cookie guarda só um hash dela.
export const COOKIE = "bb_admin";
const sign = (pass: string) => createHmac("sha256", pass).update("bb-agency-admin").digest("hex");

export const adminConfigured = () => Boolean(process.env.ADMIN_PASSWORD);

export function passwordOk(input: string) {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return false;
  const a = Buffer.from(sign(input));
  const b = Buffer.from(sign(pass));
  return a.length === b.length && timingSafeEqual(a, b);
}

export const sessionValue = () => sign(process.env.ADMIN_PASSWORD ?? "");

export async function isAdmin() {
  const pass = process.env.ADMIN_PASSWORD;
  if (!pass) return false;
  const v = (await cookies()).get(COOKIE)?.value ?? "";
  const good = sign(pass);
  return v.length === good.length && timingSafeEqual(Buffer.from(v), Buffer.from(good));
}
