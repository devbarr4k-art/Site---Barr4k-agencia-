import "server-only";
import { del, list, put } from "@vercel/blob";

// Contatos do formulário: cada um vira um arquivo no Vercel Blob (leads/...json) e aparece na caixa de entrada do /admin.
// O nome do arquivo leva um sufixo aleatório, então o link não dá pra adivinhar; só o painel (com a chave) lista.
export type Lead = {
  id: string; // = url do arquivo
  at: string; // ISO
  name: string;
  email: string;
  company: string;
  chatApp: "Telegram" | "Discord" | "WhatsApp";
  chat: string;
  topics: string[];
  message: string;
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Valida o que veio do formulário; devolve null se faltar algo obrigatório */
export function cleanLead(raw: unknown): Omit<Lead, "id" | "at"> | null {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const lead = {
    name: str(r.name, 120),
    email: str(r.email, 200),
    company: str(r.company, 200),
    chatApp: (r.chatApp === "Discord" || r.chatApp === "WhatsApp" ? r.chatApp : "Telegram") as Lead["chatApp"],
    chat: str(r.chat, 60).replace(/^@/, ""),
    topics: Array.isArray(r.topics) ? r.topics.filter((t): t is string => typeof t === "string").slice(0, 6).map((t) => t.slice(0, 40)) : [],
    message: str(r.message, 2000),
  };
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) lead.email = "";
  if (!lead.name || !lead.message || (!lead.email && !lead.chat)) return null;
  return lead;
}

export async function saveLead(lead: Omit<Lead, "id" | "at">) {
  const at = new Date().toISOString();
  // nome começa pela data invertida → a listagem já vem do mais novo pro mais velho
  const rev = String(9999999999999 - Date.now()).padStart(13, "0");
  await put(`leads/${rev}.json`, JSON.stringify({ ...lead, at }), {
    access: "public",
    addRandomSuffix: true,
    contentType: "application/json",
  });
}

export async function listLeads(): Promise<Lead[]> {
  const { blobs } = await list({ prefix: "leads/", limit: 300 });
  const items = await Promise.all(
    blobs.map(async (b) => {
      try {
        const r = await fetch(b.url, { cache: "no-store" });
        if (!r.ok) return null;
        const d = (await r.json()) as Omit<Lead, "id">;
        return { ...d, id: b.url, at: d.at || b.uploadedAt.toISOString() } as Lead;
      } catch {
        return null;
      }
    })
  );
  return items.filter((x): x is Lead => !!x).sort((a, b) => b.at.localeCompare(a.at));
}

export async function deleteLead(url: string) {
  if (!/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/leads\//i.test(url)) throw new Error("invalid");
  await del(url);
}
