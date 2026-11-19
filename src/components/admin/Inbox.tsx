"use client";

import { useCallback, useEffect, useState } from "react";
import { Copy, Loader2, Mail, RefreshCw, Trash2 } from "lucide-react";
import { FaDiscord, FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import { useConfirm } from "./Confirm";

type Lead = {
  id: string;
  at: string;
  name: string;
  email: string;
  company: string;
  chatApp: "Telegram" | "Discord" | "WhatsApp";
  chat: string;
  topics: string[];
  message: string;
};

const SEEN_KEY = "bb_inbox_seen";
const readSeen = () => {
  try {
    return localStorage.getItem(SEEN_KEY) || "";
  } catch {
    return "";
  }
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

/** Caixa de entrada: mensagens do formulário "Let's talk" do site */
export default function Inbox({ onCount }: { onCount?: (n: number) => void }) {
  const ask = useConfirm();
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [err, setErr] = useState("");
  const [seen, setSeen] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState("");

  const load = useCallback(async () => {
    setBusy(true);
    setErr("");
    const r = await fetch("/api/admin/leads", { cache: "no-store" }).catch(() => null);
    const d = r?.ok ? ((await r.json()) as { leads: Lead[] }) : null;
    setBusy(false);
    if (!d) return setErr(r?.status === 401 ? "Session expired, reload the page and log in again." : "Could not load messages. Try again.");
    const prev = readSeen();
    setSeen(prev);
    setLeads(d.leads);
    onCount?.(d.leads.filter((l) => l.at > prev).length);
    // abriu a caixa = viu tudo até agora (o "New" some na próxima visita)
    try {
      if (d.leads[0]) localStorage.setItem(SEEN_KEY, d.leads[0].at);
    } catch {}
  }, [onCount]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  async function remove(l: Lead) {
    if (!(await ask(`Delete the message from ${l.name}?`))) return;
    const r = await fetch("/api/admin/leads", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: l.id }) }).catch(() => null);
    if (r?.ok) setLeads((cur) => cur?.filter((x) => x.id !== l.id) ?? null);
    else setErr("Could not delete. Try again.");
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(""), 1500);
    } catch {}
  }

  return (
    <section>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-amber">Let&apos;s talk</p>
          <h2 className="display mt-2 text-4xl">Inbox</h2>
          <p className="mt-2 text-sm text-white/60">Messages sent through the contact form on the site, newest first.</p>
        </div>
        <button type="button" onClick={load} disabled={busy} className="inline-flex items-center gap-2 border border-white/20 px-3 py-2 text-xs font-extrabold uppercase hover:border-amber hover:text-amber disabled:opacity-50">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />} Refresh
        </button>
      </div>

      {err && <p className="mt-4 text-sm text-amber">{err}</p>}

      {leads === null && !err ? (
        <p className="mt-10 flex items-center gap-2 text-sm text-white/60">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading...
        </p>
      ) : leads && leads.length === 0 ? (
        <p className="mt-10 border border-dashed border-white/15 p-10 text-center text-sm text-white/50">No messages yet. When someone fills the form on the site, it shows up here.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {leads?.map((l) => {
            const isNew = !!seen && l.at > seen;
            const ChatIcon = l.chatApp === "Discord" ? FaDiscord : l.chatApp === "WhatsApp" ? FaWhatsapp : FaTelegramPlane;
            const chatLabel = l.chatApp === "Telegram" ? `@${l.chat}` : l.chatApp === "WhatsApp" ? `+${l.chat}` : l.chat;
            return (
              <li key={l.id} className={`border bg-navy/60 p-4 sm:p-5 ${isNew ? "border-amber" : "border-white/10"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-black tracking-tight">{l.name}</h3>
                      {isNew && <span className="bg-amber px-1.5 py-0.5 text-[10px] font-extrabold uppercase text-ink">New</span>}
                      {l.company && <span className="text-sm text-white/60">· {l.company}</span>}
                    </div>
                    <p className="mt-0.5 text-xs text-white/45">{fmt(l.at)}</p>
                  </div>
                  <button type="button" onClick={() => remove(l)} className="p-2 text-white/50 hover:text-amber" aria-label="Delete message">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* como responder */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {l.chat &&
                    (l.chatApp !== "Discord" ? (
                      <a href={l.chatApp === "WhatsApp" ? `https://wa.me/${l.chat}` : `https://t.me/${l.chat}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-amber px-3 py-2 text-xs font-extrabold uppercase text-ink hover:bg-amber-2">
                        <ChatIcon className="h-4 w-4" /> {l.chatApp} {chatLabel}
                      </a>
                    ) : (
                      <button type="button" onClick={() => copy(l.chat)} className="inline-flex items-center gap-2 bg-amber px-3 py-2 text-xs font-extrabold uppercase text-ink hover:bg-amber-2" title="Copy username">
                        <ChatIcon className="h-4 w-4" /> Discord {chatLabel} {copied === l.chat ? "· copied!" : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    ))}
                  {l.email && (
                    <a href={`mailto:${l.email}?subject=${encodeURIComponent("BB Agency")}`} className="inline-flex items-center gap-2 border border-amber px-3 py-2 text-xs font-extrabold uppercase text-amber hover:bg-amber hover:text-ink">
                      <Mail className="h-4 w-4" /> {l.email}
                    </a>
                  )}
                </div>

                {l.topics.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {l.topics.map((t) => (
                      <span key={t} className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white/70 ring-1 ring-white/20">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <p className="mt-3 whitespace-pre-wrap border-l-2 border-amber bg-ink/50 p-3 text-sm leading-relaxed text-white/90">{l.message}</p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
