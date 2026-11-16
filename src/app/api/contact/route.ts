import nodemailer from "nodemailer";
import { contactEmailHtml, contactEmailText } from "@/lib/contact-email";

// Recebe o formulário de contato e manda pro e-mail pelo Gmail (mesmo esquema do portfólio).
// Precisa na Vercel: GMAIL_USER (dev.barr4k@gmail.com) e GMAIL_APP_PASSWORD (senha de app do Google, não a senha da conta).
// Opcional: CONTACT_TO (quem recebe; padrão = dev.barr4k@gmail.com).
export const runtime = "nodejs";

const DEFAULT_TO = "dev.barr4k@gmail.com";
const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // robô preencheu a isca: finge que deu certo
  if (clean(body.website, 200)) return Response.json({ ok: true });

  const lead = {
    name: clean(body.name, 200),
    email: clean(body.email, 200),
    company: clean(body.company, 200),
    message: clean(body.message, 1000),
    topics: Array.isArray(body.topics) ? body.topics.filter((t) => typeof t === "string").slice(0, 5).map((t) => clean(t, 40)) : [],
  };

  if (!lead.name || !lead.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return Response.json({ error: "Please fill in your name, a valid email and a message." }, { status: 400 });
  }

  const user = process.env.GMAIL_USER;
  // senha de app do Google = 16 letras; tira espaços/aspas que vêm junto ao colar
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/[\s"'`]/g, "");
  if (!user || !pass) {
    console.error("[contact] GMAIL_USER/GMAIL_APP_PASSWORD não configurados", { name: lead.name, email: lead.email });
    return Response.json({ error: "" }, { status: 503 });
  }

  try {
    const transporter = nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
    await transporter.sendMail({
      from: `"BB Agency – Site" <${user}>`,
      to: process.env.CONTACT_TO || DEFAULT_TO,
      replyTo: `"${lead.name.replace(/"/g, "")}" <${lead.email}>`,
      subject: `New contact: ${lead.name}${lead.company ? ` (${lead.company})` : ""}`,
      text: contactEmailText(lead),
      html: contactEmailHtml(lead),
    });
  } catch (e) {
    console.error("[contact] gmail falhou", e);
    // TEMP: diagnóstico (remover depois)
    const err = e as { responseCode?: number; message?: string };
    const dbg = new URL(req.url).searchParams.has("diag") ? { responseCode: err.responseCode, message: err.message?.slice(0, 120), passLen: pass.length, passShape: pass.replace(/[a-z]/g, "").replace(/[A-Z]/g, "A").replace(/[0-9]/g, "9").replace(/[^A9]/g, "#") } : undefined;
    return Response.json({ error: "", dbg }, { status: 502 });
  }
  return Response.json({ ok: true });
}
