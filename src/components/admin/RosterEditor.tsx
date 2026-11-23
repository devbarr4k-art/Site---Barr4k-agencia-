"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Plus, Search, Trash2, User } from "lucide-react";
import { FaInstagram, FaTwitch, FaYoutube } from "react-icons/fa";
import { SiKick } from "react-icons/si";
import type { Creator } from "@/lib/creators";
import { UploadButton } from "./UploadButton";
import { useConfirm } from "./Confirm";

const LINKS = [
  { key: "twitch", Icon: FaTwitch, ph: "https://twitch.tv/..." },
  { key: "kick", Icon: SiKick, ph: "https://kick.com/..." },
  { key: "youtube", Icon: FaYoutube, ph: "https://youtube.com/@..." },
  { key: "instagram", Icon: FaInstagram, ph: "https://instagram.com/..." },
] as const;

const PER_PAGE = 15;
const field = "w-full min-w-0 border border-white/15 bg-ink px-2.5 py-2 text-sm outline-none focus:border-amber";

/** Lista do popup "See full roster": nome, foto (opcional) e links das redes */
export default function RosterEditor({ list, onChange }: { list: Creator[]; onChange: (list: Creator[]) => void }) {
  const ask = useConfirm();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [note, setNote] = useState("");
  const [addAt, setAddAt] = useState("1");
  const [newAt, setNewAt] = useState(-1);
  const noteTimer = useRef(0);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return list.map((c, i) => ({ c, i })).filter(({ c }) => !s || c.name.toLowerCase().includes(s));
  }, [list, q]);
  const pages = Math.max(1, Math.ceil(shown.length / PER_PAGE));
  const cur = Math.min(page, pages - 1);
  const pageItems = shown.slice(cur * PER_PAGE, (cur + 1) * PER_PAGE);

  const set = (i: number, patch: Partial<Creator>) => onChange(list.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  /** Move o creator da posição i pra posição "to" (0 = primeiro) */
  const moveTo = (i: number, to: number) => {
    const j = Math.max(0, Math.min(list.length - 1, to));
    if (j === i) return;
    const l = [...list];
    const [c] = l.splice(i, 1);
    l.splice(j, 0, c);
    onChange(l);
    flash(`${c.name || "Creator"} moved to position ${j + 1}. Click Save to apply.`);
  };
  // aviso do que mudou (some sozinho depois de uns segundos)
  const flash = (t: string) => {
    setNote(t);
    window.clearTimeout(noteTimer.current);
    noteTimer.current = window.setTimeout(() => setNote(""), 5000);
  };
  /** Adiciona um creator vazio na posição escolhida ("at #") e abre a página onde ele entrou */
  function addCreator() {
    const n = parseInt(addAt, 10);
    const j = Math.max(0, Math.min(list.length, (Number.isFinite(n) ? n : 1) - 1));
    const l = [...list];
    l.splice(j, 0, { name: "" });
    setQ("");
    setPage(Math.floor(j / PER_PAGE));
    setNewAt(j);
    onChange(l);
  }

  return (
    <section>
      <p className="eyebrow text-amber">Creators</p>
      <h2 className="display mt-2 text-4xl">Full roster</h2>
      <p className="mt-2 text-sm text-white/60">
        The list in the &ldquo;See full roster&rdquo; popup ({list.length} creators). Only the name is required; empty links are hidden. No photo = initials.
      </p>

      {/* como mudar a ordem (ele não tinha percebido que o número é editável) */}
      <p className="mt-4 border-l-2 border-amber bg-amber/10 px-3 py-2 text-sm text-white/85">
        <b className="text-amber">Change the order:</b> click the <b>#</b> number of a creator, type the position you want (e.g. 50) and press <b>Enter</b>. Then click <b>Save</b>.
      </p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 items-center gap-2 border border-white/20 bg-ink px-3">
          <Search className="h-4 w-4 text-white/50" />
          <input value={q} onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }} placeholder="Search a creator..." className="w-full bg-transparent py-2.5 text-sm outline-none" />
        </label>
        <div className="flex items-stretch border border-dashed border-white/30">
          <button type="button" onClick={addCreator} className="inline-flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-extrabold uppercase hover:text-amber">
            <Plus className="h-4 w-4" /> Add creator
          </button>
          {/* em qual posição entra o novo */}
          <label className="flex items-center gap-1.5 border-l border-dashed border-white/30 px-3 text-[11px] font-extrabold uppercase text-white/50">
            at #
            <input
              value={addAt}
              inputMode="numeric"
              onChange={(e) => setAddAt(e.target.value.replace(/\D/g, "").slice(0, 4))}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCreator())}
              onFocus={(e) => e.target.select()}
              aria-label="Position of the new creator"
              className="w-12 border border-white/20 bg-ink py-1.5 text-center text-sm text-white outline-none focus:border-amber"
            />
          </label>
        </div>
      </div>

      {note && <p className="mt-3 text-sm font-bold text-amber">{note}</p>}

      <ul className="mt-4 divide-y divide-white/10 border border-white/10 bg-navy/60">
        {pageItems.map(({ c, i }) => (
          <li key={i} className="grid gap-2 p-3 lg:grid-cols-[auto_auto_minmax(0,1.1fr)_repeat(4,minmax(0,1fr))_auto] lg:items-center">
            <div className="flex items-center gap-2 lg:contents">
              {/* posição na lista do site: digita o número e aperta Enter (ou sai do campo) */}
              <PositionInput key={`${i}-${list.length}`} pos={i + 1} max={list.length} onMove={(n) => moveTo(i, n - 1)} />
              <UploadButton
                accept="image/*"
                onDone={(url) => set(i, { photo: url })}
                className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden bg-navy-2 ring-1 ring-white/15 hover:ring-amber"
              >
                {c.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.photo} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <User className="h-4 w-4 text-white/40" />
                )}
              </UploadButton>
              <input
                className={`${field} font-bold ${c.name.trim() ? "" : "border-amber"}`}
                value={c.name}
                maxLength={60}
                placeholder="Name"
                autoFocus={!c.name && i === newAt}
                onChange={(e) => set(i, { name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 lg:contents">
              {LINKS.map(({ key, Icon, ph }) => (
                <label key={key} className="flex items-center gap-1.5">
                  <Icon className={`h-4 w-4 shrink-0 ${c[key] ? "text-white" : "text-white/30"}`} />
                  <input className={field} value={c[key] ?? ""} placeholder={ph} onChange={(e) => set(i, { [key]: e.target.value.trim() || undefined })} />
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-1">
              <button type="button" onClick={() => moveTo(i, i - 1)} disabled={i === 0} className="p-2 text-white/60 hover:text-white disabled:opacity-20" aria-label="Move up">
                <ArrowUp className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => moveTo(i, i + 1)} disabled={i === list.length - 1} className="p-2 text-white/60 hover:text-white disabled:opacity-20" aria-label="Move down">
                <ArrowDown className="h-4 w-4" />
              </button>
              {c.photo && (
                <button type="button" onClick={() => set(i, { photo: undefined })} className="px-2 py-1 text-[10px] font-bold uppercase text-white/50 hover:text-amber">
                  No photo
                </button>
              )}
              <button
                type="button"
                onClick={async () => (await ask(`Remove ${c.name || "this creator"}?`)) && onChange(list.filter((_, j) => j !== i))}
                className="p-2 text-white/60 hover:text-amber"
                aria-label="Remove"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
        {!shown.length && <li className="p-6 text-center text-sm text-white/50">No creator found.</li>}
      </ul>

      {pages > 1 && (
        <nav className="mt-4 flex flex-wrap items-center justify-center gap-1.5" aria-label="Pages">
          <button type="button" onClick={() => setPage(cur - 1)} disabled={cur === 0} className="p-2 text-white/70 hover:text-amber disabled:opacity-20" aria-label="Previous page">
            <ChevronLeft className="h-5 w-5" />
          </button>
          {Array.from({ length: pages }, (_, p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPage(p)}
              className={`h-9 min-w-9 px-2 text-sm font-extrabold ${p === cur ? "bg-amber text-ink" : "border border-white/20 text-white/70 hover:border-amber hover:text-amber"}`}
            >
              {p + 1}
            </button>
          ))}
          <button type="button" onClick={() => setPage(cur + 1)} disabled={cur === pages - 1} className="p-2 text-white/70 hover:text-amber disabled:opacity-20" aria-label="Next page">
            <ChevronRight className="h-5 w-5" />
          </button>
          <span className="ml-2 text-xs text-white/50">
            {cur * PER_PAGE + 1}–{Math.min((cur + 1) * PER_PAGE, shown.length)} of {shown.length}
          </span>
        </nav>
      )}
    </section>
  );
}

/** Número da posição; muda ao apertar Enter ou sair do campo */
function PositionInput({ pos, max, onMove }: { pos: number; max: number; onMove: (n: number) => void }) {
  const [v, setV] = useState(String(pos));
  const commit = () => {
    const n = parseInt(v, 10);
    if (Number.isFinite(n) && n >= 1 && n !== pos) onMove(Math.min(n, max));
    // a linha continua na mesma posição da tela (agora com outro creator), então volta pro número dela
    setV(String(pos));
  };
  return (
    <label className="relative flex h-10 w-14 shrink-0 cursor-text items-center border border-amber/50 bg-ink hover:border-amber has-[:focus]:border-amber has-[:focus]:bg-amber/10">
      <span className="pointer-events-none absolute left-1.5 text-[11px] font-extrabold text-amber">#</span>
    <input
      type="text"
      inputMode="numeric"
      value={v}
      onChange={(e) => setV(e.target.value.replace(/\D/g, "").slice(0, 4))}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), commit())}
      onFocus={(e) => e.target.select()}
      aria-label="Position"
      title="Position: type a number and press Enter to move this creator"
      className="peer h-10 w-full bg-transparent pl-4 pr-1 text-center text-sm font-extrabold tabular-nums text-white outline-none"
    />
    </label>
  );
}
