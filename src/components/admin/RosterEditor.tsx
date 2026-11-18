"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Search, Trash2, User } from "lucide-react";
import { FaInstagram, FaTwitch, FaYoutube } from "react-icons/fa";
import { SiKick } from "react-icons/si";
import type { Creator } from "@/lib/creators";
import { UploadButton } from "./UploadButton";

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
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return list.map((c, i) => ({ c, i })).filter(({ c }) => !s || c.name.toLowerCase().includes(s));
  }, [list, q]);
  const pages = Math.max(1, Math.ceil(shown.length / PER_PAGE));
  const cur = Math.min(page, pages - 1);
  const pageItems = shown.slice(cur * PER_PAGE, (cur + 1) * PER_PAGE);

  const set = (i: number, patch: Partial<Creator>) => onChange(list.map((c, j) => (j === i ? { ...c, ...patch } : c)));

  return (
    <section>
      <p className="eyebrow text-amber">Creators</p>
      <h2 className="display mt-2 text-4xl">Full roster</h2>
      <p className="mt-2 text-sm text-white/60">
        The list in the &ldquo;See full roster&rdquo; popup ({list.length} creators). Only the name is required; empty links are hidden. No photo = initials.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 items-center gap-2 border border-white/20 bg-ink px-3">
          <Search className="h-4 w-4 text-white/50" />
          <input value={q} onChange={(e) => {
              setQ(e.target.value);
              setPage(0);
            }} placeholder="Search a creator..." className="w-full bg-transparent py-2.5 text-sm outline-none" />
        </label>
        <button
          type="button"
          onClick={() => {
            setQ("");
            setPage(0);
            onChange([{ name: "" }, ...list]);
          }}
          className="inline-flex items-center justify-center gap-2 border border-dashed border-white/30 px-4 py-2.5 text-sm font-extrabold uppercase hover:border-amber hover:text-amber"
        >
          <Plus className="h-4 w-4" /> Add creator
        </button>
      </div>

      <ul className="mt-4 divide-y divide-white/10 border border-white/10 bg-navy/60">
        {pageItems.map(({ c, i }) => (
          <li key={i} className="grid gap-2 p-3 lg:grid-cols-[auto_minmax(0,1.1fr)_repeat(4,minmax(0,1fr))_auto] lg:items-center">
            <div className="flex items-center gap-2 lg:contents">
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
                autoFocus={!c.name && i === 0}
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
              {c.photo && (
                <button type="button" onClick={() => set(i, { photo: undefined })} className="px-2 py-1 text-[10px] font-bold uppercase text-white/50 hover:text-amber">
                  No photo
                </button>
              )}
              <button
                type="button"
                onClick={() => confirm(`Remove ${c.name || "this creator"}?`) && onChange(list.filter((_, j) => j !== i))}
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
